---
title: Setting Up Python application using OpenTelemetry
layout: home
parent: Introduction to Distributed Tracing & Grafana Tempo
grand_parent: monitoring
nav_order: 2
permalink: /docs/devops/monitoring/grafana_tempo/grafana-tempo-sample-app/
description: Documentation for instrument a Python application using OpenTelemetry and send traces to Grafana Tempo. 🚀
---

# 📌 Instrumenting a Python App for Distributed Tracing

## We'll create a simple Flask API that:
✅ Generates traces

✅ Generates metrics

✅ Sends them to OpenTelemetry Collector

✅ Stores them in Tempo


## 1️⃣ Setup Project Directory

```bash
mkdir grafana-tempo && cd grafana-temo
mkdir otel-python-app && cd otel-python-app
```


## 2️⃣ Setup a Flask Application
Create a file `app.py`:

```py
from flask import Flask, request
import time
import logging
from prometheus_flask_exporter import PrometheusMetrics
from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.flask import FlaskInstrumentor

# Setup Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

# Flask App
app = Flask(__name__)

# ✅ Explicitly start metrics server (fix for missing /metrics)
metrics = PrometheusMetrics(app, group_by='endpoint', buckets=[0.1, 0.2, 0.5, 1, 2, 5, 10])
metrics.start_http_server(5001)  # ✅ Ensures /metrics is available

FlaskInstrumentor().instrument_app(app)

# Initialize tracing with resource attributes
resource = Resource.create({
    "service.name": "flask-otel-app",
    "service.version": "1.0.0",
    "service.environment": "dev"
})
trace.set_tracer_provider(TracerProvider(resource=resource))
tracer = trace.get_tracer(__name__)

# Export spans to OTLP (Tempo)
try:
    otlp_exporter = OTLPSpanExporter(endpoint="http://otel-collector:4318/v1/traces")
    span_processor = BatchSpanProcessor(otlp_exporter)
    trace.get_tracer_provider().add_span_processor(span_processor)
except Exception as e:
    logging.error(f"Error initializing OTLP exporter: {e}")

@app.route('/')
def home():
    with tracer.start_as_current_span("home-handler"):
        time.sleep(0.2)  # Simulate processing
        logging.info("Processing / request")
        return "Hello, OpenTelemetry with Grafana Tempo!"

@app.route('/slow')
def slow():
    with tracer.start_as_current_span("slow-handler"):
        time.sleep(1)  # Simulate a slow response
        logging.info("Processing /slow request")
        return "This took a while!"

@app.route("/process")
def process():
    with tracer.start_as_current_span("processing_request"):
        time.sleep(1)  # Simulate a delay
        logging.info("Processing request completed")
    return "Processing complete!"

@app.route("/external-api")
def external_api():
    with tracer.start_as_current_span("calling_external_api"):
        time.sleep(2)  # Simulating an external API delay
        logging.info("External API call completed")
    return "External API response!"

@app.route("/db-query")
def db_query():
    with tracer.start_as_current_span("querying_database"):
        time.sleep(1.5)  # Simulating a database query delay
        logging.info("Database query completed")
    return "Database query response!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

## 3️⃣ Install Dependencies

Create a file `requirements.txt`:

```bash
flask
opentelemetry-sdk
opentelemetry-exporter-otlp
opentelemetry-instrumentation-flask
prometheus_flask_exporter
```


## 4️⃣ Setup Dockerfile

Create a file `Dockerfile`:

```bash
### Stage 1: Builder Stage
FROM python:3.12 AS builder
WORKDIR /app
### Copy requirements separately for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt 
### Stage 2: Final Image
FROM python:3.12-slim AS runtime
WORKDIR /app
### Copy installed dependencies from the builder stage
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
### Copy application code
COPY app.py .
### Expose the Flask port
EXPOSE 5000
### Run the app
CMD ["python3", "app.py"]
```

## 5️⃣ Setup Grafana Tempo

```bash
cd ../
pwd
## output:- grafana-tempo
```

## 6️⃣ Create Docker Compose File

Create a file `docker-compose.yml`:

```yaml
version: '3.7'

services:
  tempo:
    image: grafana/tempo:latest
    command: [ "-config.file=/etc/tempo.yml" ]
    volumes:
      - ./tempo-config.yml:/etc/tempo.yml
      - tempo-data:/var/tempo
    ports:
      - "3200:3200"  # Tempo Query Port
      - "14268:14268"  # Jaeger ingest
      - "4317:4317"  # OTLP gRPC
      - "4318:4318"  # OTLP HTTP
    networks:
      - observability

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana-datasources.yml:/etc/grafana/provisioning/datasources/datasources.yaml
    depends_on:
      - tempo
      - prometheus
    networks:
      - observability

  otel-collector:
    image: otel/opentelemetry-collector-contrib:latest
    command: [ "--config=/etc/otel-collector-config.yml" ]
    volumes:
      - ./otel-collector-config.yml:/etc/otel-collector-config.yml
    ports:
      - "4317"  # OTLP gRPC
      - "4318"  # OTLP HTTP
      - "55680:55680"  # OpenTelemetry HTTP Debugging
    depends_on:
      - tempo
    networks:
      - observability
  
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
    ports:
      - "9090:9090"
    networks:
      - observability
    depends_on:
      - otel-collector

  flask-otel-app:
        build: ./otel-python-app/ 
        ports:
            - 5000:5000
        container_name: flask-otel-app
        networks:
            - observability
              #image: flask-otel-app
        depends_on:
        - otel-collector
        - prometheus


volumes:
  tempo-data:
  grafana-data:

networks:
  observability:
    driver: bridge
```


## 7️⃣ Create OpenTelemetry Collector Config

Create a file `otel-collector-config.yml` 

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  otlp:
    endpoint: "tempo:4317"
    tls:
      insecure: true
  prometheus:
    endpoint: "0.0.0.0:9090"

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [otlp]
    logs:
      receivers: [otlp]
      exporters: [otlp]
    metrics:
      receivers: [otlp]
      exporters: [prometheus]
```

## 8️⃣ Create Tempo Config

Create a file `tempo-config.yml`: 

```yaml
stream_over_http_enabled: true
server:
  http_listen_port: 3200
  grpc_listen_port: 9095
  log_level: info

query_frontend:
  search:
    duration_slo: 5s
    throughput_bytes_slo: 1.073741824e+09
    metadata_slo:
        duration_slo: 5s
        throughput_bytes_slo: 1.073741824e+09
  trace_by_id:
    duration_slo: 5s

distributor:
  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: 0.0.0.0:4317
        http:
          endpoint: 0.0.0.0:4318

ingester:
  trace_idle_period: 10s
  max_block_bytes: 1_000_000
  max_block_duration: 5m               # cut the headblock when this much time passes. this is being set for demo purposes and should probably be left alone normally

compactor:
  compaction:
    block_retention: 24h                # overall Tempo trace retention. set for demo purposes

metrics_generator:
  registry:
    external_labels:
      source: tempo
      cluster: docker-compose

storage:
  trace:
    backend: local                     # backend configuration to use
    local:
      path: /var/tempo/blocks

overrides:
  defaults:
    metrics_generator:
      processors: [service-graphs, span-metrics, local-blocks] # enables metrics generator
      generate_native_histograms: both
```

## 9️⃣ Create Prometheus Config

Create a file `prometheus.yml`:

```yaml
global:
  scrape_interval: 10s

scrape_configs:
  - job_name: "otel-collector"
    static_configs:
      - targets: ["otel-collector:9090"]
  - job_name: "flask-app"
    static_configs:
      - targets: ["flask-otel-app:5001"]
```

## 🔟 Create Grafana Datasource Config

Create a file `grafana-datasources.yml`:

```yaml
apiVersion: 1
datasources:
  - name: Tempo
    type: tempo
    access: proxy
    url: http://tempo:3200
    isDefault: false
    jsonData:
      httpMethod: GET
      tracesToLogs:
        datasourceUid: "loki"
      serviceMap:
        datasourceUid: "prometheus"
      spanBar:
        datasourceUid: "prometheus"
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
```

## Start docker compose

```bash
docker images
docker compose up -d
docker compose logs -f otel-collector
docker compose logs -f flask-otel-app
docker compose logs -f tempo
docker compose logs -f grafana
docker compose logs -f prometheus
```

## ✨ This creates the following resources:

```bash
 ✔ flask-otel-app                            Built 
 ✔ Network grafana-tempo_observability       Created
 ✔ Volume "grafana-tempo_tempo-data"         Created
 ✔ Volume "grafana-tempo_grafana-data"       Created
 ✔ Container grafana-tempo-tempo-1           Started
 ✔ Container flask-otel-app                  Started
 ✔ Container grafana-tempo-otel-collector-1  Started
 ✔ Container grafana-tempo-prometheus-1      Started
 ✔ Container grafana-tempo-grafana-1         Started
 ```

## Generate Traces

```bash
curl http://localhost:5000/
curl http://localhost:5000/slow
```

{: .note}
> Each request generates traces and sends them to Grafana Tempo via the OTLP Exporter.


## View Traces in Grafana
1️⃣ Open Grafana at 👉 http://localhost:3000

2️⃣ Go to Explore

3️⃣ Select Tempo as the data source

4️⃣ Click Search to view traces

5️⃣ Click on a trace to see the request flow

![tempo-traces-spans](../images/tempo-traces-spans.png)