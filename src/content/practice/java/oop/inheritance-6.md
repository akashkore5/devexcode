---
title: "6. Final: Preventing Inheritance & Overriding"
category: "oop"
order: 6
---

### Scenario
What happens if we try to extend a `final` class or override a `final` method? (Theoretical since it won't compile, but important for concepts).

### Code Block
```java
final class SecurityConfig {
    final void validate() {
        System.out.println("Standard Validation");
    }
}

// class HackConfig extends SecurityConfig { } // COMPILE ERROR: Cannot inherit from final

class Base {
    final void secret() { System.out.println("Base Secret"); }
}

class Derived extends Base {
    // void secret() { } // COMPILE ERROR: Cannot override final method
}

public class Main {
    public static void main(String[] args) {
        new Base().secret();
    }
}
```

### Expected Output
```text
Base Secret
```

### Explanation
- **final class**: Cannot be subclassed. Useful for security or performance (JVM can optimize).
- **final method**: Cannot be overridden by subclasses.

### Execution Flow
1. Compiler checks class definitions.
2. If `SecurityConfig` is final, any attempt to extend it causes an immediate error.
3. Same for `final` methods during method resolution.

### Deep Dive
Inlining: The JVM's JIT compiler can **inline** final methods because it knows for certain that the implementation won't change in any subclass. This eliminates the overhead of a method call.
