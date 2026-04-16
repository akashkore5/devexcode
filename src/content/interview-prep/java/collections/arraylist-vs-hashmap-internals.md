---
title: "Internal working of ArrayList and HashMap."
category: "collections"
order: 1
---

### ArrayList Internals:
- **Structure**: Based on a dynamic array.
- **Growth**: When the array is full, it creates a new array of size `oldSize + (oldSize >> 1)` (approx 1.5x) and copies data using `Arrays.copyOf()`.
- **Complexity**: Access is O(1). Insertion/Deletion is O(n) due to shifting.

### HashMap Internals:
- **Hashing**: Uses `hashCode()` to find the bucket index (`index = hash & (n-1)`).
- **Collisions**: Handled via Linked List. In Java 8, if a bucket exceeds 8 elements, it converts to a **Red-Black Tree** (O(log n) search).
- **Key Check**: Uses `equals()` to find the exact key in the bucket.
- **Duplicate Key**: If a key exists, the old value is overwritten.
