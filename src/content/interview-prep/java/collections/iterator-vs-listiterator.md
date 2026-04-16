---
title: "Iterator vs ListIterator: Bi-directional Traversal and Mod"
category: "collections"
date: "2024-04-16"
difficulty: "Beginner"
tags: ["Traversal", "Iterator", "API"]
---

Java provides several ways to traverse collections, but `Iterator` and `ListIterator` are the most fundamental.

### 1. The Core Difference
-   **Iterator**: Can be used with any `Collection` (Set, List, Queue). Only supports forward traversal.
-   **ListIterator**: Only for `List` implementations. Supports both forward and backward traversal.

### 2. Method Comparison
| Feature | Iterator | ListIterator |
| :--- | :--- | :--- |
| **Direction** | Only Forward | Bi-directional |
| **Modification** | Supports `remove()` | Supports `remove()`, `add()`, `set()` |
| **Index Access** | No | Yes (`nextIndex()`, `previousIndex()`) |

### 3. The remove() Difference
A frequent interview question is the difference between `Collection.remove()` and `Iterator.remove()` during iteration:
-   **Collection.remove()**: If you call `list.remove(obj)` while iterating with a for-each loop or an iterator, it will throw a **ConcurrentModificationException**. This is because the collection structure changed, but the iterator's internal "expected mod count" wasn't updated.
-   **Iterator.remove()**: This is the **only safe way** to remove an element during iteration. It removes the element from the underlying collection and updates the iterator's own state to stay in sync.

### 4. Why ListIterator has add() but Iterator does not?
`ListIterator` is specifically designed for `List` (ordered sequence). Adding an element to a list has a clear "before" or "after" context based on the current cursor. In a generic `Collection` (like a `Set`), the order is not defined, so "adding at the current position" has no consistent meaning.
