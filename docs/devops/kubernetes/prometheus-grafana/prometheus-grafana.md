---
title: Prometheus & Grafana
layout: default
parent: Kubernetes Projects
nav_order: 8
permalink: /docs/devops/kubernetes/prometheus-grafana/
---

# Prometheus & Grafana Setup in AWS EKS with Persistent Storage using EBS CSI Driver

## Table of Contents
- [Prometheus & Grafana Setup in AWS EKS with Persistent Storage using EBS CSI Driver](#prometheus--grafana-setup-in-aws-eks-with-persistent-storage-using-ebs-csi-driver)
  - [Prerequisites](#prerequisites)
  - [Install EBS CSI Driver](#step-1-install-ebs-csi-driver)
    - [Create IAM Policy](#1-create-iam-policy)
    - [Get the IAM role Worker Nodes using and Associate this policy to that role](#2-get-the-iam-role-worker-nodes-using-and-associate-this-policy-to-that-role)
    - [Associate IAM Policy to Worker Node IAM Role](#3-associate-iam-policy-to-worker-node-iam-role)
    - [Deploy Amazon EBS CSI Driver](#deploy-amazon-ebs-csi-driver)
  - [Create Storage Class](#step-2-create-storage-class)
  - [Add Prometheus and Grafana Helm Repositories](#step-3-add-prometheus-and-grafana-helm-repositories)
  - [Install Prometheus using Helm](#step-4-install-prometheus-using-helm)
  - [Install Grafana using Helm](#step-5-install-grafana-using-helm)
  - [Verify Persistent Storage](#step-6-verify-persistent-storage)
  - [Optional: Add Prometheus as a Data Source in Grafana](#step-7-optional-add-prometheus-as-a-data-source-in-grafana)
  - [Conclusion](#conclusion)


This guide outlines the steps for setting up Prometheus and Grafana on an Amazon Elastic Kubernetes Service (EKS) cluster with persistent storage using the EBS CSI driver and Helm.

---
## Prerequisites

1. AWS CLI installed and configured
2. kubectl installed
3. Helm installed
4. EKS Cluster set up
5. IAM permissions to manage EBS and EKS resources

---
## Step 1: Install EBS CSI Driver

The EBS CSI driver allows Kubernetes to manage AWS EBS volumes dynamically.

### We will divide it in 3 parts.
1. Create IAM Policy for EBS
2. Associate IAM Policy to Worker Node IAM Role
3. Install EBS CSI Driver


### 1. Create IAM policy

* Go to Services -> IAM
* Create a Policy
* Select JSON tab and copy paste the below JSON

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:AttachVolume",
        "ec2:CreateSnapshot",
        "ec2:CreateTags",
        "ec2:CreateVolume",
        "ec2:DeleteSnapshot",
        "ec2:DeleteTags",
        "ec2:DeleteVolume",
        "ec2:DescribeInstances",
        "ec2:DescribeSnapshots",
        "ec2:DescribeTags",
        "ec2:DescribeVolumes",
        "ec2:DetachVolume"
      ],
      "Resource": "*"
    }
  ]
}
```

* Review the same in Visual Editor
* Click on Review Policy
* Name: `Amazon_EBS_CSI_Driver`
* Description: `Policy for EC2 Instances to access Elastic Block Store`
* Click on `Create Policy`


### 2. Get the IAM role Worker Nodes using and Associate this policy to that role

Get Worker node IAM Role ARN

```bash
kubectl -n kube-system describe configmap aws-auth
```

### 3. Associate IAM Policy to Worker Node IAM Role

Go to Services -> IAM -> Roles - Search for role with name and open it - Click on Permissions tab - Click on Attach Policies - Search for Amazon_EBS_CSI_Driver and click on Attach Policy

### Deploy Amazon EBS CSI Driver
```sh
kubectl apply -k "github.com/kubernetes-sigs/aws-ebs-csi-driver/deploy/kubernetes/overlays/stable/?ref=master"
```

Verify the installation:

```sh
kubectl get pods -n kube-system | grep ebs
```

---
## Step 2: Create Storage Class

Create a storage class for persistent storage using the EBS CSI driver.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gp2-standard
  annotations: 
    storageclass.kubernetes.io/is-default-class: "true" 
provisioner: ebs.csi.aws.com   # Internal-provisioner
allowVolumeExpansion: true
parameters:
  type: gp2
reclaimPolicy: Retain
volumeBindingMode: WaitForFirstConsumer
```

Apply the storage class:

```sh
kubectl apply -f ebs-sc.yaml
```

---
## Step 3: Add Prometheus and Grafana Helm Repositories

```sh
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
```

---
## Step 4: Install Prometheus using Helm

Create a `prometheus-values.yaml` file for Prometheus configuration:

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
```

Install Prometheus with Helm:

```sh
helm install prometheus prometheus-community/prometheus \
  --namespace monitoring \
  --create-namespace \
  -f prometheus-values.yaml
```

Verify the installation:

```sh
kubectl get pods -n monitoring
```

---
## Step 5: Install Grafana using Helm

Create a `grafana-values.yaml` file for Grafana configuration:

```yaml
persistence:
  enabled: true
  storageClassName: gp2
  accessModes:
    - ReadWriteOnce
  size: 10Gi

adminUser: admin
adminPassword: admin
service:
  type: ClusterIP
```

{: .warning}
> Change the `adminUser` & `adminPassword` as required.

Install Grafana with Helm:

```sh
helm install grafana grafana/grafana \
  --namespace monitoring \
  -f grafana-values.yaml
```

Expose Grafana service:

```sh
kubectl get svc -n monitoring grafana
kubectl port-forward svc/grafana 3000:80 -n monitoring
```

Access Grafana at [http://localhost:3000](http://localhost:3000) and log in with the configured credentials.

---
## Step 6: Verify Persistent Storage

Check the Persistent Volume Claims (PVCs):

```sh
kubectl get pvc -n monitoring
```

{: .note}
> Ensure that the PVCs are bound and the corresponding EBS volumes are created in AWS.

---
## Step 7: Optional: Add Prometheus as a Data Source in Grafana

1. Navigate to `Configuration` > `Data Sources in Grafana`.
2. Add a new `Prometheus` data source with the following:
3. URL: `http://prometheus-server.monitoring.svc.cluster.local:80`
4. Save and Test.

---
## Conclusion

You have successfully set up Prometheus and Grafana on an AWS EKS cluster with persistent storage using the EBS CSI driver. This setup ensures that your monitoring data is persisted and survives pod restarts or node failures.
