---
title: "How to implement pagination in SQL?"
category: "db"
order: 34
---

### 1. Using LIMIT and OFFSET (MySQL, PostgreSQL)
- **Syntax**: `SELECT * FROM employee ORDER BY id LIMIT 10 OFFSET 20;`
- **Logic**: Skips 20 rows and takes the next 10.
- **Perf Concern**: For very high offsets (`OFFSET 1000000`), it is slow because the DB must scan all preceding rows.

### 2. Using FETCH FIRST (SQL Server, Oracle 12c+)
- **Syntax**: `SELECT * FROM employee ORDER BY id OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;`

### 3. Keyset Pagination (Cursor-based)
- **Syntax**: `SELECT * FROM employee WHERE id > last_seen_id ORDER BY id LIMIT 10;`
- **Benefit**: Much faster for large datasets as it uses the index directly.
