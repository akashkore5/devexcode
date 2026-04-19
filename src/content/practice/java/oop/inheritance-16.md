---
title: "16. Interface Evolution: Private & Static Methods"
category: "oop"
order: 16
---

### Scenario
Interfaces are no longer just for abstract methods. Since Java 8 and 9, they can have logic. This demonstrates how to use `static` and `private` methods in interfaces.

### Code Block
```java
interface Logger {
    default void logInfo(String msg) {
        log(msg, "INFO");
    }

    default void logError(String msg) {
        log(msg, "ERROR");
    }

    // Private method for internal logic (Java 9+)
    private void log(String msg, String level) {
        System.out.println("[" + level + "] " + msg);
    }

    // Static method for utility (Java 8+)
    static void printHeader() {
        System.out.println("=== SYSTEM LOGS ===");
    }
}

class ConsoleLogger implements Logger {}

public class Main {
    public static void main(String[] args) {
        Logger.printHeader(); // Called on Interface
        ConsoleLogger cl = new ConsoleLogger();
        cl.logInfo("System Started");
        cl.logError("Memory Low");
    }
}
```

### Expected Output
```text
=== SYSTEM LOGS ===
[INFO] System Started
[ERROR] Memory Low
```

### Explanation
- **Static Methods**: Belong to the interface, not the object. Used for utility methods.
- **Private Methods**: Used to share code between `default` methods without exposing it to implementing classes.
- **Default Methods**: Allow adding new functionality to interfaces without breaking existing implementations.

### Execution Flow
1. `Logger.printHeader()` executed directly.
2. `cl.logInfo()` called.
3. It delegates to the `private log()` method inside the interface.
4. Logic is executed without `ConsoleLogger` knowing about the `private` method.

### Deep Dive
Before Java 8, interfaces were "100% abstract". Now, they can behave almost like abstract classes. However, they still cannot have **instance fields** (only `public static final` constants), which remains the key difference from abstract classes.
