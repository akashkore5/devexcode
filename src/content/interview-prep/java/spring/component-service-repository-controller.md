---
title: "@Component vs @Service vs @Repository vs @Controller"
category: "spring"
order: 36
---

### The Hierarchy
All four are **stereotype annotations** used for auto-detection via `@ComponentScan`. They form a hierarchy:

```
@Component          ← Generic base
  ├── @Service      ← Business logic layer
  ├── @Repository   ← Data access layer
  └── @Controller   ← Presentation layer (MVC)
```

### Detailed Comparison

| Annotation | Layer | Purpose | Special Behavior |
|-----------|-------|---------|-----------------|
| `@Component` | Generic | General-purpose Spring bean | None — just registers a bean |
| `@Service` | Business | Service/business logic | **None** — purely semantic (documentation intent) |
| `@Repository` | Persistence | DAO / data access | ✅ **Exception Translation** — converts JDBC/JPA exceptions to Spring's `DataAccessException` |
| `@Controller` | Web | MVC Controller | ✅ Works with `@RequestMapping`, returns **view names** |
| `@RestController` | Web | REST API Controller | ✅ `@Controller` + `@ResponseBody` — returns JSON/XML directly |

### Key Insight: They Are Technically Interchangeable (But Don't!)
```java
// This WORKS — Spring treats it as a bean
@Component
public class UserService { }

// But this is CORRECT — communicates intent
@Service
public class UserService { }
```

> Internally, `@Service`, `@Repository`, and `@Controller` are all meta-annotated with `@Component`. Spring detects them through `@ComponentScan` identically.

### Why Use Specific Annotations?

#### 1. Readability & Architecture
```java
@Repository   // → "This talks to the database"
public class UserRepository { }

@Service      // → "This contains business rules"
public class UserService { }

@Controller   // → "This handles web requests"
public class UserController { }
```

#### 2. @Repository's Exception Translation
```java
@Repository
public class OrderDao {
    public Order findById(Long id) {
        // If this throws a JDBC SQLException...
        // Spring wraps it in DataAccessException automatically
        return jdbcTemplate.queryForObject("SELECT ...", mapper, id);
    }
}
```
Without `@Repository`, raw JDBC/JPA exceptions would leak into service layers.

#### 3. AOP Targeting
You can apply **Aspect-Oriented Programming** advice to specific stereotypes:
```java
@Around("@within(org.springframework.stereotype.Service)")
public Object logServiceMethods(ProceedingJoinPoint jp) throws Throwable {
    // Log all methods in @Service classes
    log.info("Calling: {}", jp.getSignature());
    return jp.proceed();
}
```

### Best Practice
> Always use the **most specific** stereotype annotation. It documents your architecture, enables framework features (like exception translation), and allows targeted AOP.
