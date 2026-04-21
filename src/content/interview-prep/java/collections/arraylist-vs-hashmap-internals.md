---
title: Internal working of ArrayList and HashMap.
category: collections
order: 1
status: not-started
tags: []
---
````markdown
# 🔹 ArrayList Internals (Deep Dive)

## 📌 1. Core Structure
- Backed by a **resizable array (`Object[] elementData`)**
- Maintains:
  - `size` → number of elements actually stored
  - `capacity` → length of internal array  

👉 **Invariant:** `capacity >= size`

---

## 📌 2. Growth Mechanism
When the internal array is full:

```java
newCapacity = oldCapacity + (oldCapacity >> 1); // ~1.5x growth
````

* Example growth: `10 → 15 → 22 → 33 → ...`
* Uses:

```java
Arrays.copyOf()
```

### ❗ Why 1.5x?

* Reduces frequent resizing (better performance)
* Avoids excessive unused memory (better space efficiency)

👉 Trade-off: **Time vs Space**

---

## 📌 3. Time Complexity

| Operation     | Complexity | Reason              |
| ------------- | ---------- | ------------------- |
| get(index)    | O(1)       | Direct array access |
| add(element)  | O(1)*      | Amortized           |
| add(index)    | O(n)       | Shifting elements   |
| remove(index) | O(n)       | Shifting elements   |
| search        | O(n)       | Linear scan         |

👉 `add()` is **amortized O(1)** due to occasional resizing.

---

## 📌 4. Key Characteristics

* Allows **null values**
* Maintains **insertion order**
* Not thread-safe (not synchronized)

---

## 📌 5. Hidden Costs

* Resizing → O(n) copy
* Insert/delete in middle → O(n)

👉 Best for:

* Read-heavy scenarios
* Frequent index-based access

---

# 🔹 HashMap Internals (Deep Dive)

## 📌 1. Core Structure

```java
Node<K,V>[] table;
```

Each bucket contains:

* Linked List (Java 7)
* Linked List + Red-Black Tree (Java 8+)

---

## 📌 2. Hashing Process

### Step 1: Get hash

```java
int hash = key.hashCode();
```

### Step 2: Improve distribution

```java
hash = hash ^ (hash >>> 16);
```

👉 Reduces collisions from poor `hashCode()` implementations

---

## 📌 3. Bucket Index Calculation

```java
index = (n - 1) & hash;
```

👉 Works because `n` is always a **power of 2**

---

## 📌 4. Collision Handling

### Before Java 8:

* Linked List → O(n)

### Java 8+:

* If bucket size ≥ 8 → **Red-Black Tree**
* If size < 6 → back to Linked List

👉 Improves worst-case performance:

* From **O(n)** → **O(log n)**

---

## 📌 5. Insertion Flow

1. Compute hash
2. Find bucket index
3. If empty → insert
4. If collision:

   * Traverse bucket
   * Use `equals()` to match keys
   * If key exists → overwrite value
   * Else → add new node

---

## 📌 6. Time Complexity

| Operation | Average | Worst Case |
| --------- | ------- | ---------- |
| get()     | O(1)    | O(log n)   |
| put()     | O(1)    | O(log n)   |
| remove()  | O(1)    | O(log n)   |

---

## 📌 7. Load Factor & Resizing

* Default load factor = **0.75**

Resize condition:

```java
size > capacity * loadFactor
```

* On resize → capacity doubles

---

## 📌 8. Key Rules

* Uses:

  * `hashCode()` → bucket selection
  * `equals()` → key comparison

👉 Both must be consistent

---

## 📌 9. Characteristics

* Allows:

  * One `null` key
  * Multiple `null` values
* No ordering guarantee
* Not thread-safe

---

# 🔥 Key Differences (Interview Summary)

| Feature    | ArrayList       | HashMap             |
| ---------- | --------------- | ------------------- |
| Structure  | Dynamic Array   | Array + Buckets     |
| Access     | By index        | By key              |
| Complexity | O(1) read       | O(1) average lookup |
| Ordering   | Maintained      | Not maintained      |
| Nulls      | Allowed         | 1 null key allowed  |
| Use Case   | Indexed storage | Key-value mapping   |

---

# ⚡ One-Line Interview Answer

> ArrayList provides fast index-based access using a dynamic array, while HashMap provides fast key-based lookup using hashing and bucket-based storage with collision handling.

```
```
