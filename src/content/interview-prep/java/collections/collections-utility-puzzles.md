---
title: "Collections & Arrays: Utility Puzzles and Best Practices"
category: "collections"
date: "2024-04-16"
difficulty: "Intermediate"
tags: ["Utility", "Java 8", "Architecture", "Best Practice"]
---

This section covers common utility patterns, choice of data structures, and conversion puzzles frequently asked in interviews.

### 1. Array vs ArrayList: Which one is preferred?
-   **Preference**: **ArrayList** is generally preferred because it is dynamic, resizable, and provides a rich set of methods (`add`, `remove`, `contains`).
-   **When to use Array**: Use arrays ONLY when length is fixed and known at compile time, or when memory overhead is extremely critical (arrays store primitives directly, whereas ArrayLists use Wrappers).

### 2. How to create an Empty Map?
-   **Modern Java**: `Map.of()` (Java 9+) or `Collections.emptyMap()`.
-   **Why `emptyMap()`?**: It returns an immutable, singleton instance, which is much more memory efficient than `new HashMap<>()` if you just need to return an empty result.

### 3. Converting Map to List
To convert map keys or values to a List:
```java
List<String> keys = new ArrayList<>(map.keySet());
List<String> values = new ArrayList<>(map.values());
```

### 4. Shadow vs Deep Copy of a Map
-   **Shallow Copy**: `new HashMap<>(originalMap)` creates a new map, but the objects in the values are shared references.
-   **Deep Copy**: Requires iterating and manually cloning/copying each object within the map.

### 5. Map with Reverse View (BiMap)
In standard Java, to get a reverse view (lookup by value), you usually have to create a second map.
```java
// Logic to reverse a map manually
Map<String, String> reverse = map.entrySet().stream()
    .collect(Collectors.toMap(Map.Entry::getValue, Map.Entry::getKey));
```
*Note: For production, use Guava's `BiMap`.*

### 6. Synchronized vs Concurrent Collections
-   **Synchronized**: Created via `Collections.synchronizedList()`. It uses a global lock on the entire object, making it slower.
-   **Concurrent**: Classes like `ConcurrentHashMap` or `CopyOnWriteArrayList` use smarter lock-striping or CAS, allowing multiple threads to read and write simultaneously.
