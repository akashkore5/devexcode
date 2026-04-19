---
title: "24. Shallow vs Deep Copy: Cloning & OOP"
category: "oop"
order: 24
---

### The Scenario
Object duplication is a key concept in OOP. If an object contains references to other objects, simply copying the reference leads to a "Shallow Copy".

```java
class Engine {
    String type = "V8";
}

class Car implements Cloneable {
    Engine engine = new Engine();
    
    public Object clone() throws CloneNotSupportedException {
        return super.clone(); // Default behavior
    }
}

public class Main {
    public static void main(String[] args) throws Exception {
        Car car1 = new Car();
        Car car2 = (Car) car1.clone();
        
        car2.engine.type = "V12";
        
        System.out.println("Car 1 Engine: " + car1.engine.type);
        System.out.println("Car 2 Engine: " + car2.engine.type);
        System.out.println("Same Engine Object? " + (car1.engine == car2.engine));
    }
}
```

### Expected Output
```text
Car 1 Engine: V12
Car 2 Engine: V12
Same Engine Object? true
```

### Explanation
1. **super.clone()**: The default `Object.clone()` performs a **Shallow Copy**. It copies all primitive fields but only copies the **references** for object fields.
2. **Shared State**: Because `car1` and `car2` share the same `Engine` object, changing the engine in one affects the other.
3. **Deep Copy Requirement**: To achieve a deep copy, you must manually clone the internal objects as well within the `clone()` method.
4. **Alternative**: In modern Java, Copy Constructors or Serialization are often preferred over `Cloneable`.
