---
title: "JPA vs Hibernate vs Spring Data JPA."
category: "jpa"
order: 1
---

### 1. JPA (Java Persistence API)
- A **Specification** (Interface). It defines the standard for ORM (Object-Relational Mapping). It is just a set of rules and annotations (@Entity, @Table, etc.).

### 2. Hibernate
- An **Implementation** (Provider) of JPA. It actually contains the logic to map objects to the database. It has more features than standard JPA (like HQL).

### 3. Spring Data JPA
- A **Wrapper / Layer** on top of JPA providers (Hibernate). It provides the `Repository` abstraction (`JpaRepository`, `CrudRepository`), allowing you to perform DB operations without writing boilerplate DAO code.
