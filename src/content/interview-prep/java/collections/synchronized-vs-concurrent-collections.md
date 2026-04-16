---
title: "Synchronized vs Concurrent Collections."
category: "collections"
order: 10
---

### Synchronized Collections (`Collections.synchronizedMap`, etc.):
- Lock the **entire collection** instance.
- Only one thread can perform any operation at a time.
- Iterators throw `ConcurrentModificationException`.

### Concurrent Collections (`ConcurrentHashMap`, `CopyOnWriteArrayList`, etc.):
- Lock only **portions** of the collection (or use CAS).
- Allow multiple threads to read/write simultaneously.
- Iterators are **fail-safe** and do not throw `ConcurrentModificationException`.
