

```bash
helm create mychart
cd mychart
```

The first template we are going to create will be a ConfigMap.

Let's begin by creating a file called `mychart/templates/configmap.yaml`:

```yaml
apiVersion: v1
kind: Configmap
metadata:
  name: mychart-configmap
data:
  value: "Hello World"
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