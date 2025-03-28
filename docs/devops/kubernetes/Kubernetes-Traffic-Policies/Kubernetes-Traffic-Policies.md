---
title: Kubernetes Service Traffic Routing & Traffic Policies
layout: home
parent: Kubernetes NodePort and iptables rules
nav_order: 1
grand_parent: Kubernetes Projects
permalink: /docs/devops/kubernetes/Kubernetes-Traffic-Policies/
description: Detailed documentation on Kubernetes Traffic Policies and routing strategies.
---

# Kubernetes Service Traffic Routing

In Kubernetes, service routing is managed by `kube-proxy`, which traditionally used `iptables`. However, it can also leverage `IPVS` (IP Virtual Server) for more efficient load balancing. The traffic routing mechanism depends on the `kube-proxy` mode, affecting how requests are forwarded to application endpoints.

## kube-proxy Modes

- **`iptables mode`**: The older default mode using iptables rules for packet forwarding.
- **`ipvs mode`**: Uses the IPVS kernel module for high-performance load balancing.
- **`userspace mode`** (deprecated): A less efficient approach that is no longer recommended.

### Routing Algorithms

- **IPVS Algorithms**: Round-Robin, Least Connections, and others.
- **Dependency on kube-proxy Mode**: The routing strategy is determined by the configured `kube-proxy` mode and IPVS settings.

{: .note}
> Default traffic routing can lead to inefficiencies, especially in large or distributed clusters. To address these challenges, Kubernetes provides traffic policies to optimize routing behavior.

## Default Traffic Policy: **Cluster**

By default, traffic is distributed randomly across all available and ready endpoints in the cluster, regardless of node location. While this ensures even load distribution, it may introduce latency in geographically dispersed environments.

## Optimized Traffic Policy: **Local**

The **Local** traffic policy optimizes for latency and efficiency by restricting traffic to endpoints located on the same node as the requesting pod or external traffic capturer (NodePort or LoadBalancer). This minimizes network overhead and improves response times.

### Trade-Offs:
- **Pros**: Reduced latency and optimized performance.
- **Cons**: If no local endpoints are available, traffic is not forwarded, leading to dropped requests.

## Configuration Example

```yaml
apiVersion: v1
kind: Service
metadata:
  name: abc-svc
spec:
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  internalTrafficPolicy: Local
  externalTrafficPolicy: Local
```

{: .important}
> Set either `internalTrafficPolicy` or `externalTrafficPolicy` to control traffic routing independently.

### Traffic Policy Descriptions

#### **Internal Traffic Policy** (Traffic within the cluster):

- **`Cluster` (default)**: Traffic is distributed across all available endpoints, ensuring load balancing but increasing inter-node latency.
- **`Local`**: Traffic stays on the same node, reducing latency but risking dropped requests if no local endpoints exist.

#### **External Traffic Policy** (Traffic from outside the cluster):

- **`Cluster` (default)**: Requests are routed across all nodes with available endpoints.
- **`Local`**: Requests are handled only by the node receiving them, preserving the client’s source IP but risking drops if no local endpoints are available.

By carefully selecting the appropriate traffic policy, Kubernetes users can optimize performance, reduce latency, and balance availability within their cluster environment.

## Considerations

* `Latency-sensitive applications`: The Local traffic policy is particularly useful for applications that are sensitive to latency, such as real-time games or video streaming.

* `Geographic distribution`: If your cluster is geographically distributed, consider using the Cluster traffic policy with additional techniques like edge locations or content delivery networks (CDNs) to optimize performance.

* `Application requirements`: Evaluate your application’s specific requirements and choose the traffic policy that best aligns with your needs.


## Learn more about IPtables

[IPtables](/docs/devops/Linux/Iptables/iptables/)

[IPVS Load Balancer](/docs/devops/Linux/Iptables/ipvs-loadbalancer/)
