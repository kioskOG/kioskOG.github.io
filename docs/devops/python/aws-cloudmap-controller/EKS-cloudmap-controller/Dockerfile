# Stage 1: Build dependencies
FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

COPY controller /app/controller
COPY main.py /app/main.py

RUN pip install --upgrade pip \
    && pip install --no-cache-dir --target /app/.deps boto3==1.34.59 kubernetes==29.0.0

# Stage 2: Runtime
#FROM gcr.io/distroless/python3-debian11
FROM python:3.11-slim

WORKDIR /app

COPY --from=builder /app/controller /app/controller
COPY --from=builder /app/main.py /app/main.py
COPY --from=builder /app/.deps /app/.deps

ENV PYTHONPATH="/app/.deps"

CMD ["python", "main.py"]

