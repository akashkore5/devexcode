---
title: "Thread vs Runnable? Which is better?"
category: "multithreading"
order: 1
---

### Extending Thread:
- Limited by single inheritance (you cannot extend another class).

### Implementing Runnable:
- **Better**: Leaves your class free to extend another class.
- Supports better separation of task (the code in `run()`) and worker (the `Thread` instance).
- Ideal for use with `ExecutorService`.

### Runnable as Lambda:
```java
Thread t = new Thread(() -> System.out.println("Running..."));
t.start();
```
