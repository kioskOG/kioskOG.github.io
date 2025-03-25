---
title: Helm Template
layout: home
parent: What is HELM | Why We Need HELM | Create HELM Chart?
grand_parent: Kubernetes Projects
nav_order: 1
permalink: /docs/devops/kubernetes/helm/first-helm-chart/
description: Documentation for helm template
---

```bash
helm create mychart
cd mychart
```

The first template we are going to create will be a ConfigMap.

Let's begin by creating a file called `mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mychart
data:
  myvalue: "Hello World"
```

It is just fine to put a plain YAML file like this in the `mychart/templates/` directory. When Helm reads this template, it will simply send it to Kubernetes as-is.

With this simple template, we now have an installable chart. And we can install it like this:

```bash
helm install first ./mychart
```

Using Helm, we can retrieve the release and see the actual template that was loaded.

```bash
helm get manifest first
```

The `helm get manifest` command takes a release name (`first`) and prints out all of the Kubernetes resources that were uploaded to the server.

Now we can uninstall our release: `helm uninstall first`

## Adding a Simple Template Call
Hard-coding the `name:` into a resource is usually considered to be bad practice. Names should be unique to a release. So we might want to generate a name field by inserting the release name.

{: .important}
> The name: field is limited to 63 characters because of limitations to the DNS system. For that reason, release names are limited to 53 characters. Kubernetes 1.3 and earlier limited to only 24 characters (thus 14 character names).

## Let's alter configmap.yaml accordingly.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
```

