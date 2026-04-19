---
title: "19. Enums are Classes: Constant Specific Logic"
category: "oop"
order: 19
---

### Scenario
In Java, `enum` is much more than a list of constants. Each constant can provide its own implementation of an abstract method.

### Code Block
```java
enum Operation {
    PLUS {
        double apply(double x, double y) { return x + y; }
    },
    MINUS {
        double apply(double x, double y) { return x - y; }
    };

    abstract double apply(double x, double y);
}

public class Main {
    public static void main(String[] args) {
        double x = 10, y = 5;
        for (Operation op : Operation.values()) {
            System.out.printf("%f %s %f = %f%n", x, op, y, op.apply(x, y));
        }
    }
}
```

### Expected Output
```text
10.000000 PLUS 5.000000 = 15.000000
10.000000 MINUS 5.000000 = 5.000000
```

### Explanation
- **Constant Specific Body**: Each enum constant can have a body that overrides methods defined in the enum class.
- **Inheritance**: Enums implicitly extend `java.lang.Enum` and cannot extend anything else, but they can implement interfaces.

### Execution Flow
1. JVM loads `Operation` class.
2. `PLUS` and `MINUS` are instantiated as singleton objects of anonymous subclasses of `Operation`.
3. `op.apply()` dispatches to the specific constant's implementation.

### Deep Dive
Enums are perfect for implementing the **Strategy Pattern**. Instead of large `switch` statements, you can embed the logic directly into the enum constants, making the code cleaner and more type-safe.
