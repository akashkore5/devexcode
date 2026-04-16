---
title: "Difference between terminal and intermediate operations in Streams."
category: "java8"
order: 9
---

### Intermediate Operations
- **Lazy**: They are not executed until a terminal operation is called.
- **Return Type**: They return a new `Stream`.
- **Examples**: `filter()`, `map()`, `sorted()`, `distinct()`.

### Terminal Operations
- **Eager**: They trigger the processing of the stream pipeline.
- **Return Type**: They return a non-stream result (List, Optional, long, void).
- **Examples**: `collect()`, `forEach()`, `count()`, `reduce()`, `findFirst()`.
