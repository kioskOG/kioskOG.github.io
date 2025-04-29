---
title: Helmfile
layout: default
parent: Kubernetes Projects
nav_order: 14
permalink: /docs/devops/kubernetes/helmfile/
description: Documentation on Helmfile Introduction.
---

# Helmfile: Declarative Helm Chart Management for Kubernetes

Helmfile is a powerful layer on top of Helm that helps you define, install, and manage multiple Helm chart deployments in a **declarative** way. It’s especially useful for managing **multiple environments**, **complex dependencies**, and **large-scale applications** across Kubernetes clusters.

---

## 🧭 Learning Plan

1. Introduction to Helmfile
2. Core Concepts: `helmfile.yaml`
3. Basic Helmfile Commands
4. Advanced Features and Examples
5. Best Practices and Resources

---

## 📘 Introduction to Helmfile

Imagine you're managing a large application deployed on Kubernetes using Helm. You might have several Helm charts for different components like your web server, database, and caching system. Using plain Helm, you'd have to run Helm commands for each of these charts individually – installing, upgrading, uninstalling, and keeping track of their configurations. It can get quite cumbersome, like trying to conduct each instrument in an orchestra separately!

That's where Helmfile comes in. Think of Helmfile as the conductor of your Helm orchestra. It allows you to define all your Helm chart releases in a single file, usually named `helmfile.yaml`. This file tells Helmfile which charts to deploy, their configurations, and even their dependencies. With a single Helmfile command, you can then manage all these releases together.

So, instead of running multiple `helm install` or `helm upgrade` commands, you run a single `helmfile apply` command, and Helmfile takes care of the rest, ensuring all your charts are deployed in the desired state.

Using plain Helm, managing multiple charts manually becomes cumbersome—especially in large-scale environments. Helmfile solves this by letting you declare **what** should be deployed and **how**, using a single `helmfile.yaml`. 

Helmfile acts as the **conductor** of your Helm-based deployments:
- One command to manage multiple Helm charts.
- Declarative management of configurations.
- Easier CI/CD automation.

---

## ⚙️ Installation Guide

### 🔧 Install Helmfile (Linux/macOS)

1. Download from [GitHub Releases](https://github.com/helmfile/helmfile/releases)
2. Rename and move it to your system path:

```bash
mv helmfile_linux_amd64 helmfile
chmod +x helmfile
sudo mv helmfile /usr/local/bin/
```

3. Verify installation:
```bash
helmfile --version
```

---

## 🚀 Your First Helmfile Project

### Step 1: Create a Helm Chart
```bash
helm create helloworld
```

### Step 2: Create `helmfile.yaml`
```yaml
releases:
  - name: helloworld
    chart: ./helloworld
    installed: true
```

> Set `installed: true` to ensure the chart is deployed

### Step 3: Sync the Helm Chart
```bash
helmfile sync
```

### Step 4: Verify Release
```bash
helm list -A
```

### Step 5: Uninstall via Helmfile
Change `installed: false` and run:
```bash
helmfile sync
```

---

## 📁 helmfile.yaml: Core Structure

### Key Sections:

- **repositories**: Define external Helm chart sources
- **releases**: Define what to deploy and how
- **values**: Inline or file-based overrides

### Example:
```yaml
repositories:
  - name: bitnami
    url: https://charts.bitnami.com/bitnami

releases:
  - name: nginx-app
    namespace: default
    chart: bitnami/nginx
    version: 19.1.1
    values:
      - service:
          type: LoadBalancer
  - name: postgres-db
    namespace: staging
    chart: bitnami/postgresql
    version: 16.6.3
    values:
      - auth:
          username: "dbuser"
          password: "secret"
          replicationPassword: "replica123"
```

---

## 🔥 Advanced Features

| Feature                              | Description                          |
|-------------------------------------|--------------------------------------|
| `environments:`                     | Manage stage/dev/prod configs        |
| `secrets:`                          | Support for SOPS-encrypted secrets   |
| `helmfile apply`                    | Show diff before applying            |
| `helmfile template`                | Render charts locally                 |
| `selectors:`                        | Target specific releases by label    |

---

## 🏁 Conclusion

Helmfile turns Helm into a **declarative**, **CI/CD-friendly** deployment solution for Kubernetes. It eliminates manual errors and simplifies configuration management for teams.

> Adopt Helmfile to streamline your multi-chart Helm workflows and confidently scale your Kubernetes operations.

---

## 📚 Further Resources

- 📘 [Helmfile GitHub](https://github.com/helmfile/helmfile)
- 📘 [Helm Docs](https://helm.sh/docs/)
- 📘 [Helm Chart Best Practices](https://helm.sh/docs/chart_best_practices/)

Happy Helming with Helmfile! 🛳️

