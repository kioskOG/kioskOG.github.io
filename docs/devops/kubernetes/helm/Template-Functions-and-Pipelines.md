---
title: Helm Template Functions and Pipelines
layout: home
parent: What is HELM | Why We Need HELM | Create HELM Chart?
grand_parent: Kubernetes Projects
nav_order: 3
permalink: /docs/devops/kubernetes/helm/Template-Functions-and-Pipelines/
description: Documentation for Helm Template Functions and Pipelines
---

# Template Functions and Pipelines

So far, we've seen how to place information into a template. But that information is placed into the template unmodified. Sometimes we want to transform the supplied data in a way that makes it more useable to us.

Let's start with a best practice: When injecting strings from the `.Values` object into the template, we want to quote these strings. We can do that by calling the `quote` function in the template directive:

>> Values.yaml
```yaml
favorite:
  drink: tea
  food: burger
```

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ quote .Values.favorite.drink }}
  food: {{ quote .Values.favorite.food }}
```

Template functions follow the syntax **functionName arg1 arg2...**. In the snippet above, quote `.Values.favorite.drink` calls the `quote` function and passes it a single argument.


## Pipelines
Pipelines are an efficient way of getting several things done in sequence. Let's rewrite the above example using a pipeline.


```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | quote }}
```

In this example, instead of calling `quote ARGUMENT`, we inverted the order. We "sent" the argument to the function using a pipeline `(|): .Values.favorite.drink | quote`. Using pipelines, we can chain several functions together:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello World"
  drink: {{ .Values.favorite.drink | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

{: .important}
> Inverting the order is a common practice in templates. you will see `.Val | quote` the `quote .Val`. Either practice os fine.


>> When pipelining arguments like this, the result of the first evaluation (.Values.favorite.drink) is sent as the last argument to the function. We can modify the drink example above to illustrate with a function that takes two arguments: repeat COUNT STRING:


```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello From Configmap"
  drink: {{ .Values.favorite.drink | repeat 5 | quote }}
  food: {{ .Values.favorite.food | upper | quote }}

```

> The repeat function will echo the given string the given number of times.


## Using the **default** function

One function frequently used in templates is the `default` function: `default DEFAULT_VALUE GIVEN_VALUE`. This function allows you to specify a default value inside of the template, in case the value is omitted.


```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello From Configmap"
  drink: {{ .Values.favorite.drink | default "coffee" | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

If we run this as normal, we'll get our `tea`, which we have passed in `values.yaml`.
Now, we will remove the favorite drink setting from values.yaml & run the command:

```bash
helm install first --dry-run --debug ./mychart
```

{: .important}
> In an actual chart, all static default values should live in the values.yaml, and should not be repeated using the default command (otherwise they would be redundant). However, the default command is perfect for computed values, which cannot be declared inside values.yaml. For example:

```yaml
drink: {{ .Values.favorite.drink | default (printf "%s-tea" (include "fullname" .)) }}
```

In some places, an `if` conditional guard may be better suited than `default`. We'll see those in the next section.


## Using the lookup function
The `lookup` function may be used to lookup resources in running cluster. The synopsis of the lookup function is
`lookup apiVersion, kind, namespace, name -> resource or resource list`.

```bash
parameter	              type

apiVersion	            string

kind	                  string

namespace	              string

name	                  string
```

Both `name` and `namespace` are optional and can be passed as an empty string `("")`. However, if you're working with a namespace-scoped resource, both `name` and `namespace` must be specified.


>> The following combination of parameters are possible:

```bash
         Behavior	                                                 Lookup function

kubectl get pod mypod -n mynamespace	                   lookup "v1" "Pod" "mynamespace" "mypod"

kubectl get pods -n mynamespace	                         lookup "v1" "Pod" "mynamespace" ""

kubectl get pods --all-namespaces	                       lookup "v1" "Pod" "" ""

kubectl get namespace mynamespace	                       lookup "v1" "Namespace" "" "mynamespace"

kubectl get namespaces	                                 lookup "v1" "Namespace" "" ""
```

When `lookup` returns an object, it will `return a dictionary`. This dictionary can be further navigated to extract specific values.

>> The following example will return the annotations present for the mynamespace object:

(lookup "v1" "Namespace" "mynamespace").metadata.annotations

### Some Scenario on `lookup` function:

1. Let's say you want to create a Deployment that uses a value from an existing ConfigMap named my-config.
  
  a). Create a ConfigMap (Optional, if you don't already have one):

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  myvalue: "Hello From Configmap"
  drink: {{ .Values.favorite.drink | default "coffee" | repeat 5 | quote }}
  food: {{ .Values.favorite.food | upper | quote }}
```

  b). Helm Deployment Template (deployment.yaml):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-deployment
spec:
  replicas: {{ .Values.replicas | default 2 }}
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-container
        image: nginx:latest
        env:
        - name: MY_CONFIG_VALUE
          value: "{{ index (lookup "v1" "ConfigMap" "default" "first-configmap").data "myvalue" }}"
          # value: "{{ (lookup "v1" "ConfigMap" "default" "first-configmap").data.myvalue }}" # or this can also be used.
```


{: important}
> Keep in mind that Helm is not supposed to contact the Kubernetes API Server during a `helm template|install|upgrade|delete|rollback --dry-run` operation. To test lookup against a running cluster, `helm template|install|upgrade|delete|rollback --dry-run=server` should be used instead to allow cluster connection.

```bash
helm template ./mychart --dry-run=server
```

## Operators are functions

For templates, the operators `(eq, ne, lt, gt, and, or and so on)` are all implemented as functions. In pipelines, operations can be grouped with parentheses `((, and ))`.