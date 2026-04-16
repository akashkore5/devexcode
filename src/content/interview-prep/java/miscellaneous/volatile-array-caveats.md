---
title: "Can we make an array volatile? Any caveats?"
category: "miscellaneous"
order: 5
---

### The Fact:
Yes, you can declare an array as `volatile`: `private volatile int[] data;`.

### The Caveat (Crucial!):
- Marking an array as `volatile` only makes the **reference** to the array volatile.
- It does **not** make the individual elements inside the array volatile.
- If you change `data[0] = 5`, there is no visibility guarantee for other threads.

### The Solution:
Use **AtomicReferenceArray** from `java.util.concurrent.atomic`.
