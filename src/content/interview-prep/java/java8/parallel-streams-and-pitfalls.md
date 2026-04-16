---
title: "Parallel streams? When to use and Pitfalls."
category: "java8"
order: 10
---

### What is it?
A way to execute stream operations in parallel using the **ForkJoinPool**. Created via `list.parallelStream()` or `stream.parallel()`.

### When to use?
- Large datasets.
- Computationally intensive tasks per element.
- When the order of processing does not matter.

### Pitfalls in Web Applications:
- **Common Pool Contention**: By default, all parallel streams share the same global `ForkJoinPool.commonPool()`. One heavy stream can block the entire application's parallel tasks.
- **Thread Safety**: Operations inside must be stateless and thread-safe.
- **Overhead**: For small datasets, the overhead of splitting and merging tasks makes parallel streams slower than sequential ones.
