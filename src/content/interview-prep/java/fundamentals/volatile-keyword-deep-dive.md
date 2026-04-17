---
title: "volatile keyword — Why does it exist, when do you actually need it."
category: "fundamentals"
order: 10
---

### What is `volatile`?
The `volatile` keyword guarantees that reads and writes to a variable go directly to **main memory**, bypassing the CPU cache. It establishes a **happens-before** relationship.

### Why Does It Exist?
Without `volatile`, the JVM and CPU may:
1. **Cache variables** in CPU registers/L1 cache — other threads see stale values.
2. **Reorder instructions** for performance — breaking assumptions about execution order.

```java
// BUG: Without volatile, Thread 2 may NEVER see running = false
private boolean running = true; // Thread 1 sets false, Thread 2 loops forever

// FIX:
private volatile boolean running = true;
```

### When Do You Actually Need It?

**1. Status Flags (Most Common)**
```java
private volatile boolean shutdown = false;

// Writer thread
public void stop() { shutdown = true; }

// Reader thread
public void run() {
    while (!shutdown) { /* work */ }
}
```

**2. Double-Checked Locking (Singleton)**
```java
private static volatile Singleton instance;

public static Singleton getInstance() {
    if (instance == null) {
        synchronized (Singleton.class) {
            if (instance == null) {
                instance = new Singleton(); // Without volatile, partially constructed object visible
            }
        }
    }
    return instance;
}
```

**3. Publishing Immutable Objects**
```java
private volatile Config config; // Ensures all fields of Config are visible after assignment
```

### When NOT to Use `volatile`
- **Compound operations**: `counter++` is NOT atomic even with volatile (read-modify-write). Use `AtomicInteger` instead.
- **Multiple dependent variables**: If two variables must be updated atomically, use `synchronized` or locks.

### volatile vs synchronized

| Feature | volatile | synchronized |
|---------|----------|-------------|
| **Atomicity** | Only for single read/write | Full mutual exclusion |
| **Blocking** | Never blocks | Can block threads |
| **Performance** | Faster (no locking) | Slower (lock acquisition) |
| **Use Case** | Visibility flags | Critical sections |

### Interview Insight
`volatile` solves the **visibility** problem, not the **atomicity** problem. It's the lightest synchronization mechanism in Java. If you need both visibility AND atomicity, use `AtomicXxx` classes or `synchronized`.
