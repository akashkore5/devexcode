---
title: "WeakHashMap and types of References."
category: "collections"
order: 12
---

### References in Java:
1. **Strong Reference**: Standard object creation. Prevent GC.
2. **Weak Reference**: GC reclaims if only weak references point to it. Used in `WeakHashMap`.
3. **Soft Reference**: GC reclaims only when JVM absolutely needs memory. Useful for caches.
4. **Phantom Reference**: Used to perform post-mortem cleanups.

### WeakHashMap:
- Entries are automatically removed when the **key** is no longer in ordinary use (no strong references).
- Useful for building metadata/property maps for objects you don't control.
