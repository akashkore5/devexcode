---
title: "What is a default method and why is it required?"
category: "java8"
order: 4
---

### What is it?
A method in an interface that has a body and is marked with the `default` keyword.

### Why was it required?
- **Backward Compatibility**: To add new methods to existing interfaces (like `Iterable.forEach` or `Collection.stream`) without breaking the classes that implement those interfaces.
- Before Java 8, adding a method to an interface required all implementing classes to provide an implementation, which was impossible for core libraries used by millions.
