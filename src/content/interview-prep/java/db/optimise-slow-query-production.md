---
title: "How to Optimize a Slow SQL Query in Production: Step-by-Step"
category: "db"
order: 36
---

### Step 1: Identify the Slow Query
Before optimizing, find what's actually slow:

```sql
-- MySQL: Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;  -- Log queries taking > 1 second

-- PostgreSQL: Check pg_stat_statements
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Step 2: Use EXPLAIN / EXPLAIN ANALYZE
This is the **single most important tool** for query optimization.

```sql
EXPLAIN ANALYZE
SELECT o.id, c.name, o.amount
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.status = 'PENDING'
  AND o.created_at > '2026-01-01'
ORDER BY o.created_at DESC
LIMIT 100;
```

**What to look for in the output:**

| Red Flag | Meaning | Fix |
|----------|---------|-----|
| `type: ALL` | Full table scan | Add an index |
| `rows: 500000` | Scanning too many rows | Better WHERE clause or index |
| `Using filesort` | Sorting not using index | Add index on ORDER BY column |
| `Using temporary` | Temp table created | Simplify GROUP BY / DISTINCT |
| `Using where` (with no index) | Filtering after full scan | Add covering index |

### Step 3: Indexing — The Biggest Win

#### Add Indexes on Columns Used In:
```sql
-- WHERE clause columns
CREATE INDEX idx_orders_status ON orders(status);

-- JOIN columns
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- ORDER BY columns
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Composite index for multi-column WHERE (column order matters!)
CREATE INDEX idx_orders_status_created ON orders(status, created_at);
```

#### Composite Index Column Order Rule
```sql
-- Query: WHERE status = 'PENDING' AND created_at > '2026-01-01'

-- ✅ GOOD: Equality column FIRST, then range column
CREATE INDEX idx ON orders(status, created_at);

-- ❌ BAD: Range column first — status part won't be used efficiently
CREATE INDEX idx ON orders(created_at, status);
```

#### Covering Index (Index-Only Scan)
If the index contains ALL columns the query needs, the DB never reads the actual table:
```sql
-- Query only needs status, created_at, and amount
CREATE INDEX idx_covering ON orders(status, created_at, amount);
-- Now the DB serves the entire query from the index alone
```

### Step 4: Query Rewriting Techniques

#### Avoid SELECT *
```sql
-- ❌ Fetches all columns — more I/O, can't use covering index
SELECT * FROM orders WHERE status = 'PENDING';

-- ✅ Fetch only what you need
SELECT id, amount, created_at FROM orders WHERE status = 'PENDING';
```

#### Avoid Functions on Indexed Columns
```sql
-- ❌ Index on created_at is UNUSABLE (function wraps the column)
WHERE YEAR(created_at) = 2026

-- ✅ Rewrite as range — index is used
WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'
```

#### Avoid Leading Wildcards in LIKE
```sql
-- ❌ Full scan — index can't help with leading %
WHERE name LIKE '%akash%'

-- ✅ Index usable — prefix search
WHERE name LIKE 'akash%'

-- For full-text search, use dedicated engines (Elasticsearch, pg_trgm)
```

#### Replace Subqueries with JOINs
```sql
-- ❌ Correlated subquery — runs once PER ROW in outer query
SELECT * FROM orders o
WHERE o.customer_id IN (SELECT id FROM customers WHERE city = 'Mumbai');

-- ✅ JOIN — single execution
SELECT o.* FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE c.city = 'Mumbai';
```

#### Use EXISTS Instead of IN for Large Subsets
```sql
-- ❌ IN materializes the entire subquery result
WHERE id IN (SELECT order_id FROM payments WHERE status = 'FAILED')

-- ✅ EXISTS short-circuits — stops at first match
WHERE EXISTS (
    SELECT 1 FROM payments p 
    WHERE p.order_id = orders.id AND p.status = 'FAILED'
)
```

### Step 5: Pagination Optimization
```sql
-- ❌ OFFSET-based — DB still reads and discards 100,000 rows
SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 100000;

-- ✅ Keyset (cursor) pagination — seeks directly using index
SELECT * FROM orders WHERE id > 100000 ORDER BY id LIMIT 20;
```

### Step 6: Partitioning for Massive Tables
```sql
-- Partition by date range — queries on recent data only scan relevant partition
CREATE TABLE orders (
    id BIGINT,
    created_at DATE,
    amount DECIMAL
) PARTITION BY RANGE (created_at) (
    PARTITION p_2025 VALUES LESS THAN ('2026-01-01'),
    PARTITION p_2026 VALUES LESS THAN ('2027-01-01'),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

### Step 7: Caching Layer
For read-heavy queries that don't change frequently:

```java
// Spring Boot example — cache frequently accessed data
@Cacheable(value = "topProducts", key = "#category", unless = "#result.isEmpty()")
public List<Product> getTopProducts(String category) {
    return productRepo.findTopByCategory(category);
}
```

### Production Optimization Checklist

| # | Check | Impact |
|---|-------|--------|
| 1 | Run `EXPLAIN ANALYZE` on slow queries | 🔍 Diagnosis |
| 2 | Add indexes on WHERE, JOIN, ORDER BY columns | ⚡ 10x-100x faster |
| 3 | Use composite indexes (equality → range order) | ⚡ Major |
| 4 | Avoid `SELECT *` — select only needed columns | 🟡 Moderate |
| 5 | Avoid functions on indexed columns | ⚡ Major |
| 6 | Replace correlated subqueries with JOINs | ⚡ Major |
| 7 | Use keyset pagination instead of OFFSET | ⚡ Major at scale |
| 8 | Partition large tables (100M+ rows) | ⚡ Major |
| 9 | Add read replicas for heavy read workloads | 🟡 Infrastructure |
| 10 | Cache hot queries (Redis / Spring Cache) | ⚡ Eliminates DB hit |

> **Golden Rule**: Always measure before and after with `EXPLAIN ANALYZE`. An optimization without measurement is just a guess.
