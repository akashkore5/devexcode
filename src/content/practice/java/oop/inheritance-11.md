---
title: "11. Composition vs Inheritance: 'HAS-A' vs 'IS-A'"
category: "oop"
order: 11
---

### Scenario
"Favor Composition over Inheritance" is a core design principle. This practice shows how to reuse code by having an object of another class as a field, rather than extending it.

### Code Block
```java
class Engine {
    void start() { System.out.println("Engine roaring..."); }
}

// Inheritance (Is-A) - Bad if we just want the engine's behavior
// class Car extends Engine { } 

// Composition (Has-A) - Better
class Car {
    private final Engine engine; // Composition
    
    Car(Engine engine) {
        this.engine = engine;
    }
    
    void drive() {
        engine.start();
        System.out.println("Car is moving");
    }
}

public class Main {
    public static void main(String[] args) {
        Engine e = new Engine();
        Car myCar = new Car(e);
        myCar.drive();
    }
}
```

### Expected Output
```text
Engine roaring...
Car is moving
```

### Explanation
- **Composition**: The `Car` class "has an" `Engine`.
- **Flexibility**: We can change the `Engine` at runtime (e.g., swapping a PetrolEngine for an ElectricEngine) which is impossible with inheritance.
- **Looser Coupling**: `Car` doesn't expose all methods of `Engine`, only what it needs.

### Execution Flow
1. `Engine` object created.
2. `Car` object created, receiving the `Engine` instance.
3. `myCar.drive()` called.
4. `engine.start()` is invoked via the reference.

### Deep Dive
Inheritance is "White-box reuse" (subclasses see internals), while Composition is "Black-box reuse" (internals are hidden). Composition is generally preferred because it's more flexible and less likely to break when the "parent" class changes.
