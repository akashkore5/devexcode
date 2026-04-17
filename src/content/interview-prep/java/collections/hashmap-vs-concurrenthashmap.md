---
title: "HashMap vs ConcurrentHashMap: Thread-Safety, Locking & Performance"
category: "collections"
order: 26
---

### 1. Thread Safety
- **HashMap**: **Not thread-safe**. Multiple threads reading/writing the same HashMap can cause data corruption, infinite loops (in older JDKs), or lost updates.
- **ConcurrentHashMap**: **Thread-safe** without requiring external synchronization. Designed for high-concurrency environments.

### 2. Null Keys & Values
- **HashMap**: Allows **one null key** and **multiple null values**.
- **ConcurrentHashMap**: Does **NOT allow null keys or null values**. Throws `NullPointerException`.

```java
HashMap<String, String> hm = new HashMap<>();
hm.put(null, "allowed");        // ✅ Works

ConcurrentHashMap<String, String> chm = new ConcurrentHashMap<>();
chm.put(null, "not allowed");   // ❌ NullPointerException
```

### 3. Locking Mechanism
- **HashMap**: No locking — not designed for concurrent access.
- **ConcurrentHashMap (Java 8+)**: Uses **CAS (Compare-And-Swap) operations + `synchronized` on individual bins (buckets)**. Only the affected bucket is locked during writes, so reads are almost always lock-free.

> **Before Java 8**, ConcurrentHashMap used a **Segment-based locking** strategy (16 segments by default). Java 8 replaced this with a far more granular, per-bucket approach.

### 4. Performance Under Concurrency
| Aspect | HashMap + Collections.synchronizedMap | ConcurrentHashMap |
|--------|--------------------------------------|-------------------|
| Read performance | Blocks all threads (full lock) | Lock-free reads |
| Write performance | Full map lock | Per-bucket lock |
| Scalability | Poor | Excellent |

### 5. Iterators
- **HashMap**: Uses **fail-fast** iterators — throws `ConcurrentModificationException` if the map is modified during iteration.
- **ConcurrentHashMap**: Uses **weakly consistent** iterators — reflects some (but not necessarily all) changes made after the iterator was created. Never throws `ConcurrentModificationException`.

### 6. When to Use What?
- **HashMap**: Single-threaded applications, or when external synchronization is guaranteed.
- **ConcurrentHashMap**: Multi-threaded environments — caches, shared registries, counters, and real-time data pipelines.
