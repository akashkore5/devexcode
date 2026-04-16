---
title: "Primary, Candidate, and Surrogate Keys."
category: "db"
order: 23
---

### 1. Candidate Key:
A set of columns that can uniquely identify a row. A table can have multiple candidate keys.

### 2. Primary Key:
The candidate key chosen by the DBA to be the unique identifier for the table. Cannot be null.

### 3. Surrogate Key:
A unique identifier that has no business meaning (e.g., an auto-incremented ID). Better than natural keys (like SSN) because they never change.

### Table without PK?
Possible, but bad practice.
- **Performance**: No clustered index (leads to slow searches/scans).
- **Integrity**: Hard to prevent duplicate rows.
