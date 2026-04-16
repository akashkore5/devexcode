---
title: "ConcurrentHashMap: Segmentation vs CAS Locking"
category: "collections"
date: "2024-04-16"
difficulty: "Advanced"
tags: ["Concurrency", "Locking", "Scalability", "Internal"]
---

**ConcurrentHashMap** (CHM) was introduced in Java 5 as a thread-safe, high-performance alternative to `HashTable`.

### 1. Java 7 Approach: Segmentation
In Java 7, CHM was divided into multiple **Segments** (default 16).
-   **Locking Striping**: Each segment acted as an independent HashTable with its own lock.
-   **Concurrent Access**: 16 threads could theoretically write simultaneously if they accessed different segments.
-   **Drawback**: Heavy memory overhead due to multiple segment objects.

### 2. Java 8 Approach: Node-Level CAS (Modern)
Java 8 completely redesigned CHM to use **Compare-and-Swap (CAS)** and synchronized nodes.
-   **Bucket-Level Locking**: Instead of segments, CHM locks on the **first node** of each bucket.
-   **CAS Operations**: For empty buckets, CHM uses `Unsafe.compareAndSwapObject` to insert a node without any locking.
-   **Lazy Initialization**: The array table is initialized only on the first `put`.
-   **Scalability**: Significantly higher concurrency as it only locks the specific bucket being updated.

### 3. Comparing with HashTable and SynchronizedMap
| Feature | HashTable | SynchronizedMap | ConcurrentHashMap |
| :--- | :--- | :--- | :--- |
| **Locking** | Entire table (Global lock) | Entire Map object | Bucket/Node-level (local) |
| **Performance** | Low (Blocking) | Low (Blocking) | High (Non-blocking reads) |
| **Null Key/Value** | Not allowed | Depends on backing map | Not allowed |
| **Iteration** | Fail-fast | Fail-fast | **Fail-safe** (Weakly consistent) |

### 4. Why Nulls aren't allowed?
CHM doesn't allow `null` keys or values to avoid ambiguity in a concurrent environment. If `get(key)` returns `null`, you wouldn't know if the key is missing or if the value was explicitly set to `null` (since another thread could have deleted the key between `containsKey` and `get`).

### 5. ConcurrentModificationException
Unlike `HashMap` or `Vector`, ConcurrentHashMap's iterators are **fail-safe**. They work on a view of the table at the time the iterator was created and do not throw `ConcurrentModificationException` even if the map is modified during iteration.
