---
title: "Implement a program to print Thread1 and Thread2 from two parallel threads in sequential order."
category: "multithreading"
order: 10
---

### The Problem
Two threads must alternate printing `"Thread1"` and `"Thread2"` in strict sequential order, despite running in parallel.

### Solution 1: Using `wait()` / `notify()`
```java
public class SequentialPrinter {
    private static final Object lock = new Object();
    private static boolean thread1Turn = true;

    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                synchronized (lock) {
                    while (!thread1Turn) {
                        try { lock.wait(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
                    }
                    System.out.println("Thread1");
                    thread1Turn = false;
                    lock.notify();
                }
            }
        });

        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                synchronized (lock) {
                    while (thread1Turn) {
                        try { lock.wait(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
                    }
                    System.out.println("Thread2");
                    thread1Turn = true;
                    lock.notify();
                }
            }
        });

        t1.start();
        t2.start();
    }
}
```

### Solution 2: Using `Semaphore`
```java
Semaphore sem1 = new Semaphore(1); // starts with permit
Semaphore sem2 = new Semaphore(0); // starts without permit

Thread t1 = new Thread(() -> {
    for (int i = 0; i < 5; i++) {
        try {
            sem1.acquire();
            System.out.println("Thread1");
            sem2.release();
        } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
});

Thread t2 = new Thread(() -> {
    for (int i = 0; i < 5; i++) {
        try {
            sem2.acquire();
            System.out.println("Thread2");
            sem1.release();
        } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
});
```

### Why `while` instead of `if` for `wait()`?
- **Spurious wakeups** can occur — the thread may wake up without `notify()` being called.
- The `while` loop re-checks the condition, ensuring correctness.

### Interview Insight
This tests your understanding of **inter-thread communication**, **happens-before guarantees**, and **condition-based synchronization**. Semaphore-based solution is cleaner and avoids the spurious wakeup pitfall explicitly.
