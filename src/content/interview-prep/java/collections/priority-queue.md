---
title: "What is PriorityQueue?"
category: "collections"
order: 14
---

- An unbounded queue based on a **Priority Heap**.
- Elements are ordered according to their **natural ordering** or a supplied **Comparator**.
- The head of the queue is the **least** element with respect to the specified ordering.
- Does not allow nulls.
- Not thread-safe (`PriorityBlockingQueue` is the concurrent version).
