---
title: "Inner Join vs Left Join with Examples"
category: "db"
order: 32
status: "not-started"
tags: ["SQL", "Joins", "Data Filtering"]
---

# 🔹 INNER JOIN vs LEFT JOIN (Deep Dive, Interview-Ready)

"When do you use an INNER JOIN versus a LEFT JOIN?" 
This question tests your ability to think about data relationships. An `INNER JOIN` is an *exclusive* operation (it shrinks your result set), while a `LEFT JOIN` is an *inclusive* operation (it preserves your base result set).

---

## 📌 1. INNER JOIN (The Strict Match)

An `INNER JOIN` returns **only** the rows that have a matching value in **both** tables based on the join condition. If a record in Table A does not have a corresponding record in Table B, it is completely removed from the final output.

### 🔸 Scenario: The Strict Filter
*"Show me a list of all Employees along with their Department names. I only care about employees who have been officially assigned to a department."*

```sql
SELECT 
    e.emp_name, 
    d.dept_name
FROM 
    Employees e
INNER JOIN 
    Departments d ON e.dept_id = d.id;
```
**Database Engine Behavior:** The engine looks at employee `emp_name = 'Alice'` with `dept_id = NULL`. Because `NULL = d.id` is false, Alice is dropped from the result set.

---

## 📌 2. LEFT (OUTER) JOIN (The Preserver)

A `LEFT JOIN` returns **all** rows from the "Left" table (the one listed immediately after the `FROM` keyword), regardless of whether there is a match in the "Right" table. 
If there is no match, the database fills in the missing columns from the Right table with `NULL`.

### 🔸 Scenario: The Inclusive List
*"Show me a list of ALL Employees. If they belong to a department, show the department name. If they don't have a department yet, leave it blank, but make sure they are on the list."*

```sql
SELECT 
    e.emp_name, 
    COALESCE(d.dept_name, 'Unassigned') AS dept_name
FROM 
    Employees e
LEFT JOIN 
    Departments d ON e.dept_id = d.id;
```
**Database Engine Behavior:** The engine takes every single row from `Employees`. When it gets to Alice (`dept_id = NULL`), it fails to find a match in `Departments`. Instead of dropping Alice, it keeps her row and injects `NULL` for `d.dept_name`. (We use `COALESCE` to turn that `NULL` into the string 'Unassigned').

---

## 📌 3. The `WHERE` vs `ON` Trap in Left Joins

A classic senior-level interview trap is filtering a `LEFT JOIN`. 
Where you put the condition completely changes the output!

```sql
-- Query 1: Condition in ON clause
SELECT e.emp_name, d.dept_name
FROM Employees e
LEFT JOIN Departments d 
    ON e.dept_id = d.id AND d.location = 'New York';
```
*Result 1:* **Returns ALL employees.** If an employee is in a Chicago department, their `dept_name` will be `NULL`, but the employee row *survives* because the `LEFT JOIN` preserves the left table.

```sql
-- Query 2: Condition in WHERE clause
SELECT e.emp_name, d.dept_name
FROM Employees e
LEFT JOIN Departments d ON e.dept_id = d.id
WHERE d.location = 'New York';
```
*Result 2:* **Filters out employees!** The `LEFT JOIN` happens first, returning all employees with `NULL` for unassigned departments. Then, the `WHERE` clause runs. Because `NULL = 'New York'` is false, the unmatched employees are deleted. **Putting a right-table condition in the WHERE clause silently converts a LEFT JOIN into an INNER JOIN.**

---

## 🔥 Interview Gold Statement

> *"An INNER JOIN functions as an intersection, filtering out any records from both tables that do not satisfy the join condition. It is perfect for strict relationship mapping. A LEFT JOIN, however, guarantees that every row from the primary (left) table survives in the result set, padding missing related data with NULLs. A critical nuance to remember in LEFT JOINs is that applying a filter on the right table inside the WHERE clause will effectively convert the query into an INNER JOIN by filtering out the generated NULL rows. If you want to filter the joined data while preserving the left table, that condition must be placed within the ON clause."*
