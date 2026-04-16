---
title: "@GeneratedValue strategies in JPA."
category: "jpa"
order: 10
---

### 1. IDENTITY
- Relies on the database ID column (Auto-increment).
- **Caveat**: Disables batch inserts because Hibernate needs to perform the insert to get the ID.

### 2. SEQUENCE
- Uses a database sequence object.
- **Preferred**: Supports batch inserts as IDs can be pre-fetched in batches (`allocationSize`).

### 3. TABLE
- Uses a separate table to simulate a sequence.
- **Slowest**: High overhead due to table locks and synchronization. Only used if the DB doesn't support sequences or identity.

### 4. AUTO
- Hibernate chooses the strategy based on the DB dialect (often defaults to SEQUENCE or TABLE).
