---
title: "What is a Spliterator? Diff between Iterator vs Spliterator."
category: "java8"
order: 11
---

**Spliterator** (Splitable Iterator) is used for traversing and partitioning sequences.

### Key Differences:
1. **Parallelism**: Iterator is strictly sequential. Spliterator is designed to support parallel processing (used by Streams).
2. **Method**: Iterator uses `next()`. Spliterator uses `tryAdvance()` (combination of hasNext and next).
3. **Splitting**: Spliterator has `trySplit()` which partitions a portion of elements into a new Spliterator for parallel threads.
