---
title: "Inner Join vs Left Join with Examples."
category: "db"
order: 32
---

### 1. INNER JOIN
Returns records that have matching values in both tables.
- **Scenario**: Get a list of employees and their departments.
- **Result**: Employees without a department (null) are excluded.

### 2. LEFT (OUTER) JOIN
Returns all records from the left table, and the matched records from the right table.
- **Scenario**: Get a list of ALL employees, even if they aren't assigned to a department yet.
- **Result**: If an employee has no department, the department columns will be `NULL`.

### 3. Differences
- **INNER**: Intersection.
- **LEFT**: Everything from Table A + matches from B.
