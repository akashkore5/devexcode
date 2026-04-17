---
title: "How does Parallel Stream work internally? Is it always better?"
category: "java8"
order: 15
---

### How It Works Internally

1. **Source Splitting**: The stream's `Spliterator` divides the data source into chunks.
2. **ForkJoinPool**: Each chunk is submitted as a task to `ForkJoinPool.commonPool()`.
3. **Parallel Execution**: Worker threads process chunks concurrently.
4. **Combining Results**: Results from all chunks are merged back (e.g., via `Collectors`).

```
[1, 2, 3, 4, 5, 6, 7, 8]
        ↓ Spliterator splits
  [1,2,3,4]    [5,6,7,8]
     ↓ split      ↓ split
 [1,2] [3,4]  [5,6] [7,8]
   ↓     ↓      ↓     ↓    ← 4 worker threads
  f(1,2) f(3,4) f(5,6) f(7,8)
     ↓     ↓      ↓     ↓
      combine    combine
          ↓
       final result
```

### The Common Pool Problem
```java
// ALL parallel streams in your app share the same pool!
ForkJoinPool.commonPool(); // size = availableProcessors() - 1

// A slow stream blocks others:
list1.parallelStream().map(x -> slowIOCall(x));  // ⚠️ Hogs the pool
list2.parallelStream().map(x -> fastCompute(x)); // ⚠️ Starved
```

**Workaround** — Use a custom pool:
```java
ForkJoinPool customPool = new ForkJoinPool(4);
customPool.submit(() ->
    list.parallelStream().forEach(this::process)
).get();
```

### Is It Always Better? **No!**

| Scenario | Sequential | Parallel | Winner |
|----------|-----------|----------|--------|
| Small dataset (< 10K) | Fast | Overhead of splitting/merging | **Sequential** |
| Simple operations (identity map) | Fast | Splitting overhead > gain | **Sequential** |
| I/O-bound (REST/DB calls) | Blocking | Blocks ForkJoinPool threads | **Sequential** (use async instead) |
| Large dataset + CPU-heavy ops | Slow | Massive speedup | **Parallel** ✅ |
| LinkedList source | N/A | Poor splittability | **Sequential** |
| ArrayList / Array source | N/A | Excellent splittability | **Parallel** ✅ |

### Data Source Splittability

| Source | Splittability | Good for Parallel? |
|--------|--------------|-------------------|
| `ArrayList` | Excellent | ✅ Yes |
| `int[]`, `long[]` | Excellent | ✅ Yes |
| `HashSet` | Good | ✅ Yes |
| `TreeSet` | Good | ✅ Yes |
| `LinkedList` | Poor | ❌ No |
| `Stream.iterate()` | Poor | ❌ No |

### Golden Rule
> Use parallel streams **only** when: the dataset is large (100K+), operations are CPU-intensive, the source splits well (arrays/ArrayLists), and operations are stateless & thread-safe.
