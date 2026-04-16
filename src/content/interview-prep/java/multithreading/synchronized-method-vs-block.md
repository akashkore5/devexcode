---
title: "Synchronized method vs Synchronized block."
category: "multithreading"
order: 3
---

### Synchronized Method:
- Locks the **entire object** (`this`) or the entire class (`Class.class` for static).
- Coarse-grained locking.

### Synchronized Block:
- **Better**: Allows you to lock only a specific section of code.
- Can lock on a specific object instead of the whole instance.
- Reduces performance overhead by keeping the locked section as small as possible.
