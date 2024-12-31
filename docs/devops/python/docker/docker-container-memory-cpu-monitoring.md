---
title: Docker Container Monitoring Script
layout: home
parent: python
nav_order: 1
permalink: /docs/devops/python/docker-container-memory-cpu-monitoring/
description: Docker Container's Monitoring Script
---

# Docker Container Monitoring Script

This Python script monitors Docker containers for resource usage (CPU and memory) and sends alert emails when usage exceeds the specified thresholds.

## Features

- Monitors all running Docker containers.
- Calculates CPU and memory usage for each container.
- Sends email alerts when CPU or memory usage exceeds defined thresholds.
- Easy to configure thresholds and email settings.

---

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Script](#script)
- [Usage](#usage)
- [Example Output](#example-output)
- [Troubleshooting](#troubleshooting)
---

## Prerequisites

1. **Python**: Install Python 3.x on your system.
2. **Docker**: Ensure Docker is installed and running. The script uses the Docker SDK for Python.
3. **Python Libraries**: Install the required libraries using `pip`:
```shell
pip3 install docker
```

## Configuration
1. ### SMTP Email Settings: Update the following variables in the script:

{: .note}
>    * `sender_email`: Your email address.
>    * `password`: Your email app password (set up an app-specific password [here](https://myaccount.google.com/u/1/apppasswords) for Gmail).
>    * `recipient_email`: Add recipient details as a list of dictionaries with name and email.

2. ### Resource Thresholds:

{: .note}
>    * Adjust `CPU_THRESHOLD` and `MEMORY_THRESHOLD` to set the percentage usage limits for alerts:
```shell
CPU_THRESHOLD = 10.0  # CPU usage threshold in percent
MEMORY_THRESHOLD = 10.0  # Memory usage threshold in percent
```

3. ### Environment Setup
#### Setting Up a Virtual Environment (Optional)
It's recommended to use a virtual environment for running the script. Here's how you can set it up:
```bash
python3 -m venv env
source env/bin/activate  # For Linux/Mac
env\Scripts\activate     # For Windows
```

## Script
```python
import docker
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import logging
import json

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

recipient_email = [
        {'name': 'abc', 'email': 'abc@gmail.com'}
    ]

sender_email = "abc@gmail.com"
password = "" # https://myaccount.google.com/u/1/apppasswords

host = "smtp.gmail.com"
port = 587

# Adjust the THRESHOLD as required.

CPU_THRESHOLD = 10.0  # in percent
MEMORY_THRESHOLD = 10.0  # in percent


# Initialize Docker client
docker_client = docker.from_env()


def monitor_containers():
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

                # Check thresholds and send alerts
                if cpu_usage > CPU_THRESHOLD:
                    send_email_alert(container.name, "CPU", cpu_usage)
                if memory_usage > MEMORY_THRESHOLD:
                    send_email_alert(container.name, "Memory", memory_usage)
            except KeyError as e:
                logging.warning(f"Container: {container.name} - Missing key in stats: {e}")
            except Exception as e:
                logging.error(f"Error monitoring container '{container.name}': {e}")
    except Exception as e:
        logging.error(f"Failed to monitor containers: {e}")


def send_email_alert(container_name, resource_type, usage):
    try:
        logging.info("Connecting to SMTP server...")
        with smtplib.SMTP(host=host, port=port) as smtp_server:
            smtp_server.starttls()
            smtp_server.login(user=sender_email, password=password)
            logging.info("TLS connection established")

            for recipient in recipient_email:
                message = MIMEMultipart('alternative')
                message['Subject'] = f"High {resource_type} Usage Alert: {container_name}"
                message['To'] = recipient['email']
                message['From'] = sender_email

                body = f"The container '{container_name}' is using {usage:.2f}% {resource_type}. Please investigate."
                email_template = f"""\
Greetings {recipient['name']},

{body}

Regards,
Monitoring System
"""
                mail_template = MIMEText(email_template, "plain")
                message.attach(mail_template)
                smtp_server.sendmail(to_addrs=recipient['email'], from_addr=sender_email, msg=message.as_string())
                logging.info(f"Email sent to {recipient['email']}")
    except smtplib.SMTPAuthenticationError as e:
        logging.error(f"Authentication failed. Check your username and password. {e}")
    except smtplib.SMTPConnectError as e:
        logging.error(f"Failed to connect to the SMTP server. Check your internet connection or server details. {e}")
    except smtplib.SMTPException as e:
        logging.error(f"An SMTP error occurred: {e}")
    except Exception as e:
        logging.error(f"Exception occurred: {e}")



if __name__ == "__main__":
    logging.info("Starting Docker container monitoring...")
    monitor_containers()
    logging.info("Monitoring complete.")
```


## Usage
1. **Run the Script:** Execute the script using Python:
```shell
python3 docker_monitor.py
```

2. **Email Alerts:**
* The script will send an email alert if any container exceeds the defined resource thresholds.

## Example Output
#### Log Output
```plaintext
2024-12-30 14:23:45 - INFO - Starting Docker container monitoring...
2024-12-30 14:23:46 - INFO - Container: nginx, CPU: 15.32%, Memory: 7.45%
2024-12-30 14:23:46 - INFO - Email sent to recipient@example.com
2024-12-30 14:23:46 - INFO - Monitoring complete.
```

## Email Example
**Subject:** High CPU Usage Alert: nginx
**Body:**

```plaintext
Greetings Jatin Sharma,

The container 'nginx' is using 15.32% CPU. Please investigate.

Regards,  
Monitoring System
```

## Troubleshooting
#### SMTP Authentication Error:
* Ensure the `sender_email` and `password` are correct.
* Use app-specific passwords for Gmail accounts.

#### Docker SDK Issues:

{: .warning}
> Don't save the python script as docker.py, because it will endup with `circular import error`.

* Verify that Docker is installed and running on your system.
* Check if your user has permission to interact with Docker. If not, run the script as a user with appropriate permissions or add your user to the Docker group:

```shell
sudo usermod -aG docker $USER
```

