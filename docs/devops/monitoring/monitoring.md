---
title: monitoring
layout: home
parent: Devops
nav_order: 5
permalink: /docs/devops/monitoring/
---

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Monitoring Projects — Docs</title>
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
      <h1 class="h1">📊 Monitoring Projects</h1>
      <p class="subtitle">Documentation for deploying and using Apache HertzBeat and Grafana Tempo with OpenTelemetry.</p>
    </header>

    <section>
      <h2><i class="fas fa-list"></i> Available Guides</h2>
      <table>
        <thead>
          <tr>
            <th>Deployment Method</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><a href="/docs/devops/monitoring/Apache-HertzBeat/">Overview of Apache HertzBeat</a></td>
            <td>Overview of Apache HertzBeat, its features, and use cases.</td>
            <td>✅ Done</td>
          </tr>
          <tr>
            <td><a href="/docs/devops/monitoring/Apache-HertzBeat-docker/">Apache HertzBeat Docker Deployment</a></td>
            <td>Deploying Apache HertzBeat using Docker.</td>
            <td>✅ Done</td>
          </tr>
          <tr>
            <td><a href="/docs/devops/monitoring/Apache-HertzBeat-docker-compose/">Apache HertzBeat Docker Compose Deployment</a></td>
            <td>Deploying Apache HertzBeat using Docker Compose for multi-container setups.</td>
            <td>✅ Done</td>
          </tr>
          <tr>
            <td><a href="/docs/devops/monitoring/grafana_tempo/">Introduction to Distributed Tracing & Grafana Tempo</a></td>
            <td>Introduction to Distributed Tracing & Grafana Tempo.</td>
            <td>✅ Done</td>
          </tr>
          <tr>
            <td><a href="/docs/devops/monitoring/grafana_tempo/Grafana-Tempo-Docker/">Setting Up Grafana Tempo via Docker</a></td>
            <td>Documentation for Setting Up Grafana Tempo via Docker.</td>
            <td>✅ Done</td>
          </tr>
          <tr>
            <td><a href="/docs/devops/monitoring/grafana_tempo/grafana-tempo-sample-app/">Setting Up Python application using OpenTelemetry</a></td>
            <td>Instrument a Python application using OpenTelemetry and send traces to Grafana Tempo. 🚀</td>
            <td>✅ Done</td>
          </tr>
          <tr>
            <td><a href="/docs/devops/monitoring/grafana_tempo/grafana-tempo-loki-promtail-and-prometheus/">Setting Up Python app with OpenTelemetry & Logging</a></td>
            <td>Instrument a Python application using OpenTelemetry and send traces to Grafana Tempo with Logging using Loki. 🚀</td>
            <td>✅ Done</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>



<!-- # Monitoring Projects
{: .no_toc .text-delta }

1. TOC
{:toc}

This section provides documentation for deploying and using Apache HertzBeat, an open-source, real-time monitoring system.

| Deployment Method         | Description                                                                     | Status |
|--------------------------|---------------------------------------------------------------------------------|--------|
| [Overview of Apache HertzBeat](/docs/devops/monitoring/Apache-HertzBeat/) | Overview of Apache HertzBeat, its features, and use cases.                       | Done   |
| [Apache HertzBeat Docker Deployment](/docs/devops/monitoring/Apache-HertzBeat-docker/) | Deploying Apache HertzBeat using Docker.                                      | Done   |
| [Apache HertzBeat Docker Compose Deployment](/docs/devops/monitoring/Apache-HertzBeat-docker-compose/) | Deploying Apache HertzBeat using Docker Compose for multi-container setups. | Done   |
| [Introduction to Distributed Tracing & Grafana Tempo](/docs/devops/monitoring/grafana_tempo/) | Introduction to Distributed Tracing & Grafana Tempo. | Done   |
| [Setting Up Grafana Tempo via Docker](/docs/devops/monitoring/grafana_tempo/Grafana-Tempo-Docker/) | Documentation for Setting Up Grafana Tempo via Docker. | Done   |
| [Setting Up Python application using OpenTelemetry](/docs/devops/monitoring/grafana_tempo/grafana-tempo-sample-app/) | Documentation for instrument a Python application using OpenTelemetry and send traces to Grafana Tempo. 🚀 | Done   |
| [Setting Up Python application using OpenTelemetry & Tracing with Logging (Loki)](/docs/devops/monitoring/grafana_tempo/grafana-tempo-loki-promtail-and-prometheus/) | Documentation for instrument a Python application using OpenTelemetry and send traces to Grafana Tempo with Logging using Loki. 🚀 | Done   |

 -->
