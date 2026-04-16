---
title: "Race Condition vs Visibility problem."
category: "multithreading"
order: 13
---

### 1. Visibility Problem:
- Occurs when one thread updates a shared variable in its CPU cache, but another thread doesn't see the update because it's reading from its own cache.
- **Solution**: Use `volatile` or `synchronized`.

### 2. Race Condition:
- Occurs when multiple threads access and modify shared data concurrently, and the final result depends on the timing of their execution (e.g., `count++`).
- `count++` is actually 3 operations (read, increment, write).
- **Solution**: Use `synchronized` or `AtomicInteger`. `volatile` does **not** solve race conditions.
