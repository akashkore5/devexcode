---
title: "Internal Working: TreeMap vs HashMap"
category: "collections"
order: 6
status: "not-started"
tags: ["TreeMap", "HashMap", "Collections", "Red-Black Tree", "Hashing"]
---

# 🔹 TreeMap vs HashMap Internals (Deep Dive, Interview-Ready)

While both **TreeMap** and **HashMap** are used to store key-value pairs, their internal architectures are fundamentally different. **HashMap** relies on the magic of Hashing for blistering speed, whereas **TreeMap** relies on a Red-Black Tree to keep elements perfectly sorted.

---

## 📌 1. Core Difference (One-Liner)

> **HashMap uses an array of buckets (with LinkedLists/Red-Black Trees for collisions) to achieve O(1) performance without ordering, whereas TreeMap uses a Red-Black Tree to maintain keys in a sorted order, resulting in O(log N) performance.**

---

## 📊 2. Detailed Comparison

| Feature | HashMap | TreeMap |
| :--- | :--- | :--- |
| **Internal Data Structure** | Hash Table (Array + LinkedList/RB-Tree) | Red-Black Tree (Self-balancing BST) |
| **Ordering Guarantee** | ❌ None (Random order) | ✅ Sorted (Natural order or `Comparator`) |
| **Time Complexity (get/put)** | **O(1)** (Amortized average) | **O(log N)** (Guaranteed) |
| **Null Key Support** | ✅ Allowed (Max 1 null key) | ❌ Not Allowed (Throws `NullPointerException`) |
| **Null Value Support** | ✅ Allowed | ✅ Allowed |
| **Memory Overhead** | High (Array sizing + Node objects) | Very High (Nodes + Tree Pointers + Color bits) |
| **Interfaces Implemented** | `Map`, `Cloneable`, `Serializable` | `Map`, `SortedMap`, `NavigableMap`, `Cloneable` |

---

## 📌 3. Internal Working of HashMap

### 🔸 Architecture
* Internally, HashMap uses an array of `Node<K,V>[] table`.
* When you call `put(key, value)`, it calculates the hash of the key: `hash(key)`.
* It uses a bitwise AND operation `(n - 1) & hash` to determine the exact index (bucket) in the array.

### 🔸 Handling Collisions
* If two keys hash to the same bucket, it forms a **LinkedList**.
* **Java 8 Optimization:** If the LinkedList size crosses a threshold (default 8) and the map capacity is at least 64, the LinkedList converts into a **Red-Black Tree**, improving collision search time from O(N) to O(log N).

### 🔸 Resizing
* When the map gets too full (defined by the `loadFactor`, default `0.75`), HashMap creates a new array double the size and **rehashes** all existing elements.

---

## 📌 4. Internal Working of TreeMap

### 🔸 Architecture
* TreeMap implements a **Red-Black Tree**. A Red-Black Tree is a self-balancing Binary Search Tree (BST).
* Internally, it uses an `Entry<K,V>` object that holds:
  ```java
  K key;
  V value;
  Entry<K,V> left;
  Entry<K,V> right;
  Entry<K,V> parent;
  boolean color; // Red or Black
  ```

### 🔸 Insertion & Sorting
* When you call `put(key, value)`, TreeMap compares the new key with the root node's key using the key's `compareTo()` method (or a provided `Comparator`).
* It navigates left (if smaller) or right (if larger) until it finds an empty spot to insert the new node.
* **Balancing:** After insertion, the tree checks the Red-Black properties. If violated, it performs **color flips** and **tree rotations** (Left/Right rotate) to ensure the tree remains perfectly balanced, guaranteeing O(log N) depth.

---

## 📌 5. The "Null Key" Problem

### 🔸 Why does TreeMap throw NPE for Null keys?
To place an element in a Binary Search Tree, TreeMap **must compare** the incoming key against existing keys.
If you do `put(null, "Value")`, TreeMap tries to call `null.compareTo(existingKey)`. This instantly triggers a `NullPointerException`. 

### 🔸 Why can HashMap handle Null keys?
HashMap doesn't compare keys to find a bucket; it hashes them. HashMap has a hardcoded check:
```java
static final int hash(Object key) {
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```
If the key is null, it skips hashing and just drops it into bucket `0`.

---

## 📌 6. When to use which?

### ✅ Use HashMap when:
* You need **maximum performance** (O(1) lookups).
* You just need to store and retrieve data and **do not care about the order** of the keys.
* You are building caches or standard look-up dictionaries.

### ✅ Use TreeMap when:
* You specifically need to retrieve keys in **sorted order** (e.g., alphabetical order, chronological order).
* You need to perform **range queries** (e.g., "Give me all users between IDs 100 and 500"). TreeMap provides methods like `subMap()`, `headMap()`, and `tailMap()` via the `NavigableMap` interface.

---

## 🔥 Interview Gold Statement

> *"HashMap provides blistering O(1) performance using an array of hash buckets and handles collisions via LinkedLists or Red-Black Trees in Java 8+. However, it guarantees no ordering. TreeMap sacrifices O(1) speed for O(log N) performance by maintaining a fully self-balancing Red-Black Tree, making it the perfect choice only when sorted traversal or range queries are strictly required."*

---

## ⚡ Final Verdict

* ✅ **Use `HashMap`** 95% of the time for pure speed.
* 🎯 **Use `TreeMap`** only when you need sorting or range operations.
