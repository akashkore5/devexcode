---
title: "18. Overriding & Exceptions: The Strict Rules"
category: "oop"
order: 18
---

### Scenario
Can an overriding method throw more exceptions than the parent? No. This practice explores the rules of checked vs unchecked exceptions in inheritance.

### Code Block
```java
import java.io.*;

class Super {
    void process() throws IOException {
        System.out.println("Super processing");
    }
}

class Sub extends Super {
    @Override
    void process() throws FileNotFoundException { // Valid: Subclass of IOException
        System.out.println("Sub processing");
    }
    
    // void process() throws Exception { } // ERROR: Broader than IOException
}

public class Main {
    public static void main(String[] args) throws IOException {
        Super obj = new Sub();
        obj.process();
    }
}
```

### Expected Output
```text
Sub processing
```

### Explanation
- **Checked Exceptions**: Subclass method cannot throw a broader or new checked exception. It can only throw the same, a subclass, or no exception at all.
- **Unchecked Exceptions**: These rules do NOT apply to `RuntimeException`.

### Execution Flow
1. Compiler checks the `process()` signature in `Super`.
2. It sees it throws `IOException`.
3. It validates that `Sub.process()` is "safe" (throwing `FileNotFoundException` is safe because any code catching `IOException` will also catch `FileNotFoundException`).

### Deep Dive
Why this rule? **Polymorphism**. If you have a `Super` reference, you write code to catch `IOException`. If the object is actually a `Sub` and it throws a `GeneralException`, your catch block would fail to handle it, breaking the type safety contract.
