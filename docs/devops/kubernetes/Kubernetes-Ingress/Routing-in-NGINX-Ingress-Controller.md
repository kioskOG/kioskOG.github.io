---
title: Routing in NGINX Ingress Controller
layout: doc-page
parent: Understanding Ingress Controllers
parent_url: /docs/devops/kubernetes/Understanding-Ingress-Controllers/
grand_parent: Kubernetes Projects
grand_parent_url: /docs/devops/kubernetes/
nav_order: 2
permalink: /docs/devops/kubernetes/Routing-in-NGINX-Ingress-Controller/
description: Documentation on Routing in NGINX Ingress Controller
type: concept
tags:
- devops
- kubernetes
- kubernetes ingress
- ingress
timestamp: '2026-04-17T09:40:40Z'
---

Networking · Kubernetes

# 🧭 NGINX Ingress Routing (urlshortner) — Practical Examples

Explore routing with NGINX Ingress on EKS: basic, path, host, wildcard, regex, and canary. Includes copy‑paste manifests and Route 53 tips.

**On this page**

* [What is NGINX Ingress routing?](#intro)
* [Deploy the apps](#deploy)
* [1) Basic Routing](#basic)
* [2) Path‑Based Routing](#path)
* [3) Host‑Based Routing](#host)
* [4) Wildcard Routing](#wildcard)
* [5) Regex‑Based Routing](#regex)
* [6) Canary Routing](#canary)
* [Conclusion](#end)

## What is NGINX Ingress routing?

NGINX Ingress sits at the cluster edge and routes HTTP/HTTPS traffic to Services based on *path*, *host*, *headers*, or other conditions. It consolidates access behind one IP/DNS, enables TLS termination, and supports strategies like canaries and authentication.

**App code:** [urlshortner](Application/application)

## Deploy the app components

📝

**Note:** You can deploy via `kubectl apply` or Helm. Both sets of resources exist in the repo.

```
kubectl apply -f Application/application/auth/manifests/prod
kubectl apply -f Application/application/report/manifests/prod
kubectl apply -f Application/application/ui/manifests/prod
kubectl apply -f Application/application/url_short/manifests/prod
```

Verify Services and Pods (all Services expose `targetPort: 5000`):

```
kubectl get svc,pod -n default
```

## 1) Basic Routing

All requests go to a single backend — ideal for a single web app or common landing UI.

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: urlshortner-ingress
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
            name: flask-uiapp
            port:
              number: 5000
```

```
kubectl apply -f nginx-ingress-basic-routing.yaml
kubectl get ingress -n default
# NAME                 CLASS  HOSTS  ADDRESS                                     PORTS AGE
# urlshortner-ingress  nginx  *      a602f...elb.ap-southeast-1.amazonaws.com    80    57s
```

Access: `http://<NLB-DNS>/`

## 2) Path‑Based Routing

Route different URL paths to different Services under the same domain — great for microservices sharing a single entrypoint.

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: urlshortner-ingress
  namespace: default
  labels:
    app: urlshortner
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
            name: flask-uiapp
            port:
              number: 5000
      - path: /r/
        pathType: Prefix
        backend:
          service:
            name: flask-shorturlapp
            port:
              number: 5000
```

```
kubectl apply -f nginx-ingress-path-based-routing.yaml
kubectl get ingress -n default
```

## 3) Host‑Based Routing

Make routing decisions by `Host` header. Perfect when serving multiple apps on separate subdomains.

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: urlshortner-ingress
  namespace: default
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: app1.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: flask-uiapp
            port:
              number: 5000
  - host: app2.example.com
    http:
      paths:
      - path: /r/
        pathType: Prefix
        backend:
          service:
            name: flask-shorturlapp
            port:
              number: 5000
```

🌐

Add **A** records in Route 53 for `app1.example.com` and `app2.example.com` → your NLB.

```
kubectl apply -f nginx-ingress-host-based-routing.yaml
kubectl get ingress -n default
```

## 4) Wildcard Routing

Match many subdomains with `*.example.com` — useful for multi‑tenant patterns like `user1.example.com`.

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: urlshortner-ingress
  namespace: default
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: *.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: flask-uiapp
            port:
              number: 5000
```

🌐

Create a wildcard **A** record in Route 53 for `*.example.com` → your NLB.

```
kubectl apply -f nginx-ingress-wildcard-routing.yaml
kubectl get ingress -n default
```

Access: `http://anything.example.com`

## 5) Regex‑Based Routing

Use regex paths when URL structures are complex or optional. Requires `use-regex: "true"` and appropriate `pathType`.

⚠️

**Note:** Example only — adapt to your app’s paths before use.

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-ui-svc
  namespace: default
  labels:
    app: ui
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  ingressClassName: nginx
  rules:
  - http:
      paths:
      - path: /app1(/|$)(.*)
        pathType: ImplementationSpecific
        backend:
          service:
            name: flask-uiapp
            port:
              number: 5000
      - path: /app2(/|$)(.*)
        pathType: ImplementationSpecific
        backend:
          service:
            name: flask-shorturlapp
            port:
              number: 5000
```

```
kubectl apply -f nginx-ingress-regex-based-routing.yaml
kubectl get ingress -n default
```

## 6) Canary Routing

Split a percentage of traffic to a canary Service for safe, progressive delivery.

### Stable

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: urlshortner-ingress
  namespace: default
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: flask-uiapp-1
            port:
              number: 5000
```

### Canary (20%)

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: urlshortner-ingress
  namespace: default
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "20"
spec:
  ingressClassName: nginx
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: flask-uiapp-2
            port:
              number: 5000
```

🌐

Add an **A** record in Route 53 for `example.com` → your NLB, then browse `http://example.com` and refresh to observe split traffic.

```
kubectl apply -f nginx-ingress-canary-based-stable-version.yaml
kubectl apply -f nginx-ingress-canary-based-canary-version.yaml
kubectl get ingress -A
```

## Conclusion

We walked through the major NGINX Ingress routing strategies — from basic and path/host rules to wildcard, regex, and canaries — using EKS patterns and Route 53 for DNS. Mastering these gives you fine‑grained, production‑ready traffic control for microservices.

[Back to top ↑](#top)
