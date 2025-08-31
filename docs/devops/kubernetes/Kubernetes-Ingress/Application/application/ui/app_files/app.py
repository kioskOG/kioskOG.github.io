# import random
# import string
# import requests
# import json
# from flask import Flask, render_template, redirect, request, url_for, session, jsonify
# from prometheus_client import Counter, Summary, Gauge, generate_latest, CONTENT_TYPE_LATEST
# from functools import wraps
# import os
# import time


# app = Flask(__name__)


# SHORTURL_GENERATED_URL = os.environ['SHORTURL_GENERATED_URL']
# app.secret_key = os.environ['SESSION_SECRET_KEY']
# AUTH_SERVER_URL = os.environ['AUTH_SERVER_URL']
# AUTH_SERVER_LOGIN_API = os.environ['AUTH_SERVER_LOGIN_API']
# AUTH_SERVER_USER_API = os.environ['AUTH_SERVER_USER_API']
# AUTH_SERVER_REGISTER_API = os.environ['AUTH_SERVER_REGISTER_API']
# # NOTIFY_SERVER_URL = os.environ['NOTIFY_SERVER_URL']
# # NOTIFY_USER_REGISTER_API = os.environ['NOTIFY_USER_REGISTER_API']
# # NOTIFY_USER_LOGIN_API = os.environ['NOTIFY_USER_LOGIN_API']
# # NOTIFY_USER_ALLURLS_API = os.environ['NOTIFY_USER_ALLURLS_API']
# # NOTIFY_USER_SHORTURLS_API = os.environ['NOTIFY_USER_SHORTURLS_API']
# SHORTURL_SERVER_URL = os.environ['SHORTURL_SERVER_URL']
# SHORTURL_SERVER_URL_API = os.environ['SHORTURL_SERVER_URL_API']
# REPORT_SERVER_URL = os.environ['REPORT_SERVER_URL']
# REPORT_SERVER_REPORT_API = os.environ['REPORT_SERVER_REPORT_API']
# UI_SERVER_PORT = int(os.environ['UI_SERVER_PORT'])


# @app.route('/metrics')
# def metrics():
#     resp = generate_latest()
#     return resp, 200, {'Content-Type': CONTENT_TYPE_LATEST}


# # Define Prometheus metrics
# REQUEST_COUNT = Counter('uiapp_requests_total', 'Total HTTP Requests', ['method', 'endpoint', 'http_status'])
# REQUEST_LATENCY = Summary('uiapp_request_latency_seconds', 'Request latency in seconds', ['endpoint'])
# IN_PROGRESS = Gauge('uiapp_inprogress_requests', 'In-progress requests in Flask app')
# REQUEST_FAILURES = Counter('uiapp_failures_total', 'HTTP request failures', ['endpoint', 'reason'])


# def instrument_endpoint(func):
#     """Decorator to instrument endpoint usage and timing."""
#     @wraps(func)
#     def wrapper(*args, **kwargs):
#         endpoint = request.path
#         IN_PROGRESS.inc()
#         start_time = time.time()
#         status_code = 500  # Default status code in case of early exception
#         try:
#             response = func(*args, **kwargs)
#             status_code = response.status_code if hasattr(response, 'status_code') else 200
#         except Exception as e:
#             REQUEST_FAILURES.labels(endpoint=endpoint, reason=type(e).__name__).inc()
#             IN_PROGRESS.dec()
#             raise
#         finally:
#             latency = time.time() - start_time
#             REQUEST_LATENCY.labels(endpoint=endpoint).observe(latency)
#             REQUEST_COUNT.labels(method=request.method, endpoint=endpoint, http_status=status_code).inc()
#             if status_code >= 400:
#                 REQUEST_FAILURES.labels(endpoint=endpoint, reason=f'HTTP_{status_code}').inc()
#             IN_PROGRESS.dec()
#         return response
#     return wrapper


# def token_required(func):
#     @wraps(func)
#     def decorated(*args, **kwargs):
#         token = request.cookies.get('session')
#         if not token:
#             return jsonify({'Alert!': 'Token is missing!'}), 401
#         try:
#             username_session_data = session.get('username')
#             password_session_data = session.get('password')
#         except KeyError:  # Fix exception handling here; catch KeyError instead of string
#             return jsonify({'Alert!': 'Session Cookie is missing!'}), 401
#         try:
#             account = requests.get(
#                 f"{AUTH_SERVER_URL}{AUTH_SERVER_LOGIN_API}",
#                 json={
#                     "username": username_session_data,
#                     "password": password_session_data
#                 }
#             )
#             if account.status_code != 200 and account.status_code != 500:
#                 return jsonify({'Message': 'Invalid token'}), 403
#             if account.status_code == 500:
#                 return render_template("internal_server_error.html", msg=account.content)
#         except:
#             return jsonify({'Message': 'Invalid token'}), 403
#         return func(*args, **kwargs)
#     return decorated


# @app.route("/", methods=["GET", "POST"])
# @instrument_endpoint
# def index():
#     shortened_url = None
#     if request.method == "POST":
#         long_url = request.form['long_url']
#         parameters = {
#             "long_url": long_url
#         }
#         returnResponse = requests.post(
#             f"{SHORTURL_SERVER_URL}{SHORTURL_SERVER_URL_API}",
#             parameters
#         )
#         short_url = returnResponse.json().get("short_url")
#         shortened_url = f"http://{SHORTURL_GENERATED_URL}/r/{short_url}"
#         return render_template(
#             "short_url.html",
#             shortened_url=shortened_url
#         )
#     return render_template(
#         "index.html",
#         shortened_url=shortened_url
#     )


# @app.route('/signup', methods=["GET", "POST"])
# @instrument_endpoint
# def register():
#     if request.method == "POST":
#         email = request.form.get("email", "")
#         password = request.form.get("password", "")
#         username = request.form.get("username", "")
#         if email == '' or password == '' or username == '':
#             return render_template(
#                 'register.html',
#                 msg="Provide all parameters to register"
#             ), 200
#         else:
#             account = requests.post(
#                 f"{AUTH_SERVER_URL}{AUTH_SERVER_REGISTER_API}",
#                 json={
#                     "email": email,
#                     "password": password,
#                     "username": username
#                 }
#             )
#             if account.status_code == 200:
#                 print("notifyapi")
#                 # notify_register = requests.post(...)
#             elif account.status_code == 500 and account.json().get("msg") == "user exists":
#                 return render_template(
#                     "signup.html",
#                     msg="User already registered"
#                 )
#             else:
#                 return render_template("internal_server_error.html")
#         return redirect(url_for("login"))
#     return render_template("signup.html")


# @app.route("/login", methods=["GET", "POST"])
# @instrument_endpoint
# def login():
#     if request.method == "POST":
#         username = request.form.get('username')
#         password = request.form.get('password')
#         account = requests.get(
#             f"{AUTH_SERVER_URL}{AUTH_SERVER_LOGIN_API}",
#             json={
#                 "username": username,
#                 "password": password
#             }
#         )
#         userDataVar = account.json()
#         if account.status_code == 200:
#             session['loggedin'] = True
#             session['username'] = userDataVar.get('username')
#             session['password'] = userDataVar.get('password')
#             session['email'] = userDataVar.get('email')
#             # notify_email = userDataVar['email']
#             # notify_login = requests.post(...)
#             return render_template("home.html")
#         else:
#             emailReqVar = requests.get(
#                 f"{AUTH_SERVER_URL}{AUTH_SERVER_USER_API}",
#                 json={
#                     "username": username
#                 }
#             )
#             if emailReqVar.status_code != 200 and emailReqVar.status_code != 500:
#                 return render_template(
#                     'login.html',
#                     msg="username does not exist !!"
#                 ), 302
#             if emailReqVar.status_code != 200 and emailReqVar.status_code == 500:
#                 return render_template("internal_server_error.html")
#             return render_template(
#                 'login.html',
#                 msg="username & Password does not match !!"
#             ), 302
#     return render_template("login.html")


# @app.route("/home")
# @token_required
# @instrument_endpoint
# def home():
#     return render_template("home.html")


# @app.route("/short", methods=["GET", "POST"])
# @token_required
# @instrument_endpoint
# def short():
#     shortened_url = None
#     if request.method == "POST":
#         users_email = session.get("email")
#         long_url = request.form.get('long_url')
#         parameters = {
#             "long_url": long_url,
#             "users_email": users_email
#         }
#         headers = {
#             'Content-Type': 'application/json'
#         }
#         returnResponse = requests.post(
#             f"{SHORTURL_SERVER_URL}{SHORTURL_SERVER_URL_API}",
#             parameters
#         )
#         short_url = returnResponse.json().get("short_url")
#         shortened_url = f"http://{SHORTURL_GENERATED_URL}/r/{short_url}"
#         return render_template(
#             "short_url.html",
#             shortened_url=shortened_url
#         )
#     return render_template(
#         "short.html",
#         shortened_url=shortened_url
#     )


# @app.route("/logout")
# @instrument_endpoint
# def logout():
#     session.clear()
#     return redirect(url_for("index"))


# @app.route("/report", methods=["GET", "POST"])
# @token_required
# @instrument_endpoint
# def report():
#     users_email = session.get("email")
#     response = requests.get(
#         f'{REPORT_SERVER_URL}{REPORT_SERVER_REPORT_API}',
#         json={
#             'email': users_email
#         }
#     )
#     if response.status_code == 200:
#         data = response.json()
#         return render_template(
#             "report.html",
#             data=data
#         )
#     elif response.status_code == 500:
#         return render_template("internal_server_error.html")
#     else:
#         error_message = f"Error fetching data: {response.json().get('error')}"
#         return render_template("report.html", error=error_message)


# @app.route('/health', methods=['GET'])
# def health_check():
#     return jsonify({"status": "ok"}), 200


# if __name__ == "__main__":
#     app.run(debug=True, host='0.0.0.0', port=UI_SERVER_PORT)


import random
import string
import requests
import json
from flask import Flask, render_template, redirect, request, url_for, session, jsonify
from prometheus_client import Counter, Summary, Gauge, generate_latest, CONTENT_TYPE_LATEST
from functools import wraps
import os
import time

# --- OpenTelemetry Tracing Imports ---
from opentelemetry import trace
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace.export import BatchSpanProcessor
import logging

# --- OpenTelemetry Tracing Setup ---
resource = Resource(attributes={SERVICE_NAME: "ui-service"})
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
    # This logs trace and span IDs for correlation
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

# --- Environment Variables and Config ---
SHORTURL_GENERATED_URL = os.environ['SHORTURL_GENERATED_URL']
app.secret_key = os.environ['SESSION_SECRET_KEY']
AUTH_SERVER_URL = os.environ['AUTH_SERVER_URL']
AUTH_SERVER_LOGIN_API = os.environ['AUTH_SERVER_LOGIN_API']
AUTH_SERVER_USER_API = os.environ['AUTH_SERVER_USER_API']
AUTH_SERVER_REGISTER_API = os.environ['AUTH_SERVER_REGISTER_API']
SHORTURL_SERVER_URL = os.environ['SHORTURL_SERVER_URL']
SHORTURL_SERVER_URL_API = os.environ['SHORTURL_SERVER_URL_API']
REPORT_SERVER_URL = os.environ['REPORT_SERVER_URL']
REPORT_SERVER_REPORT_API = os.environ['REPORT_SERVER_REPORT_API']
UI_SERVER_PORT = int(os.environ['UI_SERVER_PORT'])

# --- Prometheus Metrics Definitions ---
REQUEST_COUNT = Counter('uiapp_requests_total', 'Total HTTP Requests', ['method', 'endpoint', 'http_status'])
REQUEST_LATENCY = Summary('uiapp_request_latency_seconds', 'Request latency in seconds', ['endpoint'])
IN_PROGRESS = Gauge('uiapp_inprogress_requests', 'In-progress requests in Flask app')
REQUEST_FAILURES = Counter('uiapp_failures_total', 'HTTP request failures', ['endpoint', 'reason'])

def instrument_endpoint(func):
    """Decorator to instrument endpoint usage and timing."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        endpoint = request.path
        IN_PROGRESS.inc()
        start_time = time.time()
        status_code = 500  # Default status code in case of early exception
        try:
            response = func(*args, **kwargs)
            status_code = response.status_code if hasattr(response, 'status_code') else 200
        except Exception as e:
            REQUEST_FAILURES.labels(endpoint=endpoint, reason=type(e).__name__).inc()
            IN_PROGRESS.dec()
            raise
        finally:
            latency = time.time() - start_time
            REQUEST_LATENCY.labels(endpoint=endpoint).observe(latency)
            REQUEST_COUNT.labels(method=request.method, endpoint=endpoint, http_status=status_code).inc()
            if status_code >= 400:
                REQUEST_FAILURES.labels(endpoint=endpoint, reason=f'HTTP_{status_code}').inc()
            IN_PROGRESS.dec()
        return response
    return wrapper

def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = request.cookies.get('session')
        if not token:
            return jsonify({'Alert!': 'Token is missing!'}), 401
        try:
            username_session_data = session.get('username')
            password_session_data = session.get('password')
        except KeyError:
            return jsonify({'Alert!': 'Session Cookie is missing!'}), 401
        try:
            account = requests.get(
                f"{AUTH_SERVER_URL}{AUTH_SERVER_LOGIN_API}",
                json={
                    "username": username_session_data,
                    "password": password_session_data
                }
            )
            if account.status_code != 200 and account.status_code != 500:
                return jsonify({'Message': 'Invalid token'}), 403
            if account.status_code == 500:
                return render_template("internal_server_error.html", msg=account.content)
        except:
            return jsonify({'Message': 'Invalid token'}), 403
        return func(*args, **kwargs)
    return decorated

@app.route('/metrics')
def metrics():
    with tracer.start_as_current_span("metrics"):
        resp = generate_latest()
        return resp, 200, {'Content-Type': CONTENT_TYPE_LATEST}

@app.route("/", methods=["GET", "POST"])
@instrument_endpoint
def index():
    with tracer.start_as_current_span("index"):
        shortened_url = None
        if request.method == "POST":
            long_url = request.form['long_url']
            parameters = {"long_url": long_url}
            returnResponse = requests.post(
                f"{SHORTURL_SERVER_URL}{SHORTURL_SERVER_URL_API}",
                parameters
            )
            short_url = returnResponse.json().get("short_url")
            shortened_url = f"http://{SHORTURL_GENERATED_URL}/r/{short_url}"
            log_trace_metadata("Short URL generated")
            return render_template("short_url.html", shortened_url=shortened_url)
        return render_template("index.html", shortened_url=shortened_url)

@app.route('/signup', methods=["GET", "POST"])
@instrument_endpoint
def register():
    with tracer.start_as_current_span("signup"):
        if request.method == "POST":
            email = request.form.get("email", "")
            password = request.form.get("password", "")
            username = request.form.get("username", "")
            if email == '' or password == '' or username == '':
                return render_template(
                    'register.html',
                    msg="Provide all parameters to register"
                ), 200
            else:
                account = requests.post(
                    f"{AUTH_SERVER_URL}{AUTH_SERVER_REGISTER_API}",
                    json={
                        "email": email,
                        "password": password,
                        "username": username
                    }
                )
                if account.status_code == 200:
                    log_trace_metadata("User registered successfully")
                elif account.status_code == 500 and account.json().get("msg") == "user exists":
                    log_trace_metadata("User already exists")
                    return render_template(
                        "signup.html",
                        msg="User already registered"
                    )
                else:
                    log_trace_metadata("Registration error")
                    return render_template("internal_server_error.html")
            return redirect(url_for("login"))
        return render_template("signup.html")

@app.route("/login", methods=["GET", "POST"])
@instrument_endpoint
def login():
    with tracer.start_as_current_span("login"):
        if request.method == "POST":
            username = request.form.get('username')
            password = request.form.get('password')
            account = requests.get(
                f"{AUTH_SERVER_URL}{AUTH_SERVER_LOGIN_API}",
                json={
                    "username": username,
                    "password": password
                }
            )
            userDataVar = account.json()
            if account.status_code == 200:
                session['loggedin'] = True
                session['username'] = userDataVar.get('username')
                session['password'] = userDataVar.get('password')
                session['email'] = userDataVar.get('email')
                log_trace_metadata("User logged in successfully")
                return render_template("home.html")
            else:
                emailReqVar = requests.get(
                    f"{AUTH_SERVER_URL}{AUTH_SERVER_USER_API}",
                    json={
                        "username": username
                    }
                )
                if emailReqVar.status_code != 200 and emailReqVar.status_code != 500:
                    log_trace_metadata("Username does not exist")
                    return render_template(
                        'login.html',
                        msg="username does not exist !!"
                    ), 302
                if emailReqVar.status_code != 200 and emailReqVar.status_code == 500:
                    log_trace_metadata("Internal server error during login")
                    return render_template("internal_server_error.html")
                log_trace_metadata("Username & Password mismatch")
                return render_template(
                    'login.html',
                    msg="username & Password does not match !!"
                ), 302
        return render_template("login.html")

@app.route("/home")
@token_required
@instrument_endpoint
def home():
    with tracer.start_as_current_span("home"):
        return render_template("home.html")

@app.route("/short", methods=["GET", "POST"])
@token_required
@instrument_endpoint
def short():
    with tracer.start_as_current_span("shorten_url"):
        shortened_url = None
        if request.method == "POST":
            users_email = session.get("email")
            long_url = request.form.get('long_url')
            parameters = {
                "long_url": long_url,
                "users_email": users_email
            }
            headers = {
                'Content-Type': 'application/json'
            }
            returnResponse = requests.post(
                f"{SHORTURL_SERVER_URL}{SHORTURL_SERVER_URL_API}",
                parameters
            )
            short_url = returnResponse.json().get("short_url")
            shortened_url = f"http://{SHORTURL_GENERATED_URL}/r/{short_url}"
            log_trace_metadata("Short URL generated for logged-in user")
            return render_template(
                "short_url.html",
                shortened_url=shortened_url
            )
        return render_template(
            "short.html",
            shortened_url=shortened_url
        )

@app.route("/logout")
@instrument_endpoint
def logout():
    with tracer.start_as_current_span("logout"):
        session.clear()
        log_trace_metadata("User logged out")
        return redirect(url_for("index"))

@app.route("/report", methods=["GET", "POST"])
@token_required
@instrument_endpoint
def report():
    with tracer.start_as_current_span("report"):
        users_email = session.get("email")
        response = requests.get(
            f'{REPORT_SERVER_URL}{REPORT_SERVER_REPORT_API}',
            json={
                'email': users_email
            }
        )
        if response.status_code == 200:
            data = response.json()
            log_trace_metadata("Report data returned successfully")
            return render_template(
                "report.html",
                data=data
            )
        elif response.status_code == 500:
            log_trace_metadata("Internal server error in report")
            return render_template("internal_server_error.html")
        else:
            error_message = f"Error fetching data: {response.json().get('error')}"
            log_trace_metadata(error_message)
            return render_template("report.html", error=error_message)

@app.route('/health', methods=['GET'])
def health_check():
    with tracer.start_as_current_span("health_check"):
        return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=UI_SERVER_PORT)
