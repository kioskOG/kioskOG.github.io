---
title: Knative Serving Monitoring
layout: home
parent: Knative
grand_parent: Kubernetes Projects
nav_order: 2
permalink: /docs/devops/kubernetes/knative/knative-serving-monitoring/
description: Documentation on knative serving monitoring
---

# Table of Contents

1. [Collecting Metrics in Knative](#collecting-metrics-in-knative)
2. [Setting up the Prometheus Stack](#setting-up-the-prometheus-stack)
3. [Edit knative-serving obserability configmap](#edit-knative-serving-obserability-configmap)
4. [ServiceMonitors](#servicemonitors)
5. [Rollout deployment](#rollout-deployment)
6. [Prometheus & Grafana access](#prometheus--grafana-access)
7. [Import Grafana dashboards](#import-grafana-dashboards)
8. [References](#references)


# Collecting Metrics in Knative


Knative supports different popular tools for collecting metrics:

* Prometheus

* OpenTelemetry Collector

`Grafana` dashboards are available for metrics collected directly with Prometheus.


## Setting up the Prometheus Stack

Install the Prometheus Stack by using Helm:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace -f prometheus-values.yaml
```

>> prometheus-values.yaml

```yaml
server:
  persistentVolume:
    enabled: true
    storageClass: gp2-standard
    size: 10Gi

alertmanager:
  persistentVolume:
    enabled: true
    storageClass: gp2-standard
    size: 2Gi

pushgateway:
  persistentVolume:
    enabled: true
    storageClass: gp2-standard
    size: 5Gi

kube-state-metrics:
  metricLabelsAllowlist:
    - pods=[*]
    - deployments=[app.kubernetes.io/name,app.kubernetes.io/component,app.kubernetes.io/instance]
prometheus:
  prometheusSpec:
    serviceMonitorSelectorNilUsesHelmValues: false
    podMonitorSelectorNilUsesHelmValues: false
grafana:
  persistence:
    enabled: true
    storageClassName: gp2-standard
    accessModes:
      - ReadWriteOnce
    size: 5Gi

  adminUser: admin
  adminPassword: admin
  service:
    type: ClusterIP
```


{: .important}
> You will need to ensure that the helm chart has following values configured, otherwise the `ServiceMonitors/Podmonitors` will not work.
>
```yaml
kube-state-metrics:
  metricLabelsAllowlist:
    - pods=[*]
    - deployments=[app.kubernetes.io/name,app.kubernetes.io/component,app.kubernetes.io/instance]
prometheus:
  prometheusSpec:
    serviceMonitorSelectorNilUsesHelmValues: false
    podMonitorSelectorNilUsesHelmValues: false
```
>

```bash
kubectl get po -n monitoring

NAME                                                     READY   STATUS    RESTARTS   AGE
alertmanager-prometheus-kube-prometheus-alertmanager-0   2/2     Running   0          28h
prometheus-grafana-6b6f5b59c-shbcw                       3/3     Running   0          71m
prometheus-kube-prometheus-operator-549df9cbc6-vhm6l     1/1     Running   0          71m
prometheus-kube-state-metrics-85f5f89d9-28rdq            1/1     Running   0          28h
prometheus-prometheus-kube-prometheus-prometheus-0       2/2     Running   0          28h
prometheus-prometheus-node-exporter-7xz97                1/1     Running   0          46h
prometheus-prometheus-node-exporter-mxhqc                1/1     Running   0          46h
prometheus-prometheus-node-exporter-rsz49                1/1     Running   0          85m
prometheus-prometheus-node-exporter-zksgr                1/1     Running   0          46h
```

```bash
kubectl get svc -n monitoring
NAME                                      TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
alertmanager-operated                     ClusterIP   None             <none>        9093/TCP,9094/TCP,9094/UDP   46h
prometheus-grafana                        ClusterIP   10.100.13.116    <none>        80/TCP                       46h
prometheus-kube-prometheus-alertmanager   ClusterIP   10.100.8.122     <none>        9093/TCP,8080/TCP            46h
prometheus-kube-prometheus-operator       ClusterIP   10.100.54.58     <none>        443/TCP                      46h
prometheus-kube-prometheus-prometheus     ClusterIP   10.100.118.158   <none>        9090/TCP,8080/TCP            46h
prometheus-kube-state-metrics             ClusterIP   10.100.199.121   <none>        8080/TCP                     46h
prometheus-operated                       ClusterIP   None             <none>        9090/TCP                     46h
prometheus-prometheus-node-exporter       ClusterIP   10.100.212.62    <none>        9100/TCP                     46h
```

```bash
kubectl get servicemonitor -n knative-serving
NAME         AGE
activator    47h
autoscaler   47h
controller   47h
webhook      47h
```


## Edit knative-serving obserability configmap

{: .warning}
> You can't use OpenTelemetry Collector and Prometheus at the same time. The default metrics backend is Prometheus. You will need to remove `metrics.backend-destination` and `metrics.request-metrics-backend-destination` keys from the config-observability Configmap to enable Prometheus metrics.

```bash
kubectl get cm config-observability -n knative-serving -o yaml > config-observability.yaml
vim config-observability.yaml
```

> Replace `config-observability.yaml` content with below yaml.

```yaml
apiVersion: v1
data:
  metrics.backend-destination: prometheus
  metrics.reporting-period-seconds: "5"
  metrics.request-metrics-reporting-period-seconds: "5"
  profiling.enable: "false"
  request-metrics-backend-destination: prometheus
kind: ConfigMap
metadata:
  name: config-observability
  namespace: knative-serving
```

```bash
kubectl replace -f config-observability.yaml
kubectl rollout restart deployment -n monitoring
```

## ServiceMonitors

Apply the ServiceMonitors/PodMonitors to collect metrics from Knative.

```yaml
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  labels:
    app: controller
  name: controller
  namespace: knative-serving
spec:
  endpoints:
  - honorLabels: true
    interval: 30s
    path: /metrics
    port: http-metrics
  namespaceSelector:
    matchNames:
    - knative-serving
  selector:
    matchLabels:
      app: controller
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  labels:
    app: autoscaler
  name: autoscaler
  namespace: knative-serving
spec:
  endpoints:
  - honorLabels: true
    interval: 30s
    path: /metrics
    port: http-metrics
  namespaceSelector:
    matchNames:
    - knative-serving
  selector:
    matchLabels:
      app: autoscaler
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  labels:
    app: activator
  name: activator
  namespace: knative-serving
spec:
  endpoints:
  - honorLabels: true
    interval: 30s
    path: /metrics
    port: http-metrics
  namespaceSelector:
    matchNames:
    - knative-serving
  selector:
    matchLabels:
      app: activator
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  labels:
    app: webhook
  name: webhook
  namespace: knative-serving
spec:
  endpoints:
  - honorLabels: true
    interval: 30s
    path: /metrics
    port: http-metrics
  namespaceSelector:
    matchNames:
    - knative-serving
  selector:
    matchLabels:
      app: webhook
---
```

## Rollout deployment
Sometimes Prometheus needs to restart to start scrapping metrics from `ServiceMonitors`.

```bash
kubectl rollout restart deployment -n monitoring
```

## Prometheus & Grafana access

```bash
# Port Forwarding Promotheus
kubectl port-forward service/prometheus-kube-prometheus-prometheus 3000:9090 -n monitoring
# # Port Forwarding Grafana
kubectl port-forward service/prometheus-grafana 3000:80 -n monitoring
```

## Import Grafana dashboards

Grafana dashboards can be imported from the monitoring [repository](https://github.com/knative-extensions/monitoring/tree/main/grafana)


## References

[Service Monitor](https://raw.githubusercontent.com/knative-extensions/monitoring/main/servicemonitor.yaml)
