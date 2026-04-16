---
title: "How to configure CORS in Spring Boot REST APIs?"
category: "spring"
order: 31
---

### What is CORS?
Cross-Origin Resource Sharing is a security feature that restricts web pages from making requests to a different domain than the one that served the web page.

### 1. Method Level:
```java
@CrossOrigin(origins = "http://localhost:3000")
@GetMapping("/users")
public List<User> getUsers() { ... }
```

### 2. Global Configuration:
```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```
