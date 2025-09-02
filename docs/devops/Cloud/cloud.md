---
title: Cloud Projects
layout: home
parent: Devops
nav_order: 6
permalink: /docs/devops/Cloud/
---

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cloud Projects — Docs</title>
  <style>
    :root {
      --primary-color: #ffb347;
      --light-primary-shade: #ffd97d;
      --bg-dark: #070708;
      --card-bg-dark: rgba(25,25,34,0.7);
      --section-bg-dark: rgba(25,25,34,0.6);
      --text-dark: #e0e0e0;
      --muted: #a7a7a7;
      --accent-purple: #9c27b0;
      --accent-pink: #ff0080;
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
    .wrap { max-width: 1100px; margin: 40px auto; padding: 0 20px; }
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
      padding: 10px 12px;
      text-align: left;
      color: var(--text-dark);
    }
    th {
      background: rgba(156,39,176,.30);
      color: var(--primary-color);
    }
    tr:nth-child(odd) td { background: rgba(156,39,176,.08); }
    a { color: var(--primary-color); text-decoration: none; }
    a:hover { color: var(--accent-pink); }
  </style>
</head>
<body>
  <main class="wrap">
    <header class="hero">
      <h1 class="h1">☁️ Cloud Projects</h1>
      <p class="subtitle">Documentation for various cloud projects including AWS, GCP, Terraform, and cross-cloud identity setups.</p>
    </header>

    <section>
      <h2><i class="fas fa-list"></i> Available Guides</h2>
      <table>
        <thead>
          <tr>
            <th>Deployment Method</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><a href="/docs/devops/Cloud/tf-state-locking/">Terraform State File Locking</a></td><td>Managing state file locking in Terraform projects.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Cloud/Gcp/Sap-Hana-Problem-Solution/">How we saved 40 Lac/year for a client</a></td><td>SAP HANA access problem & solution.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Cloud/Gcp/Secure-Connectivity-to-SAP-HANA-Private-Cloud-via-Cars24-GCP-Project/">SAP HANA Private Cloud via Cars24 GCP Project</a></td><td>Secure connectivity to SAP HANA Private Cloud via Cars24 GCP Project.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Cloud/Gcp/Implementation-SAP-HANA-PCE-Access-via-Cars24-GCP/">SAP HANA PCE Access (Solution 2)</a></td><td>Implementing SAP HANA PCE access via GCP (Solution 2).</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Cloud/Gcp/Accessing-GCS-from-GKE-Pods-using-Workload-Identity/">Accessing GCS from GKE Pods</a></td><td>Using Workload Identity to access GCS from GKE pods.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Cloud/Gcp/Cross-cloud-identities-between-GCP-and-AWS/">Cross-Cloud Identities GCP⇆AWS</a></td><td>Accessing AWS services from GKE pods using Workload Identity without AWS OIDC.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Cloud/Gcp/Aws-and-GCP-vpc-comparision/">AWS vs. GCP VPC Networking</a></td><td>Virtual Private Cloud (VPC) networking comparison.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Cloud/Gcp/Accessing-AWS-Services-from-GKE-using-Workload-Identity-and-Aws-oidc/">AWS Services from GKE (Workload Identity + OIDC)</a></td><td>Accessing AWS services from GKE using Workload Identity and AWS OIDC.</td><td>✅ Done</td></tr>
          <tr><td><a href="/docs/devops/Cloud/AWS/aws-firewal/">AWS Network Firewall Egress Filtering</a></td><td>Egress filtering with Suricata stateful rules & asymmetric routing trap.</td><td>✅ Done</td></tr>
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>


<!-- # Cloud Projects

{: .no_toc .text-delta }

1. TOC
{:toc}
This section provides documentation for various cloud projects. Select a project below for detailed information.


| Deployment Method         | Description                                                                     | Status |
|--------------------------|---------------------------------------------------------------------------------|--------|
| [Terraform State File Locking](/docs/devops/Cloud/tf-state-locking/) | Managing state file locking in Terraform projects.                       | Done   |
| [How we have saved 40 Lac per year for our client](/docs/devops/Cloud/Gcp/Sap-Hana-Problem-Solution/) | Sap Hana Access Problem & Solution.                                      | Done   |
| [Secure Connectivity to SAP HANA Private Cloud via Cars24 GCP Project](/docs/devops/Cloud/Gcp/Secure-Connectivity-to-SAP-HANA-Private-Cloud-via-Cars24-GCP-Project/) | Secure Connectivity to SAP HANA Private Cloud via Cars24 GCP Project.                                      | Done   |
| [Implementating SAP HANA PCE Access via Cars24 GCP (Solution 2)](/docs/devops/Cloud/Gcp/Implementation-SAP-HANA-PCE-Access-via-Cars24-GCP/) | Implementation: SAP HANA PCE Access via GCP (Solution 2).                                      | Done   |
| [Accessing GCS from GKE Pods using Workload Identity](/docs/devops/Cloud/Gcp/Accessing-GCS-from-GKE-Pods-using-Workload-Identity/) | Accessing GCS from GKE Pods using Workload Identity.                                      | Done   |
| [Accessing AWS Services from GKE Pods using Workload Identity without AWS OIDC](/docs/devops/Cloud/Gcp/Cross-cloud-identities-between-GCP-and-AWS/) | Cross-cloud identities between GCP and AWS from GKE and/or EKS.                                      | Done   |
| [AWS vs. GCP Virtual Private Cloud (VPC) Networking Comparison](/docs/devops/Cloud/Gcp/Aws-and-GCP-vpc-comparision/) | Virtual Private Cloud (VPC) Networking Comparison.                                      | Done   |
| [Accessing AWS Services from GKE using GCP Workload Identity and AWS OIDC](/docs/devops/Cloud/Gcp/Accessing-AWS-Services-from-GKE-using-Workload-Identity-and-Aws-oidc/) | Accessing AWS Services from GKE using Workload Identity and AWS OIDC.                                      | Done   |
| [AWS Network Firewall Egress Filtering with Stateful Suricata Rules – Asymmetric Routing Trap](/docs/devops/Cloud/AWS/aws-firewal/) | AWS Network Firewall Egress Filtering with Stateful Suricata Rules – Asymmetric Routing Trap. | Done | -->
