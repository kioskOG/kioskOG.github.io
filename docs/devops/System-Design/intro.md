---
title: Introduction to System Design
layout: home
parent: Devops
nav_order: 7
permalink: /docs/devops/System-Design/
---

# Introduction to System Design

## ✍️ 1.1 What is System Design?

>> System Design is the process of defining the architecture, components, modules, interfaces, and data for a system to satisfy specified requirements.

Think about it like this:

   - Building a small script = No big design needed.
   - Building an Instagram scale app = You need a **proper design** to handle millions of users, images, videos, scaling, security, etc.

### ✅ System Design is about:

   - How your system will handle millions of users?
   - How will it stay reliable if servers crash?
   - How will it scale up and down depending on the load?
   - How will it recover from disasters?
   - How secure and optimized will it be?


### ✍️ 1.2 Why System Design is Important?

   - **Scalability**: Your app should handle 1 user → 1M users easily.
   - **Reliability**: Systems shouldn't crash if 1 server fails.
   - **Performance**: Response time should be fast.
   - **Maintainability**: Easy to update, monitor, debug.
   - **Security**: Secure user data and system.

>> In real world, even if your code is perfect, if the system crashes under load, users leave 🚀

### ✍️ 1.3 Types of System Design

Type | Focus Area
High-Level Design (HLD) | Big picture (services, APIs, databases, scaling, caching)
Low-Level Design (LLD) | Class diagrams, APIs signatures, algorithms, DB schema


In interviews or real projects:

   - **HLD** = Overview Diagram, Database Choices, API Gateway, etc.
   - **LLD** = How will one service behave internally? (Classes, Methods, Tables)

---

### 🚀 Mini Challenge for You:
(Optional but recommended for better learning!)

> 🧠 Question:
Imagine you are building a basic chat app (like WhatsApp).

How would you start thinking about it from a system design point of view? (not code – just broad ideas)

### 🚀 System design thought process would look like this for a Chat App:


Layer | Focus
Clients | Mobile apps / Web clients connecting via APIs.
API Gateway + Load Balancer | Manage traffic coming in (horizontal scaling, sticky sessions if needed).
Chat Servers | Stateless services handling chat messages in real time.
Database | Store user info, messages metadata. Relational DB (Postgres, MySQL) + NoSQL (MongoDB, DynamoDB) depending on need.
File Storage | Images/videos stored in S3 (object storage) or any blob storage.
Message Queue | (Optional) For reliability — Kafka, RabbitMQ to handle delivery guarantees.
Caching | Redis/Memcached for fast message reads, online status etc.
Monitoring & Alerts | Track server health, latency, failures using CloudWatch, Datadog, etc.


### 🧠 In short:
When you think system design, break it into these:

```bash
Clients → Load Balancer → Backend Services → Databases → Storage → Caching → Monitoring
```
