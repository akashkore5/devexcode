---
title: "WHERE vs HAVING."
category: "db"
order: 2
---

### WHERE:
- Filters rows **before** any grouping or aggregation is performed.
- Cannot be used with aggregate functions (`SUM`, `AVG`, etc.).

### HAVING:
- Filters groups **after** the `GROUP BY` clause.
- Typically used with aggregate functions.
- Example: `SELECT dept, COUNT(*) FROM emp GROUP BY dept HAVING COUNT(*) > 5;`
