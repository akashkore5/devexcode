---
title: "Horizontal vs Vertical Partitioning"
category: "db"
order: 22
status: "not-started"
tags: ["SQL", "Partitioning", "Architecture", "Scaling"]
---

# 🔹 Horizontal vs Vertical Partitioning (Deep Dive, Interview-Ready)

As applications grow to millions of rows, single monolithic tables become a bottleneck. "Partitioning" is the architectural strategy of splitting a massive table into smaller, more manageable pieces. Interviewers ask this to test your understanding of database scaling techniques.

---

## 📌 1. Horizontal Partitioning (Sharding)

Horizontal partitioning splits a table by **rows**. You divide the data across multiple tables (or entirely different database instances) based on a specific logic or "Partition Key". 

If you split the data across physically different database servers, it is commonly referred to as **Sharding**.

### 🔸 The Scenario
You have an `Orders` table with 500 million rows. Queries are slowing down because the index is too large to fit in RAM.

### 🔸 The Solution
You partition the table by `Region`:
* **Table 1:** `Orders_US` (100 million rows)
* **Table 2:** `Orders_EU` (200 million rows)
* **Table 3:** `Orders_Asia` (200 million rows)

### 🔸 Pros & Cons
* **Benefit:** Massively reduces the index size per table. If a user in the EU searches their orders, the database only has to scan 200M rows instead of 500M. It distributes the I/O load.
* **Drawback:** Cross-partition queries become a nightmare. If the CEO wants the total global revenue, the application must query all three shards and aggregate the results in memory.

---

## 📌 2. Vertical Partitioning

Vertical partitioning splits a table by **columns**. You take a wide table with many columns and split it into two or more tables, linked by the same Primary Key.

### 🔸 The Scenario
You have a `Users` table with columns: `ID`, `Username`, `Email`, `PasswordHash`, `ProfilePicture_Blob`, and `User_Bio_Text`.
Every time a user logs in, the database pulls the user row into RAM to verify the password. Because the `ProfilePicture_Blob` and `User_Bio_Text` are massive, pulling the row consumes enormous amounts of memory, flushing out other useful data.

### 🔸 The Solution
You split the table vertically:
* **Table 1 (`Users_Core`):** `ID`, `Username`, `Email`, `PasswordHash`
* **Table 2 (`Users_Profile`):** `ID`, `ProfilePicture_Blob`, `User_Bio_Text`

### 🔸 Pros & Cons
* **Benefit:** Dramatically improves I/O performance and RAM utilization. The core table becomes "lean" and millions of rows can be cached in memory. You only query the heavy `Users_Profile` table when a user explicitly visits a profile page.
* **Drawback:** Requires joining the tables if a single feature happens to need data from both.

---

## 📊 3. Summary Comparison

| Aspect | Horizontal Partitioning (Sharding) | Vertical Partitioning |
| :--- | :--- | :--- |
| **How it splits** | By **Rows** (e.g., A-M in table 1, N-Z in table 2) | By **Columns** (e.g., Core data in table 1, heavy data in table 2) |
| **Primary Goal** | Reduce index size, distribute data across servers | Reduce row size, keep hot data in RAM, isolate heavy columns |
| **Common Use Case** | Multi-tenant SaaS apps, global region splitting | Isolating `BLOB`, `TEXT`, or rarely accessed columns |

---

## 🔥 Interview Gold Statement

> *"Partitioning is essential for scaling relational databases. **Horizontal Partitioning** (often called Sharding when distributed) splits a table by rows based on a partition key, such as Region or Date. This keeps indexes small and distributes read/write loads, though it makes cross-partition aggregations complex. **Vertical Partitioning** splits a table by columns. This is an incredible optimization for isolating heavy, rarely accessed data (like BLOBs or large text fields) from the core table. By doing so, the core table becomes much leaner, allowing the database to cache significantly more hot rows in RAM, drastically reducing disk I/O."*
