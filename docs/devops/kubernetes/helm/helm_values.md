---
title: Helm Values Files
layout: home
parent: What is HELM | Why We Need HELM | Create HELM Chart?
grand_parent: Kubernetes Projects
nav_order: 2
permalink: /docs/devops/kubernetes/helm/helm_values/
description: Documentation for Helm Values Files
---

## Values Files

One of the built-in objects is Values. This object provides access to values passed into the chart. Its contents come from multiple sources:

* The `values.yaml` file in the chart

* If this is a subchart, the `values.yaml` file of a parent chart

* A values file is passed into helm install or helm upgrade with the -f flag (helm install -f myvals.yaml ./mychart)

* Individual parameters are passed with --set (such as helm install --set foo=bar ./mychart)

The list above is in order of specificity: `values.yaml` is the default, which can be overridden by a parent chart's `values.yaml`, which can in turn be overridden by a user-supplied values file, which can in turn be overridden by `--set` parameters.


Values files are plain YAML files. Let's edit `mychart/values.yaml` and then edit our ConfigMap template.

Removing the defaults in `values.yaml`, we'll set just one parameter:

```yaml
favoriteDrink: coffee
```

Examples

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
    kube-version: {{ .Capabilities.KubeVersion }}
    kube-versionn: {{ .Capabilities.KubeVersion.Version }}
data:
  myvalue: "Hello World"
  drink: {{ .Values.favoriteDrink }}
```

> Notice on the last line we access favoriteDrink as an attribute of Values: `{{ .Values.favoriteDrink }}`.

Because `favoriteDrink` is set in the default `values.yaml` file to coffee, that's the value displayed in the template. We can easily override that by adding a `--set` flag in our call to helm install:

```bash
helm install first ./mychart --dry-run --debug --set favoriteDrink=tea
```

Since `--set` has a higher precedence than the default `values.yaml` file, our template generates `drink: tea`.

Values files can contain more structured content, too. For example, we could create a favorite section in our values.yaml file, and then add several keys there:

```yaml
favorite:
  drink: coffee
  food: pizza
```

Now we would have to modify the template slightly:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink }}
  food: {{ .Values.favorite.food }}
```
