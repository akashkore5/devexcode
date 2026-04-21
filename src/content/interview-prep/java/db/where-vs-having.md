---
title: "WHERE vs HAVING: Filtering Data at Different Stages"
category: "db"
order: 2
status: "not-started"
tags: ["SQL", "Filtering", "Execution Order", "Aggregations"]
---

# 🔹 WHERE vs HAVING (Deep Dive, Interview-Ready)

"What is the difference between WHERE and HAVING?" is a foundational SQL interview question. The answer lies entirely in **when** the database engine executes the filter during the query lifecycle.

---

## 📌 1. The Core Difference: Execution Timing

### 🔸 The `WHERE` Clause (Pre-Aggregation)
The `WHERE` clause filters individual rows **before** any grouping or aggregations take place.
Because it filters raw data early in the process, it reduces the number of rows the database has to process in later stages.
* **Can it use Aggregates?** No. You cannot use functions like `SUM()`, `COUNT()`, or `MAX()` in a `WHERE` clause because those functions haven't been calculated yet.

```sql
-- ✅ Filtering individual rows BEFORE grouping
SELECT department, SUM(salary) 
FROM Employees 
WHERE status = 'Active' 
GROUP BY department;
```

### 🔸 The `HAVING` Clause (Post-Aggregation)
The `HAVING` clause filters grouped rows **after** the `GROUP BY` clause has organized the data and the aggregate functions have been calculated.
* **Can it use Aggregates?** Yes. This is the primary purpose of `HAVING`. It filters based on the aggregated results.

```sql
-- ✅ Filtering groups AFTER the SUM is calculated
SELECT department, SUM(salary) as TotalSalary
FROM Employees 
GROUP BY department
HAVING SUM(salary) > 100000;
```

---

## 📌 2. The Golden Rule of Performance

If a condition *can* be placed in the `WHERE` clause, it **must** be placed in the `WHERE` clause. 

**Bad Practice:**
```sql
SELECT department, COUNT(*) 
FROM Employees 
GROUP BY department
HAVING department = 'IT'; -- ❌ Filtering a non-aggregate column in HAVING
```
Why is this bad? The database will pull *every single employee*, group them into *all* departments, count them, and only *then* throw away the groups that aren't 'IT'. This wastes massive amounts of CPU and memory.

**Good Practice:**
```sql
SELECT department, COUNT(*) 
FROM Employees 
WHERE department = 'IT'   -- ✅ Filtering before grouping
GROUP BY department;
```
Here, the database instantly ignores non-IT employees using an index, completely bypassing unnecessary grouping logic.

---

## 📌 3. Using Both Together

You will frequently use both clauses in the same query to filter raw data first, and then filter the aggregated results.

**Scenario:** *Find the total salary of all active employees per department, but only show departments where the total active salary exceeds $500,000.*

```sql
SELECT department, SUM(salary) AS total_salary
FROM Employees
WHERE is_active = true          -- 1. Filter raw rows first
GROUP BY department             -- 2. Group the remaining rows
HAVING SUM(salary) > 500000;    -- 3. Filter the aggregated groups
```

---

## 📊 4. Summary Comparison

| Feature | WHERE | HAVING |
| :--- | :--- | :--- |
| **Execution Phase** | Filters rows **before** grouping | Filters rows **after** grouping |
| **Aggregate Functions** | ❌ Cannot be used (`SUM`, `COUNT`) | ✅ Can be used |
| **Performance Impact** | Reduces data volume early (High perf) | Filters already processed data |
| **Used with** | `SELECT`, `UPDATE`, `DELETE` | Exclusively with `SELECT` and `GROUP BY` |

---

## 🔥 Interview Gold Statement

> *"The fundamental difference between WHERE and HAVING is execution order. The WHERE clause filters individual rows from the source tables before any grouping occurs, making it highly efficient for reducing the dataset size early using indexes. The HAVING clause operates later in the query lifecycle, specifically to filter the grouped result sets after aggregate functions like SUM or COUNT have been computed. While HAVING can theoretically filter non-aggregate columns, doing so is an anti-pattern; anything that can be filtered in WHERE should be, to optimize performance."*
