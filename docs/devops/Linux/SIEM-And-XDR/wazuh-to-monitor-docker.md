---
title: Monitor Docker Environment Using Wazuh
layout: default
parent: Wazuh
grand_parent: Linux Projects
nav_order: 8
permalink: /docs/devops/Linux/SIEM-And-XDR/wazuh-to-monitor-docker/
description: Documentation for monitoring Docker environments with Wazuh.
---


## Objective
### Gain insights into your Docker environment using Wazuh for proactive monitoring of both Docker servers and containers.

#### Why Monitor Docker?
* **Docker Server Monitoring:** Track resource usage, detect unauthorized access, address performance issues, and resolve security concerns.

* **Container Monitoring:** Observe activities such as network connections, file system changes, and process executions to detect anomalies, identify malware, and respond to incidents in real-time.

### Prerequisites
* **ubuntu 24.04**
* **Docker**
* **python 3.11 or 3.12**
* **wazuh 4.x**

## Process Overview
This guide is divided into two parts:
1) Enable the Wazuh Docker listener.
2) Install and configure the Wazuh agent on your Docker server.


## Enable the Wazuh Docker listener

## 1) Enable the Wazuh Docker listener.

Install Python Docker Library
To interact with the **Docker Engine API**, install the required Python libraries:

```shell
pip3 install docker==7.1.0 urllib3==2.2.2 requests==2.32.2 --break-system-packages
```

{: .note }
> * If you encounter the error Cannot uninstall urllib3 2.0.7, RECORD file not found, remove urllib3==2.2.2 from the command since Ubuntu 24.04 already includes urllib3.

* To avoid modifying the default Python environment, consider using a virtual environment:
```shell
python3 -m venv /path/to/venv  
source /path/to/venv/bin/activate  
pip3 install docker==7.1.0 requests==2.32.2
```
Update the shebang in the Wazuh Docker listener script to point to the virtual environment interpreter:
```shell
vim /var/ossec/wodles/docker/DockerListener
```
Update the first line to:
```shell
#!/path/to/venv/bin/python3
```


## 2) Install and Configure the Wazuh Agent

## 2.1) Install the Wazuh agent

#### 1. Create a New Group for Docker Host:
* Navigate to the **Wazuh Dashboard** → **Server Management** → **Endpoint Groups**.
* Add a new group named `docker`.

#### 2. Deploy the Wazuh Agent:
* Go to **Server Management** → **Endpoints Summary** → **Deploy New Agent**.
* Select **DEB (amd64)**.
* Assign a server address, agent name, and select the `docker` group.
* Copy the generated command and execute it on the `Docker host`.

#### Example command
```shell
wget https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.9.2-1_amd64.deb && sudo WAZUH_MANAGER='192.168.0.15' WAZUH_AGENT_GROUP='docker' WAZUH_AGENT_NAME='netbird-docker' dpkg -i ./wazuh-agent_4.9.2-1_amd64.deb
```

{: .important }
> * Run the command with administrator privileges.
> * Use a Bash Shell.

## 2.2) Configure the Wazuh agent

1. Edit the file `/var/ossec/etc/ossec.conf` on wazuh agent

```shell
sudo vim /var/ossec/etc/ossec.conf
```

2. Add the following configuration to enable the Docker listener:
```xml
<ossec_config>
  <wodle name="docker-listener">
    <disabled>no</disabled>
  </wodle>
</ossec_config>
```

3. Reload and start the Wazuh agent service:
```shell
sudo systemctl daemon-reload
sudo systemctl enable wazuh-agent
sudo systemctl start wazuh-agent
```

## Verify Logs in Wazuh Dashboard
Log in to your Wazuh Dashboard and navigate to the Docker Section. You should see logs being captured for the Docker environment.

![Final output](../images/wazuh-docker-final-output.png)

## Referance
[wazuh](https://documentation.wazuh.com/current/user-manual/capabilities/container-security/monitoring-docker.html)