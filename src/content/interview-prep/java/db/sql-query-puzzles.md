---
title: "Advanced SQL Query Puzzles (Top Paid, Dept Averages)"
category: "db"
order: 30
status: "not-started"
tags: ["SQL", "Query Building", "Window Functions", "Puzzles"]
---

# 🔹 Advanced SQL Query Puzzles (Deep Dive, Interview-Ready)

In technical rounds, interviewers will often present complex data-retrieval scenarios that cannot be solved with a simple `SELECT *`. These puzzles are designed to test your mastery of **Window Functions**, **Subqueries**, **CTEs (Common Table Expressions)**, and **Self Joins**.

Here are the four most frequently asked advanced SQL puzzles, along with the enterprise-grade solutions.

---

## 📌 Puzzle 1: Top 3 Highest Paid Employees per Department

**The Challenge:** Write a query to find the top 3 highest-earning employees *within each specific department*.
**The Trap:** You cannot just use `ORDER BY salary DESC LIMIT 3`, because that gives you the top 3 in the *entire company*, not per department.

**The Solution: Window Functions (`DENSE_RANK`)**
We use `PARTITION BY` to create "windows" of data for each department, rank them internally, and then filter.

```sql
WITH RankedEmployees AS (
    SELECT 
        name, 
        salary, 
        department_id,
        DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rnk
    FROM Employee
)
SELECT name, salary, department_id
FROM RankedEmployees 
WHERE rnk <= 3;
```
*(Note: We use `DENSE_RANK()` so that if two employees tie for 1st place, the next employee is ranked 2nd, not 3rd).*

---

## 📌 Puzzle 2: Employees earning more than their Department Average

**The Challenge:** Find all employees who earn a salary strictly greater than the average salary of their specific department.
**The Trick:** You must calculate the aggregate (Average) *first*, and then join it back to the raw employee data for row-by-row comparison.

**The Solution: CTE / Subquery Join**
```sql
WITH DeptAverages AS (
    SELECT department_id, AVG(salary) as avg_salary
    FROM Employee
    GROUP BY department_id
)
SELECT e.name, e.salary, d.avg_salary
FROM Employee e
INNER JOIN DeptAverages d 
    ON e.department_id = d.department_id
WHERE e.salary > d.avg_salary;
```

---

## 📌 Puzzle 3: The "Double Filter" (Dept Average AND Manager)

**The Challenge:** Find employees who earn more than their department's average salary **AND** also earn more than their direct manager.
**The Trick:** This combines the CTE from Puzzle 2 with a classic **Self Join**.

**The Solution: CTE + Self Join**
```sql
WITH DeptAverages AS (
    SELECT department_id, AVG(salary) as avg_salary
    FROM Employee 
    GROUP BY department_id
)
SELECT e.name
FROM Employee e
-- 1. Self Join to get the Manager's Salary
JOIN Employee m 
    ON e.manager_id = m.id
-- 2. Join the CTE to get the Department Average
JOIN DeptAverages d_avg 
    ON e.department_id = d_avg.department_id
-- 3. Apply the double filter
WHERE e.salary > d_avg.avg_salary 
  AND e.salary > m.salary;
```

---

## 📌 Puzzle 4: The Cross-Department Match

**The Challenge:** Find employees who have the exact same salary as someone in a *different* department.
**The Trick:** This requires checking the existence of a specific condition across the table without duplicating rows. 

**The Solution: `EXISTS` Clause**
Using `EXISTS` is highly performant because it stops searching the moment it finds the first match, rather than calculating a full cartesian product.

```sql
SELECT e1.name, e1.salary, e1.department_id
FROM Employee e1
WHERE EXISTS (
    SELECT 1 
    FROM Employee e2 
    WHERE e1.salary = e2.salary 
      AND e1.department_id <> e2.department_id
);
```

---

## 🔥 Interview Gold Statement

> *"Advanced query puzzles generally fall into two categories: Windowing and Relational Filtering. For questions involving 'Top N per category,' utilizing Window Functions like `DENSE_RANK() OVER (PARTITION BY ...)` inside a CTE is the enterprise standard, as it avoids complex and slow correlated subqueries. For questions requiring comparisons against aggregates (like department averages), the cleanest approach is to calculate the aggregates in an isolated CTE, then `INNER JOIN` that CTE back to the main table for row-by-row filtering. Using CTEs not only makes the query highly readable for other engineers but allows the query optimizer to execute the aggregation block efficiently."*
