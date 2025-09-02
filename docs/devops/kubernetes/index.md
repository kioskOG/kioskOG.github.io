---
title: Kubernetes Projects
layout: home
parent: Devops
nav_order: 2
permalink: /docs/devops/kubernetes/
description: Documentation for various Kubernetes-related projects.
---

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Kubernetes Projects — Docs</title>
  <style>
    :root {
      --primary-color: #ffb347;
      --light-primary-shade: #ffd97d;
      --bg-dark: #070708;
      --card-bg-dark: rgba(25,25,34,0.7);
      --section-bg-dark: rgba(25,25,34,0.6);
      --text-dark: #e0e0e0;
      --muted: #a7a7a7;
      --accent-purple: #9c27b0;
      --accent-pink: #ff0080;
      --border: rgba(156,39,176,0.28);
      --code-bg-dark: rgba(13,13,16,0.7);
    }
    body {
      margin: 0;
      background-color: var(--bg-dark);
      background-image: radial-gradient(circle at top left, #2f0a5d 0%, transparent 50%),
                        radial-gradient(circle at bottom right, #004d40 0%, transparent 50%);
      background-blend-mode: screen;
      color: var(--text-dark);
      font: 16px/1.65 'Inter', system-ui, sans-serif;
    }
    .wrap { max-width: 1100px; margin: 40px auto; padding: 0 20px; }
    .hero {
      background: linear-gradient(180deg, rgba(156,39,176,.10), rgba(255,179,71,.06));
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 32px 28px;
      box-shadow: 0 10px 30px rgba(0,0,0,.32);
      margin-bottom: 28px;
    }
    .h1 {
      font-size: clamp(28px, 4vw, 40px);
      font-weight: 800;
      margin: 0 0 12px;
      background: linear-gradient(270deg, var(--primary-color), #ff8c00, var(--primary-color));
      background-size: 600% 600%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientMove 8s ease infinite;
    }
    @keyframes gradientMove {
      0%{background-position:0% 50%}
      50%{background-position:100% 50%}
      100%{background-position:0% 50%}
    }
    .subtitle { color: var(--muted); font-size: 16px; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: var(--code-bg-dark);
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,.35);
    }
    th, td {
      border: 1px solid var(--border);
      padding: 10px 12px;
      text-align: left;
      color: var(--text-dark);
    }
    th {
      background: rgba(156,39,176,.30);
      color: var(--primary-color);
    }
    tr:nth-child(odd) td { background: rgba(156,39,176,.08); }
    a { color: var(--primary-color); text-decoration: none; }
    a:hover { color: var(--accent-pink); }
  </style>
</head>
<body>
  <main class="wrap">
    <header class="hero">
      <h1 class="h1">☸️ Kubernetes Projects</h1>
      <p class="subtitle">Documentation for various Kubernetes projects including Ingress, Cilium, Helm, Karpenter, and observability integrations.</p>
    </header>

    <section>
      <h2><i class="fas fa-list"></i> Available Guides</h2>
      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><a href="/docs/devops/kubernetes/velaro/">Velaro</a></td><td>Deploying and managing Velaro on Kubernetes.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/Traefik/">Traefik</a></td><td>Configuring and deploying Traefik as an Ingress controller.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/Cert-manager/">Cert-manager</a></td><td>Managing TLS certificates with cert-manager.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/coredns-custom-domains/">CoreDNS Custom Domains</a></td><td>Configuring custom domains with CoreDNS.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/debug-containers/">Debug Containers</a></td><td>Techniques for debugging containers running in Kubernetes.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/Grafana-password-reset/">Grafana Password Reset</a></td><td>Resetting Grafana passwords in Kubernetes.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/cilium/cilium-intro/">Intro to Cilium & Hubble</a></td><td>Introduction to Cilium and Hubble.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/cilium/cilium-installation-on-eks/">Install Cilium & Hubble on EKS</a></td><td>Install Cilium & Hubble on EKS.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/prometheus-grafana/">Prometheus & Grafana on EKS</a></td><td>Install Prometheus & Grafana on EKS.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/cilium/cilium-monitoring/">Cilium Monitoring</a></td><td>Cilium Monitoring using Prometheus & Grafana.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/helm">Helm Introduction</a></td><td>Documentation for Helm introduction.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/AWS-ECS-to-EKS-Migration/">ECS to EKS Migration (POC)</a></td><td>POC for AWS ECS to EKS migration with CloudMap service discovery.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/Kubernetes-NodePort-and-iptables-rules/">NodePort & iptables Rules</a></td><td>Documentation on Kubernetes NodePort and iptables rules.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/Kubernetes-Traffic-Policies/">Service Traffic Routing & Policies</a></td><td>Traffic Policies and routing strategies in Kubernetes.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/knative/">Knative</a></td><td>Introduction to Knative.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/knative/knative-serving/">Knative Serving</a></td><td>Documentation on Knative Serving.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/knative/knative-serving-monitoring/">Knative Serving Monitoring</a></td><td>Monitoring Knative Serving with observability tools.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/karpenter/">Karpenter</a></td><td>Introduction to Karpenter.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/karpenter/karpenter-setup-in-existing-eks-cluster/">Setup Karpenter on EKS</a></td><td>Setup Karpenter on an existing EKS cluster.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/karpenter/karpenter-monitoring/">Karpenter Monitoring</a></td><td>Monitoring Karpenter with Prometheus & Grafana.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/eks-logs-into-cloudwatch-using-fluentbit/">CloudWatch Logging with Fluent Bit</a></td><td>Logging with Fluent Bit into AWS CloudWatch.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/AWS-Load-Balancer-Controller-Setup-for-EKS/">AWS Load Balancer Controller</a></td><td>Setup of AWS Load Balancer Controller for EKS.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/Understanding-Ingress-Controllers/">Ingress Controllers</a></td><td>Understanding Ingress Controllers in Kubernetes.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/Installing-NGINX-Ingress/">Installing NGINX Ingress</a></td><td>Documentation on Installing NGINX Ingress.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/Routing-in-NGINX-Ingress-Controller/">Routing in NGINX Ingress</a></td><td>Documentation on routing in NGINX Ingress Controller.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/Basic-Authentication-using-NGINX-Ingress/">Basic Authentication in NGINX Ingress</a></td><td>Basic Authentication setup with NGINX Ingress.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/kubernetes/secure-your-app-with-https-using-self-signed-tls-certificates/">Self-Signed TLS for Apps</a></td><td>Securing applications with HTTPS using self-signed TLS certificates.</td><td>✅ Done</td></tr>
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>


<!-- # Kubernetes Projects

This section provides documentation for various Kubernetes projects.

| Project                     | Description                                                              | Status |
| --------------------------- | ------------------------------------------------------------------------ | ------ |
| [Velaro](/docs/devops/kubernetes/velaro/) | Deploying and managing Velaro on Kubernetes.                                  | Done   |
| [Traefik](/docs/devops/kubernetes/Traefik/) | Configuring and deploying Traefik as an Ingress controller on Kubernetes. | Done   |
| [Cert-manager](/docs/devops/kubernetes/Cert-manager/) | Managing TLS certificates in Kubernetes with cert-manager.                    | Done   |
| [coredns-custom-domains](/docs/devops/kubernetes/coredns-custom-domains/) | Configuring custom domains with CoreDNS in Kubernetes.                       | Done   |
| [debug-containers](/docs/devops/kubernetes/debug-containers/) | Techniques for debugging containers running in Kubernetes.                    | Done   |
| [Grafana-password-reset](/docs/devops/kubernetes/Grafana-password-reset/) | Resetting Grafana passwords in a Kubernetes deployment.                     | Done   |
| [Introduction to Cilium & Hubble](/docs/devops/kubernetes/cilium/cilium-intro/) | Cilium Introduction.                     | Done   |
| [Install Cilium & Hubble on EKS](/docs/devops/kubernetes/cilium/cilium-installation-on-eks/) | Install Cilium & Hubble on EKS.                     | Done   |
| [Install Prometheus & Grafana on EKS](/docs/devops/kubernetes/prometheus-grafana/) | Install Prometheus & Grafana on EKS.                     | Done   |
| [Cilium Monitoring using Prometheus & Grafana](/docs/devops/kubernetes/cilium/cilium-monitoring/) | Cilium Monitoring using Prometheus & Grafana.                     | Done   |
| [Helm Introduction](/docs/devops/kubernetes/helm) | Documentation for Helm Introduction                     | Done   |
| [ECS to EKS Migration (POC)](/docs/devops/kubernetes/AWS-ECS-to-EKS-Migration/) | POC Document for AWS ECS to EKS Migration while ECS is running with CloudMap service for service discovery.                     | Done   |
| [Kubernetes NodePort and iptables rules](/docs/devops/kubernetes/Kubernetes-NodePort-and-iptables-rules/) | Detailed documentation on Kubernetes NodePort and iptables rules.                     | Done   |
| [Kubernetes Service Traffic Routing & Traffic Policies](/docs/devops/kubernetes/Kubernetes-Traffic-Policies/) | Detailed documentation on Kubernetes Traffic Policies and routing strategies.                     | Done   |
| [Knative](/docs/devops/kubernetes/knative/) | Documentation on knative Introduction.                     | Done   |
| [Knative Serving](/docs/devops/kubernetes/knative/knative-serving/) | Documentation on knative serving                     | Done   |
| [Knative Serving Monitoring](/docs/devops/kubernetes/knative/knative-serving-monitoring/) | Documentation on knative serving monitoring                     | Done   |
| [Karpenter](/docs/devops/kubernetes/karpenter/) | Documentation on Karpenter  Introduction.                    | Done   |
| [Setup Karpenter on Existing EKS Cluster](/docs/devops/kubernetes/karpenter/karpenter-setup-in-existing-eks-cluster/) | Documentation on karpenter serving Setup.                     | Done   |
| [Monitoring Karpenter Using Prometheus & Grafana](/docs/devops/kubernetes/karpenter/karpenter-monitoring/) | Documentation on Karpenter monitoring Using prometheus & grafana.                     | Done   |
| [AWS CloudWatch Logging with Fluent Bit on Kubernetes](/docs/devops/kubernetes/eks-logs-into-cloudwatch-using-fluentbit/) | Documentation on AWS CloudWatch Logging with Fluent Bit on Kubernetes.                     | Done   |
| [AWS Load Balancer Controller Setup for EKS](/docs/devops/kubernetes/AWS-Load-Balancer-Controller-Setup-for-EKS/) | Documentation on AWS Load Balancer Controller Setup for EKS.                     | Done   |
| [Understanding Ingress Controllers](/docs/devops/kubernetes/Understanding-Ingress-Controllers/) | Documentation on Understanding Ingress Controllers.                     | Done   |
| [Installing NGINX Ingress](/docs/devops/kubernetes/Installing-NGINX-Ingress/) | Documentation on Installing NGINX Ingress.                     | Done   |
| [Routing in NGINX Ingress Controller](/docs/devops/kubernetes/Routing-in-NGINX-Ingress-Controller/) | Documentation on Routing in NGINX Ingress Controller.                     | Done   |
| [Basic Authentication using NGINX Ingress](/docs/devops/kubernetes/Basic-Authentication-using-NGINX-Ingress/) | Documentation on Basic Authentication using NGINX Ingress.                     | Done   |
| [Secure Your App with HTTPS using Self-Signed TLS Certificates](/docs/devops/kubernetes/secure-your-app-with-https-using-self-signed-tls-certificates/) | Documentation on Secure Your App with HTTPS using Self-Signed TLS Certificates.                     | Done   | -->
