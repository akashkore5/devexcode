---
title: "String s = 'abc' vs String s = new String('abc')."
category: "string"
order: 30
---

### Scenario A: `String s1 = "abc";`
- JVM checks the **String Constant Pool**.
- If "abc" exists, it returns the reference. If not, it creates it in the pool and returns the reference.
- **Result**: 1 object (in the pool) if new literal; 0 if it already exists.

### Scenario B: `String s2 = new String("abc");`
- JVM creates a new String object in the **Heap Area** (standard heap, not pool).
- It also ensures "abc" is in the String Pool.
- **Result**: 1 or 2 objects (1 in pool if not there, 1 in heap).

### Use Case:
Always use **literals** unless you specifically need a new instance in memory to avoid reference equality checks.
