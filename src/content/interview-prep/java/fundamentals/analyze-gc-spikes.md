---
title: "Analyzing GC spikes and frequent Full GCs in production."
category: "fundamentals"
order: 7
---

### Detection and Analysis:
1. **GC Logs**: Use `-Xlog:gc` (Java 9+) or `-XX:+PrintGCDetails`. Check frequency and duration.
2. **JFR (Java Flight Recorder)**: Analyze "GC Events" to see which generation is filling up.
3. **Heap Dump**: Use `jmap` or `jcmd` to trigger a dump. Analyze with **Eclipse MAT** to find memory leaks.

### Common Causes:
- **Memory Leak**: Objects not being released (check static collections).
- **Undersized Heap**: Heap is too small for the load.
- **Large Object Allocation**: Humongous objects bypass young gen and go to old gen.

### Resolution:
- Tune `-Xmx` and `-Xms`.
- Change GC strategy (e.g., switch to **G1GC** or **ZGC**).
- Optimize code to reduce object churn.
