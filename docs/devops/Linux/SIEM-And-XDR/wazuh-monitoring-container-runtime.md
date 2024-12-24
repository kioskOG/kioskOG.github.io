---
title: Monitoring Container Runtime Using Wazuh
layout: default
parent: Wazuh
grand_parent: Linux Projects
nav_order: 9
permalink: /docs/devops/Linux/SIEM-And-XDR/wazuh-monitoring-container-runtime/
description: Documentation for monitoring container runtime with Wazuh.
---

## Objective  
Learn how to monitor Docker container runtime logs on Linux endpoints using Wazuh to detect web attacks and other suspicious activity.

---

## Overview  
Docker container runtime logs are stored at:  
`/var/lib/docker/containers/<CONTAINER_ID>/<CONTAINER_ID>-json.log`  

This guide demonstrates monitoring runtime logs of a web container using Wazuh to detect web attacks, such as SQL injection attempts.

---

## Step 1: Wazuh Agent Configuration  

### 1.1 **Configure Wazuh Agent to Monitor Logs**  
   Edit the Wazuh agent configuration file at `/var/ossec/etc/ossec.conf` and add the following:

   ```xml
   <ossec_config>
     <localfile>
       <log_format>syslog</log_format>
       <location>/var/lib/docker/containers/*/*-json.log</location>
     </localfile>
   </ossec_config>
```

#### Explanation:
* We use wildcards `*` in the `<location>` field of the configuration so Wazuh can monitor the dynamically named log file path. The file path of the container log usually contains the container ID as shown in the pattern `/var/lib/docker/containers/<CONTAINER_ID>/<CONTAINER_ID>-json.log`


### 1.2 Restart the Wazuh agent:
Apply the changes by restarting the Wazuh agent service:
```shell
systemctl restart wazuh-agent
```

## 2 Wazuh server configuration
### 2.1 Add Decoders to the Wazuh Server
Edit the decoder file `/var/ossec/etc/decoders/docker_decoder.xml` on the Wazuh server and add the following decoders:
```xml
<decoder name="web-accesslog-docker">
  <parent>json</parent>
  <type>web-log</type>
  <use_own_name>true</use_own_name>
  <prematch offset="after_parent">^log":"\S+ \S+ \S+ \.*[\S+ \S\d+] \.*"\w+ \S+ HTTP\S+" \d+</prematch>
  <regex offset="after_parent">^log":"(\S+) \S+ \S+ \.*[\S+ \S\d+] \.*"(\w+) (\S+) HTTP\S+" (\d+)</regex>
  <order>srcip,protocol,url,id</order>
</decoder>

<decoder name="json">
  <parent>json</parent>
  <use_own_name>true</use_own_name>
  <plugin_decoder>JSON_Decoder</plugin_decoder>
</decoder>
```

#### Explanation:
* The `web-accesslog-docker `decoder extracts the relevant fields in a web log, and sets the log type to web-log so the Wazuh analysis engine can analyze the log for web attacks.

* The `json` decoder enables Wazuh to continue decoding the log as a regular json log in case it does not meet the criteria of the first decoder `web-accesslog-docker`.


## 2.2 Restart Wazuh Manager
Apply the changes by restarting the Wazuh manager service:
```shell
systemctl restart wazuh-manager
```

## 3. Run a Docker container and simulate the attack

#### 3.1 Run the Web Container
Use the following command on the Docker server to create a web container called `nginx-container`:

```shell
docker run --name nginx-container -p 80:80 -d nginx
```

#### 3.2 Simulate an SQL Injection Attack
Use the following command to simulate an SQL injection (SQLi) attack from the Wazuh server. Replace `<WEB_IP_ADDRESS>` with the IP address of the Docker server:
```shell
curl -XGET "http://<WEB_IP_ADDRESS>/users/?id=SELECT+*+FROM+users";
```

## Results
> Once the attack is simulated, Wazuh detects it and generates an alert. Below is an example of the alert event data:

#### Example Alert
The `location` field in the alert data shows the container where the event was generated.
```json
{
  "_index": "wazuh-alerts-4.x-2024.12.24",
  "_id": "g9N395MBPKsKvZRHN9bE",
  "_score": null,
  "_source": {
    "input": {
      "type": "log"
    },
    "agent": {
      "ip": "192.168.0.168",
      "name": "netbird-docker",
      "id": "003"
    },
    "manager": {
      "name": "server"
    },
    "data": {
      "protocol": "GET",
      "srcip": "192.168.0.15",
      "id": "404",
      "url": "/users/?id=SELECT+*+FROM+users"
    },
    "rule": {
      "firedtimes": 1,
      "mail": false,
      "level": 7,
      "pci_dss": [
        "6.5",
        "11.4",
        "6.5.1"
      ],
      "tsc": [
        "CC6.6",
        "CC7.1",
        "CC8.1",
        "CC6.1",
        "CC6.8",
        "CC7.2",
        "CC7.3"
      ],
      "description": "SQL injection attempt.",
      "groups": [
        "web",
        "accesslog",
        "attack",
        "sql_injection"
      ],
      "mitre": {
        "technique": [
          "Exploit Public-Facing Application"
        ],
        "id": [
          "T1190"
        ],
        "tactic": [
          "Initial Access"
        ]
      },
      "id": "31103",
      "nist_800_53": [
        "SA.11",
        "SI.4"
      ],
      "gdpr": [
        "IV_35.7.d"
      ]
    },
    "location": "/var/lib/docker/containers/61afd1702e43cdfa637dc2795a1f530de883177bce019d373a6e44b8b2772d00/61afd1702e43cdfa637dc2795a1f530de883177bce019d373a6e44b8b2772d00-json.log",
    "decoder": {
      "parent": "json",
      "name": "web-accesslog-docker"
    },
    "id": "1735023603.2499617",
    "full_log": "{\"log\":\"192.168.0.15 - - [24/Dec/2024:07:00:02 +0000] \\\"GET /users/?id=SELECT+*+FROM+users HTTP/1.1\\\" 404 153 \\\"-\\\" \\\"curl/8.5.0\\\" \\\"-\\\"\\n\",\"stream\":\"stdout\",\"time\":\"2024-12-24T07:00:02.092958642Z\"}",
    "timestamp": "2024-12-24T07:00:03.851+0000"
  },
  "fields": {
    "timestamp": [
      "2024-12-24T07:00:03.851Z"
    ]
  },
  "sort": [
    1735023603851
  ]
}
```

## Notes
* The `location` field in the alert data identifies the container where the event occurred.

* Ensure Docker logs are stored in JSON format for proper monitoring by Wazuh.

![final-output](../images/sql-injection-demonstrate.png)