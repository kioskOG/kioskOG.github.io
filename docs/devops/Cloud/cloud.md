---
layout: full-bleed-glass
title: "☁️ Cloud Projects"
parent: Devops
nav_order: 6
permalink: /docs/devops/Cloud/
hero_tag: Cloud
hero_title: "☁️ Cloud Projects"
hero_intro: >
  <p>AWS, GCP, Oracle Cloud, and multi-cloud architecture patterns. IaC, cross-cloud identity, workload identity, VPC comparisons, and cost optimization guides.</p>
nav_buttons:
  - href: /docs/devops/
    label: "All DevOps Topics"
    icon: "fas fa-th-large"
  - href: /docs/about/contact/
    label: "Get in Touch"
    icon: "fas fa-envelope"
---

<section class="projects-section reveal" aria-labelledby="cloud-gcp">
  <h2 id="cloud-gcp">🌐 GCP Projects</h2>

  <article class="project-card card-teal reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">SAP HANA — Save 40L/year</h3>
        <a class="project-open" href="/docs/devops/Cloud/Gcp/Sap-Hana-Problem-Solution/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Architectural solution that saved a client ₹40L/year in SAP HANA cloud costs using GCP.</p>
      <div class="tags"><span class="tag">GCP</span><span class="tag">SAP HANA</span><span class="tag">Cost Optimization</span></div>
    </div>
  </article>

  <article class="project-card card-purple reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">Cross-Cloud Identity — GCP ↔ AWS</h3>
        <a class="project-open" href="/docs/devops/Cloud/Gcp/Cross-cloud-identities-between-GCP-and-AWS/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Setting up Workload Identity Federation for cross-cloud identity between GCP and AWS.</p>
      <div class="tags"><span class="tag">GCP</span><span class="tag">AWS</span><span class="tag">OIDC</span><span class="tag">Workload Identity</span></div>
    </div>
  </article>

  <article class="project-card card-gold reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">GKE Workload Identity</h3>
        <a class="project-open" href="/docs/devops/Cloud/Gcp/Accessing-GCS-from-GKE-Pods-using-Workload-Identity/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Accessing GCS and AWS services from GKE pods using Workload Identity without static credentials.</p>
      <div class="tags">
        <a class="tag" href="/docs/devops/Cloud/Gcp/Accessing-GCS-from-GKE-Pods-using-Workload-Identity/">GCS from GKE</a>
        <a class="tag" href="/docs/devops/Cloud/Gcp/Accessing-AWS-Services-from-GKE-using-Workload-Identity-and-Aws-oidc/">AWS from GKE (OIDC)</a>
      </div>
    </div>
  </article>

  <article class="project-card card-coral reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">AWS vs GCP VPC Comparison</h3>
        <a class="project-open" href="/docs/devops/Cloud/Gcp/Aws-and-GCP-vpc-comparision/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Side-by-side comparison of AWS and GCP networking concepts and VPC architecture.</p>
      <div class="tags"><span class="tag">AWS</span><span class="tag">GCP</span><span class="tag">VPC</span><span class="tag">Networking</span></div>
    </div>
  </article>
</section>

<section class="projects-section reveal" aria-labelledby="cloud-aws">
  <h2 id="cloud-aws">☁️ AWS Projects</h2>

  <article class="project-card card-orange reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">AWS Firewall Egress Filtering</h3>
        <a class="project-open" href="/docs/devops/Cloud/AWS/aws-firewal/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Implementing AWS Network Firewall for egress traffic filtering and inspection.</p>
      <div class="tags"><span class="tag">AWS</span><span class="tag">Firewall</span><span class="tag">Security</span><span class="tag">Egress</span></div>
    </div>
  </article>

  <article class="project-card card-orange reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">AWS Firewall Egress Filtering</h3>
        <a class="project-open" href="/docs/devops/Cloud/AWS/aws-firewall/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Connecting Retool to a Private PostgreSQL RDS Across AWS Accounts Without VPC Peering.</p>
      <div class="tags"><span class="tag">AWS</span><span class="tag">PostgreSQL</span><span class="tag">Retool</span><span class="tag">Security</span></div>
    </div>
  </article>

</section>

<section class="projects-section reveal" aria-labelledby="cloud-iac">
  <h2 id="cloud-iac">🛠️ IaC &amp; Multi-Cloud</h2>

  <article class="project-card card-brown reveal">
    <div class="card-link">
      <div class="project-head">
        <h3 class="project-title">Terraform State Locking</h3>
        <a class="project-open" href="/docs/devops/Cloud/tf-state-locking/">View Docs <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
      </div>
      <p class="project-desc">Implementing remote state locking for Terraform to prevent concurrent state corruption.</p>
      <div class="tags"><span class="tag">Terraform</span><span class="tag">IaC</span><span class="tag">S3</span><span class="tag">DynamoDB</span></div>
    </div>
  </article>
</section>