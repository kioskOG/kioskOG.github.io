---
title: Home
layout: home
nav_order: 1
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home | Jatin Sharma</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        body {
            background-color: #121212;
            color: #ffffff;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            text-align: center;
        }
        .container {
            max-width: 900px;
            margin: auto;
            padding: 40px 20px;
        }
        .profile-img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #4caf50;
            margin-bottom: 20px;
        }
        h1 {
            font-size: 2.5em;
            color: #4caf50;
        }
        p {
            font-size: 1.2em;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px;
            font-size: 1em;
            color: #fff;
            background-color: #4caf50;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            transition: 0.3s;
        }
        .btn:hover {
            background-color: #388e3c;
        }
        .social-icons a {
            margin: 10px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="./profile-image.png" alt="Jatin Sharma" class="profile-img">  <!-- Replace with your image -->
        <h1>Welcome to My Digital Space</h1>
        <p>Hello! I'm <strong>Jatin Sharma</strong>, a passionate DevOps Engineer dedicated to building scalable, automated cloud solutions.</p>
        <p>Explore my work, read insights, and connect with me to discuss technology and innovation.</p>
        
        <a href="/docs/about/" class="btn">About Me</a>
        <!-- <a href="portfolio.html" class="btn">My Portfolio</a> -->
        <a href="/docs/about/contact/" class="btn">Get in Touch</a>
        
        <div class="social-icons">
            <a href="mailto:jatinvashishtha110@gmail.com"><img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail"></a>
            <a href="https://www.linkedin.com/in/jatin-devops/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
            <a href="https://github.com/kioskog"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
        </div>

        <!-- Add inside <body>, below the container div or before closing </div> -->

<section style="background-color:#1e1e1e; padding: 30px; border-radius: 10px; margin-top: 40px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
  <h2 style="color: #4caf50; margin-bottom: 20px;">🛠️ Projects</h2>

  <div style="text-align: left;">
    <h3 style="color: #fbc02d;">🔍 GitHub Secret Scanner in Kubernetes</h3>
    <p style="line-height: 1.6;">
      A production-ready GitHub secret detection pipeline using TruffleHog, Kafka, and FastAPI, deployed via Helm in Kubernetes. Includes Slack notifications and CI integration.
      <br>
      <a href="https://github.com/kioskOG/secret-scan-poc" target="_blank" style="color:#4caf50;">View Repository →</a>
    </p>

    <h3 style="color:rgb(188, 12, 215);">🌐 CloudMap Controller for EKS</h3>
    <p style="line-height: 1.6;">
      A custom Kubernetes controller that syncs kubernetes Native Services annotated headless services to AWS Cloud Map and Route53. Built with Python and supports dynamic reconciliation, TTLs, and audit logs.
      <br>
      <a href="https://github.com/kioskOG/EKS-cloudmap-controller" target="_blank" style="color:#4caf50;">View Repository →</a>
    </p>

    <h3 style="color:rgb(224, 180, 35);">🧪 GitHub Action - PR Secret Gatekeeper</h3>
    <p style="line-height: 1.6;">
      Prevents merge of PRs containing secrets using GitHub Webhook and Kafka pipeline. Integrates with TruffleHog and updates PR status checks.
      <br>
      <a href="https://github.com/kioskOG/secret-scan-poc/tree/main/based-on-push-and-pull_request" target="_blank" style="color:#4caf50;">View Repository →</a>
    </p>

    <h3 style="color:rgb(224, 18, 18);">Greythr Automated Sign-In/Sign-Out Script</h3>
    <p style="line-height: 1.6;">
      This Python script automates the sign-in and sign-out process on a website using Selenium. It schedules the sign-in and sign-out tasks from Monday to Friday at random times within a specified range. Additionally, it captures screenshots and sends email notifications upon successful execution.
      <br>
      <a href="https://github.com/kioskOG/Greythr" target="_blank" style="color:#4caf50;">View Repository →</a>
    </p>

    <h3 style="color:rgb(29, 209, 137);">SAP HANA Cloud Private Edition</h3>
    <p style="line-height: 1.6;">
      SAP HANA Cloud Private Edition Accessability from Client Side. Find the below complete blog on that.
      <br>
      <a href="https://kioskog.github.io/docs/devops/Cloud/Gcp/Sap-Hana-Problem-Solution/" target="_blank" style="color:#4caf50;">View →</a>
    </p>

    <h3 style="color:rgb(211, 77, 5);">Netbird Deployment Automation</h3>
    <p style="line-height: 1.6;">
      This guide provides instructions to set up a Netbird VPN server, configure Netbird clients, and create secure connections between resources in cloud environments or local systems. 
      <br>
      <a href="https://kioskog.github.io/docs/devops/docker/Netbird/" target="_blank" style="color:#4caf50;">View →</a>
    </p>

    <h3 style="color:rgb(236, 94, 7);">Netbird Management Utility</h3>
    <p style="line-height: 1.6;">
      The Netbird Management Utility is a Python-based tool that provides a dynamic, menu-driven interface for managing Netbird resources efficiently. 
      <br>
      <a href="https://kioskog.github.io/docs/devops/python/netbird-python-utility/" target="_blank" style="color:#4caf50;">View →</a>
    </p>
  </div>
</section>

    </div>
</body>
</html>
