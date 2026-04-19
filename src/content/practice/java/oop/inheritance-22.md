---
title: "22. Pattern Matching for instanceof"
category: "oop"
order: 22
---

### The Scenario
Java 16 introduced pattern matching for `instanceof`, which simplifies the common "check-then-cast" idiom. This is a significant enhancement to how we handle polymorphism safely.

Predict the output of the following code.

```java
class Shape { }
class Circle extends Shape {
    double radius = 5.0;
    void info() { System.out.println("Circle"); }
}

public class Main {
    public static void main(String[] args) {
        Object obj = new Circle();

        if (obj instanceof Circle c && c.radius > 0) {
            c.info();
            System.out.println(c.radius);
        } else {
            System.out.println("Not a positive circle");
        }
        
        // Scope Check
        // System.out.println(c.radius); // Will this work?
    }
}
```

### Expected Output
```text
Circle
5.0
```

### Explanation
1. **Binding Variable**: The syntax `obj instanceof Circle c` introduces a **binding variable** `c`.
2. **Implicit Cast**: If the `instanceof` check is true, `c` is automatically initialized as a casted version of `obj`.
3. **Short-circuiting**: The binding variable is available in the rest of the `if` condition if joined by `&&`.
4. **Flow Scoping**: The variable `c` is only in scope where the compiler can prove the check succeeded. It is **not** in scope after the `if` block or in the `else` block.
