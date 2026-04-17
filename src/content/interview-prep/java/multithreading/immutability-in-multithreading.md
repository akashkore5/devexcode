---
title: "What is Immutability and how does it help in Multi-threading?"
category: "multithreading"
order: 19
---

### What is Immutability?
An object is **immutable** if its state cannot be modified after creation. Once constructed, its fields never change.

```java
// Immutable class
public final class Money {
    private final String currency;
    private final double amount;

    public Money(String currency, double amount) {
        this.currency = currency;
        this.amount = amount;
    }

    public String getCurrency() { return currency; }
    public double getAmount() { return amount; }
    // No setters!
}
```

### Rules to Create an Immutable Class
1. Declare the class as `final` (prevents subclassing).
2. Make all fields `private` and `final`.
3. No setter methods.
4. If a field is a mutable object (e.g., `Date`, `List`), return **defensive copies** in getters.
5. Initialize all fields via the constructor.

### Why Does It Help in Multi-threading?

| Problem | How Immutability Solves It |
|---------|--------------------------|
| **Race Condition** | Cannot happen — no thread can modify the state |
| **Visibility Issue** | `final` fields are guaranteed visible to all threads after construction (JMM guarantee) |
| **Need for Synchronization** | Eliminated — no locks, no `volatile`, no `AtomicReference` needed |
| **Defensive Copying** | Safe to share across threads without copying |

> **Key Insight**: Immutable objects are **inherently thread-safe**. You can pass them freely between threads with zero synchronization overhead.

### Real-World Immutable Classes in Java
- `String` — once created, its `char[]` (or `byte[]` in Java 9+) never changes.
- `Integer`, `Long`, `Double` — all wrapper classes.
- `LocalDate`, `LocalTime`, `LocalDateTime` — the entire `java.time` package.
- `BigDecimal`, `BigInteger`.

### Immutability in Practice
```java
// Thread-safe cache key — no synchronization needed
Map<Money, String> cache = new ConcurrentHashMap<>();
Money key = new Money("INR", 1000);
cache.put(key, "processed");

// Any thread can read `key` safely — it will never change
```

### Trade-off
- **Pro**: Eliminates entire categories of concurrency bugs.
- **Con**: Every "modification" creates a new object → higher GC pressure for frequently modified data. Use builders or mutable local variables during construction, then freeze into immutable objects.
