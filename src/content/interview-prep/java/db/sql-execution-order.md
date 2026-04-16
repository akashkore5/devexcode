---
title: "Internal Execution Order of a SQL Query."
category: "db"
order: 3
---

The Database does not execute clauses in the order they are written. The logical order is:

1. **FROM** (and JOINs)
2. **WHERE** (filters rows)
3. **GROUP BY** (groups rows)
4. **HAVING** (filters groups)
5. **SELECT** (picks columns)
6. **ORDER BY** (sorts result)
7. **LIMIT / OFFSET** (trims result)
