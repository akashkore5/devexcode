---
title: "CopyOnWriteArrayList vs ArrayList"
category: "collections"
order: 11
status: "not-started"
tags: ["CopyOnWriteArrayList", "ArrayList", "Concurrency", "Thread Safety", "Collections"]
---

# 🔹 CopyOnWriteArrayList vs ArrayList (Deep Dive, Interview-Ready)

While **ArrayList** is the standard dynamic array in Java, it fails spectacularly in highly concurrent environments, throwing `ConcurrentModificationException` when threads modify it during iteration. 
**CopyOnWriteArrayList** was introduced in Java 5 (`java.util.concurrent`) as an ingenious, lock-free alternative for very specific multi-threaded scenarios.

---

## 📌 1. Core Difference (One-Liner)

> **ArrayList is an unsynchronized, fast dynamic array for single-threaded use, whereas CopyOnWriteArrayList is thread-safe because it creates a completely fresh copy of the internal array every time it is modified, allowing 100% lock-free reads.**

---

## 📊 2. Detailed Comparison

| Feature | ArrayList | CopyOnWriteArrayList |
| :--- | :--- | :--- |
| **Thread Safety** | ❌ Not thread-safe | ✅ Completely thread-safe |
| **Internal Mechanism** | Resizes existing array when full | **Copies entire array** on every write (`add`, `remove`, `set`) |
| **Read Performance** | Extremely Fast (O(1)) | **Extremely Fast (O(1)) and Lock-Free** |
| **Write Performance** | Fast (Amortized O(1)) | **Very Slow (O(N))** due to array copying |
| **Memory Overhead** | Low | **Very High** during modifications |
| **Iterator Behavior** | Fail-Fast | **Fail-Safe** (Iterates over a snapshot) |
| **Iterator `remove()`** | ✅ Supported | ❌ Throws `UnsupportedOperationException` |

---

## 📌 3. How CopyOnWriteArrayList Works

The genius of `CopyOnWriteArrayList` lies in its name: **Copy-On-Write**.

### 🔸 The Write Operation
Whenever a thread calls a mutative operation like `add(E e)` or `remove(int index)`:
1. It acquires a lock (using `ReentrantLock`).
2. It creates an exact copy of the internal array, but with a length of `N + 1` (or `N - 1`).
3. It performs the modification on the **new array**.
4. It swaps the internal array reference to point to the new array.
5. It releases the lock.

```java
// Simplified internal logic of CopyOnWriteArrayList.add()
public boolean add(E e) {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        Object[] elements = getArray();
        int len = elements.length;
        // CREATE FRESH COPY
        Object[] newElements = Arrays.copyOf(elements, len + 1);
        newElements[len] = e;
        // SWAP REFERENCE
        setArray(newElements);
        return true;
    } finally {
        lock.unlock();
    }
}
```

👉 **The Impact:** Every single write is an expensive **O(N)** operation.

---

### 🔸 The Read Operation
Because the internal array reference is only swapped *after* a complete copy is made, **the array itself is effectively immutable**.
This means read operations like `get()`, `contains()`, or iterating do not need **any locks whatsoever**. 

---

## 📌 4. The Snapshot Iterator (Fail-Safe)

When you request an `Iterator` from an `ArrayList`, it tracks a `modCount`. If the list changes, the iterator crashes (Fail-Fast).

When you request an `Iterator` from a `CopyOnWriteArrayList`, it takes a reference to the **exact array that existed at that exact millisecond** (a snapshot).
* If another thread adds an element, the reference in the main list is swapped to a new array.
* However, your Iterator is still safely looping over the *old* snapshot array.
* It will **never** throw `ConcurrentModificationException`.
* It will **not** see the new elements added after the iterator was created.

---

## 📌 5. Why Iterator.remove() throws an Exception

If you try to call `remove()` on a `CopyOnWriteArrayList` Iterator, it will crash with `UnsupportedOperationException`.

Why? Because the Iterator is operating on a stagnant "snapshot" of an old array. If you removed an element from the snapshot, it wouldn't affect the actual current list. To avoid logical corruption and ambiguity, Java explicitly bans modifications via the iterator.

---

## 📌 6. When to use which?

### ✅ Use ArrayList when:
* You are operating in a **single-threaded** environment.
* You need to perform frequent writes/updates.
* You need to synchronize the list externally using `Collections.synchronizedList()` (though rare today).

### ✅ Use CopyOnWriteArrayList when:
* **Reads vastly outnumber writes.** (e.g., 99% reads, 1% writes).
* You are maintaining a list of **Event Listeners** or Observers. (Listeners are registered once and rarely removed, but notified/iterated over constantly).
* You are building high-concurrency caches where iteration must be lightning fast and completely unblocked by sporadic updates.

---

## 🔥 Interview Gold Statement

> *"CopyOnWriteArrayList provides lock-free, ultra-fast reads in concurrent environments by taking the radical approach of cloning the entire underlying array on every single write operation. Because iterators work on an immutable snapshot of the array, they never throw ConcurrentModificationException. However, this O(N) write cost makes it suitable strictly for scenarios where reads vastly outnumber writes, such as maintaining a list of event listeners."*

---

## ⚡ Final Verdict

* ✅ **Use `ArrayList`** as your standard, everyday dynamic array.
* 🎯 **Use `CopyOnWriteArrayList`** exclusively in multi-threaded scenarios where you iterate constantly but modify rarely.
