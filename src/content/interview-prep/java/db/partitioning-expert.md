---
title: "Advanced Partitioning (Sub-partitioning, Indexing, Composite Keys)"
category: "db"
order: 31
---

### 1. How to manage indexes on partitioned tables?
- **Global Index**: A single index for the entire table. Harder to maintain if you drop a partition (requires index rebuild).
- **Local Index**: The index is partitioned exactly like the data. Dropping a partition automatically handles its index slice. Highly recommended for performance.

### 2. What is Sub-partitioning?
Sub-partitioning (Composite Partitioning) is a method of further dividing each partition.
- **Example**: First partition by **Range** (Year), then sub-partition by **Hash** (Department ID).
- **Benefit**: Evenly distributes data across clusters and allows for more granular pruning.

### 3. Implementing partitioning with Composite Keys
You can use multiple columns in the partition key.
```sql
PARTITION BY RANGE (year_col, month_col) (
    PARTITION p2023_01 VALUES LESS THAN (2023, 02),
    PARTITION p2023_02 VALUES LESS THAN (2023, 03)
);
```
Useful when data is naturally ordered by multiple dimensions.
