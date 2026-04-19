---
title: "13. Sealed Classes: Controlled Inheritance"
category: "oop"
order: 13
---

### Scenario
Java 17 introduced **Sealed Classes** to allow developers to explicitly state which classes are allowed to extend a class.

### Code Block
```java
// Only Circle and Square are allowed to extend Shape
sealed class Shape permits Circle, Square {
    abstract void draw();
}

final class Circle extends Shape {
    void draw() { System.out.println("Drawing Circle"); }
}

non-sealed class Square extends Shape {
    void draw() { System.out.println("Drawing Square"); }
}

// class Triangle extends Shape { } // COMPILE ERROR: Triangle is not permitted

public class Main {
    public static void main(String[] args) {
        Shape s = new Circle();
        s.draw();
    }
}
```

### Expected Output
```text
Drawing Circle
```

### Explanation
- **sealed**: Marks the class as restricted.
- **permits**: Lists the allowed subclasses.
- **final/non-sealed**: Subclasses of a sealed class must be either `final`, `sealed`, or `non-sealed`.

### Execution Flow
1. Compiler verifies that all subclasses listed in `permits` actually extend the class.
2. Compiler checks if any "unauthorized" classes try to extend it.
3. At runtime, the behavior is standard inheritance.

### Deep Dive
Sealed classes are great for **Algebraic Data Types**. They allow the compiler to perform **Exhaustiveness Checking** in `switch` expressions. If you switch over a sealed class, the compiler knows exactly all possible types, so you don't need a `default` case!
