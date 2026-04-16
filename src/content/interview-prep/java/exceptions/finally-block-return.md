---
title: "Finally block return behavior with code example."
category: "exceptions"
order: 2
---

### The Rule:
If a `finally` block returns a value, it **overrides** the value returned in the `try` or `catch` block.

### Example:
```java
public static int test() {
    try { return 10; }
    catch (Exception e) { return 20; }
    finally { return 30; }
}
// Outputs: 30
```
**Note**: It is considered bad practice to return from a `finally` block.
