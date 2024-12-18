---
title: Wazuh Dashboard Installation
layout: default
parent: Wazuh
grand_parent: Linux Projects
nav_order: 3
permalink: /docs/devops/Linux/SIEM-And-XDR/wazuh-dashboard-setup/
description: Documentation for Installing the Wazuh Dashboard.
---

## Wazuh Dashboard Setup

1. **Install Dependencies**:

```shell
apt-get install debhelper tar curl libcap2-bin --fix-missing
gnupg apt-transport-https
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | gpg --no-default-keyring --keyring gnupg-ring:/usr/share/keyrings/wazuh.gpg --import && chmod 644 /usr/share/keyrings/wazuh.gpg
echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | tee -a /etc/apt/sources.list.d/wazuh.list
apt-get update
```

2. **Install the Wazuh Dashboard**:

```shell
apt-get -y install wazuh-dashboard
```

3. **Edit Configuration**:
- Update `opensearch_dashboards.yml`:

```shell
vi /etc/wazuh-dashboard/opensearch_dashboards.yml
```
- **`server.host`**: Set the Wazuh dashboard server IP.
- **`opensearch.hosts`**: Add URLs of Wazuh indexer instances:

```
opensearch.hosts: ["https://10.0.0.2:9200", "https://10.0.0.3:9200"]
```

4. **Deploy Certificates**:

```shell
NODE_NAME=<DASHBOARD_NODE_NAME>

mkdir /etc/wazuh-dashboard/certs
tar -xf ./wazuh-certificates.tar -C /etc/wazuh-dashboard/certs/ ./$NODE_NAME.pem ./$NODE_NAME-key.pem ./root-ca.pem
mv -n /etc/wazuh-dashboard/certs/$NODE_NAME.pem /etc/wazuh-dashboard/certs/dashboard.pem
mv -n /etc/wazuh-dashboard/certs/$NODE_NAME-key.pem /etc/wazuh-dashboard/certs/dashboard-key.pem
chmod 500 /etc/wazuh-dashboard/certs
chmod 400 /etc/wazuh-dashboard/certs/*
chown -R wazuh-dashboard:wazuh-dashboard /etc/wazuh-dashboard/certs
```

5. **Start the Wazuh Dashboard**:

```shell
systemctl daemon-reload
systemctl enable wazuh-dashboard
systemctl start wazuh-dashboard
```

6. **Update `wazuh.yml`**:

```shell
vi /usr/share/wazuh-dashboard/data/wazuh/config/wazuh.yml
```
> Replace the URL value with the IP or hostname of the Wazuh server master node.

7. **Access the Web Interface**:

[Dashboard Url](https://<WAZUH_DASHBOARD_IP_ADDRESS>)
Username: `admin`
Password: `admin`
