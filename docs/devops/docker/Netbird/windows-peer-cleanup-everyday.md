---
title: Netbird Windows Peer Cleaner
layout: home
parent: Netbird Setup
nav_order: 1
grand_parent: Docker Projects
description: A simple tool to automate the cleanup of stale Windows peers from a Netbird VPN setup
author: Jatin Sharma
permalink: /docs/devops/docker/Netbird/windows-peer-cleanup-everyday/
---

# 🧹 Netbird Peer Cleaner

A simple tool to automate the cleanup of stale Windows peers from a Netbird VPN setup.

---

## 📁 Project Structure

```
netbird-peer-cleaner/
├── Dockerfile
├── docker-compose.yml
├── .env
└── main.py
└── requirements.txt
```

---

{: .note}
> I performed this setup via `root` user.

```bash
sudo -i
mkdir netbird-peer-cleaner
cd netbird-peer-cleaner
touch Dockerfile docker-compose.yml .env main.py requirements.txt

pwd
# /root/netbird-peer-cleaner
```

## `requirements.txt`

```txt
requests
colorama
```

## 🧠 `main.py`

```python
import requests
import os
import time
from colorama import Fore, init

init(autoreset=True)

API_URL = "https://<NETBIRD_DOMAIN>/api/peers"
TOKEN = os.getenv("NETBIRD_TOKEN")

if not TOKEN:
    raise ValueError(f"{Fore.RED}❌ NETBIRD_TOKEN environment variable not set.")

headers = {
    "Authorization": f"Token {TOKEN}",
    "Accept": "application/json",
}


def delete_peer_with_retry(peer_id, peer_name):
    delete_url = f"{API_URL}/{peer_id}"
    retries = 3  # Number of retries
    delay = 2  # Initial delay in seconds

    for attempt in range(retries):
        try:
            del_resp = requests.delete(delete_url, headers=headers)
            del_resp.raise_for_status()  # Raise for status codes >= 400

            if del_resp.status_code // 100 == 2:
                print(f"{Fore.RED}❌ Deleted Windows peer: {peer_name} ({peer_id})")
                return True  # Indicate success
            else:
                print(
                    f"{Fore.YELLOW}⚠️ Failed to delete peer: {peer_name} ({peer_id}), "
                    f"Status: {del_resp.status_code}"
                )
                return False # Indicate failure

        except requests.exceptions.RequestException as e:
            print(
                f"{Fore.YELLOW}⚠️ Error deleting peer: {peer_name} ({peer_id}), "
                f"attempt {attempt + 1}/{retries}: {e}"
            )
            if attempt < retries - 1:
                print(f"{Fore.BLUE}🔁 Retrying in {delay} seconds...")
                time.sleep(delay)  # Wait before retrying
                delay *= 2  # Exponential backoff (double the delay)
            else:
                print(f"{Fore.RED}❌ Max retries reached, failed to delete peer: {peer_name} ({peer_id})")
                return False # Indicate failure
    return False # Return False if all retries fail



response = requests.get(API_URL, headers=headers)
response.raise_for_status()
peers = response.json()

windows_peers = [peer for peer in peers if "windows" in peer.get("os", "").lower()]
print(f"🔍 Found {len(windows_peers)} Windows peers out of {len(peers)} total peers.")

deleted_count = 0
failed_count = 0
for peer in windows_peers:
    peer_id = peer.get("id")
    if peer_id:
        if delete_peer_with_retry(peer_id, peer['name']):
            deleted_count += 1
        else:
            failed_count += 1

print(f"✅ Cleanup of Windows peers complete. {deleted_count} deleted, {failed_count} failed.")
```

---

## 🐳 Dockerfile

```dockerfile
# Stage 1: Build
FROM python:3.12-slim as builder

WORKDIR /app

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

COPY main.py .

# Stage 2: Runtime
FROM python:3.12-slim

WORKDIR /app

# Copy only what’s needed: script and installed packages from builder
COPY --from=builder /root/.local /root/.local
COPY --from=builder /app/main.py .

# Set PATH to include user-installed packages
ENV PATH=/root/.local/bin:$PATH

CMD ["python", "main.py"]
```

---

## 🐙 Cron Job

```
0 1 * * * docker compose -f /root/netbird-peer-cleaner/docker-compose.yaml up --build --remove-orphans --abort-on-container-exit >> /var/log/netbird-cleaner.log 2>&1
```

Runs everyday at 1 AM , builds and executes the container, and logs output.

---

## 📄 .env

```
NETBIRD_TOKEN="<your_api_token_here>"
```

---

## 📦 docker-compose.yml

```yaml
services:
  netbird-cleaner:
    build: .
    env_file: .env
    container_name: netbird-peer-cleaner
```

---

## ✅ Summary

This automation:

* Fetches all peers from the Netbird VPN
* Filters Windows peers
* Deletes them with retry logic
* Can be run on a schedule via cron

Great for automated hygiene in your VPN setup. ✅
