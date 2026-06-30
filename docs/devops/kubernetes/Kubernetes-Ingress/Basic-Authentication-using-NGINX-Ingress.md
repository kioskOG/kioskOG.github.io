---
title: Basic Authentication using NGINX Ingress
layout: doc-page
parent: Understanding Ingress Controllers
grand_parent: Kubernetes Projects
nav_order: 3.5
permalink: /docs/devops/kubernetes/Basic-Authentication-using-NGINX-Ingress/
description: Documentation on Basic Authentication using NGINX Ingress
type: concept
tags:
- devops
- kubernetes
- kubernetes ingress
- ingress
timestamp: '2026-04-17T09:40:40Z'
---

# 🔐 NGINX Ingress — Basic Authentication

Secure your Kubernetes services quickly using **Basic Authentication** with NGINX Ingress. This approach is useful for internal tools, staging apps, or quick protection layers.

## 📖 What is Basic Authentication?

Basic Authentication is a simple mechanism where clients send a `username` and `password` with each HTTP request. While not the most secure (especially without HTTPS), it's quick and useful in early-stage deployments or for internal apps.

## ✅ Prerequisites

* A working Kubernetes cluster with **NGINX Ingress Controller** (example: AWS EKS).
* `kubectl` configured to access your cluster.
* `htpasswd` utility installed locally (`apache2-utils` or `httpd-tools`).

## 1️⃣ Create Password File

Generate a password file with `htpasswd`:

```
htpasswd -c auth adminuser
```

You'll be prompted for a password. This creates `auth` with credentials for `adminuser`.

## 2️⃣ Create Kubernetes Secret

Create a secret from the password file:

```
kubectl create secret generic basic-auth --from-file=auth -n default
```

This creates a secret named `basic-auth` in the `default` namespace.

## 3️⃣ Ingress Resource with Basic Auth

Create `nginx-ingress-basic-auth.yaml` manifest:

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
    nginx.ingress.kubernetes.io/auth-type: "basic"
    nginx.ingress.kubernetes.io/auth-secret: "basic-auth"
    nginx.ingress.kubernetes.io/auth-realm: "Authentication Required"
spec:
  ingressClassName: nginx
  rules:
    - http:
        paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: ui-svc
              port:
                number: 5000
```

Apply it:

```
kubectl apply -f nginx-ingress-basic-auth.yaml
```

## 🏁 Conclusion

**Basic Auth** adds a simple authentication layer before users can reach your app. It's great for staging, dev tools, or quick protection, but not a full security solution. Always pair with **HTTPS** for safety in production.
