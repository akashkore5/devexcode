---
title: "Advanced Partitioning (Sub-partitioning, Indexes)"
category: "db"
order: 31
status: "not-started"
tags: ["SQL", "Partitioning", "Architecture", "Optimization"]
---

# 🔹 Advanced Partitioning Concepts (Deep Dive, Interview-Ready)

If you successfully explain Horizontal vs Vertical partitioning, a senior-level interviewer will push you deeper. They want to know if you understand how partitioning interacts with indexes, and how to handle extremely complex, multi-dimensional data sets.

---

## 📌 1. Managing Indexes on Partitioned Tables

When you partition a massive table (e.g., splitting a 500 million row `Logs` table into 12 monthly partitions), what happens to the B-Tree indexes? You have two architectural choices:

### 🔸 Global Indexes
A Global Index is a single, monolithic index that covers the entire table, ignoring the partition boundaries.
* **The Problem:** If you decide to drop old data (e.g., `ALTER TABLE DROP PARTITION Jan_2020`), the single Global Index becomes corrupted ("unusable") because it contains pointers to physical rows that no longer exist. You are forced to trigger a massive, locking Index Rebuild across the entire 500 million row table, destroying performance.

### 🔸 Local Indexes (Best Practice)
A Local Index is partitioned *exactly* like the underlying data. If you have 12 monthly data partitions, you get 12 isolated monthly indexes.
* **The Solution:** If you drop the `Jan_2020` data partition, the database simply drops the `Jan_2020` index partition along with it. The other 11 indexes are completely untouched. This makes data archiving instant and painless.

---

## 📌 2. Sub-partitioning (Composite Partitioning)

Sometimes, partitioning by a single column isn't enough to prevent bottlenecks. **Sub-partitioning** allows you to divide a table, and then divide those divisions again using a different strategy.

### 🔸 The Scenario
You have a global SaaS application. You first partition by **Range (Date)** so you can easily drop old data. However, the current month's partition is still taking all the read/write load and causing a bottleneck.

### 🔸 The Solution
You apply a secondary **Hash** sub-partitioning strategy.
1. **Primary Partition:** Range (By Month).
2. **Sub-partition:** Hash (By Customer_ID) into 4 buckets.

Now, instead of one massive `May_2025` partition, you have four distinct physical partitions for `May_2025`, seamlessly distributing the disk I/O load across multiple storage arrays while keeping the date-based archiving strategy intact.

---

## 📌 3. Composite Partition Keys

Instead of sub-partitioning, you can simply use multiple columns to define the boundaries of a single partition. This is crucial when data is naturally ordered by a multi-part hierarchy.

```sql
PARTITION BY RANGE (year_col, month_col) (
    PARTITION p2023_01 VALUES LESS THAN (2023, 02),
    PARTITION p2023_02 VALUES LESS THAN (2023, 03)
);
```
In this scenario, the database engine evaluates both columns sequentially to determine the physical boundary of the data. 

---

## 🔥 Interview Gold Statement

> *"In enterprise environments, simply horizontally partitioning a table is only half the battle; managing the indexes is just as critical. I strongly prefer Local Indexes over Global Indexes on partitioned tables, as Local Indexes allow you to drop or archive old data partitions instantly without invalidating a monolithic global index. Furthermore, for extremely high-throughput tables, I utilize Sub-partitioning—often ranging by date for easy archiving, and then sub-partitioning by a hash of the tenant ID. This distributes the hot-data I/O load evenly across physical storage arrays while maintaining the logical structure."*
