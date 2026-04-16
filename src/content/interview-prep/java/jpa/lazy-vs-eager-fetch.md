---
title: "FetchType.LAZY vs FetchType.EAGER."
category: "jpa"
order: 3
---

### EAGER:
- The related entity is loaded **at the same time** as the parent entity.
- Default for `@ManyToOne` and `@OneToOne`.
- Risk: Can lead to performance issues if many unnecessary relationships are loaded.

### LAZY:
- The related entity is loaded **only when it is accessed** for the first time.
- Default for `@OneToMany` and `@ManyToMany`.
- Requirement: Must be accessed within an active transaction, otherwise `LazyInitializationException` occurs.
