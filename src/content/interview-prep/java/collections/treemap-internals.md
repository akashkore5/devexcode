---
title: "Internal working of TreeMap vs HashMap."
category: "collections"
order: 6
---

### TreeMap:
- **Structure**: Based on **Red-Black Tree** (Sorted map).
- **Ordering**: Elements are sorted by key (Natural order or custom Comparator).
- **Performance**: O(log n) for all operations (put, get, remove).
- **Nulls**: Does not allow null keys (needed for comparison).

### HashMap:
- **Structure**: Hashing + Array + Linked List/Tree.
- **Ordering**: No guarantee of order.
- **Performance**: O(1) average.
