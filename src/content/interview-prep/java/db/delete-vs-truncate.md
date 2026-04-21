---
title: "DELETE vs TRUNCATE"
category: "db"
order: 1
status: "not-started"
tags: ["SQL", "DML vs DDL", "Performance", "Transactions"]
---

# 🔹 DELETE vs TRUNCATE (Deep Dive, Interview-Ready)

"What is the difference between DELETE and TRUNCATE?" is one of the most frequently asked database questions. A junior developer will simply say one uses a `WHERE` clause and the other doesn't. A senior developer will explain how they interact with transaction logs, page allocations, and database locks.

---

## 📌 1. The Core Differences

### 🔸 DELETE (Data Manipulation Language - DML)
The `DELETE` command is used to remove rows one by one. 
Because it is a DML operation, the database engine treats it as a standard data transaction.
* **Granularity:** You can use a `WHERE` clause to filter exactly which rows to delete.
* **Transaction Logging:** It logs **every single row** that is deleted in the transaction log. This makes it slow for massive tables, but entirely safe.
* **Triggers:** It will fire any `AFTER DELETE` triggers defined on the table.

```sql
-- Deletes only specific rows. Highly logged.
DELETE FROM Employees WHERE department = 'Sales';
```

### 🔸 TRUNCATE (Data Definition Language - DDL)
The `TRUNCATE` command is used to quickly wipe an entire table clean.
Because it is a DDL operation (in most SQL dialects like SQL Server and MySQL), it operates structurally rather than row-by-row.
* **Granularity:** You **cannot** use a `WHERE` clause. It wipes the whole table.
* **Transaction Logging:** It does not log individual row deletions. Instead, it logs the **deallocation of the data pages** where the table's data resides. 
* **Triggers:** It does **not** fire `DELETE` triggers.

```sql
-- Wipes the entire table instantly by deallocating memory pages.
TRUNCATE TABLE Employees;
```

---

## 📌 2. Performance and Internal Mechanics

Why is `TRUNCATE` so much faster than `DELETE`?

When you run `DELETE FROM TableName;` (without a `WHERE` clause), the DB engine scans every single row, copies its data to the transaction log (so it can be rolled back if needed), and then marks the row as deleted. If you have 10 million rows, that is 10 million individual log entries.

When you run `TRUNCATE TABLE TableName;`, the DB engine ignores the rows entirely. It simply goes to the internal allocation map and marks the memory pages assigned to that table as "empty and available for reuse." It only logs the page deallocations. Dropping 10 million rows takes milliseconds.

---

## 📌 3. Rollbacks and Auto-Increment

### Can you ROLLBACK a TRUNCATE?
A common myth is that `TRUNCATE` cannot be rolled back. **This is false in most modern databases (like SQL Server and PostgreSQL).** 
If `TRUNCATE` is executed inside an explicit transaction block (`BEGIN TRAN ... COMMIT`), you absolutely can roll it back. The database simply cancels the page deallocation. (Note: Oracle is a notable exception where TRUNCATE auto-commits and cannot be rolled back).

### Identity / Auto-Increment Reset
* **DELETE**: Does not reset the auto-incrementing identity column. If the last ID was 100, the next inserted row will be 101.
* **TRUNCATE**: Resets the identity column back to its seed value (usually 1). 

---

## 📊 4. Summary Comparison

| Feature | DELETE | TRUNCATE |
| :--- | :--- | :--- |
| **Command Type** | DML (Data Manipulation Language) | DDL (Data Definition Language) |
| **Filtering** | Supports `WHERE` clause | No `WHERE` clause (All or nothing) |
| **Performance** | Slow (Logs every single row) | Extremely Fast (Deallocates data pages) |
| **Triggers** | Fires `DELETE` triggers | Does **NOT** fire triggers |
| **Auto-Increment**| Continues from the last value | Resets to the initial seed value |
| **Table Locks** | Locks rows (Row-level lock) | Locks the entire table (Table-level lock) |

---

## 🔥 Interview Gold Statement

> *"While both commands remove data, they operate at completely different architectural levels. `DELETE` is a DML command that operates row-by-row, recording every deletion in the transaction log, which makes it safe but slow for large datasets. It also respects constraints and fires triggers. `TRUNCATE`, on the other hand, is a DDL command that removes data by deallocating the actual data pages in memory, logging only the page deallocation. This makes `TRUNCATE` exponentially faster for wiping entire tables, though it resets identity columns and bypasses standard DELETE triggers."*
