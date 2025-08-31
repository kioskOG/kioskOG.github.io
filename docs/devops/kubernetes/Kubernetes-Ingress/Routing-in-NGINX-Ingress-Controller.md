---
title: Routing in NGINX Ingress Controller
layout: default
parent: Understanding Ingress Controllers
grand_parent: Kubernetes Projects
nav_order: 1.5
permalink: /docs/devops/kubernetes/Routing-in-NGINX-Ingress-Controller/
description: Documentation on Routing in NGINX Ingress Controller
---

<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NGINX Ingress Routing Examples (urlshortner) — EKS</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
  <meta name="description" content="Hands‑on routing patterns with NGINX Ingress Controller on EKS: basic, path, host, wildcard, regex, and canary using a urlshortner app." />
  <style>
    /* === Theme aligned with your blog (orange/purple) === */
    :root {
      --primary-color: #ffb347;           /* main accent */
      --light-primary-shade: #ffd97d;     /* lighter accent */
      --bg-dark: #070708;                 /* page bg */
      --card-bg-dark: rgba(25,25,34,0.7); /* cards */
      --section-bg-dark: rgba(25,25,34,0.6);
      --text-dark: #e0e0e0;               /* text */
      --muted: #a7a7a7;                   /* subtle text */
      --accent-purple: #9c27b0;           /* secondary */
      --accent-pink: #ff0080;             /* secondary */
      --border: rgba(156,39,176,0.28);    /* subtle purple border */
      --code-bg-dark: rgba(13,13,16,0.7); /* code blocks */
    }

    body { background-color: var(--bg-dark); color: var(--text-dark); font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; text-align: center; line-height: 1.6; min-height: 100vh; background-image: radial-gradient(circle at top left, #2f0a5d 0%, transparent 50%), radial-gradient(circle at bottom right, #004d40 0%, transparent 50%); background-blend-mode: screen; }

    .container { max-width: 980px; margin: 40px auto; padding: 40px 20px; border-radius: 15px; background-color: var(--card-bg-dark); backdrop-filter: blur(15px) saturate(180%); border: 1px solid var(--border); box-shadow: 0 8px 32px rgba(0,0,0,0.37); }

    .gradient-header { background: linear-gradient(270deg, var(--primary-color), #ff8c00, var(--primary-color)); background-size: 600% 600%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: gradientMove 8s ease infinite; margin-bottom: .5em; font-size: 2.4em; font-weight: 800; text-shadow: 0 0 10px rgba(0,198,255,0.3); }
    @keyframes gradientMove { 0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%} }

    h2 { color: var(--primary-color); margin: 28px 0 14px; font-size: 1.9em; text-align: left; }
    h3 { color: var(--accent-purple); margin: 24px 0 10px; font-size: 1.35em; text-align: left; }
    p, li { text-align: left; font-size: 1.05em; }

    .section { background-color: var(--section-bg-dark); backdrop-filter: blur(10px) saturate(150%); padding: 28px; border-radius: 12px; margin-top: 28px; border: 1px solid var(--border); box-shadow: 0 4px 16px rgba(0,0,0,0.25); text-align: left; }

    .callout { display: grid; grid-template-columns: 26px 1fr; gap: 10px; align-items: start; padding: 12px 14px; border: 1px solid var(--border); border-radius: 10px; background: linear-gradient(180deg, rgba(156,39,176,.10), rgba(255,179,71,.06)); margin: 14px 0; }
    .callout strong { color: var(--accent-purple); }

    pre { background-color: var(--code-bg-dark); color: #d1d1d1; padding: 15px; border-radius: 8px; overflow-x: auto; font-family: 'Fira Code','Cascadia Code','Consolas',monospace; font-size: 0.9em; margin: 18px 0; border: 1px solid rgba(255,179,71,0.2); text-align: left; box-shadow: 0 2px 7px rgba(0,0,0,0.35); }
    code { background-color: rgba(255,179,71,.1); color: var(--primary-color); padding: 2px 4px; border-radius: 4px; font-family: 'Fira Code','Cascadia Code','Consolas',monospace; }

    a { color: var(--primary-color); }
    hr { border: none; border-top: 1px solid rgba(255,179,71,.5); margin: 32px 0 16px; }

    .toc { margin-top: 8px; padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px; background: linear-gradient(180deg, rgba(156,39,176,.08), rgba(255,179,71,.06)); }
    .toc ul { margin: 0; padding-left: 18px; }
    .toc a { color: var(--text-dark); text-decoration: none; }
    .toc a:hover { color: var(--primary-color); }

    @media (max-width: 768px) { .container { margin: 24px 10px; padding: 28px 14px; } .section { padding: 20px; } }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="gradient-header">🧭 NGINX Ingress Routing (urlshortner) — Practical Examples</h1>
    <p>We’ll explore how routing works in the <strong>NGINX Ingress Controller</strong> using a <code>urlshortner</code> application, with hands‑on manifests for each pattern.</p>

    <div class="section toc">
      <strong>On this page</strong>
      <ul>
        <li><a href="#deploy">Deploy the apps</a></li>
        <li><a href="#basic">1) Basic Routing</a></li>
        <li><a href="#path">2) Path‑Based Routing</a></li>
        <li><a href="#host">3) Host‑Based Routing</a></li>
        <li><a href="#wildcard">4) Wildcard Routing</a></li>
        <li><a href="#regex">5) Regex‑Based Routing</a></li>
        <li><a href="#canary">6) Canary Routing</a></li>
        <li><a href="#end">Conclusion</a></li>
      </ul>
    </div>

    <section class="section" id="intro">
      <h2><i class="fas fa-info-circle"></i> What is NGINX Ingress routing?</h2>
      <p>NGINX Ingress sits at the cluster edge and routes HTTP/HTTPS traffic to Services based on rules that match <em>path</em>, <em>host</em>, <em>headers</em>, or custom conditions. It consolidates access behind a single IP/DNS (your LB), enables TLS termination, and supports strategies like canaries and authentication.</p>
      <p><strong>App code:</strong> <a href="Application/application" target="_blank" rel="noopener">urlshortner</a></p>
    </section>

    <section class="section" id="deploy">
      <h2><i class="fas fa-rocket"></i> Deploy the app components</h2>
      <div class="callout"><div aria-hidden="true">📝</div><div><strong>Note:</strong> You can deploy via <code>kubectl apply</code> or Helm. Both resources are included in the codebase.</div></div>
      <pre><code>kubectl apply -f Application/application/auth/manifests/prod
kubectl apply -f Application/application/report/manifests/prod
kubectl apply -f Application/application/ui/manifests/prod
kubectl apply -f Application/application/url_short/manifests/prod</code></pre>
      <p>Verify both apps are running; all Services expose <code>targetPort: 5000</code>:</p>
      <pre><code>kubectl get svc,pod -n default</code></pre>
    </section>

    <section class="section" id="basic">
      <h2>1) Basic Routing</h2>
      <p>All requests (any host/path) go to a single backend — ideal for one web app or a common landing UI.</p>
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
      <p>Use powerful regex paths when URL structures are complex or optional. Requires <code>use-regex: "true"</code> and appropriate <code>pathType</code>.</p>
      <div class="callout"><div aria-hidden="true">⚠️</div><div><strong>Note:</strong> Dummy YAML for illustration — not wired for the <code>urlshortner</code> app.</div></div>
      <pre><code>apiVersion: networking.k8s.io/v1
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
    </section>
  </div>
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
