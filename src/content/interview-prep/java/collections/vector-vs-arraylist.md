---
title: Vector vs ArrayList
category: collections
order: 3
status: not-started
tags: ["Vector", "ArrayList", "Collections", "Thread Safety", "Legacy"]
---

# 🔹 Vector vs ArrayList (Deep Dive, Interview-Ready)

Both **Vector** and **ArrayList** are resizable array implementations of the `List` interface, but they differ significantly in **thread-safety, performance, and legacy design philosophy**.

---

## 📌 1. Core Difference (One-Liner)

> **Vector is synchronized (thread-safe by default), while ArrayList is not, making ArrayList faster in single-threaded scenarios.**

---

## 📊 2. Detailed Comparison

| Feature | Vector | ArrayList |
| :--- | :--- | :--- |
| **Synchronization** | Fully synchronized (every method) | Not synchronized |
| **Thread Safety** | Thread-safe by default | Not thread-safe |
| **Performance** | Slower (locking overhead) | Faster |
| **Growth Strategy** | Doubles size (or uses `capacityIncrement`) | Grows by ~50% (1.5x) |
| **Legacy Status** | Legacy class (pre-Collections) | Modern (Java Collections Framework) |
| **Iterator Type** | `Enumeration` + `Iterator` | `Iterator` + `ListIterator` |
| **Fail-Fast Behavior** | `Enumeration` is NOT fail-fast | Iterators are fail-fast |
| **Usage Today** | Rare | Very common |

---

## 📌 3. Internal Working Differences

### 🔸 ArrayList

**Internal Storage:**
```java
transient Object[] elementData;
```

**Growth Strategy:**
```java
int newCapacity = oldCapacity + (oldCapacity >> 1); // 1.5x growth
```

👉 **Optimized for:**
* **Speed** (No synchronization overhead)
* **Memory efficiency** (Grows conservatively by 50%)

---

### 🔸 Vector

**Internal Storage:**
```java
protected Object[] elementData;
```

**Growth Strategy:**
```java
int newCapacity = oldCapacity * 2; // Default 2x growth
// OR:
int newCapacity = oldCapacity + capacityIncrement; // If capacityIncrement is specified
```

👉 **Impact:** More aggressive resizing leads to potentially higher unused memory capacity.

---

## 📌 4. Synchronization Details (Very Important)

### 🔸 Vector
Every method in `Vector` is synchronized:

```java
public synchronized boolean add(E e) {
    // ...
}
```

👉 **The Problem:** 
Locking is applied at the method level (on the `Vector` object itself). This means even simple concurrent read operations require locking, which leads to **thread contention** and **reduced scalability** in highly concurrent environments.

---

### 🔸 ArrayList
* Contains **no synchronization**.
* Multiple threads modifying it concurrently will lead to a `ConcurrentModificationException` or inconsistent state.

### ✅ How to make ArrayList thread-safe?

Use the `Collections` utility class:
```java
List<String> list = Collections.synchronizedList(new ArrayList<>());
```

**OR better yet, for high-read concurrency:**
```java
List<String> list = new CopyOnWriteArrayList<>();
```

---

## 📌 5. Performance Insight

| Scenario | Better Choice |
| :--- | :--- |
| **Single-threaded** | `ArrayList` |
| **Multi-threaded (high concurrency)** | `CopyOnWriteArrayList` or `ConcurrentHashMap` |
| **Multi-threaded (low write, high read)** | `CopyOnWriteArrayList` |
| **Legacy systems** | `Vector` |

👉 **Vector is almost never preferred in modern Java applications.**

---

## 📌 6. Fail-Fast vs Non Fail-Fast

### 🔸 ArrayList Iterator
* **Fail-fast** by default.
* Throws `ConcurrentModificationException` if the list is structurally modified at any time after the iterator is created.

### 🔸 Vector Enumeration
* **Not fail-fast**.
* Can lead to inconsistent behavior if the collection is modified during traversal, risking unpredictable results rather than failing cleanly.

---

## 📌 7. When Should You Use Vector?

👉 **Practically:**
* Only when working with **legacy codebases** or APIs that explicitly require a `Vector` object.

**Otherwise, prefer:**
* `ArrayList` (default choice)
* `Collections.synchronizedList` (for thread-safe list operations)
* `CopyOnWriteArrayList` (for thread-safe lists with frequent reads and rare writes)

---

## 📌 8. Memory & Scalability Trade-Off

| Aspect | Vector | ArrayList |
| :--- | :--- | :--- |
| **Memory Usage** | Higher (100% / 2x growth) | Lower (50% / 1.5x growth) |
| **Scalability** | Poor (heavy locking mechanism) | High (when used properly) |
| **CPU Overhead** | High (due to intrinsic locks) | Low |

---

## 🔥 Interview Gold Statement

> *"Vector is a legacy, synchronized dynamic array where every operation is thread-safe but incurs significant performance overhead. ArrayList is the modern, unsynchronized alternative that is optimized for speed and memory. In modern applications, ArrayList is used by default, and external synchronization or `CopyOnWriteArrayList` is preferred for concurrent environments."*

---

## ⚡ Final Verdict

* ✅ **Use `ArrayList`** in 99% of cases.
* ❌ **Avoid `Vector`** unless dealing with legacy systems.
