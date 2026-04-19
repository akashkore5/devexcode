---
title: "17. Anonymous Inner Classes: On-the-Fly"
category: "oop"
order: 17
---

### Scenario
Sometimes you need a class just once. Instead of creating a new `.java` file, you can extend a class or implement an interface "on-the-fly".

### Code Block
```java
abstract class Button {
    abstract void onClick();
}

public class Main {
    public static void main(String[] args) {
        // Creating an anonymous subclass of Button
        Button loginBtn = new Button() {
            @Override
            void onClick() {
                System.out.println("User Logged In!");
            }
        };

        loginBtn.onClick();
        System.out.println("Class Name: " + loginBtn.getClass().getName());
    }
}
```

### Expected Output
```text
User Logged In!
Class Name: Main$1
```

### Explanation
- **Anonymous Class**: A class without a name, declared and instantiated in a single expression.
- **Inheritance**: It extends `Button` (or implements an interface) and provides an implementation immediately.

### Execution Flow
1. JVM creates a synthetic class (e.g., `Main$1`) that extends `Button`.
2. An instance of this synthetic class is created.
3. `onClick()` is invoked on that instance.

### Deep Dive
Anonymous classes are often used in legacy GUI code (Swing/AWT) or for simple handlers. In modern Java, if the interface has only one method, **Lambdas** are preferred as they are more concise and use `invokedynamic` for better performance.
