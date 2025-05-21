---
title: 🧩 Setting Up a Highly Available 3-Node etcd Cluster on Ubuntu
layout: home
parent: Linux Projects
nav_order: 7
permalink: /docs/devops/Linux/Etcd-cluster-setup/Etcd-cluster-setup/
description: Documentation on Setting Up a Highly Available 3-Node etcd Cluster on Ubuntu
---

# 🧩 Setting Up a Highly Available 3-Node etcd Cluster on Ubuntu

This guide walks you through setting up a 3-node etcd cluster on Ubuntu 24.04 using systemd-based configuration. The cluster will use static IPs and each node will communicate securely using peer URLs.

---

## 🖥️ Infrastructure Plan

{: .note}
> This setup uses AWS EC2 (Ubuntu 24.04 minimal) with t2.medium instances.

| Node  | Hostname | IP Address    | etcd Name |
| ----- | -------- | ------------- | --------- |
| etcd0 | node0    | 192.168.0.179 | etcd0     |
| etcd1 | node1    | 192.168.0.60  | etcd1     |
| etcd2 | node2    | 192.168.0.35  | etcd2     |

> Ensure all nodes have their `/etc/hosts` updated and can resolve each other's hostnames.

---

## 📦 Step 1: Install etcd

>> Perform this operation on all the nodes.

```bash
sudo apt update
sudo apt install -y etcd-server
```

---

## ⚙️ Step 2: Configure `/etc/default/etcd` for Each Node

### Node0 – etcd0 (`192.168.0.179`)

```bash
ETCD_NAME="etcd0"
ETCD_DATA_DIR="/var/lib/etcd"
ETCD_LISTEN_PEER_URLS="http://192.168.0.179:2380"
ETCD_LISTEN_CLIENT_URLS="http://127.0.0.1:2379,http://192.168.0.179:2379"
ETCD_INITIAL_ADVERTISE_PEER_URLS="http://192.168.0.179:2380"
ETCD_ADVERTISE_CLIENT_URLS="http://192.168.0.179:2379"
ETCD_INITIAL_CLUSTER="etcd0=http://192.168.0.179:2380,etcd1=http://192.168.0.60:2380,etcd2=http://192.168.0.35:2380"
ETCD_INITIAL_CLUSTER_TOKEN="etcd-cluster"
ETCD_INITIAL_CLUSTER_STATE="new"
DAEMON_ARGS="--enable-v2=true"
```

### Node1 – etcd1 (`192.168.0.60`)

```bash
ETCD_NAME="etcd1"
ETCD_DATA_DIR="/var/lib/etcd"
ETCD_LISTEN_PEER_URLS="http://192.168.0.60:2380"
ETCD_LISTEN_CLIENT_URLS="http://127.0.0.1:2379,http://192.168.0.60:2379"
ETCD_INITIAL_ADVERTISE_PEER_URLS="http://192.168.0.60:2380"
ETCD_ADVERTISE_CLIENT_URLS="http://192.168.0.60:2379"
ETCD_INITIAL_CLUSTER="etcd0=http://192.168.0.179:2380,etcd1=http://192.168.0.60:2380,etcd2=http://192.168.0.35:2380"
ETCD_INITIAL_CLUSTER_TOKEN="etcd-cluster"
ETCD_INITIAL_CLUSTER_STATE="new"
DAEMON_ARGS="--enable-v2=true"
```

### Node2 – etcd2 (`192.168.0.35`)

```bash
ETCD_NAME="etcd2"
ETCD_DATA_DIR="/var/lib/etcd"
ETCD_LISTEN_PEER_URLS="http://192.168.0.35:2380"
ETCD_LISTEN_CLIENT_URLS="http://127.0.0.1:2379,http://192.168.0.35:2379"
ETCD_INITIAL_ADVERTISE_PEER_URLS="http://192.168.0.35:2380"
ETCD_ADVERTISE_CLIENT_URLS="http://192.168.0.35:2379"
ETCD_INITIAL_CLUSTER="etcd0=http://192.168.0.179:2380,etcd1=http://192.168.0.60:2380,etcd2=http://192.168.0.35:2380"
ETCD_INITIAL_CLUSTER_TOKEN="etcd-cluster"
ETCD_INITIAL_CLUSTER_STATE="new"
DAEMON_ARGS="--enable-v2=true"
```

---

## 🚀 Step 3: Start etcd Cluster

On **each node**:

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable etcd
sudo systemctl restart etcd
```

---

## ✅ Step 4: Validate Cluster Health

```bash
# Install the etcd client
apt install etcd-client
```

From any node:

```bash
ETCDCTL_API=3 etcdctl \
  --endpoints=http://192.168.0.179:2379,http://192.168.0.60:2379,http://192.168.0.35:2379 \
  member list

ETCDCTL_API=3 etcdctl \
  --endpoints=http://192.168.0.179:2379,http://192.168.0.60:2379,http://192.168.0.35:2379 \
  endpoint health
```

Expected output: all members listed and reported as healthy.

>> Check cluster membership

```bash
etcdctl  member list

2ad51e2747fc5127, started, etcd0, http://192.168.0.179:2380, http://192.168.0.179:2379, false
a9a4e28f06b02bd6, started, etcd2, http://192.168.0.35:2380, http://192.168.0.35:2379, false
cdbfcb3f6267ef8e, started, etcd1, http://192.168.0.60:2380, http://192.168.0.60:2379, false
```

---

## 📌 Notes

* You can use `curl http://<ip>:2379/v2/keys` to verify the v2 API
* `etcdctl get /foo` only works after data is added (e.g., `put` via `etcdctl`)
* Make sure firewall rules allow ports `2379` and `2380`

---


Let's write a few key-value pairs in the cluster and verify it.

```bash
ETCDCTL_API=3 etcdctl put name1 batman
ETCDCTL_API=3 etcdctl put name2 ironman
ETCDCTL_API=3 etcdctl put name3 superman
ETCDCTL_API=3 etcdctl put name4 spiderman
```

>> Now you can try getting the value of name3 using the following command.

```bash
ETCDCTL_API=3 etcdctl get name3
```

>> You can list all the keys using ranges and prefixes

```bash
ETCDCTL_API=3 etcdctl get name1 name4 # lists range name1 to name 4 ETCDCTL_API=3 etcdctl get --prefix name # lists all keys with name prefix
```

>> Get current leader

etcdctl --endpoints=http://192.168.0.179:2379,http://192.168.0.60:2379,http://192.168.0.35:2379 endpoint status --write-out=table