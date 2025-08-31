---
title: Understanding Ingress Controllers
layout: default
parent: Kubernetes Projects
nav_order: 17
permalink: /docs/devops/kubernetes/Understanding-Ingress-Controllers/
description: Documentation on Understanding Ingress Controllers
---

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Kubernetes Ingress — A Practical Guide</title>
  <meta name="description" content="Clear, production‑oriented explanation of Kubernetes Ingress, controllers, TLS, and advanced features with an AWS ALB vs NGINX comparison." />
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

    .callout { display: grid; grid-template-columns: 28px 1fr; gap: 10px; align-items: start; padding: 14px 16px; border: 1px solid var(--border); border-radius: 12px; background: linear-gradient(180deg, rgba(156,39,176,.10), rgba(255,179,71,.06)); margin: 18px 0; }
    .callout strong { color: var(--accent-purple); }

    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin: 16px 0 4px; }
    .card { background: var(--card-bg-dark); border: 1px solid var(--border); border-radius: 14px; padding: 14px 14px 12px; box-shadow: 0 6px 18px rgba(0,0,0,.25); }
    .note { color: var(--muted); font-size: 14px; }

    code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
    code { background: rgba(255,179,71,.10); padding: .15em .4em; border-radius: 6px; color: var(--primary-color); }
    pre { background: var(--code-bg-dark); color: #e2e8f0; border-radius: 12px; padding: 14px 16px; overflow: auto; border: 1px solid rgba(255,179,71,.22); box-shadow: 0 2px 10px rgba(0,0,0,.35); }

    table { width: 100%; border-collapse: collapse; margin: 14px 0; background: var(--code-bg-dark); border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,.35); }
    th, td { border: 1px solid var(--border); padding: 10px 12px; text-align: left; vertical-align: top; color: var(--text-dark); }
    th { background: rgba(156,39,176,.30); color: var(--primary-color); }
    tr:nth-child(odd) td { background: rgba(156,39,176,.08); }

    .footer { color: var(--muted); font-size: 13px; margin-top: 26px; }
    .pill { display: inline-block; padding: 2px 8px; border: 1px solid var(--border); border-radius: 999px; font-size: 12px; color: var(--muted); }
  </style>
</head>
<body>
  <main class="wrap">
    <header class="hero" id="top">
      <div class="eyebrow">Networking · Kubernetes</div>
      <h1 class="h1">Kubernetes Ingress — A Practical Guide</h1>
      <p class="subtitle">How to securely expose multiple microservices from a Kubernetes cluster with a single entry point, TLS termination, and centralized control.</p>

      <nav class="toc">
        <strong>On this page</strong>
        <ul>
          <li><a href="#problem">Why not just NodePort / LoadBalancer?</a></li>
          <li><a href="#what-is-ingress">What is Kubernetes Ingress?</a></li>
          <li><a href="#controllers">Ingress Controllers</a></li>
          <li><a href="#routing">Routing with Ingress Rules</a></li>
          <li><a href="#tls">Securing Ingress with TLS</a></li>
          <li><a href="#advanced">Advanced Ingress Features</a></li>
          <li><a href="#comparison">AWS Load Balancer Controller vs NGINX</a></li>
          <li><a href="#conclusion">Conclusion</a></li>
        </ul>
      </nav>
    </header>

    <section id="problem">
      <h2>Context — exposing services from a cluster</h2>
      <p>As organizations adopt microservices and Kubernetes for deploying containerized applications, one critical question arises:</p>
      <p><em>“How do external users securely access my services running inside the Kubernetes cluster?”</em></p>
      <p>By default, Kubernetes provides service types like <strong>ClusterIP</strong>, <strong>NodePort</strong>, and <strong>LoadBalancer</strong> to expose applications. However:</p>
      <div class="cards">
        <div class="card"><strong>ClusterIP</strong><br><span class="note">Internal access only (cluster‑local).</span></div>
        <div class="card"><strong>NodePort</strong><br><span class="note">Exposes on every node’s IP/port — rarely ideal for production.</span></div>
        <div class="card"><strong>LoadBalancer</strong><br><span class="note">One external LB per Service — costly and harder to manage at scale.</span></div>
      </div>

      <p>Imagine a production app like <code>url shortener</code> with:</p>
      <ul>
        <li>A frontend UI service</li>
        <li>An Auth service</li>
        <li>A short‑URL service</li>
        <li>A report service</li>
        <li>A metrics endpoint</li>
      </ul>
      <p>Using a separate <strong>LoadBalancer</strong> for each would quickly increase cost and fragment control.</p>
    </section>

    <section id="what-is-ingress">
      <h2>What is Kubernetes Ingress?</h2>
      <p><strong>Kubernetes Ingress</strong> is the native solution for managing external access to your Services. It acts as a reverse proxy and traffic director, routing requests based on <em>hostname</em>, <em>path</em>, or even <em>headers</em> — all from a single IP address or DNS name.</p>
      <ul>
        <li>Serve multiple Services behind one domain</li>
        <li>Apply routing logic without touching individual Services</li>
        <li>Secure traffic using TLS/SSL</li>
        <li>Load balance across Pods</li>
        <li>Implement rewrites, redirects, auth, and more</li>
      </ul>
      <p><em>Ingress is the traffic controller at the edge of your Kubernetes cluster.</em></p>

      <div class="callout">
        <div aria-hidden="true">🧭</div>
        <div>
          <strong>Note:</strong> An <strong>Ingress <em>Controller</em></strong> is the engine that reads your Ingress rules and translates them into real‑world proxy configurations (e.g., NGINX or AWS ALB).
        </div>
      </div>
    </section>

    <section id="controllers">
      <h2>1) An Introduction to Kubernetes Ingress</h2>
      <p>NodePort/LoadBalancer can work for small apps, but they don’t scale well in environments with many Services. Ingress defines HTTP(S) routing rules to expose multiple Services over a single IP or domain — the Kubernetes‑native, scalable approach.</p>

      <h2>2) Ingress Controllers: Making Ingress Work</h2>
      <p>The <em>Ingress resource</em> is configuration only. You need an <strong>Ingress Controller</strong> to process those rules and handle the actual traffic.</p>
      <h3>What is an Ingress Controller?</h3>
      <p>A controller runs in‑cluster (often a proxy like NGINX, HAProxy, etc.), watches for Ingress objects, and applies the specified rules.</p>
      <h3>Popular controllers</h3>
      <ul>
        <li><strong>NGINX Ingress Controller</strong> (open source, CNCF maintained)</li>
        <li><strong>AWS Load Balancer Controller</strong> (for Amazon EKS)</li>
        <li><strong>Traefik</strong>, <strong>Contour</strong>, <strong>Istio Gateway</strong> (service‑mesh contexts)</li>
      </ul>
      <h3>How it works</h3>
      <ol>
        <li>Deploy the controller into your cluster</li>
        <li>Define Ingress resources</li>
        <li>The controller dynamically updates routing rules</li>
      </ol>
    </section>

    <section id="routing">
      <h2>3) Routing Traffic with Ingress Rules</h2>
      <p>Ingress rules define how traffic is routed to backend Services:</p>
      <ul>
        <li><strong>Host‑based</strong>: route by domain (e.g., <code>api.example.com</code>, <code>admin.example.com</code>)</li>
        <li><strong>Path‑based</strong>: route by URL path (e.g., <code>/login</code>, <code>/users</code>)</li>
        <li><strong>Header‑based</strong>: supported by advanced controllers</li>
      </ul>
    </section>

    <section id="tls">
      <h2>4) Securing Ingress with TLS</h2>
      <p>One of the most powerful features of Ingress is <strong>TLS termination</strong> — decrypting HTTPS at the edge.</p>
      <ul>
        <li><strong>AWS ACM</strong> (with AWS Load Balancer Controller)</li>
        <li><strong>cert‑manager</strong> (with NGINX and others)</li>
        <li><strong>Let’s Encrypt</strong> certificates</li>
      </ul>
    </section>

    <section id="advanced">
      <h2>5) Advanced Ingress Features</h2>
      <ul>
        <li><strong>URL rewrites</strong>: modify request paths before forwarding</li>
        <li><strong>Load balancing</strong>: distribute traffic across replicas</li>
        <li><strong>Rate limiting</strong>: control requests per client</li>
        <li><strong>Header manipulation</strong>: add/modify headers</li>
        <li><strong>Authentication</strong>: basic auth, JWT, external IdPs</li>
        <li><strong>gRPC &amp; WebSockets</strong>: modern protocol support</li>
        <li><strong>Canary releases</strong>: split traffic for safer rollouts</li>
      </ul>
    </section>

    <section id="comparison">
      <h2>AWS Load Balancer Controller vs NGINX Ingress Controller</h2>
      <p>Both manage external access to Kubernetes Services, but with different trade‑offs:</p>
      <table>
        <thead>
          <tr>
            <th>Aspect</th>
            <th>AWS Load Balancer Controller</th>
            <th>NGINX Ingress Controller</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Integration</td>
            <td>Tight AWS integration (ACM, WAF, ALB/NLB)</td>
            <td>Cloud‑agnostic; works on any Kubernetes</td>
          </tr>
          <tr>
            <td>Operation Model</td>
            <td>Provisions managed ALB/NLB resources per Ingress</td>
            <td>Runs a proxy inside the cluster</td>
          </tr>
          <tr>
            <td>Flexibility</td>
            <td>Best for AWS‑native patterns</td>
            <td>Rich annotations, advanced routing/customization</td>
          </tr>
          <tr>
            <td>Cost</td>
            <td>Pays for AWS LBs (may scale with Ingresses)</td>
            <td>Primarily cluster resources; one external LB for controller</td>
          </tr>
          <tr>
            <td>Portability</td>
            <td>AWS‑specific</td>
            <td>Portable across environments</td>
          </tr>
        </tbody>
      </table>

      <div class="cards">
        <div class="card"><strong>Choose AWS LBC if</strong><br><span class="note">You’re all‑in on AWS and want native ACM/WAF/ALB/NLB integration.</span></div>
        <div class="card"><strong>Choose NGINX if</strong><br><span class="note">You need flexibility, portability, and deep config control.</span></div>
      </div>
    </section>

    <section id="conclusion">
      <h2>Conclusion</h2>
      <ul>
        <li><strong>All‑AWS stack?</strong> Prefer <em>AWS Load Balancer Controller</em> for managed, native integrations.</li>
        <li><strong>Need flexibility/portability?</strong> Prefer <em>NGINX Ingress Controller</em> for advanced routing and deep customization.</li>
      </ul>
      <p><a class="pill" href="#top">Back to top ↑</a></p>
    </section>
  </main>
</body>
</html>





<!-- As organizations adopt microservices architecture and Kubernetes for deploying containerized applications, one critical question arises:

“How do external users securely access my services running inside the Kubernetes cluster?”

By default, Kubernetes provides service types like ClusterIP, NodePort, and LoadBalancer to expose applications. However:

   * ClusterIP only allows internal access.

   * NodePort exposes your app on every node's IP and a static port — not ideal for production.

   * LoadBalancer provisions a cloud provider load balancer — but one per service, which is expensive and harder to manage at scale.

Imagine a production app like `url shortner` with:

   * A frontend UI service
   * A Auth service
   * A short-url service
   * A report service
   * A metrics endpoint

If you use LoadBalancer for each, you’ll quickly rack up cloud costs and lose centralized control.

## What is Kubernetes Ingress ?

Kubernetes Ingress is the Kubernetes-native solution for managing external access to your services. It acts as a reverse proxy and traffic director, intelligently routing requests based on hostname, path, or even headers — all from a single IP address or DNS name.

It helps you:

   * Serve multiple services behind one domain
   * Apply routing logic without touching individual services
   * Secure traffic using TLS/SSL
   * Manage load balancing across pods
   * Implement rewrites, redirects, authentication, and more


Ingress is the traffic controller at the edge of your Kubernetes cluster.

{: .note}
> Ingress Controller, which is the engine that reads your Ingress rules and translates them into real-world proxy configurations (like NGINX or AWS ALB).


1. ## An Introduction to Kubernetes Ingress

By default, Kubernetes exposes services using NodePort or LoadBalancer types. While these work for small apps, they don’t scale well for production environments with multiple services.

Kubernetes Ingress is an API object that defines HTTP/HTTPS routing rules to expose services outside the cluster. It's the Kubernetes-native way to expose multiple services over a single IP or domain.

2. ## Ingress Controllers: Making Ingress Work

The Ingress resource itself is just a configuration. You need an Ingress Controller to process those rules and handle the actual traffic routing.

What is an Ingress Controller?
It is a Kubernetes pod (usually a proxy server like NGINX, HAProxy, etc.) that watches the cluster for Ingress objects and applies the specified rules.


Popular Ingress Controllers:

   * NGINX Ingress Controller (Open-source, CNCF maintained)
   * AWS Load Balancer Controller (For Amazon EKS)
   * Traefik, Contour, Istio Gateway (in service mesh environments)

How it works:

   * Deploy the controller into your cluster
   * Define Ingress resources
   * The controller dynamically updates routing rules


3. ## Routing Traffic with Ingress Rules

Ingress rules define the way the traffic is routed to underlying resources

   * Host-based: Route by domain (api.example.com, admin.example.com)
   * Path-based: Route by URL path (/login, /users)
   * Header-based: Supported in advanced ingress controllers

4. ## Securing Ingress with TLS

One of the most powerful features of Ingress is SSL/TLS termination, i.e., decrypting HTTPS traffic at the ingress level.

You can use:

   * AWS ACM (with AWS Load Balancer Controller)
   * cert-manager (with NGINX or other controllers)
   * Let’s Encrypt certificates

5. ## Advanced Ingress Features

Ingress becomes even more powerful with annotations and controller-specific configurations.

   * **URL Rewrites:** Modify incoming request paths before forwarding them to backend services.

   * **Load Balancing:** Distribute traffic evenly across multiple pod replicas.

   * **Rate Limiting:** Control the number of requests a client can make over time.

   * **Request Header Manipulation:** Add or modify headers before passing requests to services.

   * **Authentication:** Protect endpoints using basic auth, JWT, or external identity providers.

   * **gRPC and WebSocket Support:** Handle modern protocols for real-time and streaming applications.

   * **Canary Releases:** Split traffic between versions for safer deployments and A/B testing.

## AWS Load Balancer Controller vs NGINX Ingress Controller

Both AWS Load Balancer Controller and NGINX Ingress Controller serve the same core purpose — managing external access to Kubernetes services — but they take very different approaches, each with distinct advantages depending on your architecture and goals.

## Conclusion

* If you're fully invested in AWS and want a managed, integrated solution with native support for ACM, WAF, and ALB/NLB — go with the AWS Load Balancer Controller.

* If you need flexibility, advanced routing features, portability across cloud environments, or deep customization — the NGINX Ingress Controller is the better fit. -->
