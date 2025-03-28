---
title: Kubernetes NodePort and iptables rules
layout: default
parent: Kubernetes Projects
nav_order: 11
permalink: /docs/devops/kubernetes/Kubernetes-NodePort-and-iptables-rules/
description: Detailed documentation on Kubernetes NodePort and iptables rules.
---

# Kubernetes NodePort and iptables rules

While there are many excellent posts explaining Kubernetes networking and how services work, I struggled to find a practical starting point to analyze how a NodePort service actually operates under the hood. In this post, I’ll break down the iptables rules managed by kube-proxy to route traffic for a NodePort service.


what I have learned by digging a little deeper into the iptables rules for NodePort type services and share answers to the following questions I came across while working on kube-proxy:

- What happens when a non-kubernetes process starts using a port that’s allocated as a NodePort to a service?

- Does the service endpoint continue to route traffic to pods if kube-proxy (configured in `iptables mode`) process dies on the node?


## Background

Kubernetes allows a few ways to expose applications to the world outside the kubernetes cluster through the concept of services `(ClusterIP, NodePort, LoadBalancer, ExternalName)`. In our setup at work, we expose a few of our apps through NodePort type services. Also, `kube-proxy` is the kubernetes component that powers the services concept and we run it in `iptables mode` (this is the default mode).


## A little about NodePort

>> If you set the type field to NodePort, the Kubernetes control plane allocates a port from a range specified by `--service-node-port-range` flag (`default: 30000-32767`). Each node proxies that port (the same port number on every Node) into your Service.


This means that if we have a `service` with NodePort `30000`, a request to `<kubernetes-node-ip>:30000` will get routed to our app. Under normal circumstances kube-proxy [binds and listens](https://github.com/kubernetes/kubernetes/blob/7de3f938c82a7c0538bdfac5bb9b3cad50c30eae/pkg/proxy/iptables/proxier.go#L1638) on all NodePorts to ensure these ports stay reserved and no other processes can use them.


## err…a non-kubernetes is using the NodePort!!

Sometime back at work, one of our kubernetes nodes was rebooted and as it was added back to the cluster, we saw errors in kube-proxy logs - `bind: address already in use`:


```bash
I0707 20:57:38.648179       1 proxier.go:701] Syncing iptables rules
E0707 20:57:38.679876       1 proxier.go:1072] can't open "nodePort for default/nginx:" (:30450/tcp), skipping this nodePort: listen tcp :30450: bind: address already in use
```

This error meant that a port allocated as a NodePort to a service was already in use by another process. We found out that there was a non-kubernetes process using this NodePort as a client port to connect to a remote server. This happened due of a race condition post node reboot. This other process started using the NodePort before kube-proxy could bind and listen on the port to reserve it.


## Will the NodePort on this node still route traffic to the pods?

This was the immediate question that popped up in our heads as the NodePort allocated to a service was now being used by a non-kubernetes process. kube-proxy creates iptables rules in the `PREROUTING` chain in `nat` table.

Because of these rules, the answer to the above question is - Yes! Traffic sent to the NodePort on this node will still correctly be routed to the backend pods it targets.

The NodePort would also continue to work if another process was listening on the port as a server and not just using it as a client. Though, would our `HTTP GET` requests reach this server? More on this later.


## Kube-proxy iptables rules

In iptables mode, kube-proxy creates iptables rules for kubernetes services which ensure that the request to the `service` gets routed (and load balanced) to the appropriate pods.

These iptables rules also help answer the second question mentioned above. As long as these iptables rules exist, requests to `services` will get routed to the appropriate pods even if kube-proxy process dies on the node. Endpoints for new `services` won ’t work from this node, however, since kube-proxy process won ’t create the iptables rules for it.


### Rules in the `PREROUTING` chain

there are rules in the PREROUTING chain of the nat table for kubernetes services. As per ![iptables rules evaluation order](https://upload.wikimedia.org/wikipedia/commons/3/37/Netfilter-packet-flow.svg) rules in the PREROUTING chain are the first ones to be consulted as a packet enters the linux kernel’s networking stack.


Rules created by kube-proxy in the **PREROUTING** chain help determine if the packet is meant for a local socket on the node or if it should be forwarded to a pod. It is these rules that ensure that the request to `<kubernetes-node-ip>:<NodePort>` continue to get routed to pods even if the NodePort is in use by another process.

![flow-chart](/docs/devops/kubernetes/Kubernetes-Traffic-Policies/images/flow-chart.png)


>> I walk through a setup that reproduces the above scenario and examine the iptables rules that make this work.

## Setting up a Kubernetes cluster
I created a kubernetes cluster.

## Creating pods and a NodePort Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  namespace: default
spec:
  type: NodePort
  ports:
  - port: 80
    name: http
    targetPort: 80
  selector:
    app: nginx

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  namespace: default
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx
        name: nginx
        ports:
        - containerPort: 80
          name: http
```

```bash
$ kubectl get po -l app=nginx --show-labels -o wide NAME
READY   STATUS    RESTARTS   AGE   IP            NODE                                NOMINATED NODE   READINESS GATES   LABELS nginx-5bc759676c-x9bwg   1/1     Running   0          24d   10.244.0.11   eks-nodepool1-22391620-vmss000000   <none ><none >app=nginx,pod-template-hash=5bc759676c
```


```bash
$ kubectl get svc nginx -o wide NAME               
TYPE       CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE   SELECTOR 
nginx   NodePort   10.0.237.3   <none >80:30450/TCP   24d   app=nginx
```

```bash
$ root@lazarus-master:~# curl localhost:30450 -I
HTTP/1.1 200 OK
Server: nginx/1.27.4
Date: Fri, 28 Mar 2025 06:31:55 GMT
Content-Type: text/html
Content-Length: 615
Last-Modified: Wed, 05 Feb 2025 11:06:32 GMT
Connection: keep-alive
ETag: "67a34638-267"
Accept-Ranges: bytes
```

```bash
root@lazarus-master:~# curl -ssL localhost:30450 |grep -i title
<title>Welcome to nginx!</title>
```

### Examining iptables rules for a NodePort service

SSH into an EKS worker node directly.

Let ’s look at the iptables rules for the **nginx** service.

After ssh ’ing into the kubernetes worker node, let ’s look at the **PREROUTING** chain in the **nat** table. (`PREROUTING` [chain exists](https://www.digitalocean.com/community/tutorials/a-deep-dive-into-iptables-and-netfilter-architecture#which-chains-are-implemented-in-each-table) in `raw` , `nat` and `mangle` tables, however, kube-proxy only creates `PREROUTING` chain rules in `nat` table)

```bash
$ iptables -t nat -L -n -v
$ sudo iptables -t nat -L PREROUTING | column -t
Chain          PREROUTING  (policy  ACCEPT)
target         prot        opt      source    destination
KUBE-SERVICES  all         --       anywhere  anywhere     /*        kubernetes  service   portals  */
DOCKER         all         --       anywhere  anywhere     ADDRTYPE  match       dst-type  LOCAL
```

> There ’s a `KUBE-SERVICES` chain in the target that ’s created by kube-proxy. Let ’s list the rules in that chain.

```bash
sudo iptables -t nat -L KUBE-SERVICES -n  | column -t
Chain                      KUBE-SERVICES  (2   references)
target                     prot           opt  source          destination
KUBE-MARK-MASQ             tcp            --   !10.244.0.0/16  10.0.202.188  /*  kube-system/healthmodel-replicaset-service:  cluster  IP          */     tcp   dpt:25227
KUBE-SVC-KA44REDDIFNWY4W2  tcp            --   0.0.0.0/0       10.0.202.188  /*  kube-system/healthmodel-replicaset-service:  cluster  IP          */     tcp   dpt:25227
KUBE-MARK-MASQ             udp            --   !10.244.0.0/16  10.0.0.10     /*  kube-system/kube-dns:dns                     cluster  IP          */     udp   dpt:53
KUBE-SVC-TCOU7JCQXEZGVUNU  udp            --   0.0.0.0/0       10.0.0.10     /*  kube-system/kube-dns:dns                     cluster  IP          */     udp   dpt:53
KUBE-MARK-MASQ             tcp            --   !10.244.0.0/16  10.0.0.10     /*  kube-system/kube-dns:dns-tcp                 cluster  IP          */     tcp   dpt:53
KUBE-SVC-ERIFXISQEP7F7OF4  tcp            --   0.0.0.0/0       10.0.0.10     /*  kube-system/kube-dns:dns-tcp                 cluster  IP          */     tcp   dpt:53
KUBE-MARK-MASQ             tcp            --   !10.244.0.0/16  10.0.190.160  /*  kube-system/kubernetes-dashboard:            cluster  IP          */     tcp   dpt:80
KUBE-SVC-XGLOHA7QRQ3V22RZ  tcp            --   0.0.0.0/0       10.0.190.160  /*  kube-system/kubernetes-dashboard:            cluster  IP          */     tcp   dpt:80
KUBE-MARK-MASQ             tcp            --   !10.244.0.0/16  10.0.195.6    /*  kube-system/metrics-server:                  cluster  IP          */     tcp   dpt:443
KUBE-SVC-LC5QY66VUV2HJ6WZ  tcp            --   0.0.0.0/0       10.0.195.6    /*  kube-system/metrics-server:                  cluster  IP          */     tcp   dpt:443
KUBE-MARK-MASQ             tcp            --   !10.244.0.0/16  10.0.129.119  /*  default/azure-vote-back:                     cluster  IP          */     tcp   dpt:6379
KUBE-SVC-JQ4VBJ2YWO22DDZW  tcp            --   0.0.0.0/0       10.0.129.119  /*  default/azure-vote-back:                     cluster  IP          */     tcp   dpt:6379
KUBE-MARK-MASQ             tcp            --   !10.244.0.0/16  10.0.237.3    /*  default/nginx:                    cluster  IP          */     tcp   dpt:80
KUBE-SVC-GHSLGKVXVBRM4GZX  tcp            --   0.0.0.0/0       10.0.237.3    /*  default/nginx:                    cluster  IP          */     tcp   dpt:80
KUBE-MARK-MASQ             tcp            --   !10.244.0.0/16  10.0.0.1      /*  default/kubernetes:https                     cluster  IP          */     tcp   dpt:443
KUBE-SVC-NPX46M4PTMTKRN6Y  tcp            --   0.0.0.0/0       10.0.0.1      /*  default/kubernetes:https                     cluster  IP          */     tcp   dpt:443
KUBE-NODEPORTS             all            --   0.0.0.0/0       0.0.0.0/0     /*  kubernetes                                   service  nodeports;  NOTE:  this  must       be  the  last  rule  in  this  chain  */  ADDRTYPE  match  dst-type  LOCAL
```
                    

The last terget in the `KUBE-SERVICES` chain is the `KUBE-NODEPORTS` chain. Since the service we created is of type `NodePort` , let ’s list the rules in `KUBE-NODEPORTS` chain.

```bash
$ sudo iptables -t nat -L KUBE-NODEPORTS -n  | column -t
Chain                      KUBE-NODEPORTS  (1   references)
target                     prot            opt  source       destination
KUBE-MARK-MASQ             tcp             --   0.0.0.0/0    0.0.0.0/0    /*  default/nginx:  */  tcp  dpt:30450
KUBE-SVC-GHSLGKVXVBRM4GZX  tcp             --   0.0.0.0/0    0.0.0.0/0    /*  default/nginx:  */  tcp  dpt:30450
```
                    

We can see that the above targets are for packets destined to our NodePort **30450** . The comments also show the namespace/pod name - `default/nginx` . For requests originating from outside the cluster and destined to our app running as a pod, the `KUBE-MARK-MASQ` rule marks the packet to be altered later in the `POSTROUTING` chain to use SNAT (source network address translation) to rewrite the source IP as the node IP (so that other hosts outside the pod network can reply back).

Since `KUBE-MARK-MASQ` target is to [MASQUERADE](https://www.frozentux.net/iptables-tutorial/chunkyhtml/x4422.html) packets later, let ’s follow the `KUBE-SVC-GHSLGKVXVBRM4GZX` chain to further examine our service.

```bash
$ sudo iptables -t nat -L KUBE-SVC-GHSLGKVXVBRM4GZX  -n | column -t
Chain                      KUBE-SVC-GHSLGKVXVBRM4GZX  (2   references)
target                     prot                       opt  source       destination
KUBE-SEP-QXDNOBCCLOXLV7LV  all                        --   0.0.0.0/0    0.0.0.0/0

$ sudo iptables -t nat -L KUBE-SEP-QXDNOBCCLOXLV7LV  -n | column -t
Chain           KUBE-SEP-QXDNOBCCLOXLV7LV  (1   references)
target          prot                       opt  source       destination
KUBE-MARK-MASQ  all                        --   10.244.0.11  0.0.0.0/0
DNAT            tcp                        --   0.0.0.0/0    0.0.0.0/0    tcp  to:10.244.0.11:80
```
                    

Here we see the [DNAT (Destination Network Address Translation)](https://www.frozentux.net/iptables-tutorial/chunkyhtml/x4033.html) target is used to rewrite the destination of the packet destined to port **30450** to our pod **10.244.0.11:80** . We can verify the **podIP** and **containerPort** of our pod as follows:

```bash
$ kubectl get po nginx-5bc759676c-x9bwg -o json | jq -r '[.status.podIP, .spec.containers[0].ports[0].containerPort | tostring] | join(":")'
10.244.0.11:80
```             


### Verify kube-proxy is listening on NodePort

Under normal circumstances kube-proxy binds and listens on all NodePorts to ensure these ports stay reserved and no other processes can use them. We can verify this on the above kubernetes node:

```bash
$ sudo lsof -i:30450
COMMAND     PID USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
hyperkube 11558 root    9u  IPv6 95841832      0t0  TCP *:30450 (LISTEN)

$ ps -aef | grep -v grep | grep 11558
root      11558  11539  0 Jul02 ?        00:06:37 /hyperkube kube-proxy --kubeconfig=/var/lib/kubelet/kubeconfig --cluster-cidr=10.244.0.0/16 --feature-gates=ExperimentalCriticalPodAnnotation=true --v=3
```
                    

kube-proxy is listening on NodePort **30450** .

### Create a non-kubernetes process use the NodePort

Now let ’s kill kube-proxy process and start a server that listens on this NodePort instead.

```bash
$ kill -9 11558
$ python -m SimpleHTTPServer 30450 &
[1] 123578

$ sudo lsof -i:30450
COMMAND    PID      USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
python  123578 ssm    3u  IPv4 95854834      0t0  TCP *:30450 (LISTEN)

$ ps -aef | grep -v grep | grep 123578
eksus+ 123578  85107  0 00:49 pts/5    00:00:00 python -m SimpleHTTPServer 30450
```
                    

### Where will the requests to NodePort be routed - pod or the non-kubernetes process?

While the python process is listening on port **30450** , also allocated as a `NodePort` to our kubernetes service, the iptables rules in the **PREROUTING** chain will route all requests to port **30450** to our pod. We can verify this as below:

```bash
$ curl -I -XGET localhost:30450
HTTP/1.1 200 OK
Server: nginx/1.13.7
Date: Wed, 08 Jul 2020 00:53:09 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 950
Connection: keep-alive
```
                    

As we send a `GET` request to port **30450** , we receive a response from an nginx server hosting **Azure Voting App** , like we saw when [kube-proxy was listening on port **30450**](#creating-pods-and-a-nodeport-service) .

```
$ curl -sSL localhost:30450 | grep title

<title>Welcome to nginx!</title>
```

## Summary

### Following Packet Flow Through iptables

### 1. PREROUTING Chain:

* When a request arrives at `NodeIP:30007`, it follows this path:

The request hits iptables `PREROUTING`, where a rule sends it to KUBE-SERVICES.

### 2. DNAT Rule (Destination NAT):

* The `KUBE-NODEPORTS` chain applies `DNAT` (destination network address translation), mapping traffic from `30007` to the actual pod’s `ClusterIP:8080`.

### 3. POSTROUTING & MASQUERADE:

* If the request originated outside the cluster, `MASQUERADE` ensures the source IP is rewritten, so responses return properly.

