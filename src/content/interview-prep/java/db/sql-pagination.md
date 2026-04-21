---
title: "How to implement pagination in SQL?"
category: "db"
order: 34
status: "not-started"
tags: ["SQL", "Pagination", "Performance", "Optimization"]
---

# 🔹 SQL Pagination: Offset vs Keyset (Deep Dive, Interview-Ready)

"How do you implement pagination?" is a question designed to test your understanding of database performance at scale. The naive answer is `OFFSET/LIMIT`. The senior engineer answer revolves around **Keyset (Cursor-based) Pagination**.

---

## 📌 1. The Naive Approach: OFFSET / LIMIT

This is the standard pagination technique taught in tutorials. You specify how many rows you want (`LIMIT`) and how many rows to skip (`OFFSET`).

**MySQL / PostgreSQL Syntax:**
```sql
-- Page 1 (Rows 1-10)
SELECT * FROM Employees ORDER BY id LIMIT 10 OFFSET 0;

-- Page 3 (Rows 21-30)
SELECT * FROM Employees ORDER BY id LIMIT 10 OFFSET 20;
```

**SQL Server / Oracle 12c+ Syntax:**
```sql
SELECT * FROM Employees ORDER BY id 
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;
```

### 🔸 The "Deep Offset" Performance Trap
`OFFSET` is incredibly inefficient at scale. 
If you run `LIMIT 10 OFFSET 1000000;`, the database **does not** magically jump to the 1,000,000th row. It literally scans, counts, and discards the first one million rows just to return the next 10. As a user clicks deeper into the pages, the query gets slower and slower until the database grinds to a halt.

---

## 📌 2. The Enterprise Approach: Keyset Pagination (Cursor)

To solve the Deep Offset trap, enterprise applications use **Keyset Pagination** (also known as Cursor-based Pagination). Instead of telling the database "Skip 10,000 rows," you tell the database "Give me the next 10 rows that come *after* the last row I saw."

```sql
-- Assuming the last Employee ID seen on Page 2 was 1520:
SELECT * FROM Employees 
WHERE id > 1520 
ORDER BY id ASC 
LIMIT 10;
```

### 🔸 Why is this so much faster?
It leverages the **Clustered Index**. The database engine performs an index seek directly to `ID = 1520` (an $O(\log N)$ operation) and then simply reads the next 10 rows. It doesn't matter if you are on Page 1 or Page 100,000; the query executes in exactly the same blazing-fast time ($O(1)$ effectively for the read).

### 🔸 The Trade-offs of Keyset Pagination
* **No "Jump to Page X":** You cannot provide users with a `[1] [2] ... [99] [100]` navigation bar. You can only provide `[Next]` and `[Previous]` buttons or an "Infinite Scroll" UI, because you don't know the specific `id` of page 99 until you read page 98.
* **Complex sorting:** It becomes much harder if you want to sort by a non-unique column (like `Last_Name`), because you must break ties using a secondary unique column (like `ID`) to ensure you don't miss or duplicate rows between pages.

---

## 🔥 Interview Gold Statement

> *"There are two primary ways to paginate in SQL: Offset-based and Keyset-based. Offset-based pagination using `LIMIT/OFFSET` is easy to implement but falls into the 'Deep Offset' trap at scale; the database must physically scan and discard all preceding rows, causing linear performance degradation as the user navigates deeper. For large, production-grade datasets, we implement Keyset (or Cursor-based) pagination. By caching the last primary key seen on the client and querying `WHERE id > last_seen_id LIMIT 10`, the database can perform an instant $O(\log N)$ index seek. While it restricts the UI to 'Next/Prev' buttons or infinite scrolling, it guarantees consistent, sub-millisecond performance regardless of page depth."*
