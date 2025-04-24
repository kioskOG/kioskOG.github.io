import time
import threading
import logging
import datetime
from kubernetes import client, config, watch
from kubernetes.client.rest import ApiException
from kubernetes.client import EventsV1Api
from kubernetes.client.models import V1ObjectMeta, EventsV1Event
from controller import cloudmap

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("controller.k8s_watcher")

REQUIRED_ANNOTATIONS = [
    "cloudmap.controller/hostname",
    "cloudmap.controller/namespace"
]

def get_annotation(service, key, default=None):
    return service.metadata.annotations.get(key, default)

def is_annotated(service):
    return service.metadata.annotations and all(
        key in service.metadata.annotations for key in REQUIRED_ANNOTATIONS
    )

def is_headless(service):
    return service.spec.cluster_ip == "None"

def emit_event(service, reason, message, event_type="Normal"):
    events_api = EventsV1Api()
    event = EventsV1Event(
        metadata=V1ObjectMeta(
            generate_name=f"cloudmap-{service.metadata.name}-",
            namespace=service.metadata.namespace
        ),
        reason=reason,
        note=message,
        type=event_type,
        action="CloudMapSync",
        event_time=datetime.datetime.utcnow().isoformat() + "Z",
        reporting_controller="cloudmap-controller",
        reporting_instance="controller-1"
    )
    try:
        events_api.create_namespaced_event(namespace=service.metadata.namespace, body=event)
    except Exception as e:
        logger.warning(f"Failed to emit event for {service.metadata.name}: {e}")

def register_service_endpoints(service, endpoints):
    annotations = service.metadata.annotations
    hostname = annotations["cloudmap.controller/hostname"]
    cloudmap_namespace = annotations["cloudmap.controller/namespace"]
    service_key = f"{service.metadata.namespace}/{service.metadata.name}"

    if not cloudmap.claim_domain(hostname, service_key):
        msg = f"DNS conflict: {hostname} already claimed"
        logger.warning(f"Skipping service {service_key} - {msg}")
        emit_event(service, "DomainConflict", msg, "Warning")
        return

    registered_ips = cloudmap.get_registered_ips(cloudmap_namespace, hostname)
    current_ips = set()

    # for subset in endpoints.subsets or []:
    #     for address in subset.addresses or []:
    #         ip = address.ip
    #         current_ips.add(ip)
    #         if cloudmap.should_update(ip, registered_ips):
    #             cloudmap.register_instance(cloudmap_namespace, hostname, ip)
    #             emit_event(service, "IPRegistered", f"Registered {ip} to {hostname}")

    # for ip in registered_ips:
    #     if ip not in current_ips:
    #         cloudmap.deregister_instance(cloudmap_namespace, hostname, ip)
    #         emit_event(service, "IPRemoved", f"Deregistered stale IP {ip} from {hostname}")
    for subset in endpoints.subsets or []:
        for address in subset.addresses or []:
            ip = address.ip
            current_ips.add(ip)
            if cloudmap.should_update(ip, registered_ips):
                cloudmap.register_instance(cloudmap_namespace, hostname, ip)
                emit_event(service, "IPRegistered", f"Registered {ip} to {hostname}")

    for ip in registered_ips:
        if ip not in current_ips:
            logger.info(f"Skipping deregistration of IP {ip} not owned by {service_key}")
            # Do not deregister unless the current service owns the domain
            if cloudmap.DOMAIN_OWNERSHIP.get(hostname) == service_key:
                cloudmap.deregister_instance(cloudmap_namespace, hostname, ip)
                emit_event(service, "IPRemoved", f"Deregistered stale IP {ip} from {hostname}")

    # Track expected state for periodic drift detection
    cloudmap.track_expected(
        cloudmap_namespace,
        service.metadata.name,
        hostname,
        list(current_ips)
    )

# def deregister_service(service):
#     annotations = service.metadata.annotations
#     hostname = annotations.get("cloudmap.controller/hostname")
#     cloudmap_namespace = annotations.get("cloudmap.controller/namespace")

#     if hostname and cloudmap_namespace:
#         logger.info(f"Deregistering all instances of service {service.metadata.name} from CloudMap")
#         cloudmap.deregister_all_instances(cloudmap_namespace, hostname)
#         cloudmap.release_domain(hostname, f"{service.metadata.namespace}/{service.metadata.name}")
#         emit_event(service, "ServiceDeleted", f"Deregistered all IPs from {hostname}")

def deregister_service(service):
    annotations = service.metadata.annotations
    hostname = annotations.get("cloudmap.controller/hostname")
    cloudmap_namespace = annotations.get("cloudmap.controller/namespace")

    if hostname and cloudmap_namespace:
        service_key = f"{service.metadata.namespace}/{service.metadata.name}"
        if cloudmap.DOMAIN_OWNERSHIP.get(hostname) != service_key:
            logger.info(f"Skipping deregistration: {hostname} not owned by {service_key}")
            return
        logger.info(f"Deregistering all instances of service {service.metadata.name} from CloudMap")
        cloudmap.deregister_all_instances(cloudmap_namespace, hostname)
        cloudmap.release_domain(hostname, service_key)
        emit_event(service, "ServiceDeleted", f"Deregistered all IPs from {hostname}")

def watch_services():
    v1 = client.CoreV1Api()
    w = watch.Watch()
    for event in w.stream(v1.list_service_for_all_namespaces):
        svc = event["object"]
        event_type = event["type"]
        if not is_annotated(svc):
            continue
        if not is_headless(svc):
            continue

        logger.info(f"Event {event_type} for service {svc.metadata.name} in namespace {svc.metadata.namespace}")
        if event_type == "DELETED":
            try:
                deregister_service(svc)
            except Exception as e:
                logger.error(f"Error deregistering service {svc.metadata.name}: {e}")

def watch_endpoints():
    v1 = client.CoreV1Api()
    w = watch.Watch()
    for event in w.stream(v1.list_endpoints_for_all_namespaces):
        ep = event["object"]
        event_type = event["type"]
        service_name = ep.metadata.name
        namespace = ep.metadata.namespace
        logger.info(f"Event {event_type} on Endpoints {service_name} in {namespace}")
        try:
            svc = v1.read_namespaced_service(name=service_name, namespace=namespace)
            if not is_annotated(svc):
                continue
            if not is_headless(svc):
                continue
            logger.info(f"Syncing endpoints for service {service_name}")
            register_service_endpoints(svc, ep)
        except ApiException as e:
            if e.status == 404:
                logger.warning(f"Service {service_name} in {namespace} not found.")
            else:
                logger.error(f"Error syncing service {service_name}: {e}")

def start():
    config.load_incluster_config()
    logger.info("Starting Kubernetes service watcher...")

    threading.Thread(target=watch_services, daemon=True).start()
    threading.Thread(target=watch_endpoints, daemon=True).start()

    while True:
        time.sleep(300)
