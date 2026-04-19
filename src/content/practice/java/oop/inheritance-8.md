---
title: "8. Abstract Classes: Partial Implementation"
category: "oop"
order: 8
---

### Scenario
An abstract class provides some common behavior but forces subclasses to implement specific details.

### Code Block
```java
abstract class Shape {
    String color;
    Shape(String color) { this.color = color; }
    
    void describe() { System.out.println("A " + color + " shape"); }
    abstract double area(); // Must be implemented by subclasses
}

class Circle extends Shape {
    double radius;
    Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }
    
    @Override
    double area() { return Math.PI * radius * radius; }
}

public class Main {
    public static void main(String[] args) {
        Shape s = new Circle("Red", 5);
        s.describe();
        System.out.println("Area: " + Math.round(s.area()));
    }
}
```

### Expected Output
```text
A Red shape
Area: 79
```

### Explanation
- **Abstract Class**: Cannot be instantiated.
- **Contract**: Any non-abstract class extending `Shape` MUST implement `area()`.

### Execution Flow
1. `Circle` object created.
2. `Shape` constructor called via `super` to set color.
3. `s.describe()` calls the concrete method in the abstract class.
4. `s.area()` calls the implementation in `Circle`.

### Deep Dive
Abstract classes can have constructors, fields, and concrete methods, unlike interfaces (pre-Java 8). They are used for "Strong Inheritance" (is-a relationship) whereas interfaces are used for "Capabilities" (can-do relationship).
