---
title: "CopyOnWriteArrayList vs ArrayList."
category: "collections"
order: 11
---

### What is it?
A thread-safe variant of `ArrayList` where all mutative operations (`add`, `set`, etc.) are implemented by making a **fresh copy** of the underlying array.

### Key Points:
- **Lock-free Reading**: Iterators traverse a snapshot of the array, so they never encounter `ConcurrentModificationException`.
- **Cost**: Very expensive for write-intensive applications due to array copying.
- **Use Case**: Best for scenarios where **traversal is much more frequent** than modification (e.g., event listener lists).
