---
title: "JVM args to fine tune performance."
category: "fundamentals"
order: 8
---

### Common Tuning Args:
- **Memory**: `-Xms` (start heap), `-Xmx` (max heap), `-Xss` (thread stack size).
- **GC Collector**: `-XX:+UseG1GC`, `-XX:+UseZGC`, `-XX:+UseParallelGC`.
- **GC Details**: `-Xlog:gc*` (Java 9+), `-XX:+PrintGCDetails`.
- **Metaspace**: `-XX:MetaspaceSize`, `-XX:MaxMetaspaceSize`.
- **Heap Dump on Error**: `-XX:+HeapDumpOnOutOfMemoryError`.
- **Tiered Compilation**: `-XX:+TieredCompilation`.
