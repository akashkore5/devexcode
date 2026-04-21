---
title: "Comparable vs Comparator: Natural vs Custom Sorting"
category: "collections"
order: 15
status: "not-started"
tags: ["Sorting", "Comparable", "Comparator", "Algorithms", "Java 8"]
---

# 🔹 Comparable vs Comparator (Deep Dive, Interview-Ready)

Sorting objects in Java boils down to two interfaces: `Comparable` and `Comparator`. In technical interviews, understanding exactly when and why to use each is critical, as they serve fundamentally different architectural purposes.

---

## 📌 1. Core Difference (One-Liner)

> **`Comparable` is used to define the single, default "natural" sorting order of an object by modifying the class itself, whereas `Comparator` is used to define multiple, external, custom sorting strategies without touching the original class.**

---

## 📊 2. Detailed Comparison

| Feature | `Comparable` | `Comparator` |
| :--- | :--- | :--- |
| **Package** | `java.lang` | `java.util` |
| **Method to Override** | `int compareTo(T o)` | `int compare(T o1, T o2)` |
| **Sorting Logic** | Defines **Natural** ordering | Defines **Custom** ordering |
| **Number of Sequences**| Only **One** sequence allowed | **Multiple** sequences possible |
| **Class Modification** | Must modify the original class | No modification needed (External logic) |
| **Typical Usage** | `Collections.sort(list)` | `Collections.sort(list, comparator)` |

---

## 📌 3. When to use Comparable (Natural Ordering)

Use `Comparable` when an object has an obvious, undeniable default sorting order. 
* E.g., `String` sorts alphabetically. `Integer` sorts numerically. 
* If you have an `Employee` class, it might make sense for the natural order to be by `employeeId`.

### 🔸 Implementation
You implement the interface directly on the class:

```java
public class Employee implements Comparable<Employee> {
    private int employeeId;
    private String name;

    // ... constructor, getters ...

    @Override
    public int compareTo(Employee other) {
        // Natural sorting: Ascending by employeeId
        return Integer.compare(this.employeeId, other.employeeId);
    }
}
```
*Usage:* `Collections.sort(employeeList);` // Automatically uses `compareTo`

---

## 📌 4. When to use Comparator (Custom Ordering)

Use `Comparator` when:
1. You need **multiple ways** to sort the same object (e.g., sort `Employee` by name, by age, by salary).
2. You **cannot modify the source code** of the class (e.g., a class from a 3rd party library).
3. The class already implements `Comparable`, but you want to override its natural ordering temporarily.

### 🔸 Modern Java Implementation (Java 8+)
You no longer need to write verbose anonymous inner classes. Use `Comparator.comparing()`.

```java
// 1. Sort by Name
employees.sort(Comparator.comparing(Employee::getName));

// 2. Sort by Salary (Descending)
employees.sort(Comparator.comparingDouble(Employee::getSalary).reversed());

// 3. Multi-level sorting: Sort by Age, then by Name
employees.sort(
    Comparator.comparingInt(Employee::getAge)
              .thenComparing(Employee::getName)
);
```

---

## 📌 5. The Golden Rule of compare() and compareTo()

Both methods return an `int`. You must understand what the integer signifies:
* **Negative (`< 0`)**: The first object should come *before* the second (it is "less than").
* **Zero (`== 0`)**: Both objects are considered equal in sorting order.
* **Positive (`> 0`)**: The first object should come *after* the second (it is "greater than").

👉 **Interview Trap:** Never use `return this.salary - other.salary;` for integer comparison if there is a risk of integer overflow. Always use wrapper methods like `Integer.compare(a, b)` or Java 8's `Comparator.comparingInt()`.

---

## 🔥 Interview Gold Statement

> *"I use Comparable to define the absolute default natural ordering of a class—like sorting Employees by their ID—by having the class implement the interface itself. However, for any business logic that requires dynamic or multi-field sorting—such as sorting by salary descending, or age then name—I exclusively use external Comparators, specifically leveraging Java 8's `Comparator.comparing()` and `.thenComparing()` for highly readable, declarative code."*

---

## ⚡ Final Verdict

* ✅ **Use `Comparable`** to establish the primary, default sort order built directly into the object.
* 🎯 **Use `Comparator`** for all dynamic, specialized, or multi-level sorting logic applied from the outside.
