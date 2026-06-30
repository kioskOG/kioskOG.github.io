---
title: MLOps Step 1 Building a Dataset Pipeline
layout: doc-page
parent: ML | Jatin Sharma
nav_order: 1
permalink: /docs/ml/building-a-dataset-pipeline/
description: Exploring the first step in MLOps - Building a dataset pipeline for training
  machine learning models.
type: concept
tags:
- ml
timestamp: '2026-06-30T11:56:08Z'
---

## 🏗️ Why Are We Building a Model from Scratch?

You might be wondering, if MLOps is about operations, why are we learning how to build a model?
That's a fair question. Let me explain this with a DevOps example.

A DevOps engineer does not write the Java application. But understanding how the application is built, how it is configured, how dependencies work, how the build process runs makes a DevOps engineer effective in the real world CI/CD setup.

We are going to apply the same thinking to MLOps. You do not need to become a data engineer or a data scientist. But you need to understand the core workflow on how data flows in, how a model gets trained, what the output looks like. This way, when you are setting up pipelines, deploying models, or debugging failures, you actually know what is going on under the hood.

> **Disclaimer:** The main goal of this series is to understand the infrastructure side of MLOps. The model example used here is only for learning and demo purposes.

---

## 🤖 About the Model

In this series, we will follow the full journey of a machine learning project:
- From a local prototype
- To a production-grade deployment

**Use Case:** Employee Attrition Prediction for a large organization with 500,000 employees.

**Problem Statement:** Employee attrition is a common HR challenge. Organizations want to identify employees who are likely to leave before they actually leave. If you can spot the risk early, you can take action. Maybe it is workload, maybe it is compensation, maybe it is a lack of growth opportunities.

Because we already know the outcome for past employees (stayed vs. left), this is a supervised learning problem. The model learns patterns from historical data and uses those patterns to predict risk for current employees.

---

## 📊 Why Data Comes First

Before we train any ML model, the first thing we need is data. Everything else like training, tuning and deployment depends on this.

For our Employee Attrition model example, the company has a record of 5 lakh employees for the past 20 years.

The data does not come from a single team or a single system. It is spread across multiple platforms and formats.

---

## 🗄️ Data Sources: Where the Data Lives

For an employee attrition model, data typically needs to be pulled from various enterprise systems. The data from these systems will be in different formats. For example, DOCS, SQL databases, XML exports, CSV dumps, JSON APIs, and more.

This is the core problem we need to solve. We need to unify the data from different systems into a single, clean dataset.

---

## 🛡️ PII Handling & Compliance

Before we even think about training a model, we must talk about compliance.
If the data contains employees personal information (PII) like names, email addresses, or phone numbers, we cannot use it as is.

So here is what typically happens (it is mandatory):
- **PII removal:** Personal identifiers (names, emails, etc.) are removed and replaced with anonymized employee IDs.
- **Sensitive field masking:** Fields like salary bands or health information are masked or aggregated to prevent re-identification.
- **Compliance:** The pipeline must ensure GDPR and DPDP Act compliance throughout the process.

> 💡 **Key Insight:** This is typically a shared responsibility between the Data Engineering team and the InfoSec/Compliance team. Tools like [Microsoft Presidio](https://microsoft.github.io/presidio/) are used to automatically detect and mask PII in the data.

---

## 🔄 The Dataset Pipeline (ETL)

When you work with large amounts of data, it is not possible to handle everything manually.
So, once the data sources and compliance rules are clear, the Data Engineering team builds a dataset pipeline. This pipeline is commonly called ETL, which stands for Extract, Transform, and Load.

Here is what each step means:
- **Extract:** Pull raw data from HRMS, payroll APIs, LMS databases, and performance review tools using connectors.
- **Transform:** Clean the data, join it from multiple sources, and convert it into a common format. Data scientists decide which fields are needed and how the data should be aggregated.
- **Load:** Store the final processed dataset as a single file (such as CSV) or load it into a data warehouse (e.g., AWS S3) so it can be used for machine learning later.

The ETL process involves orchestrating multiple tools: connectors, validators, transformation engines, PII scanners to perform the required data operations.

---

## 🛠️ Tools Used For the ETL Pipeline

The following are the commonly used tools to build this kind of dataset pipeline:
1. **Apache Airflow (Orchestration):** It schedules and coordinates all pipeline tasks as a DAG (Directed Acyclic Graph).
2. **Airbyte (Data Extraction):** It has pre-built connectors to pull data from HRMS, payroll, LMS, and other systems. No custom API code needed.
3. **Apache Spark (Data Validation):** Defines and runs quality checks. It catches missing values, duplicates, schema mismatches, and data drift.
4. **Microsoft Presidio (PII Detection & Masking):** It automatically detects and masks personal information (names, emails, phone numbers) to ensure compliance.

Each tool does one job well, and Airflow coordinates everything.

---

## ⚙️ Example: Airflow DAG Tasks

In Airflow, each step runs as a task in a DAG.
Each task is a step that runs in sequence (Like a CI/CD pipeline).

Each task in Airflow is independent and observable. Meaning if task 3 (validation) fails, you know exactly where the problem is, and Task 4 won’t execute.

> 💡 **For DevOps engineers:** Airflow DAGs are Python code. They live in Git, go through code review, and can be deployed via CI/CD just like any other infrastructure-as-code. In production, Airflow itself typically runs on Kubernetes.

---

## 📉 Data Size: From Raw to Final CSV

Let’s talk about data size. One of the most common questions is, how big is the data at each stage?

> 💡 **Key Insight:** The data goes from nearly a terabyte down to ~300 MB. This huge reduction happens because you are going from raw, duplicated, multi-format data to a clean, deduplicated, single-schema dataset with only the features that matter for prediction.

---

## 👥 Who Does What?

Building the dataset pipeline is a collaborative effort between multiple teams:
1. **Data Engineering:** Builds the ETL pipeline with connectors to HRMS, payroll APIs, and databases. Orchestrates with Airflow, transforms with Spark.
2. **Data Scientists:** Define which fields to keep and how to aggregate them. Specify feature engineering logic (e.g., “average last 3 performance ratings” vs. “latest only”).
3. **InfoSec / Compliance:** Ensure PII is properly masked, data handling meets GDPR/DPDP Act requirements, and audit trails are maintained.
4. **Platform / DevOps:** Provision infrastructure (Airflow servers, Spark clusters, S3 buckets), manage CI/CD for pipeline code, and set up monitoring.

Here is what you would be responsible for as a DevOps/Platform engineer on this pipeline:
- Deploy and manage Airflow on Kubernetes (Helm chart + KubernetesExecutor)
- Provision and manage Spark clusters (EMR, Dataproc, or Spark on K8s)
- Set up S3 buckets with proper IAM policies, encryption, and lifecycle rules
- Build CI/CD pipelines to test and deploy DAG code changes
- Set up monitoring for Airflow task durations, failure rates, Spark job metrics via Prometheus/Grafana
- Manage secrets (database credentials, API keys) using Vault or AWS Secrets Manager
- Ensure pipeline logs are centralized (EFK stack or CloudWatch)

---

## 🎯 Summary

Building the dataset is the very first step in any MLOps workflow, and the most complex one.
In a real-world enterprise setup, you are not just loading a CSV file. You pull data from multiple systems, handle compliance requirements, transform different formats, validate data quality, and finally produce a clean dataset that data scientists can trust.

**Key points to remember:**
- Data comes from many systems and formats
- PII must be handled before any ML work
- ETL pipelines are critical and complex
- Raw data shrinks massively after processing
- Pipelines must be reproducible and monitored
