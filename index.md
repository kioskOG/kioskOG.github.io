---
title: Home
layout: home
nav_order: 1
---


<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Home | Jatin Sharma</title>
  <link rel="stylesheet" href="styles.css" />
  <style>
    body {
      background-color: #070708;
      color: #fff;
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      text-align: center;
    }

    /* HEADER GRADIENT */
    .gradient-header {
      background: linear-gradient(270deg, #00c6ff, #9c27b0, #ff0080);
      background-size: 600% 600%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientMove 8s ease infinite;
      margin-top: 40px;
      margin-bottom: 10px;
    }
    @keyframes gradientMove {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    /* Animated gradient text style for welcome heading */
    .welcome-gradient {
      background: linear-gradient(270deg, #00c6ff, #9c27b0, #ff0080);
      background-size: 600% 600%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientMove 8s ease infinite;
      margin-bottom: 0.5em;
      font-size: 2.7em;
      font-weight: bold;
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
      border: 3px solid #00c6ff;
      margin-bottom: 20px;
      box-shadow: 0 2px 10px rgba(0, 198, 255, 0.13);
    }
    p {
      font-size: 1.2em;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      padding: 10px 22px;
      margin: 10px;
      font-size: 1em;
      color: #fff;
      background: linear-gradient(90deg, #00c6ff, #9c27b0, #ff0080 82%);
      border: none;
      border-radius: 5px;
      text-decoration: none;
      box-shadow: 0 1px 7px rgba(156, 39, 176, 0.2);
      transition: background 0.3s, box-shadow 0.3s;
    }
    .btn:hover {
      background: linear-gradient(90deg, #ff0080, #9c27b0, #00c6ff 82%);
      box-shadow: 0 3px 15px rgba(156, 39, 176, 0.45);
    }
    .social-icons {
      margin-top: 20px;
      margin-bottom: 30px;
    }
    .social-icons a {
      margin: 0 8px;
      display: inline-block;
      vertical-align: middle;
    }
    /* Project section */
    .projects-section {
      background-color: #191922;
      padding: 30px;
      border-radius: 10px;
      margin-top: 40px;
      box-shadow: 0 2px 7px rgba(0, 0, 0, 0.25);
      text-align: left;
      max-width: 850px;
      margin-left: auto;
      margin-right: auto;
    }
    .projects-section h2 {
      color: #00c6ff;
      margin-bottom: 20px;
      text-align: center;
      font-size: 2em;
      letter-spacing: 2px;
    }
    .project-title {
      margin-top: 25px;
      margin-bottom: 5px;
      font-size: 1.25em;
      font-weight: 700;
    }
    .project-title[data-c]="gold" {
      color: #fbc02d;
    }
    .project-title[data-c]="purple" {
      color: #bc0cd7;
    }
    .project-title[data-c]="orange" {
      color: #e0b423;
    }
    .project-title[data-c]="red" {
      color: #e01212;
    }
    .project-title[data-c]="teal" {
      color: #1dd189;
    }
    .project-title[data-c]="brown" {
      color: #d34d05;
    }
    .project-title[data-c]="coral" {
      color: #ec5e07;
    }

    .project-link {
      color: #00c6ff;
      text-decoration: none;
      font-weight: bold;
      padding: 1px 6px;
      border-radius: 3px;
      background: linear-gradient(90deg, #00c6ff 30%, #9c27b0 80%);
      margin-left: 5px;
      transition: background 0.2s;
    }
    .project-link:hover {
      background: linear-gradient(90deg, #ff0080, #9c27b0 65%, #00c6ff);
      color: #fff;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="gradient-header" align="center">
      <h1 class="welcome-gradient">🌟 Welcome to My Digital Space 🌟</h1>
      <!-- <a href="https://github.com/kioskOG/Universal-Session-Structure" target="_blank" rel="noopener">
        <img
          src="https://readme-typing-svg.demolab.com?font=italic&weight=700&size=18&duration=4000&pause=1000&color=FFD700&center=true&width=600&lines=++Welcome+to+My+Digital+Space"
          alt="Typing SVG"
        />
      </a> -->
    </div>

    <img src="./profile-image.png" alt="Jatin Sharma" class="profile-img" />
    <p>
      Hello! I'm <strong>Jatin Sharma</strong>, a passionate DevOps Engineer dedicated to building scalable,
      automated cloud solutions.
    </p>
    <p>Explore my work, read insights, and connect with me to discuss technology and innovation.</p>

    <a href="/docs/about/" class="btn">About Me</a>
    <a href="/docs/about/contact/" class="btn">Get in Touch</a>

    <div class="social-icons">
      <a href="mailto:jatinvashishtha110@gmail.com" title="Gmail">
        <img
          src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white"
          alt="Gmail"
        />
      </a>
      <a href="https://www.linkedin.com/in/jatin-devops/" target="_blank" rel="noopener" title="LinkedIn">
        <img
          src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"
          alt="LinkedIn"
        />
      </a>
      <a href="https://github.com/kioskog" target="_blank" rel="noopener" title="GitHub">
        <img
          src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"
          alt="GitHub"
        />
      </a>
    </div>

    <!-- Projects Section -->
    <section class="projects-section">
      <h2>🛠️ Projects</h2>
      <div>

        <div class="project-title" data-c="gold">🚀 LGTM stack on Kubernetes Complete Hands‑On </div>
        <p>
          Run complete LGTM Stack on Kubernetes for observability.
          <a
            href="https://github.com/kioskOG/observability-hub"
            target="_blank"
            rel="noopener"
            class="project-link"
            >View Repository →</a
          >
        </p>

        <div class="project-title" data-c="gold">🔍 GitHub Secret Scanner in Kubernetes</div>
        <p>
          A production-ready GitHub secret detection pipeline using TruffleHog, Kafka, and FastAPI, deployed via Helm in Kubernetes. Includes Slack notifications
          and CI integration.
          <a
            href="https://github.com/kioskOG/secret-scan-poc"
            target="_blank"
            rel="noopener"
            class="project-link"
            >View Repository →</a
          >
        </p>

        <div class="project-title" data-c="purple">🌐 CloudMap Controller for EKS</div>
        <p>
          A custom Kubernetes controller that syncs Native headless Services to AWS Cloud Map and Route53. Built with Python and supports dynamic reconciliation,
          TTLs, and audit logs.
          <a
            href="https://github.com/kioskOG/EKS-cloudmap-controller"
            target="_blank"
            rel="noopener"
            class="project-link"
            >View Repository →</a
          >
        </p>

        <div class="project-title" data-c="orange">🧪 GitHub Action - PR Secret Gatekeeper</div>
        <p>
          Prevents merge of PRs containing secrets using GitHub Webhook and Kafka pipeline. Integrates with TruffleHog and updates PR status checks.
          <a
            href="https://github.com/kioskOG/secret-scan-poc/tree/main/based-on-push-and-pull_request"
            target="_blank"
            rel="noopener"
            class="project-link"
            >View Repository →</a
          >
        </p>

        <div class="project-title" data-c="red">Greythr Automated Sign-In/Sign-Out Script</div>
        <p>
          Python script automates Greythr sign-in/out with Selenium, runs on schedule, captures screenshots, and sends email notifications on success.
          <a href="https://github.com/kioskOG/Greythr" target="_blank" rel="noopener" class="project-link"
            >View Repository →</a
          >
        </p>

        <div class="project-title" data-c="teal">SAP HANA Cloud Private Edition</div>
        <p>
          SAP HANA Cloud Private Edition Access from client side; see complete blog below.
          <a
            href="https://kioskog.github.io/docs/devops/Cloud/Gcp/Sap-Hana-Problem-Solution/"
            target="_blank"
            rel="noopener"
            class="project-link"
            >View →</a
          >
        </p>

        <div class="project-title" data-c="brown">Netbird Deployment Automation</div>
        <p>
          Guide and instructions to set up a Netbird VPN server, configure clients, and create secure multi-cloud connections.
          <a href="https://kioskog.github.io/docs/devops/docker/Netbird/" target="_blank" rel="noopener" class="project-link"
            >View →</a
          >
        </p>

        <div class="project-title" data-c="coral">Netbird Management Utility</div>
        <p>
          Python-based Netbird Management Utility: Efficiently manage Netbird resources with a dynamic menu-driven interface.
          <a
            href="https://kioskog.github.io/docs/devops/python/netbird-python-utility/"
            target="_blank"
            rel="noopener"
            class="project-link"
            >View →</a
          >
        </p>
      </div>
    </section>
  </div>
</body>
</html>
