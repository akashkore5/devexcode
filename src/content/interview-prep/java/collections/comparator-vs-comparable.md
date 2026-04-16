---
title: "Comparable vs Comparator: Natural vs Custom Sorting"
category: "collections"
date: "2024-04-16"
difficulty: "Intermediate"
tags: ["Sorting", "Algorithms", "Best Practice"]
---

Sorting objects in Java boils down to two interfaces: `Comparable` and `Comparator`.

### 1. Comparable (Natural Sorting)
-   **Interface**: `java.lang.Comparable`
-   **Method**: `int compareTo(T o)`
-   **Context**: Use this when you want to define the **default** sorting for a class (e.g., `String` sorts alphabetically).
-   **Limitation**: You can only have one `compareTo` implementation.

### 2. Comparator (Custom Sorting)
-   **Interface**: `java.util.Comparator`
-   **Method**: `int compare(T o1, T o2)`
-   **Context**: Use this when you want **multiple** sorting strategies without modifying the original class.

### 3. Case Study: Sorting Employee [id, name, salary, age]
The requirement is to sort employees in **descending order of salary**.

#### Implementation using Java 8+ (Recommended)
```java
import java.util.*;

class Employee {
    int id;
    String name;
    double salary;
    int age;

    public Employee(int id, String name, double salary, int age) {
        this.id = id;
        this.name = name;
        this.salary = salary;
        this.age = age;
    }

    public double getSalary() { return salary; }
    
    @Override
    public String toString() {
        return "Employee{" + "id=" + id + ", name='" + name + "', salary=" + salary + '}';
    }
}

public class EmployeeSortDemo {
    public static void main(String[] args) {
        List<Employee> list = new ArrayList<>();
        list.add(new Employee(1, "Akash", 50000, 25));
        list.add(new Employee(2, "Rahul", 75000, 30));
        list.add(new Employee(3, "Sneha", 60000, 28));

        // Sorting in descending order of salary
        Collections.sort(list, Comparator.comparing(Employee::getSalary).reversed());

        list.forEach(System.out::println);
    }
}
```

### 4. Key Differences Summary
| Feature | Comparable | Comparator |
| :--- | :--- | :--- |
| **Package** | `java.lang` | `java.util` |
| **Implementation** | Class itself implements it | External logic |
| **Modification** | Must modify the original class | No modification needed |
| **Logic** | Natural ordering | Custom/Multiple ordering |
| **Method** | `compareTo(T)` | `compare(T1, T2)` |
| **Usage** | `Collections.sort(list)` | `Collections.sort(list, comparator)` |
