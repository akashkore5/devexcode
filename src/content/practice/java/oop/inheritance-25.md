---
title: "25. SOLID: Liskov Substitution Principle (LSP)"
category: "oop"
order: 25
---

### The Scenario
The Liskov Substitution Principle states that objects of a superclass should be replaceable with objects of a subclass without affecting the correctness of the program. 

Predict the output and identify if LSP is violated.

```java
class Bird {
    void move() { System.out.println("Flying..."); }
}

class Ostrich extends Bird {
    @Override
    void move() {
        throw new UnsupportedOperationException("I can't fly!");
    }
}

public class Main {
    public static void main(String[] args) {
        Bird b = new Ostrich();
        try {
            b.move();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
```

### Expected Output
```text
I can't fly!
```

### Explanation
1. **LSP Violation**: This is a classic violation of LSP. If a client expects a `Bird` to `move()` (and the base class implies flight), providing an `Ostrich` that crashes when moving breaks the program's invariants.
2. **Inheritance Misuse**: Just because an Ostrich is biologically a bird doesn't mean it should inherit from a class that defines movement as flying.
3. **The Fix**: Better abstraction. Use an interface `Flyable` or separate `FlyingBird` and `NonFlyingBird` classes.
4. **Conclusion**: Inheritance should only be used when the subclass can truly substitute the superclass in all contexts.
