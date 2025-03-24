---
title: ECS to EKS Migration (POC)
layout: default
parent: Kubernetes Projects
nav_order: 10
permalink: /docs/devops/kubernetes/AWS-ECS-to-EKS-Migration/
description: POC Document for AWS ECS to EKS Migration while ECS is running with CloudMap service for service discovery.
---

# ☸️ ECS to EKS Migration (POC)

## Problem Statement
We are currently running our production environment on AWS ECS with AWS Cloud Map as the service discovery mechanism for these ECS Servces, which creates Route 53 DNS records for service endpoints. The major challenges with this setup are:

1. **Code Modification Requirement:** We do not want developers to manually update their application code to accommodate changes in service endpoints. Modifying code introduces complexity and is a time-consuming process.

2. **Unknown Dependencies:** We lack visibility into which services are consuming these endpoints. Any unintended changes to service endpoints could disrupt business operations.

3. **Scale Challenge:** With around 200 services in production, manually updating applications for service endpoint modifications is impractical and prone to errors.

## Solution Approach
To migrate services from ECS to EKS while maintaining `AWS Cloud Map` service discovery, we propose using **External-DNS** in conjunction with **AWS Cloud Map**. This allows Kubernetes services to register dynamically in Route 53 without requiring changes in application code.

### Key Benefits of this Approach:
- **Zero Code Changes:** No need to modify service endpoints in application code.
- **Automated DNS Management:** Dynamic service discovery via External-DNS and AWS Cloud Map.
- **Minimal Downtime:** Ensures smooth migration with a controlled failover process.
- **Scalability:** Supports seamless scaling without manual intervention.

## Objective
The goal of this Proof of Concept (POC) is to validate the migration process from ECS to EKS while ensuring:
- Seamless DNS transition with minimal downtime.
- No manual changes in service endpoints.
- Dynamic and automated service discovery using External-DNS and AWS Cloud Map.

## Steps Performed

### 1. ECS Cluster Setup
- Created an ECS cluster similar to the production environment.
- Deployed test services using AWS Cloud Map for service discovery.
- Verified that service discovery was functioning as expected.

### 2. EKS Cluster Setup
- Created an Amazon EKS cluster.
- Deployed test services in EKS.
- Configured Kubernetes Ingress for traffic routing.
- Installed and configured **kubernetes-sigs/external-dns** to dynamically manage DNS records.
- OIDC enable for EKS Cluster.

### 3. AWS Cloud Map API Overview
AWS Cloud Map is used to manage DNS records dynamically via API calls:
- `CreatePrivateDnsNamespace` – Creates a DNS hosted zone.
- `CreateService` – Registers a new named service inside a namespace.
- `RegisterInstance/DeregisterInstance` – Updates DNS records dynamically.

```bash
aws servicediscovery create-private-dns-namespace --name "external-dns-test.internal" --vpc "<vpc-ID>" --region <region>

aws servicediscovery list-namespaces --region <region>

aws servicediscovery get-namespace --id "<Namespace-ID>" --region <region>

aws servicediscovery create-service \
      --name eks-nginx \
      --dns-config "NamespaceId="<Namespace-ID>",DnsRecords=[{Type="A",TTL="60"}]" \
      --health-check-custom-config FailureThreshold=1
```

{ : .important }
> Replace the place holders in above commands.

### 4. External-DNS Configuration
To allow Kubernetes to register services in AWS Cloud Map, we created an IAM role with necessary permissions:
- Role Name:- `external-dns`


```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::<ACCOUNT-ID>:oidc-provider/oidc.eks.<REGION>.amazonaws.com/id/<OIDC-ID>"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "oidc.eks.<REGION>.amazonaws.com/id/<OIDC-ID>:aud": "sts.amazonaws.com",
                    "oidc.eks.<REGION>.amazonaws.com/id/<OIDC-ID>:sub": "system:serviceaccount:<Kubernetes_namespace_name>:external-dns"
                }
            }
        }
    ]
}
```


#### IAM Policy for External-DNS

```json
{
 "Version": "2012-10-17",
 "Statement": [
   {
     "Effect": "Allow",
     "Action": [
       "route53:*",
       "servicediscovery:*",
       "ec2:DescribeVpcs",
       "ec2:DescribeRegions"
     ],
     "Resource": [
       "*"
     ]
   }
 ]
}
```


#### External-DNS Deployment in EKS

```yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: external-dns
  namespace: default
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::<ACCOUNT-ID>:role/external-dns
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: external-dns
rules:
- apiGroups: [""]
  resources: ["services","endpoints","pods"]
  verbs: ["get","watch","list"]
- apiGroups: ["extensions","networking.k8s.io"]
  resources: ["ingresses"]
  verbs: ["get","watch","list"]
- apiGroups: [""]
  resources: ["nodes"]
  verbs: ["list","watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: external-dns-viewer
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: external-dns
subjects:
- kind: ServiceAccount
  name: external-dns
  namespace: default
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: external-dns
  name: external-dns
  namespace: default
spec:
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app.kubernetes.io/name: external-dns
  template:
    metadata:
      labels:
        app.kubernetes.io/name: external-dns
    spec:
      serviceAccountName: external-dns
      containers:
        - name: external-dns
          image: registry.k8s.io/external-dns/external-dns:v0.14.0
          env:
            - name: AWS_REGION
              value: ap-south-1  # put your CloudMap NameSpace region
          args:
            - --source=service
            - --source=ingress
            - --provider=aws-sd
            - --domain-filter=external-dns-test.internal  # (optional) Makes ExternalDNS see only the namespaces that match the specified domain. Omit the filter if you want to process all available namespaces.
            - --aws-zone-type=private # Only look at public namespaces. Valid values are public, private, or no value for both)
            - --txt-owner-id=<ACCOUNT-ID>
            - --log-level=debug
```

```bash
kubectl apply -f external-dns -n default
kubectl get sa -n default
kubectl describe sa external-dns -n default
```

{: .note}
> If service account doesn't get annotate the with IAM role. Do it manually using below command
```bash
kubectl annotate serviceaccount external-dns -n default eks.amazonaws.com/role-arn=arn:aws:iam::<ACCOUNT-ID>:role/external-dns
```


```bash
kubectl get po -n default
kubectl get deploy -n default
kubectl logs -f deployment/external-dns -n default # check logs of external-dns deployment
```


### 5. Service Registration in EKS
To register services dynamically in AWS Cloud Map, we added the following annotation in `service.yaml`:

{: .important }
> This Example is via headless service. It will create 2 records 1 for service & 1 for pod. This is just for demonstration purpose. you can remove the pod annotation.
>
> use ingress as below if you wanna use ingress.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  namespace: default
  annotations:
    external-dns.alpha.kubernetes.io/hostname: nginx.external-dns-test.internal
spec:
  clusterIP: None
  #type: ClusterIP
  ports:
  - port: 80
    name: http
    targetPort: 80
  selector:
    app: nginx

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  namespace: default
  annotations:
    external-dns.alpha.kubernetes.io/internal-hostname: nginx-pod.external-dns-test.internal
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx
        name: nginx
        ports:
        - containerPort: 80
          name: http
# ---
# apiVersion: networking.k8s.io/v1
# kind: Ingress
# metadata:
#   annotations:
#     kubernetes.io/ingress.class: nginx
#   name: nginx
#   namespace: default
# spec:
#   rules:
#     - host: nginx.external-dns-test.internal
#       http:
#         paths:
#           - path: /
#             pathType: Prefix
#             backend:
#               service:
#                 name: nginx
#                 port:
#                   number: 80
```

## or use below for service `type: LoadBalancer`.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  annotations:
    external-dns.alpha.kubernetes.io/hostname: nginx.external-dns-test.internal
    external-dns.alpha.kubernetes.io/ttl: 60 # default is 300 seconds
spec:
  type: LoadBalancer
  ports:
  - port: 80
    name: http
    targetPort: 80
  selector:
    app: nginx

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx
        name: nginx
        ports:
        - containerPort: 80
          name: http
```

## Verification
After migration, We confirm that the EKS service is fully operational?

Try below command from a machine within the same vpc.

```bash
nslookup nginx.external-dns-test.internal
```

{: .warning}
> If a service is already registered in cloudmap with the DNS same as you are creating with EKS, ExternalDNS won't create that resource, and you will get the error in `externalDNS` logs because ExternalDNS verify the resource using `--txt-owner-id`.

{: .important}
> The default DNS record TTL (time to live) is 300 seconds. You can customize this value by setting the annotation `external-dns.alpha.kubernetes.io/ttl`

{: .note }
> After one minute check that a corresponding DNS record for your service was created in your hosted zone.


{: .warning}
> [Flags supported by External DNS](https://github.com/kubernetes-sigs/external-dns/blob/master/docs/flags.md)
> [Supported Annotations](https://github.com/kubernetes-sigs/external-dns/blob/e456a456ef97bacb1ca4dd129a038df249f5365f/docs/annotations/annotations.md)

### 6. Migration Process
- **Step 1: Disable Cloud Map in ECS**
  - Manually disabled service discovery in ECS.
  - Waited for 3-5 minutes for ECS to deregister services from Route 53. Usually, it will take 2 minutes.

- **Step 2: Deploy Service in EKS**
  - Applied service manifest with External-DNS annotations.
  - Waited for External-DNS to register the new service in AWS Cloud Map (3-5 minutes).

### 7. Observations
- **Total Downtime:** The total downtime observed was approximately 6-10 minutes during migration.
- **DNS Transition:** External-DNS successfully registered the new service instance in Cloud Map after ECS deregistration.
- **Seamless Migration:** No conflicts observed in the namespace due to sequential deregistration and registration process.

## Conclusion
This POC successfully validated that services can be migrated from ECS to EKS while preserving AWS Cloud Map service discovery. The approach ensures minimal downtime and eliminates the need for application-level changes. Using External-DNS allows Kubernetes to handle service discovery dynamically, making it a scalable and robust solution.


## Clean up
* Delete all service objects before terminating the cluster so all load balancers get cleaned up correctly.
* Give ExternalDNS some time to clean up the DNS records for you. Then delete the remaining service and namespace.

```bash
aws servicediscovery list-services
aws servicediscovery delete-service --id <srv-ID>
aws servicediscovery list-namespaces
aws servicediscovery delete-namespace --id <ns-ID>
```

## Next Steps
- Automate the migration process further using Helm charts and GitOps.
- Implement health checks to minimize downtime.
- Scale the solution for the full production workload.

## References
For more details, refer to the official documentation: [External-DNS AWS Service Discovery](https://github.com/kubernetes-sigs/external-dns).

