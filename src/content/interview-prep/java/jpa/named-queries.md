---
title: "Named Queries vs @Query in Spring Data JPA."
category: "jpa"
order: 44
---

### @NamedQuery:
- Statically defined in the Entity class.
- Compiled by the JPA provider on startup (catches syntax errors early).
- Not very flexible for dynamic logic.

### @Query:
- Defined directly on the repository method.
- **Preferred**: More readable (kept close to the logic).
- Supports both JPQL and Native SQL.
- Can use method parameters directly: `@Query("select u from User u where u.email = :email")`.

**Precedence**: `@Query` takes precedence over `@NamedQuery`.
