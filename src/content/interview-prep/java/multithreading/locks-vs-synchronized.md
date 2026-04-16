---
title: "synchronized vs Lock Interface."
category: "multithreading"
order: 5
---

| Feature | synchronized | Lock (ReentrantLock) |
| :--- | :--- | :--- |
| **Flexibility** | Less (Scoped to block) | High (Explicit lock/unlock) |
| **Timeout** | No | Yes (`tryLock`) |
| **Interruptible** | No | Yes (`lockInterruptibly`) |
| **Fairness** | No | Yes (Optional) |
| **Condition Vars** | One (`wait/notify`) | Multiple (`Condition`) |
