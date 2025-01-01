---
title: Apache HertzBeat Quickstart
layout: home
parent: monitoring
nav_order: 1
permalink: /docs/devops/monitoring/apache-hertzbeat/
description: Quickstart guide for Apache HertzBeat - an open-source real-time monitoring system.
---

# Apache HertzBeat Quickstart

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Built-in Monitoring Types](#built-in-monitoring-types)
- [Open Source and Extensible](#open-source-and-extensible)
- [Getting Started](#getting-started)
- [References](#references)

---

## 🎡 Introduction
Apache HertzBeat is a user-friendly, open-source, real-time monitoring system. It is agentless, highly performant, Prometheus-compatible, and designed to provide powerful custom monitoring and status page capabilities.

---

## Features
- **Comprehensive Monitoring**: Supports monitoring for web services, programs, databases, caches, operating systems, web servers, middleware, big data platforms, cloud-native environments, networks, and custom metrics.
- **Ease of Use**: Web-based, agentless, and requires zero learning curve with one-click monitoring and alerting.
- **Prometheus-Compatible**: Seamlessly integrates with the Prometheus ecosystem, enabling easy monitoring of resources via a web UI.
- **High Performance**: Features multi-collector clusters, multi-isolated network monitoring, and cloud-edge collaboration for horizontal scalability.
- **Flexible Alerts**: Provides customizable alarm thresholds and timely notifications through Discord, Slack, Telegram, Email, WeChat, Webhook, and SMS.

---

## Technology Highlights

{: .important}
HertzBeat leverages established protocols and standards to collect monitoring data:
- **SNMP**: For network switches and routers.
- **JMX**: For Java application monitoring.
- **JDBC**: For database information.
- **SSH**: For script-based data collection.
- **HTTP/JSONPath/Prometheus**: For API-based metric collection.
- **IPMI**: For server hardware monitoring.

By abstracting these protocols into configurable YAML templates, HertzBeat allows users to create custom templates for any desired metric.

![Apache HertzBeat Overview](/docs/devops/monitoring/Apache-HertzBeat/images/apache-heartz.png)

---

## Built-in Monitoring Types

HertzBeat supports monitoring for a wide variety of resources, including:

- **Web and API Monitoring**: Website, HTTP API, Ping, Port Telnet, SSL Certificate, and more.
- **Databases**: MySQL, PostgreSQL, MariaDB, Redis, ElasticSearch, MongoDB, Oracle, and ClickHouse.
- **Operating Systems**: Linux, Ubuntu, Windows, Red Hat, CentOS, Fedora CoreOS, and more.
- **Middleware and Services**: Tomcat, Zookeeper, RabbitMQ, Kafka, Hive, Spark, Hadoop, and Kubernetes.
- **Network Devices**: CiscoSwitch, HuaweiSwitch, HPE Switch, and TPLinkSwitch.
- **Custom Monitoring**: Create your own templates for specialized use cases.

For a complete list of supported resources, visit the [official documentation](https://hertzbeat.apache.org/docs/).

---

## Open Source and Extensible
- **Truly Open Source**: Maintained under the Apache 2.0 license with no limitations on monitoring capacity or types.
- **Modern Tech Stack**: Built using Java, SpringBoot, TypeScript, and Angular, making it highly adaptable for secondary development.
- **Community Recognized**: Featured in the CNCF Observability and Monitoring Landscape.

---

## Getting Started

Launch Apache HertzBeat using Docker with a single command:

```shell
docker run -d -p 1157:1157 -p 1158:1158 --name hertzbeat apache/hertzbeat
```

{: .note}
> Access `http://localhost:1157` default account username/password `admin/hertzbeat`

## Referance
[heartzbeat](https://hertzbeat.apache.org/docs/)