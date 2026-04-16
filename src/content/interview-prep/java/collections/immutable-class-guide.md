---
title: "Mastering Immutable Classes: Security, Reflection & I/O"
category: "collections"
date: "2024-04-16"
difficulty: "Intermediate"
tags: ["Immutability", "Best Practice", "Security", "Serialization"]
---

An **Immutable class** is a class whose state cannot be modified after it is created.

### 1. Requirements for Immutability
1.  **Final Class**: Prevent inheritance (`public final class`).
2.  **Private and Final Fields**: Restrict access and ensure one-time initialization.
3.  **No Setters**: Provide no methods that modify the instance state.
4.  **Constructor Initialization**: Initialize all fields via constructor.
5.  **Deep Copy for Mutables**: If the class contains references to mutable objects (like `List`, `Date`, or `Address`), always perform a deep copy in the constructor and return a copy in the getter.

### 2. Reflection Security
Reflection can bypass private modifiers to change field values. To protect your immutable class:
-   **Field Access check**: Use a `SecurityManager` if one is present.
-   **Constructor Logic**: If you are implementing a Singleton-style immutable, you can check if an instance exists and throw an exception:
    ```java
    public final class SecureImmutable {
        private static boolean created = false;
        public SecureImmutable() {
            if (created) throw new RuntimeException("Reflection attack blocked!");
            created = true;
        }
    }
    ```

### 3. I/O & Serialization Security
When an immutable class implements `Serializable`, the default deserialization can create a new instance, potentially with a modified state (if the stream is tampered with).
-   **Implement `readResolve()`**: This ensures that when the object is deserialized, the system returns a specific instance or performs validation.
-   **Instance Control**: For enums or singletons, `readResolve` is critical to maintain the "one instance only" contract.

### 4. Why use Immutable Classes?
-   **Thread Safety**: They are inherently thread-safe because their state never changes.
-   **Cache Friendly**: Perfect for keys in `HashMap` or elements in `HashSet`.
-   **Simpler Design**: No need to worry about side effects or defensive copying after creation.

### Example: Secure Immutable
```java
public final class UserMetadata {
    private final String username;
    private final List<String> permissions;

    public UserMetadata(String username, List<String> permissions) {
        this.username = username;
        // Deep copy to prevent outside modification
        this.permissions = new ArrayList<>(permissions);
    }

    public List<String> getPermissions() {
        // Return a copy, not the actual list reference
        return new ArrayList<>(this.permissions);
    }
}
```
