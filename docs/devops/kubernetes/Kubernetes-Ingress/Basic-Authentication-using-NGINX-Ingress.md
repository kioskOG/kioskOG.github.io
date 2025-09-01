---
title: Basic Authentication using NGINX Ingress
layout: home
parent: Understanding Ingress Controllers
grand_parent: Kubernetes Projects
nav_order: 3.5
permalink: /docs/devops/kubernetes/Basic-Authentication-using-NGINX-Ingress/
description: Documentation on Basic Authentication using NGINX Ingress
---

<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NGINX Ingress — Basic Authentication Setup</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <style>
    :root {
      --primary-color: #ffb347;
      --light-primary-shade: #ffd97d;
      --bg-dark: #070708;
      --text-dark: #e0e0e0;
      --card-bg-dark: rgba(25, 25, 34, 0.7);
      --section-bg-dark: rgba(25, 25, 34, 0.6);
      --code-bg-dark: rgba(13, 13, 16, 0.7);
      --accent-purple: #9c27b0;
      --accent-pink: #ff0080;
      --border: rgba(156,39,176,0.28);
    }

    body { background-color: var(--bg-dark); color: var(--text-dark); font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; min-height: 100vh; background-image: radial-gradient(circle at top left, #2f0a5d 0%, transparent 50%), radial-gradient(circle at bottom right, #004d40 0%, transparent 50%); background-blend-mode: screen; }

    .container { max-width: 950px; margin: 40px auto; padding: 40px 20px; border-radius: 15px; background-color: var(--card-bg-dark); backdrop-filter: blur(15px) saturate(180%); border: 1px solid var(--border); box-shadow: 0 8px 32px rgba(0,0,0,0.37); }

    .gradient-header { background: linear-gradient(270deg, var(--primary-color), #ff8c00, var(--primary-color)); background-size: 600% 600%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: gradientMove 8s ease infinite; margin-bottom: .5em; font-size: 2.5em; font-weight: bold; text-align: center; text-shadow: 0 0 10px rgba(0,198,255,0.3); }
    @keyframes gradientMove { 0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%} }

    h2 { color: var(--primary-color); margin-bottom: 20px; font-size: 1.8em; text-align: left; }
    h3 { color: var(--accent-purple); margin-top: 25px; margin-bottom: 15px; font-size: 1.3em; text-align: left; }
    p, li { text-align: left; font-size: 1.05em; }

    pre { background-color: var(--code-bg-dark); color: #d1d1d1; padding: 15px; border-radius: 8px; overflow-x: auto; font-family: 'Fira Code', monospace; font-size: 0.9em; margin: 20px 0; border: 1px solid rgba(255,179,71,0.2); text-align: left; box-shadow: 0 2px 7px rgba(0,0,0,0.35); }
    code { background-color: rgba(255,179,71,.1); color: var(--primary-color); padding: 2px 4px; border-radius: 4px; font-family: 'Fira Code', monospace; }

    .section { background-color: var(--section-bg-dark); backdrop-filter: blur(10px) saturate(150%); padding: 30px; border-radius: 12px; margin-top: 40px; border: 1px solid var(--border); box-shadow: 0 4px 16px rgba(0,0,0,0.25); text-align: left; }

    .note { color: var(--accent-pink); font-style: italic; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="gradient-header">🔐 NGINX Ingress — Basic Authentication</h1>
    <p>Secure your Kubernetes services quickly using <strong>Basic Authentication</strong> with NGINX Ingress. This approach is useful for internal tools, staging apps, or quick protection layers.</p>

    <section class="section">
      <h2>📖 What is Basic Authentication?</h2>
      <p>Basic Authentication is a simple mechanism where clients send a <code>username</code> and <code>password</code> with each HTTP request. While not the most secure (especially without HTTPS), it's quick and useful in early-stage deployments or for internal apps.</p>
    </section>

    <section class="section">
      <h2>✅ Prerequisites</h2>
      <ul>
        <li>A working Kubernetes cluster with <strong>NGINX Ingress Controller</strong> (example: AWS EKS).</li>
        <li><code>kubectl</code> configured to access your cluster.</li>
        <li><code>htpasswd</code> utility installed locally (<code>apache2-utils</code> or <code>httpd-tools</code>).</li>
      </ul>
    </section>

    <section class="section">
      <h2>1️⃣ Create Password File</h2>
      <p>Generate a password file with <code>htpasswd</code>:</p>
      <pre><code>htpasswd -c auth adminuser</code></pre>
      <p class="note">You'll be prompted for a password. This creates <code>auth</code> with credentials for <code>adminuser</code>.</p>
    </section>

    <section class="section">
      <h2>2️⃣ Create Kubernetes Secret</h2>
      <p>Create a secret from the password file:</p>
      <pre><code>kubectl create secret generic basic-auth --from-file=auth -n default</code></pre>
      <p>This creates a secret named <code>basic-auth</code> in the <code>default</code> namespace.</p>
    </section>

    <section class="section">
      <h2>3️⃣ Ingress Resource with Basic Auth</h2>
      <p>Create <code>nginx-ingress-basic-auth.yaml</code> manifest:</p>
      <pre><code>apiVersion: networking.k8s.io/v1
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
                number: 5000</code></pre>
      <p>Apply it:</p>
      <pre><code>kubectl apply -f nginx-ingress-basic-auth.yaml</code></pre>
    </section>

    <section class="section">
      <h2>🏁 Conclusion</h2>
      <p><strong>Basic Auth</strong> adds a simple authentication layer before users can reach your app. It's great for staging, dev tools, or quick protection, but not a full security solution. Always pair with <strong>HTTPS</strong> for safety in production.</p>
    </section>
  </div>
</body>
</html>


<!-- ## What is Basic Authentication?
Basic Authentication is a simple authentication mechanism where a client provides a username and password with each HTTP request. While not the most secure form of authentication (especially without HTTPS), it's quick and useful for internal applications or early-stage deployments.

## Prerequisites
1. A working Kubernetes cluster with NGINX Ingress Controller installed (we're using AWS EKS).
2. kubectl configured to access your cluster.
3. htpasswd utility installed locally (can be installed via apache2-utils or httpd-tools).

## Step 1: Create a Password File using htpasswd
Generate a password file using the htpasswd command. For example:

```bash
htpasswd -c auth adminuser
```

{: .note}
> You'll be prompted to enter a password. This creates a file called `auth` with credentials for user adminuser.

## Step 2: Create a Kubernetes Secret with the Credentials
Create a Kubernetes secret from the generated htpasswd file:

```bash
kubectl create secret generic basic-auth --from-file=auth -n default
```

This creates a secret named basic-auth in the default namespace.

## Step 3: Create an Ingress Resource with Basic Auth Annotations

>> Create manifest file (`nginx-ingress-basic-auth.yaml`)

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
    # type of authentication
    nginx.ingress.kubernetes.io/auth-type: "basic"
    # name of the secret that contains the user/password definitions
    nginx.ingress.kubernetes.io/auth-secret: "basic-auth"
    # message to display with an appropriate context why the authentication is required
    nginx.ingress.kubernetes.io/auth-realm: "Authentication Required"  
spec:
  ingressClassName: alb # Ingress Class
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

Apply it using command:

```bash
kubectl apply -f nginx-ingress-basic-auth.yaml
```


Access it using the host name.


## Conclusion
Basic Auth provides a straightforward mechanism to restrict access by requiring a valid username and password before users can reach your application.

This method is especially useful for quickly protecting internal tools, development environments, or staging applications without setting up a full-fledged authentication system. While it should not be considered a comprehensive security measure—especially without HTTPS—it serves as a simple and effective first layer of protection in many use cases. -->

