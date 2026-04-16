---
title: "Feign Client and Fallbacks."
category: "microservices"
order: 20
---

### Feign Client:
A declarative REST client that makes writing web service clients easier.
```java
@FeignClient(name = "user-service", fallback = UserServiceFallback.class)
public interface UserClient {
    @GetMapping("/users/{id}")
    User getUser(@PathVariable String id);
}
```

### Fallbacks:
- Part of resilience. If `user-service` is down, the code inside `UserServiceFallback` will execute instead of throwing an error.
- Provides a "Graceful Degradation" experience for the user.
