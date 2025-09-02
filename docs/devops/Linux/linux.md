---
title: Linux Projects
layout: home
parent: Devops
nav_order: 3
permalink: /docs/devops/Linux/
---

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Linux Projects — Docs</title>
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
      <h1 class="h1">🐧 Linux Projects</h1>
      <p class="subtitle">Documentation for various Linux projects, focusing on SIEM, XDR, HA, and networking.</p>
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
          <tr><td><a href="/docs/devops/Linux/SIEM-And-XDR/wazuh-introduction/">Wazuh</a></td><td>Introduction to Wazuh, an open-source security monitoring solution.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Linux/SIEM-And-XDR/wazuh-indexer-setup/">Wazuh Indexer Setup</a></td><td>Setting up the Wazuh Indexer component.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Linux/SIEM-And-XDR/wazuh-server-setup/">Wazuh Server Setup</a></td><td>Configuring the Wazuh Server.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Linux/SIEM-And-XDR/wazuh-dashboard-setup/">Wazuh Dashboard Setup</a></td><td>Setting up the Wazuh Dashboard for visualization and analysis.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Linux/SIEM-And-XDR/FIM/">FIM</a></td><td>Implementing File Integrity Monitoring (FIM) with Wazuh.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Linux/SIEM-And-XDR/malware-detection-and-deletion-and-slack-intergarion/">Malware Detection & Deletion with Slack</a></td><td>Configure Wazuh for malware detection with Slack notifications.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Linux/SIEM-And-XDR/wazuh-sso-using-keycloak/">Wazuh SSO Using Keycloak</a></td><td>Integrating Wazuh with Keycloak for SSO.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Linux/SIEM-And-XDR/wazuh-to-monitor-docker/">Monitor Docker Environment Using Wazuh</a></td><td>Monitoring Docker environments with Wazuh.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Linux/SIEM-And-XDR/wazuh-monitoring-container-runtime/">Monitoring Container Runtime Using Wazuh</a></td><td>Monitoring container runtimes with Wazuh.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Linux/Iptables/iptables/">Quick Intro to Linux iptables</a></td><td>Introduction to Linux iptables.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Linux/Iptables/ipvs-loadbalancer/">IPVS Load Balancer with NGINX</a></td><td>Setting up IPVS Load Balancer with NGINX Application Servers.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Linux/vpn/vpn/">VPN</a></td><td>Introduction to VPN.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Linux/vpn/openvpn-vs-netbird/">OpenVPN vs NetBird</a></td><td>Differences between OpenVPN and NetBird.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Linux/kernel/kernel/">Linux Kernel</a></td><td>Documentation on Linux Kernel.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Linux/eBPF/">What is eBPF and Why is it Important?</a></td><td>Documentation on eBPF.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Linux/Postgresql/SETTING-UP-A-POSTGRESQL-HA-CLUSTER/">HA PostgreSQL with Patroni, etcd & HAProxy</a></td><td>Setting Up a High Availability PostgreSQL Cluster.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Linux/Etcd-cluster-setup/Etcd-cluster-setup/">Highly Available etcd Cluster</a></td><td>Setting up a 3-Node etcd Cluster on Ubuntu.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Linux/HAProxy-cluster-setup/HAProxy-cluster-setup/">HAProxy Failover with Keepalived</a></td><td>HAProxy Failover Setup with Keepalived and AWS Elastic IP.</td><td>✅ Done</td></tr>
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>



<!-- # Linux Projects
{: .no_toc .text-delta }

1. TOC
{:toc}
Select a project to view details.

This section provides documentation for various Linux projects, with a focus on SIEM and XDR solutions.

| Project                     | Description                                                                                             | Status |
| --------------------------- | ------------------------------------------------------------------------------------------------------- | ------ |
| [Wazuh](/docs/devops/Linux/SIEM-And-XDR/wazuh-introduction/) | Introduction to Wazuh, an open-source security monitoring solution.                                | Done   |
| [Wazuh Indexer Setup](/docs/devops/Linux/SIEM-And-XDR/wazuh-indexer-setup/) | Setting up the Wazuh Indexer component.                                                              | Done   |
| [Wazuh Server Setup](/docs/devops/Linux/SIEM-And-XDR/wazuh-server-setup/) | Configuring the Wazuh Server.                                                                       | Done   |
| [Wazuh Dashboard Setup](/docs/devops/Linux/SIEM-And-XDR/wazuh-dashboard-setup/) | Setting up the Wazuh Dashboard for visualization and analysis.                                       | Done   |
| [FIM](/docs/devops/Linux/SIEM-And-XDR/FIM/) | Implementing File Integrity Monitoring (FIM) with Wazuh.                                             | Done   |
| [Malware Detection and Deletion with Slack Integration](/docs/devops/Linux/SIEM-And-XDR/malware-detection-and-deletion-and-slack-intergarion/) | Configuring Wazuh for malware detection and automated deletion, including Slack notifications. | Done   |
| [Wazuh SSO Using Keycloak](/docs/devops/Linux/SIEM-And-XDR/wazuh-sso-using-keycloak/) | Integrating Wazuh with Keycloak for Single Sign-On (SSO).                                          | Done   |
| [Monitor Docker Environment Using Wazuh](/docs/devops/Linux/SIEM-And-XDR/wazuh-to-monitor-docker/) | Monitoring Docker environments using Wazuh.                                                          | Done   |
| [Monitoring Container Runtime Using Wazuh](/docs/devops/Linux/SIEM-And-XDR/wazuh-monitoring-container-runtime/) | Monitoring container runtimes with Wazuh.                                                             | Done   |
| [Quick Introduction to Linux iptables](/docs/devops/Linux/Iptables/iptables/) | Introduction to Linux iptables.                                                             | Done   |
| [Setting up IPVS Load Balancer with NGINX Application Servers](/docs/devops/Linux/Iptables/ipvs-loadbalancer/) | Setting up IPVS Load Balancer with NGINX Application Servers.                                                             | Done   |
| [VPN](/docs/devops/Linux/vpn/vpn/) | Introduction to VPN.   | Done   |
| [OpenVPN vs NetBird](/docs/devops/Linux/vpn/openvpn-vs-netbird/) | Documentation for Differences Between OpenVPN and NetBird.                                                             | Done   |
| [Linux Kernel](/docs/devops/Linux/kernel/kernel/) |  Documentation on Linux Kernel.                                                             | Done   |
| [What is eBPF and Why is it Important?](/docs/devops/Linux/eBPF/) | Documentation on Linux Kernel.                                                             | Done   |
| [What is eBPF and Why is it Important?](/docs/devops/Linux/eBPF/) | Documentation on Linux Kernel.                                                             | Done   |
| [What is eBPF and Why is it Important?](/docs/devops/Linux/eBPF/) | Documentation on Linux Kernel.                                                             | Done   |
| [Setting Up a High Availability (HA) PostgreSQL Cluster with Patroni, etcd, and HAProxy](/docs/devops/Linux/Postgresql/SETTING-UP-A-POSTGRESQL-HA-CLUSTER/) | Setting Up a High Availability (HA) PostgreSQL Cluster with Patroni, etcd, and HAProxy.                                                             | Done   |
| [Setting Up a Highly Available 3-Node etcd Cluster on Ubuntu](/docs/devops/Linux/Etcd-cluster-setup/Etcd-cluster-setup/) | Setting Up a Highly Available 3-Node etcd Cluster on Ubuntu.                                                             | Done   |
| [High Availability HAProxy Failover Setup with Keepalived and AWS Elastic IP](/docs/devops/Linux/HAProxy-cluster-setup/HAProxy-cluster-setup/) | High Availability HAProxy Failover Setup with Keepalived and AWS Elastic IP.                                                             | Done   | -->