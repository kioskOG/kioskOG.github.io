---
title: Routing in NGINX Ingress Controller
layout: default
parent: Understanding Ingress Controllers
grand_parent: Kubernetes Projects
nav_order: 2.5
permalink: /docs/devops/kubernetes/Routing-in-NGINX-Ingress-Controller/
description: Documentation on Routing in NGINX Ingress Controller
---

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>NGINX Ingress Routing Examples (urlshortner) — EKS</title>
  <meta name="description" content="Hands‑on routing patterns with NGINX Ingress Controller on EKS: basic, path, host, wildcard, regex, and canary using a urlshortner app." />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
  <style>
    /* === Theme aligned to your site (same color coding) === */
    :root {
      --primary-color: #ffb347;           /* main accent */
      --light-primary-shade: #ffd97d;     /* lighter accent */
      --bg-dark: #070708;                 /* page bg */
      --panel: rgba(25,25,34,0.6);        /* hero/panel tint */
      --card-bg-dark: rgba(25,25,34,0.7); /* cards */
      --section-bg-dark: rgba(25,25,34,0.6);
      --text-dark: #e0e0e0;               /* text */
      --muted: #a7a7a7;                   /* subtle text */
      --accent-purple: #9c27b0;           /* secondary */
      --accent-pink: #ff0080;             /* secondary */
      --border: rgba(156,39,176,0.28);    /* subtle purple border */
      --code-bg-dark: rgba(13,13,16,0.7); /* code blocks */
    }

    html, body { height: 100%; }
    body {
      margin: 0;
      background-color: var(--bg-dark);
      background-image: radial-gradient(circle at top left, #2f0a5d 0%, transparent 50%),
                        radial-gradient(circle at bottom right, #004d40 0%, transparent 50%);
      background-blend-mode: screen;
      color: var(--text-dark);
      font: 16px/1.65 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .wrap { max-width: 980px; margin: 40px auto 64px; padding: 0 20px; }

    .hero {
      background: linear-gradient(180deg, rgba(156,39,176,.10), rgba(255,179,71,.06));
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 32px 28px;
      box-shadow: 0 10px 30px rgba(0,0,0,.32);
    }

    .eyebrow { color: var(--primary-color); font-weight: 700; letter-spacing: .08em; text-transform: uppercase; font-size: 12px; }

    .h1 { font-size: clamp(28px, 4vw, 40px); line-height: 1.15; margin: 8px 0; font-weight: 800;
      background: linear-gradient(270deg, var(--primary-color), #ff8c00, var(--primary-color));
      background-size: 600% 600%; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      animation: gradientMove 8s ease infinite; }

    @keyframes gradientMove { 0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%} }

    .subtitle { color: var(--muted); font-size: 16px; max-width: 70ch; }

    .toc { margin: 26px 0 16px; border-left: 3px solid var(--primary-color); padding: 10px 0 10px 16px; background: rgba(255,179,71,.09); border-radius: 8px; }
    .toc a { color: var(--text-dark); text-decoration: none; }
    .toc a:hover { color: var(--primary-color); }

    h2 { font-size: clamp(22px, 2.6vw, 28px); margin: 28px 0 8px; color: var(--primary-color); }
    h3 { font-size: 18px; margin: 22px 0 6px; color: var(--accent-purple); }
    p { margin: 10px 0; }
    ul, ol { padding-left: 20px; }

    .section { background-color: var(--section-bg-dark); backdrop-filter: blur(10px) saturate(150%); padding: 28px; border-radius: 12px; margin-top: 28px; border: 1px solid var(--border); box-shadow: 0 4px 16px rgba(0,0,0,0.25); text-align: left; }

    .callout { display: grid; grid-template-columns: 26px 1fr; gap: 10px; align-items: start; padding: 12px 14px; border: 1px solid var(--border); border-radius: 10px; background: linear-gradient(180deg, rgba(156,39,176,.10), rgba(255,179,71,.06)); margin: 14px 0; }
    .callout strong { color: var(--accent-purple); }

    pre { background: var(--code-bg-dark); color: #e2e8f0; border-radius: 12px; padding: 14px 16px; overflow: auto; border: 1px solid rgba(255,179,71,.22); box-shadow: 0 2px 10px rgba(0,0,0,.35); }
    code { background: rgba(255,179,71,.10); padding: .15em .4em; border-radius: 6px; color: var(--primary-color); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace; }

    a { color: var(--primary-color); }
  </style>
</head>
<body>
  <main class="wrap">
    <header class="hero" id="top">
      <div class="eyebrow">Networking · Kubernetes</div>
      <h1 class="h1">🧭 NGINX Ingress Routing (urlshortner) — Practical Examples</h1>
      <p class="subtitle">Explore routing with NGINX Ingress on EKS: basic, path, host, wildcard, regex, and canary. Includes copy‑paste manifests and Route 53 tips.</p>

      <nav class="toc">
        <strong>On this page</strong>
        <ul>
          <li><a href="#intro">What is NGINX Ingress routing?</a></li>
          <li><a href="#deploy">Deploy the apps</a></li>
          <li><a href="#basic">1) Basic Routing</a></li>
          <li><a href="#path">2) Path‑Based Routing</a></li>
          <li><a href="#host">3) Host‑Based Routing</a></li>
          <li><a href="#wildcard">4) Wildcard Routing</a></li>
          <li><a href="#regex">5) Regex‑Based Routing</a></li>
          <li><a href="#canary">6) Canary Routing</a></li>
          <li><a href="#end">Conclusion</a></li>
        </ul>
      </nav>
    </header>

    <section class="section" id="intro">
      <h2><i class="fas fa-info-circle"></i> What is NGINX Ingress routing?</h2>
      <p>NGINX Ingress sits at the cluster edge and routes HTTP/HTTPS traffic to Services based on <em>path</em>, <em>host</em>, <em>headers</em>, or other conditions. It consolidates access behind one IP/DNS, enables TLS termination, and supports strategies like canaries and authentication.</p>
      <p><strong>App code:</strong> <a href="Application/application" target="_blank" rel="noopener">urlshortner</a></p>
    </section>

    <section class="section" id="deploy">
      <h2><i class="fas fa-rocket"></i> Deploy the app components</h2>
      <div class="callout"><div aria-hidden="true">📝</div><div><strong>Note:</strong> You can deploy via <code>kubectl apply</code> or Helm. Both sets of resources exist in the repo.</div></div>
      <pre><code>kubectl apply -f Application/application/auth/manifests/prod
kubectl apply -f Application/application/report/manifests/prod
kubectl apply -f Application/application/ui/manifests/prod
kubectl apply -f Application/application/url_short/manifests/prod</code></pre>
      <p>Verify Services and Pods (all Services expose <code>targetPort: 5000</code>):</p>
      <pre><code>kubectl get svc,pod -n default</code></pre>
    </section>

    <section class="section" id="basic">
      <h2>1) Basic Routing</h2>
      <p>All requests go to a single backend — ideal for a single web app or common landing UI.</p>
      <pre><code>apiVersion: networking.k8s.io/v1
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
              number: 5000</code></pre>
      <pre><code>kubectl apply -f nginx-ingress-basic-routing.yaml
kubectl get ingress -n default
# NAME                 CLASS  HOSTS  ADDRESS                                     PORTS AGE
# urlshortner-ingress  nginx  *      a602f...elb.ap-southeast-1.amazonaws.com    80    57s</code></pre>
      <p>Access: <code>http://&lt;NLB-DNS&gt;/</code></p>
    </section>

    <section class="section" id="path">
      <h2>2) Path‑Based Routing</h2>
      <p>Route different URL paths to different Services under the same domain — great for microservices sharing a single entrypoint.</p>
      <pre><code>apiVersion: networking.k8s.io/v1
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
              number: 5000</code></pre>
      <pre><code>kubectl apply -f nginx-ingress-path-based-routing.yaml
kubectl get ingress -n default</code></pre>
    </section>

    <section class="section" id="host">
      <h2>3) Host‑Based Routing</h2>
      <p>Make routing decisions by <code>Host</code> header. Perfect when serving multiple apps on separate subdomains.</p>
      <pre><code>apiVersion: networking.k8s.io/v1
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
              number: 5000</code></pre>
      <div class="callout"><div aria-hidden="true">🌐</div><div>Add <strong>A</strong> records in Route 53 for <code>app1.example.com</code> and <code>app2.example.com</code> → your NLB.</div></div>
      <pre><code>kubectl apply -f nginx-ingress-host-based-routing.yaml
kubectl get ingress -n default</code></pre>
    </section>

    <section class="section" id="wildcard">
      <h2>4) Wildcard Routing</h2>
      <p>Match many subdomains with <code>*.example.com</code> — useful for multi‑tenant patterns like <code>user1.example.com</code>.</p>
      <pre><code>apiVersion: networking.k8s.io/v1
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
              number: 5000</code></pre>
      <div class="callout"><div aria-hidden="true">🌐</div><div>Create a wildcard <strong>A</strong> record in Route 53 for <code>*.example.com</code> → your NLB.</div></div>
      <pre><code>kubectl apply -f nginx-ingress-wildcard-routing.yaml
kubectl get ingress -n default</code></pre>
      <p>Access: <code>http://anything.example.com</code></p>
    </section>

    <section class="section" id="regex">
      <h2>5) Regex‑Based Routing</h2>
      <p>Use regex paths when URL structures are complex or optional. Requires <code>use-regex: "true"</code> and appropriate <code>pathType</code>.</p>
      <div class="callout"><div aria-hidden="true">⚠️</div><div><strong>Note:</strong> Example only — adapt to your app’s paths before use.</div></div>
      <pre><code>apiVersion: networking.k8s.io/v1
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
              number: 5000</code></pre>
      <pre><code>kubectl apply -f nginx-ingress-regex-based-routing.yaml
kubectl get ingress -n default</code></pre>
    </section>

    <section class="section" id="canary">
      <h2>6) Canary Routing</h2>
      <p>Split a percentage of traffic to a canary Service for safe, progressive delivery.</p>
      <h3>Stable</h3>
      <pre><code>apiVersion: networking.k8s.io/v1
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
              number: 5000</code></pre>
      <h3>Canary (20%)</h3>
      <pre><code>apiVersion: networking.k8s.io/v1
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
              number: 5000</code></pre>
      <div class="callout"><div aria-hidden="true">🌐</div><div>Add an <strong>A</strong> record in Route 53 for <code>example.com</code> → your NLB, then browse <code>http://example.com</code> and refresh to observe split traffic.</div></div>
      <pre><code>kubectl apply -f nginx-ingress-canary-based-stable-version.yaml
kubectl apply -f nginx-ingress-canary-based-canary-version.yaml
kubectl get ingress -A</code></pre>
    </section>

    <section class="section" id="end">
      <h2><i class="fas fa-check-circle"></i> Conclusion</h2>
      <p>We walked through the major NGINX Ingress routing strategies — from basic and path/host rules to wildcard, regex, and canaries — using EKS patterns and Route 53 for DNS. Mastering these gives you fine‑grained, production‑ready traffic control for microservices.</p>
      <p class="footer"><a class="pill" href="#top">Back to top ↑</a></p>
    </section>
  </main>
</body>
</html>



<!-- Now, we’ll explore how routing works in the NGINX Ingress Controller with practical examples using a `urlshortner` application:

Application code:- [urlshortner](Application/application)

Let’s dive into the different types of routing supported by the NGINX Ingress Controller. 

{: .note}
> you deploy the app in any way like, using kubectl apply or using helm. I have added both resources in this code.

```bash
kubectl apply -f Application/application/auth/manifests/prod
kubectl apply -f Application/application/report/manifests/prod
kubectl apply -f Application/application/ui/manifests/prod
kubectl apply -f Application/application/url_short/manifests/prod
```

See that both apps have been deployed. All app exposes services to targetPort 5000.

```bash
kubectl get svc,pod -n default
```

NGINX Ingress routing is the process of directing external HTTP or HTTPS traffic to services running inside a Kubernetes cluster using the NGINX Ingress Controller. It acts as a smart reverse proxy that sits at the edge of the cluster and inspects incoming requests to determine how they should be forwarded based on predefined rules. These rules can be based on the request’s path, host (domain), headers, or even custom conditions.

By using NGINX for ingress routing, you can consolidate access to multiple applications through a single IP address or load balancer, enforce routing logic, and apply advanced traffic management strategies like TLS termination, canary deployments, and authentication. It offers a powerful, flexible, and production-ready way to expose Kubernetes services to the outside world.


## 1) Basic Routing

Basic routing is the simplest form of ingress routing where all incoming HTTP requests, regardless of the path or host, are directed to a single backend service. It is typically used when your Kubernetes cluster hosts only one web application or when you want all users to land on a common frontend. This setup is straightforward and often serves as the default routing mechanism for monolithic applications deployed on Kubernetes.


```yaml
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

Apply it and see its details

```bash
kubectl apply -f nginx-ingress-basic-routing.yaml 

$ kubectl get ingress -n default
NAME                    CLASS   HOSTS   ADDRESS                                                                         PORTS   AGE
urlshortner-ingress      nginx   *       a602f172c106e4d4eb0736290c756d76-6d3fef0920a1c9a1.elb.ap-southeast-1.amazonaws.com   80      57s
```

[Access it using the](http://<NLB-DNS>/)


## 2) Path-Based Routing
Path-based routing allows you to route traffic to different services based on the URL path in the incoming request. For example, requests to /app1 can be routed to one service, while /app2 can go to another. This is particularly useful in a microservices architecture where different applications or modules are served under specific paths on the same domain. It enables clean separation of concerns and efficient resource utilization under a shared ingress endpoint.

>> Create a manifest file (`nginx-ingress-path-based-routing.yaml`)

```yaml
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
  ingressClassName: nginx # Ingress Class
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

Apply it and see its details

```bash
kubectl apply -f nginx-ingress-path-based-routing.yaml 

kubectl get ingress -n default
```


Access it using the browser.

## 3) Host-Based Routing
Host-based routing allows the Ingress Controller to make routing decisions based on the HTTP Host header. It is ideal when you want to serve multiple applications using different domain names or subdomains. For instance, app1.example.com can route to one application while app2.example.com can point to another. This is commonly used in multi-tenant architectures or when consolidating services under one Ingress Controller while maintaining domain isolation.

>> Create the manifest file (nginx-ingress-host-based-routing.yaml)

```yaml
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

Apply it and see its details

```bash
kubectl apply -f nginx-ingress-host-based-routing.yaml 
kubectl get ingress -n default
```

Add two A records in your route53 hostedzone for `app1.example.com` and `app2.example.com` pointing to NLB.


## 4) Wildcard Routing
Wildcard routing enables you to match multiple subdomains under a base domain using wildcard patterns like *.example.com. This is useful when you need to serve dynamically generated subdomains, such as for user-specific dashboards (user1.example.com, user2.example.com, etc.), without having to declare each one individually in the Ingress rules. It simplifies routing management in environments that require scalability with subdomain patterns.


>> Create manifest file (nginx-ingress-wildcard-routing.yaml)

```yaml
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

Apply it and see its details

```bash
kubectl apply -f nginx-ingress-wildcard-routing.yaml 
kubectl get ingress -n default
```

Add an A records in route53 for *.example.com pointing to NLB.

[Access it using the](http://anything.example.com)


## 5) Regex-Based Routing
Regex-based routing adds powerful pattern-matching capabilities to your ingress rules by allowing regular expressions in path definitions. This is helpful when you want to match complex or optional URL structures, such as /api/v1/.* or /app1(/|$)(.*). It enables more dynamic routing configurations but requires careful rule writing and the use of specific annotations and path types. It’s especially handy when URL structures cannot be strictly controlled.

>> Create manifest file (nginx-ingress-regex-based-routing.yaml)
{: .note}

> This is a dummy yaml for regex based, don't use it for `urlshortner` app.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-ui-svc
  namespace: prod
  labels:
    app: ui
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/use-regex: "true"  
spec:
  ingressClassName: nginx # Ingress Class
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

Apply it and see its details

```bash
kubectl apply -f nginx-ingress-regex-based-routing.yaml 

kubectl get ingress -n default
```

## 6) Canary Routing
Canary routing enables progressive delivery by allowing a portion of traffic to be routed to a "canary" version of a service. This is useful for testing new versions of applications in production with real users but limited exposure. For example, only 10% of traffic might hit the canary app while 90% continues to go to the stable version. This technique is essential for safe deployments, A/B testing, and minimizing risk during upgrades.

>> Create manifest for stable version (nginx-ingress-canary-based-stable-version.yaml)

```yaml
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

>> Create another manifest for canary version (nginx-ingress-canary-based-canary-version.yaml)

```yaml
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

Apply both and see details

```bash
kubectl apply -f nginx-ingress-canary-based-stable-version.yaml 
kubectl apply -f nginx-ingress-canary-based-canary-version.yaml 
kubectl get ingress -A
```

Add an A records in route53 for example.com pointing to NLB.

Access it using the http://example.com and you will see the requests going to both the applications when you refresh.

## Conclusion

In this part, we explored the powerful routing capabilities of the NGINX Ingress Controller in Kubernetes. From basic routing to more advanced techniques like path-based, host-based, wildcard, and canary routing, NGINX offers fine-grained control over how traffic is directed to services inside your cluster. We used simple Node.js apps to demonstrate each routing strategy and highlighted how these approaches work in real-world EKS setups, including how to configure DNS using Route 53.

Whether you're building a multi-tenant platform, deploying versioned microservices, or experimenting with blue-green or canary deployments, mastering Ingress routing is a crucial step toward designing reliable, scalable, and production-grade Kubernetes applications.
 -->
