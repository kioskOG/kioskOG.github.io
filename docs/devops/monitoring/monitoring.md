---
title: monitoring
layout: full-bleed-glass
parent: Devops
nav_order: 5
permalink: /docs/devops/monitoring/
---

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Linux Projects — Docs</title>
  <style>
    :root{
      /* Same tokens as Home/About */
      --primary-color:#ffb347;
      --light-primary-shade:#ffd97d;
      --contact-secondary-purple:#9c27b0;

      --bg-dark:#070708;
      --text-dark:#e0e0e0;

      /* glass */
      --glass-bg: rgba(255,255,255,0.06);
      --glass-stroke: rgba(255,255,255,0.20);
      --glass-shadow: 0 10px 40px rgba(0,0,0,0.45);
      --glass-blur: 24px;
      --glass-sat: 160%;

      --muted:#a7a7a7;
    }

    /* Base + ambient (same as Home) */
    body{
      margin:0; color:var(--text-dark);
      background:#070708;
      background-image:
        radial-gradient(circle at top left, #2f0a5d 0%, transparent 50%),
        radial-gradient(circle at bottom right, #004d40 0%, transparent 50%);
      background-blend-mode:screen;
      font:16px/1.65 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    }
    body::before{
      content:"";
      position:fixed; inset:auto auto 10% -10%;
      width:55vmax; height:55vmax; border-radius:50%;
      background: radial-gradient(circle at 30% 30%, rgba(255,180,70,.35), transparent 45%),
                  radial-gradient(circle at 70% 60%, rgba(156,39,176,.28), transparent 50%);
      filter: blur(60px) saturate(140%);
      opacity:.45; z-index:-1; animation: floaty 18s ease-in-out infinite;
    }
    @keyframes floaty{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(6%,-4%) scale(1.06)}}

    .wrap{ max-width:1100px; margin:40px auto; padding:0 20px; }

    /* HERO (glass) */
    .hero{
      background:
        radial-gradient(120% 160% at 0% 0%, rgba(255,255,255,0.08), transparent 60%),
        linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04)),
        var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
      -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
      border: 1px solid color-mix(in srgb, var(--contact-secondary-purple) 28%, white 0%);
      box-shadow: var(--glass-shadow);
      border-radius:18px; padding:32px 28px; margin-bottom:28px; position:relative; overflow:hidden;
    }
    .hero::before{
      content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
      background: linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.12) 18%, rgba(255,255,255,0.06) 35%, transparent 55%);
      mask: radial-gradient(130% 60% at 50% -20%, black 40%, transparent 60%);
    }
    .h1{
      font-size:clamp(28px,4vw,40px); margin:0 0 10px; font-weight:800;
      background: linear-gradient(270deg, var(--primary-color), #ff8c00, var(--primary-color));
      background-size:600% 600%;
      -webkit-background-clip:text; -webkit-text-fill-color:transparent;
      animation: gradientMove 8s ease infinite;
      text-shadow: 0 0 12px rgba(255,140,0,.25), 0 0 28px rgba(255,179,71,.2);
    }
    @keyframes gradientMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    .subtitle{ color:var(--muted); margin:0; }

    /* Section (glass) */
    .section-glass{
      background:
        linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.04)),
        var(--glass-bg);
      backdrop-filter: blur(calc(var(--glass-blur) - 6px)) saturate(var(--glass-sat));
      -webkit-backdrop-filter: blur(calc(var(--glass-blur) - 6px)) saturate(var(--glass-sat));
      border: 1px solid var(--glass-stroke);
      border-radius:14px;
      padding:18px 16px 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,.32);
    }
    .section-title{
      display:flex; align-items:center; gap:10px; margin:0 0 8px 6px;
      color:var(--primary-color); font-weight:800; letter-spacing:.2px;
    }

    /* Table */
    .table-wrap{ overflow:auto; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,.35); }
    table{ width:100%; border-collapse:collapse; min-width:720px; background: rgba(13,13,16,0.7); }
    thead th{
      position:sticky; top:0; z-index:1; text-align:left; font-weight:800;
      padding:12px 14px; color:#16181f;
      background: linear-gradient(90deg, var(--light-primary-shade), var(--primary-color));
      border-bottom:1px solid color-mix(in srgb, var(--contact-secondary-purple) 35%, white 0%);
    }
    tbody td{
      padding:12px 14px; color:var(--text-dark);
      border-top:1px solid color-mix(in srgb, var(--contact-secondary-purple) 28%, white 0%);
    }
    tbody tr:nth-child(odd) td{ background: rgba(156,39,176,.08); }
    tbody tr:hover td{ background: rgba(156,39,176,.14); }

    a{ color:var(--primary-color); text-decoration:none; font-weight:700; }
    a:hover{ color:#ffcd76; text-decoration:underline; }

    /* Mobile: card rows */
    @media (max-width:720px){
      thead{ display:none; }
      table{ min-width:0; }
      tbody tr{
        display:block; margin:12px; border:1px solid color-mix(in srgb, var(--contact-secondary-purple) 28%, white 0%);
        border-radius:12px; overflow:hidden; background:rgba(255,255,255,.03);
        box-shadow:0 4px 12px rgba(0,0,0,.25);
      }
      tbody td{ display:flex; gap:10px; border:none !important; padding:10px 12px; }
      tbody td::before{
        content: attr(data-th);
        flex:none; width:42%; color:var(--light-primary-shade); font-weight:800;
      }
    }

    @media (prefers-reduced-motion: reduce){ *{animation:none !important; transition:none !important;} }
  </style>
</head>
<body>
  <main class="wrap">
    <header class="hero">
      <h1 class="h1">📊 Monitoring Projects</h1>
      <p class="subtitle">Documentation for deploying and using Apache HertzBeat and Grafana Tempo with OpenTelemetry.</p>
    </header>

    <section class="section-glass" aria-labelledby="monitoring-guides-title">
      <h2 id="monitoring-guides-title" class="section-title"><span aria-hidden="true">📚</span> Available Guides</h2>

      <div class="table-wrap">
        <table aria-describedby="monitoring-guides-title">
          <thead>
            <tr>
              <th scope="col">Deployment Method</th>
              <th scope="col">Description</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-th="Deployment Method"><a href="/docs/devops/monitoring/Apache-HertzBeat/">Overview of Apache HertzBeat</a></td>
              <td data-th="Description">Overview of Apache HertzBeat, its features, and use cases.</td>
              <td data-th="Status">✅ Done</td>
            </tr>
            <tr>
              <td data-th="Deployment Method"><a href="/docs/devops/monitoring/Apache-HertzBeat-docker/">Apache HertzBeat Docker Deployment</a></td>
              <td data-th="Description">Deploying Apache HertzBeat using Docker.</td>
              <td data-th="Status">✅ Done</td>
            </tr>
            <tr>
              <td data-th="Deployment Method"><a href="/docs/devops/monitoring/Apache-HertzBeat-docker-compose/">Apache HertzBeat Docker Compose Deployment</a></td>
              <td data-th="Description">Deploying Apache HertzBeat using Docker Compose for multi-container setups.</td>
              <td data-th="Status">✅ Done</td>
            </tr>
            <tr>
              <td data-th="Deployment Method"><a href="/docs/devops/monitoring/grafana_tempo/">Introduction to Distributed Tracing & Grafana Tempo</a></td>
              <td data-th="Description">Introduction to Distributed Tracing & Grafana Tempo.</td>
              <td data-th="Status">✅ Done</td>
            </tr>
            <tr>
              <td data-th="Deployment Method"><a href="/docs/devops/monitoring/grafana_tempo/Grafana-Tempo-Docker/">Setting Up Grafana Tempo via Docker</a></td>
              <td data-th="Description">Documentation for Setting Up Grafana Tempo via Docker.</td>
              <td data-th="Status">✅ Done</td>
            </tr>
            <tr>
              <td data-th="Deployment Method"><a href="/docs/devops/monitoring/grafana_tempo/grafana-tempo-sample-app/">Setting Up Python application using OpenTelemetry</a></td>
              <td data-th="Description">Instrument a Python application using OpenTelemetry and send traces to Grafana Tempo. 🚀</td>
              <td data-th="Status">✅ Done</td>
            </tr>
            <tr>
              <td data-th="Deployment Method"><a href="/docs/devops/monitoring/grafana_tempo/grafana-tempo-loki-promtail-and-prometheus/">Setting Up Python app with OpenTelemetry & Logging</a></td>
              <td data-th="Description">Instrument a Python application using OpenTelemetry and send traces to Grafana Tempo with Logging using Loki. 🚀</td>
              <td data-th="Status">✅ Done</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</body>
</html>
