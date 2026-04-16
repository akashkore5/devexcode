---
title: "Categories of Functional Interfaces and Predicate vs Function vs Supplier."
category: "java8"
order: 2
---

### 4 Main Categories:
1. **Predicate<T>**: Takes one argument, returns `boolean`. (e.g., `test(T t)`)
2. **Function<T, R>**: Takes one argument, returns a result. (e.g., `apply(T t)`)
3. **Supplier<T>**: Takes no argument, returns a result. (e.g., `get()`)
4. **Consumer<T>**: Takes one argument, returns nothing (`void`). (e.g., `accept(T t)`)

### Differences:
- **Predicate**: Used for filtering/logic checks.
- **Function**: Used for transforming data from one type to another.
- **Supplier**: Used for lazy generation of values.
