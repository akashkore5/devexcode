---
title: "Shallow vs Deep cloning."
category: "collections"
order: 8
---

### Shallow Cloning:
- Copies the object but **not the references**. Both original and clone share the same nested objects.
- Modified via `Object.clone()` (default behavior).

### Deep Cloning:
- Copies the object **and all its nested objects**.
- Must be implemented manually by overriding `clone()` or using serialization.
- **Requirement**: Essential for creating truly immutable classes that wrap mutable objects.
