---
title: "2. Multilevel Inheritance: Propagation"
category: "oop"
order: 2
---

### Scenario
A class inherits from a class, which in turn inherits from another class. This demonstrates how properties and behaviors propagate down the chain.

### Code Block
```java
class GrandParent {
    void legacy() {
        System.out.println("Old Wisdom");
    }
}

class Parent extends GrandParent {
    void skill() {
        System.out.println("Modern Craft");
    }
}

class Child extends Parent {
    void innovation() {
        System.out.println("Future Tech");
    }
}

public class Main {
    public static void main(String[] args) {
        Child c = new Child();
        c.legacy();     // Inherited from GrandParent
        c.skill();      // Inherited from Parent
        c.innovation(); // Defined in Child
    }
}
```

### Expected Output
```text
Old Wisdom
Modern Craft
Future Tech
```

### Explanation
- **Multilevel**: `Child` -> `Parent` -> `GrandParent`.
- **Inheritance Chain**: `Child` has access to all non-private members of both `Parent` and `GrandParent`.

### Execution Flow
1. JVM loads all three classes in the hierarchy.
2. `Child` object is instantiated.
3. Memory is allocated for fields of all classes in the chain.
4. `c.legacy()` starts a lookup: Child -> Parent -> GrandParent (Found!).

### Deep Dive
In multilevel inheritance, each subclass constructor implicitly calls `super()`, leading all the way up to `Object` class. This ensures the entire object state is initialized properly.
