---
title: "How to create an Immutable class securely."
category: "collections"
order: 7
---

### Steps:
1. Declare the class as **final** (prevents inheritance).
2. Make fields **private and final**.
3. No **setter** methods.
4. Use a **constructor** to initialize fields.
5. **Deep Copy** for mutable fields: If a field is a List or Date, return/set a copy instead of the original reference.

### Reflection/IO Protection:
- For **Serializable**, implement `readResolve()` to return the singleton/existing instance if applicable (for enum-like immutables).
- For **Reflection**, throw an exception in the constructor if the instance is already created (for Singleton).
