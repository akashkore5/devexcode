---
title: "10. Hierarchical Inheritance: Type Checking"
category: "oop"
order: 10
---

### Scenario
Multiple classes inherit from the same parent. How do we distinguish between them at runtime?

### Code Block
```java
class Account {
    void info() { System.out.println("Basic Account"); }
}

class SavingsAccount extends Account {
    void interest() { System.out.println("5% Interest"); }
}

class CurrentAccount extends Account {
    void overdraft() { System.out.println("Overdraft enabled"); }
}

public class Main {
    public static void main(String[] args) {
        Account[] accounts = { new SavingsAccount(), new CurrentAccount() };
        
        for (Account acc : accounts) {
            if (acc instanceof SavingsAccount) {
                ((SavingsAccount) acc).interest();
            } else if (acc instanceof CurrentAccount) {
                ((CurrentAccount) acc).overdraft();
            }
        }
    }
}
```

### Expected Output
```text
5% Interest
Overdraft enabled
```

### Explanation
- **Hierarchical**: One parent (`Account`), multiple children (`Savings`, `Current`).
- **instanceof**: Used to check if an object is an instance of a specific class or interface at runtime.

### Execution Flow
1. Array of `Account` created containing mixed objects.
2. Loop starts.
3. First object is checked: Is it `SavingsAccount`? Yes.
4. Cast to `SavingsAccount` and call `interest()`.
5. Second object checked: Is it `SavingsAccount`? No. Is it `CurrentAccount`? Yes.
6. Cast to `CurrentAccount` and call `overdraft()`.

### Deep Dive
While `instanceof` is useful, excessive use often indicates a violation of the **Liskov Substitution Principle**. Ideally, polymorphic behavior should be handled via method overriding in the base class rather than explicit type checking.
