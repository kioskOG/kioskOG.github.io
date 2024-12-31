---
title: Daily Docker Container Usage Summary Script
layout: home
parent: python
nav_order: 2
permalink: /docs/devops/python/docker-container-monitoring-script/
description: Send a daily summary email with the complete day's CPU and memory usage of all containers.
---

# Docker Container Daily Summary Script

This script monitors the CPU and memory usage of Docker containers and performs the following:

1. Logs resource usage statistics every 5 minutes.
2. Sends alert emails if any container exceeds predefined CPU or memory thresholds.
3. Generates a daily summary report with the average and maximum usage statistics for all containers and sends it via email.

---

## Features

- Monitor Docker container CPU and memory usage.
- Log container statistics into a CSV file.
- Send alert emails for threshold breaches.
- Generate and email a daily summary report.

---

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Script](#script)
- [Key Functions](#key-functions)
- [Main Execution](#main-execution)
- [Example Output](#example-output)
- [Daily Summary Email](#daily-summary-email)
- [Setting Up Cron Jobs](#setting-up-cron-jobs)
- [Troubleshooting](#troubleshooting)
- [Potential Enhancements](#potential-enhancements)
- [License](#license)
---

## Prerequisites

- Python 3.12
- Docker and Docker-Py library
- SMTP server credentials (e.g., Gmail app password)
- Cron configured for periodic execution

Install the required Python package:
```bash
pip3 install docker
```

---

## Configuration

1. **Recipient Emails**: Add recipient names and emails in the `recipient_email` list.
   ```python
   recipient_email = [
       {'name': 'abc', 'email': 'abc@gmail.com'}
   ]
   ```

2. **Sender Email Credentials**:
   - Use your email and app password for Gmail:
     ```python
     sender_email = "abc@gmail.com"
     password = "your_app_password"
     ```
   - Generate the app password [here](https://myaccount.google.com/apppasswords).

3. **Thresholds**: Adjust CPU and memory thresholds as needed:
   ```python
   CPU_THRESHOLD = 70.0  # in percent
   MEMORY_THRESHOLD = 70.0  # in percent
   ```

4. **Stats File Path**: Update the file path to store daily container statistics:
   ```python
   STATS_FILE = "/home/ubuntu/python/daily_container_stats.csv"
   ```

5. **SMTP Settings**: Update SMTP host and port if using a service other than Gmail:
   ```python
   host = "smtp.gmail.com"
   port = 587
   ```

---

## Script

```python
import docker
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import logging
import json
import os
import csv
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

recipient_email = [
        {'name': 'abc', 'email': 'abc@gmail.com'}
    ]

sender_email = "abc@gmail.com"
password = "" # https://myaccount.google.com/u/1/apppasswords

host = "smtp.gmail.com"
port = 587


# File to store daily container stats
STATS_FILE = "/home/ubuntu/python/daily_container_stats.csv"

# Adjust the THRESHOLD as required.
CPU_THRESHOLD = 70.0  # in percent
MEMORY_THRESHOLD = 70.0  # in percent


# Initialize Docker client
docker_client = docker.from_env()


# Function to initialize the CSV file for stats
def initialize_stats_file():
    try:
        if not os.path.exists(STATS_FILE):
            with open(file=STATS_FILE, mode="w", newline="") as file:
                writer = csv.writer(file)
                writer.writerow(["timestamp", "container_name", "cpu_usage", "memory_usage"])
            logging.info(f"Stats file created: {STATS_FILE}")
    except Exception as e:
        logging.error(f"Failed to initialize stats file: {e}")



# Function to send an alert email
def send_alert_email(container_name, resource_type, usage):
    """Send an alert email for resource threshold breaches."""
    try:
        logging.info(f"Sending alert email for {container_name} - {resource_type} usage: {usage:.2f}%")
        with smtplib.SMTP(host=host, port=port) as smtp_server:
            smtp_server.starttls()
            smtp_server.login(user=sender_email, password=password)

            for recipient in recipient_email:
                message = MIMEMultipart('alternative')
                message['Subject'] = f"Alert: {container_name} {resource_type} Usage Exceeded"
                message['To'] = recipient['email']
                message['From'] = sender_email

                body = f"The container '{container_name}' is using {usage:.2f}% {resource_type}. Please investigate."
                mail_template = MIMEText(body, "plain")
                message.attach(mail_template)
                smtp_server.sendmail(to_addrs=recipient['email'], from_addr=sender_email, msg=message.as_string())
                logging.info(f"Alert email sent to {recipient['email']}")
    except Exception as e:
        logging.error(f"Failed to send alert email: {e}")


# Function to monitor containers and log their stats
def monitor_containers():
    """Log the stats of all running containers and send alerts for threshold breaches."""
    try:
        for container in docker_client.containers.list():
            try:
                # Fetch container stats
                stats = container.stats(stream=False)

                # CPU usage calculation
                cpu_delta = stats["cpu_stats"]["cpu_usage"]["total_usage"] - stats["precpu_stats"]["cpu_usage"]["total_usage"]
                system_delta = stats["cpu_stats"]["system_cpu_usage"] - stats["precpu_stats"]["system_cpu_usage"]
                cpu_usage = (cpu_delta / system_delta) * 100 if system_delta > 0 else 0

                # Memory usage calculation
                memory_usage = stats["memory_stats"]["usage"] / stats["memory_stats"]["limit"] * 100

                logging.info(f"Container: {container.name}, CPU: {cpu_usage:.2f}%, Memory: {memory_usage:.2f}%")

                # Log stats to the file
                with open(file=STATS_FILE, mode="a", newline="") as file:
                    writer = csv.writer(file)
                    writer.writerow([datetime.now().isoformat(), container.name, cpu_usage, memory_usage])

                # Check thresholds and send alerts
                if cpu_usage > CPU_THRESHOLD:
                    send_alert_email(container.name, "CPU", cpu_usage)
                if memory_usage > MEMORY_THRESHOLD:
                    send_alert_email(container.name, "Memory", memory_usage)

            except KeyError as e:
                logging.warning(f"Container: {container.name} - Missing key in stats: {e}")
            except Exception as e:
                logging.error(f"Error monitoring container '{container.name}': {e}")
    except Exception as e:
        logging.error(f"Failed to monitor containers: {e}")


# Function to generate the daily summary report
def generate_daily_summary():
    """Generate a summary of daily stats from the CSV file."""
    summary = {}
    try:
        with open(file=STATS_FILE, mode="r") as file:
            reader = csv.DictReader(file)
            for row in reader:
                container_name = row["container_name"]
                cpu_usage = float(row["cpu_usage"])
                memory_usage = float(row["memory_usage"])

                if container_name not in summary:
                    summary[container_name] = {
                        "cpu_usages": [],
                        "memory_usages": []
                    }
                summary[container_name]["cpu_usages"].append(cpu_usage)
                summary[container_name]["memory_usages"].append(memory_usage)

        # Calculate averages and max values for each container
        report = "Daily Summary of Container Stats:\n\n"
        for container_name, stats in summary.items():
            avg_cpu = sum(stats["cpu_usages"]) / len(stats["cpu_usages"])
            max_cpu = max(stats["cpu_usages"])
            avg_memory = sum(stats["memory_usages"]) / len(stats["memory_usages"])
            max_memory = max(stats["memory_usages"])

            report += (
                f"Container: {container_name}\n"
                f"  Average CPU Usage: {avg_cpu:.2f}%\n"
                f"  Max CPU Usage: {max_cpu:.2f}%\n"
                f"  Average Memory Usage: {avg_memory:.2f}%\n"
                f"  Max Memory Usage: {max_memory:.2f}%\n\n"
            )
        return report
    except Exception as e:
        logging.error(f"Failed to generate daily summary: {e}")
        return None


# Function to send the daily summary email
def send_summary_email(report):
    """Send the daily summary email."""
    try:
        logging.info("Sending daily summary email...")
        with smtplib.SMTP(host=host, port=port) as smtp_server:
            smtp_server.starttls()
            smtp_server.login(user=sender_email, password=password)

            for recipient in recipient_email:
                message = MIMEMultipart('alternative')
                message['Subject'] = "Daily Summary of Docker Container Usage"
                message['To'] = recipient['email']
                message['From'] = sender_email

                email_template = f"""\
Greetings {recipient['name']},

{report}

Regards,
Monitoring System
"""
                mail_template = MIMEText(email_template, "plain")
                message.attach(mail_template)
                smtp_server.sendmail(to_addrs=recipient['email'], from_addr=sender_email, msg=message.as_string())
                logging.info(f"Daily summary email sent to {recipient['email']}")
                
                # Clear the stats file after sending the summary
                open(STATS_FILE, "w").close()
                logging.info("Cleared the stats file after sending the summary.")
    except Exception as e:
        logging.error(f"Failed to send daily summary email: {e}")


# Main execution
if __name__ == "__main__":
    initialize_stats_file()

    # Decide the mode of operation based on CLI arguments
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "--summary":
        report = generate_daily_summary()
        if report:
            send_summary_email(report)
    else:
        monitor_containers()

```

### Key Functions

- **`initialize_stats_file()`**: Creates a CSV file to store container stats if it doesn't already exist.
- **`monitor_containers()`**: Logs the CPU and memory usage of all running containers and sends alert emails for threshold breaches.
- **`generate_daily_summary()`**: Reads the CSV file and generates a summary of container stats for the day.
- **`send_alert_email()`**: Sends an alert email if a container exceeds CPU or memory thresholds.
- **`send_summary_email()`**: Sends a daily summary email with average and maximum usage statistics.

### Main Execution

The script operates in two modes:

1. **Monitoring Mode (default)**:
   Logs container stats and sends alerts for threshold breaches.

   ```shell
   python3 docker_monitor.py
   ```

2. **Daily Summary Mode**:
   Generates and sends the daily summary report.

   ```shell
   python3 docker_monitor.py --summary
   ```

---

## Example Output

### Terminal Output (Monitoring Mode)
```shell
python3 docker_monitor.py

2024-12-30 14:23:45 - INFO - Starting Docker container monitoring...
2024-12-30 14:23:46 - INFO - Container: nginx, CPU: 15.32%, Memory: 7.45%
2024-12-30 14:23:46 - INFO - Email sent to abc@gmail.com
```

### Daily Summary Email
```
Subject: Daily Summary of Docker Container Usage

Greetings abc,

Daily Summary of Container Stats:

Container: nginx
  Average CPU Usage: 10.25%
  Max CPU Usage: 30.50%
  Average Memory Usage: 12.10%
  Max Memory Usage: 40.75%

Regards,
Monitoring System
```

---

## Setting Up Cron Jobs

1. **Monitor Containers Every 5 Minutes**:
#### Collect container stats every 5 minutes store it into /home/ubuntu/python/daily_container_stats.csv file. If any container exceed the cpu, mem threshold, it will send the email as well.

   ```shell
   */5 * * * * python3 /home/ubuntu/python/docker_monitor.py
   ```

2. **Send Daily Summary Email at 11:59 PM**:
   ```shell
   59 23 * * * python3 /home/ubuntu/python/docker_monitor.py --summary
   ```
---

## Troubleshooting

1. **Email Delivery Issues**:
   - Ensure SMTP credentials are correct.
   - Verify the app password setup for Gmail.

2. **Docker Access**:
   - Ensure the script runs with a user that has permissions to access Docker.

3. **File Permissions**:
   - Ensure the CSV file path is writable by the script.

---

## Potential Enhancements

- Log stats to a database for long-term analysis.
- Add support for additional container metrics like network I/O and disk usage.
- Integrate with Slack or webhook-based notification systems.

---

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute it for personal or commercial purposes.
