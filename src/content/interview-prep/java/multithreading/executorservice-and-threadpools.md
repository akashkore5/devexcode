---
title: "ExecutorService and Thread Pool types."
category: "multithreading"
order: 4
---

### Why use it?
Decouples task submission from task execution. Manages a pool of threads instead of creating a new one for every task.

### Types:
1. **FixedThreadPool**: Fixed number of threads.
2. **CachedThreadPool**: Creates new threads as needed, reuses idle ones.
3. **SingleThreadExecutor**: Exactly one thread.
4. **ScheduledThreadPool**: For delayed or periodic tasks.

### Crucial Note:
Avoid using `Executors.newCachedThreadPool()` for high-load systems because it can create an unbounded number of threads, leading to OOM.
