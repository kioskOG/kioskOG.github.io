---
title: Implementating SAP HANA PCE Access via Cars24 GCP (Solution 2)
layout: home
parent: How we have saved 40 Lac per year for our client
grand_parent: Google Cloud Platform
nav_order: 2
permalink: /docs/devops/Cloud/Gcp/Implementation-SAP-HANA-PCE-Access-via-Cars24-GCP/
description: Documentation for Implementation SAP HANA PCE Access via Cars24 GCP (Solution 2).
---

# 🛠️ Implementation: SAP HANA PCE Access via Cars24 GCP (Solution 2)

This document captures the **practical implementation** of Solution 2 for accessing SAP HANA Private Cloud Edition (PCE) securely using a VPN and DNS system hosted on the Cars24 GCP Project.

---

## 📌 Overview

This section briefly outlines what was built:

- Self-hosted VPN server on GCP VM
- Bind9 DNS servers configured to resolve SAP internal domains
- VPC peering between Cars24 GCP VPC and SAP HANA PCE VPC
- Centralized access for both office and remote users

---

## 📁 GCP Project Setup

```yaml
GCP Project Name: sap-hana
GCP Project ID: sap-hana-438807
```

### VPC Configuration
```yaml
SAP Systems IP Range : 10.60.0.0/16

VPC Name: sap-hana-vpc
CIDR: 10.0.0.0/16
Subnets:
  - Name: sap-hana-asia-south1-a
    CIDR: 10.10.0.0/16
    Region: asia-south1
  - Name: sap-hana-asia-south1-private
    CIDR: 10.11.0.0/16
    Region: asia-south1
```

---

## 🔄 VPC Peering

### VPC-Peering Configuration
```yaml
Our VPC network: sap-hana-vpc
SAP VPC network: vpc-hec55-vre
Peered project ID: sap-hec-gcp-0805
IP stack type: IPv4 (single-stack)
Routing Mode: Global
```
---

### Firewall Rules

[Refer to the SAP Ports list and open all required ports for your respective systems](https://urldefense.proofpoint.com/v2/url?u=https-3A__help.sap.com_docs_Security_575a9f0e56f34c6e8138439eefc32b16_616a3c0b1cc748238de9c0341b15c63c.html&amp;d=DwMFaQ&amp;c=5V426mn7mCiLg9iu0Q21Cw&amp;r=bV_VlVVQ48qV75GjYccXnzTqJsBlLpCauYgLOOOw0r4&amp;m=6OG2fmCt1ZXgXizzh4G0Jum978lJ-pTOjqzbIONt796uqNmnWTmk1cRyq_i21vup&amp;s=b3RcqyDsaOcajj2CYa7sij2KcXXSNfrYxzCcbMZyooc&amp;e=)


{: .note}
> SAP Enterprise Cloud Services’ standard instances are CI-00, CS-01 DB: DEV - 06,QA-04, PRD-02

```yaml
- Allow internal traffic between subnets
- Allow SSH to VPN VM (restricted to admin IPs)
```

```yaml
Container Node IP to be allowed:

vhvretyo2csna-ha.tyo2.sap.cars24.team: /10.60.0.13
vhvretyo2csnb-ha.tyo2.sap.cars24.team: /10.60.0.29
vhvretyo2csnc-ha.tyo2.sap.cars24.team: /10.60.0.45
```

```yaml
Container Subnet IP range to be allowed:

sn-HEC55-VRE-CSN01-A        -        10.60.0.0/28        

sn-HEC55-VRE-CSN01-B        -        10.60.0.16/28

sn-HEC55-VRE-CSN01-C        -        10.60.0.32/28
```

{: .important}
> Allow ports for all systems based on alignment with Partner and SAP Ports list link.
>

```bash
The most important port ranges are listed below:

3200 - 3299 - SAP GUI
3300 - 3399 - SAP GUI
3600 - 3699 - SAP Gateway
44300 - 44399 - HTTPS
30600 - 30699 - Database development
30400 - 30399 - Database quality
30200 - 30299 - Database production
4300 - 4399 - HTTPS Database
8443 - HTTPS Cloud Connector
22 - SFTP
53 - DNS
Ports on demand:
25 - SMTP
515 – printers
```


---

## 📡 DNS Setup (Bind9)

### GCP CloudDNS Config

```yaml
DNS Name: sap.cars24.team.
Type:      Private
```

| DNS Name                                  | Type | TTL (seconds) | Record Data                                                                      |
|-------------------------------------------|------|---------------|----------------------------------------------------------------------------------|
| sap.cars24.team.                          | SOA  | 21600         | ns-gcp-private.googledomains.com. cloud-dns-hostmaster.google.com. 1 21600 3600 259200 300 |
| sap.cars24.team.                          | NS   | 21600         | ns-gcp-private.googledomains.com.                                                |
| vhvretyo2csna-ha.tyo2.sap.cars24.team.    | A    | 60            | 10.60.0.13                                                                       |
| vhvretyo2csnb-ha.tyo2.sap.cars24.team.    | A    | 60            | 10.60.0.29                                                                       |
| vhvretyo2csnc-ha.tyo2.sap.cars24.team.    | A    | 60            | 10.60.0.45                                                                       |
| vpn.sap.cars24.team.                      | A    | 60            | 34.47.194.181                                                                          |

### DNS VM
```yaml
Instance Name: bind-dns
Internal IPs: 10.10.0.10
Zones: sap.cars24.team, tyo2.sap.cars24.team

Instance Name: bind-dns-2
Internal IPs: 10.10.0.10
Zones: sap.cars24.team, tyo2.sap.cars24.team
```

---

### DNS Zone transfer configuration

```yaml
Zone name 1: tyo2.sap.cars24.team
Zone name 2: sap.cars24.team
```

### Bind9 Zone Config
>> /etc/bind/named.conf.options

```bash
options {
    directory "/var/cache/bind";
    recursion no;
    allow-query { any; };
    listen-on port 53 {localhost; 10.10.0.10;};
    dnssec-validation no;
};
```

>> /etc/bind/named.conf.local

```bash
//
// Do any local configuration here
//

// Consider adding the 1918 zones here, if they are not used in your
// organization
//include "/etc/bind/zones.rfc1918";
zone "sap.cars24.team" {
    type slave;
    file "/var/cache/bind/sap.cars24.team.db";
    masters { 10.60.0.13; 10.60.0.29; 10.60.0.45; };
    allow-notify { 10.60.0.13; 10.60.0.29; 10.60.0.45; };
    allow-query { any; };
};

zone "tyo2.sap.cars24.team" {
    type slave;
    file "/var/cache/bind/tyo2.sap.cars24.team.db";
    masters { 10.60.0.13; 10.60.0.29; 10.60.0.45; };
    allow-notify { 10.60.0.13; 10.60.0.29; 10.60.0.45; };
    allow-query { any; };
};
```


```bash
systemctl restart bind9
systemctl status bind9
dig @10.60.0.13 sap.cars24.team AXFR
dig @127.0.0.1 vhvredclcc01.sap.cars24.team.
ls /var/cache/bind/
nc -vz 10.60.0.13 53
```

---

## 🌐 VPN Deployment (NetBird)

### VPN Server
```yaml
Netbird Server:
  Instance Name: instance-20241128-095122
  Region: asia-south1-c
  Machine Type: e2-medium (2 vCPUs, 4 GB Memory)
  OS: Ubuntu 24.04 LTS
  Storage: 20 GB
  Static IP: 
    - private: 10.10.0.12
    - Public: 34.47.194.181

Netbird Client:
  Instance Name: netbird-client
  Region: asia-south1-c
  Machine Type: e2-medium (2 vCPUs, 4 GB Memory)
  OS: Ubuntu 24.04 LTS
  Storage: 10 GB
  Static IP: 
    - private: 10.10.0.3
```

### Postgres
```yaml
Postgres Server 16.6:
  Instance Name: netbird
  VPC: sap-hana-vpc
  Connection name: sap-hana-438807:asia-south1:netbird
  Port: 5432
  Region: asia-south1
  Backup: Automated
  vCPUs: 4 vCPUs
  RAM: 16 GB Memory
  Storage: 20 GB
  Static IP: 
    - private: 10.40.32.3
```

### VPN Setup (NetBird Example)

{: .note}
> * The VM should be publicly accessible on TCP ports `80`, `443`, `33073`, `10000` and `33080`; and UDP ports: `3478`, `49152-65535`.

> * Public domain name pointing to the VM.

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
# Add the repository to Apt sources:
echo   "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
$(. /etc/os-release && echo "$VERSION_CODENAME") stable" |   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl status docker

# Netbird Setup
sudo apt install jq
sudo apt install curl
mkdir Netbird && cd Netbird
vim netbird-setup
export CLIENT_ID="<google_client_id>"
export CLIENT_SECRET="<google_client_secret>"
export NETBIRD_DOMAIN=vpn.sap.cars24.team; bash netbird-setup
docker ps
```

>> netbird-setup
> 🔧 Replace with actual NetBird/WireGuard configuration steps

[Netbird Setup File](netbird-setup)

### Routing Config

![Network Routes](/docs/devops/Cloud/Gcp/images/network-routes.png)

![Acl Policy](/docs/devops/Cloud/Gcp/images/acl-policy.png)

![Setup Keys](/docs/devops/Cloud/Gcp/images/setup-keys.png)

---

## 👥 User Access Flow
### Office/Remote Users
- Install VPN client (NetBird)
- Connect to VPN from corporate/personal network
- Login using keys or identity provider.
- DNS resolves SAP domains via 10.10.0.10 / 10.10.0.20
- Access `abc.sap.cars24.team`, `def.sap.cars24.team`
- Access internal SAP services securely

---

## 🧪 Validation Checklist

| Test Case                            | Result (✅/❌) | Notes                         |
|-------------------------------------|---------------|-------------------------------|
| VPN client connects                 | ✅             |                               |
| DNS resolves SAP domains            | ✅             |                               |
| Can access SAP HANA dashboard       | ✅             |                               |
| Remote access without VPN fails     | ✅             | Confirmed blocked             |
| DNS failover (10.10.0.10 → 10.10.0.20)| ✅             | Works as expected             |

---

> 📌 You can duplicate this as a template for other SAP environments

---

## How to Connect?

- Install VPN client (NetBird) based on your Operating System 
    * https://app.netbird.io/install

If you have installed the UI Version:-
   Click on netbird icon -> Settings -> Advance Settings & update the below endpoints.

```bash
    Management Url: https://vpn.sap.cars24.team:443
    Admin Url: https://vpn.sap.cars24.team:443
```

- Then connect to netbird, it will open up authentication page in your browser.
- Login using Username/Password or identity provider.
- On successful connectivity, you will be able to access the respective SAP HANA network.

If you have installed the CLI Version:-

```bash
netbird up --management-url https://vpn.sap.cars24.team --admin-url https://vpn.sap.cars24.team --setup-key <your-setup-key>
```

---

## 📬 Contacts
- Project Owner: <name/email>
- VPN Access Request: [VPN Endpoint](https://vpn.sap.cars24.team/peers)
                      [Zitadel Endpoint](https://vpn.sap.cars24.team/ui/console)

---

*Version: 1.0 - Last Updated: <date>*

