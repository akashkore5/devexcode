---
title: "Why ConcurrentModificationException occurs?"
category: "collections"
order: 15
---

### Why it happens:
When a **fail-fast** iterator detects that the collection has been modified (structurally) while it was iterating over it. It tracks a `modCount` variable.

### How to avoid:
1. Use `iterator.remove()` instead of `list.remove()`.
2. Use **Concurrent Collections** (`CopyOnWriteArrayList`, `ConcurrentHashMap`) which are **fail-safe**.
3. Use stream-based filtering instead of manual iteration.
