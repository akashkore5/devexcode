---
title: "How does the JVM implement volatile variables and atomic operations?"
category: "fundamentals"
order: 6
---

### 1. Volatile Variables
- **Memory Barrier**: The JVM inserts a "Memory Barrier" (Fence) instruction. 
- **Visibility**: Forces the thread to read/write directly from **Main Memory** instead of CPU cache.
- **No Caching**: Prevents instruction reordering around the volatile variable.

### 2. Atomic Operations
- **CAS (Compare-And-Swap)**: Most atomic classes (`AtomicInteger`, etc.) use CPU-level CAS instructions.
- **CPU Instruction**: It's a single, indivisible CPU instruction that checks if the value is what we expect; if yes, it updates it.
- **Non-blocking**: Unlike `synchronized`, CAS is non-blocking (optimistic locking).
