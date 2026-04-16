---
title: "Query to find the Second Highest Salary."
category: "db"
order: 10
---

### Using subquery:
```sql
SELECT MAX(salary) FROM employee 
WHERE salary < (SELECT MAX(salary) FROM employee);
```

### Using OFFSET (MySQL/PostgreSQL):
```sql
SELECT salary FROM employee 
ORDER BY salary DESC 
LIMIT 1 OFFSET 1;
```

### Using DENSE_RANK (Standard SQL):
```sql
SELECT salary FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk 
    FROM employee
) WHERE rnk = 2;
```
