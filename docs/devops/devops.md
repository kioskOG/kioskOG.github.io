---
layout: devops
title: DevOps | Jatin Sharma
nav_order: 3
permalink: /docs/devops/
hero_tag: DevOps Projects
hero_title: ⚙️ DevOps Projects
hero_intro: '<p>An overview of Docker, Kubernetes, Linux, Python, Monitoring, Cloud,
  and System Design projects in this documentation.</p>

  '
nav_buttons:
- href: /docs/about/
  label: About Me
  icon: fas fa-user-circle
- href: /docs/about/contact/
  label: Get in Touch
  icon: fas fa-envelope
social_html: "<a href=\"mailto:jatinvashishtha110@gmail.com\" title=\"Email Jatin\
  \ via Gmail\" aria-label=\"Email Jatin via Gmail\">\n  <img src=\"https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white\"\
  \ alt=\"Gmail Badge\" loading=\"lazy\"/>\n</a>\n<a href=\"https://www.linkedin.com/in/jatin-devops/\"\
  \ target=\"_blank\" rel=\"noopener\" title=\"LinkedIn\" aria-label=\"Visit Jatin\
  \ on LinkedIn\">\n  <img src=\"https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white\"\
  \ alt=\"LinkedIn Badge\" loading=\"lazy\"/>\n</a>\n<a href=\"https://github.com/kioskog\"\
  \ target=\"_blank\" rel=\"noopener\" title=\"GitHub\" aria-label=\"Visit Jatin on\
  \ GitHub\">\n  <img src=\"https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white\"\
  \ alt=\"GitHub Badge\" loading=\"lazy\"/>\n</a>"
type: concept
tags:
- devops
timestamp: '2026-06-30T11:56:08Z'
---

<!-- DevOps Focus Areas Bento Dashboard -->
<section class="projects-section reveal" aria-labelledby="devops-heading">
  <h2 id="devops-heading">⚙️ DevOps Focus Areas & Lab Guides</h2>

  <div class="bento-projects-grid">
    <!-- Kubernetes (Wide - Row 1) -->
    <article class="project-card card-teal wide reveal">
      <div class="card-link" tabindex="0">
        <div class="project-head">
          <h3 class="project-title">☸️ Kubernetes & Orchestration</h3>
          <a class="project-open" href="/docs/devops/kubernetes/" aria-label="View Kubernetes docs">
            View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
          </a>
        </div>
        <p class="project-desc">Orchestrating, scaling, and managing containerized applications at scale.</p>
        <div class="tags">
          <a class="tag" href="/docs/devops/kubernetes/velaro/">Velaro</a>
          <a class="tag" href="/docs/devops/kubernetes/Traefik/">Traefik</a>
          <a class="tag" href="/docs/devops/kubernetes/Cert-manager/">cert-manager</a>
          <a class="tag" href="/docs/devops/kubernetes/coredns-custom-domains/">CoreDNS</a>
          <a class="tag" href="/docs/devops/kubernetes/debug-containers/">Debug Containers</a>
          <a class="tag" href="/docs/devops/kubernetes/cilium/cilium-intro/">Cilium Intro</a>
          <a class="tag" href="/docs/devops/kubernetes/cilium/cilium-installation-on-eks/">EKS Cilium</a>
          <a class="tag" href="/docs/devops/kubernetes/prometheus-grafana/">EKS Prometheus</a>
          <a class="tag" href="/docs/devops/kubernetes/helm">Helm Intro</a>
          <a class="tag" href="/docs/devops/kubernetes/AWS-ECS-to-EKS-Migration/">ECS → EKS Migration</a>
          <a class="tag" href="/docs/devops/kubernetes/knative/">Knative Intro</a>
          <a class="tag" href="/docs/devops/kubernetes/karpenter/">Karpenter Intro</a>
          <a class="tag" href="/docs/devops/kubernetes/Understanding-Ingress-Controllers/">Ingress Guides</a>
        </div>
      </div>
    </article>

    <!-- Docker (Normal - Row 1) -->
    <article class="project-card card-coral normal reveal">
      <div class="card-link" tabindex="0">
        <div class="project-head">
          <h3 class="project-title">🐳 Containerization</h3>
          <a class="project-open" href="/docs/devops/docker/" aria-label="View Docker docs">
            View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
          </a>
        </div>
        <p class="project-desc">Containerization technology for packaging and running apps in isolated environments.</p>
        <div class="tags">
          <a class="tag" href="/docs/devops/docker/Netbird/">Netbird VPN</a>
          <a class="tag" href="/docs/devops/docker/traefik/">Traefik Setup</a>
          <a class="tag" href="/docs/devops/docker/uptime-kuma/">Uptime Kuma</a>
          <a class="tag" href="/docs/devops/docker/Authentik/">Authentik</a>
          <a class="tag" href="/docs/devops/docker/hashicorp-vault/">Vault</a>
          <a class="tag" href="/docs/devops/docker/Wazuh/">Wazuh</a>
          <a class="tag" href="/docs/devops/docker/minio/">MinIO</a>
        </div>
      </div>
    </article>

    <!-- Linux (Normal - Row 2) -->
    <article class="project-card card-brown normal reveal">
      <div class="card-link" tabindex="0">
        <div class="project-head">
          <h3 class="project-title">🐧 Linux Admin & Security</h3>
          <a class="project-open" href="/docs/devops/Linux/" aria-label="View Linux docs">
            View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
          </a>
        </div>
        <p class="project-desc">System administration, security, SIEM/XDR, networking, and HA setups.</p>
        <div class="tags">
          <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/wazuh-introduction/">Wazuh Indexer</a>
          <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/FIM/">FIM</a>
          <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/malware-detection-and-deletion-and-slack-intergarion/">Malware Guard</a>
          <a class="tag" href="/docs/devops/Linux/Iptables/iptables/">iptables</a>
          <a class="tag" href="/docs/devops/Linux/vpn/vpn/">VPN</a>
          <a class="tag" href="/docs/devops/Linux/eBPF/">eBPF</a>
          <a class="tag" href="/docs/devops/Linux/Postgresql/SETTING-UP-A-POSTGRESQL-HA-CLUSTER/">Postgres HA</a>
          <a class="tag" href="/docs/devops/Linux/HAProxy-cluster-setup/HAProxy-cluster-setup/">HAProxy</a>
        </div>
      </div>
    </article>

    <!-- Monitoring (Normal - Row 2) -->
    <article class="project-card card-orange normal reveal">
      <div class="card-link" tabindex="0">
        <div class="project-head">
          <h3 class="project-title">📊 Observability & Monitoring</h3>
          <a class="project-open" href="/docs/devops/monitoring/" aria-label="View Monitoring docs">
            View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
          </a>
        </div>
        <p class="project-desc">Real-time monitoring and observability setups.</p>
        <div class="tags">
          <a class="tag" href="/docs/devops/monitoring/apache-hertzbeat/">HertzBeat</a>
          <a class="tag" href="/docs/devops/monitoring/grafana_tempo/">Tempo Intro</a>
          <a class="tag" href="/docs/devops/monitoring/grafana_tempo/grafana-tempo-sample-app/">OTel App</a>
          <a class="tag" href="/docs/devops/monitoring/grafana_tempo/grafana-tempo-loki-promtail-and-prometheus/">Loki + Promtail</a>
        </div>
      </div>
    </article>

    <!-- Cloud (Normal - Row 2) -->
    <article class="project-card card-red normal reveal">
      <div class="card-link" tabindex="0">
        <div class="project-head">
          <h3 class="project-title">☁️ Cloud Infrastructure</h3>
          <a class="project-open" href="/docs/devops/Cloud/" aria-label="View Cloud docs">
            View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
          </a>
        </div>
        <p class="project-desc">AWS, GCP, and multi-cloud patterns for modern applications.</p>
        <div class="tags">
          <a class="tag" href="/docs/devops/Cloud/tf-state-locking/">Terraform Locking</a>
          <a class="tag" href="/docs/devops/Cloud/Gcp/Sap-Hana-Problem-Solution/">Client Cost Saving</a>
          <a class="tag" href="/docs/devops/Cloud/Gcp/Accessing-GCS-from-GKE-Pods-using-Workload-Identity/">GCS Workload Identity</a>
          <a class="tag" href="/docs/devops/Cloud/Gcp/Cross-cloud-identities-between-GCP-and-AWS/">Cross-Cloud GCP/AWS</a>
          <a class="tag" href="/docs/devops/Cloud/AWS/aws-firewal/">AWS Firewall</a>
        </div>
      </div>
    </article>

    <!-- Python (Half - Row 3) -->
    <article class="project-card card-purple wide reveal">
      <div class="card-link" tabindex="0">
        <div class="project-head">
          <h3 class="project-title">🐍 Automation & Tooling</h3>
          <a class="project-open" href="/docs/devops/python/" aria-label="View Python docs">
            View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
          </a>
        </div>
        <p class="project-desc">Automation, scripts, and custom tooling built in Python.</p>
        <div class="tags">
          <a class="tag" href="/docs/devops/python/netbird-python-utility/">Netbird Utility</a>
          <a class="tag" href="/docs/devops/python/docker-container-monitoring-script/">Docker Monitor</a>
          <a class="tag" href="/docs/devops/python/greythr-selenium/README/">Greythr Automation</a>
          <a class="tag" href="/docs/devops/python/aws-cloudmap-controller/">CloudMap Controller</a>
          <a class="tag" href="/docs/devops/python/GitHub-Secrets-Scanner/github-secret-scanner/">Secrets Scanner</a>
        </div>
      </div>
    </article>

    <!-- System Design (Half - Row 3) -->
    <article class="project-card card-gold wide reveal">
      <div class="card-link" tabindex="0">
        <div class="project-head">
          <h3 class="project-title">🧩 System Design Concepts</h3>
          <a class="project-open" href="/docs/devops/System-Design/" aria-label="View System Design docs">
            View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
          </a>
        </div>
        <p class="project-desc">Concepts, roadmaps, and scalability principles for designing robust platforms.</p>
        <div class="tags">
          <a class="tag" href="/docs/devops/System-Design/intro/">Intro to System Design</a>
          <a class="tag" href="/docs/devops/System-Design/Roadmap/">Roadmap</a>
          <a class="tag" href="/docs/devops/System-Design/Scaleability/">Scalability</a>
        </div>
      </div>
    </article>

    <!-- Networking (Half - Row 4) -->
    <article class="project-card card-gold wide reveal">
      <div class="card-link" tabindex="0">
        <div class="project-head">
          <h3 class="project-title">🌐 Networking Concepts</h3>
          <a class="project-open" href="/docs/devops/Networking/" aria-label="View Networking docs">
            View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
          </a>
        </div>
        <p class="project-desc">Protocols, routing mechanisms, and core internet infrastructure concepts.</p>
        <div class="tags">
          <a class="tag" href="/docs/devops/Networking/How-NAT-Saved-the-Internet/">How NAT Saved the Internet</a>
        </div>
      </div>
    </article>

    <!-- GitHub (Half - Row 4) -->
    <article class="project-card card-gold wide reveal">
      <div class="card-link" tabindex="0">
        <div class="project-head">
          <h3 class="project-title">🐈 Git & GitHub Guides</h3>
          <a class="project-open" href="/docs/devops/GitHub/" aria-label="View GitHub docs">
            View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
          </a>
        </div>
        <p class="project-desc">GitHub configurations, actions setup, and history cleanups.</p>
        <div class="tags">
          <a class="tag" href="/docs/devops/GitHub/Git-Guide-to-Delete-Old-Commits-and-Clear-Sensitive-Info-from-Git-History/">Delete Commits & Clear Files from History</a>
        </div>
      </div>
    </article>
  </div>
</section>
