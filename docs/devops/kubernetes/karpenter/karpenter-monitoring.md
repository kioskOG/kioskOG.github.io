---
title: Monitoring Karpenter Using Prometheus & Grafana
layout: home
parent: Karpenter
grand_parent: Kubernetes Projects
nav_order: 2
permalink: /docs/devops/kubernetes/karpenter/karpenter-monitoring/
description: Documentation on Karpenter monitoring 
---

# Monitoring Karpenter Using Prometheus & Grafana

{: .note}
> I have used `prometheus-community/kube-prometheus-stack` for `prometheus` & `grafana` deployment.

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
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

## Prometheus & Grafana access

```bash
# Port Forwarding Promotheus
kubectl port-forward service/prometheus-kube-prometheus-prometheus 3000:9090 -n monitoring
# # Port Forwarding Grafana
kubectl port-forward service/prometheus-grafana 3000:80 -n monitoring
```

## Monitoring karpenter
Edit `karpenter.yaml` and add below `ServiceMonitor` configuration to allow prometheus to scrape karpenter metrics.

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: karpenter-monitoring
  namespace: karpenter
  labels:
    helm.sh/chart: karpenter-1.3.3
    app.kubernetes.io/name: karpenter
    app.kubernetes.io/instance: karpenter
    app.kubernetes.io/version: "1.3.3"
    app.kubernetes.io/managed-by: Helm
spec:
  namespaceSelector:
    matchNames:
      - karpenter
  selector:
    matchLabels:
      app.kubernetes.io/name: karpenter
      app.kubernetes.io/instance: karpenter
  endpoints:
  - honorLabels: true
    interval: 30s
    path: /metrics
    port: http-metrics
```

## Grafana Dashboard

[1. Grafana dashboard to display all useful Karpenter metrics](https://grafana.com/grafana/dashboards/20398-karpenter/)
[2. Grafana dashboard to display all useful Karpenter metrics](https://grafana.com/grafana/dashboards/18862-karpenter/)
