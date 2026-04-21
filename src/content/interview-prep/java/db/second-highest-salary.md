---
title: "Query to find the Second Highest Salary"
category: "db"
order: 10
status: "not-started"
tags: ["SQL", "Query Building", "Window Functions", "Puzzles"]
---

# 🔹 Finding the Second Highest Salary (Deep Dive, Interview-Ready)

"Write a query to find the second highest salary" is the "Hello World" of SQL interview questions. 
While writing a basic subquery is usually acceptable for juniors, senior candidates are expected to demonstrate knowledge of **Window Functions** and database-specific pagination techniques.

---

## 📌 1. The Classic Subquery (Universal, but slow)

This is the most common answer. It works on every relational database (MySQL, PostgreSQL, Oracle, SQL Server).

```sql
SELECT MAX(salary) AS SecondHighestSalary 
FROM Employees 
WHERE salary < (SELECT MAX(salary) FROM Employees);
```

### 🔸 Why it's good:
It is ANSI-standard SQL and works everywhere. If there is no second highest salary (e.g., the table has only one row), it safely returns `NULL`.

### 🔸 Why it's bad:
It requires two separate table scans to calculate the aggregates, making it inefficient for massive tables. Furthermore, it only works for the *second* highest. If the interviewer asks for the *5th* highest, this approach collapses into an unreadable nested mess.

---

## 📌 2. The LIMIT / OFFSET Approach (MySQL & PostgreSQL)

A much cleaner way to find the Nth highest salary is to sort the salaries descending and pick the specific row you want.

```sql
SELECT DISTINCT salary AS SecondHighestSalary
FROM Employees 
ORDER BY salary DESC 
LIMIT 1 OFFSET 1; 
```

### 🔸 How it works:
* `DISTINCT`: Ensures we don't accidentally get the highest salary twice if two people share the top spot.
* `ORDER BY salary DESC`: Sorts from highest to lowest.
* `LIMIT 1 OFFSET 1`: Skips the first row (the highest) and returns exactly 1 row (the second highest).

*(Note: In SQL Server, the equivalent syntax uses `OFFSET 1 ROWS FETCH NEXT 1 ROWS ONLY`.)*

---

## 📌 3. The Enterprise Approach: Window Functions (DENSE_RANK)

This is the **Gold Standard** answer for senior developers. Window functions are the modern, high-performance way to solve ranking problems.

```sql
WITH RankedSalaries AS (
    SELECT 
        salary, 
        DENSE_RANK() OVER (ORDER BY salary DESC) as rank_pos
    FROM Employees
)
SELECT salary AS SecondHighestSalary
FROM RankedSalaries 
WHERE rank_pos = 2;
```

### 🔸 Why DENSE_RANK() and not RANK()?
This is the follow-up question the interviewer will ask.
If three employees make $100k, and one makes $90k:
* `RANK()` will assign ranks: 1, 1, 1, 4. (There is no rank 2!)
* `DENSE_RANK()` will assign ranks: 1, 1, 1, 2. (It doesn't skip numbers).
Therefore, `DENSE_RANK()` is the only safe way to find the "second" highest distinct value.

---

## 🔥 Interview Gold Statement

> *"There are three ways to find the Nth highest salary. The classic subquery `MAX(salary) < MAX(salary)` is universal but scales poorly and can't easily find the 5th or 10th highest. For database-specific solutions, using `ORDER BY` with `LIMIT/OFFSET` is clean and fast. However, the enterprise best practice is to use Window Functions, specifically `DENSE_RANK()`. By partitioning the data using a CTE and filtering `WHERE rank = N`, we create a highly performant, scalable query. It is critical to use `DENSE_RANK()` rather than `RANK()` to ensure that ties for the top salary don't cause the ranking sequence to skip numbers."*
