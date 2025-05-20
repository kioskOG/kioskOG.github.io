---
title: Docker-Based Monitoring Setup with Prometheus, Grafana, and cAdvisor
layout: home
parent: Docker Projects
nav_order: 10
description: A setup guide for Vault
author: Jatin Sharma
permalink: /docs/devops/docker/Docker-monitoring-setup/Docker-monitoring-setup/
---

# 📈 Docker-Based Monitoring Setup with Prometheus, Grafana, and cAdvisor

---

## 🔧 Step 1: Create Docker Network

```bash
docker network create monitoring
```

---

## 📝 prometheus.yml

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  - job_name: 'grafana'
    static_configs:
      - targets: ['grafana:3000']
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
```

---

## 📝 grafana-datasources.yml

```yaml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    uid: prometheus
    url: http://prometheus:9090
    isDefault: false
    editable: true
    jsonData:
    httpMethod: GET
```

---

## 🐳 docker-compose.yml

```yaml
version: '3'
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - prometheus-data:/prometheus
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
    ports:
      - "9090:9090"
    networks:
      - monitoring
  grafana:
    image: grafana/grafana:latest
    environment:
      - GF_AUTH_ANONYMOUS_ENABLED=true
      - GF_AUTH_ANONYMOUS_ORG_ROLE=Admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_DEFAULT_THEME=dark
    depends_on:
      - prometheus
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana-datasources.yml:/etc/grafana/provisioning/datasources/datasources.yaml
    ports:
      - "3000:3000"
    healthcheck:
      test: [ "CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1" ]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - monitoring
  cadvisor:
    image: gcr.io/cadvisor/cadvisor
    ports:
      - 8080:8080
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro # Add only if you have your containers running on Mac
    networks:
      - monitoring

volumes:
  grafana-data:
  prometheus-data:

networks:
  monitoring:
    external: true
```

---

## 🚀 Run the Monitoring Stack

```bash
docker compose up -d
docker ps
docker compose logs -f
```

---

## ❓ FAQs

### What are the system requirements for running Prometheus and Grafana on Docker?

For small to medium deployments:

* 2 CPU cores
* 4GB RAM
* 20GB storage

### How do I secure my Prometheus and Grafana installations?

* Use strong passwords
* Implement authentication
* Enable HTTPS
* Restrict network access to monitoring services

### What are some common issues when setting up Prometheus and Grafana, and how can I resolve them?

* **Connectivity Issues**: Ensure containers are on the same network
* **Config Errors**: Validate your YAML files
* **Resource Constraints**: Monitor and increase system resources if needed
* **Logs**: Use `docker compose logs -f` to debug issues

---

This setup provides a foundational monitoring stack using Docker Compose. You can expand it with Node Exporter, Alertmanager, Loki, etc. based on your needs.
