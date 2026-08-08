---
title: Setting Up Grafana Tempo via Docker
layout: doc-page
parent: Introduction to Distributed Tracing & Grafana Tempo
parent_url: /docs/devops/monitoring/grafana_tempo/
grand_parent: monitoring
grand_parent_url: /docs/devops/monitoring/
nav_order: 1
permalink: /docs/devops/monitoring/grafana_tempo/Grafana-Tempo-Docker/
description: Documentation for Setting Up Grafana Tempo via Docker.
type: concept
tags:
- devops
- monitoring
- grafana tempo
- grafana
- tempo
timestamp: '2026-04-16T18:17:09Z'
---

# 📌 2. Setting Up Grafana Tempo (Development Environment)
  We will install `Grafana Tempo` using `Docker Compose`, along with `Grafana` for visualization and `OpenTelemetry Collector` for trace ingestion.

---

## 1️⃣ Prerequisites

### ✅ `Install Docker & Docker Compose`

* [Docker Installation Guide](https://docs.docker.com/engine/install/)
* [Docker Compose Installation](https://docs.docker.com/compose/install/)

Verify installation:

```bash
docker -v
docker compose -v
```

### ✅ Install Grafana (Optional, but recommended)

* [Grafana Installation Guide](https://grafana.com/docs/grafana/latest/setup-grafana/installation/)

---

## 2️⃣ Setting Up Docker Compose for Tempo
We will create a `docker-compose.yaml` file to run Tempo, OpenTelemetry Collector, and Grafana.

Step 1: Create a New Directory
```bash
mkdir grafana-tempo && cd grafana-tempo
```

Step 2: Create `docker-compose.yaml`
```bash
vim docker-compose.yml
```

📌 Paste the following configuration:

```yaml
version: '3.7'

services:
  tempo:
    image: grafana/tempo:latest
    command: [ "-config.file=/etc/tempo.yml" ]
    volumes:
      - ./tempo-config.yml:/etc/tempo.yml
    ports:
      - "3200:3200"  # Tempo Query Port
      - "14268:14268"  # Jaeger ingest
      - "4317:4317"  # OTLP gRPC
      - "4318:4318"  # OTLP HTTP

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    depends_on:
      - tempo

  otel-collector:
    image: otel/opentelemetry-collector-contrib:latest
    command: [ "--config=/etc/otel-collector-config.yml" ]
    volumes:
      - ./otel-collector-config.yml:/etc/otel-collector-config.yml
    ports:
      - "4319:4317"  # OTLP gRPC or just keep "4317" no host port mapping
      - "4320:4318"  # OTLP HTTP or just keep "4318" no host port mapping
      - "55680:55680"  # OpenTelemetry HTTP Debugging
    depends_on:
      - tempo

```

### 3️⃣ Create Tempo Configuration
Create a `tempo-config.yml` file for Tempo.

```bash
nano tempo-config.yml
```

📌 Paste the following configuration:

```yaml
server:
  http_listen_port: 3200

distributor:
  receivers:
    jaeger:
      protocols:
        grpc:
        thrift_http:
    otlp:
      protocols:
        grpc:
        http:

storage:
  trace:
    backend: local
    local:
      path: /tmp/tempo/traces
```

Explanation:

* `http_listen_port: 3200` → Tempo API port.
* `Receivers` → Accept traces via `Jaeger & OpenTelemetry (OTLP)`.
* `Storage` → Using local storage (`/tmp/tempo/traces`) for now.

---

### 4️⃣ Create OpenTelemetry Collector Configuration

Create a `otel-collector-config.yml` file.
```bash
nano otel-collector-config.yml
```

📌 Paste the following configuration:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:

exporters:
  otlp:
    endpoint: tempo:4317
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [otlp]

```

Explanation:
* Receives traces using `OTLP` protocol.
* Exports traces to `Tempo` at `tempo:4317`.
---

5️⃣ Start Tempo, Grafana & OTEL Collector
Now, run `Docker Compose`:

```bash
docker compose up -d
```

This will start:

✅ `Tempo (port 3200)`

✅ `Grafana (port 3000)`

✅ `OTEL Collector (host port 4317, 4318)`

Check running containers:
```bash
docker ps
```

---

### 6️⃣ Verify Setup

#### 🔹 Check Tempo Status

Open Grafana UI at 👉 http://localhost:3000

* Login: username:- admin
         password: admin

* Go to `Configuration > Data Sources`
* Add `Tempo` as a data source
* Set URL as `http://tempo:3200`
* Click `Save & Test`


Now that Tempo is running, we need to generate traces.

✅  Let's generate traces by instrumenting a sample python application. We'll use OpenTelemetry (OTel) SDK to send traces to Tempo. 🚀