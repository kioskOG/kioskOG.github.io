---
title: Wazuh
layout: home
parent: Linux Projects
nav_order: 1
permalink: /docs/devops/Linux/SIEM-And-XDR/wazuh-introduction/
description: Documentation for configuring the Wazuh XDR and SIEM platform.
---

## 🚀 Wazuh: Unified XDR and SIEM Security Platform

Wazuh is a security platform that provides unified XDR and SIEM protection for endpoints and cloud workloads. The solution is composed of a single universal agent and three central components: 

- **Wazuh Server**  
- **Wazuh Indexer**  
- **Wazuh Dashboard**

Wazuh is **free and open source**, licensed under the GNU General Public License, version 2, and the Apache License, Version 2.0 (ALv2).

The Wazuh Indexer and Wazuh Server can be installed on either a **single host** or **distributed across multiple hosts**. This guide focuses on installing the central components on **separate hosts**.

---

## Architecture

The Wazuh architecture is based on **agents**, running on the monitored endpoints, that forward security data to a **central server**. Agentless devices such as firewalls, switches, routers, and access points are supported and can actively submit log data via Syslog, SSH, or using their API. The central server decodes and analyzes the incoming information and passes the results along to the Wazuh indexer for indexing and storage.


The Wazuh indexer cluster is a collection of one or more nodes that communicate with each other to perform read and write operations on indices. Small Wazuh deployments, which do not require processing large amounts of data, can easily be handled by a single-node cluster. Multi-node clusters are recommended when there are many monitored endpoints, when a large volume of data is anticipated, or when high availability is required.

For production environments, it is recommended to deploy the Wazuh server and Wazuh indexer to different hosts.

![Architecture](../images/Architecture.png)


---
## Server-Indexer Communication

- **Wazuh server** uses **Filebeat** to send alerts and events to the Wazuh indexer over **TLS encryption** (port `9200/TCP`).  
- **Wazuh dashboard** interacts with the **Wazuh RESTful API** (port `55000/TCP`) for configuration and monitoring. Communication is **TLS encrypted** and authenticated via username and password.

---
## Use cases

> Below you can find examples of some of the most common use cases of the Wazuh platform.

| **Endpoint security**     | **Threat intelligence** | **Security operations** | **Cloud security** |
|---------------------------|-------------------------|-------------------------|--------------------|
| Configuration assessment  | Vulnerability detection | Incident response       | Container security |
| Malware detection         | Threat hunting          | Regulatory compliance   | Posture management |
| File integrity monitoring | Log data analysis       | IT hygiene              | Workload protection|

----

## Requirements

### Recommended Operating Systems

Wazuh Server can be installed on a 64-bit Linux operating system. Supported operating systems include:

| **Operating System**                       |
|--------------------------------------------|
| Amazon Linux 2, Amazon Linux 2023          |
| Red Hat Enterprise Linux 7, 8, 9           |
| CentOS 7, 8                                |
| Ubuntu 16.04, 18.04, 20.04, 22.04, 24.04   |

Ensure your system environment meets all requirements and that you have **root user privileges**.

---

### Hardware Recommendations

> The Wazuh Indexer can be installed as a **single-node** or as part of a **multi-node cluster**.

#### Hardware Recommendations for Each Node

| Component     | Minimum RAM (GB) | Minimum CPU (Cores) | Recommended RAM (GB) | Recommended CPU (Cores) |
|:--------------|:-----------------|:--------------------|:--------------------|:-----------------------|
| Wazuh Indexer | 4                | 2                   | 16                   | 8                       |
| Wazuh Server  | 2                | 2                   | 4                    | 8                       |
| Wazuh Dashboard| 4                | 2                   | 8                    | 4                       |

> The Wazuh Dashboard can be installed on a dedicated node or alongside the Wazuh Indexer.

---

### Disk Space Requirements

#### Wazuh Indexer

| **Monitored Endpoints** | **APS** | **Storage in Wazuh Indexer (GB/90 Days)** |
|-------------------------|---------|-------------------------------------------|
| Servers                 | 0.25    | 3.7                                       |
| Workstations            | 0.1     | 1.5                                       |
| Network Devices         | 0.5     | 7.4                                       |

> **Example**: For an environment with 80 workstations, 10 servers, and 10 network devices, the storage required on the Wazuh Indexer for 90 days of alerts is **230 GB**.

> Storage Calculation Clarity
```shell
a)   Workstations: 80 * 1.5 GB = 120 GB
b)   Servers: 10 * 3.7 GB = 37 GB
c)   Network Devices: 10 * 7.4 GB = 74 GB
d)   Total: 120 + 37 + 74 = 231 GB
```

#### Wazuh Server

| **Monitored Endpoints** | **APS** | **Storage in Wazuh Server (GB/90 Days)** |
|-------------------------|---------|------------------------------------------|
| Servers                 |  0.25   |               0.1                        |
| Workstations            |  0.1    |               0.04                       |
| Network Devices         |  0.5    |               0.2                        |

> **Example**: For an environment with 80 workstations, 10 servers, and 10 network devices, the storage required on the Wazuh Server for 90 days of alerts is **6 GB**.


### Required ports
> Several services are used for the communication of Wazuh components. Below is the list of default ports used by these services. Users can modify these port numbers when necessary.

| **Component**       | **Port**  | **Protocol**      | **Purpose**                                      |
|----------------------|-----------|-------------------|-------------------------------------------------|
| **Wazuh server**     | 1514      | TCP (default)     | Agent connection service                        |
|                      | 1514      | UDP (optional)    | Agent connection service (disabled by default)  |
|                      | 1515      | TCP               | Agent enrollment service                        |
|                      | 1516      | TCP               | Wazuh cluster daemon                            |
|                      | 514       | UDP (default)     | Wazuh Syslog collector (disabled by default)    |
|                      | 514       | TCP (optional)    | Wazuh Syslog collector (disabled by default)    |
|                      | 55000     | TCP               | Wazuh server RESTful API                        |
| **Wazuh indexer**    | 9200      | TCP               | Wazuh indexer RESTful API                       |
|                      | 9300-9400 | TCP               | Wazuh indexer cluster communication             |
| **Wazuh dashboard**  | 443       | TCP               | Wazuh web user interface                        |

---

### Scaling

#### Monitoring Resource Usage
> To determine if a Wazuh Server requires more resources, monitor these files:

1. `/var/ossec/var/run/wazuh-analysisd.state`  
   - Check the `events_dropped` variable. Non-zero values indicate events are being dropped due to lack of resources.

2. `/var/ossec/var/run/wazuh-remoted.state`  
   - Check the `discarded_count` variable. Non-zero values indicate messages from agents are being discarded.

If either variable is non-zero, additional nodes can be added to the cluster to balance the load.



## For Quickstart purpose

> Following this quickstart implies deploying the Wazuh server, the Wazuh indexer, and the Wazuh dashboard on the same host.

> This is usually enough for monitoring up to 100 endpoints and for 90 days of queryable/indexed alert data. The table below shows the recommended hardware for a quickstart deployment:

| Agents | CPU    | RAM   | Storage (90 days) |
| ------ | ------ | ----- | ---------------- |
| 1–25   | 4 vCPU | 8 GiB | 50 GB            |
| 25–50  | 8 vCPU | 8 GiB | 100 GB           |
| 50–100 | 8 vCPU | 8 GiB | 200 GB           |

