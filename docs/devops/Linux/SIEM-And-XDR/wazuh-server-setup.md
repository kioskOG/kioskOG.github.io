---
title: Wazuh Server Installation
layout: default
parent: Wazuh
grand_parent: Linux Projects
nav_order: 2
permalink: /docs/devops/Linux/SIEM-And-XDR/wazuh-server-setup/
description: Documentation for Installing the Wazuh Server.
---


#### Wazuh indexer setup:
First of all ssh into the **wazuh-indexer** instance & follow the steps
## Use **root user** for this setup to remove any unwanted issue

#### The installation process is divided into three stages.
1) Wazuh server node installation
2) Cluster configuration for multi-node deployment


{: .important }
> You need root user privileges to run all the commands described below.

---
1. ## Wazuh server node installation

#### Adding the Wazuh repository

```shell
apt-get install gnupg apt-transport-https
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | gpg --no-default-keyring --keyring gnupg-ring:/usr/share/keyrings/wazuh.gpg --import && chmod 644 /usr/share/keyrings/wazuh.gpg
echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | tee -a /etc/apt/sources.list.d/wazuh.list
apt-get update
```


Installing the Wazuh manager:

```shell
    apt-get -y install wazuh-manager
```

Installing Filebeat
```shell
    apt-get -y install filebeat
```

#### Configuring Filebeat:
1. > Download the preconfigured Filebeat configuration file. And edit the /etc/filebeat/filebeat.yml

```shell
    curl -so /etc/filebeat/filebeat.yml https://packages.wazuh.com/4.9/tpl/wazuh/filebeat/filebeat.yml
    vi /etc/filebeat/filebeat.yml
```
```plaintext
    hosts: The list of Wazuh indexer nodes to connect to. You can use either IP addresses or hostnames. By default, the host is set to localhost hosts: ["127.0.0.1:9200"]. Replace it with your Wazuh indexer address accordingly.

    If you have more than one Wazuh indexer node, you can separate the addresses using commas. For example, hosts: ["10.0.0.1:9200", "10.0.0.2:9200", "10.0.0.3:9200"]
```

```shell
hosts: ["192.168.0.100:9200"]
```


2. > Create a Filebeat keystore to securely store authentication credentials.
```shell
filebeat keystore create
```

3. > Add the default username and password admin:admin to the secrets keystore.
```shell
echo admin | filebeat keystore add username --stdin --force
echo admin | filebeat keystore add password --stdin --force
```

4. > Download the alerts template for the Wazuh indexer.
```shell
curl -so /etc/filebeat/wazuh-template.json https://raw.githubusercontent.com/wazuh/wazuh/v4.9.2/extensions/elasticsearch/7.x/wazuh-template.json
chmod go+r /etc/filebeat/wazuh-template.json
```

5. > Install the Wazuh module for Filebeat.
```shell
curl -s https://packages.wazuh.com/4.x/filebeat/wazuh-filebeat-0.4.tar.gz | tar -xvz -C /usr/share/filebeat/module
```

#### Deploying certificates:

{: .important }
> Make sure that a copy of the wazuh-certificates.tar file, created during the initial configuration step, is placed in your working directory.

1. ##### Replace <SERVER_NODE_NAME> with your Wazuh server node certificate name, the same one used in config.yml when creating the certificates. Then, move the certificates to their corresponding location.

```shell
export NODE_NAME=<SERVER_NODE_NAME>
```

```shell
mkdir /etc/filebeat/certs
tar -xf ./wazuh-certificates.tar -C /etc/filebeat/certs/ ./$NODE_NAME.pem ./$NODE_NAME-key.pem ./root-ca.pem
mv -n /etc/filebeat/certs/$NODE_NAME.pem /etc/filebeat/certs/filebeat.pem
mv -n /etc/filebeat/certs/$NODE_NAME-key.pem /etc/filebeat/certs/filebeat-key.pem
chmod 500 /etc/filebeat/certs
chmod 400 /etc/filebeat/certs/*
chown -R root:root /etc/filebeat/certs
```

#### Configuring the Wazuh indexer connection:

{: .note }
> You can skip this step if you are not going to use the vulnerability detection capability.

```shell
echo '<INDEXER_USERNAME>' | /var/ossec/bin/wazuh-keystore -f indexer -k username
echo '<INDEXER_PASSWORD>' | /var/ossec/bin/wazuh-keystore -f indexer -k password
```


2. ##### Edit `/var/ossec/etc/ossec.conf` to configure the indexer connection.

> By default, the indexer settings have one host configured. It's set to `0.0.0.0`.

Replace `0.0.0.0` with your Wazuh indexer node IP address or hostname. You can find this value in the Filebeat config file `/etc/filebeat/filebeat.yml`.

#### Ensure the Filebeat certificate and key name match the certificate files in /etc/filebeat/certs.

3. ##### Starting the Wazuh manager:

```shell
systemctl daemon-reload
systemctl enable wazuh-manager
systemctl start wazuh-manager
systemctl status wazuh-manager
```

4. ##### Starting the Filebeat service:
```shell
systemctl daemon-reload
systemctl enable filebeat
systemctl start filebeat
```

5. test filebeat
```shell
filebeat test output
```
```yaml
Output:
    elasticsearch: https://192.168.0.100:9200...
    parse url... OK
    connection...
        parse host... OK
        dns lookup... OK
        addresses: 127.0.0.1
        dial up... OK
    TLS...
        security: server's certificate chain verification is enabled
        handshake... OK
        TLS version: TLSv1.3
        dial up... OK
    talk to server... OK
    version: 7.10.2
```

