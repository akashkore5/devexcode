---
title: "Horizontal vs Vertical Partitioning."
category: "db"
order: 22
---

### 1. Horizontal Partitioning (Sharding):
- Different **rows** are stored in different tables/databases.
- Example: Splitting a `Users` table by region (US Users vs EU Users).
- **Benefit**: Reduces table size per instance, improving search performance.

### 2. Vertical Partitioning:
- Different **columns** are stored in different tables.
- Example: Moving rarely used BLOB/TEXT columns to a separate table to keep the main table "lean".
- **Benefit**: Reduces I/O when selecting only frequently used columns.
