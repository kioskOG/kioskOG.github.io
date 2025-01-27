---
title: Introduction to Cilium & Hubble
layout: default
parent: Kubernetes Projects
nav_order: 7
permalink: /docs/devops/kubernetes/cilium/cilium-intro/
---

# Introduction to Cilium & Hubble

## Table of Contents
- [Cilium](##what-is-cilium)
- [Hubble](##what-is-hubble)
- [Functionality Overview](#functionality-overview)
- [References](#references)


## What is Cilium?

Cilium is an open-source software that secures network connectivity between application services deployed on container management platforms like Docker and Kubernetes.  

It leverages **eBPF**, a Linux kernel technology, to dynamically enforce security policies and gain visibility into network traffic. Since eBPF runs in the kernel, Cilium can apply or update security policies without modifying application code or container configurations.

---

## What is Hubble?

Hubble is a distributed networking and security observability platform built on top of Cilium and eBPF. It provides deep visibility into service communication, behavior, and networking infrastructure in real time.

Hubble helps answer key questions about your environment:

### 1. **Service Dependencies & Communication Map**
   - What services are communicating with each other?  
   - What HTTP calls are being made?  
   - What Kafka topics are being consumed or produced?

### 2. **Network Monitoring & Alerting**
   - Are there network communication failures (e.g., DNS issues, application or network problems)?  
   - What services experienced recent TCP connection timeouts or failed DNS resolutions?  

### 3. **Application Monitoring**
   - What is the rate of HTTP 5xx/4xx errors?  
   - What is the 95th/99th percentile latency between requests and responses?  
   - Which services have the worst performance?

### 4. **Security Observability**
   - Which services had connections blocked due to network policies?  
   - What external traffic is accessing your services?  
   - Which services resolved specific DNS names?

---

## Functionality Overview

### 1. **API Security**
Cilium secures APIs by filtering requests based on specific application protocols like REST/HTTP, gRPC, and Kafka. Examples:  
   - Allow all `GET` requests with paths matching `/public/.*` and deny all others.  
   - Permit `service1` to publish to Kafka topic `topic1`, while allowing `service2` to consume from it.
   - Require the HTTP header `X-Token: [0-9]+` to be present in all REST calls.

### 2. **Identity-Based Security**
Cilium assigns security identities to groups of containers sharing the same policies. This avoids reliance on IP-based filtering, enabling scalable and dynamic policy enforcement. Identity management is achieved via a key-value store.

### 3. **Simplified Networking**
Cilium supports multiple networking models:
   - **Overlay (e.g., VXLAN, Geneve):** Encapsulation-based virtual networks with minimal infrastructure requirements. When to use this mode: This mode has minimal infrastructure and integration requirements. It works on almost any network infrastructure as the only requirement is IP connectivity between hosts which is typically already given.

   - **Native Routing:** Uses the Linux routing table for IP address management, suitable for advanced users or specific scenarios like IPv6 networks or cloud routers.

### 4. **Load Balancing**
Cilium replaces components like kube-proxy with eBPF-based load balancing. Features include:
   - **North-South Traffic:** Optimized for performance with features like direct server return (DSR) and Maglev consistent hashing.  
   - **East-West Traffic:** Efficient service-to-backend translation at the kernel level to reduce overhead.

### 5. **Monitoring and Troubleshooting**
The ability to gain visibility and troubleshoot issues is fundamental to the operation of any distributed system. While we learned to love tools like `tcpdump` and `ping` and while they will always find a special place in our hearts, we strive to provide better tooling for troubleshooting. This includes tooling to provide:

- **Event monitoring with metadata:** When a packet is dropped, the tool doesn’t just report the source and destination IP of the packet, the tool provides the full label information of both the sender and receiver among a lot of other information.

- **Metrics export via Prometheus:** Key metrics are exported via Prometheus for integration with your existing dashboards.

- **Hubble:** An observability platform specifically written for Cilium. It provides service dependency maps, operational monitoring and alerting, and application and security visibility based on flow logs.

---

Cilium and Hubble provide unparalleled security, observability, and performance for modern distributed systems, making them essential tools for managing Kubernetes-based applications.

## References
[Cilium](https://docs.cilium.io/en/stable/overview/intro/)