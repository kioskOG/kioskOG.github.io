---
title: Traefik Setup
layout: home
parent: Docker Projects
nav_order: 2
description: A setup guide for Traefik with Docker and Nginx
author: Jatin Sharma
permalink: /docs/devops/docker/traefik/
---

# Traefik

```shell
mkdir Traefik
touch docker-compose.yaml
cd Traefik
mkdir config
cd config
touch traefik.yamk
```

```shell
vim docker-compose.yaml
```

```yaml
services:
  traefik:
    networks:
      - traefik
    container_name: traefik
    image: traefik:v3.1.5
    ports:
      - "8090:8000" # HTTP traffic
      - "8443:9000" # HTTPS traffic
      - "9090:8080" # Dashboard
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./config/traefik.yaml:/etc/traefik/traefik.yaml:ro
    restart: unless-stopped

  nginx:
    networks:
      - traefik
    container_name: nginx-demo-1
    image: nginx:latest
    labels:
      - traefik.enable=true
      # - traefik.http.routers.nginx-http.rule=Path(`/nginx`)
      - traefik.http.routers.nginx-http.rule=PathPrefix(`/`) # As we have used / means on nginx is lisiting on http://<host-ip>:8090/ . If we want /nginx we have to configure nginx for the same.
      - traefik.http.routers.nginx-http.entrypoints=web
    restart: unless-stopped
networks:
  traefik:
    external: true
```

```shell
vim config/traefik.yamk
```

```yaml
global:
  checkNewVersion: false
  sendAnonymousUsage: false

log:
  level: DEBUG

api:
  dashboard: true
  insecure: true

entryPoints:
  web:
    address: :8000 # Internal Traefik port for HTTP traffic
  websecure:
    address: :9000 # Internal Traefik port for HTTPS traffic

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
```

```shell
docker compose up -d
docker logs traefik
docker logs nginx
```

## Testing

- Access `http://<host-ip>:8090/` in your browser.
- If everything is configured correctly, you should see the default NGINX page.
