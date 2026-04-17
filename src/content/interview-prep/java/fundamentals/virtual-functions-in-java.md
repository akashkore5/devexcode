---
title: "Virtual Functions in Java: Runtime Polymorphism & VTable Dispatch"
category: "fundamentals"
order: 11
---

### Does Java Have Virtual Functions?
**Yes — but it doesn't use the keyword.** In C++, you explicitly declare `virtual`. In Java, **all non-static, non-final, non-private instance methods are virtual by default**. This is what enables **Runtime Polymorphism (Dynamic Method Dispatch)**.

### How It Works
```java
class Animal {
    void speak() { System.out.println("..."); }   // virtual by default
}

class Dog extends Animal {
    @Override
    void speak() { System.out.println("Bark!"); } // overrides at runtime
}

class Cat extends Animal {
    @Override
    void speak() { System.out.println("Meow!"); }
}

// Dynamic dispatch — decided at RUNTIME, not compile time
Animal a = new Dog();
a.speak(); // "Bark!" — calls Dog's version, not Animal's
```

### Compile-Time vs Runtime Binding

| Binding | Also Called | Resolved At | Applies To |
|---------|-----------|-------------|------------|
| **Static** | Early binding | Compile time | `static`, `final`, `private` methods, overloaded methods |
| **Dynamic** | Late binding / Virtual dispatch | Runtime | Overridden instance methods (virtual functions) |

```java
Animal a = new Dog();

// Compiler sees: type Animal → validates speak() exists in Animal ✅
// JVM at runtime: actual object is Dog → dispatches to Dog.speak()
```

### The VTable (Virtual Method Table)
Internally, the JVM uses a structure similar to C++'s **vtable**:

1. Each class has a **method table** built at class-loading time.
2. It maps each virtual method to its **actual implementation** address.
3. When `a.speak()` is called, the JVM looks up the vtable of the **actual object's class** (not the reference type).

```
Animal vtable:          Dog vtable:
┌──────────────┐        ┌──────────────┐
│ speak() → Animal.speak│ speak() → Dog.speak  ← overridden
│ eat()   → Animal.eat  │ eat()   → Animal.eat ← inherited
└──────────────┘        └──────────────┘
```

### Which Methods Are NOT Virtual?

| Method Type | Virtual? | Why? |
|-------------|----------|------|
| `static` | ❌ | Belongs to class, not instance — resolved at compile time |
| `final` | ❌ | Cannot be overridden — JVM can inline it |
| `private` | ❌ | Not visible to subclasses — no dispatch needed |
| Constructor | ❌ | Not inherited — always called on the specific class |
| Regular instance method | ✅ | Default behavior in Java |

### Practical Example: Strategy Pattern (Virtual Functions in Action)
```java
interface PaymentStrategy {
    void pay(double amount);     // virtual (interface method)
}

class CreditCardPayment implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        System.out.println("Paid ₹" + amount + " via Credit Card");
    }
}

class UPIPayment implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        System.out.println("Paid ₹" + amount + " via UPI");
    }
}

// Runtime polymorphism — actual method called depends on the object
PaymentStrategy strategy = getStrategy(user); // returns CreditCard or UPI
strategy.pay(5000); // Dispatched at runtime
```

### Java vs C++ Virtual Functions

| Aspect | Java | C++ |
|--------|------|-----|
| Default behavior | All instance methods are virtual | Must explicitly declare `virtual` |
| Keyword needed? | No keyword | `virtual` keyword required |
| Pure virtual? | `abstract` method | `= 0` syntax |
| Performance | JVM optimizes with JIT (inlining, devirtualization) | Direct vtable lookup |
| Preventing override | `final` keyword | `final` keyword (C++11) |

### JIT Optimization: Devirtualization
The JVM's JIT compiler can optimize virtual calls:
- **Monomorphic call**: If only one implementation is ever seen at a call site, the JIT **inlines** the method directly — eliminating the vtable lookup entirely.
- **Bimorphic call**: Two implementations → conditional inline.
- **Megamorphic call**: 3+ implementations → full virtual dispatch (slower).

> **Key Interview Point**: In Java, all regular instance methods are virtual. This enables polymorphism but you never write the `virtual` keyword — it's the language design philosophy of "polymorphism by default."
