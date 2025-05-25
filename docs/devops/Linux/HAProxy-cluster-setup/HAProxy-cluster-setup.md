---
title: 🔁 High Availability HAProxy Failover Setup with Keepalived and AWS Elastic IP
layout: home
parent: Linux Projects
nav_order: 8
permalink: /docs/devops/Linux/HAProxy-cluster-setup/HAProxy-cluster-setup/
description: Documentation on Setting Up High Availability HAProxy Failover Setup with Keepalived and AWS Elastic IP
---


# 🔁 High Availability HAProxy Failover Setup with Keepalived and AWS Elastic IP

This guide outlines a **production-grade Active-Standby failover setup** using **HAProxy**, **Keepalived**, and **AWS Elastic IP reassignment**, ensuring high availability without external load balancers.

---

## Implement the floating IP pattern on AWS

1. Launch two EC2 instances to assume the roles of primary and secondary nodes, where the primary is assumed to be in active state by default.

2. Assign an additional secondary private IP address to the primary EC2 instance.

3. An elastic IP address, which is similar to a virtual IP (VIP), is associated with the secondary private address. This secondary private address is the address that is used by external endpoints to access the application.

4. Some operating system (OS) configuration is required to make the secondary IP address added as an alias to the primary network interface.

5. The application must bind to this elastic IP address. 

5. Run a monitoring script—custom, KeepAlive on Linux, Corosync, and so on—on each node to monitor the state of the peer node. In the event, that the current active node fails, the peer detects this failure, and invokes the Amazon EC2 API to reassign the secondary private IP address to itself.

Therefore, the application that was listening on the VIP associated with the secondary private IP address becomes available to endpoints via the standby node.

---

## 📦 Components Used

* **HAProxy** – TCP Load Balancer for PostgreSQL
* **Keepalived** – Health checking and VIP failover daemon
* **AWS EC2** – For Elastic IP & ENI manipulation
* **Bash failover script** – Assigns secondary private IP to standby node


| Internal IP   | External IP | Hostname    |
| :------------ | :---------- | :---------- |
| 192.168.0.173 | 47.129.237.254     | haproxy-1   |
| 192.168.0.154 | 54.254.154.26     | haproxy-2   |

---

## Launch EC2 Instances

1. Launch `2` EC2 Instances with Ubuntu 24.04 under same subnet, with Public IP address. And I have used `t2.medium` as instance type.

2. On **Instance 1**, go to `Actions → Networking → Manage IP addresses`. Assign a **secondary private IP** (e.g., `192.168.0.11`) within the subnet CIDR.

3. Keep **Auto-assign public IP** enabled.

4. Enable `Allow secondary private IPv4 addresses to be reassigned`.

5. Save changes.

{: .warning}
> ⚠️ This only needs to be done on the **primary node**. This IP will float to standby when failover occurs.

---

## 🛠️ Packages to Install (on both HAProxy nodes)

```bash
apt install haproxy keepalived psmisc unzip -y
```

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

---

## 🛡️ AWS IAM Instance Profile

### IAM Trust Policy

Attach the following trust policy to allow EC2 instance role assumption:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### IAM Permissions

Attach the **AmazonEC2FullAccess** policy for now (use a restricted policy in production).

---

### Node-1

{: .note}
> I have used this below haproxy config because i have setup this haproxy for my [HA Postges Setup using Patroni](https://kioskog.github.io/docs/devops/Linux/Postgresql/SETTING-UP-A-POSTGRESQL-HA-CLUSTER/)

## 🧠 HAProxy Configuration (`/etc/haproxy/haproxy.cfg`)
*(Identical config on both nodes)*

```conf
global
      maxconn 100
defaults
      log global
      mode tcp
      retries 2
      timeout client 30m
      timeout connect 4s
      timeout server 30m
      timeout   check   5s
listen stats
      mode http
      bind *:7000
      stats enable
      stats uri /
listen postgres
      bind *:5000
      option httpchk
      http-check expect status 200
      default-server inter 3s fall 3 rise 2 on-marked-down shutdown-sessions
      server node1 192.168.0.249:5432 maxconn 100   check   port 8008
      server node2 192.168.0.248:5432 maxconn 100   check   port 8008
      server node3 192.168.0.21:5432 maxconn 100   check   port 8008
```

---

## 🧪 Health Check Script (`/usr/local/bin/check-haproxy.sh`)

```bash
#!/bin/bash

if systemctl is-active --quiet haproxy; then
  exit 0
else
  exit 1
fi
```

---

## 🔄 Failover Script (`/usr/local/bin/ip-failover.sh`)

```bash
#!/bin/bash
set -euo pipefail

ACTION="${1:-}"
VIP_TO_MOVE="192.168.0.11"               # Modify as required
REGION="ap-southeast-1"                  # Modify as required
LOG_FILE="/var/log/ip-failover.log"

timestamp() { date "+%Y-%m-%d %H:%M:%S"; }
log() { echo "$(timestamp) $1" | tee -a "$LOG_FILE"; }

fetch_metadata() {
  TOKEN=$(curl -s --fail -X PUT "http://169.254.169.254/latest/api/token" \
    -H "X-aws-ec2-metadata-token-ttl-seconds: 60") || return 1
  INSTANCE_ID=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
    http://169.254.169.254/latest/meta-data/instance-id) || return 1
  MAC=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
    http://169.254.169.254/latest/meta-data/network/interfaces/macs/ | head -n1 | sed 's:/$::')
  INTERFACE_ID=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
    http://169.254.169.254/latest/meta-data/network/interfaces/macs/${MAC}/interface-id) || return 1
  IFACE=$(ip route get 1 | awk '{print $5; exit}')
}

if ! fetch_metadata; then
  log "❌ Metadata fetch failed."
  exit 1
fi

case "$ACTION" in
  promote)
    log "🔁 PROMOTING: Assigning VIP $VIP_TO_MOVE to ENI $INTERFACE_ID"
    aws ec2 assign-private-ip-addresses \
      --network-interface-id "$INTERFACE_ID" \
      --private-ip-addresses "$VIP_TO_MOVE" \
      --allow-reassignment \
      --region "$REGION" \
      >> "$LOG_FILE" 2>&1 && log "✅ VIP assigned."

    ip a | grep -q "$VIP_TO_MOVE" || ip addr add "$VIP_TO_MOVE/32" dev "$IFACE"
    ;;
  demote)
    log "🔁 DEMOTING: Removing VIP $VIP_TO_MOVE from $IFACE"
    ip addr del "$VIP_TO_MOVE/32" dev "$IFACE" 2>/dev/null || true
    ;;
  *)
    log "⚠️ Unknown action. Usage: $0 [promote|demote]"
    exit 1
    ;;
esac
```

```bash
chmod +x /usr/local/bin/check-haproxy.sh
chmod +x /usr/local/bin/ip-failover.sh
chown root:root /usr/local/bin/check-haproxy.sh
chown root:root /usr/local/bin/ip-failover.sh
```

---

## ⚙️ Keepalived Configuration (`/etc/keepalived/keepalived.conf`)

```conf
global_defs {
  script_user root
  enable_script_security
  router_id HAPROXY_NODE_1
  vrrp_skip_check_adv_addr
  vrrp_garp_interval 0.1
  vrrp_gna_interval 0.1
}

vrrp_script chk_haproxy {
  script "/usr/local/bin/check-haproxy.sh"
  interval 2
  weight -20
}

vrrp_instance haproxy-vip {
  state BACKUP
  priority 100
  interface ens5                       # Network card of current node
  virtual_router_id 60
  advert_int 1
  authentication {
    auth_type PASS
    auth_pass 1111
  }
  unicast_src_ip 192.168.0.173      # The IP address of this machine
  unicast_peer {
    192.168.0.154                         # The IP address of peer machines
  }
  virtual_ipaddress {
    192.168.0.11/32                  # The VIP address
  }
  track_script {
    chk_haproxy
  }
  notify_master "/bin/bash -c '/usr/local/bin/ip-failover.sh promote'"
  notify_backup "/bin/bash -c '/usr/local/bin/ip-failover.sh demote'"

}
```

---

## Node-2


## 🧠 HAProxy Configuration (`/etc/haproxy/haproxy.cfg`)

```conf
global
      maxconn 100
defaults
      log global
      mode tcp
      retries 2
      timeout client 30m
      timeout connect 4s
      timeout server 30m
      timeout   check   5s
listen stats
      mode http
      bind *:7000
      stats enable
      stats uri /
listen postgres
      bind *:5000
      option httpchk
      http-check expect status 200
      default-server inter 3s fall 3 rise 2 on-marked-down shutdown-sessions
      server node1 192.168.0.249:5432 maxconn 100   check   port 8008
      server node2 192.168.0.248:5432 maxconn 100   check   port 8008
      server node3 192.168.0.21:5432 maxconn 100   check   port 8008
```

---

## 🧪 Health Check Script (`/usr/local/bin/check-haproxy.sh`)

```bash
#!/bin/bash

if systemctl is-active --quiet haproxy; then
  exit 0
else
  exit 1
fi
```

---

## 🔄 Failover Script (`/usr/local/bin/ip-failover.sh`)

```bash
#!/bin/bash
set -euo pipefail

ACTION="${1:-}"
VIP_TO_MOVE="192.168.0.11"
REGION="ap-southeast-1"
LOG_FILE="/var/log/ip-failover.log"

timestamp() { date "+%Y-%m-%d %H:%M:%S"; }
log() { echo "$(timestamp) $1" | tee -a "$LOG_FILE"; }

fetch_metadata() {
  TOKEN=$(curl -s --fail -X PUT "http://169.254.169.254/latest/api/token" \
    -H "X-aws-ec2-metadata-token-ttl-seconds: 60") || return 1
  INSTANCE_ID=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
    http://169.254.169.254/latest/meta-data/instance-id) || return 1
  MAC=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
    http://169.254.169.254/latest/meta-data/network/interfaces/macs/ | head -n1 | sed 's:/$::')
  INTERFACE_ID=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
    http://169.254.169.254/latest/meta-data/network/interfaces/macs/${MAC}/interface-id) || return 1
  IFACE=$(ip route get 1 | awk '{print $5; exit}')
}

if ! fetch_metadata; then
  log "❌ Metadata fetch failed."
  exit 1
fi

case "$ACTION" in
  promote)
    log "🔁 PROMOTING: Assigning VIP $VIP_TO_MOVE to ENI $INTERFACE_ID"
    aws ec2 assign-private-ip-addresses \
      --network-interface-id "$INTERFACE_ID" \
      --private-ip-addresses "$VIP_TO_MOVE" \
      --allow-reassignment \
      --region "$REGION" \
      >> "$LOG_FILE" 2>&1 && log "✅ VIP assigned."

    ip a | grep -q "$VIP_TO_MOVE" || ip addr add "$VIP_TO_MOVE/32" dev "$IFACE"
    ;;
  demote)
    log "🔁 DEMOTING: Removing VIP $VIP_TO_MOVE from $IFACE"
    ip addr del "$VIP_TO_MOVE/32" dev "$IFACE" 2>/dev/null || true
    ;;
  *)
    log "⚠️ Unknown action. Usage: $0 [promote|demote]"
    exit 1
    ;;
esac
```

```bash
chmod +x /usr/local/bin/check-haproxy.sh
chmod +x /usr/local/bin/ip-failover.sh
chown root:root /usr/local/bin/check-haproxy.sh
chown root:root /usr/local/bin/ip-failover.sh
```

---

## ⚙️ Keepalived Configuration (`/etc/keepalived/keepalived.conf`)

```conf
global_defs {
  script_user root
  enable_script_security
  router_id HAPROXY_NODE_1
  vrrp_skip_check_adv_addr
  vrrp_garp_interval 0.1
  vrrp_gna_interval 0.1
}

vrrp_script chk_haproxy {
  script "/usr/local/bin/check-haproxy.sh"
  interval 2
  weight -20
}

vrrp_instance haproxy-vip {
  state BACKUP
  priority 100
  interface enX0                       # Network card
  virtual_router_id 60
  advert_int 1
  authentication {
    auth_type PASS
    auth_pass 1111
  }
  unicast_src_ip 192.168.0.154      # The IP address of this machine
  unicast_peer {
    192.168.0.173                         # The IP address of peer machines
  }
  virtual_ipaddress {
    192.168.0.11/32                  # The VIP address
  }
  track_script {
    chk_haproxy
  }
  notify_master "/bin/bash -c '/usr/local/bin/ip-failover.sh promote'"
  notify_backup "/bin/bash -c '/usr/local/bin/ip-failover.sh demote'"

}
```

---
## ✅ systemd Timer & Service

>> ✅ systemd Service

`/etc/systemd/system/ip-failover.service`

```bash
[Unit]
Description=Floating IP failover for AWS EC2
Wants=network-online.target
After=network.target network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/ip-failover.sh
```


>> ✅ systemd Timer

`/etc/systemd/system/ip-failover.timer`

```bash
[Unit]
Description=Run IP failover check every 10 seconds

[Timer]
OnBootSec=30s
OnUnitActiveSec=10s
AccuracySec=1s
Unit=ip-failover.service

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable --now ip-failover.timer

systemctl list-timers ip-failover.timer
```

---


## ✅ Final Checks

* [x] Ensure scripts are **executable**: `chmod +x /usr/local/bin/*.sh`
* [x] Ensure `aws` CLI has permissions via IAM Role (for ENI reassignment)
* [x] `keepalived` logs: `journalctl -u keepalived -f`
* [x] Log output: `tail -f /var/log/ip-failover.log`

---

## 🧪 Test Failover

```bash
# when you use this command to kill the haproxy, then you have to restart the keepalived service.
killall haproxy

systemctl restart keepalived.service
systemctl status keepalived.service

# or

systemctl stop haproxy
```

{: .important}
> Always verify the logs on both the nodes.


✅ The other node should promote itself and assign the VIP automatically to the standby node interface & keepalived will assign the `192.168.0.11/32` VIP to internally.

verify using
```bash
# check the interface ip address on standby node
ip a
```

---

Log Output:-

## Node-2 logs for the first time failover

```log
2025-05-23 07:27:55 ⚠️ Unknown action. Usage: /usr/local/bin/ip-failover.sh [promote|demote]
2025-05-23 07:28:01 🔁 PROMOTING: Assigning VIP 192.168.0.11 to ENI eni-0461916992c3ca810
{
    "NetworkInterfaceId": "eni-0461916992c3ca810",
    "AssignedPrivateIpAddresses": [
        {
            "PrivateIpAddress": "192.168.0.11"
        }
    ],
    "AssignedIpv4Prefixes": []
}
2025-05-23 07:28:03 ✅ VIP assigned.
2025-05-23 07:28:05 ⚠️ Unknown action. Usage: /usr/local/bin/ip-failover.sh [promote|demote]
```


## Node-1 logs for second time failover

```log
tail -f /var/log/ip-failover.log
    "NetworkInterfaceId": "eni-0adcd911889e73a70",
    "AssignedPrivateIpAddresses": [
        {
            "PrivateIpAddress": "192.168.0.11"
        }
    ],
    "AssignedIpv4Prefixes": []
}
2025-05-23 07:25:42 ✅ VIP assigned.
2025-05-23 07:25:50 ⚠️ Unknown action. Usage: /usr/local/bin/ip-failover.sh [promote|demote]
2025-05-23 07:26:00 ⚠️ Unknown action. Usage: /usr/local/bin/ip-failover.sh [promote|demote]
```


Go to AWS Console, there also, you can verify, the seconday IP address assigned to the Instances. It will auto reassign to the standby node based on the Haproxy status.

---

✅ Conclusion
By combining **HAProxy**, **Keepalived**, and **AWS Elastic IP reassignment**, you've built a robust, highly available Active-Standby setup without relying on external load balancers. This floating IP pattern ensures that:

* Your application remains accessible during node failures.

* VIP movement is automatic and verifiable.

* Failover and recovery are both OS and cloud-native.

This approach provides a lightweight, infrastructure-aware method of high availability—perfect for PostgreSQL and other TCP services on EC2. Be sure to monitor logs and IAM permissions, and refine your health checks for production-grade resilience.


<!-- https://kubesphere.io/docs/v3.4/installing-on-linux/high-availability-configurations/set-up-ha-cluster-using-keepalived-haproxy/ -->