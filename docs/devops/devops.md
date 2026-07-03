---
layout: full-bleed-glass
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

<!-- Docker -->
<section class="projects-section reveal" aria-labelledby="docker-heading">
  <h2 id="docker-heading">🐳 Docker</h2>
  <article class="project-card card-coral reveal">
    <div class="card-link" tabindex="0">
      <div class="project-head">
        <h3 class="project-title">Containerization</h3>
        <a class="project-open" href="/docs/devops/docker/" aria-label="View Docker docs">
          View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
        </a>
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
        <a class="project-open" href="/docs/devops/kubernetes/" aria-label="View Docker docs">
          View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
        </a>
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
        <a class="tag" href="/docs/devops/kubernetes/knative/knative-serving-part-1/">Knative Serving Part 1</a>
        <a class="tag" href="/docs/devops/kubernetes/knative/knative-serving-part-2/">Knative Serving Part 2</a>
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
        <a class="project-open" href="/docs/devops/Linux/" aria-label="View Docker docs">
          View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
        </a>
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
        <a class="project-open" href="/docs/devops/python/" aria-label="View Docker docs">
          View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
        </a>
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
        <a class="project-open" href="/docs/devops/monitoring/" aria-label="View Docker docs">
          View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
        </a>
      </div>
      <p class="project-desc">Real-time monitoring and observability tools.</p>
      <div class="tags">
        <a class="tag" href="/docs/devops/monitoring/apache-hertzbeat/">Apache HertzBeat Overview</a>
        <a class="tag" href="/docs/devops/monitoring/apache-hertzbeat/Apache-HertzBeat-docker/">HertzBeat Docker</a>
        <a class="tag" href="/docs/devops/monitoring/apache-hertzbeat/Apache-HertzBeat-docker-compose/">HertzBeat Compose</a>
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
        <a class="project-open" href="/docs/devops/Cloud/" aria-label="View Docker docs">
          View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
        </a>
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
        <a class="project-open" href="/docs/devops/System-Design/" aria-label="View Docker docs">
          View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
        </a>
      </div>
      <p class="project-desc">Concepts, roadmaps, and scalability principles for designing systems.</p>
      <div class="tags">
        <a class="tag" href="/docs/devops/System-Design/intro/">Intro to System Design</a>
        <a class="tag" href="/docs/devops/System-Design/Roadmap/">System Design Roadmap</a>
        <a class="tag" href="/docs/devops/System-Design/Scaleability/">Scalability</a>
      </div>
    </div>
  </article>
</section>


<!-- Networking -->
<section class="projects-section reveal" aria-labelledby="sd-heading">
  <h2 id="sd-heading"> Networking Concepts </h2>
  <article class="project-card card-gold reveal">
    <div class="card-link" tabindex="0">
      <div class="project-head">
        <h3 class="project-title">Concepts & Roadmaps</h3>
        <a class="project-open" href="/docs/devops/Networking/" aria-label="View Docker docs">
          View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
        </a>
      </div>
      <p class="project-desc">Networking.</p>
      <div class="tags">
        <a class="tag" href="/docs/devops/Networking/How-NAT-Saved-the-Internet/">How NAT Saved the Internet</a>
      </div>
    </div>
  </article>
</section>

<!-- GitHub -->
<section class="projects-section reveal" aria-labelledby="sd-heading">
  <h2 id="sd-heading"> GitHub Concepts </h2>
  <article class="project-card card-gold reveal">
    <div class="card-link" tabindex="0">
      <div class="project-head">
        <h3 class="project-title">GitHub Concepts</h3>
        <a class="project-open" href="/docs/devops/GitHub/" aria-label="View Docker docs">
          View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i>
        </a>
      </div>
      <p class="project-desc">GitHub.</p>
      <div class="tags">
        <a class="tag" href="/docs/devops/GitHub/Git-Guide-to-Delete-Old-Commits-and-Clear-Sensitive-Info-from-Git-History/">How To: Delete Old Git Commits and Clear Sensitive Files from History</a>
      </div>
    </div>
  </article>
</section>
