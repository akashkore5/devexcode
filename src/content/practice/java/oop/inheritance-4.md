---
title: "4. Variable Hiding: References vs Objects"
category: "oop"
order: 4
---

### Scenario
What happens when both Parent and Child have a variable with the same name? Unlike methods, variables are NOT overridden.

### Code Block
```java
class Super {
    String name = "SuperClass";
}

class Sub extends Super {
    String name = "SubClass";
}

public class Main {
    public static void main(String[] args) {
        Super obj = new Sub();
        System.out.println("Name: " + obj.name);
        
        Sub actualObj = (Sub) obj;
        System.out.println("Actual Name: " + actualObj.name);
    }
}
```

### Expected Output
```text
Name: SuperClass
Actual Name: SubClass
```

### Explanation
- **Variable Hiding**: Variables are resolved at **compile-time** based on the reference type.
- **Reference Type**: `obj` is of type `Super`, so `obj.name` looks at the `Super` class.

### Execution Flow
1. `Sub` object created. It contains TWO `name` fields (one from Super, one from Sub).
2. `obj` reference (Super type) points to this object.
3. `obj.name` is resolved by the compiler to `Super.name`.
4. Casting `obj` to `Sub` allows access to the `Sub.name` field.

### Deep Dive
This is a common pitfall. Polymorphism applies to methods, not instance variables. This is why it's called **Hiding** instead of **Overriding**. Always use getters/setters to avoid this confusion!
