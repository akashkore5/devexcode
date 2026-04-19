---
title: "5. Method Hiding: Static Methods"
category: "oop"
order: 5
---

### Scenario
Can we override a static method? No. Static methods belong to the class, not the instance.

### Code Block
```java
class Base {
    static void display() {
        System.out.println("Base Static");
    }
}

class Derived extends Base {
    static void display() {
        System.out.println("Derived Static");
    }
}

public class Main {
    public static void main(String[] args) {
        Base obj = new Derived();
        obj.display(); // Warning: Static method should be accessed in a static way
    }
}
```

### Expected Output
```text
Base Static
```

### Explanation
- **Static Binding**: Static methods are resolved at compile-time.
- **Reference Resolution**: Since `obj` is of type `Base`, `obj.display()` calls `Base.display()`.

### Execution Flow
1. Compiler sees `obj.display()`.
2. It checks the type of `obj` (Base).
3. It links the call to `Base.display()`.
4. At runtime, the actual object type (`Derived`) is ignored for this specific call.

### Deep Dive
If you remove `static` from both, the output would be "Derived Static" due to dynamic dispatch. The presence of `static` causes **Method Hiding**, which behaves similarly to variable hiding.
