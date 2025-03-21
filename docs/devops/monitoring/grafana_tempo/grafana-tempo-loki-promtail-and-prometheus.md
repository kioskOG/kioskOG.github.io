---
title: Setting Up Python application using OpenTelemetry & Tracing with Logging (Loki)
layout: home
parent: Introduction to Distributed Tracing & Grafana Tempo
grand_parent: monitoring
nav_order: 3
permalink: /docs/devops/monitoring/grafana_tempo/grafana-tempo-loki-promtail-and-prometheus/
description: Documentation for instrument a Python application using OpenTelemetry and send traces to Grafana Tempo with Logging using Loki. 🚀
---

## 📌 Connecting Tracing with Logging (Loki)

## We'll create a simple Flask API that:

✅ Set up Loki (for log collection)

✅ Generates traces

✅ Generates metrics

✅ Sends traces & metrics to OpenTelemetry Collector

✅ Configure Python app to send logs to Loki

✅ Link logs with traces in Grafana


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

x-logging:
  &default-logging
  driver: "json-file"
  options:
    max-size: "1m"
    max-file: "1"
    tag: "{{.Name}}"

x-labels:
  &default-labels
  logging: "promtail"
  logging_jobname: "containerlogs"

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
    logging: *default-logging
    labels: *default-labels

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_DEFAULT_THEME=dark
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana-datasources.yml:/etc/grafana/provisioning/datasources/datasources.yaml
    depends_on:
      - tempo
      - prometheus
    networks:
      - observability
    logging: *default-logging

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
    logging: *default-logging
  
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
      - observability
    depends_on:
      - otel-collector
    logging: *default-logging

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
        logging: *default-logging
        labels: *default-labels

  promtail:
    image:  grafana/promtail:2.9.7
    container_name: promtail
    volumes:
      - ./promtail.yaml:/etc/promtail/docker-config.yaml
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock
      - promtail-data:/var
    command: -config.file=/etc/promtail/docker-config.yaml
    depends_on:
      - loki
    networks:
      - observability
    logging: *default-logging
  
  loki:
    image: grafana/loki:2.9.7
    container_name: loki
    ports:
      - 3100:3100
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - observability
    volumes:
      - loki-data:/loki
    logging: *default-logging

volumes:
  tempo-data:
  grafana-data:
  loki-data:
  prometheus-data:
  promtail-data:

networks:
  observability:
    driver: bridge
```


{ : .important }
> Add `labels: *default-labels` to the container for which you want the loki to scrape logs. Because we have a filter configured in `promtail.yaml` for the same.

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
    jaeger:
      protocols:
        grpc:
        thrift_compact:
        thrift_binary:
        thrift_http:
    otlp:
      protocols:
        grpc:
          endpoint: 0.0.0.0:4317
        http:
          endpoint: 0.0.0.0:4318

ingester:
  trace_idle_period: 10s
  max_block_bytes: 1_000_000
  max_block_duration: 5m  # Cut the headblock after this much time (for demo purposes)

compactor:
  compaction:
    block_retention: 48h  # Keeping longer retention from second config
    compacted_block_retention: 1h

metrics_generator:
  registry:
    external_labels:
      source: tempo
      cluster: docker-compose
  storage:
    path: /tmp/tempo/generator/wal
    remote_write:
      - url: http://prometheus:9090/api/v1/write
        send_exemplars: true

storage:
  trace:
    backend: local
    local:
      path: /var/tempo/traces  # Keeping the path from the second config
    block:
      bloom_filter_false_positive: 0.05
      v2_index_downsample_bytes: 1000
      v2_encoding: zstd

overrides:
  defaults:
    metrics_generator:
      processors: [service-graphs, span-metrics, local-blocks]  # Kept local-blocks from the first config
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
  - job_name: 'tempo'
    static_configs:
      - targets: [ 'tempo:3200' ]
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
    uid: tempo
    url: http://tempo:3200
    isDefault: true
    editable: true
    jsonData:
      httpMethod: GET
      tracesToLogsV2:
        datasourceUid: "loki"
        spanStartTimeShift: '-1h'
        spanEndTimeShift: '1h'
        filterByTraceID: false
        filterBySpanID: false
      tracesToMetrics:
        datasourceUid: "prometheus"
        spanStartTimeShift: '-1h'
        spanEndTimeShift: '1h'
      streamingEnabled:
        search: true
      traceQuery:
        timeShiftEnabled: true
        spanStartTimeShift: '-1h'
        spanEndTimeShift: '1h'
      serviceMap:
        datasourceUid: "prometheus"
      nodeGraph:
        enabled: true
      spanBar:
        datasourceUid: "prometheus"
      lokiSearch:
        datasourceUid: 'loki'
  - name: Prometheus
    type: prometheus
    access: proxy
    uid: prometheus
    url: http://prometheus:9090
    isDefault: false
    editable: true
  - name: Loki
    type: loki
    uid: loki
    access: proxy
    orgId: 1
    url: http://loki:3100
    basicAuth: false
    isDefault: false
    version: 1
    editable: true
    jsonData:
      derivedFields:
      - datasourceName: tempo
        datasourceUid: tempo
        matcherRegex: trace_id=(\w+)
        name: traceID
        url: '$${__value.raw}'
```

## Create Promtail Config

Create a file `promtail.yaml`:

```yaml
# https://grafana.com/docs/loki/latest/clients/promtail/configuration/
# https://docs.docker.com/engine/api/v1.41/#operation/ContainerList
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: flog_scrape 
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
        refresh_interval: 5s
        filters:
          - name: label
            values: ["logging=promtail"] 
    relabel_configs:
      - source_labels: ['__meta_docker_container_name']
        regex: '/(.*)'
        target_label: 'container'
      - source_labels: ['__meta_docker_container_log_stream']
        target_label: 'logstream'
      - source_labels: ['__meta_docker_container_label_logging_jobname']
        target_label: 'job'
    pipeline_stages:
      - cri: {}
      - multiline:
          firstline: ^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2},\d{3}
          max_wait_time: 3s
      # https://grafana.com/docs/loki/latest/clients/promtail/stages/json/
      - json:
          expressions:
            #message: message
            level: level
            #output: 'message'
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
 ✔ Container loki                            Started
 ✔ Container promtail                        Started
 ```

## Generate Traces

```bash
curl http://localhost:5000/
curl http://localhost:5000/slow
```

{: .note}
> Each request generates traces and sends them to Grafana Tempo via the OTLP Exporter.


## View Logs & Traces in Grafana
1️⃣ Open Grafana at 👉 http://localhost:3000

2️⃣ Go to Explore

3️⃣ Select Tempo as the data source

4️⃣ Click Search to view traces

5️⃣ Click on a trace to see the request flow

![tempo-traces-spans](../images/tempo-traces-spans.png)

## Link Logs & Traces
1️⃣ Open Explore

2️⃣ Select tempo → Trace Id

3️⃣ A new pane will open, scroll down on that.

4️⃣ Click Logs for this span.

5️⃣ Click the Trace ID to jump to Tempo traces

Now, you can click logs to see traces and click traces to see logs! 🎉