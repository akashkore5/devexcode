---
title: "Why ConcurrentModificationException occurs?"
category: "collections"
order: 15
status: "not-started"
tags: ["Exceptions", "Fail-Fast", "Iterators", "Concurrency"]
---

# 🔹 ConcurrentModificationException (Deep Dive, Interview-Ready)

The `ConcurrentModificationException` (CME) is one of the most common and misunderstood exceptions in Java. Despite its name containing the word "Concurrent," **it has very little to do with multi-threading.** You will frequently encounter it in a single-threaded environment.

---

## 📌 1. The Core Cause (Fail-Fast Iterators)

Standard Java collections (like `ArrayList`, `HashMap`, `HashSet`) use **Fail-Fast** iterators. 

These iterators are designed to throw a `ConcurrentModificationException` the moment they detect that the underlying collection has been structurally modified (an element was added or removed) *while* the iteration was in progress.

### 🔸 The `modCount` Mechanism
How does the iterator know the list was modified?
1. Every standard collection maintains an internal integer variable called `modCount` (Modification Count).
2. Every time you call `list.add()` or `list.remove()`, `modCount` is incremented.
3. When you create an Iterator (or use an enhanced `for-each` loop), the iterator saves the current `modCount` into its own `expectedModCount` variable.
4. On every single loop iteration (`iterator.next()`), it checks: `if (modCount != expectedModCount)`.
5. If they don't match, it throws `ConcurrentModificationException` immediately.

---

## 📌 2. The Trap (Single-Threaded CME)

The most common way developers trigger this is by trying to remove an element from a list while looping through it using a `for-each` loop.

```java
List<String> names = new ArrayList<>(Arrays.asList("Alice", "Bob", "Charlie"));

// ❌ THE TRAP: This will throw ConcurrentModificationException
for (String name : names) {
    if (name.equals("Bob")) {
        names.remove(name); // Modifies the list directly! modCount changes.
    }
}
```
*Why it fails:* The `for-each` loop secretly creates an `Iterator` under the hood. When `names.remove()` is called, the list's `modCount` goes up. On the next pass of the loop, the secret Iterator notices the mismatch and crashes.

---

## 📌 3. How to safely avoid it

### ✅ 1. Use `Iterator.remove()` (Pre-Java 8)
If you must iterate and remove, use an explicit Iterator. The Iterator's own `remove()` method safely removes the item from the list *and* updates its internal `expectedModCount` to match the new `modCount`.

```java
Iterator<String> iterator = names.iterator();
while (iterator.hasNext()) {
    String name = iterator.next();
    if (name.equals("Bob")) {
        iterator.remove(); // ✅ Safe structural modification
    }
}
```

### ✅ 2. Use `removeIf()` (Java 8+)
This is the modern, declarative, and highly optimized way to remove elements based on a condition.
```java
names.removeIf(name -> name.equals("Bob")); // ✅ Clean and Safe
```

### ✅ 3. Use Fail-Safe (Concurrent) Collections
If you are actually in a multi-threaded environment where Thread A is reading and Thread B is writing, you must use **Fail-Safe** collections like `CopyOnWriteArrayList` or `ConcurrentHashMap`.
Fail-safe iterators do not use `modCount`. They iterate over a clone (or a snapshot) of the underlying array, meaning they will never throw a CME.

---

## 🔥 Interview Gold Statement

> *"The `ConcurrentModificationException` primarily occurs when a collection is structurally modified while a Fail-Fast iterator is traversing it. This happens because the iterator's expected `modCount` no longer matches the collection's actual `modCount`. Despite its name, this frequently happens in single-threaded code when developers mistakenly use `list.remove()` inside a `for-each` loop. To fix this, we should either use the `Iterator`'s own `remove()` method, utilize Java 8's `removeIf()`, or—if it is a genuine multi-threading issue—switch to a Fail-Safe collection like `CopyOnWriteArrayList`."*

---

## ⚡ Final Verdict

* ✅ **Use `removeIf()`** to safely delete items conditionally in modern Java.
* ❌ **Never use `list.remove()`** inside an enhanced `for-each` loop.
