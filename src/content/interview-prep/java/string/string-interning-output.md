---
title: "Output of String interning puzzles."
category: "string"
order: 31
---

### Scenario:
```java
String s1 = "Java";
String s2 = "Java";
String s3 = new String("Java");
String s4 = s3.intern();

System.out.println(s1 == s2); // true (Both refer to Pool)
System.out.println(s1 == s3); // false (s3 is in Heap, s1 is in Pool)
System.out.println(s1 == s4); // true (s4 is the interned reference from Pool)
```

### Explanation:
- `==` checks for reference equality.
- `s1` and `s2` are literals, so they share the same memory location in the String Pool.
- `s3` is created in the Heap using `new`, so it has a different memory address.
- `s3.intern()` returns the reference of "Java" from the pool, which is the same address as `s1`.
