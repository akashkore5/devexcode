---
title: "What is PriorityQueue?"
category: "collections"
order: 14
status: "not-started"
tags: ["PriorityQueue", "Heap", "Collections", "Sorting"]
---

# 🔹 PriorityQueue (Deep Dive, Interview-Ready)

A standard Queue operates on a strictly **FIFO** (First-In, First-Out) basis. However, in many real-world systems, tasks have different levels of urgency. A VIP customer should be processed before a standard customer, even if they arrived later. This is exactly what `PriorityQueue` solves.

---

## 📌 1. Core Definition (One-Liner)

> **`PriorityQueue` is an unbounded queue backed by a Priority Heap array, where elements are ordered according to their natural ordering (or a custom Comparator), ensuring that the "least" element is always at the head of the queue.**

---

## 📊 2. Key Characteristics

| Feature | Details |
| :--- | :--- |
| **Underlying Data Structure** | Min-Heap (Array-based binary heap) |
| **Ordering** | Natural Ordering (`Comparable`) or custom `Comparator` |
| **Head of Queue** | Always the **smallest** element (according to the sort order) |
| **Null Values** | ❌ **Not Allowed** (Throws `NullPointerException`) |
| **Thread Safety** | ❌ **Not thread-safe** (Use `PriorityBlockingQueue` instead) |
| **Time Complexity** | $O(\log n)$ for enqueing/dequeing; $O(1)$ for peeking |

---

## 📌 3. How the Heap Works Internally

A `PriorityQueue` is conceptually a **Binary Min-Heap**, but it is stored flat in a standard Java array (`Object[] queue`).

### 🔸 Enqueue (`add()` / `offer()`) - $O(\log n)$
When you add an element:
1. It is placed at the very end of the array.
2. It "bubbles up" (sifts up) the tree by comparing itself with its parent. If it is smaller than its parent, they swap. This continues until the heap property is restored.

### 🔸 Dequeue (`poll()`) - $O(\log n)$
When you remove an element:
1. The smallest element (index 0) is removed.
2. The very last element in the array is moved to index 0.
3. It "bubbles down" (sifts down) by comparing itself to its children, swapping with the smaller child until the heap property is restored.

### 🔸 Peek (`peek()`) - $O(1)$
Because the smallest element is mathematically guaranteed to be at index 0 of the array, peeking is instantaneous.

---

## 📌 4. Practical Implementation

### 🔸 1. Default (Min-Heap)
By default, integers are ordered naturally (ascending). Thus, a standard `PriorityQueue` acts as a **Min-Heap**.
```java
Queue<Integer> pq = new PriorityQueue<>();
pq.add(10);
pq.add(5);
pq.add(20);

System.out.println(pq.poll()); // Prints 5
System.out.println(pq.poll()); // Prints 10
```

### 🔸 2. Custom Order (Max-Heap)
If you want the *largest* element to be processed first (a **Max-Heap**), you simply pass a reverse comparator in the constructor.
```java
Queue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
maxHeap.add(10);
maxHeap.add(5);
maxHeap.add(20);

System.out.println(maxHeap.poll()); // Prints 20
```

---

## 📌 5. Common Interview Questions

**Q: Can you iterate over a PriorityQueue to get elements in sorted order?**
❌ **No.** The iterator provided by `PriorityQueue` does *not* guarantee traversal in sorted order. It simply traverses the underlying array, which represents a heap, not a fully sorted list. To get elements in sorted order, you must continuously call `poll()` until the queue is empty.

**Q: Why doesn't PriorityQueue allow nulls?**
Because elements must be compared to each other to maintain the heap structure. If `null` was inserted, calling `compareTo` or `compare` against it would result in a `NullPointerException` during the sorting process.

---

## 🔥 Interview Gold Statement

> *"PriorityQueue is a highly efficient implementation of a binary Min-Heap backed by an array. It provides $O(\log n)$ time for insertions and removals while keeping the 'least' element—as defined by a Comparator—immediately accessible in $O(1)$ time at the head. It is the perfect data structure for algorithms requiring constant access to the current maximum or minimum, such as Dijkstra's algorithm or finding the Top K elements in a stream."*

---

## ⚡ Final Verdict

* ✅ **Use `PriorityQueue`** for scheduling, pathfinding algorithms, and Top-K element problems.
* ❌ **Do not use it** if you need to frequently search for random elements ($O(n)$) or if you just need a standard FIFO queue (`LinkedList` is better).
