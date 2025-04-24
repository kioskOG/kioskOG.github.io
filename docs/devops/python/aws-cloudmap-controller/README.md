---
title: EKS Cloudmap controller
layout: home
parent: python
nav_order: 4
permalink: /docs/devops/python/aws-cloudmap-controller/
description: EKS Cloudmap controller
---

# CloudMap Kubernetes Controller

A lightweight Kubernetes controller that integrates Kubernetes **headless services** with **AWS Cloud Map** to enable seamless **service discovery**, compatible with **existing ECS-based architectures**.

## 🚨 Problem Statement

In our current infrastructure, we operate **~200 services** on **Amazon ECS**, utilizing **AWS Cloud Map** for service discovery, which in turn creates Route 53 DNS records for those ECS services.

However, we faced the following operational challenges:

- ❌ **Code Modification Requirement:**
  Developers were expected to manually update service endpoint references in code. This was **time-consuming** and **error-prone**.

- ❓ **Unknown Dependencies:**
  We lacked visibility into which services consumed others via DNS. Accidental changes could **break production workloads**.

- 📈 **Scalability Concerns:**
  With hundreds of services, **manual intervention** became unmanageable and risky.

## ✅ Solution Approach

We decided to **migrate workloads to EKS**, but we wanted to **retain Cloud Map** as the central discovery mechanism. This would ensure **backward compatibility** without requiring any code changes.

### Tried: ExternalDNS
We initially evaluated [`external-dns`](https://github.com/kubernetes-sigs/external-dns), which works well for public domains. However:

- It **requires a resolvable DNS domain name** (e.g., `abc.example.com`)
- In our case, Cloud Map used namespaces like `test-namespace` (i.e., not tied to a public domain)
- As a result, `external-dns` **could not find the namespace** and **skipped registration**

---

## 🛠️ What This Controller Does

This custom controller addresses the above challenges by:

- ✅ Automatically registering **headless services** in AWS Cloud Map
- ✅ Preserving service **hostnames** as-is (`nginx-service` in `test-namespace`)
- ✅ Supporting **cross-namespace service discovery**
- ✅ Handling **replica scaling events** (Pod IPs update automatically)
- ✅ Cleaning up **stale IPs** when pods go offline
- ✅ Performing **drift detection** every 60s to re-sync any Cloud Map inconsistencies
- ✅ Stale IP cleanup
- ✅ Performing **Conflict resolution** (multiple services claiming same DNS name)

---

## 🔧 How It Works

1. You create a Kubernetes **headless service** (ClusterIP: None) with annotations:

```yaml
annotations:
  cloudmap.controller/namespace: "test-namespace"
  cloudmap.controller/hostname: "nginx-service"
```

2. The controller watches for:
   - `Service` creation/deletion events
   - `Endpoints` events to track pod IPs

3. For each matching service:
   - Creates a Cloud Map service (if it doesn't exist)
   - Registers all pod IPs as `AWS_INSTANCE_IPV4` records
   - Performs **drift reconciliation** periodically (re-registers deleted records)

4. Deletion of services automatically:
   - De-registers Cloud Map records
   - Releases domain ownership tracking

---

## 📦 Features Summary

| Feature                                 | Status |
|-----------------------------------------|--------|
| 🔍 Annotation-based config              | ✅     |
| 🧠 Headless service support             | ✅     |
| 🌐 Cross-namespace compatibility        | ✅     |
| 🚀 Replica count changes tracked        | ✅     |
| 🔁 Drift detection + re-registration    | ✅     |
| ✅ Selective de-registration            | ✅     |
| ☸️ Pod lifecycle aware                  | ✅     |
| 🧼 Safe domain conflict detection       | ✅     |
| 🛡 Compatible with ECS Cloud Map names  | ✅     |

---

## 🚀 Getting Started

## 📦 Project Structure

```bash
controller/
├── cloudmap.py         # Cloud Map integration logic (register/deregister, drift sync)
├── k8s_watcher.py      # Watches Kubernetes services/endpoints, triggers Cloud Map updates
example                 # Example deployment manifest files
main.py                 # Entry point to start the controller
Dockerfile              # Multi-stage build for production-ready container
```

{: .important}
> [EKS Cloudmap Controller Repo](https://github.com/kioskOG/EKS-cloudmap-controller)
>

---

## ☸️ How to Deploy the Controller on Kubernetes

### 1. Build and Push Docker Image

```bash
docker build -t <your-dockerhub>/cloudmap-controller:latest .
docker push <your-dockerhub>/cloudmap-controller:latest
```

### 2. Create Kubernetes Resources

#### Namespace
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: kube-system
```

## 🔐 IAM Permissions Required

To run this controller in AWS EKS, ensure the pod role or IRSA has these permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "route53:GetHostedZone",
                "route53:ListHostedZonesByName",
                "route53:CreateHostedZone",
                "route53:DeleteHostedZone",
                "route53:ChangeResourceRecordSets",
                "route53:CreateHealthCheck",
                "route53:GetHealthCheck",
                "route53:DeleteHealthCheck",
                "route53:UpdateHealthCheck",
                "ec2:DescribeVpcs",
                "ec2:DescribeRegions",
                "servicediscovery:*"
            ],
            "Effect": "Allow",
            "Resource": [
                "*"
            ]
        }
    ]
}
```
---

#### Service Account & RBAC

> IAM Role Trusted entities Policy

```yaml
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::<aws_accound_id>:oidc-provider/oidc.eks.ap-south-1.amazonaws.com/id/<oidc_id>"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "oidc.eks.<region>.amazonaws.com/id/<oidc_id>:sub": [
                        "system:serviceaccount:kube-system:cloudmap-controller"
                    ],
                    "oidc.eks.ap-south-1.amazonaws.com/id/<oidc_id>:aud": "sts.amazonaws.com"
                }
            }
        }
    ]
}
```

```yaml
kubectl get sa cloudmap-controller -n kube-system -oyaml
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::<aws_accound_id>:role/<IAM_role_name>
  name: cloudmap-controller
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cloudmap-controller-role
rules:
  - apiGroups: [""]
    resources: ["services", "endpoints"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["events.k8s.io"]
    resources: ["events"]
    verbs: ["create", "patch", "update"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cloudmap-controller-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cloudmap-controller-role
subjects:
  - kind: ServiceAccount
    name: cloudmap-controller
    namespace: kube-system
```

#### Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloudmap-controller
  namespace: kube-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cloudmap-controller
  template:
    metadata:
      labels:
        app: cloudmap-controller
    spec:
      serviceAccountName: cloudmap-controller
      containers:
        - name: controller
          image: <your-dockerhub>/cloudmap-controller:latest
          imagePullPolicy: Always
```

---

## 🧪 Example Test Service Manifest

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-ecs-service
  namespace: default
  annotations:
    cloudmap.controller/namespace: "test-namespace"
    cloudmap.controller/hostname: "nginx-ecs-service"
spec:
  clusterIP: None
  selector:
    app: nginx
  ports:
    - name: http
      port: 80
      targetPort: 80
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
```

---

## 📊 Observability

This controller emits Kubernetes `Events` that can be viewed via:
```bash
kubectl get events -n <namespace>

# controller logs
kubectl logs deploy/cloudmap-controller -n kube-system -f
```

Example:
- `Registered 172.16.10.45 to nginx-service`
- `Deregistered stale IP 172.16.12.110 from nginx-service`
- `DomainConflict: nginx-service already claimed by other service`

---

## 📜 License

Apache 2.0 License.

---

## 🙌 Contributions

PRs welcome! This is a focused solution but extensible for health checks, weighted routing, TTLs, and more.

---

## 🧠 Inspired By

- AWS Cloud Map
- Kubernetes ExternalDNS
- Service Mesh-less discovery

