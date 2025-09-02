---
title: Networking
layout: home
parent: Devops
nav_order: 8
permalink: /docs/devops/Networking/
---

<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Networking — Documentation Index</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
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

    body { background-color: var(--bg-dark); color: var(--text-dark); font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; background-image: radial-gradient(circle at top left, #2f0a5d 0%, transparent 50%), radial-gradient(circle at bottom right, #004d40 0%, transparent 50%); background-blend-mode: screen; }

    .wrap { max-width: 980px; margin: 40px auto 64px; padding: 0 20px; }

    .hero { background: linear-gradient(180deg, rgba(156,39,176,.10), rgba(255,179,71,.06)); border: 1px solid var(--border); border-radius: 18px; padding: 32px 28px; box-shadow: 0 10px 30px rgba(0,0,0,.32); text-align: center; }

    .h1 { font-size: clamp(28px, 4vw, 40px); font-weight: 800; background: linear-gradient(270deg, var(--primary-color), #ff8c00, var(--primary-color)); background-size: 600% 600%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: gradientMove 8s ease infinite; margin: 0; }
    @keyframes gradientMove { 0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%} }

    .subtitle { color: var(--muted); font-size: 16px; margin-top: 10px; }

    .section { background-color: var(--section-bg-dark); padding: 28px; border-radius: 12px; margin-top: 28px; border: 1px solid var(--border); box-shadow: 0 4px 16px rgba(0,0,0,0.25); }

    table { width: 100%; border-collapse: collapse; margin: 14px 0; background: var(--code-bg-dark); border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,.35); }
    th, td { border: 1px solid var(--border); padding: 10px 12px; text-align: left; vertical-align: top; color: var(--text-dark); }
    th { background: rgba(156,39,176,.30); color: var(--primary-color); }
    tr:nth-child(odd) td { background: rgba(156,39,176,.08); }
  </style>
</head>
<body>
  <main class="wrap">
    <header class="hero">
      <h1 class="h1">📡 Networking</h1>
      <p class="subtitle">Documentation index for networking topics and deployment guides</p>
    </header>

    <section class="section">
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
            <td><a href="/docs/devops/Networking/How-NAT-Saved-the-Internet/">How NAT Saved the Internet</a></td>
            <td>Documentation for how IPv4 exhaustion led to NAT saving the Internet.</td>
            <td>✅ Done</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>


<!-- # Networking
{: .no_toc .text-delta }

1. TOC
{:toc}

This section provides documentation for deploying and using Apache HertzBeat, an open-source, real-time monitoring system.

| Deployment Method         | Description                                                                     | Status |
|--------------------------|---------------------------------------------------------------------------------|--------|
| [How NAT Saved the Internet](/docs/devops/Networking/How-NAT-Saved-the-Internet/) | Documentation for How NAT Saved the Internet.                       | Done   | -->
