---
title: System Design - What is Scalability?
layout: home
parent: Introduction to System Design
grand_parent: Devops
nav_order: 2
permalink: /docs/devops/System-Design/Scaleability/
description: Documentation for System Design Scalability.
---

# System Design - What is Scalability?s

when a system grows, the performance starts to degrade unless we adapt it to deal with that growth.


Scalability is the property of a system to handle a growing amount of load by adding resources to the system.

## How can a System Grow?


### 1. Growth in User Base

More users started using the system, leading to increased number of requests.

   - **Example**: A social media platform experiencing a surge in new users.

### 2. Growth in Features

More features were introduced to expand the system's capabilities.

   - **Example**: An e-commerce website adding support for a new payment method.

### 3. Growth in Data Volume

Growth in the amount of data the system stores and manages due to user activity or logging.

   - **Example**: A video streaming platform like youtube storing more video content over time.

### 4. Growth in Geographic Reach

The system is expanded to serve users in new regions or countries.

   - **Example**: An e-commerce company launching websites and distribution in new international markets.


## How to Scale a System?

Here are 10 common ways to make a system scalable:

### 1. Vertical Scaling (Scale up)

This means adding more resources to your existing server by upgrading server with more RAM, faster CPUs, or additional storage.

It's a good approach for simpler architectures but has limitations in how far you can go.


### 2. Horizontal Scaling (Scale out)

This means adding more machines to your system to spread the workload across multiple servers.

It's often considered the most effective way to scale for large systems.


### 3. Load Balancing

Load balancing is the process of distributing traffic across multiple servers to ensure no single server becomes overwhelmed.


### 4. Caching

Caching is a technique to store frequently accessed data in-memory (like RAM) to reduce the load on the server or database.

Implementing caching can dramatically improve response times.

### 5. Content Delivery Networks (CDNs)

CDN distributes static assets (images, videos, etc.) closer to users. This can reduce latency and result in faster load times.


### 6. Sharding/Partitioning

Partitioning means splitting data or functionality across multiple nodes/servers to distribute workload and avoid bottlenecks.


### 7. Asynchronous communication

Asynchronous communication means deferring long-running or non-critical tasks to background queues or message brokers.

This ensures your main application remains responsive to users.


### 8. Microservices Architecture

Micro-services architecture breaks down application into smaller, independent services that can be scaled independently.

This improves resilience and allows teams to work on specific components in parallel.


### 9. Auto-Scaling
Auto-Scaling means automatically adjusting the number of active servers based on the current load.

This ensures that the system can handle spikes in traffic without manual intervention.


### 10. Multi-region Deployment

Deploy the application in multiple data centers or cloud regions to reduce latency and improve redundancy.

---

Thank you for reading!
