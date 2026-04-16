---
title: "Singleton in Spring vs Java Singleton."
category: "spring"
order: 2
---

### Java Singleton:
- Scoped to the **ClassLoader**.
- Only one instance of the class exists in the JVM.
- Typically implemented with a private constructor and a static method.

### Spring Singleton Bean:
- Scoped to the **ApplicationContext** (IoC Container).
- Only one instance of the bean exists **per container**.
- If you have multiple containers (rare in standard apps), you could have multiple instances.

### Thread Safety:
- **No**, Spring Singleton beans are **not** inherently thread-safe. They are shared across all requests. You must ensure they are stateless to avoid concurrency issues.
