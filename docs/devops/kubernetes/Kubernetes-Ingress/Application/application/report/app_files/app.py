# from flask import Flask, request, session, jsonify
# from functools import wraps
# import pymysql
# import os
# from prometheus_client import Summary, Counter, Gauge, generate_latest, CONTENT_TYPE_LATEST
# from functools import wraps
# import time

# app = Flask(__name__)

# MYSQL_SERVER_ENDPOINT = os.environ['MYSQL_SERVER_ENDPOINT']
# MYSQL_SERVER_USERNAME = os.environ['MYSQL_SERVER_USERNAME']
# MYSQL_SERVER_PASSWORD = os.environ['MYSQL_SERVER_PASSWORD']
# MYSQL_SERVER_DATABASE = os.environ['MYSQL_SERVER_DATABASE']
# MYSQL_SERVER_PORT = int(os.environ['MYSQL_SERVER_PORT'])

# # Prometheus metrics definitions
# REQUEST_TIME = Summary('report_request_latency_seconds', 'Latency for report requests', ['endpoint'])
# REQUEST_COUNT = Counter('report_request_total', 'Total number of report requests', ['endpoint', 'method', 'http_status'])
# IN_PROGRESS = Gauge('report_in_progress_requests', 'Number of in-progress report requests', ['endpoint'])
# REQUEST_FAILURES = Counter('report_request_failures_total', 'Number of failed report requests', ['endpoint', 'reason'])

# def instrument_endpoint(func):
#     @wraps(func)
#     def wrapper(*args, **kwargs):
#         endpoint = request.path
#         method = request.method
#         IN_PROGRESS.labels(endpoint=endpoint).inc()
#         start_time = time.time()
#         status_code = 500  # default status code if exception occurs before assignment
#         try:
#             response = func(*args, **kwargs)
#             status_code = response.status_code if hasattr(response, 'status_code') else 200
#             REQUEST_COUNT.labels(endpoint=endpoint, method=method, http_status=status_code).inc()
#             if status_code >= 400:
#                 REQUEST_FAILURES.labels(endpoint=endpoint, reason=f"HTTP_{status_code}").inc()
#         except Exception as e:
#             REQUEST_FAILURES.labels(endpoint=endpoint, reason=type(e).__name__).inc()
#             IN_PROGRESS.labels(endpoint=endpoint).dec()
#             raise
#         duration = time.time() - start_time
#         REQUEST_TIME.labels(endpoint=endpoint).observe(duration)
#         IN_PROGRESS.labels(endpoint=endpoint).dec()
#         return response
#     return wrapper


# @app.route('/metrics')
# def metrics():
#     return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)

# def get_connection():
#     conn = pymysql.connect(
#         host=MYSQL_SERVER_ENDPOINT,
#         port=MYSQL_SERVER_PORT,
#         user=MYSQL_SERVER_USERNAME,
#         password=MYSQL_SERVER_PASSWORD,
#         db=MYSQL_SERVER_DATABASE,
#         charset='utf8mb4',
#         cursorclass=pymysql.cursors.DictCursor
#         )
#     return conn

# @app.route("/report", methods=["GET", "POST"])
# @instrument_endpoint
# def report():
# 	users_email = request.json["email"]
# 	if users_email:
# 		con = get_connection()
# 		try:
# 			with con.cursor() as cur:
# 				query = "SELECT * FROM urls WHERE email = %s"
# 				cur.execute(query, (users_email,))
# 				data = cur.fetchall()
# 				if data:
# 					return jsonify(data), 200
# 				return jsonify({
# 					"error": "No data found"
# 					}), 404
# 		except Exception as e:
# 			print(e)
# 			return jsonify(
# 				f"Error : {e}"
# 				), 500
# 		finally:
# 			if con:
# 				con.close()

# @app.route('/health', methods=['GET'])
# def health_check():
#     return jsonify({"status": "ok"}), 200

# if __name__ == "__main__":
# 	app.run(debug=True, host='0.0.0.0', port=5000)

from flask import Flask, request, session, jsonify, Response
from functools import wraps
import pymysql
import os
import time
from prometheus_client import Summary, Counter, Gauge, generate_latest, CONTENT_TYPE_LATEST

# --- OpenTelemetry Tracing Setup ---
from opentelemetry import trace
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace.export import BatchSpanProcessor
import logging

resource = Resource(attributes={SERVICE_NAME: "report-service"})
trace.set_tracer_provider(TracerProvider(resource=resource))
tracer_provider = trace.get_tracer_provider()
otlp_exporter = OTLPSpanExporter(
    endpoint="grafana-alloy.alloy-logs.svc.cluster.local:4317",
    insecure=True
)
span_processor = BatchSpanProcessor(otlp_exporter)
tracer_provider.add_span_processor(span_processor)
tracer = trace.get_tracer(__name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def log_trace_metadata(message):
    span = trace.get_current_span()
    context = span.get_span_context()
    metadata = {
        "trace_id": format(context.trace_id, "032x"),
        "span_id": format(context.span_id, "016x"),
        "http_target": request.path,
        "http_method": request.method,
        "message": message
    }
    logger.info(metadata)

app = Flask(__name__)
FlaskInstrumentor().instrument_app(app)

MYSQL_SERVER_ENDPOINT = os.environ['MYSQL_SERVER_ENDPOINT']
MYSQL_SERVER_USERNAME = os.environ['MYSQL_SERVER_USERNAME']
MYSQL_SERVER_PASSWORD = os.environ['MYSQL_SERVER_PASSWORD']
MYSQL_SERVER_DATABASE = os.environ['MYSQL_SERVER_DATABASE']
MYSQL_SERVER_PORT = int(os.environ['MYSQL_SERVER_PORT'])

# Prometheus metrics definitions
REQUEST_TIME = Summary('report_request_latency_seconds', 'Latency for report requests', ['endpoint'])
REQUEST_COUNT = Counter('report_request_total', 'Total number of report requests', ['endpoint', 'method', 'http_status'])
IN_PROGRESS = Gauge('report_in_progress_requests', 'Number of in-progress report requests', ['endpoint'])
REQUEST_FAILURES = Counter('report_request_failures_total', 'Number of failed report requests', ['endpoint', 'reason'])

def instrument_endpoint(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        endpoint = request.path
        method = request.method
        IN_PROGRESS.labels(endpoint=endpoint).inc()
        start_time = time.time()
        status_code = 500
        try:
            response = func(*args, **kwargs)
            status_code = response.status_code if hasattr(response, 'status_code') else 200
            REQUEST_COUNT.labels(endpoint=endpoint, method=method, http_status=status_code).inc()
            if status_code >= 400:
                REQUEST_FAILURES.labels(endpoint=endpoint, reason=f"HTTP_{status_code}").inc()
        except Exception as e:
            REQUEST_FAILURES.labels(endpoint=endpoint, reason=type(e).__name__).inc()
            IN_PROGRESS.labels(endpoint=endpoint).dec()
            raise
        duration = time.time() - start_time
        REQUEST_TIME.labels(endpoint=endpoint).observe(duration)
        IN_PROGRESS.labels(endpoint=endpoint).dec()
        return response
    return wrapper

@app.route('/metrics')
def metrics():
    with tracer.start_as_current_span("metrics"):
        return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)

def get_connection():
    conn = pymysql.connect(
        host=MYSQL_SERVER_ENDPOINT,
        port=MYSQL_SERVER_PORT,
        user=MYSQL_SERVER_USERNAME,
        password=MYSQL_SERVER_PASSWORD,
        db=MYSQL_SERVER_DATABASE,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    return conn

@app.route("/report", methods=["GET", "POST"])
@instrument_endpoint
def report():
    with tracer.start_as_current_span("report"):
        users_email = request.json["email"]
        if users_email:
            con = get_connection()
            try:
                with con.cursor() as cur:
                    query = "SELECT * FROM urls WHERE email = %s"
                    cur.execute(query, (users_email,))
                    data = cur.fetchall()
                    if data:
                        log_trace_metadata("Report data returned successfully")
                        return jsonify(data), 200
                    log_trace_metadata("No report data found")
                    return jsonify({"error": "No data found"}), 404
            except Exception as e:
                log_trace_metadata(f"Exception: {e}")
                return jsonify(f"Error : {e}"), 500
            finally:
                if con:
                    con.close()

@app.route('/health', methods=['GET'])
def health_check():
    with tracer.start_as_current_span("health_check"):
        return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
