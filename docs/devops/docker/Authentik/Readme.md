---
title: Authentik Setup
layout: home
parent: Docker Projects
nav_order: 5
description: A setup guide for Authentik
author: Jatin Sharma
permalink: /docs/devops/docker/Authentik/
---

# 🚀 **Authentik Deployment Guide**

---

## 🎯 **Objective**
Take control of your authentication and authorization needs by deploying **Authentik**, an open-source identity provider. This self-hosted solution prioritizes security and removes the need to rely on third-party services.

---

## 📋 **Prerequisites**
- **Docker** and **Docker Compose** installed (**Compose v2 recommended**). Upgrade instructions can be found [here](https://docs.docker.com/compose/migrate/).
- A host with **at least 2 CPU cores** and **2 GB of RAM**.
- Basic understanding of Docker commands.

---

## ⚙️ **Setup Instructions**


### 1️⃣ Create Working Directory and Generate Secrets
```shell
mkdir Authentik
cd Authentik
wget https://goauthentik.io/docker-compose.yml
echo "PG_PASS=$(openssl rand -base64 36 | tr -d '\n')" >> .env
echo "AUTHENTIK_SECRET_KEY=$(openssl rand -base64 60 | tr -d '\n')" >> .env
cat .env
echo "AUTHENTIK_ERROR_REPORTING__ENABLED=true" >> .env
cat .env
```

{: .warning }
> Because of a PostgreSQL limitation, only passwords up to 99 chars are supported. See: [postgres](https://www.postgresql.org/message-id/09512C4F-8CB9-4021-B455-EF4C4F0D55A0@amazon.com)


##  2️⃣ Configure for port 80/443

{: .warning }
> By default, authentik listens internally on port 9000 for HTTP and 9443 for HTTPS. To change the exposed ports to 80 and 443, you can set the following variables in `.env`:

```shell
COMPOSE_PORT_HTTP=80
COMPOSE_PORT_HTTPS=443
```


{: .warning }
> * Authentik uses UTC time for all internal processes. Displayed times in the UI are localized.
> * Avoid modifying or mounting /etc/timezone or /etc/localtime in Authentik containers. Doing so may cause issues with OAuth and SAML authentication.


## 3️⃣ Email configuration (optional but recommended)
```shell
To configure email credentials, append this block to your .env file
# SMTP Host Emails are sent to
AUTHENTIK_EMAIL__HOST=localhost
AUTHENTIK_EMAIL__PORT=25
# Optionally authenticate (don't add quotation marks to your password)
AUTHENTIK_EMAIL__USERNAME=
AUTHENTIK_EMAIL__PASSWORD=
# Use StartTLS
AUTHENTIK_EMAIL__USE_TLS=false
# Use SSL
AUTHENTIK_EMAIL__USE_SSL=false
AUTHENTIK_EMAIL__TIMEOUT=10
# Email address authentik will send from, should have a correct @domain
AUTHENTIK_EMAIL__FROM=authentik@localhost
```

### 4️⃣ docker-compose file.
---
```yaml
services:
  postgresql:
    image: docker.io/library/postgres:16-alpine
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -d $${POSTGRES_DB} -U $${POSTGRES_USER}"]
      start_period: 20s
      interval: 30s
      retries: 5
      timeout: 5s
    volumes:
      - database:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${PG_PASS:?database password required}
      POSTGRES_USER: ${PG_USER:-authentik}
      POSTGRES_DB: ${PG_DB:-authentik}
    env_file:
      - .env
  redis:
    image: docker.io/library/redis:alpine
    command: --save 60 1 --loglevel warning
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "redis-cli ping | grep PONG"]
      start_period: 20s
      interval: 30s
      retries: 5
      timeout: 3s
    volumes:
      - redis:/data
  server:
    image: ${AUTHENTIK_IMAGE:-ghcr.io/goauthentik/server}:${AUTHENTIK_TAG:-2024.8.3}
    restart: unless-stopped
    command: server
    environment:
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_POSTGRESQL__HOST: postgresql
      AUTHENTIK_POSTGRESQL__USER: ${PG_USER:-authentik}
      AUTHENTIK_POSTGRESQL__NAME: ${PG_DB:-authentik}
      AUTHENTIK_POSTGRESQL__PASSWORD: ${PG_PASS}
    volumes:
      - ./media:/media
      - ./custom-templates:/templates
    env_file:
      - .env
    ports:
      - "${COMPOSE_PORT_HTTP:-9000}:9000"
      - "${COMPOSE_PORT_HTTPS:-9443}:9443"
    depends_on:
      - postgresql
      - redis
  worker:
    image: ${AUTHENTIK_IMAGE:-ghcr.io/goauthentik/server}:${AUTHENTIK_TAG:-2024.8.3}
    restart: unless-stopped
    command: worker
    environment:
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_POSTGRESQL__HOST: postgresql
      AUTHENTIK_POSTGRESQL__USER: ${PG_USER:-authentik}
      AUTHENTIK_POSTGRESQL__NAME: ${PG_DB:-authentik}
      AUTHENTIK_POSTGRESQL__PASSWORD: ${PG_PASS}
    # `user: root` and the docker socket volume are optional.
    # See more for the docker socket integration here:
    # https://goauthentik.io/docs/outposts/integrations/docker
    # Removing `user: root` also prevents the worker from fixing the permissions
    # on the mounted folders, so when removing this make sure the folders have the correct UID/GID
    # (1000:1000 by default)
    user: root
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./media:/media
      - ./certs:/certs
      - ./custom-templates:/templates
    env_file:
      - .env
    depends_on:
      - postgresql
      - redis

volumes:
  database:
    driver: local
  redis:
    driver: local
```

### 5️⃣ Start docker compose
```shell
docker compose up -d
```

### ✨ This creates the following resources:

* ✅ Network: `authentik_default`
* ✅ Volumes: `authentik_redis`, `authentik_database`
* ✅ Containers: `authentik-redis-1`, `authentik-postgresql-1`, `authentik-server-1`, `authentik-worker-1`


## 🛠️ Initial Setup
### Navigate to the following URL to complete the setup: 
```shell
http://<your server's IP or hostname>:9000/if/flow/initial-setup/
```
* There you are prompted to set a password for the akadmin user (the default user). ✨


## 📚 References
[Authentik Official Documentation] (https://docs.goauthentik.io/docs/install-config/install/docker-compose)
[Install Kubernetes] (https://docs.goauthentik.io/docs/install-config/install/kubernetes)

[Configuration Overview] (https://docs.goauthentik.io/docs/install-config/configuration/)