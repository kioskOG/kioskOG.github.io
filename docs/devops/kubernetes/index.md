---
layout: full-bleed-glass
title: ☸️ Kubernetes Projects
parent: Devops
nav_order: 2
permalink: /docs/devops/kubernetes/
hero_tag: Kubernetes
hero_title: ☸️ Kubernetes Projects
hero_intro: '<p>Orchestrating, scaling, and managing containerized applications at
  production scale. Covering EKS, Helm, CNI plugins, ingress controllers, autoscaling,
  and GitOps tooling.</p>

  '
nav_buttons:
- href: /docs/devops/
  label: All DevOps Topics
  icon: fas fa-th-large
- href: /docs/about/contact/
  label: Get in Touch
  icon: fas fa-envelope
type: index
tags:
- devops
- kubernetes
timestamp: '2026-06-02T18:19:29Z'
---

<section class="projects-section reveal" aria-labelledby="k8s-guides">
  <h2 id="k8s-guides">☸️ Core Platform</h2>

  <article class="project-card card-teal reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">Velero — Backup &amp; Restore</h3>
        <a class="project-open" href="/docs/devops/kubernetes/velaro/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Kubernetes cluster backup, restore, and disaster recovery using Velero.</p>
      <div class="tags"><span class="tag">Velero</span><span class="tag">Backup</span><span class="tag">DR</span></div>
    </div>
  </article>

  <article class="project-card card-purple reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">Traefik on Kubernetes</h3>
        <a class="project-open" href="/docs/devops/kubernetes/Traefik/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Deploying and configuring Traefik as a Kubernetes ingress controller.</p>
      <div class="tags"><span class="tag">Traefik</span><span class="tag">Ingress</span><span class="tag">Kubernetes</span></div>
    </div>
  </article>

  <article class="project-card card-gold reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">cert-manager</h3>
        <a class="project-open" href="/docs/devops/kubernetes/Cert-manager/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Automated TLS certificate management in Kubernetes using cert-manager.</p>
      <div class="tags"><span class="tag">TLS</span><span class="tag">cert-manager</span><span class="tag">Let's Encrypt</span></div>
    </div>
  </article>

  <article class="project-card card-coral reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">Karpenter Autoscaler</h3>
        <a class="project-open" href="/docs/devops/kubernetes/karpenter/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Just-in-time node provisioning with Karpenter on EKS — setup, NodePools, and Prometheus monitoring.</p>
      <div class="tags">
        <a class="tag" href="/docs/devops/kubernetes/karpenter/">Intro</a>
        <a class="tag" href="/docs/devops/kubernetes/karpenter/karpenter-setup-in-existing-eks-cluster/">EKS Setup</a>
        <a class="tag" href="/docs/devops/kubernetes/karpenter/karpenter-monitoring/">Monitoring</a>
      </div>
    </div>
  </article>

  <article class="project-card card-teal reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">Cilium &amp; Hubble</h3>
        <a class="project-open" href="/docs/devops/kubernetes/cilium/cilium-intro/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">eBPF-powered networking, security, and observability with Cilium on EKS.</p>
      <div class="tags"><span class="tag">Cilium</span><span class="tag">eBPF</span><span class="tag">CNI</span><span class="tag">Hubble</span></div>
    </div>
  </article>

  <article class="project-card card-orange reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">Knative Serving</h3>
        <a class="project-open" href="/docs/devops/kubernetes/knative/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Serverless workloads on Kubernetes using Knative Serving with monitoring.</p>
      <div class="tags"><span class="tag">Knative</span><span class="tag">Serverless</span><span class="tag">Kubernetes</span></div>
    </div>
  </article>

  <article class="project-card card-brown reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">Helm Charts</h3>
        <a class="project-open" href="/docs/devops/kubernetes/helm">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Helm package manager — first charts, templates, values, functions, and pipelines.</p>
      <div class="tags"><span class="tag">Helm</span><span class="tag">Packaging</span><span class="tag">Kubernetes</span></div>
    </div>
  </article>
</section>

<section class="projects-section reveal" aria-labelledby="k8s-ingress">
  <h2 id="k8s-ingress">🔀 Ingress &amp; Networking</h2>

  <article class="project-card card-purple reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">NGINX Ingress Controllers</h3>
        <a class="project-open" href="/docs/devops/kubernetes/Understanding-Ingress-Controllers/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <div class="tags">
        <a class="tag" href="/docs/devops/kubernetes/Understanding-Ingress-Controllers/">Overview</a>
        <a class="tag" href="/docs/devops/kubernetes/Installing-NGINX-Ingress/">Install</a>
        <a class="tag" href="/docs/devops/kubernetes/Routing-in-NGINX-Ingress-Controller/">Routing</a>
        <a class="tag" href="/docs/devops/kubernetes/Basic-Authentication-using-NGINX-Ingress/">Basic Auth</a>
        <a class="tag" href="/docs/devops/kubernetes/secure-your-app-with-https-using-self-signed-tls-certificates/">TLS / HTTPS</a>
      </div>
    </div>
  </article>

  <article class="project-card card-gold reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">AWS Load Balancer Controller</h3>
        <a class="project-open" href="/docs/devops/kubernetes/AWS-Load-Balancer-Controller-Setup-for-EKS/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Setting up the AWS Load Balancer Controller on EKS for ALB/NLB integration.</p>
      <div class="tags"><span class="tag">AWS</span><span class="tag">EKS</span><span class="tag">ALB</span><span class="tag">NLB</span></div>
    </div>
  </article>

  <article class="project-card card-teal reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">Traffic Policies &amp; NodePort</h3>
        <a class="project-open" href="/docs/devops/kubernetes/Kubernetes-Traffic-Policies/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Deep dive into Kubernetes traffic policies, NodePort, and iptables rules.</p>
      <div class="tags"><span class="tag">Networking</span><span class="tag">iptables</span><span class="tag">Service</span></div>
    </div>
  </article>

  <article class="project-card card-coral reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">CoreDNS Custom Domains</h3>
        <a class="project-open" href="/docs/devops/kubernetes/coredns-custom-domains/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Configuring CoreDNS for custom internal domains.</p>
      <div class="tags"><span class="tag">CoreDNS</span><span class="tag">DNS</span><span class="tag">Kubernetes</span></div>
    </div>
  </article>
</section>

<section class="projects-section reveal" aria-labelledby="k8s-aws">
  <h2 id="k8s-aws">☁️ AWS / EKS</h2>

  <article class="project-card card-orange reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">ECS → EKS Migration (POC)</h3>
        <a class="project-open" href="/docs/devops/kubernetes/AWS-ECS-to-EKS-Migration/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Proof-of-concept for migrating workloads from AWS ECS to EKS.</p>
      <div class="tags"><span class="tag">ECS</span><span class="tag">EKS</span><span class="tag">Migration</span></div>
    </div>
  </article>

  <article class="project-card card-brown reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">EKS Logs → CloudWatch (Fluent Bit)</h3>
        <a class="project-open" href="/docs/devops/kubernetes/eks-logs-into-cloudwatch-using-fluentbit/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Shipping EKS pod logs into CloudWatch using AWS for Fluent Bit.</p>
      <div class="tags"><span class="tag">EKS</span><span class="tag">CloudWatch</span><span class="tag">Fluent Bit</span></div>
    </div>
  </article>

  <article class="project-card card-red reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">Prometheus &amp; Grafana on EKS</h3>
        <a class="project-open" href="/docs/devops/kubernetes/prometheus-grafana/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Setting up a full Prometheus + Grafana monitoring stack on EKS.</p>
      <div class="tags"><span class="tag">Prometheus</span><span class="tag">Grafana</span><span class="tag">EKS</span></div>
    </div>
  </article>
</section>
