---
title: "Indexing: When, How, and Why (Adv/Disadv)."
category: "db"
order: 33
---

### When to Index?
- Columns used in **WHERE** clauses.
- Columns used in **JOIN** conditions.
- Columns frequently used for **ORDER BY** or **GROUP BY**.

### Advantages:
- Significantly speeds up data retrieval.
- Reduces disk I/O.

### Disadvantages:
- **Writes are Slower**: Every time you `INSERT` or `UPDATE`, the database must also update the index file.
- **Storage**: Indexes occupy physical disk space.
- **Maintenance**: Poorly chosen indexes can lead to "Over-indexing" and wasted resources.

### Implementation:
```sql
CREATE INDEX idx_user_email ON users(email);
```
