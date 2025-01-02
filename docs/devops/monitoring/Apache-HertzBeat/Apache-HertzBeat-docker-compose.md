---
title: Install HertzBeat via Docker Compose
layout: home
parent: Apache HertzBeat Quickstart
grand_parent: monitoring
nav_order: 2
permalink: /docs/devops/monitoring/apache-hertzbeat/Apache-HertzBeat-docker-compose/
description: Documentation for HertzBeat setup via Docker Compose.
---


# Install HertzBeat via Docker Compose

This guide explains how to install and deploy HertzBeat using Docker Compose. It assumes that Docker and Docker Compose are already installed in your environment. If not, refer to the [Docker Compose official documentation](https://docs.docker.com/compose/install/) for installation instructions. Use the command `docker compose version` to confirm the Docker Compose environment is properly set up.

---

## Steps to Install HertzBeat via Docker Compose

## 1. Download the startup script package
Download the installation script package `apache-hertzbeat-xxx-incubating-docker-compose.tar.gz` from the [download](https://hertzbeat.apache.org/docs/download)

## 2. Choose Deployment: HertzBeat + PostgreSQL + VictoriaMetrics

{: .important}
> * `apache-hertzbeat-xxx-incubating-docker-compose.tar.gz` contains multiple deployment solutions after decompression. Here we recommend choosing the `hertzbeat-postgresql-victoria-metrics` solution.
>
> * Other deployment methods, please read the README.md file of each deployment solution in detail.
>
> * If using the MySQL solution, ensure you manually download and prepare the MySQL driver package.


## Steps to Deploy HertzBeat with PostgreSQL and VictoriaMetrics:

### 1. Unzip the Script Package

Extract the contents of the downloaded `.tar.gz` file:

```shell
tar zxvf apache-hertzbeat-1.6.0-incubating-docker-compose.tar.gz
```

### 2. Navigate to the Deployment Directory

Change to the directory for the **HertzBeat + PostgreSQL + VictoriaMetrics** deployment:

```shell
cd apache-hertzbeat-1.6.0-incubating-docker-compose    
cd hertzbeat-postgresql-victoria-metrics
```

### 3. One-click start

Run the following command to start the services:

```shell
docker-compose up -d
```

### 4. View service status

Check the status of each container to ensure they are running. Containers in the up state indicate successful deployment:

```shell
docker-compose ps
```

## 3. Start exploring HertzBeat 
Once all containers are running, access HertzBeat's web UI by navigating to the following URL in your browser:

```shell
```

* **Default Credentials:**
    * **Username**: `admin`
    * **Password**: `hertzbeat`

You can now start monitoring and using the powerful features of HertzBeat!

## Troubleshooting

**Common Issues:**
- **Docker Compose Not Installed**
    If `docker compose version` fails, install Docker Compose using the [official guide](https://docs.docker.com/compose/install/) .

- **Ports Already in Use**
If port `1157` is occupied, update the `docker-compose.yml` file to map to an available port on your host.

- **Containers Not Starting**
Use the `docker-compose logs` command to view logs and troubleshoot errors.


## Additional Resources
* [Official HertzBeat Documentation](https://hertzbeat.apache.org/docs/)
* [HertzBeat GitHub Repository](https://github.com/apache/hertzbeat)
* [HertzBeat Docker Hub](https://hub.docker.com/r/apache/hertzbeat)