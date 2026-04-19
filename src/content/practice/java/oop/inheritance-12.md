---
title: "12. Encapsulation: Access Modifiers in Action"
category: "oop"
order: 12
---

### Scenario
How do access modifiers (`private`, `protected`, `public`) affect what is inherited and accessible in a subclass?

### Code Block
```java
package hospital;

class Employee {
    public String name = "Global";
    protected double salary = 50000;
    private String healthID = "HID-123";
    int vacationDays = 20; // Default (Package-private)
}

class Doctor extends Employee {
    void printDetails() {
        System.out.println("Name: " + name);      // Accessible (public)
        System.out.println("Salary: " + salary);  // Accessible (protected)
        // System.out.println(healthID);          // ERROR: private
        System.out.println("Days: " + vacationDays); // Accessible (same package)
    }
}

public class Main {
    public static void main(String[] args) {
        new Doctor().printDetails();
    }
}
```

### Expected Output
```text
Name: Global
Salary: 50000.0
Days: 20
```

### Explanation
- **private**: Not inherited. Accessible only within the same class.
- **protected**: Inherited. Accessible in subclasses (even in different packages) and same package.
- **default**: Inherited only if the subclass is in the same package.

### Execution Flow
1. `Doctor` object created.
2. `printDetails()` tries to access fields.
3. Access check happens: `salary` is protected, `Doctor` is a subclass, so it's allowed.
4. `healthID` check fails at compile-time.

### Deep Dive
Encapsulation is about **Information Hiding**. By keeping fields `private` and exposing them through `protected` or `public` methods (getters/setters), you maintain control over how your data is modified, even in a complex inheritance hierarchy.
