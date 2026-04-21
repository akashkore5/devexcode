---
title: "ConcurrentHashMap vs Synchronized HashMap"
category: "collections"
order: 23
status: "not-started"
tags: ["ConcurrentHashMap", "SynchronizedMap", "Concurrency", "Collections", "Lock Striping"]
---

# 🔹 ConcurrentHashMap vs Synchronized HashMap (Deep Dive, Interview-Ready)

When developers need a thread-safe Map in Java, they typically face three choices: the legacy `Hashtable`, the wrapper `Collections.synchronizedMap()`, and the highly-optimized `ConcurrentHashMap`. 

Modern Java development almost entirely discards `Hashtable` and heavily favors `ConcurrentHashMap`. But **why**, and **when** would you ever still use `synchronizedMap`?

---

## 📌 1. Core Difference (One-Liner)

> **`Collections.synchronizedMap` provides thread safety by holding a single lock over the entire map for every operation, whereas `ConcurrentHashMap` achieves massive concurrency by locking only specific buckets during writes and allowing completely lock-free reads.**

---

## 📊 2. Detailed Comparison

| Feature | `synchronizedMap(new HashMap<>())` | `ConcurrentHashMap` |
| :--- | :--- | :--- |
| **Locking Mechanism** | **Coarse-Grained** (Single lock for the whole object) | **Fine-Grained** (Node-level CAS + Synchronized) |
| **Read Operations** | Blocks all other reads and writes | **100% Lock-free** (via `volatile` variables) |
| **Write Operations** | Blocks the entire map | Locks only the specific bucket/node |
| **Null Keys/Values** | ✅ Allowed (if backing map is HashMap) | ❌ **Not Allowed** (Throws `NullPointerException`) |
| **Iterators** | **Fail-Fast** (Throws `ConcurrentModificationException`) | **Weakly Consistent / Fail-Safe** (Never throws) |
| **Throughput / Scaling** | Poor (High contention with many threads) | Exceptional (Near-linear scaling) |
| **Atomic Operations** | Must write manual `synchronized` blocks | Built-in (`putIfAbsent`, `computeIfAbsent`) |

---

## 📌 3. How the Locking Works

### 🔸 SynchronizedMap (The Bottleneck)
When you wrap a Map, every method (`get`, `put`, `remove`, `size`) is synchronized on a single `mutex` object.
* If Thread A calls `get("user1")`, Thread B **cannot** call `put("user2", "data")`.
* Even though they are accessing entirely different data, they are waiting on the same global lock.

### 🔸 ConcurrentHashMap (The Masterpiece)
* **Java 7:** Used **Segment-level locking**. The map was divided into 16 segments (mini-hashmaps), each with its own lock.
* **Java 8+:** Abandoned segments. Now uses **Node-level locking**. It uses internal hardware instructions called **CAS (Compare-And-Swap)** and synchronizes only on the specific `Node` (the head of the bucket) being modified.
* **Reads:** `get()` uses `volatile` fields to ensure visibility of changes. Reads do not acquire any locks whatsoever.

---

## 📌 4. The Magic of Atomic Operations

The biggest flaw of `synchronizedMap` is that it doesn't solve **compound operations** atomically. 

### ❌ The SynchronizedMap Problem:
```java
// Check-then-act is NOT thread-safe without an external lock
synchronized(syncMap) { // You MUST manually synchronize the block
    if (!syncMap.containsKey("session_id")) {
        syncMap.put("session_id", newSessionData);
    }
}
```

### ✅ The ConcurrentHashMap Solution:
`ConcurrentHashMap` provides built-in, highly optimized atomic methods.
```java
// Thread-safe, atomic, and massively faster
concurrentMap.putIfAbsent("session_id", newSessionData);

// Or even better, compute it lazily:
concurrentMap.computeIfAbsent("session_id", key -> generateSessionData(key));
```

---

## 📌 5. Why doesn't ConcurrentHashMap allow Nulls?

If you try to run `concurrentMap.put(null, "value")`, it crashes immediately with `NullPointerException`. 
Why? Because of the **Ambiguity Problem** in concurrent programming.

If `map.get(key)` returns `null`, it could mean two things:
1. The key doesn't exist in the map.
2. The key exists, but its value is literally `null`.

In a single-threaded `HashMap`, you can resolve this ambiguity by calling `map.containsKey(key)`. 
In a concurrent environment, between the time you call `get()` and `containsKey()`, another thread might have modified the map. Because you can't lock the whole map to verify, `null` keys and values are strictly banned to prevent this fatal ambiguity.

---

## 📌 6. When should you EVER use synchronizedMap?

If `ConcurrentHashMap` is so vastly superior, when would you use `Collections.synchronizedMap`?

1. **You need to wrap a different Map implementation.** 
   `ConcurrentHashMap` is strictly a hash-based map. If you need a thread-safe LRU Cache, you have to use `Collections.synchronizedMap(new LinkedHashMap<>())`. If you need a thread-safe `TreeMap`, you use `Collections.synchronizedSortedMap(new TreeMap<>())`.
2. **You absolutely require Fail-Fast iterators.**
   If you need an iterator to guarantee that nobody else has touched the map while you are iterating (strict consistency), you must use `synchronizedMap` and manually synchronize the iteration block.

---

## 🔥 Interview Gold Statement

> *"Don't just say ConcurrentHashMap is faster. The key is understanding **why**. ConcurrentHashMap provides lock-free reads using `volatile` fields, and highly granular node-level locking using CAS for writes. It also provides atomic compound operations like `computeIfAbsent()`, eliminating the need for external `synchronized` blocks. You should only revert to `Collections.synchronizedMap` if you need to provide thread-safety to a specialized map implementation like `LinkedHashMap`."*

---

## ⚡ Final Verdict

* ✅ **Use `ConcurrentHashMap`** for building high-concurrency caches, registries, and thread-safe data storage.
* 🎯 **Use `Collections.synchronizedMap`** only when you need to make a specific map structure (like `LinkedHashMap`) thread-safe.
