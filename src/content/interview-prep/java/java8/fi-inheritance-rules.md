---
title: "Can a functional interface extend/inherit another interface?"
category: "java8"
order: 5
---

**Yes**, with a strict rule:

- A functional interface can extend another interface **only if the resulting interface still has exactly one abstract method**.
- If the parent interface has an abstract method and the child interface adds another abstract method, the child is **not** a functional interface.
- **Exception**: It can extend interfaces that only have `default` or `static` methods, or methods that override `Object` methods (like `equals`).
