---
title: "Advanced SQL Query Puzzles (Top Paid, Dept Averages, etc.)"
category: "db"
order: 30
---

### 1. Top 3 highest-paid employees in each department
```sql
SELECT name, salary, department_id
FROM (
    SELECT name, salary, department_id,
           DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rnk
    FROM Employee
) WHERE rnk <= 3;
```

### 2. Employees earning more than their department average
```sql
SELECT e.name, e.salary, d_avg.avg_salary
FROM Employee e
INNER JOIN (
    SELECT department_id, AVG(salary) as avg_salary
    FROM Employee
    GROUP BY department_id
) d_avg ON e.department_id = d_avg.department_id
WHERE e.salary > d_avg.avg_salary;
```

### 3. Earn more than department average AND more than their manager
```sql
SELECT e.name
FROM Employee e
JOIN Employee m ON e.manager_id = m.id
JOIN (
    SELECT department_id, AVG(salary) as avg_salary
    FROM Employee GROUP BY department_id
) d_avg ON e.department_id = d_avg.department_id
WHERE e.salary > d_avg.avg_salary AND e.salary > m.salary;
```

### 4. Same salary as someone in another department
```sql
SELECT e1.name, e1.salary
FROM Employee e1
WHERE EXISTS (
    SELECT 1 FROM Employee e2 
    WHERE e1.salary = e2.salary 
    AND e1.department_id <> e2.department_id
);
```
