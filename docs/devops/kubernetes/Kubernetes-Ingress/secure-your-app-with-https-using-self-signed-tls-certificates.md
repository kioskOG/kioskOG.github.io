---
title: Secure Your App with HTTPS using Self-Signed TLS Certificates
layout: doc-page
parent: Understanding Ingress Controllers
grand_parent: Kubernetes Projects
nav_order: 4.5
permalink: /docs/devops/kubernetes/secure-your-app-with-https-using-self-signed-tls-certificates/
description: Documentation on Secure Your App with HTTPS using Self-Signed TLS Certificates
type: concept
tags:
- devops
- kubernetes
- kubernetes ingress
- ingress
timestamp: '2026-04-17T09:40:40Z'
---

Networking · Kubernetes

# 🔒 NGINX Ingress — Enable HTTPS with Self‑Signed TLS

Generate a self‑signed certificate, create a Kubernetes TLS secret, and configure NGINX Ingress to serve your app over HTTPS. Best for dev/test; use ACME/ACM in prod.

**On this page**

* [Generate a self‑signed certificate](#generate)
* [Create the Kubernetes TLS Secret](#secret)
* [Configure Ingress for TLS](#ingress)
* [Access via HTTPS](#access)
* [Test with `curl`](#curl)
* [Why self‑signed?](#why)

We’ll secure `urlshortner`, already exposed via Ingress, by adding a TLS layer. DNS (Route 53) A record is in place pointing to the Ingress/NLB endpoint.

## Step 1 — Generate Self‑Signed TLS Certificate

Run the following command (valid 365 days):

```
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout tls.key \
  -out tls.crt \
  -subj "/CN=prod.dev.linuxforall.in/O=urlshortner"
```

**tls.crt**  
Self‑signed certificate

**tls.key**  
Private key

## Step 2 — Create a Kubernetes Secret

Create the TLS secret in the `default` namespace:

```
kubectl create secret tls urlshortner-secret \
  --cert=tls.crt \
  --key=tls.key \
  -n default
```

Verify:

```
kubectl get secret urlshortner-secret -n default -o yaml
```

## Step 3 — Create/Update Ingress for TLS

*File:* `nginx-ingress-self-signed-tls-auth.yaml`

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
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - prod.dev.linuxforall.in
      secretName: urlshortner-secret
  rules:
    - host: prod.dev.linuxforall.in
      http:
        paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: ui-svc
              port:
                number: 5000
```

💡

**Note:** Ensure `prod.dev.linuxforall.in` resolves to your Ingress controller’s external IP (Route 53 A record or `/etc/hosts`).

Apply the manifest:

```
kubectl apply -f nginx-ingress-self-signed-tls-auth.yaml
```

## Step 4 — Access the App via HTTPS

Open: <https://prod.dev.linuxforall.in>

Browsers will warn on self‑signed certs (e.g., “Your connection is not private”). You can bypass for dev/test.

## Step 5 — Test with `curl`

HTTP (expect 308 redirect to HTTPS):

```
curl -v http://prod.dev.linuxforall.in -k
```

HTTPS (expect 200 OK; `-k` ignores self‑signed verification):

```
curl -v https://prod.dev.linuxforall.in -k
```

## 🏁 Conclusion — Why Use Self‑Signed TLS?

* Simulate real HTTPS behavior
* Validate TLS configurations
* Secure dev/test environments without external dependencies
* Save cost on cert management for internal tools

[Back to top ↑](#top)
