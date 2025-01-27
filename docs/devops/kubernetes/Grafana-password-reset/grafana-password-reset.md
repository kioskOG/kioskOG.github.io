---
title: Grafana password reset
layout: default
parent: Kubernetes Projects
nav_order: 6
permalink: /docs/devops/kubernetes/Grafana-password-reset/
---

# 🔐 Scenario: Updating the Grafana Admin Password in Kubernetes
## If you're running Grafana in a Kubernetes cluster and need to reset the admin password, follow these simple steps.

### 🚀 Steps to Update the Admin Password
1) **Set the Namespace**: Define the namespace where Grafana is running.
2) **Identify the Pod Name**: Use `kubectl` to fetch the Grafana pod name dynamically.
3) **Reset the Password**: Execute a command inside the Grafana pod to reset the admin password.

```shell
# Define the namespace where Grafana is running
NAMESPACE=monitoring

# Get the Grafana pod name dynamically
POD_NAME=$(kubectl get pods -n "${NAMESPACE}" -o=name | grep grafana | cut -f2 -d/)

# Reset the admin password using the Grafana CLI
kubectl exec -it -n "${NAMESPACE}" "${POD_NAME}" -- /bin/sh -c "/usr/share/grafana/bin/grafana-cli admin reset-admin-password ${POD_NAME}"
```
>> Note: For this example, the new password will be set to the Grafana pod name.


### 🛠 Troubleshooting
* **Problem**: The pod name is not detected.
  **Solution**: Ensure Grafana is running and the NAMESPACE variable is correct.

* **Problem**: The Grafana CLI is not found.
  **Solution**: Verify that the Grafana CLI is installed inside the container and accessible at `/usr/share/grafana/bin/`.


### 🎉 Congratulations!
You've successfully updated the Grafana admin password in Kubernetes. 🚀
