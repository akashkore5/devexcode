---
title: "What is Exception Propagation and how does it look in code?"
category: "exceptions"
order: 5
---

### Definition:
An exception is first thrown from the top of the call stack and if it is not caught, it drops down the call stack to the previous method. If not caught there, it propagates further down until it is caught or the stack becomes empty.

### Code Example:
```java
void method3() {
    throw new RuntimeException("Error at top");
}
void method2() { method3(); }
void method1() {
    try { method2(); }
    catch (Exception e) { System.out.println("Caught in method1: " + e.getMessage()); }
}
```

### Important Rule: 
By default, **Unchecked Exceptions** are propagated. **Checked Exceptions** are not propagated by the compiler; you must explicitly use the `throws` keyword.
