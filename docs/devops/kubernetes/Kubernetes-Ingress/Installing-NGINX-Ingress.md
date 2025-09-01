---
title: Installing NGINX Ingress
layout: default
parent: Understanding Ingress Controllers
grand_parent: Kubernetes Projects
ancestor: Kubernetes Projects
nav_order: 1.5
permalink: /docs/devops/kubernetes/Installing-NGINX-Ingress/
description: Documentation on Installing NGINX Ingress
---

<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NGINX Ingress on EKS with NLB – Hands‑on Guide</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
  <meta name="description" content="Install NGINX Ingress Controller on Amazon EKS with Helm and expose via AWS Network Load Balancer (NLB)." />
  <style>
    /* === Theme aligned with your blog (orange/purple) === */
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

    .section { background-color: var(--section-bg-dark); backdrop-filter: blur(10px) saturate(150%); -webkit-backdrop-filter: blur(10px) saturate(150%);
      padding: 30px; border-radius: 12px; margin-top: 40px; border: 1px solid var(--border); box-shadow: 0 4px 16px rgba(0,0,0,.25); text-align: left; max-width: 850px; margin-left: auto; margin-right: auto; }
    .section h2 { color: var(--primary-color); margin-bottom: 18px; text-align: left; font-size: 1.9em; letter-spacing: 1px; text-shadow: 0 0 8px rgba(255,179,71,.2); display: flex; align-items: center; gap: 10px; }
    .section h3 { color: var(--accent-purple); margin-top: 22px; margin-bottom: 12px; font-size: 1.35em; font-weight: 600; display: flex; align-items: center; gap: 8px; }

    .callout { display: grid; grid-template-columns: 26px 1fr; gap: 10px; align-items: start; padding: 12px 14px; border: 1px solid var(--border); border-radius: 10px; background: linear-gradient(180deg, rgba(156,39,176,.10), rgba(255,179,71,.06)); margin: 14px 0; }
    .callout strong { color: var(--accent-purple); }

    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin: 16px 0 4px; }
    .card { background: var(--card-bg-dark); border: 1px solid var(--border); border-radius: 14px; padding: 14px 14px 12px; box-shadow: 0 6px 18px rgba(0,0,0,.25); }
    .note { color: var(--muted); font-size: 14px; }

    pre { background: var(--code-bg-dark); color: #e2e8f0; border-radius: 12px; padding: 14px 16px; overflow: auto; border: 1px solid rgba(255,179,71,.22); box-shadow: 0 2px 10px rgba(0,0,0,.35); }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; background: rgba(255,179,71,.10); color: var(--primary-color); padding: .15em .35em; border-radius: 6px; }

    table { width: 100%; border-collapse: collapse; margin: 14px 0; background: var(--code-bg-dark); border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,.35); }
    th, td { border: 1px solid var(--border); padding: 10px 12px; text-align: left; vertical-align: top; color: var(--text-dark); }
    th { background: rgba(156,39,176,.30); color: var(--primary-color); }
    tr:nth-child(odd) td { background: rgba(156,39,176,.08); }

    hr { border: none; border-top: 1px solid rgba(255,179,71,.5); margin: 30px 0 12px; }
    a { color: var(--primary-color); }

    @media (max-width: 768px) {
      .wrap { margin: 24px auto 40px; }
      .section { padding: 20px; }
    }
  </style>
</head>
<body>
  <main class="wrap">
    <header class="hero">
      <div class="eyebrow">Kubernetes · Ingress</div>
      <h1 class="h1">NGINX Ingress on EKS with an AWS NLB</h1>
      <p class="subtitle">Hands‑on install with Helm, exposing the controller to the internet via an AWS <strong>Network Load Balancer</strong> (NLB).</p>
    </header>

    <section class="section" id="why-nginx">
      <h2><i class="fas fa-question-circle"></i> Why NGINX Ingress?</h2>
      <p>
        The <strong>NGINX Ingress Controller</strong> is widely adopted and community‑maintained. It supports everything from basic path routing to advanced features like
        <em>rate limiting</em>, <em>TLS termination</em>, and <em>authentication</em>.
      </p>
    </section>

    <section class="section" id="default-clb">
      <h2><i class="fas fa-exclamation-circle"></i> Step 0 — Default Behavior: Classic Load Balancer</h2>
      <p>
        By default, installing the controller with <code>service.type=LoadBalancer</code> on AWS provisions a <strong>Classic Load Balancer (CLB)</strong>:
      </p>
      <pre><code>helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.service.type=LoadBalancer</code></pre>
      <p class="callout"><span>💡</span><span><strong>Production tip:</strong> Prefer an <strong>NLB</strong> for performance, IP targeting, and TLS passthrough.</span></p>
    </section>

    <section class="section" id="install-nlb">
      <h2><i class="fas fa-network-wired"></i> Step 1 — Install NGINX Ingress with an NLB</h2>
      <p>
        Instruct AWS to create a <strong>Network Load Balancer</strong> by adding the service annotation:
      </p>
      <pre><code>helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.service.type=LoadBalancer \
  --set controller.metrics.enabled=true \
  --set-string controller.metrics.service.annotations."prometheus\.io/port"="10254" \
  --set-string controller.metrics.service.annotations."prometheus\.io/scrape"="true" \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-type"="nlb"</code></pre>

      <h3><i class="fas fa-clipboard-check"></i> Sample Output</h3>
      <pre><code>NAME: ingress-nginx
LAST DEPLOYED: Sun Aug  3 22:38:43 2025
NAMESPACE: ingress-nginx
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
The ingress-nginx controller has been installed.
It may take a few minutes for the load balancer IP to be available.
You can watch the status by running 'kubectl get service --namespace ingress-nginx ingress-nginx-controller --output wide --watch'</code></pre>

      <p>
        This installs the controller in <code>ingress-nginx</code>, exposes it as a <code>LoadBalancer</code>, and tells AWS to provision an <strong>NLB</strong> instead of a CLB.
        In public subnets, the NLB will get an external DNS name:
      </p>
      <pre><code>$ kubectl get service --ns ingress-nginx ingress-nginx-controller
NAME                       TYPE           CLUSTER-IP      EXTERNAL-IP                                                PORT(S)                      AGE
ingress-nginx-controller   LoadBalancer   172.20.72.145   ad7549...elb.ap-southeast-1.amazonaws.com   80:30209/TCP,443:30549/TCP   4m33s</code></pre>
    </section>

    <section class="section" id="sample-app">
      <h2><i class="fas fa-cubes"></i> Step 2 — Sample App (Deployment & Service)</h2>
      <p>Apply a basic app to route traffic to. Example <strong>otel-python-app</strong>:</p>
      <pre><code>apiVersion: apps/v1
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
    targetPort: 8080</code></pre>

      <h3><i class="fas fa-search"></i> Verify</h3>
      <pre><code>$ kubectl get all -n simple-nodejs-app
NAME                                 READY   STATUS    RESTARTS   AGE
pod/otel-python-app-...              1/1     Running   0          2m
...
NAME                    TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
service/otel-python-app ClusterIP   172.20.41.147   &lt;none&gt;        80/TCP    2m
...
deployment.apps/otel-python-app  5/5   5   5   2m1s</code></pre>
    </section>

    <section class="section" id="ingress-resource">
      <h2><i class="fas fa-route"></i> Step 3 — Create an Ingress Resource</h2>
      <p>Route traffic from the NLB → NGINX → your Service:</p>
      <pre><code>apiVersion: networking.k8s.io/v1
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
              number: 8080</code></pre>

      <div class="callout"><div aria-hidden="true">📝</div><div><strong>Note:</strong> For testing, you can use the <em>NLB DNS name</em> as the host, or map your own domain in Route 53.</div></div>
      <div class="callout"><div aria-hidden="true">⚠️</div><div><strong>Important:</strong> <code>nginx.ingress.kubernetes.io/rewrite-target: /</code> rewrites the request URI correctly for the backend.</div></div>

      <pre><code>$ kubectl get ingress -n default</code></pre>
    </section>

    <section class="section" id="access">
      <h2><i class="fas fa-external-link-alt"></i> Step 4 — Access the App</h2>
      <p>Confirm end‑to‑end traffic flow:</p>
      <pre><code>http://&lt;HOST-NAME&gt;</code></pre>

      <h3><i class="fas fa-project-diagram"></i> End‑to‑end flow</h3>
      <pre><code>Client → NLB → NGINX Ingress → Kubernetes Service → Application Pod</code></pre>
    </section>

    <section class="section" id="refs">
      <h2><i class="fas fa-book"></i> References</h2>
      <ul>
        <li>GitHub Repo: <a href="https://github.com/chinmayto/kubernetes-ingress-nginx" target="_blank" rel="noopener">chinmayto/kubernetes-ingress-nginx</a></li>
        <li>AWS Blog: <a href="https://aws.amazon.com/blogs/containers/exposing-kubernetes-applications-part-3-nginx-ingress-controller/" target="_blank" rel="noopener">Exposing Kubernetes applications – part 3</a></li>
      </ul>
    </section>
  </main>
</body>
</html>


<!-- we'll take a hands-on approach to install the NGINX Ingress Controller on an Amazon EKS cluster using Helm, and expose it to the internet using an AWS Network Load Balancer (NLB).

## Why NGINX Ingress?

The NGINX Ingress Controller is one of the most widely adopted ingress controllers in the Kubernetes ecosystem. It's community-maintained and supports a wide range of use cases from basic path-based routing to advanced configurations like rate-limiting, TLS termination, and authentication.

## Step 0: Default Behavior — Classic Load Balancer
By default, when you install the NGINX Ingress Controller with service.type=LoadBalancer, Kubernetes on AWS will provision a Classic Load Balancer (CLB).

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.service.type=LoadBalancer
```


This may work for basic use cases, but for production workloads, it's recommended to use a Network Load Balancer (NLB) due to better performance, IP targeting, and TLS passthrough support.


## Step 1: Install NGINX Ingress Controller with NLB
To create a Network Load Balancer when we create ingress, we use an annotation supported by AWS:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --set controller.service.type=LoadBalancer \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-type"="nlb"
```

## Output

```bash
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


This command installs the ingress controller in the ingress-nginx namespace and exposes it using a Kubernetes LoadBalancer type service and also adds an annotation that tells AWS to create a Network Load Balancer instead of a Classic Load Balancer

Once created, this NLB will automatically connect to the public subnets (if available) and expose an external IP.

```bash
$ kubectl get service --ns ingress-nginx ingress-nginx-controller 
NAME                       TYPE           CLUSTER-IP      EXTERNAL-IP                                                                     PORT(S)                      AGE
ingress-nginx-controller   LoadBalancer   172.20.72.145   ad75493700bcd4c4db3470bdb08e9b2d-6739ce92cbd2f4d0.elb.ap-southeast-1.amazonaws.com   80:30209/TCP,443:30549/TCP   4m33s
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: otel-python-app
  namespace: default
  labels:
    app.kubernetes.io/name: otel-python-app # <--- IMPORTANT: This label matches service.name in OTel
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


You can see the deployment and service has been created

```bash
$ kubectl get all -n simple-nodejs-app
NAME                                         READY   STATUS    RESTARTS   AGE
pod/otel-python-app-55555bc798-6b9qt   1/1     Running   0          2m 
pod/otel-python-app-55555bc798-b4gnl   1/1     Running   0          2m 
pod/otel-python-app-55555bc798-gwrws   1/1     Running   0          2m 
pod/otel-python-app-55555bc798-htfmk   1/1     Running   0          2m 
pod/otel-python-app-55555bc798-p4pbf   1/1     Running   0          2m 

NAME                         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
service/otel-python-app      ClusterIP   172.20.41.147   <none>        80/TCP    2m 

NAME                                    READY   UP-TO-DATE   AVAILABLE   AGE        
deployment.apps/otel-python-app   5/5     5            5           2m1s      

NAME                                               DESIRED   CURRENT   READY   AGE 
replicaset.apps/otel-python-app-55555bc798   5         5         5       2m1s
```


## Step 3: Create Ingress Resource to Route Traffic
Create an Ingress resource to route incoming traffic from the NLB through the ingress controller to the internal Node.js service.

Here’s a sample ingress manifest:


```yaml
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
    # - host: linuxforall.dev.in
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

{: .note}
> Replace with either the NLB DNS name (for testing) or your actual domain name (configured in Route 53), under host. I am using NLB DNS.


{: .importamt}
> The annotation rewrite-target: / ensures that the request URI is rewritten properly when forwarding to the backend. This resource tells the ingress controller: "If someone hits / on this domain, forward traffic to otel-python-app service on port 8080".

```bash
$ kubectl get ingress -n default
```


Step 4: Access the App via External DNS
Test if traffic from the internet hits our NLB, goes through the ingress controller, and reaches the Node.js app.

Open a browser or use curl to access:

```bash
http://<HOST-NAME>
```

## end-to-end flow:

```bash
Client → NLB → NGINX Ingress → Kubernetes Service → Application Pod
```

## References
GitHub Repo: https://github.com/chinmayto/kubernetes-ingress-nginx
AWS Documentation: https://aws.amazon.com/blogs/containers/exposing-kubernetes-applications-part-3-nginx-ingress-controller/
 -->
