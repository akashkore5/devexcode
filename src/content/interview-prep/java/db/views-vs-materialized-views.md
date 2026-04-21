---
title: "View vs Materialized View"
category: "db"
order: 21
status: "not-started"
tags: ["SQL", "Views", "Performance", "Data Warehousing"]
---

# 🔹 Standard Views vs Materialized Views (Deep Dive, Interview-Ready)

A standard View and a Materialized View serve completely different architectural purposes. A standard view is designed for **developer convenience and security**, while a Materialized View is designed exclusively for **read performance**.

---

## 📌 1. Standard View (The "Virtual Table")

A standard View is essentially a saved SQL query. It does **not** store any physical data on the hard drive. 

When you run `SELECT * FROM MyView`, the database engine looks at the underlying SQL query that defines the view, executes that query against the live base tables, and returns the result.

### 🔸 Primary Use Cases:
1. **Simplifying Complexity:** If you have a massive query joining 7 tables that developers need to run constantly, you can save it as a view. Developers can then just write `SELECT * FROM DailySalesView` instead of rewriting the 7-table join.
2. **Security & Abstraction:** You can grant a user `SELECT` permissions on a view, but deny them access to the underlying base tables. For example, an `EmployeeView` might expose `name` and `department`, but intentionally exclude the `salary` column from the base table.

### 🔸 Performance:
A standard view is **not** faster than writing out the raw query. Because it executes in real-time, if the underlying 7-table join takes 10 seconds to run, querying the view will also take 10 seconds.

---

## 📌 2. Materialized View (The Physical Snapshot)

A Materialized View is a physical table that actually stores the *results* of the query on the hard drive. 

When you run `SELECT * FROM MyMaterializedView`, the database does not touch the base tables. It simply reads the pre-calculated, physically stored data.

### 🔸 Primary Use Cases:
1. **Data Warehousing & Dashboards:** If your CEO's dashboard requires calculating the total revenue across 50 million rows, you don't want to calculate that on-the-fly every time they open the app. You calculate it once overnight, store it in a Materialized View, and the dashboard loads instantly.

### 🔸 Performance:
Materialized Views are incredibly fast for read operations because the heavy lifting (joins, aggregations, sorting) has already been done. 

### 🔸 The Catch: Data Staleness (Refreshing)
Because the data is stored physically, it becomes "stale" the moment the base tables change. If a new sale is made, the Materialized View doesn't automatically know about it. 
You have to define a **Refresh Strategy**:
* **On Demand:** `REFRESH MATERIALIZED VIEW my_view;` (Triggered manually or via a CRON job overnight).
* **On Commit:** Refreshes automatically when the underlying tables change (can cause write-performance issues if updated too frequently).

---

## 📊 3. Summary Comparison

| Feature | Standard View | Materialized View |
| :--- | :--- | :--- |
| **Physical Storage** | No (Virtual) | Yes (Stores actual data) |
| **Data Freshness** | Always 100% up-to-date (Real-time) | Can be stale (Depends on refresh schedule) |
| **Performance** | Slower (Executes query at runtime) | Extremely Fast (Reads pre-computed data) |
| **Primary Goal** | Abstraction, Security, Convenience | Raw Read Performance, Analytics |

---

## 🔥 Interview Gold Statement

> *"A Standard View is a logical abstraction—a saved query that executes against the live base tables every time it is called. It consumes no physical storage and is primarily used to simplify complex queries or restrict data access for security purposes. A Materialized View, conversely, is a physical manifestation of a query's result set stored on disk. It is used in analytical or heavy-read environments where calculating massive joins or aggregations on-the-fly is too expensive. The trade-off is data staleness; Materialized Views require a strategic refresh policy (such as a nightly CRON job) to keep their physical data in sync with the live transaction tables."*
