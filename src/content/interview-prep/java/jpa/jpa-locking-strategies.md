---
title: "Optimistic vs Pessimistic Locking in JPA."
category: "jpa"
order: 15
---

### 1. Optimistic Locking
- **Mechanism**: Adds a `@Version` column to the entity.
- **Logic**: During update, Hibernate checks if the version is the same. If someone else updated it, it throws `OptimisticLockException`.
- **Best For**: High concurrency with low conflict (most users don't edit the same record at the same time).

### 2. Pessimistic Locking
- **Mechanism**: Uses DB level locks (`SELECT FOR UPDATE`).
- **Logic**: Blocks other transactions from reading/writing until yours is finished.
- **Best For**: Scenarios where data integrity is critical and conflicts are frequent.
