---
title: "CountDownLatch vs CyclicBarrier."
category: "multithreading"
order: 6
---

### CountDownLatch:
- A one-time barrier. Once the count reaches zero, it cannot be reset.
- Main thread waits for N threads to finish.
- Method: `countDown()`, `await()`.

### CyclicBarrier:
- Can be **reused** after the count reaches zero.
- N threads wait for each other at a common point before proceeding.
- Method: `await()`.
