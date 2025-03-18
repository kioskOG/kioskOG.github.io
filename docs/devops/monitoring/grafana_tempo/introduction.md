---
title: Introduction to Distributed Tracing & Grafana Tempo
layout: home
parent: monitoring
nav_order: 2
permalink: /docs/devops/monitoring/grafana_tempo/
description: Introduction to Distributed Tracing & Grafana Tempo.
---

# 📌 Introduction to Distributed Tracing & Grafana Tempo

## 1️⃣ What is Distributed Tracing?

### 🔹 Problem Statement
* In modern `microservices` and `distributed systems`, requests flow across multiple services.
* Traditional `logging & metrics` can show individual system health but fail to `track a request across multiple services`.
* Without visibility, debugging `slow performance` or `failures` is difficult.

### 🔹 Solution: Distributed Tracing
* Distributed tracing allows you to `track a request` as it travels through multiple microservices.
* Each `unit of work` (API call, database query, etc.) is captured as a `span`.
* These spans form a `trace`, giving a complete picture of request flow.

### 🔹 Example:
#### Imagine a shopping website:

1. `User clicks "Buy"` → Request goes to API Gateway
2. API Gateway → Calls `Order Service`
3. Order Service → Calls `Payment Service`
4. Payment Service → Calls `Inventory Service`

Without tracing, debugging why `checkout is slow` would be a nightmare!
With tracing, you can see which service is slow and fix it.


## 2️⃣ Why Use Grafana Tempo?

### 🔹 Existing Tracing Tools

* `Jaeger`: Open-source but requires `indexing` (which slows performance).

* `Zipkin`: Older tool, similar to Jaeger, but requires `storage management`.

* `AWS X-Ray`: Paid service, good but locked into AWS.


### 🔹 Why Tempo?

✅ `Scalable & Lightweight` – Handles high-volume traces efficiently.

✅ `No Indexing Needed` – Unlike Jaeger, `Tempo doesn't need Elasticsearch`.

✅ `Easy to Integrate` – Works with `Prometheus, Loki, OpenTelemetry`.

✅ `Supports Object Storage` – Uses `S3, GCS, MinIO` for storage.

✅ `Built for Grafana` – Seamless visualization in Grafana UI.


### 3️⃣ Tempo Core Concepts

#### 🔹 `Tracing Components`
1. `Trace` – A full journey of a request across services.
2. `Span` – A single unit of work inside a trace (e.g., an HTTP request, DB query).
3. `Context Propagation` – Passes tracing data across services.

### 🔹 Example Trace Structure

```bash
Trace ID: 12345  
 ├── Span 1: API Gateway (Start: 0ms)  
 ├── Span 2: Order Service (Start: 10ms)  
 ├── Span 3: Payment Service (Start: 30ms)  
 ├── Span 4: Inventory Service (Start: 50ms)  
```

This shows that `Payment Service took 20ms` and `Inventory Service took 20ms`, which helps identify bottlenecks.

---

## 4️⃣ Tempo Architecture Overview

### 🔹 How Tempo Works

1. `Application emits traces` → Using OpenTelemetry SDKs.
2. `Traces are sent to Tempo` → Collected using OpenTelemetry Collector.
3. `Tempo stores traces` → In object storage like S3 or MinIO.
4. `Grafana queries Tempo` → Visualizes traces in dashboards.

## 🔹 Architecture Diagram
```bash
(Application) → (OpenTelemetry SDK) → (OTEL Collector) → (Tempo) → (Storage) → (Grafana)
```

* `Application`: Sends tracing data (Node.js, Python, Java, Go, etc.).
* `OpenTelemetry Collector`: Aggregates traces before sending to Tempo.
* `Tempo`: Stores traces.
* `Storage`: Object storage like MinIO or S3.
* `Grafana`: Queries Tempo to display traces.

---

## 5️⃣ Where Tempo Fits in the Observability Stack

### Observability has 3 pillars:

1️⃣ `Metrics` – Collected using `Prometheus`.

2️⃣ `Logs` – Collected using `Loki`.

3️⃣ `Traces` – Collected using `Tempo`.

By combining `logs, metrics, and traces`, you get full visibility into your system.
