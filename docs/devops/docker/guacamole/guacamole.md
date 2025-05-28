---
title: Apache Guacamole with HAProxy
layout: home
parent: Docker Projects
nav_order: 10
description: Apache Guacamole with HAProxy
author: Jatin Sharma
permalink: /docs/devops/docker/guacamole/
---

# Apache Guacamole with HAProxy - Secure Multi-Service Deployment using Docker Compose

This guide demonstrates how to deploy **Apache Guacamole**, **HAProxy**, and supporting services such as PostgreSQL and Guacamole Daemon (**guacd**) using Docker Compose. The deployment includes HTTPS support, multi-host routing via HAProxy, and Two-Factor Authentication (TOTP) for Guacamole.

---

## 🧱 Architecture Overview

```
                    ┌────────────┐
                    │   Client   │
                    └────┬───────┘
                         │ HTTPS (443)
                         ▼
                    ┌────────────┐
                    │  HAProxy   │
                    └────┬───────┘
                         ├────► Guacamole (HTTPS)
```

---

## 📦 Project Structure

```
haproxy/
├── certs/
│   ├── haproxy.crt
│   ├── haproxy.key
│   └── haproxy.pem
├── data/
├── drive/
├── haproxy.cfg
├── init/
│   └── initdb.sql
├── record/
├── docker-compose.yaml
└── README.md
```

---

## 🛠️ Step-by-Step Setup

### 1. 🔐 Generate SSL Certificate

```bash
mkdir haproxy
cd haproxy
mkdir -p certs
openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout certs/haproxy.key \
  -out certs/haproxy.crt \
  -days 365 \
  -subj "/CN=kioskog.example.com"

cat certs/haproxy.crt certs/haproxy.key > certs/haproxy.pem
```

### 2. 🧪 Prepare PostgreSQL Init Script

```bash
mkdir -p init
chmod -R +x ./init

docker run --rm guacamole/guacamole \
  /opt/guacamole/bin/initdb.sh --postgresql > ./init/initdb.sql

ls -la initdb.sql
```

---

## 📄 HAProxy Configuration (`haproxy.cfg`)

```bash
# Global Settings
global
  log stdout format raw daemon
  maxconn 2000
  daemon

defaults
  log     global
  mode    http
  option  httplog
  timeout http-request 10s
  timeout connect 5s
  timeout client 30s
  timeout server 30s

# Stats Interface
frontend stats
  bind *:8404
  stats enable
  stats uri /stats
  stats refresh 10s
  stats admin if LOCALHOST

# HTTP to HTTPS Redirect
frontend http_redirect
  bind *:80
  redirect scheme https code 301 if !{ ssl_fc }

# HTTPS Frontend
frontend https_front
  bind *:443 ssl crt /usr/local/etc/haproxy/certs/haproxy.pem

  acl is_guacamole_host hdr(host) -i guacamole.kioskog.example.com
  acl is_exact_root_path path_reg ^/$

  http-request redirect location /guacamole/ code 302 if is_guacamole_host is_exact_root_path

  use_backend guacamole if is_guacamole_host

backend guacamole
  balance roundrobin
  cookie SRVNAME_GUAC insert indirect nocache
  server guacamole 10.0.0.103:8080 check cookie guacamole
```

---

## 🐳 Docker Compose Setup (`docker-compose.yaml`)

> See full file in repository. Services include:

* `haproxy` for SSL termination and reverse proxying
* `guacamole` for remote desktop gateway
* `guacd` daemon for backend RDP/VNC/SSH
* `postgres` for user/session storage

Sample:

```yaml
version: '3.9'
services:
    haproxy:
        ports:
          - "80:80"
          - "8404:8404"
          - "443:443"
        image: haproxytech/haproxy-alpine
        volumes:
          - "${PWD}/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro"
          - "./certs:/usr/local/etc/haproxy/certs:ro"
        container_name: haproxy
        cap_add:
          - NET_ADMIN
        networks:
          haproxy:
            ipv4_address: 10.0.0.155
        entrypoint: ["haproxy", "-db", "-f", "/usr/local/etc/haproxy/haproxy.cfg"]
        depends_on:
          - guacamole

    guacd:
      container_name: guacd_compose
      image: guacamole/guacd
      networks:
        haproxy:
          ipv4_address: 10.0.0.105
      restart: always
      volumes:
      - ./drive:/drive:rw
      - ./record:/record:rw
    # postgres
    postgres:
      container_name: postgres_guacamole_compose
      environment:
        PGDATA: /var/lib/postgresql/data/guacamole
        POSTGRES_DB: guacamole_db
        POSTGRES_PASSWORD: 'ChooseYourOwnPasswordHere1234'
        POSTGRES_USER: guacamole_user
      image: postgres:15.2-alpine
      networks:
        haproxy:
          ipv4_address: 10.0.0.104
      restart: always
      volumes:
      - ./init:/docker-entrypoint-initdb.d:z
      - ./data:/var/lib/postgresql/data:Z

    # guacamole
    guacamole:
      container_name: guacamole_compose
      group_add:
        - "1000"
      depends_on:
      - guacd
      - postgres
      environment:
        GUACD_HOSTNAME: guacd
        POSTGRES_DATABASE: guacamole_db
        POSTGRES_HOSTNAME: postgres
        POSTGRES_PASSWORD: 'ChooseYourOwnPasswordHere1234'
        POSTGRES_USER: guacamole_user
        RECORDING_SEARCH_PATH: /record
        TOTP_ENABLED: 'true'
        TOTP_ISSUER: 'Apache Guacamole'
        TOTP_DIGITS: 6
        TOTP_PERIOD: 30
        TOTP_MODE: sha1
      image: guacamole/guacamole
      networks:
        haproxy:
          ipv4_address: 10.0.0.103
      volumes:
        - ./record:/record:rw
      ports:
      - 8080/tcp # Guacamole runs at :8080/guacamole
      restart: always
    
networks:
  haproxy:
   driver: bridge
   #specify the driver
   ipam:
    config :
       - subnet: 10.0.0.0/24
         gateway: 10.0.0.1
```

---

### 3. 🚀 Launch All Services

```bash
docker compose up --build -d
```

### 4. 📜 View Logs

```bash
docker compose logs haproxy -f
docker compose logs guacamole -f
```

---

## 🔐 Guacamole with TOTP (2FA)

Guacamole is configured with TOTP enabled using environment variables:

```yaml
environment:
  TOTP_ENABLED: 'true'
  TOTP_ISSUER: 'Apache Guacamole'
  TOTP_DIGITS: 6
  TOTP_PERIOD: 30
  TOTP_MODE: sha1
```

> The TOTP extension `.jar` is placed inside `/home/guacamole/.guacamole/extensions/`.

---

## ✅ Accessing Services

* Guacamole: `https://guacamole.kioskog.example.com/guacamole/`
* HAProxy stats: `http://guacamole.kioskog.example.com:8404/stats`


{: .important}
> The `database initialization scripts` will have created a `default administrative` user called **guacadmin** with the password **guacadmin**. You should log in and change your password immediately.
---

## 🧹 Clean Up

```bash
docker compose down -v
```

---

## 📘 Notes

* The SSL certificate here is self-signed. Use Let's Encrypt or real certs in production.
* Consider volume persistence for production DB/data durability.
* You can add more frontends/backends in HAProxy as your services grow.

---

## 📎 References

* [Guacamole Documentation](https://guacamole.apache.org/doc/gug/)
* [HAProxy Configuration Manual](https://cbonte.github.io/haproxy-dconv/)
* [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)

---

Happy hacking! 💻🚀
