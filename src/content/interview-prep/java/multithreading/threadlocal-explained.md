---
title: "How does ThreadLocal work and where is it used in real projects?"
category: "multithreading"
order: 16
---

### What is ThreadLocal?
`ThreadLocal` provides **thread-confined variables** — each thread accessing the variable gets its own, independently initialized copy. No synchronization is needed because threads never share the value.

```java
ThreadLocal<String> userContext = new ThreadLocal<>();

// Thread A
userContext.set("user-akash");
System.out.println(userContext.get()); // "user-akash"

// Thread B — completely independent
userContext.set("user-rahul");
System.out.println(userContext.get()); // "user-rahul"
```

### How Does It Work Internally?
1. Each `Thread` object has a hidden field: `Thread.threadLocals` (a `ThreadLocalMap`).
2. When you call `threadLocal.set(value)`, it stores the value inside **the current thread's own map**, keyed by the `ThreadLocal` instance.
3. `get()` retrieves from the **current thread's map** — zero contention, zero locking.

### Real-World Usage

| Framework | Use Case |
|-----------|----------|
| **Spring Security** | `SecurityContextHolder` stores the authenticated user per request thread |
| **Hibernate** | Session-per-request pattern — `Session` bound to current thread |
| **SLF4J / Log4j MDC** | `MDC.put("requestId", id)` — correlates logs across a single request |
| **Transaction Management** | JDBC `Connection` bound to thread via `DataSourceUtils` |
| **SimpleDateFormat** | Non-thread-safe formatter wrapped in ThreadLocal for reuse |

### ⚠️ Memory Leak Pitfall
In **thread pools** (e.g., Tomcat, ExecutorService), threads are reused. If you don't call `threadLocal.remove()` after each task:
- The old value persists across unrelated requests.
- `ThreadLocalMap` entries hold strong references → **memory leak**.

```java
try {
    threadLocal.set(someValue);
    // ... business logic
} finally {
    threadLocal.remove(); // ✅ ALWAYS clean up
}
```

### InheritableThreadLocal
If you need child threads to inherit the parent's ThreadLocal value, use `InheritableThreadLocal`. However, this does **not** work with thread pools since pool threads are not "children" of submitting threads.
