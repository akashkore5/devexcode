---
title: "How many objects are created by String code?"
category: "string"
order: 33
---

### Puzzle:
```java
String s1 = "abc";
String s2 = new String("abc");
String s3 = s2.toUpperCase();
```

**Answer**: 3 objects.
1.  - Created in the **String Constant Pool** (if not already there).
2. `new String("abc")` - Created in the **Heap**.
3. `s2.toUpperCase()` - Creates a **new String** "ABC" in the Heap because Strings are immutable.

### Another Puzzle:
```java
String s = "Hello";
s.concat("World");
System.out.println(s);
```
**Output**: "Hello" 
**Objects**: 3 created ("Hello", "World", "HelloWorld"), but `s` still points to "Hello".
