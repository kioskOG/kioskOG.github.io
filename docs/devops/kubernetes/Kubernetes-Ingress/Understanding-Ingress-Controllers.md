---
title: Understanding Ingress Controllers
layout: doc-page
parent: Kubernetes Projects
parent_url: /docs/devops/kubernetes/
has_children: true
nav_order: 17
permalink: /docs/devops/kubernetes/Understanding-Ingress-Controllers/
description: Documentation on Understanding Ingress Controllers
type: concept
tags:
- devops
- kubernetes
- kubernetes ingress
- ingress
timestamp: '2026-04-17T09:40:40Z'
---

Networking · Kubernetes

# Kubernetes Ingress — A Practical Guide

How to securely expose multiple microservices from a Kubernetes cluster with a single entry point, TLS termination, and centralized control.

**On this page**

* [Why not just NodePort / LoadBalancer?](#problem)
* [What is Kubernetes Ingress?](#what-is-ingress)
* [Ingress Controllers](#controllers)
* [Routing with Ingress Rules](#routing)
* [Securing Ingress with TLS](#tls)
* [Advanced Ingress Features](#advanced)
* [AWS Load Balancer Controller vs NGINX](#comparison)
* [Conclusion](#conclusion)

## Context — exposing services from a cluster

As organizations adopt microservices and Kubernetes for deploying containerized applications, one critical question arises:

*“How do external users securely access my services running inside the Kubernetes cluster?”*

By default, Kubernetes provides service types like **ClusterIP**, **NodePort**, and **LoadBalancer** to expose applications. However:

**ClusterIP**  
Internal access only (cluster‑local).

**NodePort**  
Exposes on every node’s IP/port — rarely ideal for production.

**LoadBalancer**  
One external LB per Service — costly and harder to manage at scale.

Imagine a production app like `url shortener` with:

* A frontend UI service
* An Auth service
* A short‑URL service
* A report service
* A metrics endpoint

Using a separate **LoadBalancer** for each would quickly increase cost and fragment control.

## What is Kubernetes Ingress?

**Kubernetes Ingress** is the native solution for managing external access to your Services. It acts as a reverse proxy and traffic director, routing requests based on *hostname*, *path*, or even *headers* — all from a single IP address or DNS name.

* Serve multiple Services behind one domain
* Apply routing logic without touching individual Services
* Secure traffic using TLS/SSL
* Load balance across Pods
* Implement rewrites, redirects, auth, and more

*Ingress is the traffic controller at the edge of your Kubernetes cluster.*

🧭

**Note:** An **Ingress *Controller*** is the engine that reads your Ingress rules and translates them into real‑world proxy configurations (e.g., NGINX or AWS ALB).

## 1) An Introduction to Kubernetes Ingress

NodePort/LoadBalancer can work for small apps, but they don’t scale well in environments with many Services. Ingress defines HTTP(S) routing rules to expose multiple Services over a single IP or domain — the Kubernetes‑native, scalable approach.

## 2) Ingress Controllers: Making Ingress Work

The *Ingress resource* is configuration only. You need an **Ingress Controller** to process those rules and handle the actual traffic.

### What is an Ingress Controller?

A controller runs in‑cluster (often a proxy like NGINX, HAProxy, etc.), watches for Ingress objects, and applies the specified rules.

### Popular controllers

* **NGINX Ingress Controller** (open source, CNCF maintained)
* **AWS Load Balancer Controller** (for Amazon EKS)
* **Traefik**, **Contour**, **Istio Gateway** (service‑mesh contexts)

### How it works

1. Deploy the controller into your cluster
2. Define Ingress resources
3. The controller dynamically updates routing rules

## 3) Routing Traffic with Ingress Rules

Ingress rules define how traffic is routed to backend Services:

* **Host‑based**: route by domain (e.g., `api.example.com`, `admin.example.com`)
* **Path‑based**: route by URL path (e.g., `/login`, `/users`)
* **Header‑based**: supported by advanced controllers

## 4) Securing Ingress with TLS

One of the most powerful features of Ingress is **TLS termination** — decrypting HTTPS at the edge.

* **AWS ACM** (with AWS Load Balancer Controller)
* **cert‑manager** (with NGINX and others)
* **Let’s Encrypt** certificates

## 5) Advanced Ingress Features

* **URL rewrites**: modify request paths before forwarding
* **Load balancing**: distribute traffic across replicas
* **Rate limiting**: control requests per client
* **Header manipulation**: add/modify headers
* **Authentication**: basic auth, JWT, external IdPs
* **gRPC & WebSockets**: modern protocol support
* **Canary releases**: split traffic for safer rollouts

## AWS Load Balancer Controller vs NGINX Ingress Controller

Both manage external access to Kubernetes Services, but with different trade‑offs:

| Aspect | AWS Load Balancer Controller | NGINX Ingress Controller |
| --- | --- | --- |
| Integration | Tight AWS integration (ACM, WAF, ALB/NLB) | Cloud‑agnostic; works on any Kubernetes |
| Operation Model | Provisions managed ALB/NLB resources per Ingress | Runs a proxy inside the cluster |
| Flexibility | Best for AWS‑native patterns | Rich annotations, advanced routing/customization |
| Cost | Pays for AWS LBs (may scale with Ingresses) | Primarily cluster resources; one external LB for controller |
| Portability | AWS‑specific | Portable across environments |

**Choose AWS LBC if**  
You’re all‑in on AWS and want native ACM/WAF/ALB/NLB integration.

**Choose NGINX if**  
You need flexibility, portability, and deep config control.

## 📚 Ingress Hands-on Guides in this Series

Explore the complete hands-on tutorials in this NGINX Ingress series:

1. 🚀 [Installing NGINX Ingress Controller on Kubernetes](/docs/devops/kubernetes/Installing-NGINX-Ingress/)
2. 🔀 [Routing Strategies in NGINX Ingress (Path & Host-based)](/docs/devops/kubernetes/Routing-in-NGINX-Ingress-Controller/)
3. 🔒 [Basic Authentication with NGINX Ingress](/docs/devops/kubernetes/Basic-Authentication-using-NGINX-Ingress/)
4. 🛡️ [Secure Applications with HTTPS using Self-Signed TLS Certificates](/docs/devops/kubernetes/secure-your-app-with-https-using-self-signed-tls-certificates/)

---

[Back to top ↑](#top)
