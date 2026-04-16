---
title: "Kubernetes Auto-scaling: HPA, VPA, and CA."
category: "microservices"
order: 13
---

1. **HPA (Horizontal Pod Autoscaler)**:
- Scales by adding or removing **Pod replicas**.
- Triggered by: CPU/Memory usage or custom metrics.

2. **VPA (Vertical Pod Autoscaler)**:
- Scales by increasing or decreasing **CPU/Memory resources** of existing pods.
- Recommends (or automatically sets) the right resource limits.

3. **CA (Cluster Autoscaler)**:
- Scales by adding or removing **Nodes** (physical/virtual machines) to the cluster if pods cannot be scheduled due to lack of resources.
