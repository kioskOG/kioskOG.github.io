---
layout: full-bleed-glass
title: DevOps | Jatin Sharma
nav_order: 3
permalink: /docs/devops/
hero_title: "⚙️ DevOps Projects"
hero_intro: >
  <p>An overview of Docker, Kubernetes, Linux, Python, Monitoring, Cloud, and System Design projects in this documentation.</p>

nav_buttons:
  - href: /docs/about/
    label: "About Me"
    icon: "fas fa-user-circle"
  - href: /docs/about/contact/
    label: "Get in Touch"
    icon: "fas fa-envelope"

social_html: |
  <a href="mailto:jatinvashishtha110@gmail.com" title="Email Jatin via Gmail" aria-label="Email Jatin via Gmail">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail Badge" loading="lazy"/>
  </a>
  <a href="https://www.linkedin.com/in/jatin-devops/" target="_blank" rel="noopener" title="LinkedIn" aria-label="Visit Jatin on LinkedIn">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge" loading="lazy"/>
  </a>
  <a href="https://github.com/kioskog" target="_blank" rel="noopener" title="GitHub" aria-label="Visit Jatin on GitHub">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Badge" loading="lazy"/>
  </a>
---

<!-- Docker -->
<section class="projects-section reveal" aria-labelledby="docker-heading">
  <h2 id="docker-heading">🐳 Docker</h2>
  <article class="project-card card-coral reveal">
    <div class="card-link" tabindex="0">
      <div class="project-head">
        <h3 class="project-title">Containerization</h3>
        <span class="project-open">View Docs</span>
      </div>
      <p class="project-desc">Containerization technology for packaging and running apps in isolated environments.</p>
      <div class="tags">
        <a class="tag" href="/docs/devops/docker/Netbird/">Netbird VPN Server</a>
        <a class="tag" href="/docs/devops/docker/traefik/">Traefik Setup</a>
        <a class="tag" href="/docs/devops/docker/uptime-kuma/">Uptime Kuma</a>
        <a class="tag" href="/docs/devops/docker/Atlasian/">Atlasian</a>
        <a class="tag" href="/docs/devops/docker/Authentik/">Authentik</a>
        <a class="tag" href="/docs/devops/docker/hashicorp-vault/">HashiCorp Vault</a>
        <a class="tag" href="/docs/devops/docker/Wazuh/">Wazuh</a>
        <a class="tag" href="/docs/devops/docker/keycloak/">Keycloak</a>
        <a class="tag" href="/docs/devops/docker/minio/">MinIO Intro</a>
        <a class="tag" href="/docs/devops/docker/minio-limits/">MinIO Limits</a>
      </div>
    </div>
  </article>
</section>

<!-- Kubernetes -->
<section class="projects-section reveal" aria-labelledby="k8s-heading">
  <h2 id="k8s-heading">☸️ Kubernetes</h2>
  <article class="project-card card-teal reveal">
    <div class="card-link" tabindex="0">
      <div class="project-head">
        <h3 class="project-title">Orchestration & Platform</h3>
        <span class="project-open">View Docs</span>
      </div>
      <p class="project-desc">Orchestrating, scaling, and managing containerized applications.</p>
      <div class="tags">
        <a class="tag" href="/docs/devops/kubernetes/velaro/">Velaro</a>
        <a class="tag" href="/docs/devops/kubernetes/Traefik/">Traefik</a>
        <a class="tag" href="/docs/devops/kubernetes/Cert-manager/">cert-manager</a>
        <a class="tag" href="/docs/devops/kubernetes/coredns-custom-domains/">CoreDNS Custom Domains</a>
        <a class="tag" href="/docs/devops/kubernetes/debug-containers/">Debug Containers</a>
        <a class="tag" href="/docs/devops/kubernetes/Grafana-password-reset/">Grafana Password Reset</a>
        <a class="tag" href="/docs/devops/kubernetes/cilium/cilium-intro/">Cilium & Hubble Intro</a>
        <a class="tag" href="/docs/devops/kubernetes/cilium/cilium-installation-on-eks/">Install Cilium on EKS</a>
        <a class="tag" href="/docs/devops/kubernetes/prometheus-grafana/">Prometheus & Grafana on EKS</a>
        <a class="tag" href="/docs/devops/kubernetes/cilium/cilium-monitoring/">Cilium Monitoring</a>
        <a class="tag" href="/docs/devops/kubernetes/helm">Helm Intro</a>
        <a class="tag" href="/docs/devops/kubernetes/AWS-ECS-to-EKS-Migration/">ECS → EKS Migration (POC)</a>
        <a class="tag" href="/docs/devops/kubernetes/Kubernetes-NodePort-and-iptables-rules/">NodePort & iptables</a>
        <a class="tag" href="/docs/devops/kubernetes/Kubernetes-Traffic-Policies/">Traffic Policies</a>
        <a class="tag" href="/docs/devops/kubernetes/knative/">Knative Intro</a>
        <a class="tag" href="/docs/devops/kubernetes/knative/knative-serving/">Knative Serving</a>
        <a class="tag" href="/docs/devops/kubernetes/knative/knative-serving-monitoring/">Knative Monitoring</a>
        <a class="tag" href="/docs/devops/kubernetes/karpenter/">Karpenter Intro</a>
        <a class="tag" href="/docs/devops/kubernetes/karpenter/karpenter-setup-in-existing-eks-cluster/">Setup Karpenter</a>
        <a class="tag" href="/docs/devops/kubernetes/karpenter/karpenter-monitoring/">Karpenter Monitoring</a>
        <a class="tag" href="/docs/devops/kubernetes/eks-logs-into-cloudwatch-using-fluentbit/">Fluent Bit → CloudWatch</a>
        <a class="tag" href="/docs/devops/kubernetes/AWS-Load-Balancer-Controller-Setup-for-EKS/">AWS LB Controller</a>
        <a class="tag" href="/docs/devops/kubernetes/Understanding-Ingress-Controllers/">Ingress Controllers</a>
        <a class="tag" href="/docs/devops/kubernetes/Installing-NGINX-Ingress/">NGINX Ingress Install</a>
        <a class="tag" href="/docs/devops/kubernetes/Routing-in-NGINX-Ingress-Controller/">NGINX Routing</a>
        <a class="tag" href="/docs/devops/kubernetes/Basic-Authentication-using-NGINX-Ingress/">NGINX Basic Auth</a>
        <a class="tag" href="/docs/devops/kubernetes/secure-your-app-with-https-using-self-signed-tls-certificates/">Ingress Self-Signed TLS</a>
      </div>
    </div>
  </article>
</section>

<!-- Linux -->
<section class="projects-section reveal" aria-labelledby="linux-heading">
  <h2 id="linux-heading">🐧 Linux</h2>
  <article class="project-card card-brown reveal">
    <div class="card-link" tabindex="0">
      <div class="project-head">
        <h3 class="project-title">Admin, Security & HA</h3>
        <span class="project-open">View Docs</span>
      </div>
      <p class="project-desc">System administration, security, SIEM/XDR, networking, and HA setups.</p>
      <div class="tags">
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/wazuh-introduction/">Wazuh Intro</a>
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/wazuh-indexer-setup/">Wazuh Indexer</a>
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/wazuh-server-setup/">Wazuh Server</a>
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/wazuh-dashboard-setup/">Wazuh Dashboard</a>
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/FIM/">File Integrity Monitoring</a>
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/malware-detection-and-deletion-and-slack-intergarion/">Malware + Slack</a>
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/wazuh-sso-using-keycloak/">Wazuh + Keycloak SSO</a>
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/wazuh-to-monitor-docker/">Wazuh + Docker</a>
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/wazuh-monitoring-container-runtime/">Container Runtime</a>
        <a class="tag" href="/docs/devops/Linux/Iptables/iptables/">iptables Intro</a>
        <a class="tag" href="/docs/devops/Linux/Iptables/ipvs-loadbalancer/">IPVS LB + NGINX</a>
        <a class="tag" href="/docs/devops/Linux/vpn/vpn/">VPN Intro</a>
        <a class="tag" href="/docs/devops/Linux/vpn/openvpn-vs-netbird/">OpenVPN vs NetBird</a>
        <a class="tag" href="/docs/devops/Linux/kernel/kernel/">Linux Kernel</a>
        <a class="tag" href="/docs/devops/Linux/eBPF/">eBPF Importance</a>
        <a class="tag" href="/docs/devops/Linux/Postgresql/SETTING-UP-A-POSTGRESQL-HA-CLUSTER/">PostgreSQL HA</a>
        <a class="tag" href="/docs/devops/Linux/Etcd-cluster-setup/Etcd-cluster-setup/">etcd 3-Node</a>
        <a class="tag" href="/docs/devops/Linux/HAProxy-cluster-setup/HAProxy-cluster-setup/">HAProxy + Keepalived</a>
      </div>
    </div>
  </article>
</section>

<!-- Python -->
<section class="projects-section reveal" aria-labelledby="python-heading">
  <h2 id="python-heading">🐍 Python</h2>
  <article class="project-card card-gold reveal">
    <div class="card-link" tabindex="0">
      <div class="project-head">
        <h3 class="project-title">Automation & Tooling</h3>
        <span class="project-open">View Docs</span>
      </div>
      <p class="project-desc">Automation, scripts, and tooling for DevOps workflows.</p>
      <div class="tags">
        <a class="tag" href="/docs/devops/python/netbird-python-utility/">Netbird Utility</a>
        <a class="tag" href="/docs/devops/python/docker-container-memory-cpu-monitoring/">Docker CPU/Mem Monitoring</a>
        <a class="tag" href="/docs/devops/python/docker-container-monitoring-script/">Docker Monitoring Script</a>
        <a class="tag" href="/docs/devops/python/greythr-selenium/README/">Greythr Automation</a>
        <a class="tag" href="/docs/devops/python/aws-cloudmap-controller/">EKS CloudMap Controller</a>
        <a class="tag" href="/docs/devops/python/GitHub-Secrets-Scanner/github-secret-scanner/">GitHub Secrets Scanner</a>
      </div>
    </div>
  </article>
</section>

<!-- Monitoring -->
<section class="projects-section reveal" aria-labelledby="monitoring-heading">
  <h2 id="monitoring-heading">📊 Monitoring</h2>
  <article class="project-card card-purple reveal">
    <div class="card-link" tabindex="0">
      <div class="project-head">
        <h3 class="project-title">Observability</h3>
        <span class="project-open">View Docs</span>
      </div>
      <p class="project-desc">Real-time monitoring and observability tools.</p>
      <div class="tags">
        <a class="tag" href="/docs/devops/monitoring/Apache-HertzBeat/">Apache HertzBeat Overview</a>
        <a class="tag" href="/docs/devops/monitoring/Apache-HertzBeat-docker/">HertzBeat Docker</a>
        <a class="tag" href="/docs/devops/monitoring/Apache-HertzBeat-docker-compose/">HertzBeat Compose</a>
        <a class="tag" href="/docs/devops/monitoring/grafana_tempo/">Grafana Tempo Intro</a>
        <a class="tag" href="/docs/devops/monitoring/grafana_tempo/Grafana-Tempo-Docker/">Tempo Docker</a>
        <a class="tag" href="/docs/devops/monitoring/grafana_tempo/grafana-tempo-sample-app/">Python App + OTel</a>
        <a class="tag" href="/docs/devops/monitoring/grafana_tempo/grafana-tempo-loki-promtail-and-prometheus/">OTel + Loki + Promtail</a>
      </div>
    </div>
  </article>
</section>

<!-- Cloud -->
<section class="projects-section reveal" aria-labelledby="cloud-heading">
  <h2 id="cloud-heading">☁️ Cloud</h2>
  <article class="project-card card-teal reveal">
    <div class="card-link" tabindex="0">
      <div class="project-head">
        <h3 class="project-title">AWS, GCP & Multi-Cloud</h3>
        <span class="project-open">View Docs</span>
      </div>
      <p class="project-desc">AWS, GCP, and multi-cloud patterns for DevOps.</p>
      <div class="tags">
        <a class="tag" href="/docs/devops/Cloud/tf-state-locking/">Terraform State Locking</a>
        <a class="tag" href="/docs/devops/Cloud/Gcp/Sap-Hana-Problem-Solution/">Save 40L/year for client</a>
        <a class="tag" href="/docs/devops/Cloud/Gcp/Secure-Connectivity-to-SAP-HANA-Private-Cloud-via-Cars24-GCP-Project/">SAP HANA Secure Connectivity</a>
        <a class="tag" href="/docs/devops/Cloud/Gcp/Implementation-SAP-HANA-PCE-Access-via-Cars24-GCP/">SAP HANA PCE Access</a>
        <a class="tag" href="/docs/devops/Cloud/Gcp/Accessing-GCS-from-GKE-Pods-using-Workload-Identity/">GCS from GKE</a>
        <a class="tag" href="/docs/devops/Cloud/Gcp/Cross-cloud-identities-between-GCP-and-AWS/">Cross-Cloud GCP↔AWS</a>
        <a class="tag" href="/docs/devops/Cloud/Gcp/Aws-and-GCP-vpc-comparision/">AWS vs GCP VPC</a>
        <a class="tag" href="/docs/devops/Cloud/Gcp/Accessing-AWS-Services-from-GKE-using-Workload-Identity-and-Aws-oidc/">AWS from GKE (OIDC)</a>
        <a class="tag" href="/docs/devops/Cloud/AWS/aws-firewal/">AWS Firewall Egress</a>
      </div>
    </div>
  </article>
</section>

<!-- System Design -->
<section class="projects-section reveal" aria-labelledby="sd-heading">
  <h2 id="sd-heading">🧩 System Design</h2>
  <article class="project-card card-gold reveal">
    <div class="card-link" tabindex="0">
      <div class="project-head">
        <h3 class="project-title">Concepts & Roadmaps</h3>
        <span class="project-open">View Docs</span>
      </div>
      <p class="project-desc">Concepts, roadmaps, and scalability principles for designing systems.</p>
      <div class="tags">
        <a class="tag" href="/docs/devops/System-Design/">Intro to System Design</a>
        <a class="tag" href="/docs/devops/System-Design/Roadmap/">System Design Roadmap</a>
        <a class="tag" href="/docs/devops/System-Design/Scaleability/">Scalability</a>
      </div>
    </div>
  </article>
</section>






<!-- ---
title: Devops
layout: full-bleed #home
nav_order: 3
permalink: /docs/devops/
---

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>DevOps Projects — Docs</title>
  <style>
    :root {
      --primary-color: #ffb347;
      --bg-dark: #070708;
      --card-bg-dark: rgba(25,25,34,0.7);
      --text-dark: #e0e0e0;
      --muted: #a7a7a7;
      --accent-purple: #9c27b0;
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
    .wrap { max-width: 1150px; margin: 40px auto; padding: 0 20px; }
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
      padding: 12px 14px;
      text-align: left;
      vertical-align: top;
      color: var(--text-dark);
    }
    th {
      background: rgba(156,39,176,.30);
      color: var(--primary-color);
    }
    tr:nth-child(odd) td { background: rgba(156,39,176,.08); }
    a { color: var(--primary-color); text-decoration: none; }
    a:hover { color: var(--accent-purple); }
    details { margin: 6px 0; }
    summary { cursor: pointer; font-weight: 600; color: var(--accent-purple); }
    summary:hover { color: var(--primary-color); }
  </style>
</head>
<body>
  <main class="wrap">
    <header class="hero">
      <h1 class="h1">⚙️ DevOps Projects</h1>
      <p class="subtitle">An overview of Docker, Kubernetes, Linux, Python, Monitoring, Cloud, and System Design projects in this documentation.</p>
    </header>

    <section>
      <table>
        <thead>
          <tr>
            <th>Technology/Area</th>
            <th>Description</th>
            <th>Sub-Projects / Related Pages</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><a href="/docs/devops/docker">Docker</a></td>
            <td>Containerization technology for packaging and running apps in isolated environments.</td>
            <td>
              <details><summary>View Projects</summary>
                1. <a href="/docs/devops/docker/Netbird/">Netbird VPN Server</a><br>
                2. <a href="/docs/devops/docker/traefik/">Traefik Setup</a><br>
                3. <a href="/docs/devops/docker/uptime-kuma/">Uptime Kuma</a><br>
                4. <a href="/docs/devops/docker/Atlasian/">Atlasian</a><br>
                5. <a href="/docs/devops/docker/Authentik/">Authentik</a><br>
                6. <a href="/docs/devops/docker/hashicorp-vault/">HashiCorp Vault</a><br>
                7. <a href="/docs/devops/docker/Wazuh/">Wazuh</a><br>
                8. <a href="/docs/devops/docker/keycloak/">Keycloak</a><br>
                9. <a href="/docs/devops/docker/minio/">MinIO Intro</a><br>
                10. <a href="/docs/devops/docker/minio-limits/">MinIO Limits</a>
              </details>
            </td>
          </tr>
          <tr>
            <td><a href="/docs/devops/kubernetes">Kubernetes</a></td>
            <td>Orchestrating, scaling, and managing containerized applications.</td>
            <td>
              <details><summary>View Projects</summary>
                1. <a href="/docs/devops/kubernetes/velaro/">Velaro</a><br>
                2. <a href="/docs/devops/kubernetes/Traefik/">Traefik</a><br>
                3. <a href="/docs/devops/kubernetes/Cert-manager/">Cert-manager</a><br>
                4. <a href="/docs/devops/kubernetes/coredns-custom-domains/">CoreDNS Custom Domains</a><br>
                5. <a href="/docs/devops/kubernetes/debug-containers/">Debug Containers</a><br>
                6. <a href="/docs/devops/kubernetes/Grafana-password-reset/">Grafana Password Reset</a><br>
                7. <a href="/docs/devops/kubernetes/cilium/cilium-intro/">Cilium & Hubble Intro</a><br>
                8. <a href="/docs/devops/kubernetes/cilium/cilium-installation-on-eks/">Install Cilium & Hubble on EKS</a><br>
                9. <a href="/docs/devops/kubernetes/prometheus-grafana/">Prometheus & Grafana on EKS</a><br>
                10. <a href="/docs/devops/kubernetes/cilium/cilium-monitoring/">Cilium Monitoring</a><br>
                11. <a href="/docs/devops/kubernetes/helm">Helm Intro</a><br>
                12. <a href="/docs/devops/kubernetes/AWS-ECS-to-EKS-Migration/">ECS → EKS Migration (POC)</a><br>
                13. <a href="/docs/devops/kubernetes/Kubernetes-NodePort-and-iptables-rules/">NodePort & iptables</a><br>
                14. <a href="/docs/devops/kubernetes/Kubernetes-Traffic-Policies/">Traffic Policies</a><br>
                15. <a href="/docs/devops/kubernetes/knative/">Knative Intro</a><br>
                16. <a href="/docs/devops/kubernetes/knative/knative-serving/">Knative Serving</a><br>
                17. <a href="/docs/devops/kubernetes/knative/knative-serving-monitoring/">Knative Monitoring</a><br>
                18. <a href="/docs/devops/kubernetes/karpenter/">Karpenter Intro</a><br>
                19. <a href="/docs/devops/kubernetes/karpenter/karpenter-setup-in-existing-eks-cluster/">Setup Karpenter</a><br>
                20. <a href="/docs/devops/kubernetes/karpenter/karpenter-monitoring/">Karpenter Monitoring</a><br>
                21. <a href="/docs/devops/kubernetes/eks-logs-into-cloudwatch-using-fluentbit/">CloudWatch Logging (Fluent Bit)</a><br>
                22. <a href="/docs/devops/kubernetes/AWS-Load-Balancer-Controller-Setup-for-EKS/">AWS LB Controller on EKS</a>
                23. <a href="/docs/devops/kubernetes/Understanding-Ingress-Controllers/">Understanding Ingress Controllers</a>
                24. <a href="/docs/devops/kubernetes/Installing-NGINX-Ingress/">Installing NGINX Ingress</a>
                25. <a href="/docs/devops/kubernetes/Routing-in-NGINX-Ingress-Controller/">Routing in NGINX Ingress</a>
                26. <a href="/docs/devops/kubernetes/Basic-Authentication-using-NGINX-Ingress/">Basic Authentication in NGINX Ingress</a>
                27. <a href="/docs/devops/kubernetes/secure-your-app-with-https-using-self-signed-tls-certificates/">Ingress Self-Signed TLS for Apps</a>
              </details>
            </td>
          </tr>
          <tr>
            <td><a href="/docs/devops/Linux">Linux</a></td>
            <td>System administration, security, SIEM/XDR, networking, and HA setups.</td>
            <td>
              <details><summary>View Projects</summary>
                1. <a href="/docs/devops/Linux/SIEM-And-XDR/wazuh-introduction/">Wazuh Intro</a><br>
                2. <a href="/docs/devops/Linux/SIEM-And-XDR/wazuh-indexer-setup/">Wazuh Indexer Setup</a><br>
                3. <a href="/docs/devops/Linux/SIEM-And-XDR/wazuh-server-setup/">Wazuh Server Setup</a><br>
                4. <a href="/docs/devops/Linux/SIEM-And-XDR/wazuh-dashboard-setup/">Wazuh Dashboard</a><br>
                5. <a href="/docs/devops/Linux/SIEM-And-XDR/FIM/">File Integrity Monitoring</a><br>
                6. <a href="/docs/devops/Linux/SIEM-And-XDR/malware-detection-and-deletion-and-slack-intergarion/">Malware Detection + Slack</a><br>
                7. <a href="/docs/devops/Linux/SIEM-And-XDR/wazuh-sso-using-keycloak/">Wazuh + Keycloak SSO</a><br>
                8. <a href="/docs/devops/Linux/SIEM-And-XDR/wazuh-to-monitor-docker/">Wazuh + Docker Monitoring</a><br>
                9. <a href="/docs/devops/Linux/SIEM-And-XDR/wazuh-monitoring-container-runtime/">Wazuh + Container Runtime</a><br>
                10. <a href="/docs/devops/Linux/Iptables/iptables/">Linux iptables Intro</a><br>
                11. <a href="/docs/devops/Linux/Iptables/ipvs-loadbalancer/">IPVS LB with NGINX</a><br>
                12. <a href="/docs/devops/Linux/vpn/vpn/">VPN Intro</a><br>
                13. <a href="/docs/devops/Linux/vpn/openvpn-vs-netbird/">OpenVPN vs NetBird</a><br>
                14. <a href="/docs/devops/Linux/kernel/kernel/">Linux Kernel Intro</a><br>
                15. <a href="/docs/devops/Linux/eBPF/">eBPF Importance</a><br>
                16. <a href="/docs/devops/Linux/Postgresql/SETTING-UP-A-POSTGRESQL-HA-CLUSTER/">PostgreSQL HA Cluster</a><br>
                17. <a href="/docs/devops/Linux/Etcd-cluster-setup/Etcd-cluster-setup/">etcd 3-Node Cluster</a><br>
                18. <a href="/docs/devops/Linux/HAProxy-cluster-setup/HAProxy-cluster-setup/">HAProxy + Keepalived</a>
              </details>
            </td>
          </tr>
          <tr>
            <td><a href="/docs/devops/python">Python</a></td>
            <td>Automation, scripts, and tooling for DevOps workflows.</td>
            <td>
              <details><summary>View Projects</summary>
                1. <a href="/docs/devops/python/netbird-python-utility/">Netbird Utility</a><br>
                2. <a href="/docs/devops/python/docker-container-memory-cpu-monitoring/">Docker CPU/Mem Monitoring</a><br>
                3. <a href="/docs/devops/python/docker-container-monitoring-script/">Docker Monitoring Script</a><br>
                4. <a href="/docs/devops/python/greythr-selenium/README/">Greythr Automation</a><br>
                5. <a href="/docs/devops/python/aws-cloudmap-controller/">EKS CloudMap Controller</a><br>
                6. <a href="/docs/devops/python/GitHub-Secrets-Scanner/github-secret-scanner/">GitHub Secrets Scanner</a>
              </details>
            </td>
          </tr>
          <tr>
            <td><a href="/docs/devops/monitoring">Monitoring</a></td>
            <td>Real-time monitoring and observability tools.</td>
            <td>
              <details><summary>View Projects</summary>
                1. <a href="/docs/devops/monitoring/Apache-HertzBeat/">Apache HertzBeat Overview</a><br>
                2. <a href="/docs/devops/monitoring/Apache-HertzBeat-docker/">HertzBeat Docker</a><br>
                3. <a href="/docs/devops/monitoring/Apache-HertzBeat-docker-compose/">HertzBeat Compose</a><br>
                4. <a href="/docs/devops/monitoring/grafana_tempo/">Grafana Tempo Intro</a><br>
                5. <a href="/docs/devops/monitoring/grafana_tempo/Grafana-Tempo-Docker/">Grafana Tempo Docker</a><br>
                6. <a href="/docs/devops/monitoring/grafana_tempo/grafana-tempo-sample-app/">Python App with OTel</a><br>
                7. <a href="/docs/devops/monitoring/grafana_tempo/grafana-tempo-loki-promtail-and-prometheus/">OTel + Loki + Promtail</a>
              </details>
            </td>
          </tr>
          <tr>
            <td><a href="/docs/devops/Cloud">Cloud</a></td>
            <td>AWS, GCP, and multi-cloud patterns for DevOps.</td>
            <td>
              <details><summary>View Projects</summary>
                1. <a href="/docs/devops/Cloud/tf-state-locking/">Terraform State Locking</a><br>
                2. <a href="/docs/devops/Cloud/Gcp/Sap-Hana-Problem-Solution/">Save 40L/year for client</a><br>
                3. <a href="/docs/devops/Cloud/Gcp/Secure-Connectivity-to-SAP-HANA-Private-Cloud-via-Cars24-GCP-Project/">SAP HANA Secure Connectivity</a><br>
                4. <a href="/docs/devops/Cloud/Gcp/Implementation-SAP-HANA-PCE-Access-via-Cars24-GCP/">SAP HANA PCE Access</a><br>
                5. <a href="/docs/devops/Cloud/Gcp/Accessing-GCS-from-GKE-Pods-using-Workload-Identity/">GCS from GKE</a><br>
                6. <a href="/docs/devops/Cloud/Gcp/Cross-cloud-identities-between-GCP-and-AWS/">Cross-Cloud GCP↔AWS</a><br>
                7. <a href="/docs/devops/Cloud/Gcp/Aws-and-GCP-vpc-comparision/">AWS vs GCP VPC</a><br>
                8. <a href="/docs/devops/Cloud/Gcp/Accessing-AWS-Services-from-GKE-using-Workload-Identity-and-Aws-oidc/">AWS Services from GKE</a><br>
                9. <a href="/docs/devops/Cloud/AWS/aws-firewal/">AWS Firewall Egress Filtering</a>
              </details>
            </td>
          </tr>
          <tr>
            <td><a href="/docs/devops/System-Design/">System Design</a></td>
            <td>Concepts, roadmaps, and scalability principles for designing systems.</td>
            <td>
              <details><summary>View Projects</summary>
                1. <a href="/docs/devops/System-Design/">Intro to System Design</a><br>
                2. <a href="/docs/devops/System-Design/Roadmap/">System Design Roadmap</a><br>
                3. <a href="/docs/devops/System-Design/Scaleability/">Scalability</a>
              </details>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</body>
</html> -->

