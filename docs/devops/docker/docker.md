---
title: Docker Projects
layout: full-bleed #home
parent: Devops
nav_order: 1
permalink: /docs/devops/docker/
---

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Docker Projects — Docs</title>
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
      <h1 class="h1">🐳 Docker Projects</h1>
      <p class="subtitle">Documentation for various Docker-based deployments and integrations.</p>
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
          <tr><td><a href="/docs/devops/docker/Netbird/">Netbird VPN Server</a></td><td>Setting up and managing a Netbird VPN server with Docker.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/docker/traefik/">Traefik Setup with Docker</a></td><td>Configuring and deploying Traefik with Docker.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/docker/uptime-kuma/">Uptime Kuma Monitoring</a></td><td>Deploying Uptime Kuma for monitoring with Docker.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/docker/Atlasian/">Atlassian</a></td><td>Running Atlassian products (Jira, Confluence, etc.) in Docker.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/docker/Authentik/">Authentik</a></td><td>Deploying and configuring Authentik with Docker.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/docker/hashicorp-vault/">HashiCorp Vault</a></td><td>Running HashiCorp Vault securely with Docker.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/docker/Wazuh/">Wazuh</a></td><td>Deploying and configuring Wazuh with Docker.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/docker/keycloak/">Keycloak</a></td><td>Deploying and configuring Keycloak with Docker.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/docker/minio/">MinIO Introduction</a></td><td>Introduction to MinIO Object Storage.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/docker/minio-limits/">MinIO Limits</a></td><td>Understanding MinIO limits.</td><td>✅ Done</td></tr>
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>


<!-- # Docker Projects

This section provides documentation for various Docker projects.

| Project                     | Description                                            | Status |
| --------------------------- | ------------------------------------------------------ | ------ |
| [Netbird VPN Server](/docs/devops/docker/Netbird/) | Setting up and managing a Netbird VPN server with Docker. | Done   |
| [Traefik Setup with Docker](/docs/devops/docker/traefik/) | Configuring and deploying Traefik with Docker.         | Done   |
| [Uptime Kuma Monitoring](/docs/devops/docker/uptime-kuma/) | Deploying Uptime Kuma for monitoring with Docker.       | Done   |
| [Atlasian](/docs/devops/docker/Atlasian/) | Running Atlassian products (e.g., Jira, Confluence) in Docker. | Done   |
| [Authentik](/docs/devops/docker/Authentik/) | Deploying and configuring Authentik with Docker.       | Done   |
| [hashicorp-vault](/docs/devops/docker/hashicorp-vault/) | Running HashiCorp Vault securely with Docker.          | Done   |
| [Wazuh](/docs/devops/docker/Wazuh/) | Deploying and configuring Wazuh with Docker.          | Done   |
| [keycloak](/docs/devops/docker/keycloak/) | Deploying and configuring Keycloak with Docker.       | Done   |
| [Minio Introduction](/docs/devops/docker/minio/) | Introduction to MinIO Object Storage       | Done   |
| [Minio limits](/docs/devops/docker/minio-limits/) | Minio limits       | Done   | -->