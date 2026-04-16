---
title: "wait(), notify(), notifyAll() - Why in Object class?"
category: "multithreading"
order: 2
---

### Why in Object class?
Because these methods are used for **Inter-thread communication** and depend on the **Monitor (Lock)** associated with every object in Java. Every object serves as a lock/monitor, so the methods belong to the `Object` class.

### Key Rules:
- Must be called from a **synchronized** context.
- `wait()` releases the lock and enters the waiting state.
- `notify()` wakes up a single random thread waiting on the object's monitor.
- `notifyAll()` wakes up all threads waiting on the object's monitor.
