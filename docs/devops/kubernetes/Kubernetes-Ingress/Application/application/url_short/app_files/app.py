# import random
# import string
# import pymysql
# import redis
# import json
# from flask import Flask, render_template, redirect, request, jsonify, session
# from flask_cors import CORS
# import os
# from prometheus_client import Summary, Counter, Gauge, generate_latest, CONTENT_TYPE_LATEST
# import time
# from functools import wraps

# app = Flask(__name__)
# CORS(app)

# MYSQL_SERVER_ENDPOINT = os.environ['MYSQL_SERVER_ENDPOINT']
# MYSQL_SERVER_USERNAME = os.environ['MYSQL_SERVER_USERNAME']
# MYSQL_SERVER_PASSWORD = os.environ['MYSQL_SERVER_PASSWORD']
# MYSQL_SERVER_DATABASE = os.environ['MYSQL_SERVER_DATABASE']
# MYSQL_SERVER_PORT = int(os.environ['MYSQL_SERVER_PORT'])
# MYSQL_SERVER_CHARSET = os.environ['MYSQL_SERVER_CHARSET']
# REDIS_SERVER_ENDPOINT = os.environ['REDIS_SERVER_ENDPOINT']
# REDIS_SERVER_PORT = int(os.environ['REDIS_SERVER_PORT'])
# REDIS_SERVER_CHARSET = os.environ['REDIS_SERVER_CHARSET']
# REDIS_SERVER_SHORTURL_TIMEOUT = int(os.environ['REDIS_SERVER_SHORTURL_TIMEOUT'])
# URLSHORT_SERVER_PORT=int(os.environ['URLSHORT_SERVER_PORT'])

# # Prometheus metrics definitions
# REQUEST_TIME = Summary('urlshort_request_latency_seconds', 'Time spent processing URL shortener requests', ['endpoint'])
# REQUEST_COUNT = Counter('urlshort_request_total', 'Total number of URL shortener requests', ['endpoint', 'method', 'http_status'])
# IN_PROGRESS = Gauge('urlshort_in_progress_requests', 'Number of in-progress URL shortener requests', ['endpoint'])
# REQUEST_FAILURES = Counter('urlshort_request_failures_total', 'Total number of failed URL shortener requests', ['endpoint', 'reason'])

# def instrument_endpoint(func):
#     @wraps(func)
#     def wrapper(*args, **kwargs):
#         endpoint = request.path
#         method = request.method
#         IN_PROGRESS.labels(endpoint=endpoint).inc()
#         start = time.time()

#         status_code = 500  # Default status code in case of exception before assignment
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
#         duration = time.time() - start
#         REQUEST_TIME.labels(endpoint=endpoint).observe(duration)
#         IN_PROGRESS.labels(endpoint=endpoint).dec()
#         return response
#     return wrapper

# @app.route('/metrics')
# def metrics():
#     return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)

# def redis_database():
#     redisCli = redis.Redis(
#         host=REDIS_SERVER_ENDPOINT,
#         port=REDIS_SERVER_PORT,
#         # charset=REDIS_SERVER_CHARSET,
#         decode_responses=True
#         )
#     return redisCli

# def get_connection():
#     conn = pymysql.connect(
#         host=MYSQL_SERVER_ENDPOINT,
#         port=MYSQL_SERVER_PORT,
#         user=MYSQL_SERVER_USERNAME,
#         password=MYSQL_SERVER_PASSWORD,
#         db=MYSQL_SERVER_DATABASE,
#         charset=MYSQL_SERVER_CHARSET,
#         cursorclass=pymysql.cursors.DictCursor
#         )
#     return conn

# def generate_short_url(length=6):
#     chars = string.ascii_letters + string.digits
#     short_url = "".join(random.choice(chars) for _ in range(length))
#     return short_url

# def insert_url_to_database(long_url, short_url, users_email):
#     con = None
#     try:
#         con = get_connection()
#         with con.cursor() as cur:
#             cur.execute(
#                 "INSERT INTO urls (link, short_url, email) VALUES (%s, %s, %s)",
#                 (long_url, short_url, users_email)
#                 )
#             con.commit()
#     except Exception as e:
#         print(f"Error inserting URL to database: {e}")
#     finally:
#         if con:
#             con.close()

# def redirectShortUrl(short_url):
#     try:
#         con = get_connection()
#         with con.cursor() as cur:
#             cur.execute(
#                 "UPDATE urls SET visitors=visitors+1 WHERE short_url = %s",
#                 (short_url,)
#                 )
#             con.commit()
#     except Exception as e:
#         print(f"Error inserting URL to database: {e}")
#         return {
#             "msg": f"Error inserting URL to database: {e}"
#         }
#     finally:
#         if con:
#             con.close()

# def allurls():
#     try:
#         con = get_connection()
#         with con.cursor() as cur:
#             cur.execute("SELECT * FROM urls")
#             data = cur.fetchall()
#             if data:
#                 return jsonify(data), 200
#             return jsonify({
#                 "error": "No data found"
#                 }), 404
#     except Exception as e:
#         print(f"Error : {e}")
#     finally:
#         if con:
#             con.close()

# @app.route("/api/url", methods=["POST"])
# @instrument_endpoint
# def index():
#     if request.method == "POST":
#         long_url = request.form['long_url']
#         users_email = request.form['users_email']
#         short_url = generate_short_url()
#         insert_url_to_database(
#             long_url,
#             short_url,
#             users_email
#             )
#         return jsonify({
#             "long_url": long_url,
#             "short_url": short_url
#             }), 200

# @app.route("/r/<short_url>")
# @instrument_endpoint
# def redirect_url(short_url):
#     try:
#         con = get_connection()
#     except pymysql.err.OperationalError:
#         return render_template(
#             "internal_server_error.html",
#             msg="MySQL Database issue"
#             )
#     redis_server = redis_database()
#     try:
#         if redis_server.get(short_url) is None:
#             cur = con.cursor()
#             cur.execute(
#                 'SELECT * FROM urls WHERE short_url = %s;',
#                 (short_url)
#                 )
#             result = cur.fetchall()
#             if result:
#                 row = result[0]
#                 long_url = (row['link'])
#                 try:
#                     redis_server.setex(
#                         short_url,
#                         REDIS_SERVER_SHORTURL_TIMEOUT,
#                         value = json.dumps(row)
#                         )
#                 except:
#                     print(f'The short URL {short_url} has not been added to redis')
#             redirectShortUrl(short_url)
#             cur.close()
#             con.close()
#             return redirect(long_url)
#     except redis.exceptions.ConnectionError:
#             cur = con.cursor()
#             cur.execute('SELECT * FROM urls WHERE short_url = %s;', (short_url,))
#             result = cur.fetchall()
#             if result:
#                 row = result[0]
#                 long_url = (row['link'])
#             redirectShortUrl(short_url)
#             cur.close()
#             con.close()
#             return redirect(long_url)
#     else:
#         try:
#             redis_value =  json.loads(redis_server.get(short_url))
#         except:
#             return render_template(
#                 "internal_server_error.html",
#                 msg="Redis Issue"
#                 )
#         original_url = redis_value['link']
#         redirectShortUrl(short_url)
#         return redirect(original_url)

# @app.route('/health', methods=['GET'])
# def health_check():
#     return jsonify({"status": "ok"}), 200

# if __name__ == "__main__":
#     app.run(debug=True, host='0.0.0.0',  port=URLSHORT_SERVER_PORT)


import random
import string
import pymysql
import redis
import json
from flask import Flask, render_template, redirect, request, jsonify, session, Response
from flask_cors import CORS
import os
from prometheus_client import Summary, Counter, Gauge, generate_latest, CONTENT_TYPE_LATEST
import time
from functools import wraps

# --- OpenTelemetry Tracing Imports ---
from opentelemetry import trace
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace.export import BatchSpanProcessor
import logging

# --- OTEL Tracing Setup ---
resource = Resource(attributes={SERVICE_NAME: "urlshort-service"})
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
CORS(app)
FlaskInstrumentor().instrument_app(app)

MYSQL_SERVER_ENDPOINT = os.environ['MYSQL_SERVER_ENDPOINT']
MYSQL_SERVER_USERNAME = os.environ['MYSQL_SERVER_USERNAME']
MYSQL_SERVER_PASSWORD = os.environ['MYSQL_SERVER_PASSWORD']
MYSQL_SERVER_DATABASE = os.environ['MYSQL_SERVER_DATABASE']
MYSQL_SERVER_PORT = int(os.environ['MYSQL_SERVER_PORT'])
MYSQL_SERVER_CHARSET = os.environ['MYSQL_SERVER_CHARSET']
REDIS_SERVER_ENDPOINT = os.environ['REDIS_SERVER_ENDPOINT']
REDIS_SERVER_PORT = int(os.environ['REDIS_SERVER_PORT'])
REDIS_SERVER_CHARSET = os.environ['REDIS_SERVER_CHARSET']
REDIS_SERVER_SHORTURL_TIMEOUT = int(os.environ['REDIS_SERVER_SHORTURL_TIMEOUT'])
URLSHORT_SERVER_PORT = int(os.environ['URLSHORT_SERVER_PORT'])

# Prometheus metrics
REQUEST_TIME = Summary('urlshort_request_latency_seconds', 'Time spent processing URL shortener requests', ['endpoint'])
REQUEST_COUNT = Counter('urlshort_request_total', 'Total number of URL shortener requests', ['endpoint', 'method', 'http_status'])
IN_PROGRESS = Gauge('urlshort_in_progress_requests', 'Number of in-progress URL shortener requests', ['endpoint'])
REQUEST_FAILURES = Counter('urlshort_request_failures_total', 'Total number of failed URL shortener requests', ['endpoint', 'reason'])

def instrument_endpoint(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        endpoint = request.path
        method = request.method
        IN_PROGRESS.labels(endpoint=endpoint).inc()
        start = time.time()

        status_code = 500  # Default status code in case of exception before assignment
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
        duration = time.time() - start
        REQUEST_TIME.labels(endpoint=endpoint).observe(duration)
        IN_PROGRESS.labels(endpoint=endpoint).dec()
        return response
    return wrapper

@app.route('/metrics')
def metrics():
    with tracer.start_as_current_span("metrics"):
        return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)

def redis_database():
    return redis.Redis(
        host=REDIS_SERVER_ENDPOINT,
        port=REDIS_SERVER_PORT,
        decode_responses=True
    )

def get_connection():
    return pymysql.connect(
        host=MYSQL_SERVER_ENDPOINT,
        port=MYSQL_SERVER_PORT,
        user=MYSQL_SERVER_USERNAME,
        password=MYSQL_SERVER_PASSWORD,
        db=MYSQL_SERVER_DATABASE,
        charset=MYSQL_SERVER_CHARSET,
        cursorclass=pymysql.cursors.DictCursor
    )

def generate_short_url(length=6):
    chars = string.ascii_letters + string.digits
    short_url = "".join(random.choice(chars) for _ in range(length))
    return short_url

def insert_url_to_database(long_url, short_url, users_email):
    with tracer.start_as_current_span("insert_url_to_database"):
        con = None
        try:
            con = get_connection()
            with con.cursor() as cur:
                cur.execute(
                    "INSERT INTO urls (link, short_url, email) VALUES (%s, %s, %s)",
                    (long_url, short_url, users_email)
                )
                con.commit()
            log_trace_metadata(f"Inserted short_url: {short_url} for {users_email}")
        except Exception as e:
            log_trace_metadata(f"Error inserting URL: {e}")
        finally:
            if con:
                con.close()

def redirectShortUrl(short_url):
    with tracer.start_as_current_span("redirectShortUrl"):
        try:
            con = get_connection()
            with con.cursor() as cur:
                cur.execute(
                    "UPDATE urls SET visitors=visitors+1 WHERE short_url = %s",
                    (short_url,)
                )
                con.commit()
        except Exception as e:
            log_trace_metadata(f"Error incrementing visitor: {e}")
            return {
                "msg": f"Error inserting URL to database: {e}"
            }
        finally:
            if con:
                con.close()

def allurls():
    with tracer.start_as_current_span("allurls"):
        try:
            con = get_connection()
            with con.cursor() as cur:
                cur.execute("SELECT * FROM urls")
                data = cur.fetchall()
                if data:
                    return jsonify(data), 200
                return jsonify({
                    "error": "No data found"
                }), 404
        except Exception as e:
            log_trace_metadata(f"Error retrieving all URLs: {e}")
        finally:
            if con:
                con.close()

@app.route("/api/url", methods=["POST"])
@instrument_endpoint
def index():
    with tracer.start_as_current_span("api_url_create"):
        long_url = request.form['long_url']
        users_email = request.form['users_email']
        short_url = generate_short_url()
        insert_url_to_database(
            long_url,
            short_url,
            users_email
        )
        log_trace_metadata(f"Short URL generated: {short_url}")
        return jsonify({
            "long_url": long_url,
            "short_url": short_url
        }), 200

@app.route("/r/<short_url>")
@instrument_endpoint
def redirect_url(short_url):
    with tracer.start_as_current_span("redirect_url"):
        try:
            con = get_connection()
        except pymysql.err.OperationalError:
            log_trace_metadata("MySQL Database issue")
            return render_template(
                "internal_server_error.html",
                msg="MySQL Database issue"
            )
        redis_server = redis_database()
        try:
            if redis_server.get(short_url) is None:
                cur = con.cursor()
                cur.execute(
                    'SELECT * FROM urls WHERE short_url = %s;',
                    (short_url,)
                )
                result = cur.fetchall()
                if result:
                    row = result[0]
                    long_url = (row['link'])
                    try:
                        redis_server.setex(
                            short_url,
                            REDIS_SERVER_SHORTURL_TIMEOUT,
                            value=json.dumps(row)
                        )
                        log_trace_metadata(f"Short URL {short_url} cached in Redis")
                    except Exception as e:
                        log_trace_metadata(f"Redis caching failed: {e}")
                redirectShortUrl(short_url)
                cur.close()
                con.close()
                log_trace_metadata("Redirecting to original URL from DB")
                return redirect(long_url)
        except redis.exceptions.ConnectionError:
            cur = con.cursor()
            cur.execute('SELECT * FROM urls WHERE short_url = %s;', (short_url,))
            result = cur.fetchall()
            if result:
                row = result[0]
                long_url = (row['link'])
            redirectShortUrl(short_url)
            cur.close()
            con.close()
            log_trace_metadata("Redis connection error, redirecting from DB")
            return redirect(long_url)
        else:
            try:
                redis_value = json.loads(redis_server.get(short_url))
            except Exception as e:
                log_trace_metadata(f"Redis JSON load error: {e}")
                return render_template(
                    "internal_server_error.html",
                    msg="Redis Issue"
                )
            original_url = redis_value['link']
            redirectShortUrl(short_url)
            log_trace_metadata("Redirecting to original URL from Redis")
            return redirect(original_url)

@app.route('/health', methods=['GET'])
def health_check():
    with tracer.start_as_current_span("health_check"):
        return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=URLSHORT_SERVER_PORT)
