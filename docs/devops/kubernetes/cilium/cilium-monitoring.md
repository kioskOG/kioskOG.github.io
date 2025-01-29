---
title: Cilium Monitoring using Prometheus & Grafana
layout: home
parent: Introduction to Cilium & Hubble
grand_parent: Kubernetes Projects
nav_order: 2
permalink: /docs/devops/kubernetes/cilium/cilium-monitoring/
description: Documentation for Cilium Monitoring using Prometheus & Grafana.
---

# Cilium Monitoring using Prometheus & Grafana

## Table of Contents
- [Cilium Monitoring using Prometheus & Grafana](#cilium-monitoring-using-prometheus--grafana)
  - [We will use 2 approaches](#we-will-use-2-approaches)
  - [Approach 1. If you don’t have an existing Prometheus and Grafana stack running on your Cluster](#approach-1-if-you-dont-have-an-existing-prometheus-and-grafana-stack-running-on-your-cluster)
    - [Install Prometheus & Grafana](#install-prometheus--grafana)
    - [Deploy Cilium and Hubble with metrics enabled](#deploy-cilium-and-hubble-with-metrics-enabled)
    - [Setup Helm repository](#setup-helm-repository)
    - [How to access Grafana](#how-to-access-grafana)
    - [How to access Prometheus](#how-to-access-prometheus)
  - [Approach 2. If you have an existing Prometheus and Grafana stack running on your Cluster](#approach-2-if-you-have-an-existing-prometheus-and-grafana-stack-running-on-your-cluster)
  - [Conclusion](#conclusion)



### We will use 2 approaches
1. If you don’t have an existing Prometheus and Grafana stack running on your Cluster
2. If you have an existing Prometheus and Grafana stack running on your Cluster


## Approach 1. If you don’t have an existing Prometheus and Grafana stack running on your Cluster

## Install Prometheus & Grafana

* **Grafana:** A visualization dashboard with Cilium Dashboard pre-loaded.

* **Prometheus:** a time series database and monitoring system.

```bash
kubectl apply -f https://raw.githubusercontent.com/cilium/cilium/1.16.6/examples/kubernetes/addons/prometheus/monitoring-example.yaml
```

Example Output
```yaml
namespace/cilium-monitoring created
serviceaccount/prometheus-k8s created
configmap/grafana-config created
configmap/grafana-cilium-dashboard created
configmap/grafana-cilium-operator-dashboard created
configmap/grafana-hubble-dashboard created
configmap/grafana-hubble-l7-http-metrics-by-workload created
configmap/prometheus created
clusterrole.rbac.authorization.k8s.io/prometheus configured
clusterrolebinding.rbac.authorization.k8s.io/prometheus created
service/grafana created
service/prometheus created
deployment.apps/grafana created
deployment.apps/prometheus created
```

{: .note}
> This deployment of Prometheus and Grafana will automatically scrape the Cilium and Hubble metrics.

```bash
kubectl get pods -n cilium-monitoring
```

Example output
```yaml
NAME                          READY   STATUS    RESTARTS   AGE
grafana-c84dc68d5-p8nbp       1/1     Running   0          33s
prometheus-868bb5f59d-46772   1/1     Running   0          32s
```


```bash
kubectl -n cilium-monitoring port-forward service/grafana --address 0.0.0.0 --address :: 3000:3000
```

## Deploy Cilium and Hubble with metrics enabled
***Cilium, Hubble, and Cilium Operator*** do not expose metrics by default. Enabling metrics for these services will open ports `9962`, `9965`, and `9963` respectively on all nodes of your cluster where these components are running.

The metrics for Cilium, Hubble, and Cilium Operator can all be enabled independently of each other with the following Helm values:

`prometheus.enabled=true:` Enables metrics for `cilium-agent`.

`operator.prometheus.enabled=true:` Enables metrics for `cilium-operator`.

`hubble.metrics.enabled:` Enables the provided list of Hubble metrics. For Hubble metrics to work, Hubble itself needs to be enabled with `hubble.enabled=true`


### Setup Helm repository:

```bash
helm repo add cilium https://helm.cilium.io/
```

Deploy Cilium via Helm as follows to enable all metrics:

```bash
helm install cilium cilium/cilium --version 1.16.6 \
  --namespace kube-system \
  --reuse-values \
  --set prometheus.enabled=true \
  --set hubble.relay.enabled=true \
  --set hubble.ui.enabled=true \
  --set operator.prometheus.enabled=true \
  --set hubble.enabled=true \
  --set hubble.metrics.enableOpenMetrics=true \
  --set hubble.metrics.enabled="{dns,drop,tcp,flow,port-distribution,icmp,httpV2:exemplars=true;labelsContext=source_ip\,source_namespace\,source_workload\,destination_ip\,destination_namespace\,destination_workload\,traffic_direction}"
```

{: .important}
> If cilium is already installed, use `helm upgrade` instead of `helm install`

## How to access Grafana
Expose the port on your local machine

```bash
kubectl -n cilium-monitoring port-forward service/grafana --address 0.0.0.0 --address :: 3000:3000
```

Access it via your browser: [localhost](http://localhost:3000)

## How to access Prometheus
Expose the port on your local machine

```bash
kubectl -n cilium-monitoring port-forward service/prometheus --address 0.0.0.0 --address :: 9090:9090
```

Access it via your browser: [localhost](http://localhost:3000)


{: .note}
> Refer to [Monitoring & Metrics](https://docs.cilium.io/en/stable/observability/metrics/#metrics) for more details about the individual metrics.


## Approach 2. If you have an existing Prometheus and Grafana stack running on your Cluster

1. Make sure Prometheus is added as a data source in Grafana.
2. Then import below dashboards in Grafana.

- [Cilium Agent Metrics](/docs/devops/kubernetes/cilium/grafana-dashboards/cilium-metrics-grafana-dashboard-1.json)

- [Cilium Operator Metrics](/docs/devops/kubernetes/cilium/grafana-dashboards/cilium-operator-grafana-dashboard-2.json)

- [Hubble Metrics](/docs/devops/kubernetes/cilium/grafana-dashboards/cilium-hubble-grafana-dashboard-3.json)

- [Hubble L7 HTTP Metrics by Workload Metrics](/docs/devops/kubernetes/cilium/grafana-dashboards/cilium-Hubble-L7-HTTP-Metrics-by-Workload.json)

- [Hubble DNS Namespace Metrics](/docs/devops/kubernetes/cilium/grafana-dashboards/hubble-dns-namespace.json)

- [Hubble Network Overview Namespace Metrics](/docs/devops/kubernetes/cilium/grafana-dashboards/hubble-network-overview-namespace.json)



Access Grafana in your browser --> Click on New --> Choose import --> Paste the above jsons one by one --> Click on Load

---
## Conclusion

You have successfully set up Prometheus and Grafana for Cilium.