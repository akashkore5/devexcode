---
title: "Steps to implement Circuit Breaker (Resilience4j)."
category: "microservices"
order: 12
---

1. **Add Dependency**: `resilience4j-spring-boot2`.
2. **Configuration**: Define failure rate thresholds, window size, and wait duration in `application.yml`.
```yaml
resilience4j.circuitbreaker:
  instances:
    userService:
      failureRateThreshold: 50
      waitDurationInOpenState: 10000
```
3. **Usage**: Use `@CircuitBreaker` annotation on the service method.
```java
@CircuitBreaker(name = "userService", fallbackMethod = "fallback")
public User getUser(String id) { ... }
```
4. **Fallback**: Provide a method with the same signature to return a default value or cached data.
