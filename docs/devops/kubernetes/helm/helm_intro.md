---
title: What is HELM | Why We Need HELM | Create HELM Chart?
layout: default
parent: Kubernetes Projects
nav_order: 9
permalink: /docs/devops/kubernetes/helm
description: Documentation for What is HELM, Why We Need HELM, and How to Create a HELM Chart.
---

# What is HELM | Why We Need HELM | Create HELM Chart?

Helm is a package manager for Kubernetes applications. It is a CNCF-graduated project (Cloud Native Computing Foundation) and is actively maintained by the community.

## Key Capabilities of Helm

Helm simplifies Kubernetes application deployment and management by offering the following capabilities:

- Creating Helm charts from scratch
- Packaging charts for distribution
- Managing repositories for chart storage
- Installing and uninstalling charts in Kubernetes clusters
- Handling the release cycle of installed charts

## Why Do We Need HELM?

Deploying applications on Kubernetes requires managing multiple resources such as pods, services, deployments, and replica sets. Each of these requires YAML manifest files. As applications grow in complexity, maintaining and managing these manifest files becomes cumbersome. Helm solves this problem by packaging Kubernetes resources into reusable charts.

## Features of Helm

A **Helm Chart** is a collection of YAML files that describe Kubernetes resources, making deployment and management easier. Helm provides the following benefits:

- Simplifies defining, installing, and upgrading complex applications
- Allows easy versioning, sharing, and publishing of charts
- Enables using and modifying pre-existing charts from repositories instead of creating new ones from scratch
- Packages multiple Kubernetes YAML manifests into a single deployable unit
- Allows searching for charts in Artifact Hub or Helm Hub

## Advantages of HELM Charts

- **Manages complexity** – Reduces manual effort by bundling manifests into a single chart
- **Easy to share** – Charts can be shared via public or private repositories
- **Simplifies upgrades** – Upgrading applications is seamless
- **Rollback capability** – Easily revert to previous versions when needed

## Installing HELM

Helm can be installed using a binary release or an automated script.

### Install Helm from Binary:

1. Download the latest Helm binary from [Helm Official Docs](https://helm.sh/docs/intro/install/).
2. Extract the folder.
3. Move the binary to the desired destination (e.g., `/usr/local/bin/helm`).

### Install Helm via Script:

```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

## Creating Your First HELM Chart

Open a terminal and run the following command to create a Helm chart for your service:

```bash
helm create hello-world
```

Navigate to the newly created directory:

```bash
cd hello-world
```

## Structure of a HELM Chart

```bash
hello-world
├── charts
├── Chart.yaml
├── templates
│   ├── deployment.yaml
│   ├── _helpers.tpl
│   ├── hpa.yaml
│   ├── ingress.yaml
│   ├── NOTES.txt
│   ├── serviceaccount.yaml
│   ├── service.yaml
│   └── tests
│       └── test-connection.yaml
└── values.yaml
```

## Basic HELM Commands

```bash
helm search              # Search for Helm charts
helm search hub          # Search charts in Artifact Hub
helm search repo         # Search charts in a repository
helm install             # Install a Helm chart
helm install <release_name> <chart_name>  # Install a chart with a release name
helm status <release_name>  # Check the status of a release
helm upgrade <release_name> <chart_name>  # Upgrade an installed chart
helm rollback <release_name> <revision>  # Rollback to a previous version
helm uninstall <release_name>  # Uninstall a Helm release
helm list               # List all installed releases
```

By leveraging Helm, you can streamline Kubernetes application deployment and management, making it more efficient and scalable.

