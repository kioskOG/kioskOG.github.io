---
title: Installing NGINX Ingress
layout: doc-page
parent: Understanding Ingress Controllers
grand_parent: Kubernetes Projects
ancestor: Kubernetes Projects
nav_order: 1.5
permalink: /docs/devops/kubernetes/Installing-NGINX-Ingress/
description: Documentation on Installing NGINX Ingress
---

Kubernetes · Ingress

# NGINX Ingress on EKS with an AWS NLB

Hands‑on install with Helm, exposing the controller to the internet via an AWS **Network Load Balancer** (NLB).

## Why NGINX Ingress?

The **NGINX Ingress Controller** is widely adopted and community‑maintained. It supports everything from basic path routing to advanced features like
*rate limiting*, *TLS termination*, and *authentication*.

## Step 0 — Default Behavior: Classic Load Balancer

By default, installing the controller with `service.type=LoadBalancer` on AWS provisions a **Classic Load Balancer (CLB)**:

```
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.service.type=LoadBalancer
```

💡**Production tip:** Prefer an **NLB** for performance, IP targeting, and TLS passthrough.

## Step 1 — Install NGINX Ingress with an NLB

Instruct AWS to create a **Network Load Balancer** by adding the service annotation:

```
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.service.type=LoadBalancer \
  --set controller.metrics.enabled=true \
  --set-string controller.metrics.service.annotations."prometheus\.io/port"="10254" \
  --set-string controller.metrics.service.annotations."prometheus\.io/scrape"="true" \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-type"="nlb"
```

### Sample Output

```
NAME: ingress-nginx
LAST DEPLOYED: Sun Aug  3 22:38:43 2025
NAMESPACE: ingress-nginx
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
The ingress-nginx controller has been installed.
It may take a few minutes for the load balancer IP to be available.
You can watch the status by running 'kubectl get service --namespace ingress-nginx ingress-nginx-controller --output wide --watch'
```

This installs the controller in `ingress-nginx`, exposes it as a `LoadBalancer`, and tells AWS to provision an **NLB** instead of a CLB.
In public subnets, the NLB will get an external DNS name:

```
$ kubectl get service --ns ingress-nginx ingress-nginx-controller
NAME                       TYPE           CLUSTER-IP      EXTERNAL-IP                                                PORT(S)                      AGE
ingress-nginx-controller   LoadBalancer   172.20.72.145   ad7549...elb.ap-southeast-1.amazonaws.com   80:30209/TCP,443:30549/TCP   4m33s
```

## Step 2 — Sample App (Deployment & Service)

Apply a basic app to route traffic to. Example **otel-python-app**:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: otel-python-app
  namespace: default
  labels:
    app.kubernetes.io/name: otel-python-app
    app.kubernetes.io/instance: otel-python-app-instance
    app.kubernetes.io/version: "1.0.0"
spec:
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: otel-python-app
  template:
    metadata:
      labels:
        app.kubernetes.io/name: otel-python-app
        app.kubernetes.io/instance: otel-python-app-instance
        app.kubernetes.io/version: "1.0.0"
    spec:
      containers:
      - name: otel-python-app-container
        image: jatin560/tempo-traces-flask-app:v5
        ports:
        - containerPort: 8080
          name: http
        readinessProbe:
          httpGet:
            path: /
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 10
          failureThreshold: 3
---
kind: Service
apiVersion: v1
metadata:
  name: otel-python-app
spec:
  selector:
    app: otel-python-app
  ports:
  - protocol: TCP
    port: 8080
    targetPort: 8080
```

### Verify

```
$ kubectl get all -n simple-nodejs-app
NAME                                 READY   STATUS    RESTARTS   AGE
pod/otel-python-app-...              1/1     Running   0          2m
...
NAME                    TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
service/otel-python-app ClusterIP   172.20.41.147   <none>        80/TCP    2m
...
deployment.apps/otel-python-app  5/5   5   5   2m1s
```

## Step 3 — Create an Ingress Resource

Route traffic from the NLB → NGINX → your Service:

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: otel-python-app-ingress
  namespace: default
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: otel-python-app
            port:
              number: 8080
```

📝

**Note:** For testing, you can use the *NLB DNS name* as the host, or map your own domain in Route 53.

⚠️

**Important:** `nginx.ingress.kubernetes.io/rewrite-target: /` rewrites the request URI correctly for the backend.

```
$ kubectl get ingress -n default
```

## Step 4 — Access the App

Confirm end‑to‑end traffic flow:

```
http://<HOST-NAME>
```

### End‑to‑end flow

```
Client → NLB → NGINX Ingress → Kubernetes Service → Application Pod
```

## References

* GitHub Repo: [chinmayto/kubernetes-ingress-nginx](https://github.com/chinmayto/kubernetes-ingress-nginx)
* AWS Blog: [Exposing Kubernetes applications – part 3](https://aws.amazon.com/blogs/containers/exposing-kubernetes-applications-part-3-nginx-ingress-controller/)
