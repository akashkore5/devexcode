---
title: "What is API Gateway and why is it needed in Microservices?"
category: "microservices"
order: 25
---

### What is an API Gateway?
An API Gateway is a **single entry point** for all client requests in a microservices architecture. It sits between the client and the backend services, acting as a reverse proxy that routes, composes, and manages API traffic.

```
Client → API Gateway → ┌─ User Service
                        ├─ Order Service
                        ├─ Payment Service
                        └─ Notification Service
```

### Without an API Gateway — The Problem
```
Mobile App → User Service    (port 8081)
Mobile App → Order Service   (port 8082)
Mobile App → Payment Service (port 8083)
```
- Client must know **every service's address**.
- Cross-cutting concerns (auth, rate-limiting) duplicated in **every** service.
- Tight coupling between client and internal architecture.

### With an API Gateway — The Solution
```
Mobile App → Gateway (port 443) → routes to appropriate service
```

### Key Responsibilities

| Responsibility | Description |
|---------------|-------------|
| **Request Routing** | Routes `/api/users/**` → User Service, `/api/orders/**` → Order Service |
| **Authentication & Authorization** | Validates JWT/OAuth tokens at the edge — services don't need to |
| **Rate Limiting** | Throttles excessive requests per client/IP |
| **Load Balancing** | Distributes requests across service instances |
| **Request/Response Transformation** | Aggregates responses from multiple services into one |
| **Circuit Breaking** | Prevents cascading failures when a downstream service is down |
| **SSL Termination** | Handles HTTPS — internal services can use HTTP |
| **Logging & Monitoring** | Centralized request logging, tracing, and metrics |
| **API Versioning** | Routes `/v1/users` and `/v2/users` to different service versions |

### Popular Implementations

| Gateway | Ecosystem |
|---------|-----------|
| **Spring Cloud Gateway** | Java / Spring Boot — reactive, non-blocking |
| **Netflix Zuul** | Java (legacy — replaced by Spring Cloud Gateway) |
| **Kong** | Language-agnostic, built on Nginx |
| **AWS API Gateway** | Managed service on AWS |
| **Nginx / Envoy** | High-performance reverse proxies |

### Spring Cloud Gateway Example
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://USER-SERVICE
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
            - name: CircuitBreaker
              args:
                name: userServiceCB
                fallbackUri: forward:/fallback/users
```

### Gateway Patterns

1. **Backend for Frontend (BFF)**: Separate gateways for web, mobile, and IoT clients — each tailored to the client's needs.
2. **API Composition**: Gateway calls multiple services and merges responses into a single payload for the client.
3. **Edge Authentication**: Token validation at the gateway; services receive trusted headers like `X-User-Id`.

### When NOT to Use?
- **Monolithic apps**: No benefit — adds unnecessary complexity.
- **Simple 2-3 service setups**: Might be overkill; direct service-to-service calls may suffice.
