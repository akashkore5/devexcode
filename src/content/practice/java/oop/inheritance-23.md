---
title: "23. Dynamic vs Static Binding: The Deep Dive"
category: "oop"
order: 23
---

### The Scenario
Polymorphism relies on binding. Some things are bound at compile time (Static), others at runtime (Dynamic). Understanding which is which is crucial for predicting execution flow.

```java
class Super {
    static void staticMethod() { System.out.println("Super Static"); }
    void instanceMethod() { System.out.println("Super Instance"); }
    String type = "Super Var";
}

class Sub extends Super {
    static void staticMethod() { System.out.println("Sub Static"); }
    void instanceMethod() { System.out.println("Sub Instance"); }
    String type = "Sub Var";
}

public class Main {
    public static void main(String[] args) {
        Super obj = new Sub();
        
        obj.staticMethod();
        obj.instanceMethod();
        System.out.println(obj.type);
    }
}
```

### Expected Output
```text
Super Static
Sub Instance
Super Var
```

### Explanation
1. **Static Binding**: Static methods, `final` methods, and `private` methods use static binding. The compiler looks at the **Reference Type** (`Super`), not the actual object.
2. **Dynamic Binding**: Non-static, non-final instance methods use dynamic binding. The JVM looks at the **Actual Object Type** (`Sub`) at runtime.
3. **Variables (Fields)**: Variables **never** use dynamic binding. They are always bound based on the Reference Type. This is called **Variable Hiding**.
