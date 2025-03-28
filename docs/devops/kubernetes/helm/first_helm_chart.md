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
data:
  myvalue: "Hello World"
```

The leading dot before `Release` indicates that we start with the top-most namespace for this scope (we'll talk about scope in a bit). So we could read .Release.Name as "start at the top namespace, find the Release object, then look inside of it for an object called Name".

The Release object is one of the built-in objects for Helm.

```bash
helm install first ./mychart
helm get manifest first
```

{: .note}
> When you want to test the template rendering, but not actually install anything, you can use 
> `helm install --debug --dry-run first ./mychart`. This will render the templates. But instead of installing the chart, it will return the rendered template to you so you can see the output:

Using `--dry-run` will make it easier to test your code, but it won't ensure that Kubernetes itself will accept the templates you generate. It's best not to assume that your chart will install just because `--dry-run` works.


## Built-in Objects

Objects can be simple, and have just one value. Or they can contain other objects or functions. For example, the Release object contains several objects (like Release.Name) and the Files object has a few functions.

## 1. Release

* `Release`: This object describes the release itself. It has several objects inside of it:
  * `Release.Name`: The release name
  * `Release.Namespace`: The namespace to be released into (if the manifest doesn’t override)
  * `Release.IsUpgrade`: This is set to true if the current operation is an upgrade or rollback.
  * `Release.IsInstall`: This is set to true if the current operation is an install.
  * `Release.Revision`: The revision number for this release. On install, this is 1, and it is incremented with each upgrade and rollback.
  * `Release.Service`: The service that is rendering the present template. On Helm, this is always `Helm`.


* Values: Values passed into the template from the values.yaml file and from user-supplied files. By default, Values is empty.

* Chart: The contents of the Chart.yaml file. Any data in Chart.yaml will be accessible here. For example {{ .Chart.Name }}-{{ .Chart.Version }} will print out the mychart-0.1.0

[Available chart fields](https://helm.sh/docs/topics/charts/#the-chartyaml-file)

### Example

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
    {{ .Chart.Version }}: {{ .Chart.Name }}
data:
  myvalue: "Hello World"
```

## 2. Subcharts

* `Subcharts:` This provides access to the scope (.Values, .Charts, .Releases etc.) of subcharts to the parent. For example `.Subcharts.mySubChart.myValue` to access the `myValue` in the `mySubChart` chart.


## 3. Files

{{: .note}}
> Sometimes it is desirable to import a file that is not a template and inject its contents without sending the contents through the template renderer.

Helm provides access to files through the `.Files` object. Before we get going with the template examples, though, there are a few things to note about how this works:

* It is okay to add extra files to your Helm chart. These files will be bundled. Be careful, though. Charts must be smaller than 1M because of the storage limitations of Kubernetes objects.

* Some files cannot be accessed through the `.Files` object, usually for security reasons.
  * Files in `templates/` cannot be accessed.
  * Files excluded using `.helmignore` cannot be accessed.
  * Files outside of a Helm application subchart, including those of the parent, cannot be accessed

* Charts do not preserve `UNIX` mode information, so file-level permissions will have no impact on the availability of a file when it comes to the `.Files` object.


* Files: This provides access to all non-special files in a chart. While you cannot use it to access templates, you can use it to access other files in the chart.
  * `Files.Get` is a function for getting a file by name (`.Files.Get config.ini`)
  * `Files.GetBytes` is a function for getting the contents of a file as an array of bytes instead of as a string. This is useful for things like images.
  * `Files.Glob` is a function that returns a list of files whose names match the given shell glob pattern.
  * `Files.Lines` is a function that reads a file line-by-line. This is useful for iterating over each line in a file.
  * `Files.AsSecrets` is a function that returns the file bodies as Base 64 encoded strings.
  * `Files.AsConfig` is a function that returns file bodies as a YAML map.

### Accessing Files Inside Templates

Let's write a template that reads three files into our ConfigMap. To get started, we will add three files to the chart, putting all three directly inside of the `mychart/` directory.

```bash
touch config1.toml && echo "message = Hello from config 1" >> config1.toml
touch config2.toml && echo "message = Hello from config 2" >> config2.toml
touch config3.toml && echo "message = Hello from config 3" >> config3.toml
```

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  {{- $files := .Files }}
  {{- range tuple "config1.toml" "config2.toml" "config3.toml" }}
  {{ . }}: |-
    {{ $files.Get . }}
  {{- end }}
```

We create a `$files` variable to hold a reference to the `.Files` object. We also use the `tuple` function to create a list of files that we loop through. Then we print each file name (`{{ . }}: |-`) followed by the contents of the file `{{ $files.Get . }}`.


### Path helpers
When working with files, it can be very useful to perform some standard operations on the file paths themselves. To help with this, Helm imports many of the functions from Go's `path` package for your use. They are all accessible with the same names as in the Go package, but with a lowercase first letter. **For example, Base becomes base**, etc.

The imported functions are:
```bash
- Base
- Dir
- Ext
- IsAbs
- Clean
```

a). Base (Filename Extraction)
  * Gets the last element of the path (i.e., filename).

```go
{{- $filePath := "config1.toml" }}
{{- $fileName := base $filePath }}
Filename: {{ $fileName }}
```

b). Dir (Parent Directory Extraction)
  * Gets the directory portion of a path.

```go
{{- $dirName := dir "configs/config1.toml" }}
Directory: {{ $dirName }}
```

c). Ext (File Extension Extraction)
  * Gets the file extension.

```go
{{- $ext := ext "configs/config1.toml" }}
Extension: {{ $ext }}
```

d). IsAbs (Check if Path is Absolute)
  * Checks if a path is absolute.

```go
path_type: |- # Added key `path_type`
    {{- if isAbs "/etc/config1.toml" }}
    This is an absolute path.
    {{- else }}
    This is a relative path.
    {{- end }}
```

e). Clean (Normalize the Path)
  * Removes redundant `slashes` or `..` components.

```go
{{- $cleanedPath := clean "configs//../config1.toml" }}
Cleaned Path: {{ $cleanedPath }}
```

{{: .important}}
> All the path helpers with example

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
data:
  {{- $files := .Files }}
  {{- range tuple "config1.toml" "config2.toml" "config3.toml" }}
  {{ . }}: |-
    {{ $files.Get . }}
  {{- end }}

  # base
  {{- $filePath := "config1.toml" }}
  {{- $fileName := base $filePath }}
  Filename: {{ $fileName }}
  
  # isAbs
  path_type: |- # Added key `path_type`
    {{- if isAbs "/etc/config1.toml" }}
    This is an absolute path.
    {{- else }}
    This is a relative path.
    {{- end }}
  
  # ext
  {{- $ext := ext "configs/config1.toml" }}
  Extension: {{ $ext }}
  
  # dir
  {{- $dirName := dir "configs/config1.toml" }}
  Directory: {{ $dirName }}
  
  #clean
  {{- $cleanedPath := clean "configs//../config1.toml" }}
  Cleaned Path: {{ $cleanedPath }}
```


### Encoding
You can import a file and have the template base-64 encode it to ensure successful transmission:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ .Release.Name }}-secret
type: Opaque
data:
  token: |-
    {{ .Files.Get "config1.toml" | b64enc }}
```


## 4. Capabilities

* `Capabilities`: This provides information about what capabilities the Kubernetes cluster supports.
   * `Capabilities.APIVersions` is a set of versions.
   * `Capabilities.APIVersions.Has` $version indicates whether a version (e.g., `batch/v1`) or resource (e.g., apps/v1/Deployment) is available on the cluster.
   * `Capabilities.KubeVersion` and `Capabilities.KubeVersion.Version` is the Kubernetes version.
   * `Capabilities.KubeVersion.Major` is the Kubernetes major version.
   * `Capabilities.KubeVersion.Minor` is the Kubernetes minor version.
   * `Capabilities.HelmVersion` is the object containing the Helm Version details, it is the same output of helm version.
   * `Capabilities.HelmVersion.Version` is the current Helm version in semver format.
   * `Capabilities.HelmVersion.GitCommit` is the Helm git sha1.
   * `Capabilities.HelmVersion.GitTreeState` is the state of the Helm git tree.
   * `Capabilities.HelmVersion.GoVersion` is the version of the Go compiler used.

Example:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ .Release.Name }}-configmap
  labels:
    kube-version: {{ .Capabilities.KubeVersion }}
    kube-versionn: {{ .Capabilities.KubeVersion.Version }}
data:
  {{- $files := .Files }}
  {{- range tuple "config1.toml" "config2.toml" "config3.toml" }}
  {{ . }}: |-
    {{ $files.Get . | nindent 4 }}
  {{- end }}
```

## Template

* `Template`: Contains information about the current template that is being executed
  * `Template.Name`: A namespaced file path to the current template (e.g. `mychart/templates/mytemplate.yaml`)
  * `Template.BasePath`: The namespaced path to the templates directory of the current chart (e.g. `mychart/templates`).
