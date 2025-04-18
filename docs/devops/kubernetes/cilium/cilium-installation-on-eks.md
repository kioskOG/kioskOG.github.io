---
title: Install Cilium & Hubble on EKS
layout: home
parent: Introduction to Cilium & Hubble
grand_parent: Kubernetes Projects
nav_order: 1
permalink: /docs/devops/kubernetes/cilium/cilium-installation-on-eks/
description: Documentation for Install Cilium & Hubble on EKS.
---

![cilium](../images/cilium.png)

## Table of Contents
- [Cilium Installation](#cilium-installation)
- [Components of Cilium](#components-of-cilium)
    - [Agent](#1-agent)
    - [Cilium CLI](#2-cilium-cli)
    - [Operator](#3-operator)
    - [CNI Plugin](#4-cni-plugin)
- [Hubble Components](#hubble-components)
    - [Server](#1-server)
    - [Relay](#2-relay)
    - [Client (CLI)](#3-client-cli)
    - [Graphical UI (GUI)](#4-graphical-ui-gui)
- [What is eBPF?](#what-is-ebpf)
- [Data Store](#data-store)
    - [Kubernetes CRDs (Default)](#1-kubernetes-crds-default)
    - [Key-Value Store](#2-key-value-store)
- [Installation Steps](#installation-steps)
    - [Install Cilium with Helm](#install-cilium-with-helm)
    - [Post-Installation Steps](#post-installation-steps)
    - [Validate the Installation](#validate-the-installation)
- [Enable Hubble](#enable-hubble)
- [Access the Hubble UI](#access-the-hubble-ui)
- [References](#references)

# Cilium Installation

## Components of Cilium

### 1. **Agent**
- Runs on each node in the cluster.
- Listens for events from orchestration systems like Kubernetes to detect when containers start or stop.
- Manages the eBPF program used by the Linux kernel to control all network access in and out of containers.

### 2. **Cilium CLI**
- A command-line tool installed with the Cilium agent.
- Interacts with the REST API of the Cilium agent on the same node.
- Used to inspect the state and status of the local agent and access eBPF maps for validation.

### 3. **Operator**
- Manages cluster-wide duties that only need to be handled once per cluster.
- Runs as a Kubernetes deployment.

### 4. **CNI Plugin**
- The `cilium-cni` plugin is invoked by Kubernetes when a pod is scheduled or terminated on a node.
- Interacts with the Cilium API to configure networking, load balancing, and network policies for the pod.

---

## Hubble Components

### 1. **Server**
- Runs on each node and retrieves eBPF-based visibility from Cilium.
- Embedded into the Cilium agent for high performance and low overhead.
- Provides a gRPC service for retrieving flow data and Prometheus metrics.

### 2. **Relay**
- A standalone component (`hubble-relay`) aware of all running Hubble servers.
- Provides cluster-wide visibility by connecting to the gRPC APIs of the servers.

### 3. **Client (CLI)**
- The `hubble` CLI connects to the gRPC API of either the Hubble relay or the local server to retrieve flow events.

### 4. **Graphical UI (GUI)**
- The `hubble-ui` provides a graphical representation of service dependencies and connectivity maps by leveraging relay-based visibility.

---

## What is eBPF?
- eBPF is a Linux kernel bytecode interpreter initially introduced for network packet filtering.
- It has evolved to include features like packet mangling, forwarding, and encapsulation.
- eBPF programs run at various kernel hooking points (e.g., incoming/outgoing packets) for high efficiency, with safety ensured by an in-kernel verifier.

---

## Data Store
Cilium uses a data store to propagate state between agents.

### 1. **Kubernetes CRDs (Default)**
- Stores data using Kubernetes Custom Resource Definitions (CRDs).
- Default choice for configurations and state propagation.

### 2. **Key-Value Store**
- Used optionally to improve scalability and optimize storage.
- Supported key-value store: **etcd**.

---

## Remove kube-proxy iptable entires from each node
* With root permissions ensure that iptable entries pertinent to kube-proxy are removed.
    - This is done to clear out AWS-VPC-CNI related rules.

```bash
iptables-save | grep -v KUBE | iptables-restore

iptables-save | grep -E -v 'AWS-SNAT-CHAIN|AWS-CONNMARK-CHAIN' | iptables-restore
```

{: .note}
> Updated as of 27/06/2024 with inputs from Isovalent team member- Scott Lowe.**
> If you provision an EKS cluster without the AWS-VPC-CNI plugin, then you don’t need to do the above step.


## Installation Steps

### Add the Helm Repository
```bash
helm repo add cilium https://helm.cilium.io/
```

### Update `aws-node` DaemonSet for Cilium
```bash
kubectl -n kube-system patch daemonset aws-node --type='strategic' -p='{"spec":{"template":{"spec":{"nodeSelector":{"io.cilium/aws-node-enabled":"true"}}}}}'
```

***********************
### Install Cilium with Helm
***********************


{: .important}
> * You can install Cilium in either `ENI mode` or `Overlay mode` on an EKS cluster.
> * In case of ENI mode, Cilium will manage ENIs instead of VPC CNI, so the `aws-node` DaemonSet has to be patched to prevent conflict behavior.

```bash
API_SERVER_IP=<your_api_server_FQDN>
API_SERVER_PORT=<your_api_server_port>


helm install cilium cilium/cilium --version 1.16.6 \
  --namespace kube-system \
  --set eni.enabled=true \
  --set ipam.mode=eni \
  --set egressMasqueradeInterfaces=eth+ \
  --set routingMode=native \
  --set kubeProxyReplacement=true \
  --set prometheus.enabled=true \
  --set hubble.relay.enabled=true \
  --set hubble.ui.enabled=true \
  --set operator.prometheus.enabled=true \
  --set hubble.enabled=true \
  --set hubble.metrics.enableOpenMetrics=true \
  --set hubble.metrics.enabled="{dns,drop,tcp,flow,port-distribution,icmp,httpV2:exemplars=true;labelsContext=source_ip,source_namespace,source_workload,destination_ip,destination_namespace,destination_workload,traffic_direction}" \
  --set k8sServiceHost=$API_SERVER_IP \
  --set k8sServicePort=$API_SERVER_PORT
```

#### Example Output
```yaml
NAME: cilium
LAST DEPLOYED: Mon Jan 27 15:24:04 2025
NAMESPACE: kube-system
STATUS: deployed
REVISION: 1
TEST SUITE: None

NOTES:
You have successfully installed Cilium with Hubble.
Your release version is 1.16.6.
For help, visit https://docs.cilium.io/en/v1.16/gettinghelp
```

### Validate that the Cilium agent is running in the desired mode
```bash
kubectl -n kube-system exec ds/cilium -- cilium status | grep KubeProxyReplacement
```

#### Example Output
```bash
Defaulted container "cilium-agent" out of: cilium-agent, config (init), mount-cgroup (init), apply-sysctl-overwrites (init), mount-bpf-fs (init), clean-cilium-state (init), install-cni-binaries (init)
KubeProxyReplacement:    True   [eth0   10.36.144.230 fe80::af:2ff:fe17:6fd9 (Direct Routing), eth1   10.36.144.119 fe80::69:39ff:fe87:85ff, eth2   10.36.144.39 fe80::73:42ff:fe95:9eb7]
```


{: .warning}
> If you face an issue where hubble-relay throwing below error
>
```yaml
eric@makaka ~/W/D/p/r/k0s> kubectl logs -n kube-system hubble-relay-cd85c8f55-f2mgb 
level=info msg="Starting server..." options="{peerTarget:hubble-peer.kube-system.svc.cluster.local:443 dialTimeout:5000000000 retryTimeout:30000000000 listenAddress::4245 log:0x40002a2150 serverTLSConfig:<nil> insecureServer:true clientTLSConfig:0x400000c0a8 clusterName:default insecureClient:false observerOptions:[0xc44c80 0xc44da0]}" subsys=hubble-relay
level=warning msg="Failed to create peer client for peers synchronization; will try again after the timeout has expired" error="context deadline exceeded" subsys=hubble-relay target="hubble-peer.kube-system.svc.cluster.local:443"
level=warning msg="Failed to create peer client for peers synchronization; will try again after the timeout has expired" error="context deadline exceeded" subsys=hubble-relay target="hubble-peer.kube-system.svc.cluster.local:443"
level=warning msg="Failed to create peer client for peers synchronization; will try again after the timeout has expired" error="context deadline exceeded" subsys=hubble-relay target="hubble-peer.kube-system.svc.cluster.local:443"
```
>
> Then try to use below helm


```bash
API_SERVER_IP=<your_api_server_FQDN>
API_SERVER_PORT=<your_api_server_port>

helm upgrade cilium cilium/cilium --version 1.16.6 \
  --namespace kube-system \
  --set cluster.name="bellatrix" \
  --set cluster.id=0 \
  --set eni.enabled=true \
  --set ipam.mode=eni \
  --set egressMasqueradeInterfaces=eth+ \
  --set routingMode=native \
  --set kubeProxyReplacement=true \
  --set prometheus.enabled=true \
  --set hubble.tls.enabled=false \
  --set hubble.relay.enabled=true \
  --set hubble.tls.auto.enabled=false \
  --set hubble.ui.enabled=true \
  --set operator.prometheus.enabled=true \
  --set hubble.enabled=true \
  --set hubble.metrics.enableOpenMetrics=true \
  --set hubble.metrics.enabled="{dns,drop,tcp,flow,port-distribution,icmp,httpV2:exemplars=true;labelsContext=source_ip,source_namespace,source_workload,destination_ip,destination_namespace,destination_workload,traffic_direction}" \
  --set k8sServiceHost=$API_SERVER_IP \
  --set k8sServicePort=$API_SERVER_PORT
```


## Post-Installation Steps

### Restart Unmanaged Pods
If you did not create a cluster with the nodes tainted with the taint node.cilium.io/agent-not-ready, then unmanaged pods need to be restarted manually. Restart all already running pods which are not running in host-networking mode to ensure that Cilium starts managing them. This is required to ensure that all pods which have been running before Cilium was deployed have network connectivity provided by Cilium and NetworkPolicy applies to them:


```bash
kubectl get pods --all-namespaces -o custom-columns=NAMESPACE:.metadata.namespace,NAME:.metadata.name,HOSTNETWORK:.spec.hostNetwork --no-headers=true | grep '<none>' | awk '{print "-n "$1" "$2}' | xargs -L 1 -r kubectl delete pod
```

## Validate the Installation
You can monitor as Cilium and all required components are being installed:

<details markdown="block">
<summary>Manually</summary>

```bash
kubectl -n kube-system get pods --watch
```

{: .note}
> It may take a couple of minutes for all components to come up.

{: .important}
> You can deploy the `connectivity-check` to test connectivity between pods. It is recommended to create a separate namespace for this.

## Test Connectivity

```bash
kubectl create ns cilium-test # Create a namespace for testing
kubectl apply -n cilium-test -f https://raw.githubusercontent.com/cilium/cilium/1.16.6/examples/kubernetes/connectivity-check/connectivity-check.yaml # Deploy the connectivity check
```

It will deploy a series of deployments which will use various connectivity paths to connect to each other. Connectivity paths include with and without service load-balancing and various network policy combinations. The pod name indicates the connectivity variant and the readiness and liveness gate indicates success or failure of the test:


```bash
$ kubectl get pods -n cilium-test
NAME                                                     READY   STATUS    RESTARTS   AGE
echo-a-76c5d9bd76-q8d99                                  1/1     Running   0          66s
echo-b-795c4b4f76-9wrrx                                  1/1     Running   0          66s
echo-b-host-6b7fc94b7c-xtsff                             1/1     Running   0          66s
host-to-b-multi-node-clusterip-85476cd779-bpg4b          1/1     Running   0          66s
host-to-b-multi-node-headless-dc6c44cb5-8jdz8            1/1     Running   0          65s
pod-to-a-79546bc469-rl2qq                                1/1     Running   0          66s
pod-to-a-allowed-cnp-58b7f7fb8f-lkq7p                    1/1     Running   0          66s
pod-to-a-denied-cnp-6967cb6f7f-7h9fn                     1/1     Running   0          66s
pod-to-b-intra-node-nodeport-9b487cf89-6ptrt             1/1     Running   0          65s
pod-to-b-multi-node-clusterip-7db5dfdcf7-jkjpw           1/1     Running   0          66s
pod-to-b-multi-node-headless-7d44b85d69-mtscc            1/1     Running   0          66s
pod-to-b-multi-node-nodeport-7ffc76db7c-rrw82            1/1     Running   0          65s
pod-to-external-1111-d56f47579-d79dz                     1/1     Running   0          66s
pod-to-external-fqdn-allow-google-cnp-78986f4bcf-btjn7   1/1     Running   0          66s
```

{: .note}
> If you deploy the connectivity check to a single node cluster, pods that check multi-node functionalities will remain in the Pending state. This is expected since these pods need at least 2 nodes to be scheduled successfully.


{: .important}
> Check the EKS nodes for any iptable entries related to kube-proxy
```bash
[root@ip-10-36-128-139 ~]# iptables-save | grep -c KUBE-SVC
0
[root@ip-10-36-128-139 ~]# iptables-save | grep -c KUBE-SEP
0
```

</details> 

<details markdown="block"> <summary>Via Cilium CLI</summary>

### Install Cilium CLI
[Install cilium cli](https://docs.cilium.io/en/stable/installation/k8s-install-helm/#validate-the-installation)

```bash
cilium version --client
```

### To validate that Cilium has been properly installed, you can run
```bash
cilium status --wait
```
![cilium status](../images/cilium-status.png)


### Run the following command to validate that your cluster has proper network connectivity:

```bash
cilium connectivity test
```

### Example output
```bash
ℹ️  Monitor aggregation detected, will skip some flow validation steps
✨ [k8s-cluster] Creating namespace for connectivity check...
(...)
---------------------------------------------------------------------------------------------------------------------
📋 Test Report
---------------------------------------------------------------------------------------------------------------------
✅ 69/69 tests successful (0 warnings)
```
</details>


## Enable Hubble
There are 2 ways
1. Using helm
2. Cilium Cli

<details markdown="block"> <summary>Via HELM</summary>
Upgrade Cilium to enable Hubble components:

```bash
helm upgrade cilium cilium/cilium --version 1.16.6 \
   --namespace kube-system \
   --reuse-values \
   --set hubble.relay.enabled=true \
   --set hubble.ui.enabled=true
```

### Check the status

```bash
cilium status
kubectl get pods -n kube-system
kubectl get pods,svc -n kube-system
```

![get pods](../images/get-pods.png)

![cilium status hubble enable](../images/cilium-status-hubble-enable.png)

### Access the Hubble UI

```bash
kubectl port-forward service/hubble-ui -n kube-system 8080:80
```

</details>


<details markdown="block"> <summary>Via Cilium CLI</summary>

```bash
cilium hubble enable
```

### Install the Hubble Client
[Install hubble client](https://docs.cilium.io/en/stable/observability/hubble/setup/#install-the-hubble-client)

### Validate Hubble API Access
To access the Hubble API, create a port forward to the Hubble service from your local machine. This will allow you to connect the Hubble client to the local port 4245 and access the Hubble Relay service in your Kubernetes cluster.

```bash
cilium hubble port-forward&
```

Now you can validate that you can access the Hubble API via the installed CLI:

```bash
hubble status
```

### Example Output
```yaml
Forwarding from 0.0.0.0:4245 -> 4245
Forwarding from [::]:4245 -> 4245
```

### Example Output
```yaml
Healthcheck (via localhost:4245): Ok
Current/Max Flows: 11917/12288 (96.98%)
Flows/s: 11.74
Connected Nodes: 3/3
```

**You can also query the flow API and look for flows:**
```bash
hubble observe
```

{: .note}
> If you port forward to a port other than `4245`, make sure to use the `--server` flag or `HUBBLE_SERVER` environment variable to set the Hubble server address (default: `localhost:4245`). For more information, check out Hubble CLI’s help message by running `hubble help status` or `hubble help observe` as well as `hubble config` for configuring Hubble CLI.

</details>



## How can we ensure that kube-proxy is not installed post a Kubernetes version upgrade?

* You can also optionally validate that kube-proxy is not installed as an add-on a subsequent kubernetes upgrade.

* As you can see in this example below, the EKS cluster is upgraded from k8s version 1.27 to k8s version 1.29 and we don’t see kube-proxy being enabled as an add-on.

```bash
eksctl upgrade cluster --name cluster1 --region ap-southeast-2 --version 1.29 --approve

eksctl get nodegroup ng-1 --region ap-southeast-2 --cluster=cluster1
CLUSTER  NODEGROUP STATUS CREATED   MIN SIZE MAX SIZE DESIRED CAPACITY INSTANCE TYPE IMAGE ID ASG NAME     TYPE
cluster1 ng-1  ACTIVE 2024-03-10T16:13:06Z 2  2  2   m5.large AL2_x86_64 eks-ng-1-54c71491-cd91-5c20-0e4c-bb39fea7a7b7 managed

eksctl upgrade nodegroup \
  --name=ng-1 \
  --cluster=cluster1 \
  --region=ap-southeast-2 \
  --kubernetes-version=1.29
```

## Validate that the Cilium agent is running in the desired mode

```bash
kubectl -n kube-system exec ds/cilium -- cilium status | grep KubeProxyReplacement
```

#### Example Output
```bash
Defaulted container "cilium-agent" out of: cilium-agent, config (init), mount-cgroup (init), apply-sysctl-overwrites (init), mount-bpf-fs (init), clean-cilium-state (init), install-cni-binaries (init)
KubeProxyReplacement:    True   [eth0   10.36.144.230 fe80::af:2ff:fe17:6fd9 (Direct Routing), eth1   10.36.144.119 fe80::69:39ff:fe87:85ff, eth2   10.36.144.39 fe80::73:42ff:fe95:9eb7]
```


## Validate that kube-proxy is not present as a daemonset post the upgrade.

```bash
kubectl get ds -A

NAMESPACE     NAME       DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR                     AGE
kube-system   aws-node   0         0         0       0            0           io.cilium/aws-node-enabled=true   8d
kube-system   cilium     2         2         2       2            2           kubernetes.io/os=linux            19h
```

```bash
kubectl get cm -A

NAMESPACE         NAME                                                   DATA   AGE
default           kube-root-ca.crt                                       1      8d
kube-node-lease   kube-root-ca.crt                                       1      8d
kube-public       kube-root-ca.crt                                       1      8d
kube-system       amazon-vpc-cni                                         2      8d
kube-system       aws-auth                                               1      8d
kube-system       cilium-config                                          105    19h
kube-system       coredns                                                1      8d
kube-system       extension-apiserver-authentication                     6      8d
kube-system       kube-apiserver-legacy-service-account-token-tracking   1      8d
kube-system       kube-root-ca.crt                                       1      8d
```


## References
[Cilium](https://docs.cilium.io/en/stable/installation/k8s-install-helm/)

[Hubble](https://docs.cilium.io/en/stable/observability/hubble/setup/#hubble-setup)

<!-- https://medium.com/@amitmavgupta/cilium-installing-cilium-in-eks-with-no-kube-proxy-86f54a56c360 -->


## 🌟Conclusion 🌟
Hopefully, this post gave you a good overview of how to install Cilium on EKS in ENI or Overlay mode with no kube-proxy. Thank you for Reading !! 🙌🏻😁📃, see you in the next blog.