---
title: About Me
layout: home
nav_order: 2
permalink: /docs/about/
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Me | Jatin Sharma</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <style>
        /* Root variables for theming - Combining template and About Me colors */
        :root {
            /* Primary color from the About Me page (orange) */
            --primary-color: #ffb347; 
            --light-primary-shade: #ffd97d; /* Lighter shade of primary-color for gradients */

            /* Accent colors from the Contact Me template (blue, purple, pink) */
            --contact-primary-blue: #00c6ff;
            --contact-secondary-purple: #9c27b0;
            --contact-tertiary-pink: #ff0080;

            /* General background/text colors - Keeping original About Me dark theme */
            --bg-dark: #1e1f26; 
            --text-dark: #e0e0e0; 
            --card-bg-dark: rgba(25, 25, 34, 0.7); /* From Contact Me .container */
            --section-bg-dark: rgba(25, 25, 34, 0.6); /* From Contact Me .section */
            --form-bg-dark: rgba(13, 13, 16, 0.7); /* From Contact Me form */
        }

        /* Base Body Styling - From Contact Me template */
        body {
            background-color: #070708; /* Dark background for contrast */
            color: var(--text-dark); /* Using About Me's text-dark for consistency with existing text */
            font-family: 'Inter', Arial, sans-serif;
            margin: 0;
            padding: 0;
            text-align: center;
            line-height: 1.6;
            min-height: 100vh;
            background-image: radial-gradient(circle at top left, #2f0a5d 0%, transparent 50%),
                              radial-gradient(circle at bottom right, #004d40 0%, transparent 50%);
            background-blend-mode: screen;
        }

        /* DARK MODE - Keeping for potential future toggle, though body is dark by default */
        body.dark {
            background-color: #070708; /* Same as default body background */
            color: var(--text-dark);
        }

        /* HEADER GRADIENT - Retaining About Me's orange gradient */
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
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        /* Animated gradient text style for main headings - Retaining About Me's orange gradient */
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

        /* Main Content Container - Glass Effect - From Contact Me template */
        .container {
            max-width: 900px;
            margin: 40px auto; /* Centered horizontally, 40px top/bottom margin */
            padding: 40px 20px;
            border-radius: 15px; /* More rounded corners for glass */
            background-color: var(--card-bg-dark); /* Semi-transparent background */
            backdrop-filter: blur(15px) saturate(180%); /* Frosted glass effect */
            -webkit-backdrop-filter: blur(15px) saturate(180%); /* Webkit support */
            border: 1px solid rgba(var(--contact-secondary-purple), 0.3); /* Subtle, semi-transparent border */
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); /* Stronger, more diffused shadow */
        }
        .container:hover {
            box-shadow: 0 12px 48px 0 rgba(0, 0, 0, 0.45); /* Slightly enhanced hover shadow */
        }

        /* Profile Image */
        .profile-img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid var(--primary-color); /* Orange border */
            margin-bottom: 25px;
            box-shadow: 0 0 15px rgba(var(--primary-color), 0.4);
            animation: glow 3s ease-in-out infinite;
        }

        /* Headings and Paragraphs */
        h1 {
            font-size: 2rem;
            margin-bottom: 12px;
            font-weight: 700;
            letter-spacing: 0.03rem;
            animation: fadeInUp 1s ease forwards;
            color: var(--primary-color); /* Uses About Me's primary color */
        }

        p {
            font-size: 1.1em;
            line-height: 1.7;
            margin-bottom: 1.2em;
            color: var(--text-dark); /* Ensure general paragraphs use dark mode text color */
            list-style-type: none;
            padding-left: 0;
        }

        /* Custom paragraph style for skill lists */
        .skill-list-paragraph {
            text-align: left;
            margin-left: 0; /* Remove margin as container is centered */
            padding-left: 0;
            margin-bottom: 15px;
            color: inherit;
            line-height: 1.6;
            font-size: 1.05em;
        }
        .skill-list-paragraph strong {
             color: var(--primary-color); /* Orange for strong skills */
        }

        /* Button with pulse - Retaining About Me's orange gradient style */
        .btn {
            display: inline-flex;
            align-items: center;
            background: linear-gradient(90deg, var(--light-primary-shade) 0%, var(--primary-color) 50%, var(--light-primary-shade) 100%);
            color: #1d2329;
            padding: 13px 34px;
            border-radius: 30px;
            text-decoration: none;
            font-size: 20px;
            font-weight: 600;
            box-shadow: 0 2px 18px rgba(var(--light-primary-shade), 0.6);
            border: none;
            outline: none;
            transition: background 0.24s, color 0.15s, box-shadow 0.21s, transform 0.2s ease-in-out;
            animation: pulse 2s infinite;
            margin: 10px; /* Add some margin between buttons if stacked */
        }
        .btn i {
            margin-left: 9px;
            font-size: 1.16em;
        }
        .btn:hover, .btn:focus {
            background: linear-gradient(90deg, var(--primary-color) 0%, var(--light-primary-shade) 60%, var(--primary-color) 100%);
            color: #23272f;
            box-shadow: 0 4px 24px rgba(var(--primary-color), 0.56);
            transform: translateY(-2px);
        }

        /* Social Icons - From Contact Me template, adapted for About Me's social-icons class */
        .social-icons { /* Renamed from social-badges to match existing HTML */
            margin-top: 25px;
            margin-bottom: 35px;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 15px;
        }
        .social-icons a {
            display: inline-block;
            vertical-align: middle;
            border-radius: 5px;
            transition: transform 0.2s ease-in-out;
        }
        .social-icons a:hover {
            transform: translateY(-3px);
        }
        .social-icons img {
            border-radius: 5px;
        }

        /* Section Styling (for Collaboration, Message form) - From Contact Me template */
        .section {
            background-color: var(--section-bg-dark); /* Slightly more transparent than container */
            backdrop-filter: blur(10px) saturate(150%); /* Subtle blur for nested elements */
            -webkit-backdrop-filter: blur(10px) saturate(150%);
            padding: 30px;
            border-radius: 12px; /* Consistent rounded corners */
            margin-top: 40px;
            border: 1px solid rgba(var(--contact-secondary-purple), 0.2); /* Lighter border */
            box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.25); /* Nested shadow */
            text-align: left;
            max-width: 850px; /* Max width for inner sections */
            margin-left: auto;
            margin-right: auto;
        }
        .section h2 {
            color: var(--primary-color); /* Using About Me's primary color */
            margin-bottom: 25px;
            text-align: center;
            font-size: 2.2em;
            letter-spacing: 2px;
            text-shadow: 0 0 8px rgba(var(--primary-color), 0.2);
        }
        /* Style for section headings with icons */
        .section h2.icon-heading {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }
        .section h2.icon-heading i {
            font-size: 1.1em;
            color: var(--contact-tertiary-pink); /* A subtle pop of pink for the icon */
            text-shadow: 0 0 5px rgba(var(--contact-tertiary-pink), 0.2);
        }


        /* Styling for skill categories (using About Me's accent colors) */
        .skill-category-title {
            margin-top: 25px;
            margin-bottom: 10px;
            font-size: 1.4em;
            font-weight: 700;
            color: var(--contact-tertiary-pink); /* Using Contact Me's pink for category titles */
            display: flex;
            align-items: center;
            gap: 10px;
            text-shadow: 0 0 5px rgba(var(--contact-tertiary-pink), 0.2);
        }

        /* Styling for sub-skill headings (using About Me's accent colors) */
        .sub-skill-heading {
            margin-top: 15px;
            margin-bottom: 5px;
            font-size: 1.1em;
            font-weight: 600;
            color: var(--contact-secondary-purple); /* Using Contact Me's purple for sub-headings */
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Horizontal Rule for separation - Using Contact Me's accent color */
        hr {
          border: none;
          border-top: 1px solid rgba(var(--contact-secondary-purple), 0.5);
          margin-top: 40px;
          margin-bottom: 20px;
        }

        /* Footer link styling - Using Contact Me's accent colors */
        .footer-link {
            display: block;
            margin-top: 40px;
            font-size: 1.1em;
            color: var(--contact-secondary-purple);
            text-decoration: none;
            transition: color 0.3s ease, transform 0.2s ease-in-out;
        }
        .footer-link:hover {
            color: var(--contact-tertiary-pink);
            transform: translateX(5px);
        }

        /* Animations */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 108, 71, 0.5); }
            70% { box-shadow: 0 0 0 15px rgba(255,179,71,0); }
            100% { box-shadow: 0 0 0 0 rgba(255,179,71,0); }
        }
        @keyframes glow {
            0%, 100% { box-shadow: 0 2px 18px rgba(var(--primary-color), 0.2); } /* Uses orange primary color */
            50% { box-shadow: 0 4px 28px rgba(var(--primary-color), 0.45); } /* Uses orange primary color */
        }
        @keyframes floatBg {
        from { transform: translate(0,0); }
        to { transform: translate(8px, -8px); }
        }

        /* Responsive adjustments - From Contact Me template, adapted */
        @media (max-width: 768px) {
            .welcome-gradient {
                font-size: 2em;
            }
            .section h2 {
                font-size: 1.8em;
            }
            p, .skill-list-paragraph {
                font-size: 1em;
                margin-left: 0;
            }
            .btn {
                font-size: 0.9em;
                padding: 10px 20px;
                margin: 5px; /* Tighter margins for buttons on small screens */
            }
            .skill-category-title, .sub-skill-heading {
                font-size: 1.2em;
                margin-left: 0;
            }
            .container {
                margin: 20px 10px;
                padding: 30px 15px;
            }
            .section {
                padding: 20px;
            }
            .section h2.icon-heading {
                flex-direction: column; /* Stack icon and text on very small screens */
                gap: 5px;
            }
        }
    </style>
</head>
<body class="dark">
  <div class="container">
    <div class="gradient-header" align="center">
      <h1 class="welcome-gradient">👋 About Jatin Sharma 👋</h1>
    </div>

    <img src="../../profile-image.png" alt="Jatin Sharma" class="profile-img" />
    <p>
        Hello! I’m <strong>Jatin Sharma</strong>, a passionate <strong>DevOps Engineer</strong> with a strong focus on creating robust, scalable, and automated cloud solutions. I specialize in <strong>infrastructure automation</strong>, <strong>CI/CD pipelines</strong>, and <strong>cloud integrations</strong> that empower organizations to deliver software faster and with greater reliability.
    </p>

    <!-- Skills and Expertise Section -->
    <section class="section">
        <h2 class="icon-heading">🌐 Skills and Expertise</h2>

        <h3 class="skill-category-title">🌩 Cloud Platforms</h3>
        <p class="skill-list-paragraph">
            <li><strong>AWS</strong>: Amazon S3, Route 53, EC2, AWS Lambda, VPC, EKS, ECR, AWS CloudFormation, AWS SSO, IAM, SES, SNS, SQS, Opensearch, ElastiCache, Cloudwatch, ALB, NLB, Autoscaling, Amazon Cloudfront, ApiGateway, Amazon Athena, AWS Organisation, AWS Batch, CloudMap, ECS, WAF, AWS Firewall, Cloudtrail</li>
            <li><strong>GCP</strong>: Compute, Storage, GKE, VCN, Secret Store, IAM</li>
            <li><strong>Oracle Cloud</strong>: CloudVCN, Compute, Storage, OKE, Container Registry, Oracle Function, Api Gateway, LoadBalancers, Oracle Heatwave Mysql, Oracle Redis, Oracle Postgres</li>

        </p>


        <h3 class="skill-category-title">🖥️ Operating Systems</h3>
        <p class="skill-list-paragraph">
            <strong>Linux</strong>: UBUNTU, RedHat, Amazon Linux, Centos7, Windows, Mac
        </p>

        <h3 class="skill-category-title">🛠️ Configuration Management & Infrastructure Automation</h3>
        <h4 class="sub-skill-heading">🔧 Configuration Management:</h4>
        <p class="skill-list-paragraph">
            <strong>Ansible</strong>
        </p>
        <h4 class="sub-skill-heading">🌍 IAC (Infrastructure as Code):</h4>
        <p class="skill-list-paragraph">
            <strong>Terraform</strong>, AWS CloudFormation, Crossplane
        </p>

        <h3 class="skill-category-title">🚢 Containerization & Orchestration</h3>
        <p class="skill-list-paragraph">
            <strong>Containerization</strong>: Docker, Kubernetes
        </p>

        <h3 class="skill-category-title">🚀 CI/CD (Continuous Integration/Continuous Deployment)</h3>
        <p class="skill-list-paragraph">
            Jenkins, GitHub Actions, GitHub Workflows, GitLab CI/CD, AWS CodeBuild, AWS CodeDeploy
        </p>

        <h3 class="skill-category-title">📊 Monitoring & Logging</h3>
        <p class="skill-list-paragraph">
            <strong>Prometheus</strong>, Grafana, SigNoz, Elastic Stack, Uptime-Kuma, Grafana Tempo, Grafana Loki, Grafana Alloy, Grafana Pyroscope, Grafana Mimir, Apache HeartBeat, OpenTelemetry
        </p>

        <h3 class="skill-category-title">🖥️ Programming & Scripting</h3>
        <p class="skill-list-paragraph">
            <strong>Languages</strong>: Python, Go (Golang), Bash
        </p>

        <h3 class="skill-category-title">🌟 Version Control & Collaboration</h3>
        <p class="skill-list-paragraph">
            <strong>GitHub</strong>, GitLab, Bitbucket, AWS CodeCommit
        </p>

        <h3 class="skill-category-title">🗄️ Databases</h3>
        <p class="skill-list-paragraph">
            <strong>Oracle MySQL</strong>, Postgres, Cassandra, Oracle Postgres, MariaDB
        </p>

        <h3 class="skill-category-title">🎨 Specialized Tools & Platforms</h3>
        <p class="skill-list-paragraph">
            <strong>AEM (Adobe Experience Manager)</strong>
        </p>
        <h4 class="sub-skill-heading">🔒 VPN:</h4>
        <p class="skill-list-paragraph">
            <strong>Netbird</strong>, OpenVPN
        </p>
        <h4 class="sub-skill-heading">🕸️ Web Servers & Reverse Proxy:</h4>
        <p class="skill-list-paragraph">
            <strong>Apache</strong>, NGINX, Caddy
        </p>

        <h3 class="skill-category-title">🔗 API Management & Ingress</h3>
        <h4 class="sub-skill-heading">🌉 API Gateways:</h4>
        <p class="skill-list-paragraph">
            <strong>Tyk</strong>, AWS API Gateway, Traefik
        </p>
        <h4 class="sub-skill-heading">⚡ Ingress:</h4>
        <p class="skill-list-paragraph">
            <strong>NGINX</strong>, Traefik, Kong, Istio
        </p>
        <h4 class="sub-skill-heading">🔗 Service Mesh:</h4>
        <p class="skill-list-paragraph">
            <strong>Istio</strong>, Linkerd
        </p>

        <h3 class="skill-category-title">🔐 Identity Providers (IdPs)</h3>
        <p class="skill-list-paragraph">
            <strong>Keycloak</strong>, Authentik, Zitadel
        </p>

        <h3 class="skill-category-title">📈 SIEM (Security Information & Event Management)</h3>
        <p class="skill-list-paragraph">
            <strong>Wazuh</strong>, <strong>Coralogix</strong>
        </p>

        <h3 class="skill-category-title">🛠️ Additional Tools</h3>
        <p class="skill-list-paragraph">
            <strong>Knative</strong>, Terragrunt, Kro, Cillium, Velaro, Cert-Manager, ExternalDNS, Karpenter, External Secret, kubernetes-reflector, Apicurio, HashiCorp Vault, Novu, Polaris, Kafka UI, Metabase, KEDA, Helm, Helmfile, HPA, Packer, Node Local DNS, Minio, Atlasian, External DNS, MiroTalk, Selenium, RustDesk, retool
        </p>
    </section>

    <!-- My Journey Section -->
    <section class="section">
        <h2 class="icon-heading">🚀 My Journey</h2>
        <p>
            My journey began as a system administrator, where I developed a keen understanding of infrastructure. This foundation led me to transition into DevOps, driven by a passion to solve real-world operational challenges through automation and efficiency. Over the years, I've had the opportunity to work on diverse and impactful projects, from architecting scalable microservices to automating complex infrastructure deployments for large-scale systems. Each experience has fueled my growth, allowing me to build robust and reliable solutions.
        </p>
    </section>

    <!-- Personal Philosophy Section -->
    <section class="section">
        <h2 class="icon-heading">💡 Personal Philosophy</h2>
        <p>
            I firmly believe in the power of <strong>continuous learning</strong> and proactively embracing emerging technologies. The tech landscape is ever-evolving, and staying ahead means constant exploration and adaptation. My core goal is to bridge the gap between development and operations, fostering a culture where collaboration, innovation, and streamlined processes are at the forefront. I strive to empower teams to deliver high-quality software faster and more reliably.
        </p>
    </section>

    <!-- Hobbies Section -->
    <section class="section">
        <h2 class="icon-heading">✨ Hobbies</h2>
        <p class="skill-list-paragraph">
            Beyond my professional work, I enjoy diving into emerging technologies, staying updated with industry trends, reading insightful tech blogs, and actively experimenting with open-source projects to expand my knowledge and skills.
        </p>
    </section>

    <!-- Call to Action / Connect Section -->
    <section class="section" style="text-align: center;">
        <h2 class="icon-heading">🤝 Let’s Connect!</h2>
        <p>
            Feel free to check out my portfolio or reach out.
        </p>
        <a href="/docs/about/contact" class="btn">Get in Touch <i class="fas fa-envelope"></i></a>
        <a href="/docs/devops/" class="btn">DevOps Projects <i class="fas fa-project-diagram"></i></a>
    </section>

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
  </div>
</body>
</html>
