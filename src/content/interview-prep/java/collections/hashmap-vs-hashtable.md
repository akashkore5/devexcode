---
title: "HashMap vs Hashtable"
category: "collections"
order: 5
status: "not-started"
tags: ["HashMap", "Hashtable", "Collections", "Thread Safety", "Legacy", "Map"]
---

# 🔹 HashMap vs Hashtable (Deep Dive, Interview-Ready)

Both **HashMap** and **Hashtable** implement the `Map` interface and store key-value pairs using a hash table data structure. However, just like `ArrayList` and `Vector`, they represent a modern vs. legacy design divide, specifically regarding **thread safety** and **null handling**.

---

## 📌 1. Core Difference (One-Liner)

> **Hashtable is a legacy, synchronized class that does not allow nulls, while HashMap is a modern, unsynchronized class that allows one null key and multiple null values.**

---

## 📊 2. Detailed Comparison

| Feature | HashMap | Hashtable |
| :--- | :--- | :--- |
| **Synchronization** | Not synchronized | Fully synchronized (every method) |
| **Thread Safety** | Thread-safe by default? **No** | Thread-safe by default? **Yes** |
| **Performance** | Faster | Slower (locking overhead) |
| **Null Key** | Allowed (Maximum 1) | Not allowed (Throws `NullPointerException`) |
| **Null Values** | Allowed (Multiple) | Not allowed (Throws `NullPointerException`) |
| **Legacy Status** | Modern (Java 1.2 Collections Framework) | Legacy class (Java 1.0, retrofitted) |
| **Traversal Method** | `Iterator` | `Enumerator` + `Iterator` |
| **Fail-Fast Behavior** | Iterators are fail-fast | Enumerator is NOT fail-fast |
| **Usage Today** | Default choice for maps | Obsolete / Rare |

---

## 📌 3. Internal Working Differences

### 🔸 HashMap

**Internal Storage:**
```java
transient Node<K,V>[] table;
```

**How it handles Nulls:**
HashMap has a special check for `null` keys. It routes the `null` key to index `0` of the internal array without trying to call `.hashCode()` on it.

```java
// Inside HashMap's hash function:
static final int hash(Object key) {
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

👉 **Optimized for:** Speed in single-threaded environments.

---

### 🔸 Hashtable

**Internal Storage:**
```java
private transient Entry<?,?>[] table;
```

**How it handles Nulls:**
Hashtable blindly calls `.hashCode()` on the provided key and `.equals()` on the value. If either is `null`, it instantly throws a `NullPointerException`.

```java
// Inside Hashtable's put method:
if (value == null) {
    throw new NullPointerException();
}
int hash = key.hashCode(); // Throws NPE if key is null
```

👉 **Impact:** Strict non-null enforcement.

---

## 📌 4. Synchronization Details (Very Important)

### 🔸 Hashtable
Every core method in `Hashtable` is synchronized at the method level:

```java
public synchronized V put(K key, V value) { ... }
public synchronized V get(Object key) { ... }
```

👉 **The Problem:** 
The lock is applied on the entire `Hashtable` object (`this`). If Thread A is doing a `put()`, Thread B cannot even do a `get()`. This causes severe bottlenecks in highly concurrent applications.

---

### 🔸 HashMap
Contains **no synchronization**.

### ✅ How to make HashMap thread-safe?

If you need a thread-safe map, **do not use Hashtable**. Instead, use:

**1. `ConcurrentHashMap` (Best Practice)**
* Uses fine-grained locking (locks only a portion/bucket of the map).
* Allows multiple threads to read and write simultaneously.

```java
Map<String, String> map = new ConcurrentHashMap<>();
```

**2. `Collections.synchronizedMap` (If legacy required)**
* Creates a synchronized wrapper around a `HashMap`.
* Similar performance issue as `Hashtable` (object-level lock), but allows nulls.

```java
Map<String, String> map = Collections.synchronizedMap(new HashMap<>());
```

---

## 📌 5. Fail-Fast vs Non Fail-Fast

### 🔸 HashMap Iterator
* **Fail-fast**.
* Uses an internal `modCount` to track structural changes. If `modCount` changes while an iterator is traversing, it throws `ConcurrentModificationException`.

### 🔸 Hashtable Enumerator
* **Not fail-fast**.
* `Hashtable.elements()` returns an `Enumeration`. If the Hashtable changes during traversal, the `Enumeration` does not throw an exception (though it might return inconsistent results).

---

## 🔥 Interview Gold Statement

> *"Hashtable is a legacy, fully synchronized map that does not allow nulls and locks the entire object for every operation, causing poor performance. HashMap is the modern, unsynchronized standard that allows nulls and is highly optimized. For thread-safe mapping today, we entirely avoid Hashtable and instead use ConcurrentHashMap, which provides lock-striping for vastly superior concurrent performance."*

---

## ⚡ Final Verdict

* ✅ **Use `HashMap`** in single-threaded environments.
* ✅ **Use `ConcurrentHashMap`** in multi-threaded environments.
* ❌ **Never use `Hashtable`** in modern Java code.
