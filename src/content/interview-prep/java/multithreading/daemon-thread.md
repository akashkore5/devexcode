---
title: "What is a daemon thread in Java?"
category: "multithreading"
order: 15
---

**Daemon threads** are low-priority threads that provide services to user threads (e.g., Garbage Collector).

### Key Characteristics:
- They do not prevent the JVM from exiting. When all user threads finish, the JVM terminates, even if daemon threads are still running.
- They must be set as daemon **before** starting the thread.

### Code:
```java
Thread t = new Thread(new MyRunnable());
t.setDaemon(true); // Must be called before start()
t.start();
```
If you call `setDaemon(true)` after `start()`, it throws an `IllegalThreadStateException`.
