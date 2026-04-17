---
title: "What is Optional and how does it prevent NullPointerException?"
category: "java8"
order: 18
---

### What is Optional?
`Optional<T>` is a container that may or may not contain a non-null value. It forces you to **explicitly handle the absence of a value** instead of returning `null`.

```java
// Before Optional — NullPointerException waiting to happen
String city = user.getAddress().getCity().toUpperCase(); // 💥 NPE if any is null

// With Optional — safe and explicit
String city = Optional.ofNullable(user)
    .map(User::getAddress)
    .map(Address::getCity)
    .map(String::toUpperCase)
    .orElse("UNKNOWN");
```

### Creating Optional

| Method | Behavior |
|--------|----------|
| `Optional.of(value)` | Creates Optional; throws NPE if value is null |
| `Optional.ofNullable(value)` | Creates Optional; empty if value is null |
| `Optional.empty()` | Creates an empty Optional |

```java
Optional<String> opt1 = Optional.of("Hello");        // ✅
Optional<String> opt2 = Optional.ofNullable(null);    // ✅ → Optional.empty()
Optional<String> opt3 = Optional.of(null);            // ❌ NullPointerException
```

### Consuming Optionals

```java
Optional<String> name = findUserById(42);

// 1. orElse — provide default (always evaluated)
String result = name.orElse("Guest");

// 2. orElseGet — lazy default (evaluated only if empty)
String result = name.orElseGet(() -> fetchDefault());

// 3. orElseThrow — throw if empty
String result = name.orElseThrow(() -> new UserNotFoundException("ID: 42"));

// 4. ifPresent — execute action if present
name.ifPresent(n -> System.out.println("Found: " + n));

// 5. ifPresentOrElse (Java 9+)
name.ifPresentOrElse(
    n -> System.out.println("Found: " + n),
    () -> System.out.println("Not found")
);
```

### Chaining with map, flatMap, filter
```java
Optional<String> email = Optional.ofNullable(user)
    .map(User::getProfile)                    // Optional<Profile>
    .flatMap(Profile::getEmail)               // Profile.getEmail() returns Optional<String>
    .filter(e -> e.contains("@"))             // Keep only valid emails
    .map(String::toLowerCase);
```

### ⚠️ Anti-Patterns to Avoid

```java
// ❌ DON'T: Use Optional as a method parameter
public void sendEmail(Optional<String> email) { }  // Creates unnecessary wrapping

// ❌ DON'T: Use get() without checking
optional.get();  // Throws NoSuchElementException if empty

// ❌ DON'T: Use Optional for collections — return empty list instead
public Optional<List<User>> getUsers() { }  // Bad
public List<User> getUsers() { return Collections.emptyList(); }  // Good

// ❌ DON'T: Use Optional as a field
class User {
    Optional<String> nickname;  // Bad — not serializable, adds overhead
    String nickname;            // Good — use null checks or default values
}
```

### When to Use Optional?
- ✅ As a **return type** for methods that may not always have a result.
- ✅ For **chaining** transformations on potentially absent values.
- ❌ Not as method parameters, fields, or collection elements.
