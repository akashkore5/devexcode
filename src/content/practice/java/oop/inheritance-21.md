---
title: "21. Record Classes: Finality & Inheritance"
category: "oop"
order: 21
---

### The Scenario
Record classes were introduced to model plain data carriers. However, they have very strict rules regarding inheritance to ensure their "immutability" and "transparency" are preserved.

Predict what happens when we try to make a Record extend a class, or a class extend a Record.

```java
class Base {
    void show() { System.out.println("Base"); }
}

// Case 1: Record extending a class
// record Person(String name) extends Base { } 

// Case 2: Class extending a record
record User(String id) { }
// class Admin extends User { } 

public class Main {
    public static void main(String[] args) {
        User u = new User("123");
        System.out.println(u.id());
        System.out.println(u instanceof Record);
    }
}
```

### Expected Output
```text
123
true
```

### Explanation
1. **Implicit Finality**: All `record` classes are implicitly `final`. Therefore, no class can ever extend a record.
2. **Strict Parent**: Records cannot extend any class (including `Base`). They implicitly extend `java.lang.Record`.
3. **Interfaces are OK**: While records cannot participate in class inheritance, they **can** implement interfaces.
4. **Members**: Records can have static fields, static methods, and instance methods, but **cannot** have instance fields other than the ones declared in the record header.
