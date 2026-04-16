---
title: "API Gateway vs Kubernetes Service Load Balancing."
category: "microservices"
order: 11
---

### API Gateway:
- **Layer 7 (Application)**: Operates on HTTP/REST.
- **Role**: Routing, Authentication, Rate Limiting, Request Transformation.
- Cross-cutting concerns for ALL services.

### Kubernetes Service:
- **Layer 4 (Transport)**: Handles TCP/UDP traffic.
- **Role**: Discovers service instances (Pods) and distributes traffic among them based on basic IP/Port logic.

### Comparison:
API Gateway is for **Business Logic/Edge concerns**, while Kubernetes Services are for **Internal Connectivity** and infrastructure-level scaling.
