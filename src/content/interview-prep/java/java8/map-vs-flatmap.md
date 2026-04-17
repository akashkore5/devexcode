---
title: "map() vs flatMap(): One-to-One vs One-to-Many with Examples"
category: "java8"
order: 17
---

### The Core Difference
- **`map()`**: Transforms each element **one-to-one**. Wraps result in the stream.
- **`flatMap()`**: Transforms each element **one-to-many**, then **flattens** all results into a single stream.

```
map:     [A, B, C] → [f(A), f(B), f(C)]
flatMap: [A, B, C] → [f(A)₁, f(A)₂, f(B)₁, f(C)₁, f(C)₂, f(C)₃]
```

### Example 1: Simple Transformation (map is sufficient)
```java
List<String> names = List.of("akash", "rahul", "amit");

List<String> upper = names.stream()
    .map(String::toUpperCase)        // "akash" → "AKASH"
    .collect(Collectors.toList());
// [AKASH, RAHUL, AMIT]
```

### Example 2: Nested Lists — The Problem map() Can't Solve
```java
List<List<String>> teams = List.of(
    List.of("Akash", "Rahul"),
    List.of("Amit", "Ankit"),
    List.of("Raj")
);

// ❌ map() — gives Stream<List<String>>, NOT flattened
List<List<String>> wrong = teams.stream()
    .map(team -> team)               // each element is still a List
    .collect(Collectors.toList());
// [[Akash, Rahul], [Amit, Ankit], [Raj]]

// ✅ flatMap() — flattens into Stream<String>
List<String> allMembers = teams.stream()
    .flatMap(Collection::stream)     // each List → its elements
    .collect(Collectors.toList());
// [Akash, Rahul, Amit, Ankit, Raj]
```

### Example 3: Splitting Strings
```java
List<String> sentences = List.of("Hello World", "Java Streams");

// map → Stream<String[]> ← still wrapped
List<String[]> mapped = sentences.stream()
    .map(s -> s.split(" "))
    .collect(Collectors.toList());

// flatMap → Stream<String> ← flattened
List<String> words = sentences.stream()
    .flatMap(s -> Arrays.stream(s.split(" ")))
    .collect(Collectors.toList());
// [Hello, World, Java, Streams]
```

### Example 4: Optional (map vs flatMap)
```java
Optional<String> name = Optional.of("Akash");

// map — wraps result in Optional
Optional<String> upper = name.map(String::toUpperCase);
// Optional[AKASH]

// flatMap — expects the function to return Optional (avoids nesting)
Optional<Optional<String>> nested = name.map(n -> Optional.of(n.toUpperCase()));
// Optional[Optional[AKASH]] ← ❌ double wrapping

Optional<String> flat = name.flatMap(n -> Optional.of(n.toUpperCase()));
// Optional[AKASH] ← ✅ flattened
```

### Visual Summary
| | Input | Function Returns | Output |
|---|-------|-----------------|--------|
| `map()` | `Stream<T>` | `R` | `Stream<R>` |
| `flatMap()` | `Stream<T>` | `Stream<R>` | `Stream<R>` (flattened) |

### When to Use?
- **`map()`**: One element in → one element out (uppercase, parse, extract field).
- **`flatMap()`**: One element in → zero or many elements out (split, expand nested collections, chain Optionals).
