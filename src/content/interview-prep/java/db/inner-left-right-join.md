---
title: "INNER JOIN vs LEFT JOIN vs RIGHT JOIN: Complete Comparison"
category: "db"
order: 35
---

### Sample Data
```sql
-- employees                    -- departments
-- | id | name   | dept_id |   -- | id | dept_name   |
-- |----|--------|---------|   -- |----|-------------|
-- | 1  | Akash  | 10      |   -- | 10 | Engineering |
-- | 2  | Rahul  | 20      |   -- | 20 | Marketing   |
-- | 3  | Amit   | NULL    |   -- | 30 | Finance     |
-- | 4  | Ankit  | 10      |
```

### 1. INNER JOIN
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

### 2. LEFT JOIN (LEFT OUTER JOIN)
Returns **all rows from the left table** + matched rows from the right. Unmatched right columns are `NULL`.

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

> **Amit** is included with NULL department.
> **Finance** is still excluded (it's the right table).

### 3. RIGHT JOIN (RIGHT OUTER JOIN)
Returns **all rows from the right table** + matched rows from the left. Unmatched left columns are `NULL`.

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

> **Finance** is included with NULL employee name.
> **Amit** is excluded (he's in the left table with no match).

### Visual Summary
```
INNER JOIN:  Only the intersection (A ∩ B)
LEFT JOIN:   Everything from A + intersection with B
RIGHT JOIN:  Everything from B + intersection with A
FULL JOIN:   Everything from A + everything from B
```

### Comparison Table

| Aspect | INNER JOIN | LEFT JOIN | RIGHT JOIN |
|--------|-----------|-----------|------------|
| Unmatched left rows | ❌ Excluded | ✅ Included (NULL-padded) | ❌ Excluded |
| Unmatched right rows | ❌ Excluded | ❌ Excluded | ✅ Included (NULL-padded) |
| Use case | "Show me only matches" | "Show ALL from primary table" | "Show ALL from lookup table" |
| Performance | Usually fastest | Slightly slower | Same as LEFT (just reversed) |

### Practical Use Cases
- **INNER JOIN**: "Get all placed orders with customer details" (skip orphan records).
- **LEFT JOIN**: "Get ALL customers, even those who never placed an order" (NULL means no orders).
- **RIGHT JOIN**: "Get ALL products, even those never ordered" (rarely used — rewrite as LEFT JOIN by swapping table order).

### Pro Tip
> **RIGHT JOIN** can always be rewritten as a **LEFT JOIN** by swapping the table positions. Most teams standardize on LEFT JOIN for consistency and readability.

```sql
-- These are equivalent:
SELECT * FROM A RIGHT JOIN B ON A.id = B.a_id;
SELECT * FROM B LEFT JOIN A ON B.a_id = A.id;
```
