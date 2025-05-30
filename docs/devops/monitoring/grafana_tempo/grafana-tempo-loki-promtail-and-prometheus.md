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
from opentelemetry.trace import get_current_span

# ✅ Custom LogRecord Factory to Inject Trace IDs
old_factory = logging.getLogRecordFactory()

def log_record_factory(*args, **kwargs):
    record = old_factory(*args, **kwargs)
    span = get_current_span()
    if span and span.get_span_context():
        record.trace_id = format(span.get_span_context().trace_id, 'x')
        record.span_id = format(span.get_span_context().span_id, 'x')
    else:
        record.trace_id = "N/A"
        record.span_id = "N/A"
    return record

logging.setLogRecordFactory(log_record_factory)

# ✅ Update Logging Format
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s application=flask-otel-app traceId=%(trace_id)s spanId=%(span_id)s level=%(levelname)s message="%(message)s"',
)
logger = logging.getLogger(__name__)

# ✅ Initialize tracing with resource attributes
resource = Resource.create({
    "service.name": "flask-otel-app",
    "service.version": "1.0.0",
    "service.environment": "QA"
})
trace.set_tracer_provider(TracerProvider(resource=resource))
tracer = trace.get_tracer(__name__)

# ✅ Export spans to OTLP (Tempo)
try:
    otlp_exporter = OTLPSpanExporter(endpoint="http://tempo:4318/v1/traces")
    span_processor = BatchSpanProcessor(otlp_exporter)
    trace.get_tracer_provider().add_span_processor(span_processor)
except Exception as e:
    logger.error(f"Error initializing OTLP exporter: {e}")

# ✅ Start metrics server explicitly before creating Flask app
metrics = PrometheusMetrics.for_app_factory(group_by='endpoint', buckets=[0.1, 0.2, 0.5, 1, 2, 5, 10])
metrics.start_http_server(5001)

# ✅ Flask App
app = Flask(__name__)
metrics.init_app(app)
FlaskInstrumentor().instrument_app(app)

@app.route('/')
def home():
    with tracer.start_as_current_span("home-handler"):
        time.sleep(0.2)  # Simulate processing
        logger.info("Processing / request")
        return "Hello, OpenTelemetry!"

@app.route('/slow')
def slow():
    with tracer.start_as_current_span("slow-handler"):
        time.sleep(1)  # Simulate a slow response
        logger.info("Processing /slow request")
        return "This took a while!"

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
---
networks:
  observability:
    driver: bridge

volumes:
  tempo-data:
  grafana-data:
  loki-data:
  prometheus-data:

services:
  flask-otel-app:
    build: ./otel-python-app/ 
    ports:
        - 5000:5000
    container_name: flask-otel-app
    networks:
        - observability
          #image: flask-otel-app
    depends_on:
    - prometheus
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
  read:
    image: grafana/loki:latest
    command: "-config.file=/etc/loki/config.yaml -target=read"
    ports:
      - 3101:3100
      - 7946
      - 9095
    volumes:
      - ./loki-config.yaml:/etc/loki/config.yaml
    depends_on:
      - minio
    healthcheck:
      test: [ "CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3100/ready || exit 1" ]
      interval: 10s
      timeout: 5s
      retries: 5
    networks: 
      - observability

  write:
    image: grafana/loki:latest
    command: "-config.file=/etc/loki/config.yaml -target=write"
    ports:
      - 3102:3100
      - 7946
      - 9095
    volumes:
      - ./loki-config.yaml:/etc/loki/config.yaml
    healthcheck:
      test: [ "CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3100/ready || exit 1" ]
      interval: 10s
      timeout: 5s
      retries: 5
    depends_on:
      - minio
    networks: 
      - observability

  alloy:
    image: grafana/alloy:latest
    volumes:
      - ./alloy-local-config.yaml:/etc/alloy/config.alloy:ro
      - /var/run/docker.sock:/var/run/docker.sock
    command:  run --server.http.listen-addr=0.0.0.0:12345 --storage.path=/var/lib/alloy/data /etc/alloy/config.alloy
    ports:
      - 12345:12345
    depends_on:
      - gateway
    networks:
      - observability

  minio:
    image: minio/minio
    entrypoint:
      - sh
      - -euc
      - |
        mkdir -p /data/loki-data && \
        mkdir -p /data/loki-ruler && \
        minio server /data
    environment:
      - MINIO_ROOT_USER=loki
      - MINIO_ROOT_PASSWORD=supersecret
      - MINIO_PROMETHEUS_AUTH_TYPE=public
      - MINIO_UPDATE=off
    ports:
      - 9000:9000
    volumes:
      - ./.data/minio:/data
    healthcheck:
      test: [ "CMD", "curl", "-f", "http://localhost:9000/minio/health/live" ]
      interval: 15s
      timeout: 20s
      retries: 5
    networks:
      - observability

  grafana:
    image: grafana/grafana:latest
    environment:
      - GF_AUTH_ANONYMOUS_ENABLED=true
      - GF_AUTH_ANONYMOUS_ORG_ROLE=Admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_DEFAULT_THEME=dark
    depends_on:
      - gateway
      - tempo
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
      - observability

  backend:
    image: grafana/loki:latest
    volumes:
      - ./loki-config.yaml:/etc/loki/config.yaml
      - loki-data:/loki
    ports:
      - "3100"
      - "7946"
    command: "-config.file=/etc/loki/config.yaml -target=backend -legacy-read-mode=false"
    depends_on:
      - gateway
    networks:
      - observability
    

  gateway:
    image: nginx:latest
    depends_on:
      - read
      - write
    entrypoint:
      - sh
      - -euc
      - |
        cat <<EOF > /etc/nginx/nginx.conf
        user  nginx;
        worker_processes  5;  ## Default: 1

        events {
          worker_connections   1000;
        }

        http {
          resolver 127.0.0.11;

          server {
            listen             3100;

            location = / {
              return 200 'OK';
              auth_basic off;
            }

            location = /api/prom/push {
              proxy_pass       http://write:3100\$$request_uri;
            }

            location = /api/prom/tail {
              proxy_pass       http://read:3100\$$request_uri;
              proxy_set_header Upgrade \$$http_upgrade;
              proxy_set_header Connection "upgrade";
            }

            location ~ /api/prom/.* {
              proxy_pass       http://read:3100\$$request_uri;
            }

            location = /loki/api/v1/push {
              proxy_pass       http://write:3100\$$request_uri;
            }

            location = /loki/api/v1/tail {
              proxy_pass       http://read:3100\$$request_uri;
              proxy_set_header Upgrade \$$http_upgrade;
              proxy_set_header Connection "upgrade";
            }

            location ~ /loki/api/.* {
              proxy_pass       http://read:3100\$$request_uri;
            }
          }
        }
        EOF
        /docker-entrypoint.sh nginx -g "daemon off;"
    ports:
      - "3100:3100"
    healthcheck:
      test: ["CMD", "service", "nginx", "status"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - observability
  

  flog:
    image: mingrammer/flog
    command: -f json -d 200ms -l
    networks:
      - observability
```


<!-- { : .important }
> Add `labels: *default-labels` to the container for which you want the loki to scrape logs. Because we have a filter configured in `promtail.yaml` for the same. -->

<!-- ## 7️⃣ Create OpenTelemetry Collector Config

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
``` -->

## 7️⃣ Create Alloy Collector Config

Create a file `alloy-local-config.yaml` 

```yaml
discovery.docker "flog_scrape" {
  host             = "unix:///var/run/docker.sock"
  refresh_interval = "5s"
}

discovery.relabel "flog_scrape" {
  targets = []

  rule {
    source_labels = ["__meta_docker_container_name"]
    regex         = "/(.*)"
    target_label  = "container"
  }
}

loki.source.docker "flog_scrape" {
  host             = "unix:///var/run/docker.sock"
  targets          = discovery.docker.flog_scrape.targets
  forward_to       = [loki.write.default.receiver]
  relabel_rules    = discovery.relabel.flog_scrape.rules
  refresh_interval = "5s"
}

loki.write "default" {
  endpoint {
    url       = "http://gateway:3100/loki/api/v1/push"
    tenant_id = "tenant1"
  }
  external_labels = {}
}
```

## 8️⃣ Create Tempo Config

Create a file `tempo-config.yml`: 

```yaml
discovery.docker "flog_scrape" {
  host             = "unix:///var/run/docker.sock"
  refresh_interval = "5s"
}

discovery.relabel "flog_scrape" {
  targets = []

  rule {
    source_labels = ["__meta_docker_container_name"]
    regex         = "/(.*)"
    target_label  = "container"
  }
}

loki.source.docker "flog_scrape" {
  host             = "unix:///var/run/docker.sock"
  targets          = discovery.docker.flog_scrape.targets
  forward_to       = [loki.write.default.receiver]
  relabel_rules    = discovery.relabel.flog_scrape.rules
  refresh_interval = "5s"
}

loki.write "default" {
  endpoint {
    url       = "http://gateway:3100/loki/api/v1/push"
    tenant_id = "tenant1"
  }
  external_labels = {}
}
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
  trace_idle_period: 35s
  max_block_bytes: 1_000_000

compactor:
  compaction:
    block_retention: 48h  # Keeping longer retention from second config
    compacted_block_retention: 1h

metrics_generator:
  registry:
    external_labels:
      source: tempo
      cluster: docker-compose
  processor:
    service_graphs:
      wait: 10s
      max_items: 10000
      histogram_buckets: [0.1, 0.2, 0.4, 0.8, 1.6, 3.2, 6.4, 12.8]
    span_metrics:
      histogram_buckets: [0.002, 0.004, 0.008, 0.016, 0.032, 0.064, 0.128, 0.256, 0.512, 1.024, 2.048, 4.096, 8.192, 16.384]
  storage:
    path: /var/tempo/generator/wal
    remote_write:
      - url: http://prometheus:9090/api/v1/write
        send_exemplars: true

storage:
  trace:
    backend: local
    local:
      path: /var/tempo/traces  # Keeping the path from the second config
    wal:
      path: /var/tempo/wal
    block:
      bloom_filter_false_positive: 0.05
      v2_index_downsample_bytes: 1000
      v2_encoding: zstd

overrides:
  defaults:
    metrics_generator:
      processors: [service-graphs, span-metrics, local-blocks]  # Kept local-blocks from the first config
      generate_native_histograms: both
      processor:
        service_graphs:
          enable_messaging_system_latency_histogram: true

```

## 9️⃣ Create Prometheus Config

Create a file `prometheus.yml`:

```yaml
global:
  scrape_interval: 10s

scrape_configs:
  # Scrape Prometheus itself
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]  # Assuming Prometheus is running on localhost:9090

  # Scrape Loki metrics
  - job_name: "loki"
    metrics_path: "/metrics"  # Loki's metrics endpoint
    static_configs:
      - targets: ["backend:3100"]  # Replace with your Loki's address and port

  # Scrape Loki metrics
  - job_name: "Alloy"
    metrics_path: "/metrics"  # Alloy's metrics endpoint
    static_configs:
      - targets: ["alloy:12345"]  # Replace with your Alloy's address and port

  - job_name: 'tempo'
    static_configs:
      - targets: [ 'tempo:3200' ]

  - job_name: 'grafana'
    static_configs:
      - targets: [ 'grafana:3000' ]

  - job_name: "flask-app"
    metrics_path: "/metrics"
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
        tags: [{ key: 'service.name', value: 'flask-otel-app' }, { key: 'job' }]
      streamingEnabled:
        search: true
      traceQuery:
        timeShiftEnabled: true
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
  - name: Loki # (name of the data source)
    type: loki # (type of data source)
    uid: loki
    access: proxy # (access type)
    orgId: 1
    url: http://gateway:3100 # (URL of the Loki data source. Loki uses an nginx gateway to direct traffic to the appropriate component)
    basicAuth: false
    isDefault: false
    version: 1
    editable: true
    jsonData:
      httpHeaderName1: "X-Scope-OrgID" # (header name for the organization ID)
    secureJsonData:
      httpHeaderValue1: "tenant1" # (header value for the organization ID)

# It is important to note when Loki is configured in any other mode other than monolithic deployment, you are required to pass a tenant ID in the header. 
# Without this, queries will return an authorization error.
```

## Create Promtail Config

Create a file `loki-config.yaml`:

```yaml
---
server:
  http_listen_address: 0.0.0.0
  http_listen_port: 3100

memberlist:
  join_members: ["read", "write", "backend"]
  dead_node_reclaim_time: 30s
  gossip_to_dead_nodes_time: 15s
  left_ingesters_timeout: 30s
  bind_addr: ['0.0.0.0']
  bind_port: 7946
  gossip_interval: 2s

schema_config:
  configs:
    - from: 2023-01-01
      store: tsdb
      object_store: s3
      schema: v13
      index:
        prefix: index_
        period: 24h
common:
  path_prefix: /loki
  replication_factor: 1
  compactor_address: http://backend:3100
  storage:
    s3:
      endpoint: minio:9000
      insecure: true
      bucketnames: loki-data
      access_key_id: loki
      secret_access_key: supersecret
      s3forcepathstyle: true
  ring:
    kvstore:
      store: memberlist
ruler:
  storage:
    s3:
      bucketnames: loki-ruler

compactor:
  working_directory: /tmp/compactor
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