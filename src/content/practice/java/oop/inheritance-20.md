---
title: "20. Initialization Order: The Grand Sequence"
category: "oop"
order: 20
---

### Scenario
When you create a child object, what runs first? Static blocks? Constructors? Parent or Child? This is the ultimate test of your understanding of object lifecycle.

### Code Block
```java
class Base {
    static { System.out.println("Base: Static Block"); }
    { System.out.println("Base: Instance Block"); }
    Base() { System.out.println("Base: Constructor"); }
}

class Derived extends Base {
    static { System.out.println("Derived: Static Block"); }
    { System.out.println("Derived: Instance Block"); }
    Derived() {
        super();
        System.out.println("Derived: Constructor");
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("--- First Object ---");
        new Derived();
        System.out.println("--- Second Object ---");
        new Derived();
    }
}
```

### Expected Output
```text
--- First Object ---
Base: Static Block
Derived: Static Block
Base: Instance Block
Base: Constructor
Derived: Instance Block
Derived: Constructor
--- Second Object ---
Base: Instance Block
Base: Constructor
Derived: Instance Block
Derived: Constructor
```

### Explanation
1. **Static Blocks**: Run once when the class is loaded. Parent's runs before Child's.
2. **Instance Blocks**: Run every time an object is created, before the constructor.
3. **Hierarchy**: Parent's blocks/constructors always finish before Child's.

### Execution Flow
1. JVM loads `Base` -> `Derived`. Static blocks execute.
2. `new Derived()` starts.
3. Parent (`Base`) instance blocks and constructor run.
4. Child (`Derived`) instance blocks and constructor run.
5. For the second object, **Static blocks do NOT run again**.

### Deep Dive
Understanding this order is critical for debugging complex systems where initialization depends on other components. A common mistake is trying to access child fields in a parent constructor—at that point, the child's instance blocks haven't even run yet!
