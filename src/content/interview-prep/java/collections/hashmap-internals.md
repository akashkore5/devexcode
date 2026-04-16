---
title: "Internal Working of HashMap: Hashing, Buckets and RB-Trees"
category: "collections"
date: "2024-04-16"
difficulty: "Advanced"
tags: ["HashMap", "Hashing", "Collision", "Red-Black Tree"]
---

HashMap in Java works on the principle of **Hashing**. It implements the `Map` interface and allows `null` keys and values.

### 1. The Hashing Mechanism
When you perform a `put(K key, V value)`:
1.  **Hash Calculation**: The key's `hashCode()` is invoked. To reduce collision, Java applies an additional hash function: `(h = key.hashCode()) ^ (h >>> 16)`.
2.  **Index Generation**: The index is calculated using a bitwise AND operation: `index = (n - 1) & hash`, where `n` is the current capacity (power of 2).

### 2. Buckets and Collisions
HashMap uses an array of `Node<K,V>` (called buckets). When two different keys result in the same index, a **Hash Collision** occurs.

-   **Before Java 8**: Collisions were handled using a **Singly Linked List**. New entries were added to the end (or head, depending on version).
-   **Java 8 Optimization**: If the number of nodes in a bucket exceeds the `TREEIFY_THRESHOLD` (default 8) and the total capacity is at least 64, the Linked List is converted into a **Balanced Red-Black Tree**.
    -   **Search Performance**: Improves from $O(n)$ in Linked Lists to $O(\log n)$ in Trees.
    -   **Untreeify**: If entries are removed and the bucket count drops to 6, it converts back to a Linked List (`UNTREEIFY_THRESHOLD`).

### 3. Placing an Existing Key
What happens when you put a key that is already present?
-   HashMap iterates through the bucket at the calculated index.
-   It uses `(k.hashCode() == hash) && (key.equals(node.key))` to identify the match.
-   If a match is found, the **existing value is overwritten** by the new value, and the old value is returned.

### 4. Importance of Immortality & Methods
-   **Immutable Classes**: It is highly recommended to use **Immutable classes** (like `String` or `Integer`) as keys. If a key's fields change after it's put in the map, its `hashCode()` changes, making the entry unretrievable (lost in the map).
-   **hashCode() and equals()**:
    -   `hashCode()` determines **which bucket** the key goes into.
    -   `equals()` determines **which node** within that bucket is the correct match.
    -   **Contract**: If two objects are equal according to `equals()`, they **must** have the same `hashCode()`.

### 5. Resizing (Rehashing)
When the number of entries exceeds `capacity * loadFactor` (default 0.75), the array is doubled.
-   A new array is created.
-   **All existing data is copied** to the new array by recalculating indices. This is an $O(n)$ operation.
