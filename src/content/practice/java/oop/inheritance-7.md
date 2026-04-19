---
title: "7. The Diamond Problem: Default Methods"
category: "oop"
order: 7
---

### Scenario
Java doesn't support multiple inheritance via classes. But with Java 8 `default` methods in interfaces, we can have a conflict. How does Java solve it?

### Code Block
```java
interface Camera {
    default void start() { System.out.println("Camera starting..."); }
}

interface GPS {
    default void start() { System.out.println("GPS starting..."); }
}

class SmartPhone implements Camera, GPS {
    @Override
    public void start() {
        // Must explicitly decide which one to call or provide new logic
        Camera.super.start();
        GPS.super.start();
        System.out.println("Phone ready!");
    }
}

public class Main {
    public static void main(String[] args) {
        new SmartPhone().start();
    }
}
```

### Expected Output
```text
Camera starting...
GPS starting...
Phone ready!
```

### Explanation
- **Multiple Inheritance**: A class can implement multiple interfaces.
- **Conflict**: If both interfaces have a default method with the same signature, the compiler forces the implementing class to override it.

### Execution Flow
1. `SmartPhone` object created.
2. `start()` is called.
3. `SmartPhone.start()` executes.
4. `Camera.super.start()` calls the specific default implementation from `Camera`.
5. `GPS.super.start()` calls the one from `GPS`.

### Deep Dive
The **Three Rules of Default Methods**:
1. Classes win over interfaces.
2. Sub-interfaces win over super-interfaces.
3. If there's still a tie, the programmer MUST override and pick manually using `InterfaceName.super.methodName()`.
