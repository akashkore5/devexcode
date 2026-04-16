---
title: "What are Marker Interfaces and why are they required?"
category: "miscellaneous"
order: 2
---

### Definition:
An interface with **no methods or fields**.

### Examples:
- `Serializable`
- `Cloneable`
- `Remote`

### Purpose:
- They act as **tags** or "flags" for the JVM or a library.
- For example, if a class implements `Cloneable`, it tells `Object.clone()` that it is safe to make a field-for-field copy. Without it, `CloneNotSupportedException` is thrown.
- In modern Java, these are often replaced by **Annotations**, which are more flexible.
