---
title: "LinkedList vs ArrayList: When to use which?"
category: "collections"
order: 4
status: "not-started"
tags: ["ArrayList", "LinkedList", "Collections", "Time Complexity", "Data Structures"]
---

# 🔹 LinkedList vs ArrayList (Deep Dive, Interview-Ready)

Both **ArrayList** and **LinkedList** are implementations of the `List` interface in Java, but they use entirely different underlying data structures. Understanding these differences is crucial for writing efficient code and acing technical interviews.

---

## 📌 1. Core Difference (One-Liner)

> **ArrayList uses a dynamic array for contiguous memory storage, making reads extremely fast, whereas LinkedList uses a doubly-linked list, making insertions and deletions fast but reads slower.**

---

## 📊 2. Detailed Comparison

| Feature | ArrayList | LinkedList |
| :--- | :--- | :--- |
| **Underlying Data Structure** | Resizable Dynamic Array | Doubly Linked List |
| **Memory Allocation** | Contiguous (Continuous memory block) | Non-contiguous (Nodes scattered in heap) |
| **Read Access (`get()`)** | Extremely Fast **O(1)** | Slower **O(N)** (Must traverse from head/tail) |
| **Insertion/Deletion (`add()`, `remove()`)** | Slower **O(N)** (Requires shifting elements) | Faster **O(1)** (Just update pointers, assuming position is known) |
| **Memory Overhead** | Low (Only stores data) | High (Stores data + next/prev pointers) |
| **CPU Cache Locality** | Excellent (Array elements are pre-fetched) | Poor (Pointer chasing causes cache misses) |
| **Interfaces Implemented** | `List`, `RandomAccess`, `Cloneable`, `Serializable` | `List`, `Deque`, `Queue`, `Cloneable`, `Serializable` |

---

## 📌 3. Internal Working Differences

### 🔸 ArrayList

**Internal Storage:**
```java
transient Object[] elementData;
```

**How it works:**
1. Elements are stored next to each other in memory.
2. When the array is full, it creates a new array of size `oldCapacity + (oldCapacity >> 1)` (which is 1.5x larger) and copies old elements into it.

👉 **Optimized for:**
* **Fast Random Access:** `list.get(5)` calculates the exact memory address instantly.

---

### 🔸 LinkedList

**Internal Storage:**
```java
transient int size = 0;
transient Node<E> first;
transient Node<E> last;

private static class Node<E> {
    E item;
    Node<E> next;
    Node<E> prev;
}
```

**How it works:**
1. Every element is wrapped in a `Node` object.
2. Each node holds the data, a pointer to the **next** node, and a pointer to the **previous** node.

👉 **Optimized for:**
* **Frequent modifications:** Inserting a node in the middle just requires updating the `next` and `prev` references of surrounding nodes. No array shifting is needed.

---

## 📌 4. Time Complexity Breakdown

| Operation | ArrayList | LinkedList | Reason |
| :--- | :--- | :--- | :--- |
| **`get(index)`** | **O(1)** | O(N) | ArrayList computes the memory address directly. LinkedList must traverse node by node. |
| **`add(element)`** (at end) | **O(1)** Amortized | **O(1)** | Both add to the end instantly (ArrayList has rare O(N) resizes). |
| **`add(index, element)`** | O(N) | O(N) | ArrayList must shift elements right. LinkedList must traverse O(N) to find the index, then inserts in O(1). |
| **`remove(index)`** | O(N) | O(N) | ArrayList shifts elements left. LinkedList traverses to find it, then removes in O(1). |
| **`Iterator.remove()`** | O(N) | **O(1)** | If already traversing, LinkedList removes instantly without shifting! |

---

## 📌 5. The "CPU Cache" Trap (Why ArrayList almost always wins)

In theory, `LinkedList` should be faster at inserting into the middle of a list. In reality, **ArrayList often beats LinkedList even for insertions.**

Why? **CPU Cache Locality.**
* Modern CPUs fetch data from RAM in "cache lines" (chunks of contiguous memory). 
* Because `ArrayList` uses contiguous memory, the CPU grabs a chunk of the array into its ultra-fast L1/L2 cache. Shifting elements in an array is essentially a lightning-fast `System.arraycopy()` memory block move.
* `LinkedList` nodes are scattered randomly across the heap. Traversing them causes **Cache Misses**, forcing the CPU to repeatedly fetch data from slow RAM.

---

## 📌 6. When to use which?

### ✅ Use ArrayList when:
* You have **frequent read/access** operations (`get(index)`).
* You mostly append elements to the end of the list.
* Memory overhead is a concern (you don't want to create millions of `Node` objects).
* **Rule of Thumb:** Default to `ArrayList` for 99% of your use cases.

### ✅ Use LinkedList when:
* You are implementing a **Queue** or **Deque** (since it implements the `Deque` interface).
* You are using an `Iterator` to frequently remove or insert elements *during* traversal.
* You are adding/removing elements from the extreme ends (Head/Tail) constantly.

---

## 🔥 Interview Gold Statement

> *"While LinkedList theoretically provides O(1) insertions, it is rarely used in modern Java because traversing to the insertion index still takes O(N), and it suffers from poor CPU cache locality and high memory overhead due to Node object wrappers. ArrayList is vastly superior in performance for almost all real-world scenarios due to contiguous memory allocation."*

---

## ⚡ Final Verdict

* ✅ **Use `ArrayList`** as your absolute default.
* ❌ **Avoid `LinkedList`** unless you strictly need a Queue/Deque implementation.
