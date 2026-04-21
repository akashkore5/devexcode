---
title: "Internal Working of HashMap: Hashing, Buckets and RB-Trees"
category: "collections"
order: 16
status: "not-started"
tags: ["HashMap", "Hashing", "Collision", "Red-Black Tree", "Java 8"]
---

# 🔹 HashMap Internals (Deep Dive, Interview-Ready)

"How does a HashMap work internally?" is arguably the most frequently asked question in Java interviews. A surface-level answer ("it uses an array and a linked list") is no longer enough. You must understand hashing math, Java 8 treeification, and the `equals()`/`hashCode()` contract.

---

## 📌 1. The Core Data Structure

Internally, `HashMap` uses an array of `Node<K,V>` objects. This array is referred to as the **table**, and each index in the array is called a **bucket**.

```java
// Simplified internal representation
transient Node<K,V>[] table;

static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next; // Pointer to the next node (Linked List)
}
```

---

## 📌 2. The `put(K, V)` Workflow

When you call `map.put("Alice", 25)`, a fascinating sequence of events occurs:

### 🔸 Step 1: Calculate the Hash
Java calls `"Alice".hashCode()`. However, standard hash codes can be poorly distributed. To prevent clustering, Java applies a bitwise XOR to spread higher bits into lower bits:
```java
// Java's internal hash smoothing
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

### 🔸 Step 2: Determine the Bucket Index
Instead of using expensive modulo math (`hash % n`), Java uses a lightning-fast bitwise AND operation (which is why the array size `n` MUST be a power of 2):
```java
// n is the capacity of the array (e.g., 16)
index = (n - 1) & hash;
```

### 🔸 Step 3: Placement & Collisions
HashMap looks at the calculated `index` in the array.
* **Empty Bucket:** If there's no node there, it places the new `Node` directly into the array.
* **Collision:** If a node already exists there, a **Hash Collision** has occurred.
    * It checks if the keys are identical using `(k.hashCode() == hash) && (key.equals(node.key))`.
    * **Match Found:** It overwrites the old value with the new value.
    * **No Match:** It attaches the new node to the end of the chain.

---

## 📌 3. The Java 8 Optimization (Treeification)

Prior to Java 8, if many keys mapped to the same bucket, the linked list would grow huge, degrading `get()` performance from **$O(1)$ to $O(n)$**.

In Java 8, if a bucket's linked list grows beyond the `TREEIFY_THRESHOLD` (default **8** nodes) and the overall array capacity is at least 64, HashMap transforms the Linked List into a **Balanced Red-Black Tree**.

* **Search Performance:** Improves from $O(n)$ down to **$O(\log n)$**.
* **Untreeify:** If elements are removed and the bucket drops to 6 nodes (`UNTREEIFY_THRESHOLD`), it reverts to a standard Linked List to save memory.

---

## 📌 4. The Load Factor and Rehashing

An array cannot hold infinite items efficiently. 
* **Capacity:** Default is 16.
* **Load Factor:** Default is 0.75.

When the map reaches **75% capacity** (12 items), it triggers a **Rehash**.
1. The array capacity is **doubled** (to 32).
2. The index for *every single node* is recalculated using the new `n - 1` bitmask.
3. All nodes are moved to the new array.

👉 **Interview Tip:** Rehashing is extremely expensive ($O(n)$). If you know you are adding 10,000 items, initialize the map with a large capacity to prevent automatic rehashing: `new HashMap<>(14000);`.

---

## 📌 5. The Contract of `hashCode()` and `equals()`

You cannot master HashMap without understanding this contract for Custom Objects used as Keys:

1. **Bucket Finding:** `hashCode()` is used to find the correct bucket.
2. **Key Matching:** `equals()` is used to verify the exact key inside that bucket.

**The Golden Rule:** *If two objects are equal according to `equals()`, they MUST return the same `hashCode()`.*

If you break this rule, you might put a key in the map, but never be able to retrieve it again because the map looks in the wrong bucket!

### 🔸 Why Keys should be Immutable
Never use a mutable object as a Key. If you modify a field that is part of the `hashCode()` calculation *after* putting it in the map, its hash changes. The HashMap will look in bucket 5, but the object is stranded in bucket 12. The data is lost. Always use immutable keys like `String` or `Integer`.

---

## 🔥 Interview Gold Statement

> *"Internally, a HashMap is an array of Node buckets. When `put` is called, it applies a bitwise XOR to the key's `hashCode()` to prevent clustering, then calculates the array index using a bitwise AND operation. If a collision occurs, it forms a Linked List. However, to prevent worst-case $O(n)$ degradation, Java 8 introduced Treeification—converting lists into Red-Black Trees when a bucket exceeds 8 nodes, restoring $O(\log n)$ performance. Because hash maps rely entirely on this math, keys should always be immutable, and if you override `equals()`, you must strictly override `hashCode()` to match."*
