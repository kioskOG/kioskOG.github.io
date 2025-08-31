FROM python:3.10-slim

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        libc-dev \
        libmariadb-dev-compat \
        pkg-config \
    && rm -rf /var/lib/apt/lists/*
# Set working directory
WORKDIR /app

# Copy requirements file and install dependencies
COPY ./requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files
COPY app.py requirements.txt /app/


ENV PYTHONUNBUFFERED=1
# Expose the port on which the Flask application will run
EXPOSE 5000

# Set the environment variable for the Flask app
ENV FLASK_APP=app.py

# Command to run the Flask application
# CMD ["flask", "run", "--host", "0.0.0.0", "--port", "5000"]
ENTRYPOINT ["python", "app.py"]

