---
title: "ConcurrentHashMap vs synchronized HashMap — Not just what, but when and why."
category: "collections"
order: 23
---

### The Three Options

**1. `Collections.synchronizedMap(new HashMap<>())`**
- Wraps every method with `synchronized(mutex)`.
- **Single lock** for the entire map — only one thread can access at a time.

**2. `Hashtable`**
- Every method is `synchronized` — same single-lock bottleneck as synchronizedMap.
- Legacy class, **do not use** in new code.

**3. `ConcurrentHashMap`**
- Uses **segment-level locking** (Java 7) / **node-level CAS + synchronized** (Java 8+).
- Multiple threads can read/write simultaneously to different buckets.

### Performance Comparison

| Operation | synchronizedMap | ConcurrentHashMap |
|-----------|----------------|-------------------|
| **Read** | Blocks all other reads/writes | Lock-free (volatile reads) |
| **Write** | Blocks entire map | Locks only the affected bucket/node |
| **Iteration** | Throws `ConcurrentModificationException` | Weakly consistent, never throws |
| **Throughput** | Low under contention | Near-linear scaling with threads |

### When to Use synchronizedMap
- You need **consistent iterators** that reflect all changes at the exact moment of iteration.
- You need to wrap an **existing Map implementation** (e.g., `LinkedHashMap` for LRU).
- **Low contention** — few threads, simple access patterns.

### When to Use ConcurrentHashMap
- **High concurrency** — many threads reading and writing simultaneously.
- You need **atomic compound operations**: `putIfAbsent()`, `computeIfAbsent()`, `merge()`.
- You're building **caches, counters, or registries** in multi-threaded services.

### Why ConcurrentHashMap Exists
```java
// synchronizedMap CANNOT do this atomically:
synchronized(map) {
    if (!map.containsKey(key)) {
        map.put(key, value);
    }
}

// ConcurrentHashMap does it in ONE atomic call:
map.putIfAbsent(key, value);
map.computeIfAbsent(key, k -> expensiveComputation(k));
```

### Critical Gotcha
```java
// ConcurrentHashMap does NOT allow null keys or values!
map.put(null, "value");  // throws NullPointerException
map.put("key", null);    // throws NullPointerException

// HashMap and synchronizedMap ALLOW nulls
```

### Interview Insight
Don't just say "ConcurrentHashMap is faster." Explain **WHY**: lock-free reads via volatile, node-level locking for writes, and built-in atomic compound operations that eliminate the need for external synchronization.
