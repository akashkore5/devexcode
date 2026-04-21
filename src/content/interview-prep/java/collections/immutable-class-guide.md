---
title: "Mastering Immutable Classes: Security, Reflection & I/O"
category: "collections"
order: 28
status: "not-started"
tags: ["Immutability", "Best Practice", "Security", "Serialization"]
---

# 🔹 Mastering Immutable Classes (Deep Dive, Interview-Ready)

An **Immutable class** is a class whose state cannot be modified after it is instantiated. In Java, `String` and the wrapper classes (`Integer`, `Double`) are the most famous examples. 

Interviewers ask about immutability because it tests your knowledge of thread safety, memory management, and defensive programming.

---

## 📌 1. The 5 Rules for Creating an Immutable Class

To build a truly immutable class in Java, you must strictly follow these five rules:

1. **Make the class `final`:** This prevents child classes from extending it and overriding its methods to alter its behavior.
2. **Make all fields `private` and `final`:** This ensures fields can only be assigned once and cannot be accessed directly from the outside.
3. **Do NOT provide any setters:** Never expose methods that change the state of the object.
4. **Initialize all fields via the Constructor:** The object must be fully formed at the exact moment of creation.
5. **Defensive Copying for Mutable Fields:** If the class holds references to mutable objects (like a `List`, `Date`, or `StringBuilder`), you must perform a **Deep Copy** both when receiving them in the constructor and when returning them in getters.

### 🔸 Example of Defensive Copying
```java
public final class SecureUser {
    private final String username; // String is immutable (safe)
    private final List<String> roles; // List is mutable (dangerous!)

    public SecureUser(String username, List<String> roles) {
        this.username = username;
        // DEFENSIVE COPY IN: Do not assign the reference directly!
        this.roles = new ArrayList<>(roles); 
    }

    public List<String> getRoles() {
        // DEFENSIVE COPY OUT: Return a copy, or an unmodifiable view
        return Collections.unmodifiableList(this.roles);
    }
}
```
If you forget the defensive copy, external code can modify the list after the `SecureUser` object is created, destroying its immutability.

---

## 📌 2. Why are Immutable Classes so Important?

* **Inherent Thread Safety:** Immutable objects are automatically thread-safe. Because their state cannot change, multiple threads can read them simultaneously without any locking or synchronization overhead.
* **Perfect for HashMaps:** They make the best keys for `HashMap` and `HashSet`. If a key's state changes after insertion, its HashCode changes, and it becomes permanently lost in the map.
* **Cacheable & Reusable:** You can cache and safely reuse them without worrying about another part of the system corrupting the data.

---

## 📌 3. Security Threats: Breaking Immutability

Senior interviews will often ask: *"Is a final immutable class truly 100% secure?"* 
The answer is **No**. It can be broken in two main ways:

### 🔸 1. The Reflection Attack
Reflection allows a malicious developer to bypass `private` and `final` modifiers and forcibly overwrite data in memory.
```java
Field field = SecureUser.class.getDeclaredField("username");
field.setAccessible(true); // Bypasses private
field.set(secureUserInstance, "HackedName"); // Modifies final field!
```
*How to defend:* You cannot easily stop Reflection modifying fields, but if you are building a Singleton, you can throw an exception in the constructor if it is called more than once.

### 🔸 2. The Serialization Attack
When an object implements `Serializable`, deserializing it from a byte stream bypasses the constructor completely. A malicious user could alter the byte stream before deserialization to inject illegal state.
*How to defend:* You must implement the `readResolve()` method to intercept the deserialized object and validate it, or return the known good Singleton instance.

---

## 🔥 Interview Gold Statement

> *"To create a bulletproof Immutable class, I make the class `final` to prevent subclassing, make all fields `private final`, remove all setters, and initialize everything via the constructor. Most importantly, if the class contains mutable objects like Collections or Dates, I strictly use Defensive Copying both when initializing the fields and when returning them from getters. Immutability is the bedrock of robust Java applications because it guarantees inherent thread safety without the performance overhead of synchronization, and it provides stable `hashCode`s required for reliable HashMap keys."*

---

## ⚡ Final Verdict

* ✅ **Always favor immutability** for Data Transfer Objects (DTOs), configurations, and HashMap keys.
* ❌ **Watch out for memory overhead** if the state needs to change frequently, as every change requires creating a brand new object on the heap.
