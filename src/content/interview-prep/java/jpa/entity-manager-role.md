---
title: "Role of EntityManager in Spring Data JPA."
category: "jpa"
order: 41
---

### What is it?
The core API for interacting with the Persistence Context. While Spring Data JPA abstracts this away via repositories, `EntityManager` is what actually performs the operations under the hood.

### Why use it directly?
1. **Dynamic Queries**: Using `CriteriaBuilder`.
2. **Bulk Operations**: When repository methods are not enough.
3. **Flushing**: Explicitly synchronizing the persistence context with the database.
4. **Native Queries**: For complex SQL that doesn't map easily to repositories.
