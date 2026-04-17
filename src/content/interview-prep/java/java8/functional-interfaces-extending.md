---
title: "Functional Interfaces Deep Dive: Can we extend them?"
category: "java8"
order: 16
---

### Quick Recap: What is a Functional Interface?
An interface with **exactly one abstract method (SAM)**. It can have any number of `default`, `static`, and `java.lang.Object` methods.

```java
@FunctionalInterface
public interface Transformer<T, R> {
    R transform(T input); // SAM — Single Abstract Method
    
    default Transformer<T, R> andLog() { /* ... */ }  // ✅ allowed
    static void info() { /* ... */ }                   // ✅ allowed
    String toString();                                 // ✅ Object method — doesn't count
}
```

### Built-in Functional Interfaces (java.util.function)

| Interface | Method | Use Case |
|-----------|--------|----------|
| `Predicate<T>` | `boolean test(T)` | Filtering |
| `Function<T, R>` | `R apply(T)` | Transformation |
| `Consumer<T>` | `void accept(T)` | Side-effects (logging, saving) |
| `Supplier<T>` | `T get()` | Lazy value generation |
| `UnaryOperator<T>` | `T apply(T)` | Same type in → same type out |
| `BiFunction<T, U, R>` | `R apply(T, U)` | Two-input transformation |

### Can We Extend Functional Interfaces?

**Yes, but with strict rules:**

#### ✅ Case 1: Child adds ONLY default/static methods → Still a FI
```java
@FunctionalInterface
interface Printable {
    void print(String msg);
}

@FunctionalInterface
interface PrettyPrintable extends Printable {
    // Inherits print() as the SAM
    default void printBold(String msg) {
        print("**" + msg + "**");
    }
}

// ✅ Can use as lambda
PrettyPrintable pp = msg -> System.out.println(msg);
```

#### ❌ Case 2: Child adds another abstract method → NOT a FI
```java
interface Printable {
    void print(String msg);
}

// @FunctionalInterface  ← Would cause COMPILE ERROR
interface AdvancedPrintable extends Printable {
    void format(String msg); // 2nd abstract method!
}
```

#### ✅ Case 3: Child overrides the parent's SAM → Still a FI
```java
@FunctionalInterface
interface Base {
    void execute();
}

@FunctionalInterface
interface Child extends Base {
    @Override
    void execute(); // Same SAM, just overridden — still 1 abstract method
}
```

#### ✅ Case 4: Extending multiple interfaces with SAME SAM signature
```java
@FunctionalInterface
interface A { void run(); }

@FunctionalInterface
interface B { void run(); }

@FunctionalInterface
interface C extends A, B { }
// C has one abstract method: run() — merged by identical signature
```

### Key Rule
> A child interface is a functional interface **if and only if** it has exactly **one abstract method** — whether inherited, overridden, or newly declared. The `@FunctionalInterface` annotation enforces this at compile time.
