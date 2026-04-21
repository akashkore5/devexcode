---
title: "Synchronized vs Concurrent Collections"
category: "collections"
order: 10
status: "not-started"
tags: ["Concurrency", "Thread Safety", "Locking", "Collections", "Java 5"]
---

# 🔹 Synchronized vs Concurrent Collections (Deep Dive, Interview-Ready)

When dealing with multi-threading in Java, using standard collections like `ArrayList` or `HashMap` leads to data corruption and `ConcurrentModificationException`. To solve this, Java provides two main approaches: **Synchronized Collections** (legacy/wrapper) and **Concurrent Collections** (modern/highly-optimized).

---

## 📌 1. Core Difference (One-Liner)

> **Synchronized collections achieve thread safety by locking the entire collection object, creating massive performance bottlenecks, whereas Concurrent collections use fine-grained locking or lock-free algorithms to allow multiple threads to read and write simultaneously.**

---

## 📊 2. Detailed Comparison

| Feature | Synchronized Collections | Concurrent Collections |
| :--- | :--- | :--- |
| **Examples** | `Collections.synchronizedList()`, `Hashtable`, `Vector` | `ConcurrentHashMap`, `CopyOnWriteArrayList` |
| **Locking Mechanism** | **Coarse-grained** (Locks the entire object) | **Fine-grained / Lock-free** (Locks segments/buckets) |
| **Concurrency Level** | Low (Only 1 thread can access at a time) | High (Multiple threads can read/write simultaneously) |
| **Performance** | Slow (High thread contention) | Very Fast |
| **Iterator Behavior** | **Fail-Fast** (Throws exception if modified) | **Fail-Safe / Weakly Consistent** (Does not throw exception) |
| **Null Elements** | Usually allowed (Except `Hashtable`/`Vector`) | Generally **Not Allowed** |
| **Package** | `java.util` | `java.util.concurrent` (Introduced in Java 5) |

---

## 📌 3. Synchronized Collections (The Legacy Way)

You can create a synchronized collection by wrapping a standard collection using the `Collections` utility class:

```java
List<String> syncList = Collections.synchronizedList(new ArrayList<>());
Map<String, String> syncMap = Collections.synchronizedMap(new HashMap<>());
```

### 🔸 How it works:
It uses a **monitor lock** (intrinsic lock) on the collection object (or a mutex object) for *every single operation*.

```java
// Inside Collections.SynchronizedCollection:
public boolean add(E e) {
    synchronized (mutex) {
        return c.add(e);
    }
}
```

👉 **The Problem:** 
If Thread A is iterating over the map, Thread B cannot even perform a `get()` operation. The entire data structure is frozen for all other threads, causing severe CPU wait times (Thread Contention).

---

## 📌 4. Concurrent Collections (The Modern Way)

Introduced in Java 5 (`java.util.concurrent`), these collections are designed from the ground up for high concurrency.

### 🔸 How they work:
Instead of a single giant lock, they use advanced concurrency techniques:
1. **Lock Striping / Bucket-Level Locking:** (e.g., `ConcurrentHashMap`). Only the specific bucket being modified is locked. Other threads can read/write to other buckets simultaneously.
2. **CAS (Compare-And-Swap):** Lock-free atomic instructions at the CPU level.
3. **Copy-On-Write:** (e.g., `CopyOnWriteArrayList`). Mutative operations create a fresh copy of the underlying array, allowing readers to read the old array completely lock-free.

---

## 📌 5. Iterators: Fail-Fast vs Fail-Safe

### 🔸 Synchronized Collections (Fail-Fast)
If you iterate over a synchronized collection, and another thread modifies it, you will get a `ConcurrentModificationException`. **You must manually synchronize on the collection during iteration:**

```java
List<String> list = Collections.synchronizedList(new ArrayList<>());
synchronized(list) { // MANDATORY during iteration
    for(String s : list) {
        System.out.println(s);
    }
}
```

### 🔸 Concurrent Collections (Fail-Safe / Weakly Consistent)
Iterators over concurrent collections (like `ConcurrentHashMap`) operate on a snapshot or tolerate changes. They **never** throw `ConcurrentModificationException`. You do not need explicit synchronization when iterating.

---

## 📌 6. Why do Concurrent Collections restrict Nulls?

If you try to do `concurrentMap.put(null, "Value")`, you will get a `NullPointerException`. 
Why? Because of **Ambiguity in Concurrent Environments**.

If `map.get(key)` returns `null`, does it mean:
1. The key doesn't exist?
2. Or the key exists, but the mapped value is `null`?

In a single-threaded `HashMap`, you can check this using `map.containsKey(key)`. But in a highly concurrent environment, between the time you call `get()` and `containsKey()`, another thread might have changed the map, making the check invalid. To prevent this dangerous ambiguity, `null` is simply forbidden.

---

## 🔥 Interview Gold Statement

> *"Synchronized collections achieve thread safety through coarse-grained locking, where the entire collection is locked for every operation, causing severe performance bottlenecks. Concurrent collections utilize sophisticated techniques like lock-striping, Compare-And-Swap (CAS), and Copy-On-Write to allow highly concurrent access, making them the absolute standard for multi-threaded applications in modern Java."*

---

## ⚡ Final Verdict

* ✅ **Use Concurrent Collections** (`ConcurrentHashMap`, `CopyOnWriteArrayList`) for all modern multi-threaded requirements.
* ❌ **Avoid Synchronized Collections** wrapper methods unless forced by legacy API constraints.
