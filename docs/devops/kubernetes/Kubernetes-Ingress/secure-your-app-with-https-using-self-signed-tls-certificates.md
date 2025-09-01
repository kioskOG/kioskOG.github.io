---
title: Secure Your App with HTTPS using Self-Signed TLS Certificates
layout: default
parent: Understanding Ingress Controllers
grand_parent: Kubernetes Projects
nav_order: 4.5
permalink: /docs/devops/kubernetes/secure-your-app-with-https-using-self-signed-tls-certificates/
description: Documentation on Secure Your App with HTTPS using Self-Signed TLS Certificates
---

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>NGINX Ingress — Enable HTTPS with Self‑Signed TLS</title>
  <meta name="description" content="Step‑by‑step: generate a self‑signed certificate, create a Kubernetes TLS secret, and configure NGINX Ingress for HTTPS using the unified orange/purple theme." />
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

    h2 { font-size: clamp(22px, 2.6vw, 28px); margin: 28px 0 8px; color: var(--primary-color); }
    h3 { font-size: 18px; margin: 22px 0 6px; color: var(--accent-purple); }
    p { margin: 10px 0; }
    ul, ol { padding-left: 20px; }

    .callout { display: grid; grid-template-columns: 28px 1fr; gap: 10px; align-items: start; padding: 14px 16px; border: 1px solid var(--border); border-radius: 12px; background: linear-gradient(180deg, rgba(156,39,176,.10), rgba(255,179,71,.06)); margin: 18px 0; }
    .callout strong { color: var(--accent-purple); }

    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin: 16px 0 4px; }
    .card { background: var(--card-bg-dark); border: 1px solid var(--border); border-radius: 14px; padding: 14px 14px 12px; box-shadow: 0 6px 18px rgba(0,0,0,.25); }
    .note { color: var(--muted); font-size: 14px; }

    code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace; }
    code { background: rgba(255,179,71,.10); padding: .15em .4em; border-radius: 6px; color: var(--primary-color); }
    pre { background: var(--code-bg-dark); color: #e2e8f0; border-radius: 12px; padding: 14px 16px; overflow: auto; border: 1px solid rgba(255,179,71,.22); box-shadow: 0 2px 10px rgba(0,0,0,.35); }

    .toc { margin: 26px 0 16px; border-left: 3px solid var(--primary-color); padding: 10px 0 10px 16px; background: rgba(255,179,71,.09); border-radius: 8px; }
    .toc a { color: var(--text-dark); text-decoration: none; }
    .toc a:hover { color: var(--primary-color); }

    .footer { color: var(--muted); font-size: 13px; margin-top: 26px; }
    .pill { display: inline-block; padding: 2px 8px; border: 1px solid var(--border); border-radius: 999px; font-size: 12px; color: var(--muted); }
  </style>
</head>
<body>
  <main class="wrap">
    <header class="hero" id="top">
      <div class="eyebrow">Networking · Kubernetes</div>
      <h1 class="h1">🔒 NGINX Ingress — Enable HTTPS with Self‑Signed TLS</h1>
      <p class="subtitle">Generate a self‑signed certificate, create a Kubernetes TLS secret, and configure NGINX Ingress to serve your app over HTTPS. Best for dev/test; use ACME/ACM in prod.</p>

      <nav class="toc">
        <strong>On this page</strong>
        <ul>
          <li><a href="#generate">Generate a self‑signed certificate</a></li>
          <li><a href="#secret">Create the Kubernetes TLS Secret</a></li>
          <li><a href="#ingress">Configure Ingress for TLS</a></li>
          <li><a href="#access">Access via HTTPS</a></li>
          <li><a href="#curl">Test with <code>curl</code></a></li>
          <li><a href="#why">Why self‑signed?</a></li>
        </ul>
      </nav>
    </header>

    <section id="intro">
      <p>We’ll secure <code>urlshortner</code>, already exposed via Ingress, by adding a TLS layer. DNS (Route 53) A record is in place pointing to the Ingress/NLB endpoint.</p>
    </section>

    <section id="generate">
      <h2>Step 1 — Generate Self‑Signed TLS Certificate</h2>
      <p>Run the following command (valid 365 days):</p>
      <pre><code>openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout tls.key \
  -out tls.crt \
  -subj "/CN=prod.dev.linuxforall.in/O=urlshortner"</code></pre>
      <div class="cards">
        <div class="card"><strong>tls.crt</strong><br><span class="note">Self‑signed certificate</span></div>
        <div class="card"><strong>tls.key</strong><br><span class="note">Private key</span></div>
      </div>
    </section>

    <section id="secret">
      <h2>Step 2 — Create a Kubernetes Secret</h2>
      <p>Create the TLS secret in the <code>default</code> namespace:</p>
      <pre><code>kubectl create secret tls urlshortner-secret \
  --cert=tls.crt \
  --key=tls.key \
  -n default</code></pre>
      <p>Verify:</p>
      <pre><code>kubectl get secret urlshortner-secret -n default -o yaml</code></pre>
    </section>

    <section id="ingress">
      <h2>Step 3 — Create/Update Ingress for TLS</h2>
      <p><em>File:</em> <code>nginx-ingress-self-signed-tls-auth.yaml</code></p>
      <pre><code>apiVersion: networking.k8s.io/v1
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
                number: 5000</code></pre>
      <div class="callout">
        <div aria-hidden="true">💡</div>
        <div><strong>Note:</strong> Ensure <code>prod.dev.linuxforall.in</code> resolves to your Ingress controller’s external IP (Route 53 A record or <code>/etc/hosts</code>).</div>
      </div>

      <p>Apply the manifest:</p>
      <pre><code>kubectl apply -f nginx-ingress-self-signed-tls-auth.yaml</code></pre>
    </section>

    <section id="access">
      <h2>Step 4 — Access the App via HTTPS</h2>
      <p>Open: <a href="https://prod.dev.linuxforall.in" target="_blank" rel="noopener">https://prod.dev.linuxforall.in</a></p>
      <p class="note">Browsers will warn on self‑signed certs (e.g., “Your connection is not private”). You can bypass for dev/test.</p>
    </section>

    <section id="curl">
      <h2>Step 5 — Test with <code>curl</code></h2>
      <p>HTTP (expect 308 redirect to HTTPS):</p>
      <pre><code>curl -v http://prod.dev.linuxforall.in -k</code></pre>
      <p>HTTPS (expect 200 OK; <code>-k</code> ignores self‑signed verification):</p>
      <pre><code>curl -v https://prod.dev.linuxforall.in -k</code></pre>
    </section>

    <section id="why">
      <h2>🏁 Conclusion — Why Use Self‑Signed TLS?</h2>
      <ul>
        <li>Simulate real HTTPS behavior</li>
        <li>Validate TLS configurations</li>
        <li>Secure dev/test environments without external dependencies</li>
        <li>Save cost on cert management for internal tools</li>
      </ul>
      <p class="footer"><a class="pill" href="#top">Back to top ↑</a></p>
    </section>
  </main>
</body>
</html>


<!-- https://dev.to/aws-builders/kubernetes-ingress-playlist-part-5-secure-your-app-with-https-using-self-signed-tls-certificates-5aa8 -->

<!-- In this part, we'll take it a step further by enabling HTTPS on your application using self-signed TLS certificates.

While in production environments you should always use trusted Certificate Authorities (e.g., via Let's Encrypt or AWS ACM), self-signed certs are useful in dev/test environments or for internal services where you control the client machines.

We will secure our `urlshortner` which is already exposed via Ingress and add a TLS layer on top using a self-signed certificate. I have already deployed the pod with service and added an A record in Route 53 for NLB dns name.

## Step 1. Generate Self-Signed TLS Certificate
Use the following command to generate a cert and private key:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout tls.key \
  -out tls.crt \
  -subj "/CN=prod.dev.linuxforall.in/O=urlshortner"
```

This generates:

**tls.crt:** the self-signed certificate
**tls.key:** the private key


## Step 2. Create a Kubernetes Secret
Use the TLS files to create a Kubernetes secret in the same namespace as your app:

```bash
kubectl create secret tls urlshortner-secret \
  --cert=tls.crt \
  --key=tls.key \
  -n default
```


You can verify it with:

```bash
kubectl get secret urlshortner-secret -n default -o yaml
```

## Step 3. Create or Update Ingress Resource for TLS
Create the manifest file (`nginx-ingress-self-signed-tls-auth.yaml`)


```yaml
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

{: .note}
> Make sure host chinmayto.com points to your Ingress controller's external IP (via /etc/hosts entry or Route53 record).

## Step 5. Access the App via HTTPS
Now open your browser and go to: https://prod.dev.linuxforall.in

Since this is a self-signed certificate, your browser will display a security warning like: “Your connection is not private”. You can safely bypass this for testing purposes.

## Step 6. Test with curl
Following command will give us the 308 Permanent Redirect since we are accessing over HTTP and not HTTPS.

```bash
curl -v http://prod.dev.linuxforall.in -k
```

Using below command (HTTPS) we can get the 200 OK response.

```bash
curl -v https://prod.dev.linuxforall.in -k
```

We now have succesfully tested HTTPS connections using Self Signed Certs!!

## Conclusion: Why Use Self-Signed TLS?
While not suitable for production, self-signed TLS certificates are extremely useful for local development and testing, allowing you to:

1. Simulate real HTTPS behavior
2. Validate TLS configurations
3. Secure dev/test environments without external dependencies
4. Save cost on cert management for internal tools
 -->
