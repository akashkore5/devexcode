---
title: "What is MetaSpace? How does it differ from PermGen?"
category: "fundamentals"
order: 9
---

**MetaSpace** (Java 8+) replaced the **PermGen** (Permanent Generation) from earlier versions.

### Key Differences:
1. **Memory Type**: PermGen was part of the **JVM Heap** (contiguous memory). MetaSpace uses **Native Memory** (RAM outside the heap).
2. **Sizing**: PermGen had a fixed max size (`-XX:MaxPermSize`), often leading to `java.lang.OutOfMemoryError: PermGen space`. MetaSpace can grow dynamically based on available system memory.
3. **Management**: Garbage collection of classes is more efficient in MetaSpace.
4. **Args**: PermGen used `-XX:PermSize`; MetaSpace uses `-XX:MetaspaceSize`.
