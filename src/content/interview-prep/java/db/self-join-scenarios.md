---
title: "Self Join: Why is it required?"
category: "db"
order: 20
status: "not-started"
tags: ["SQL", "Joins", "Query Building", "Hierarchical Data"]
---

# 🔹 Self Join (Deep Dive, Interview-Ready)

A **Self Join** is not a distinct SQL keyword or an internal engine operation. It is simply a regular `JOIN` (usually an `INNER JOIN` or `LEFT JOIN`) where a table is joined to *itself*.

Interviewers ask about Self Joins to test your ability to model and query **hierarchical or relational data** that exists within a single table.

---

## 📌 1. The Necessity of Aliases

Because you are querying the exact same table twice in a single query, the database engine would throw an ambiguous column error if you tried to reference a column name. 
To perform a Self Join, you **must** use Table Aliases (e.g., `e1` and `e2`) to trick the database into treating the single table as if it were two separate tables.

---

## 📌 2. Classic Scenario 1: The Employee-Manager Hierarchy

This is the most common interview question regarding Self Joins: 
*"Given an Employee table where each employee row contains a `manager_id` pointing to another employee in the same table, print a list of Employees and their Managers' names."*

```sql
SELECT 
    e.name AS Employee_Name, 
    m.name AS Manager_Name
FROM 
    Employees e
JOIN 
    Employees m 
ON 
    e.manager_id = m.employee_id;
```

### 🔸 The "CEO" Trap (Left Join)
An interviewer will follow up: *"What if an employee is the CEO and doesn't have a manager?"*
If you use an `INNER JOIN` (like the query above), the CEO will be excluded from the results because their `manager_id` is `NULL`.
**The Fix:** You must use a `LEFT JOIN` to ensure the CEO is included in the output with a `NULL` Manager_Name.

```sql
SELECT 
    e.name AS Employee_Name, 
    COALESCE(m.name, 'No Manager (CEO)') AS Manager_Name
FROM 
    Employees e
LEFT JOIN 
    Employees m 
ON 
    e.manager_id = m.employee_id;
```

---

## 📌 3. Classic Scenario 2: Finding Duplicates

Another powerful use of a Self Join is identifying duplicate rows or comparing rows against each other within the same table.

*"Find all employees who earn more than their managers."*

```sql
SELECT 
    e.name AS Employee, 
    e.salary AS Emp_Salary, 
    m.name AS Manager, 
    m.salary AS Mgr_Salary
FROM 
    Employees e
JOIN 
    Employees m 
ON 
    e.manager_id = m.employee_id
WHERE 
    e.salary > m.salary; -- The crucial Self-Comparison
```

---

## 🔥 Interview Gold Statement

> *"A Self Join is structurally just a standard join, but it is applied to the same table by utilizing Table Aliases. We use it when a table contains hierarchical data, such as a localized Employee-Manager relationship, or when we need to compare rows within the same table against each other. When implementing a Self Join for hierarchies, I always consider whether the top-level entity (like a CEO) has a NULL parent reference; if so, I ensure I use a LEFT JOIN rather than an INNER JOIN to prevent the root entity from being inadvertently filtered out of the result set."*
