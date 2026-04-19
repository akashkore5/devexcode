---
title: "15. The Object Class: Root of All"
category: "oop"
order: 15
---

### Scenario
Every class in Java implicitly extends `java.lang.Object`. Learn how overriding `toString()` and `equals()` changes default behavior.

### Code Block
```java
class Book {
    String title;
    Book(String title) { this.title = title; }

    @Override
    public String toString() {
        return "Book Title: " + title;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Book)) return false;
        return this.title.equals(((Book) obj).title);
    }
}

public class Main {
    public static void main(String[] args) {
        Book b1 = new Book("Java Mastery");
        Book b2 = new Book("Java Mastery");
        
        System.out.println(b1); // Calls toString()
        System.out.println("Memory Compare: " + (b1 == b2));
        System.out.println("Value Compare: " + b1.equals(b2));
    }
}
```

### Expected Output
```text
Book Title: Java Mastery
Memory Compare: false
Value Compare: true
```

### Explanation
- **toString()**: Default version returns `ClassName@hash`. Overriding provides a readable representation.
- **equals()**: Default version uses `==` (reference equality). Overriding allows for "content equality".

### Execution Flow
1. `b1` and `b2` created on heap (different addresses).
2. `System.out.println(b1)` implicitly calls `b1.toString()`.
3. `b1 == b2` is false because they are different objects.
4. `b1.equals(b2)` returns true because we overridden it to compare titles.

### Deep Dive
If you override `equals()`, you MUST override `hashCode()` as well. This is because objects that are equal must have the same hash code for use in `HashMap`, `HashSet`, etc. Failure to do so leads to subtle bugs in collection-based logic!
