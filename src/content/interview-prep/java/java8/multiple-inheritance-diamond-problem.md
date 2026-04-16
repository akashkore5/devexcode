---
title: "Multiple inheritance and Diamond Problem in Java 8."
category: "java8"
order: 12
---

### Is multiple inheritance possible?
- **Classes**: No.
- **Interfaces**: Yes, through default methods.

### Diamond Problem:
If a class implements two interfaces that have the same default method, a compiler error occurs.

### Solution:
The class must **override** the method and explicitly choose which interface method to call using the syntax:
```java
InterfaceName.super.methodName();
```
