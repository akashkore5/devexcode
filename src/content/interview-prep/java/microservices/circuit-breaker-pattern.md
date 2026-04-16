---
title: "Circuit Breaker Pattern (Resilience4j)."
category: "microservices"
order: 4
---

### Purpose:
Prevents a service from repeatedly trying to call a failing downstream service, which could lead to resource exhaustion (cascading failure).

### States:
1. **CLOSED**: Normal operation. Requests flow through.
2. **OPEN**: Downstream service is failing. Requests are rejected immediately (Fast-Fail).
3. **HALF-OPEN**: Periodically allows some requests to check if the downstream service has recovered.

### Tooling:
Spring Boot typically uses **Resilience4j** (Hystrix is deprecated).
