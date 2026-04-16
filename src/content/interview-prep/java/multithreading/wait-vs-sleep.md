---
title: "wait() vs sleep()?"
category: "multithreading"
order: 1
---

| Feature | wait() | sleep() |
| :--- | :--- | :--- |
| **Class** | Object | Thread |
| **Lock Handling** | Releases the lock | Keeps the lock |
| **Context** | Must be called from synchronized block | Can be called from anywhere |
| **Waking up** | Needs notify() or notifyAll() | Wakes up after time expires |
