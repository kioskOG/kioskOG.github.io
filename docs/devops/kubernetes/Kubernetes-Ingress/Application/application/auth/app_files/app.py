import os
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
import MySQLdb.cursors
import mysql.connector
import pymysql
from prometheus_client import Summary, Counter, Gauge, generate_latest
import time
from functools import wraps
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# --- OTEL Tracing Setup --------------------------------------------------------
from opentelemetry import trace
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace.export import BatchSpanProcessor

resource = Resource(attributes={
    SERVICE_NAME: "auth-service"
})

trace.set_tracer_provider(TracerProvider(resource=resource))
tracer_provider = trace.get_tracer_provider()
otlp_exporter = OTLPSpanExporter(
    endpoint="grafana-alloy.alloy-logs.svc.cluster.local:4317",
    insecure=True
)
span_processor = BatchSpanProcessor(otlp_exporter)
tracer_provider.add_span_processor(span_processor)
tracer = trace.get_tracer(__name__)

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


server = Flask(__name__)
FlaskInstrumentor().instrument_app(server)

MYSQL_SERVER_ENDPOINT = os.environ['MYSQL_SERVER_ENDPOINT']
MYSQL_SERVER_USERNAME = os.environ['MYSQL_SERVER_USERNAME']
MYSQL_SERVER_PASSWORD = os.environ['MYSQL_SERVER_PASSWORD']
MYSQL_SERVER_DATABASE = os.environ['MYSQL_SERVER_DATABASE']

server.config['MYSQL_HOST'] = MYSQL_SERVER_ENDPOINT
server.config['MYSQL_USER'] = MYSQL_SERVER_USERNAME
server.config['MYSQL_PASSWORD'] = MYSQL_SERVER_PASSWORD
server.config['MYSQL_DB'] = MYSQL_SERVER_DATABASE

mysqlVar = MySQL(server)

# ---------Prometheus metrics Setup ----------------------------------------------------
REQUEST_TIME = Summary(
    'auth_request_latency_seconds', 'Time spent processing auth requests', ['endpoint']
)
REQUEST_COUNT = Counter(
    'auth_request_total', 'Total number of auth requests', ['endpoint', 'method', 'http_status']
)
IN_PROGRESS = Gauge(
    'auth_in_progress_requests', 'Number of in-progress auth requests', ['endpoint']
)
REQUEST_FAILURES = Counter(
    'auth_request_failures_total', 'Total number of failed auth requests', ['endpoint', 'reason']
)

@server.route('/metrics')
def metrics():
    return generate_latest(), 200, {'Content-Type': 'text/plain; charset=utf-8'}

def instrument_endpoint(func):
    """
    Decorator to instrument Flask endpoints with Prometheus metrics.
    Tracks total requests, in-progress requests, latency, and failure counts.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        endpoint = request.path
        method = request.method
        IN_PROGRESS.labels(endpoint=endpoint).inc()
        start_time = time.time()

        status_code = 500  # default if exception occurs before assignment
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
        finally:
            duration = time.time() - start_time
            REQUEST_TIME.labels(endpoint=endpoint).observe(duration)
            # Make sure IN_PROGRESS is decremented only once (here in finally)
            if IN_PROGRESS.labels(endpoint=endpoint)._value.get() > 0:
                IN_PROGRESS.labels(endpoint=endpoint).dec()
        return response

    return wrapper



@server.route('/api/v1/auth/login', methods=['GET'])
@instrument_endpoint
def login():
    """
    Authenticates a user using provided username and password.

    Returns:
        JSON response containing user details if authentication is successful,
        otherwise an error message.
    """
    with tracer.start_as_current_span("auth_login"):
        username = request.json['username']
        password = request.json['password']
        try:
            connection = pymysql.connect(
                host=MYSQL_SERVER_ENDPOINT,
                user=MYSQL_SERVER_USERNAME,
                password=MYSQL_SERVER_PASSWORD,
                database=MYSQL_SERVER_DATABASE,
                cursorclass=pymysql.cursors.DictCursor
            )
        except pymysql.err.OperationalError:
            log_trace_metadata("MySQL connection failed")
            return jsonify({
                "msg": "Unknown MySQL server host"
            }), 500
        cursor = connection.cursor()
        cursor.execute(
            'SELECT * FROM users WHERE username = %s AND password = %s',
            (username, password)
            )
        account = cursor.fetchone()
        if account is None:
            log_trace_metadata("Invalid credentials")
            return jsonify({'Msg': 'Wrong Credentials!'}), 403
        log_trace_metadata("Login successful")
        return jsonify({
            "username": account['username'],
            "password": account['password'],
            "email": account['email']
            }), 200

@server.route('/api/v1/auth/user', methods=['GET'])
@instrument_endpoint
def usercheck():
    """
    Checks if a user exists in the database.

    Returns:
        JSON response containing the username if user exists,
        otherwise an error message.
    """
    with tracer.start_as_current_span("auth_usercheck"):
        username = request.json['username']
        try:
            cursor = mysqlVar.connection.cursor(MySQLdb.cursors.DictCursor)
        except MySQLdb.OperationalError:
            log_trace_metadata("MySQL error on user check")
            return jsonify({
                "msg": "Unknown MySQL server host"
            }), 500
        cursor.execute(
            'SELECT * FROM users WHERE username = %s',
            [username]
            )
        account = cursor.fetchone()
        if account is None:
            log_trace_metadata("User not found")
            return jsonify({
                'Msg': 'username doesnot exists !!'
                }), 403
        log_trace_metadata("User exists")
        return jsonify({
            "username": account['username']
        }), 200

@server.route('/api/v1/auth/register', methods=['POST'])
@instrument_endpoint
def register():
    """
    Registers a new user with provided email, username, and password.

    Returns:
        JSON response containing the email if registration is successful,
        otherwise an error message.
    """
    with tracer.start_as_current_span("auth_register"):
        email = request.json['email']
        password = request.json['password']
        username = request.json['username']
        try:
            mydb = mysql.connector.connect(
                host=MYSQL_SERVER_ENDPOINT,
                user=MYSQL_SERVER_USERNAME,
                password=MYSQL_SERVER_PASSWORD,
                database=MYSQL_SERVER_DATABASE
            )
        except mysql.connector.errors.DatabaseError:
            log_trace_metadata("MySQL connection failed on register")
            return jsonify({
                "msg": "Unknown MySQL server host"
            }), 500
        mycursor = mydb.cursor()
        try:
            mycursor.execute(
                'INSERT INTO users (email,password,username) VALUES(%s, %s, %s)',
                (email,password,username)
                )
        except mysql.connector.Error as my_error:
            if "Duplicate" in my_error.msg:
                log_trace_metadata("Duplicate registration")
                return jsonify({
                    "msg": "user exists"
                }), 500
        mydb.commit()
        log_trace_metadata("User registered")
        return jsonify({
            "email": email
        }), 200

@server.route('/health', methods=['GET'])
def health_check():
    try:
        # Try connecting to the database and run a simple query
        connection = pymysql.connect(
            host=MYSQL_SERVER_ENDPOINT,
            user=MYSQL_SERVER_USERNAME,
            password=MYSQL_SERVER_PASSWORD,
            database=MYSQL_SERVER_DATABASE,
            cursorclass=pymysql.cursors.DictCursor
        )
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            if result and list(result.values())[0] == 1:
                return jsonify({"status": "ok"}), 200
            else:
                return jsonify({"status": "fail", "reason": "Unexpected DB response"}), 503
    except Exception as e:
        return jsonify({"status": "fail", "reason": str(e)}), 503
    finally:
        if 'connection' in locals() and connection:
            connection.close()


if __name__ == "__main__":
    server.run(debug=True, host="0.0.0.0", port=5000)
