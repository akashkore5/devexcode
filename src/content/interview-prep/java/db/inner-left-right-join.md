---
title: "INNER JOIN vs LEFT JOIN vs RIGHT JOIN: Complete Comparison"
category: "db"
order: 35
status: "not-started"
tags: ["SQL", "Joins", "Data Merging"]
---

# 🔹 The Big Three Joins: INNER, LEFT, & RIGHT (Deep Dive, Interview-Ready)

While `INNER JOIN` and `LEFT JOIN` are the most common operations in SQL, interviewers often ask to compare them against `RIGHT JOIN` to test your spatial reasoning of database tables and your understanding of best practices.

---

## 📌 1. The Scenario & Sample Data

Imagine a company where some employees haven't been assigned to a department yet, and some departments don't have any employees in them yet.

```sql
-- employees                    -- departments
-- | id | name   | dept_id |   -- | id | dept_name   |
-- |----|--------|---------|   -- |----|-------------|
-- | 1  | Akash  | 10      |   -- | 10 | Engineering |
-- | 2  | Rahul  | 20      |   -- | 20 | Marketing   |
-- | 3  | Amit   | NULL    |   -- | 30 | Finance     |
-- | 4  | Ankit  | 10      |
```

---

## 📌 2. INNER JOIN (The Intersection)
Returns **only matching rows** from both tables.

```sql
SELECT e.name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;
```

| name  | dept_name   |
|-------|-------------|
| Akash | Engineering |
| Rahul | Marketing   |
| Ankit | Engineering |

> **Amit** is excluded (dept_id is NULL — no match).
> **Finance** is excluded (no employee belongs to it).

---

## 📌 3. LEFT JOIN (LEFT OUTER JOIN)
Returns **all rows from the left table** + matched rows from the right. Unmatched right columns are padded with `NULL`.

```sql
SELECT e.name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id;
```

| name  | dept_name   |
|-------|-------------|
| Akash | Engineering |
| Rahul | Marketing   |
| Amit  | **NULL**    |
| Ankit | Engineering |

> **Amit** is included with a NULL department.
> **Finance** is still excluded (it's in the right table with no matches).

---

## 📌 4. RIGHT JOIN (RIGHT OUTER JOIN)
Returns **all rows from the right table** + matched rows from the left. Unmatched left columns are padded with `NULL`.

```sql
SELECT e.name, d.dept_name
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.id;
```

| name    | dept_name   |
|---------|-------------|
| Akash   | Engineering |
| Ankit   | Engineering |
| Rahul   | Marketing   |
| **NULL**| Finance     |

> **Finance** is included with a NULL employee name.
> **Amit** is excluded (he's in the left table with no match).

---

## 📌 5. The Best Practice: Why avoid RIGHT JOIN?

You will almost never see a `RIGHT JOIN` in professional, enterprise-grade codebases. Why? Because the human brain reads English from top-to-bottom and left-to-right. 

A `RIGHT JOIN` forces you to read backwards to figure out which table is driving the query. Any `RIGHT JOIN` can be trivially rewritten as a `LEFT JOIN` simply by swapping the order of the tables in the `FROM` clause.

```sql
-- ❌ Harder to read (mental gymnastics required)
SELECT * FROM Employees e RIGHT JOIN Departments d ON e.dept_id = d.id;

-- ✅ Clean, standard, universally preferred
SELECT * FROM Departments d LEFT JOIN Employees e ON d.id = e.dept_id;
```
*Both queries return the exact same data, but the bottom one makes it immediately obvious that `Departments` is the primary table we care about.*

---

## 📊 6. Comparison Table

| Aspect | INNER JOIN | LEFT JOIN | RIGHT JOIN |
|--------|-----------|-----------|------------|
| Unmatched left rows | ❌ Excluded | ✅ Included (`NULL`-padded) | ❌ Excluded |
| Unmatched right rows | ❌ Excluded | ❌ Excluded | ✅ Included (`NULL`-padded) |
| Use case | "Show me only matches" | "Show ALL from primary table" | "Show ALL from secondary table" |
| Readability | Standard | Excellent | Poor (Avoid if possible) |

---

## 🔥 Interview Gold Statement

> *"An INNER JOIN acts as a strict intersection, filtering out orphan records from both tables. Outer joins, like LEFT and RIGHT JOIN, preserve all records from one side of the join, injecting NULLs for missing relationships. While RIGHT JOIN is functionally identical to a LEFT JOIN with the table order reversed, it is a universal best practice to avoid RIGHT JOINs in production code. Standardizing exclusively on LEFT JOINs ensures that queries are always read top-to-bottom and left-to-right, making complex, multi-table queries significantly easier for other engineers to parse and maintain."*
