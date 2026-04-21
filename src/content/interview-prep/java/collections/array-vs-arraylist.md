---
title: "Array vs ArrayList: Which one is preferred?"
category: "collections"
order: 20
status: "not-started"
tags: ["Array", "ArrayList", "Collections", "Memory", "Performance"]
---

# 🔹 Array vs ArrayList (Deep Dive, Interview-Ready)

While **ArrayList** is backed by an **Array**, they are used in fundamentally different ways in Java. An Array is a low-level, fixed-size data structure baked into the Java language itself, whereas ArrayList is a dynamic, high-level class provided by the Java Collections Framework.

---

## 📌 1. Core Difference (One-Liner)

> **Arrays are fixed in size and can hold both primitives and objects for maximum raw performance, whereas ArrayLists are dynamically resizable, can only hold objects, and provide a rich API for data manipulation.**

---

## 📊 2. Detailed Comparison

| Feature | Array `[]` | ArrayList |
| :--- | :--- | :--- |
| **Size / Resizing** | Static (Fixed size upon creation) | Dynamic (Grows and shrinks automatically) |
| **Data Types** | Primitives (`int`, `double`) & Objects | Objects ONLY (No primitives, uses Wrappers) |
| **Memory Efficiency** | Very High (No object overhead for primitives) | Lower (Object overhead + wrapper classes) |
| **Performance** | Maximum raw speed | Slightly slower (Method calls + Autoboxing) |
| **Multi-dimensional** | Supported (`int[][]`) | Cumbersome (`ArrayList<ArrayList<Integer>>`) |
| **Generics Support** | ❌ Cannot create Generic Arrays (`T[]`) | ✅ Fully supports Generics (`ArrayList<T>`) |
| **Built-in API** | None (Relies on `java.util.Arrays`) | Massive (`add`, `remove`, `contains`, `sort`) |

---

## 📌 3. Primitives vs Wrappers (The Memory Cost)

The biggest performance difference between an Array and an ArrayList is how they handle **primitive types** (like `int`, `double`, `char`).

### 🔸 Standard Array (High Efficiency)
```java
int[] numbers = new int[100];
```
* **Memory:** This allocates exactly enough contiguous bytes to hold 100 integers (100 * 4 bytes = 400 bytes).
* **Speed:** Accessing `numbers[5]` is instantaneous.

### 🔸 ArrayList (The Autoboxing Cost)
```java
List<Integer> numbers = new ArrayList<>(100);
numbers.add(5); // Autoboxing occurs: Integer.valueOf(5)
```
* **Memory:** You are no longer storing primitive 4-byte integers. You are storing **references** (8 bytes) to `Integer` objects, which themselves have a 16-byte object header + 4 bytes of data. Total memory usage explodes compared to a raw array.
* **Speed:** Accessing `numbers.get(5)` requires fetching the reference, then following the reference to the heap to get the actual `Integer` object value.

---

## 📌 4. Generic Type Constraints

### 🔸 ArrayList handles Generics perfectly
```java
List<String> names = new ArrayList<>();
```
This guarantees compile-time type safety.

### 🔸 Arrays cannot be Generic
Because of **Type Erasure** in Java, you cannot instantiate an array with a generic type parameter.
```java
T[] arr = new T[10]; // ❌ Compilation Error: generic array creation
```
You must cast from an `Object[]` or pass the `.class` token, which is messy and error-prone.

---

## 📌 5. Built-in Functionality

### 🔸 Array (Barebones)
An array literally only has a `length` property. To do anything else, you must write loops or use the helper class `Arrays`.
```java
String[] arr = {"B", "A", "C"};
Arrays.sort(arr);
```

### 🔸 ArrayList (Feature Rich)
`ArrayList` provides dozens of built-in methods because it implements the `List` interface.
```java
ArrayList<String> list = new ArrayList<>();
list.add("A");
list.remove("A");
list.contains("A");
```

---

## 📌 6. When to use which?

### ✅ Use Arrays when:
* **Performance is absolutely critical** (e.g., game engines, mathematical computations, high-frequency trading).
* You are dealing strictly with **primitive types** and want to avoid the massive memory overhead of Autoboxing.
* You know the **exact size** of the data beforehand and it will never change.
* You are creating complex multi-dimensional data structures (e.g., a 2D grid for a game board).

### ✅ Use ArrayList when:
* You are building **99% of normal enterprise applications**.
* You need **dynamic resizing** (you don't know how many elements you will get).
* You need standard list operations (adding, removing, filtering, sorting).
* You are working with **Generics** and custom Objects.

---

## 🔥 Interview Gold Statement

> *"While an Array provides maximum raw performance and memory efficiency—especially for primitives—an ArrayList is overwhelmingly preferred in modern Java development. The dynamic resizing and rich Collections API of an ArrayList significantly reduce boilerplate code, making it the default choice unless there are extreme, measurable constraints on memory or CPU cycles."*

---

## ⚡ Final Verdict

* ✅ **Use `ArrayList`** as your daily driver for object collections.
* 🎯 **Use `Array`** only for primitives in performance-critical loops or fixed-size data matrices.
