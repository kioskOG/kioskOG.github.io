---
title: Knative
layout: doc-page
parent: Kubernetes Projects
parent_url: /docs/devops/kubernetes/
has_children: true
nav_order: 12
permalink: /docs/devops/kubernetes/knative/
description: Documentation on knative Introduction.
type: concept
tags:
- devops
- kubernetes
- knative
timestamp: '2026-06-01T14:55:10Z'
---

# What is Knative?
Knative is a open-source solution to build serverless & Eventdriven applications (functions, Eventing, Serve application) on kubernetes.


## What is serverless ?
Serverless computing allows applications to run without the need to manage infrastructure or servers. It abstracts away the underlying infrastructure, allowing developers to focus on writing code.

### Serverless Abstraction Layer

1. Function
![function](/docs/devops/kubernetes/knative/images/function.png)

2. Containers
![containers](/docs/devops/kubernetes/knative/images/containers.png)

## Modes

1. **Code-Only Functions (Function-as-a-Service, FaaS)**
   - Deploy and manage serverless functions without dealing with infrastructure.

2. **Containers Eventing (Knative Eventing)**
   - Knative Eventing enables event-driven architectures where containers are triggered by events.
   - It allows integration with external event sources like Kafka, AWS SQS, and Google Pub/Sub.
   - Example: A Knative event can be connected to a Kafka topic, triggering application containers whenever an event arrives in the topic.

3. **Knative Serving**
   - Knative Serving allows applications to handle HTTP requests efficiently with autoscaling and scale-to-zero capabilities.
   - It provides features like traffic splitting, revision management, and service discovery for deploying and managing applications.

## 📚 Knative Guides in this Series

Explore the deep dives and practical walkthroughs in this Knative series:

1. 🧭 [Knative Developer Overview](/docs/devops/kubernetes/knative/knative-overview/)
2. 🚀 [Knative Serving Part 1: Deployment & Revisions](/docs/devops/kubernetes/knative/knative-serving-part-1/)
3. 🔀 [Knative Serving Part 2: Traffic Splitting & Canary Deployments](/docs/devops/kubernetes/knative/knative-serving-part-2/)
4. 📊 [Knative Serving Monitoring with Prometheus & Grafana](/docs/devops/kubernetes/knative/knative-serving-monitoring/)


