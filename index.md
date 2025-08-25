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
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <style>
    /* Root variables for theming - Aligned with About Me and Contact Me pages */
    :root {
        --primary-color: #ffb347; /* Orange/Yellow accent from About Me */
        --light-primary-shade: #ffd97d; /* Lighter shade of primary-color for gradients */
        --bg-dark: #1e1f26; /* Dark background from About Me */
        --text-dark: #e0e0e0; /* Light text for dark mode from About Me */
        --card-bg-dark: rgba(25, 25, 34, 0.7); /* Base card background from Contact Me */
        --section-bg-dark: rgba(25, 25, 34, 0.6); /* Section background from Contact Me */
        --form-bg-dark: rgba(13, 13, 16, 0.7); /* Form background from Contact Me */
        
        /* Accent colors from the Contact Me template (blue, purple, pink) for project titles/links */
        --contact-primary-blue: #00c6ff;
        --contact-secondary-purple: #9c27b0;
        --contact-tertiary-pink: #ff0080;

        /* Project specific colors, harmonized with new palette */
        --project-gold: #e0b423; /* Adjusted gold to better fit orange palette */
        --project-purple: #9c27b0; /* Use contact secondary purple */
        --project-orange: #ec5e07; /* Use original coral from previous version for variety */
        --project-red: #e01212;
        --project-teal: #1dd189;
        --project-brown: #d34d05;
        --project-coral: #ff8c00; /* Used a deeper orange from gradient */
    }

    body {
      background-color: #070708; /* Dark background for contrast */
      color: var(--text-dark); /* Using root text-dark for consistency */
      font-family: 'Inter', Arial, sans-serif;
      margin: 0;
      padding: 0;
      text-align: center;
      line-height: 1.6; /* Added for better readability */
      min-height: 100vh;
      background-image: radial-gradient(circle at top left, #2f0a5d 0%, transparent 50%),
                        radial-gradient(circle at bottom right, #004d40 0%, transparent 50%); /* Subtle background gradients */
      background-blend-mode: screen;
    }

    /* HEADER GRADIENT - Now uses the orange gradient from About Me page */
    .gradient-header {
      background: linear-gradient(270deg, var(--primary-color), #ff8c00, var(--primary-color));
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

    /* Animated gradient text style for welcome heading - Now uses the orange gradient */
    .welcome-gradient {
      background: linear-gradient(270deg, var(--primary-color), #ff8c00, var(--primary-color));
      background-size: 600% 600%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientMove 8s ease infinite;
      margin-bottom: 0.5em;
      font-size: 2.7em;
      font-weight: bold;
      text-align: center;
      text-shadow: 0 0 10px rgba(0, 198, 255, 0.3); /* Keeping subtle blue shadow for depth */
    }

    .container {
      max-width: 900px;
      margin: auto;
      padding: 40px 20px;
      border-radius: 15px; /* Added from Contact Me for glass effect */
      background-color: var(--card-bg-dark); /* Added from Contact Me for glass effect */
      backdrop-filter: blur(15px) saturate(180%); /* Added from Contact Me for glass effect */
      -webkit-backdrop-filter: blur(15px) saturate(180%); /* Added from Contact Me for glass effect */
      border: 1px solid rgba(var(--contact-secondary-purple), 0.3); /* Added from Contact Me for glass effect */
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); /* Added from Contact Me for glass effect */
      transition: box-shadow 0.3s; /* Added for consistency */
    }
    .container:hover {
      box-shadow: 0 12px 48px 0 rgba(0, 0, 0, 0.45); /* Added for consistency */
    }

    .profile-img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--primary-color); /* Updated to primary orange */
      margin-bottom: 20px;
      box-shadow: 0 0 15px rgba(var(--primary-color), 0.4); /* Updated to primary orange */
      animation: glow 3s ease-in-out infinite; /* Added glow animation */
    }
    @keyframes glow { /* Defined glow animation */
        0%, 100% { box-shadow: 0 2px 18px rgba(var(--primary-color), 0.2); }
        50% { box-shadow: 0 4px 28px rgba(var(--primary-color), 0.45); }
    }

    p {
      font-size: 1.1em; /* Adjusted for consistency */
      line-height: 1.7; /* Adjusted for consistency */
      margin-bottom: 1.2em; /* Adjusted for consistency */
      color: var(--text-dark); /* Ensure general paragraphs use dark mode text color */
    }

    /* Buttons - Same styling as About Me page's .btn */
    .btn {
      display: inline-flex;
      align-items: center;
      background: linear-gradient(90deg, var(--light-primary-shade) 0%, var(--primary-color) 50%, var(--light-primary-shade) 100%);
      color: #1d2329;
      padding: 13px 34px; /* Adjusted padding for consistency */
      border-radius: 30px; /* Adjusted border-radius for consistency */
      text-decoration: none;
      font-size: 20px; /* Adjusted font-size for consistency */
      font-weight: 600; /* Adjusted font-weight for consistency */
      box-shadow: 0 2px 18px rgba(var(--light-primary-shade), 0.6);
      border: none;
      outline: none;
      transition: background 0.24s, color 0.15s, box-shadow 0.21s, transform 0.2s ease-in-out; /* Added transform transition */
      animation: pulse 2s infinite; /* Added pulse animation */
      margin: 10px;
    }
    .btn i { /* Added icon styling for consistency, though not used in current home page buttons */
        margin-left: 9px;
        font-size: 1.16em;
    }
    .btn:hover, .btn:focus {
      background: linear-gradient(90deg, var(--primary-color) 0%, var(--light-primary-shade) 60%, var(--primary-color) 100%);
      color: #23272f;
      box-shadow: 0 4px 24px rgba(var(--primary-color), 0.56);
      transform: translateY(-2px); /* Added transform for hover effect */
    }
    @keyframes pulse { /* Defined pulse animation */
        0% { box-shadow: 0 0 0 0 rgba(255, 108, 71, 0.5); }
        70% { box-shadow: 0 0 0 15px rgba(255,179,71,0); }
        100% { box-shadow: 0 0 0 0 rgba(255,179,71,0); }
    }


    .social-icons {
      margin-top: 25px; /* Adjusted for consistency */
      margin-bottom: 35px; /* Adjusted for consistency */
      display: flex; /* Added for consistency */
      justify-content: center; /* Added for consistency */
      flex-wrap: wrap; /* Added for consistency */
      gap: 15px; /* Added for consistency */
    }
    .social-icons a {
        display: inline-block; /* Added for consistency */
        vertical-align: middle; /* Added for consistency */
        border-radius: 5px; /* Added for consistency */
        transition: transform 0.2s ease-in-out; /* Added for consistency */
    }
    .social-icons a:hover {
        transform: translateY(-3px); /* Added for consistency */
    }
    .social-icons img {
        border-radius: 5px; /* Added for consistency */
    }


    /* Projects section - Using section styling from Contact Me page */
    .projects-section {
      background-color: var(--section-bg-dark); 
      padding: 30px;
      border-radius: 12px; /* Adjusted for consistency */
      margin-top: 40px;
      box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.25); /* Adjusted for consistency */
      text-align: left;
      max-width: 850px;
      margin-left: auto;
      margin-right: auto;
      backdrop-filter: blur(10px) saturate(150%); /* Added from Contact Me */
      -webkit-backdrop-filter: blur(10px) saturate(150%); /* Added from Contact Me */
      border: 1px solid rgba(var(--contact-secondary-purple), 0.2); /* Added from Contact Me */
    }
    .projects-section h2 {
      color: var(--primary-color); /* Updated to primary orange */
      margin-bottom: 25px; /* Adjusted for consistency */
      text-align: center;
      font-size: 2.2em; /* Adjusted for consistency */
      letter-spacing: 2px;
      text-shadow: 0 0 8px rgba(var(--primary-color), 0.2); /* Added for consistency */
    }
    .project-title {
      margin-top: 25px;
      margin-bottom: 5px;
      font-size: 1.4em; /* Adjusted for consistency */
      font-weight: 700;
      display: flex; /* Added for icon alignment */
      align-items: center; /* Added for icon alignment */
      gap: 10px; /* Added for spacing */
    }
    .project-title[data-c="gold"] {
      color: var(--project-gold);
    }
    .project-title[data-c="purple"] {
      color: var(--project-purple);
    }
    .project-title[data-c="orange"] {
      color: var(--project-orange);
    }
    .project-title[data-c="red"] {
      color: var(--project-red);
    }
    .project-title[data-c="teal"] {
      color: var(--project-teal);
    }
    .project-title[data-c="brown"] {
      color: var(--project-brown);
    }
    .project-title[data-c="coral"] {
      color: var(--project-coral);
    }

    .project-link {
      color: #1d2329; /* Text color inside button */
      text-decoration: none;
      font-weight: 600; /* Adjusted for consistency */
      padding: 8px 18px; /* Adjusted for consistency */
      border-radius: 20px; /* Adjusted for consistency */
      background: linear-gradient(90deg, var(--light-primary-shade) 0%, var(--primary-color) 50%, var(--light-primary-shade) 100%); /* Orange gradient */
      margin-left: 10px; /* Adjusted for spacing */
      transition: background 0.24s, color 0.15s, box-shadow 0.21s, transform 0.2s ease-in-out; /* Added transitions */
      box-shadow: 0 2px 10px rgba(var(--light-primary-shade), 0.6); /* Added shadow */
      display: inline-flex; /* To center text and icon if any */
      align-items: center;
    }
    .project-link i { /* Styling for icon within project link */
        margin-left: 5px;
        font-size: 0.9em;
    }
    .project-link:hover {
      background: linear-gradient(90deg, var(--primary-color) 0%, var(--light-primary-shade) 60%, var(--primary-color) 100%);
      color: #23272f;
      box-shadow: 0 4px 18px rgba(var(--primary-color), 0.56);
      transform: translateY(-2px);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .welcome-gradient {
        font-size: 2em;
      }
      .projects-section h2 {
        font-size: 1.8em;
      }
      p {
        font-size: 1em;
      }
      .btn {
        padding: 10px 20px;
        font-size: 0.9em;
        margin: 5px;
      }
      .social-icons {
          gap: 10px;
      }
      .container {
          margin: 20px 10px;
          padding: 30px 15px;
      }
      .projects-section {
          padding: 20px;
      }
      .project-title {
          font-size: 1.2em;
          flex-direction: column; /* Stack title and icon on small screens */
          gap: 5px;
      }
      .project-link {
          padding: 6px 14px;
          font-size: 0.8em;
          margin-left: 0;
          margin-top: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="gradient-header" align="center">
      <h1 class="welcome-gradient">🌟 Welcome to My Digital Space 🌟</h1>
    </div>

    <img src="./profile-image.png" alt="Jatin Sharma" class="profile-img" />
    <p>
      Hello! I'm <strong>Jatin Sharma</strong>, a passionate DevOps Engineer dedicated to building scalable,
      automated cloud solutions.
    </p>
    <p>Explore my work, read insights, and connect with me to discuss technology and innovation.</p>

    <a href="/docs/about/" class="btn">About Me <i class="fas fa-user-circle"></i></a>
    <a href="/docs/about/contact/" class="btn">Get in Touch <i class="fas fa-envelope"></i></a>

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
            >View Repository <i class="fas fa-external-link-alt"></i></a
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
            >View Repository <i class="fas fa-external-link-alt"></i></a
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
            >View Repository <i class="fas fa-external-link-alt"></i></a
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
            >View Repository <i class="fas fa-external-link-alt"></i></a
          >
        </p>

        <div class="project-title" data-c="red">Greythr Automated Sign-In/Sign-Out Script</div>
        <p>
          Python script automates Greythr sign-in/out with Selenium, runs on schedule, captures screenshots, and sends email notifications on success.
          <a href="https://github.com/kioskOG/Greythr" target="_blank" rel="noopener" class="project-link"
            >View Repository <i class="fas fa-external-link-alt"></i></a
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
            >View <i class="fas fa-external-link-alt"></i></a
          >
        </p>

        <div class="project-title" data-c="brown">Netbird Deployment Automation</div>
        <p>
          Guide and instructions to set up a Netbird VPN server, configure clients, and create secure multi-cloud connections.
          <a href="https://kioskog.github.io/docs/devops/docker/Netbird/" target="_blank" rel="noopener" class="project-link"
            >View <i class="fas fa-external-link-alt"></i></a
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
            >View <i class="fas fa-external-link-alt"></i></a
          >
        </p>
      </div>
    </section>
  </div>
</body>
</html>
