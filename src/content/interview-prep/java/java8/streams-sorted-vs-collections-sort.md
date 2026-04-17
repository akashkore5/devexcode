---
title: "Performance difference between Streams.sorted() vs Collections.sort()"
category: "java8"
order: 13
---

### Collections.sort()
```java
List<String> list = new ArrayList<>(Arrays.asList("banana", "apple", "cherry"));
Collections.sort(list); // In-place sort
```
- **Mechanism**: Uses **TimSort** (hybrid merge sort + insertion sort).
- **Time**: O(n log n).
- **Space**: O(n) for merge operations.
- **In-place**: Yes — modifies the original list directly.
- **Type**: Eager — sorts immediately.

### Streams.sorted()
```java
List<String> sorted = list.stream()
    .sorted()
    .collect(Collectors.toList());
```
- **Mechanism**: Also uses **TimSort** internally.
- **Time**: O(n log n).
- **Space**: O(n) — creates a new list + stream pipeline overhead.
- **In-place**: No — produces a new collection.
- **Type**: Lazy — deferred until a terminal operation triggers it.

### Key Performance Differences

| Aspect | Collections.sort() | Streams.sorted() |
|--------|-------------------|-------------------|
| **Overhead** | Minimal | Stream pipeline creation, boxing/unboxing |
| **Memory** | Sorts in-place | Creates intermediate + result collections |
| **Parallelism** | Not parallel | Can use `.parallelStream().sorted()` |
| **Best For** | Simple in-place sorting | Chained transformations (filter→sort→map) |

### When Streams.sorted() is Slower
- **Small datasets**: Stream pipeline setup cost dominates.
- **Primitive arrays**: Autoboxing overhead (`int` → `Integer`).
- **Single operation**: If you only need to sort, `Collections.sort()` avoids unnecessary object creation.

### When Streams.sorted() Wins
- **Chained operations**: `filter().sorted().map().collect()` — sorting is just one step in a pipeline.
- **Immutability**: You don't want to mutate the original list.
- **Parallel sort**: `parallelStream().sorted()` can leverage multiple cores for large datasets (>10K+ elements).

### Interview Insight
Both use **TimSort** under the hood. The real difference is **overhead**: Streams have pipeline creation cost and produce new collections. For isolated sorting, `Collections.sort()` is faster. For functional pipelines, `Streams.sorted()` is idiomatic and composable.
