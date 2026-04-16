---
title: "Explain Java Memory Model (JMM) and its guarantees."
category: "fundamentals"
order: 4
---

**JMM** is a specification that defines how the JVM interacts with computer memory (RAM, CPU Cache). It provides rules for synchronization and memory visibility.

### Key Guarantees:
1. **Visibility**: If one thread modifies a shared variable, other threads should see the change. (Achieved via `volatile` or `synchronized`).
2. **Atomicity**: Operations like reading/writing referencing variables are atomic. (`long` and `double` are exceptions unless marked `volatile`).
3. **Ordering**: Prevents instruction reordering by the compiler or CPU that could break multi-threaded logic.

### Main Rule:
- **Happens-Before Relationship**: Defines the order in which memory actions are visible to threads.
