---
title: Setting up IPVS Load Balancer with NGINX Application Servers
layout: home
parent: Quick Introduction to Linux iptables
nav_order: 1
grand_parent: Linux Projects
permalink: /docs/devops/Linux/Iptables/ipvs-loadbalancer/
description: Documentation for setting up IPVS Load Balancer with NGINX Application Servers.
---

![ipvs](../images/ipvs.png)
# Setting up IPVS Load Balancer with NGINX Application Servers

In this guide, we'll set up an IPVS load balancer with one master node (Director) and two application servers running NGINX.

## Prerequisites
Launch three machines:
- **1 IPVS Master Node (Director)**
- **2 Application Servers running NGINX**

## Step 1: Install IPVSADM on the Master Node
IPVSADM is used to set up, maintain, or inspect the virtual server table in the Linux Kernel.
```bash
sudo apt update
sudo apt install ipvsadm -y
```

## Step 2: Verify Application Servers
Ensure the application servers are running and accessible.
```bash
curl 192.168.144.101:80
curl 192.168.144.197:80
```

## Step 3: Add Virtual Service
The `-A` option adds a virtual service.
- `-t`: Specifies TCP protocol
- `-s`: Scheduling algorithm (Round-Robin in this case)

```bash
sudo ipvsadm -A -t 192.168.0.117:80 -s rr
```

## Step 4: Add Real Servers to the Virtual Service
The `-a` flag adds real servers.
- `-r`: Real server
- `-m`: Masquerading (NAT)

```bash
sudo ipvsadm -a -t 192.168.0.117:80 -r 192.168.144.101:80 -m
sudo ipvsadm -a -t 192.168.0.117:80 -r 192.168.144.197:80 -m
```

## Step 6: Test the setup
Go to the Director node & hit it's `IP` on `port 80`

```bash
curl 192.168.0.117:80
```

{: .important}
> You will notice it will serve the request in round-robin fashion.

## Step 6: List Virtual Server Table
Check the current virtual server configuration.
```bash
sudo ipvsadm -L
```
### Example Output
```
IP Virtual Server version 1.2.1 (size=4096)
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
TCP  ip-192-168-0-117.ap-southeas rr
  -> ip-192-168-144-101.ap-southe Masq    1      0          0         
  -> ip-192-168-144-197.ap-southe Masq    1      0          0
```
### Explanation
- **LocalAddress:Port:** `ip-192-168-0-117` acts as the virtual IP (VIP) for your service.
- **Scheduler (rr):** Round-robin scheduling is being used.
- **Forwarding Mode (Masq):** The packets are being masqueraded (source NAT).
- **Weight:** `1` indicates equal weight for backend servers.
- **ActiveConn/InActConn:** Zero connections, meaning no traffic is currently hitting the service.

## Step 7: List Connection Table of the IPVS Load Balancer
This command shows the IPVS connection entries.
```bash
sudo ipvsadm -lcn
```
### Example Output
```
IPVS connection entries
pro expire state       source             virtual            destination
TCP 01:47  TIME_WAIT   192.168.0.117:39298 192.168.0.117:80   192.168.144.197:80
TCP 01:48  TIME_WAIT   192.168.0.117:49826 192.168.0.117:80   192.168.144.101:80
```
### Explanation
- **pro:** Protocol (TCP in this case)
- **expire:** Time until connection entry expires
- **state:** State of the connection (e.g., `TIME_WAIT`)
- **source:** Source IP and port making the request
- **virtual:** Virtual service IP and port
- **destination:** Backend real server IP and port

## Conclusion
This setup provides a simple and efficient load balancing mechanism using IPVS and ensures high availability for NGINX-based applications.

