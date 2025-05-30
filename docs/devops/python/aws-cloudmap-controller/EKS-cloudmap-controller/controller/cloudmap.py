import boto3
import logging
from botocore.exceptions import ClientError
from botocore.config import Config
import time
import threading
from kubernetes import client, config
from kubernetes.client.rest import ApiException

logger = logging.getLogger("controller.cloudmap")

REGION = "ap-south-1"
CONFIG = Config(connect_timeout=3, read_timeout=5, retries={'max_attempts': 3})
cloudmap_client = boto3.client("servicediscovery", region_name=REGION, config=CONFIG)

CREATOR_TAG = {"CreatedBy": "cloudmap-controller"}
DOMAIN_OWNERSHIP = {}
SYNC_INTERVAL = 60  # seconds

SERVICE_CACHE = {}  # {(k8s_namespace, service): (cloudmap_namespace, hostname, set_of_expected_ips)}

# Load Kubernetes config
try:
    config.load_incluster_config()
except config.ConfigException:
    config.load_kube_config()

def retry_with_backoff(func, *args, max_retries=5, initial_delay=0.5, **kwargs):
    for attempt in range(max_retries):
        try:
            return func(*args, **kwargs)
        except ClientError as e:
            if e.response['Error']['Code'] == 'ThrottlingException' and attempt < max_retries - 1:
                delay = initial_delay * (2 ** attempt)
                logger.warning(f"ThrottlingException caught. Retrying in {delay:.2f}s...")
                time.sleep(delay)
            else:
                raise

def get_namespace_id(name):
    namespaces = retry_with_backoff(cloudmap_client.list_namespaces)["Namespaces"]
    for ns in namespaces:
        if ns["Name"] == name:
            return ns["Id"]
    raise Exception(f"CloudMap namespace {name} not found")

def get_service_id(namespace_id, service_name):
    paginator = cloudmap_client.get_paginator("list_services")
    for page in paginator.paginate(Filters=[{
        'Name': 'NAMESPACE_ID',
        'Values': [namespace_id],
        'Condition': 'EQ'
    }]):
        for service in page["Services"]:
            if service["Name"] == service_name:
                return service["Id"], service
    return None, None

def is_managed_service(service):
    if not service:
        return False
    try:
        tags = retry_with_backoff(cloudmap_client.list_tags_for_resource, ResourceARN=service["Arn"])['Tags']
        tag_map = {t['Key']: t['Value'] for t in tags}
        return tag_map.get("CreatedBy") == "cloudmap-controller"
    except ClientError:
        return False

def get_or_create_service(namespace_name, service_name, ttl=60):
    namespace_id = get_namespace_id(namespace_name)
    service_id, service_obj = get_service_id(namespace_id, service_name)

    if service_id:
        logger.info(f"Using existing CloudMap service {service_name}")
        return service_id

    logger.info(f"Creating CloudMap service {service_name} with TTL={ttl}")
    try:
        response = cloudmap_client.create_service(
            Name=service_name,
            NamespaceId=namespace_id,
            DnsConfig={
                'NamespaceId': namespace_id,
                'DnsRecords': [{
                    'Type': 'A',
                    'TTL': ttl
                }],
                'RoutingPolicy': 'MULTIVALUE'
            },
            Tags=[{"Key": k, "Value": v} for k, v in CREATOR_TAG.items()]
        )
        return response["Service"]["Id"]
    except ClientError as e:
        if e.response['Error']['Code'] == 'ServiceAlreadyExists':
            existing_id, _ = get_service_id(namespace_id, service_name)
            return existing_id
        raise

def list_instances(service_id):
    response = cloudmap_client.list_instances(ServiceId=service_id)
    return {
        inst["Attributes"]["AWS_INSTANCE_IPV4"]: inst["Id"]
        for inst in response.get("Instances", [])
    }

def get_registered_ips(namespace_name, service_name):
    service_id = get_or_create_service(namespace_name, service_name)
    return list_instances(service_id)

def register_instance(namespace_name, service_name, ip, ttl=60):
    service_id = get_or_create_service(namespace_name, service_name, ttl=ttl)
    instance_id = ip.replace(".", "-")
    logger.info(f"Registering IP {ip} in CloudMap service {service_name}")
    try:
        cloudmap_client.register_instance(
            ServiceId=service_id,
            InstanceId=instance_id,
            Attributes={"AWS_INSTANCE_IPV4": ip},
            CreatorRequestId=instance_id
        )
    except ClientError as e:
        logger.error(f"Failed to register instance {ip}: {e}")

def deregister_instance(namespace_name, service_name, ip):
    service_id = get_or_create_service(namespace_name, service_name)
    instance_id = ip.replace(".", "-")
    try:
        cloudmap_client.deregister_instance(ServiceId=service_id, InstanceId=instance_id)
        logger.info(f"Deregistered instance {ip} from service {service_name}")
    except ClientError as e:
        logger.warning(f"Failed to deregister {ip}: {e}")

def deregister_all_instances(namespace_name, service_name, caller=None):
    registered = get_registered_ips(namespace_name, service_name)
    for ip in registered:
        deregister_instance(namespace_name, service_name, ip)

def should_update(ip, existing_ips):
    return ip not in existing_ips

def claim_domain(domain, owner):
    if domain in DOMAIN_OWNERSHIP and DOMAIN_OWNERSHIP[domain] != owner:
        logger.warning(f"Conflict: domain {domain} already claimed by {DOMAIN_OWNERSHIP[domain]}")
        return False
    DOMAIN_OWNERSHIP[domain] = owner
    return True

def release_domain(domain, owner):
    if domain in DOMAIN_OWNERSHIP and DOMAIN_OWNERSHIP[domain] == owner:
        logger.info(f"Releasing claim on domain {domain} for {owner}")
        del DOMAIN_OWNERSHIP[domain]

# def track_expected(namespace, service, hostname, ips):
#     SERVICE_CACHE[(namespace, service)] = (namespace, hostname, set(ips))
def track_expected(k8s_ns, service, cloudmap_ns, hostname, ips):
    SERVICE_CACHE[(k8s_ns, service)] = (cloudmap_ns, hostname, set(ips))


def update_expected_ips():
    k8s = client.CoreV1Api()
    for (k8s_ns, svc), (cloudmap_ns, hostname, _) in SERVICE_CACHE.items():
        try:
            eps = k8s.read_namespaced_endpoints(name=svc, namespace=k8s_ns)
            ips = []
            for subset in eps.subsets or []:
                for addr in subset.addresses or []:
                    if addr.ip:
                        ips.append(addr.ip)
            SERVICE_CACHE[(k8s_ns, svc)] = (cloudmap_ns, hostname, set(ips))
        except ApiException as e:
            logger.warning(f"Failed to update expected IPs for {svc} in {k8s_ns}: {e}")

def initialize_service_cache():
    k8s = client.CoreV1Api()
    try:
        services = k8s.list_service_for_all_namespaces().items
        for svc in services:
            k8s_ns = svc.metadata.namespace
            name = svc.metadata.name
            annotations = svc.metadata.annotations or {}
            hostname = annotations.get("cloudmap.controller/hostname")
            cloudmap_ns = annotations.get("cloudmap.controller/namespace", k8s_ns)
            if not hostname:
                continue
            try:
                eps = k8s.read_namespaced_endpoints(name=name, namespace=k8s_ns)
                ips = []
                for subset in eps.subsets or []:
                    for addr in subset.addresses or []:
                        if addr.ip:
                            ips.append(addr.ip)
                if ips:
                    SERVICE_CACHE[(k8s_ns, name)] = (cloudmap_ns, hostname, set(ips))
            except ApiException as e:
                logger.warning(f"Could not read endpoints for {name} in {k8s_ns}: {e}")
    except Exception as e:
        logger.error(f"Failed to initialize service cache: {e}")

def periodic_sync():
    while True:
        time.sleep(SYNC_INTERVAL)
        logger.info("Running periodic CloudMap drift sync")
        update_expected_ips()
        for (k8s_ns, svc), (cloudmap_ns, hostname, expected_ips) in list(SERVICE_CACHE.items()):
            try:
                k8s = client.CoreV1Api()
                try:
                    k8s.read_namespaced_service(name=svc, namespace=k8s_ns)
                except ApiException as e:
                    if e.status == 404:
                        logger.info(f"Skipping drift sync for deleted service {svc} in {k8s_ns}")
                        continue
                    raise

                actual_ips = set(get_registered_ips(cloudmap_ns, hostname).keys())
                missing = expected_ips - actual_ips
                extra = actual_ips - expected_ips
                for ip in missing:
                    logger.warning(f"Drift detected: {ip} missing in {hostname}, re-registering")
                    register_instance(cloudmap_ns, hostname, ip)
                for ip in extra:
                    logger.warning(f"Drift detected: {ip} not expected in {hostname}, de-registering")
                    deregister_instance(cloudmap_ns, hostname, ip)
            except Exception as e:
                logger.error(f"Drift check failed for {hostname}: {e}")

def start_sync_loop():
    initialize_service_cache()
    thread = threading.Thread(target=periodic_sync, daemon=True)
    thread.start()
