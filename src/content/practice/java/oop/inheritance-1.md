---
title: "1. Basic Inheritance & Method Overriding"
category: "oop"
order: 1
---

### Scenario
Demonstrate the fundamental "IS-A" relationship and how a subclass can provide a specific implementation of a method defined in its superclass.

### Code Block
```java
class Vehicle {
    void fuelType() {
        System.out.println("Generic Fuel");
    }
}

class ElectricCar extends Vehicle {
    @Override
    void fuelType() {
        System.out.println("Electricity");
    }
}

public class Main {
    public static void main(String[] args) {
        Vehicle v = new ElectricCar();
        v.fuelType();
    }
}
```

### Expected Output
```text
Electricity
```

### Explanation
- **Inheritance**: `ElectricCar` inherits from `Vehicle`.
- **Upcasting**: A `Vehicle` reference points to an `ElectricCar` object.
- **Dynamic Dispatch**: At runtime, Java calls the version of `fuelType()` belonging to the actual object (`ElectricCar`), not the reference type.

### Execution Flow
1. `Main` method starts.
2. `ElectricCar` object created on heap.
3. `v` reference points to that object.
4. `v.fuelType()` is called.
5. JVM looks up the object's class (`ElectricCar`).
6. JVM finds the overridden `fuelType()` and executes it.

### Deep Dive
Java uses **Late Binding**. Unlike `static` methods (early binding), instance methods use a VTable to resolve the call at runtime, allowing polymorphism to work correctly.
