---
title: "Self Join: Why is it required?"
category: "db"
order: 20
---

### Purpose:
A self-join is a regular join, but the table is joined with itself. It's used when a table has a hierarchical structure.

### Common Scenario: Employee and Manager
Most companies store employees and their managers in the same table.
```sql
SELECT e.name as Employee, m.name as Manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;
```
Other scenarios include finding duplicate rows or finding pairs of products bought together.
