---
title: "Lambdas vs Anonymous Inner Classes (Scope and Performance)."
category: "java8"
order: 7
---

### 1. Scope
- **this keyword**: In an anonymous class, `this` refers to the anonymous class itself. In a lambda, `this` refers to the enclosing class.
- **Variables**: Both can access effectively final local variables.

### 2. Performance (and Compilation)
- **Class Files**: Anonymous classes generate a separate `.class` file (e.g., `Main.class`). Lambdas do not; they use `invokedynamic` (Java 7+ feature) to create a call site.
- **Memory**: Lambdas are generally more memory-efficient as they don't always create a new object instance (depending on whether they capture state).
