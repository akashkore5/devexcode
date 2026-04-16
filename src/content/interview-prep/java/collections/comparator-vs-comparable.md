---
title: "Comparator vs Comparable."
category: "collections"
order: 9
---

### Comparable:
- Used for **Natural Sorting**.
- Interface is `java.lang.Comparable`.
- Implement `compareTo(T obj)` inside the class.

### Comparator:
- Used for **Custom Sorting** (multiple sorting criteria).
- Interface is `java.util.Comparator`.
- Implement `compare(T o1, T o2)` in a separate class or as a lambda.

### Example: Salary Descending
```java
list.sort((e1, e2) -> Double.compare(e2.getSalary(), e1.getSalary()));
```
