---
title: "Thread-specific runtime data areas in JVM and their roles?"
category: "fundamentals"
order: 3
---

### Thread-Specific Areas:
1. **PC (Program Counter) Register**: Maintains the address of the current JVM instruction being executed. Each thread has its own PC register.
2. **JVM Stack**: Stores "Stack Frames". A new frame is created for every method call. Contains local variables, operand stack, and frame data.
3. **Native Method Stack**: Used for native methods (written in C/C++).

### Impact of Thread Creation:
- Creating a thread allocates memory for these three areas.
- **Memory Overhead**: Excessive thread creation can lead to `OutOfMemoryError` (unable to create new native thread) or `StackOverflowError` if thread stacks are too deep.
- **Tuning**: `-Xss` sets the stack size per thread.
