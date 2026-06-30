---
title: AWS Network Firewall Egress Filtering with Stateful Suricata Rules – Asymmetric
  Routing Trap
layout: doc-page
parent: AWS Cloud Platform
grand_parent: Cloud Projects
nav_order: 1
author: Jatin Sharma
permalink: /docs/devops/Cloud/AWS/aws-firewal/
description: Documentation for AWS Network Firewall Egress Filtering with Stateful
  Suricata Rules – Asymmetric Routing Trap.
type: concept
tags:
- devops
- cloud
- aws
timestamp: '2026-04-17T09:40:40Z'
---

# 🚀 AWS Network Firewall Egress Filtering – Asymmetric Routing Trap ⚠️

Today I deep-dived into setting up **AWS Network Firewall** purely for egress filtering. The architecture involved:

Private subnets → Firewall endpoint → NAT Gateway → Internet

Route tables ensured all outbound traffic from private subnets went through the firewall. This learning focuses on a critical challenge encountered and its resolution.

---

## ⚙️ Networking Setup

We had three key subnets configured:

### Public Subnet (for NAT & IGW)

| Destination | Target |
| --- | --- |
| 10.0.0.0/16 | local |
| 0.0.0.0/0 | igw-031872b0c98985551 |

### Private Subnet (workloads)

| Destination | Target |
| --- | --- |
| 10.0.0.0/16 | local |
| 0.0.0.0/0 | vpce-093bd2b6f096cabd5 (Firewall Endpoint) |

### Firewall Subnet

| Destination | Target |
| --- | --- |
| 10.0.0.0/16 | local |
| 0.0.0.0/0 | nat-0382e8c908a281ec2 |

---

## ⚠️ The Problem: Stateful Suricata Rules Bypass

We implemented tight stateful Suricata rules within the AWS Network Firewall for egress filtering. Here's a snippet of the rules in use:

```
reject tls any any -> any any (msg:"Block Facebook.com via SNI"; tls.sni; content:"facebook.com"; nocase; endswith; sid:1000006; rev:1;)
reject tls any any -> any any (msg:"Block google.com via SNI"; tls.sni; content:"google.com"; nocase; endswith; sid:1000007; rev:1;)
reject tls any any -> any any (msg:"Block github.com via SNI"; tls.sni; content:"github.com"; nocase; endswith; sid:1000008; rev:1;)
pass tcp any any -> any any (flow:established; msg:"pass all other TCP traffic"; sid:1000004; rev:2;)
```

Even with these rules in place, I observed an unexpected behavior:

```
curl https://www.google.com
```

executed from my private instance still **succeeded**, indicating that the firewall was not blocking the domain as intended. This was a clear indication that something was missing in the traffic flow.

---

## 🔍 Root Cause: Asymmetric Routing

The core issue turned out to be a classic **asymmetric routing problem**.

* **Egress Traffic Flow**: Outbound traffic from the private subnets was correctly routed: `Private subnets → Firewall endpoint → NAT Gateway → Internet`.
* **Return Traffic Flow**: However, the return traffic from the Internet (via the NAT Gateway) back to the private subnet took a direct, local route: `NAT Gateway → Private subnet`. This path completely bypassed the firewall endpoint.

Because the AWS Network Firewall did not see both directions of the TCP session, it could not maintain the full state of the connection, nor could it effectively enforce the TLS SNI blocking rules. Consequently, the connection was allowed to succeed despite the explicit block rules.

---

## 🔄 Understanding Symmetric vs. Asymmetric Routing

**Symmetric routing** means that both the outbound and return traffic for a given session follow the **exact same path**, ensuring that all packets belonging to a single connection flow through the same firewall (or firewall pair) in both directions.

### 1. Asymmetric Routing (The Problem State)

In an asymmetric routing scenario, the outbound and inbound paths for the same TLS connection do not both traverse the firewall, leading to incomplete session visibility.

**Outbound Flow (Client Initiates TLS):**

1. Your application in the Private Subnet sends a ClientHello message (part of the TLS handshake) to `google.com`.
2. The Private Subnet's Route Table directs this traffic to the Firewall Endpoint.
3. The Network Firewall (seeing the ClientHello including SNI: `google.com`) allows it (if no rules block it outbound) and creates a stateful entry for the connection.
4. The Firewall Subnet's Route Table directs the traffic to the NAT Gateway.
5. The NAT Gateway forwards the traffic to `google.com` on the Internet.

**Inbound Flow (TLS Server Responds):**

1. `google.com` sends back its ServerHello, Certificate, and other TLS handshake messages.
2. This return traffic arrives at the NAT Gateway's Elastic IP.
3. Because the NAT Gateway's subnet's route table had a direct `10.0.0.0/16` (VPC CIDR) route to `local`, the return traffic is sent directly to the Private Subnet.
4. The return traffic **bypasses the Network Firewall entirely**.

**Result:** The AWS Network Firewall only saw the outbound ClientHello. It never saw the inbound ServerHello or subsequent encrypted data packets. Since it didn't see the full conversation, its state table for that connection couldn't be fully established, and it could not apply the `reject tls ... content:"google.com"` rule. From your private instance, `curl https://google.com` succeeded because the firewall didn't intercept the return traffic.

### 2. Symmetric Routing (The Solution State)

With symmetric routing, both the forward and reverse paths for the TLS connection are explicitly forced through the AWS Network Firewall, ensuring full session inspection.

**Outbound Flow (Client Initiates TLS):**

1. Your application in the Private Subnet sends a ClientHello (containing SNI: `google.com`).
2. The Private Subnet's Route Table directs this traffic to the Firewall Endpoint.
3. The Network Firewall (seeing the ClientHello and SNI) processes it.
4. The Firewall Subnet's Route Table directs the traffic to the NAT Gateway.
5. The NAT Gateway forwards the traffic to `google.com`.

**Inbound Flow (TLS Server Responds):**

1. `google.com` sends back its ServerHello, Certificate, etc.
2. This return traffic arrives at the NAT Gateway's Elastic IP.
3. The NAT Gateway's subnet's route table (which you'll fix) now explicitly directs all return traffic destined for your Private Subnet back to the Firewall Endpoint.
4. The Network Firewall now receives the inbound ServerHello and subsequent encrypted packets for the `google.com` connection.

**Result:** The AWS Network Firewall now sees both sides of the TLS connection. When the ServerHello arrives, it correlates it with the outgoing ClientHello. If your firewall rule is `reject tls any any -> any any (tls.sni; content:"google.com"; ...)`, the firewall, having seen both sides of the connection and matched the SNI, can now correctly drop or reject the TLS traffic. Your `curl https://google.com` command from the private instance would now correctly fail as intended.

---

## ✔️ The Solution

I fixed this by explicitly adding a route in the **public subnet’s (NAT subnet) route table**:

```
10.0.2.0/24 (private subnet CIDR) → Firewall Endpoint
```

This crucial step forced \*\*return traffic from the NAT Gateway back to the private subnet to also go through the firewall\*\*, thereby maintaining **symmetric inspection** and closing the routing loop.

---

## 💡 Key Takeaway

When deploying AWS Network Firewall purely for egress filtering, **symmetric routing is critical**. Without it, your stateful rules will not function as intended — leading to either allowing traffic you expect to block or dropping sessions erratically due to incomplete session visibility. Always ensure both inbound and outbound traffic paths traverse your firewall.
