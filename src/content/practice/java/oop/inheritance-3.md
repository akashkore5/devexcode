---
title: "3. The 'super' Keyword: Constructor Chaining"
category: "oop"
order: 3
---

### Scenario
Understand how to pass parameters from a child constructor to a parent constructor using `super()`.

### Code Block
```java
class Employee {
    String name;
    Employee(String name) {
        this.name = name;
        System.out.println("Employee initialized: " + name);
    }
}

class Developer extends Employee {
    String language;
    Developer(String name, String language) {
        super(name); // Must be the first statement
        this.language = language;
        System.out.println("Developer initialized with: " + language);
    }
}

public class Main {
    public static void main(String[] args) {
        new Developer("Alice", "Java");
    }
}
```

### Expected Output
```text
Employee initialized: Alice
Developer initialized with: Java
```

### Explanation
- **super()**: Used to invoke the parent class constructor.
- **Order**: Parent constructor always runs before the child constructor.

### Execution Flow
1. `new Developer(...)` is called.
2. `Developer` constructor starts.
3. `super(name)` is hit.
4. Control jumps to `Employee` constructor.
5. `Employee` prints its message.
6. Control returns to `Developer` constructor.
7. `Developer` prints its message.

### Deep Dive
If you don't explicitly call `super()`, the compiler automatically inserts `super()` (no-arg). If the parent doesn't have a no-arg constructor, you'll get a compile-time error. This ensures a consistent state from the "root" of the object upwards.
