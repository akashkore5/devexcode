---
title: "Stream API vs Collection API: Key Differences & When to Use Each"
category: "java8"
order: 14
---

### Fundamental Difference
- **Collection API**: A data structure that **stores and manages** elements in memory (List, Set, Map).
- **Stream API**: A **computational pipeline** that processes elements from a source — it does not store data.

### Detailed Comparison

| Aspect | Collection | Stream |
|--------|-----------|--------|
| **Purpose** | Store & organize data | Process & transform data |
| **Storage** | Holds elements in memory | Does NOT store elements |
| **Laziness** | Eager — elements exist immediately | Lazy — intermediate ops execute only on terminal op |
| **Consumable** | Can iterate multiple times | **Single-use** — consumed after terminal operation |
| **Modification** | Can add/remove elements | Cannot modify the source |
| **Iteration** | External (`for`, `iterator`) | Internal (handled by the stream) |
| **Parallelism** | Manual thread management | Built-in via `parallelStream()` |

### Example: The Difference in Action
```java
List<String> names = Arrays.asList("Akash", "Rahul", "Amit", "Ankit", "Raj");

// Collection way — external iteration, manual filtering
List<String> result = new ArrayList<>();
for (String name : names) {
    if (name.startsWith("A")) {
        result.add(name.toUpperCase());
    }
}

// Stream way — declarative, internal iteration
List<String> result = names.stream()
    .filter(name -> name.startsWith("A"))
    .map(String::toUpperCase)
    .collect(Collectors.toList());
// Both produce: [AKASH, AMIT, ANKIT]
```

### Laziness Demonstration
```java
List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5);

// Nothing executes here — intermediate operations are lazy
Stream<Integer> stream = nums.stream()
    .filter(n -> {
        System.out.println("Filtering: " + n);
        return n > 2;
    })
    .map(n -> {
        System.out.println("Mapping: " + n);
        return n * 10;
    });

// Execution starts ONLY when terminal operation is called
List<Integer> result = stream.collect(Collectors.toList());
```

### Streams Are Single-Use
```java
Stream<String> s = names.stream();
s.forEach(System.out::println); // ✅ Works
s.forEach(System.out::println); // ❌ IllegalStateException: stream already closed
```

### When to Use What?
- **Collection**: When you need to store, retrieve, or modify data.
- **Stream**: When you need to filter, transform, aggregate, or search through data in a pipeline.
