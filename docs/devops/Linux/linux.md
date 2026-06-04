---
layout: full-bleed-glass
title: "🐧 Linux Projects"
parent: Devops
nav_order: 3
permalink: /docs/devops/Linux/
hero_tag: Linux
hero_title: "🐧 Linux Projects"
hero_intro: >
  <p>System administration, security, SIEM/XDR, high-availability setups, networking, and kernel internals. Real-world production guides for Linux engineers.</p>
nav_buttons:
  - href: /docs/devops/
    label: "All DevOps Topics"
    icon: "fas fa-th-large"
  - href: /docs/about/contact/
    label: "Get in Touch"
    icon: "fas fa-envelope"
---

<section class="projects-section reveal" aria-labelledby="linux-siem">
  <h2 id="linux-siem">🔐 SIEM &amp; XDR — Wazuh</h2>

  <article class="project-card card-red reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">Wazuh Suite</h3>
        <a class="project-open" href="/docs/devops/Linux/SIEM-And-XDR/wazuh-introduction/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Full Wazuh SIEM/XDR stack: installation (indexer, server, dashboard), SSO via Keycloak, Docker monitoring, container runtime monitoring, file integrity monitoring, malware detection + Slack alerts, and CloudWatch log shipping.</p>
      <div class="tags">
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/wazuh-introduction/">Intro</a>
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/wazuh-indexer-setup/">Indexer</a>
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/wazuh-server-setup/">Server</a>
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/wazuh-dashboard-setup/">Dashboard</a>
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/FIM/">FIM</a>
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/wazuh-sso-using-keycloak/">Keycloak SSO</a>
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/wazuh-to-monitor-docker/">Docker Monitor</a>
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/wazuh-monitoring-container-runtime/">Container Runtime</a>
        <a class="tag" href="/docs/devops/Linux/SIEM-And-XDR/malware-detection-and-deletion-and-slack-intergarion/">Malware + Slack</a>
      </div>
    </div>
  </article>
</section>

<section class="projects-section reveal" aria-labelledby="linux-network">
  <h2 id="linux-network">🌐 Networking &amp; Firewall</h2>

  <article class="project-card card-brown reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">iptables &amp; IPVS</h3>
        <a class="project-open" href="/docs/devops/Linux/Iptables/iptables/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Linux iptables introduction and IPVS load balancer with NGINX.</p>
      <div class="tags">
        <a class="tag" href="/docs/devops/Linux/Iptables/iptables/">iptables Intro</a>
        <a class="tag" href="/docs/devops/Linux/Iptables/ipvs-loadbalancer/">IPVS LB + NGINX</a>
      </div>
    </div>
  </article>

  <article class="project-card card-teal reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">VPN — OpenVPN vs NetBird</h3>
        <a class="project-open" href="/docs/devops/Linux/vpn/vpn/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">VPN fundamentals and a comparison between OpenVPN and Netbird.</p>
      <div class="tags">
        <a class="tag" href="/docs/devops/Linux/vpn/vpn/">VPN Intro</a>
        <a class="tag" href="/docs/devops/Linux/vpn/openvpn-vs-netbird/">OpenVPN vs NetBird</a>
      </div>
    </div>
  </article>
</section>

<section class="projects-section reveal" aria-labelledby="linux-ha">
  <h2 id="linux-ha">🏗️ High Availability</h2>

  <article class="project-card card-gold reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">PostgreSQL HA Cluster</h3>
        <a class="project-open" href="/docs/devops/Linux/Postgresql/SETTING-UP-A-POSTGRESQL-HA-CLUSTER/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Setting up a PostgreSQL high-availability cluster on Linux.</p>
      <div class="tags"><span class="tag">PostgreSQL</span><span class="tag">HA</span><span class="tag">Database</span></div>
    </div>
  </article>

  <article class="project-card card-purple reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">etcd 3-Node Cluster</h3>
        <a class="project-open" href="/docs/devops/Linux/Etcd-cluster-setup/Etcd-cluster-setup/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Setting up a 3-node etcd cluster for distributed key-value storage.</p>
      <div class="tags"><span class="tag">etcd</span><span class="tag">Cluster</span><span class="tag">HA</span></div>
    </div>
  </article>

  <article class="project-card card-orange reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">HAProxy + Keepalived</h3>
        <a class="project-open" href="/docs/devops/Linux/HAProxy-cluster-setup/HAProxy-cluster-setup/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Building an HA load balancer with HAProxy and Keepalived for VIP failover.</p>
      <div class="tags"><span class="tag">HAProxy</span><span class="tag">Keepalived</span><span class="tag">VIP</span></div>
    </div>
  </article>
</section>

<section class="projects-section reveal" aria-labelledby="linux-kernel">
  <h2 id="linux-kernel">⚙️ Kernel &amp; eBPF</h2>

  <article class="project-card card-coral reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">Linux Kernel &amp; eBPF</h3>
        <a class="project-open" href="/docs/devops/Linux/kernel/kernel/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Linux kernel internals and the importance of eBPF for modern observability and security.</p>
      <div class="tags">
        <a class="tag" href="/docs/devops/Linux/kernel/kernel/">Kernel Intro</a>
        <a class="tag" href="/docs/devops/Linux/eBPF/">eBPF</a>
      </div>
    </div>
  </article>
</section>
