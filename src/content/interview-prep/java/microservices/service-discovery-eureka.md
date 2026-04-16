---
title: "What is Service Discovery and why do we need it?"
category: "microservices"
order: 15
---

### The Problem:
In microservices, instances are dynamic (assigned different IPs/Ports on every deployment/restart). Hardcoding URLs is impossible.

### The Solution:
**Service Discovery (e.g., Netflix Eureka, Consul, Zookeeper)**.
- **Service Registry**: A central hub where all services register their location.
- **Service Registration**: On startup, a microservice sends its IP and Port to the registry.
- **Service Discovery**: When Service A needs to call Service B, it asks the registry for Service B's location.

### Implementation:
Use `@EnableEurekaServer` for the registry and `@EnableDiscoveryClient` for the microservices.
