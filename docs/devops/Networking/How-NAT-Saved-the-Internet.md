---
title: How NAT Saved the Internet
layout: doc-page
parent: Networking
grand_parent: Devops
nav_order: 1
permalink: /docs/devops/Networking/How-NAT-Saved-the-Internet/
description: Documentation for How NAT Saved the Internet.
type: concept
tags:
- devops
- networking
timestamp: '2026-04-17T09:40:40Z'
---

Networking · IPv4 · NAT

# Why IPv4 Ran Out of Addresses — and How NAT Saved the Internet

From 4.3 billion addresses to billions of devices: a practical walkthrough of IPv4 exhaustion, public vs private IPs, NAT types (Static, Dynamic, PAT), port forwarding, drawbacks, and IPv6.

**On this page**

* [The Basics: What Is IPv4?](#ipv4-basics)
* [Public vs Private IP Addresses](#public-private)
* [The IPv4 Crunch](#crunch)
* [Enter NAT](#nat)
* [Types of NAT](#types)
  + [1. Static NAT](#static-nat)
  + [2. Dynamic NAT](#dynamic-nat)
  + [3. PAT (Port Address Translation)](#pat)
  + [Bonus: Port Forwarding](#port-forwarding)
* [Quick Comparison](#comparison)
* [ASCII Diagram: PAT](#ascii)
* [Drawbacks of NAT](#drawbacks)
* [What About IPv6?](#ipv6)
* [Conclusion](#conclusion)

When the Internet was designed in the 1970s, no one anticipated today’s billions of smartphones, smart TVs, and IoT devices. By the late 1990s, it was clear: **IPv4** was running out of space. This is the story of how we hit the limits — and how **Network Address Translation (NAT)** kept things running.

## The Basics: What Is IPv4?

* **IPv4** stands for Internet Protocol version 4.
* It uses **32-bit** addresses, written as dotted quads (e.g., `192.168.0.1`).
* 32 bits yields ~**4.3 billion** unique addresses.

Why it wasn’t enough:

* Every device needs an address.
* Large early allocations to orgs/ISPs/universities.
* Many allocations were underused or wasted.

## Public vs Private IP Addresses

### 1) Public IP addresses

* Globally unique and Internet‑routable.
* Assigned by regional registries (ARIN, RIPE, APNIC, etc.).
* Example: `8.8.8.8` (Google DNS).

### 2) Private IP addresses

* Reserved ranges, reusable inside local networks.
* Not routable on the public Internet.
* Ranges: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`.

👉

**Question:** How do devices on private addresses talk to the wider Internet?

## The IPv4 Crunch: Why 4.3 Billion Wasn’t Enough

* **Inefficient allocation:** Class A (/8) blocks gave 16M addresses each, often vastly over‑provisioned.
* **Device explosion:** Laptops, phones, tablets, IoT.
* **Always‑on era:** Devices stay online, consuming addresses continuously.
* **Global scale:** Billions of people needing connectivity.

## Enter NAT: The Lifesaver

**Network Address Translation (NAT)** lets many devices *share a single public IP* by rewriting packet headers.

1. Inside your network, devices use private IPs (e.g., `192.168.1.10`).
2. The router keeps a translation table.
3. Outbound traffic has its source rewritten to the public IP.
4. Replies consult the table to reach the correct internal device.

Invisible to users — essential to the modern Internet.

## Types of NAT (with Examples)

### 1. Static NAT — One‑to‑One

*Scenario:* Host a web server at `10.0.0.10` using public IP `203.0.113.10`.

```
[Internet] ──(203.0.113.10)── [NAT Router] ──(10.0.0.10)── [Web Server]
```

* Map `10.0.0.10` ↔ `203.0.113.10`.
* Requests to public IP forward to the server; replies are rewritten.

```
10.0.0.10:80  <->  203.0.113.10:80
```

**Use case:** Hosting public services.
**Limit:** Consumes one public IP per host.

### 2. Dynamic NAT — Many‑to‑Many (Pool)

*Scenario:* Office `10.0.1.0/24` with pool `203.0.113.20–22`.

* Users are temporarily mapped to free public IPs from the pool.
* If the pool is exhausted, new connections wait.

```
10.0.1.11  <->  203.0.113.20
10.0.1.12  <->  203.0.113.21
10.0.1.13  <->  203.0.113.22
```

**Use case:** Older enterprise networks. **Limit:** Pool exhaustion.

### 3. PAT (Port Address Translation) — Many‑to‑One

*Scenario:* Home subnet `192.168.1.0/24` with public IP `198.51.100.23`.

```
[Phone 192.168.1.11]     \
[Laptop 192.168.1.10] ---- [NAT Router] ---- (198.51.100.23) ---- [Internet]
[TV    192.168.1.12]     /
```

* `192.168.1.10:52344 → 198.51.100.23:40001`
* `192.168.1.11:50123 → 198.51.100.23:40002`
* Ports keep flows distinct in a single public IP.

```
192.168.1.10:52344  <->  198.51.100.23:40001
192.168.1.11:50123  <->  198.51.100.23:40002
```

**Use case:** Homes/SMBs. **Limit:** Inbound breaks unless port forwarding is configured.

### Bonus: Port Forwarding with PAT

Expose an internal service selectively.

**Example:** SSH to `192.168.1.50:22` via public IP `198.51.100.23`:

* Rule: `198.51.100.23:2222 → 192.168.1.50:22`

```
ssh user@198.51.100.23 -p 2222
```

## Quick Comparison

| Type | Mapping | Use Case | Pros | Cons |
| --- | --- | --- | --- | --- |
| **Static NAT** | One‑to‑one | Hosting servers with fixed IPs | Stable, predictable | Consumes a public IP per host |
| **Dynamic NAT** | Many‑to‑many | Older enterprise setups | Conceptually simple | Pool exhaustion possible |
| **PAT** | Many‑to‑one | Home & SMB networks | Conserves public IPs, scalable | Blocks inbound by default |

## ASCII Diagram: How PAT Works (Home Router)

```
Device A: 192.168.1.10:52344  --->
                                       NAT Router (Public IP 198.51.100.23)
Device B: 192.168.1.11:50123  --->
                                       NAT Table:
                                       192.168.1.10:52344 -> 198.51.100.23:40001
                                       192.168.1.11:50123 -> 198.51.100.23:40002

From Internet’s view:
198.51.100.23:40001 -> goes back to Device A
198.51.100.23:40002 -> goes back to Device B
```

## The Drawbacks of NAT

* **Breaks end‑to‑end connectivity:** Inbound access requires port forwarding or application relays.
* **Complicates protocols:** VoIP and P2P often need helpers (ALGs, STUN/TURN/ICE).
* **Adds overhead:** Routers maintain translation tables and rewrite packets.

Still, NAT was far easier than re‑architecting the Internet overnight.

## What About IPv6?

* IPv6 uses **128‑bit** addresses — about `3.4 × 10^38` possibilities.
* Enough addresses for, figuratively, every grain of sand to have one.
* Adoption continues to grow, but IPv4 + NAT remain critical today.

## Conclusion

IPv4 wasn’t built for today’s scale. NAT stepped in as a practical workaround so billions of devices could share far fewer public IPs. While **IPv6** is the future, NAT is the technology that kept the Internet running during IPv4’s growing pains — and still powers most home/office networks you use every day.

[Back to top ↑](#top)
