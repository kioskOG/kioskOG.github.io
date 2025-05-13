---
title: Knative Developer Overview
layout: home
parent: Knative
grand_parent: Kubernetes Projects
nav_order: 1
permalink: /docs/devops/kubernetes/knative/knative-overview/
description: Documentation on Knative Developer Overview
---

# Knative Developer Overview

Knative is primarily focused on the needs and pains of developers, to elevate them to the heights of “I do not care how.”

---

## 1.1 What is Knative?

The purpose of Knative is to provide a simple, consistent layer over Kubernetes that solves common problems of:

* Deploying software
* Connecting disparate systems together
* Upgrading software
* Observing software
* Routing traffic
* Scaling automatically

### Knative Subprojects

Knative is divided into two major subprojects:

* **Serving**: Responsible for deploying, upgrading, routing, and scaling
* **Eventing**: Responsible for connecting disparate systems

This separation of responsibilities allows each to be developed more independently and rapidly by the Knative community.

Knative primarily exposes functionality via YAML-based CRDs (Custom Resource Definitions), giving developers a declarative interface. Alternatively, the `kn` CLI can be used for imperative workflows.

---

### 1.1.1 Deploying, Upgrading, and Routing

Traditional deployments involved manual promotion and scheduled downtimes. Knative enables:

* Continuous Delivery
* Blue/Green Deployments
* Progressive Delivery

Deployment has evolved. What used to be a process of manually promoting software artifacts through environments (with scheduled downtime, 200 people on a bridge call all weekend ...) becomes continuous delivery and Blue/Green deploys.

Should deployment be all or nothing? Knative enables progressive delivery: instead of requests arriving at a production system that is entirely one version of the software, these arrive at a system where multiple versions can be running together with traffic split among these.

> "Send 10% of traffic to v2" is not the same as "10% of instances are v2."

Knative allows per-request routing control.

---

### 1.1.2 Autoscaling

Knative uses the **Knative Pod Autoscaler (KPA)**, which is:

* Request-centric
* Integrated with Knative routing, buffering, and metrics

Whether there is no traffic (wasteful) or too much traffic (stressful), KPA adapts your system accordingly.

---

Kubernetes is great for maintaining desired vs. actual state. But real-world systems change frequently due to:

* Bug fixes
* New features
* Competitive pressure

Knative helps developers adapt quickly to these changes.

Kubernetes itself is great, once you set it up. It absolutely shines at its core purpose in life: reconcile the differences between the desired state of the system and the actual state of the system on a continuous basis. If all you ever need is to deploy your system once and let it run forever without changing it, then you’re good to go and lucky you. 

The rest of us, however, are on the treadmill. We have desired worlds that change. We ship bugs that need to be fixed, our users think of new features they want, and our competitors make us scramble to address new services.

---

## 1.2 Where Knative Shines

Knative's strengths lie in:

* Event-driven architectures
* Progressive delivery
* Autoscaling

### 1.2.1 Workloads with Unpredictable, Latency-Insensitive Demand

Variability is a fact of life: nothing repeats perfectly. Nothing can be perfectly pre- dicted or optimized. The Law of Variability Buffering says that you can deal with demand variability by buffering it in one of three ways:

* **Inventory** (e.g., caching)
* **Capacity** (e.g., idle instances)
* **Time** (e.g., delays)

These are all costly.

* Inventory → memory/disk
* Capacity → compute/electricity
* Time → “time is money” and nobody likes to wait.

Knative defaults to **buffering with time**, which is why cold starts happen.

Does this matter? It depends on the nature of the demand. If the demand is latency-sensitive, then maybe scaling to zero is not for you. You can tell Knative to keep a minimum number of instances alive (no more pinging your function). On the other hand, if it’s a batch job or background process that can wait a while to kick off, buffering by time is sensible and efficient. Let that thing drop to zero. Spend the savings on ice cream.

If your app is **latency-insensitive** (e.g., batch jobs), this is fine. For **latency-sensitive** systems, keep a minimum number of pods always ready.

Knative also handles:

* Highly variable demand
* Spiky workloads

If your demand is predictable and latency-sensitive (e.g., Netflix), you may be better off with static provisioning.

Knative **cannot mitigate supply variability** — you still need to manage:

* Application startup time
* External system performance

---

## 1.3 What's in the Knative Box?

Knative consists of two core subprojects:

### 1.3.1 Serving

**Knative Serving**:

Serving is the first and most well-known part of Knative. It encompasses the logic needed to run your software, manage request traffic, keep your software running while you need it, and stop it running when you don’t need it. As a developer, Knative gives you three basic types of document you can use to express your desires: Configuration, Revision, and Route.

Configuration is your statement of what your running system should look like. You provide details about the desired container image, environment variables, and the like. Knative converts this information into lower-level Kubernetes concepts like Deployments. In fact, those of you with some Kubernetes familiarity might be wonder- ing what Knative is adding. After all, you can just create and submit a Deployment yourself, no need to use another component for that.

Which takes us to Revisions. These are snapshots of a Configuration. Each time that you change a Configuration, Knative first creates a Revision, and in fact, it is the Revi- sion that is converted into lower-level primitives.

* **Configuration**: Describes desired container image, env vars, etc.
* **Revision**: Snapshot of a Configuration; created on every update
* **Route**: Defines how traffic is routed between Revisions

Revisions are the actual units deployed via Kubernetes primitives like Deployments.

Knative adds value by automating versioning, routing, and autoscaling of those primitives.

---
