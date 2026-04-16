---
title: "ConcurrentHashMap vs HashTable."
category: "collections"
order: 2
---

### Why ConcurrentHashMap over HashTable?
- **HashTable**: Synchronizes the entire map for every operation, meaning only one thread can access the map at a time. This leads to poor performance.
- **ConcurrentHashMap (Java 7)**: Used **Segment Locking**. Only part of the map was locked.
- **ConcurrentHashMap (Java 8+)**: Uses **CAS (Compare-And-Swap)** and synchronized on the **head node** of the bucket. Multiple threads can perform write operations on different buckets simultaneously.

### Key Features:
- Does not allow null keys or values.
- Iterator is **fail-safe** (does not throw `ConcurrentModificationException`).
