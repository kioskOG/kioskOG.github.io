---
title: Secure Connectivity to SAP HANA Private Cloud via Cars24 GCP Project
layout: home
parent: How we have saved 40 Lac per year for our client
grand_parent: Google Cloud Platform
nav_order: 1
permalink: /docs/devops/Cloud/Gcp/Secure-Connectivity-to-SAP-HANA-Private-Cloud-via-Cars24-GCP-Project
description: Documentation for Secure Connectivity to SAP HANA Private Cloud via Cars24 GCP Project.
---

# Secure Connectivity to SAP HANA Private Cloud via Cars24 GCP Project


## 🚀 Overview
This proof-of-concept (PoC) document outlines Solution 2 for securely accessing SAP HANA Private Cloud (PCE) resources through the Cars24 GCP Project, leveraging self-hosted VPN and DNS for centralized control and ease of management.

The solution enables both on-premise (office) and remote users to securely access SAP services over a private network, without exposing the SAP HANA environment publicly.


## 🧱 Architecture Summary

## 🔑 Key Components

| Component             | Description                                                                                               | Internal Users | Remote Users | GCP Project | SAP HANA PCE | Self-Hosted VPN | Bind9 DNS | VPC Peering                 |
|-----------------------|-----------------------------------------------------------------------------------------------------------|----------------|--------------|-------------|--------------|-----------------|-----------|-----------------------------|
| **Cars24 Office** | Internal users (user1, user2) who access SAP via VPN                                                      | Yes            | No           | No          | No           | No              | Yes       | No                          |
| **Remote User** | External users (e.g., support or consultants) connecting via VPN                                          | No             | Yes          | No          | No           | No              | Yes       | No                          |
| **Cars24 GCP Project**| Acts as a transit hub and houses DNS + VPN services                                                      | Yes            | Yes          | Yes         | No           | Yes             | Yes       | Connects to SAP HANA PCE    |
| **SAP HANA PCE** | Private SAP environment with DNS cluster and application stack                                            | Yes            | Yes          | No          | Yes          | No              | Yes       | Connected to Cars24 GCP     |
| **Self-Hosted VPN** | Runs on a GCP VM to handle all client-to-site VPN connections                                            | Yes            | Yes          | Yes         | No           | Yes             | No        | No                          |
| **Bind9 DNS** | Custom DNS servers configured for internal name resolution                                              | Yes            | Yes          | Yes         | Yes          | No              | Yes       | Used by both GCP & SAP PCE |
| **VPC Peering** | Connects Cars24 GCP with SAP HANA PCE (10.0.0.0/16 ↔ 10.1.0.0/16)                                        | Yes            | Yes          | Yes         | Yes          | No              | Yes       | Yes                         |

---

## 🧪 Proof of Concept Goals

✅ Enable secure, **client-to-site VPN** connectivity for internal and remote users

✅ Establish **VPC Peering** between GCP and SAP PCE networks

✅ Centralize **DNS resolution** in GCP for internal SAP domains (`*.sap.cars24.team`)

✅ Isolate access—users get **access only via VPN**, nothing exposed publicly

✅ Test domain resolution and service access (e.g., `abc.sap.cars24.team`, `def.sap.cars24.team`)



## 🔐 Connectivity Flow
**Step-by-Step Breakdown**

### 1. VPN Setup (Client-to-Site)
Users (office or remote) connect to a **Self-Hosted VPN** running in the Cars24 GCP project.

### 2. DNS Resolution
VPN clients receive the internal DNS IPs (e.g., `10.0.0.10`, `10.0.0.20`) via configuration. These DNS servers are configured using `Bind9` to resolve SAP internal domains.

### 3. VPC Peering
The GCP VPC (10.0.0.0/16) is peered with the SAP PCE VPC (10.1.0.0/16), allowing transparent routing between the environments.

### 4. Service Access
Once connected, users can access internal SAP services like:

* `abc.sap.cars24.team`

* `def.sap.cars24.team` These resolve via DNS and route through the peered VPC.




## 🛠️ Implementation Details

> Fill in these sections based on your specific setup.

### 🧩 NetBird Setup on GCP

* VPN server deployment on a GCP VM

* User key distribution and client config

* Allowed IPs: `10.0.0.0/16`, `10.1.0.0/16`

* Routing and NAT configuration

### 📘 Bind9 DNS Configuration

* Custom zones for:

   * `sap.cars24.team`

   * Reverse DNS (PTR) for SAP IP ranges

* Forwarders for internet or SAP DNS cluster

* Access control based on VPN subnet


## 🧪 Test Cases

| Test Description                                  | Expected Result                                            |
|---------------------------------------------------|------------------------------------------------------------|
| VPN client connects                               | Assigned IP from 10.0.0.0/16                             |
| DNS lookup for abc.sap.cars24.team                | Resolves to private SAP IP (10.1.x.x)                      |
| Access SAP HANA dashboard via browser             | UI loads successfully                                      |
| DNS lookup from VPN client                        | Uses 10.0.0.10/10.0.0.20 successfully                      |

