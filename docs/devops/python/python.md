---
title: python
layout: home
parent: Devops
nav_order: 4
permalink: /docs/devops/python/
---


<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Python Projects — Docs</title>
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
    .wrap { max-width: 980px; margin: 40px auto; padding: 0 20px; }
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
      <h1 class="h1">🐍 Python Projects</h1>
      <p class="subtitle">Documentation for various Python-based DevOps projects and scripts.</p>
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
          <tr>
            <td><a href="/docs/devops/python/netbird-python-utility/">Netbird Python Utility</a></td>
            <td>A Python utility for managing Netbird resources and configurations.</td>
            <td>✅ Done</td>
          </tr>
          <tr>
            <td><a href="/docs/devops/python/docker-container-memory-cpu-monitoring/">Docker Container Memory/CPU Monitoring</a></td>
            <td>Scripts for monitoring Docker container resource usage (memory and CPU).</td>
            <td>✅ Done</td>
          </tr>
          <tr>
            <td><a href="/docs/devops/python/docker-container-monitoring-script/">Docker Container Monitoring Script</a></td>
            <td>A Python script for general Docker container monitoring.</td>
            <td>✅ Done</td>
          </tr>
          <tr>
            <td><a href="/docs/devops/python/greythr-selenium/README/">Greythr Attendance Automation</a></td>
            <td>A Python script for Greythr Attendance Automation.</td>
            <td>✅ Done</td>
          </tr>
          <tr>
            <td><a href="/docs/devops/python/aws-cloudmap-controller/">EKS Cloudmap controller</a></td>
            <td>EKS Cloudmap controller.</td>
            <td>✅ Done</td>
          </tr>
          <tr>
            <td><a href="/docs/devops/python/GitHub-Secrets-Scanner/github-secret-scanner/">GitHub Secrets Scanner</a></td>
            <td>A Python tool to scan repositories for leaked secrets.</td>
            <td>✅ Done</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>


<!-- # Python Projects
{: .no_toc .text-delta }

1. TOC
{:toc}

This section provides documentation for various Python-based DevOps projects and scripts.

| Project                                         | Description                                                                     | Status |
| ----------------------------------------------- | ------------------------------------------------------------------------------- | ------ |
| [Netbird Python Utility](/docs/devops/python/netbird-python-utility/) | A Python utility for managing Netbird resources and configurations.        | Done   |
| [Docker Container Memory/CPU Monitoring](/docs/devops/python/docker-container-memory-cpu-monitoring/) | Scripts for monitoring Docker container resource usage (memory and CPU). | Done   |
| [Docker Container Monitoring Script](/docs/devops/python/docker-container-monitoring-script/) | A Python script for general Docker container monitoring.                        | Done   |
| [Greythr Attendance Automation](/docs/devops/python/greythr-selenium/README/) | A Python script for Greythr Attendance Automation.                        | Done   |
| [EKS Cloudmap controller](/docs/devops/python/aws-cloudmap-controller/) | EKS Cloudmap controller.                        | Done   |
| [GitHub Secrets Scanner](/docs/devops/python/GitHub-Secrets-Scanner/github-secret-scanner/) | EKS Cloudmap controller.                        | Done   | -->

<!-- - [Netbird Python Utility](/docs/devops/python/netbird-python-utility/)
- [Docker Container Memory Cpu Monitoring](/docs/devops/python/docker-container-memory-cpu-monitoring/)
- [Docker Container Monitoring Script](/docs/devops/python/docker-container-monitoring-script/) -->
