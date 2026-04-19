---
title: "14. Polymorphism: Overloading vs Overriding"
category: "oop"
order: 14
---

### Scenario
Understand the difference between Compile-time Polymorphism (Overloading) and Runtime Polymorphism (Overriding).

### Code Block
```java
class Calculator {
    // Overloading: Same name, different parameters (Compile-time)
    int add(int a, int b) { return a + b; }
    int add(int a, int b, int c) { return a + b + c; }
}

class ScienceCalculator extends Calculator {
    // Overriding: Same name, same parameters (Runtime)
    @Override
    int add(int a, int b) {
        System.out.println("Adding in Science Mode");
        return a + b;
    }
}

public class Main {
    public static void main(String[] args) {
        Calculator calc = new ScienceCalculator();
        
        // Compiler decides which 'add' based on parameters (Overloading)
        System.out.println(calc.add(5, 10, 15)); 
        
        // JVM decides which 'add' based on object type (Overriding)
        System.out.println(calc.add(5, 10));
    }
}
```

### Expected Output
```text
30
Adding in Science Mode
15
```

### Explanation
- **Overloading**: Static binding. The compiler chooses the method based on the number/type of arguments.
- **Overriding**: Dynamic binding. The JVM chooses the method based on the actual object on the heap.

### Execution Flow
1. `calc.add(5, 10, 15)`: Compiler finds `add(int, int, int)` in `Calculator`.
2. `calc.add(5, 10)`: Compiler finds `add(int, int)` in `Calculator`.
3. At runtime, JVM sees `calc` is a `ScienceCalculator`, so it executes its version of `add(int, int)`.

### Deep Dive
Wait, what if we have `calc.add(5.0, 10.0)`? The compiler would look for a double version. Overloading is resolved using the **most specific match** available at compile-time. Overriding is about **changing behavior**, Overloading is about **extending capabilities**.
