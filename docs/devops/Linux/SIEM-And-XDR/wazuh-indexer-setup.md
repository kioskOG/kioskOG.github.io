---
title: Wazuh Indexer Installation
layout: home
parent: Wazuh
grand_parent: Linux Projects
nav_order: 1
permalink: /docs/devops/Linux/SIEM-And-XDR/wazuh-indexer-setup/
description: Documentation for Installing the Wazuh Indexer.
---

# For this Demo we have following configuration for instances.
#### Launched 3 EC2 Instances

Deployed the `wazuh-dashboard` in public subnet so, that we can access the dashboard in local browser.
keep `wazuh-indexer` & `wazuh-server` in private subnet.

| Service         | IP Address      | Instance Type | Operating System | Storage |
|-----------------|-----------------|---------------|------------------|---------|
| wazuh-indexer   | 192.168.0.100   | t2.medium     | Ubuntu 24.04     | 30GB gp3|
| wazuh-server    | 192.168.0.15    | t2.medium     | Ubuntu 24.04     | 30GB gp3|
| wazuh-dashboard | 192.168.0.239   | t2.medium     | Ubuntu 24.04     | 30GB gp3|


#### Wazuh indexer setup:
First of all ssh into the **wazuh-indexer** instance & follow the steps
## Use **root user** for this setup to remove any unwanted issue

#### The installation process is divided into three stages.
1) Certificates creation
2) Nodes installation
3) Cluster initialization

---

1. ## Certificates creation

1. Certificates creation

```shell
mkdir indexer
cd indexer
curl -sO https://packages.wazuh.com/4.9/wazuh-certs-tool.sh
curl -sO https://packages.wazuh.com/4.9/config.yml
```

> Edited config.yml and entered the name and ip address for the indexer, server, dashboard

2. In my case it look like this

```yaml
nodes:
  # Wazuh indexer nodes
  indexer:
    - name: indexer
      ip: "192.168.0.100"
    #- name: node-2
    #  ip: "<indexer-node-ip>"
    #- name: node-3
    #  ip: "<indexer-node-ip>"

  # Wazuh server nodes
  # If there is more than one Wazuh server
  # node, each one must have a node_type
  server:
    - name: server
      ip: "192.168.0.15"
    #  node_type: master
    #- name: wazuh-2
    #  ip: "<wazuh-manager-ip>"
    #  node_type: worker
    #- name: wazuh-3
    #  ip: "<wazuh-manager-ip>"
    #  node_type: worker

  # Wazuh dashboard nodes
  dashboard:
    - name: dashboard
      ip: "192.168.0.239"
```

3. Run ./wazuh-certs-tool.sh to create the certificates. For a multi-node cluster, these certificates need to be later deployed to all Wazuh instances in your cluster.
```shell
bash ./wazuh-certs-tool.sh -A
```

4. Compress all the necessary files. And Copy the wazuh-certificates.tar file to all the nodes using scp or something.
```shell
tar -cvf ./wazuh-certificates.tar -C ./wazuh-certificates/ .
rm -rf ./wazuh-certificates

scp -i "/home/ubuntu/.ssh/netbird" ./wazuh-certificates.tar  ubuntu@192.168.0.239:/home/ubuntu/wazuh-certificates.tar
```

---

2. ## Nodes installation

> Installing package dependencies:

```shell
    sudo apt-get install debconf adduser procps
```

> Adding the Wazuh repository:

```shell
    1. apt-get install gnupg apt-transport-https

    2. curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | gpg --no-default-keyring --keyring gnupg-ring:/usr/share/keyrings/wazuh.gpg --import && chmod 644 /usr/share/keyrings/wazuh.gpg

    3. echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | tee -a /etc/apt/sources.list.d/wazuh.list

    4. apt-get update
```
> Installing the Wazuh indexer:
```shell
    sudo apt-get -y install wazuh-indexer
```

#### Configuring the Wazuh indexer:

> edit this file --> sudo vi `/etc/wazuh-indexer/opensearch.yml`

a.  `network.host:` Sets the address of this node for both HTTP and transport traffic. The node will bind to this address and use it as its  publish address. Accepts an IP address or a hostname.

    Use the same node address set in `config.yml` to create the SSL certificates.

b.  `node.name:` Name of the Wazuh indexer node as defined in the `config.yml` file. For example, `node-1`.

c.   `cluster.initial_master_nodes:` List of the names of the master-eligible nodes. These names are defined in the `config.yml` file. Uncomment the `node-2` and `node-3` lines, change the names, or add more lines, according to your `config.yml` definitions.


    cluster.initial_master_nodes:
    - "node-1"
    - "node-2"
    - "node-3"
 
d.  `discovery.seed_hosts:` List of the addresses of the master-eligible nodes. Each element can be either an IP address or a hostname. You may leave this setting commented if you are configuring the Wazuh indexer as a single node. For multi-node configurations, uncomment this setting and set the IP addresses of each master-eligible node.


    discovery.seed_hosts:
    - "10.0.0.1"
    - "10.0.0.2"
    - "10.0.0.3"

e.  `plugins.security.nodes_dn:` List of the Distinguished Names of the certificates of all the Wazuh indexer cluster nodes. Uncomment the lines for `node-2` and `node-3` and change the common names (CN) and values according to your settings and your `config.yml` definitions.


    plugins.security.nodes_dn:
    - "CN=node-1,OU=Wazuh,O=Wazuh,L=California,C=US"
    - "CN=node-2,OU=Wazuh,O=Wazuh,L=California,C=US"
    - "CN=node-3,OU=Wazuh,O=Wazuh,L=California,C=US"


Below i have configured as per my requirements
```shell
network.host: "192.168.0.100"
node.name: "indexer"
cluster.initial_master_nodes:
- "indexer"
plugins.security.nodes_dn:
- "CN=indexer,OU=Wazuh,O=Wazuh,L=California,C=US"
```

#### Deploying certificates:

> Note Make sure that a copy of the wazuh-certificates.tar file, created during the initial configuration step, is placed in your working directory.

```shell
    export NODE_NAME=<indexer-node-name>

    mkdir /etc/wazuh-indexer/certs
    tar -xf ./wazuh-certificates.tar -C /etc/wazuh-indexer/certs/ ./$NODE_NAME.pem ./$NODE_NAME-key.pem ./admin.pem ./admin-key.pem ./root-ca.pem
    mv -n /etc/wazuh-indexer/certs/$NODE_NAME.pem /etc/wazuh-indexer/certs/indexer.pem
    mv -n /etc/wazuh-indexer/certs/$NODE_NAME-key.pem /etc/wazuh-indexer/certs/indexer-key.pem
    chmod 500 /etc/wazuh-indexer/certs
    chmod 400 /etc/wazuh-indexer/certs/*
    chown -R wazuh-indexer:wazuh-indexer /etc/wazuh-indexer/certs
    systemctl daemon-reload
    systemctl enable wazuh-indexer
    systemctl start wazuh-indexer
```
> Repeat this stage of the installation process for every Wazuh indexer node in your cluster. Then proceed with initializing your single-node or multi-node cluster in the next stage.

---


3. ## Cluster initialization:

```shell
    /usr/share/wazuh-indexer/bin/indexer-security-init.sh

    Note You only have to initialize the cluster once, there is no need to run this command on every node.

    curl -k -u admin:admin https://<WAZUH_INDEXER_IP_ADRESS>:9200
    curl -k -u admin:admin https://<WAZUH_INDEXER_IP_ADDRESS>:9200/_cat/nodes?v
```
