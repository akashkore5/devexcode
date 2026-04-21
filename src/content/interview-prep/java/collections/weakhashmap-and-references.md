---
title: "WeakHashMap and Types of References"
category: "collections"
order: 12
status: "not-started"
tags: ["WeakHashMap", "Garbage Collection", "Memory Management", "References", "Collections"]
---

# 🔹 WeakHashMap & Reference Types (Deep Dive, Interview-Ready)

To understand `WeakHashMap`, you must first understand how Java's Garbage Collector (GC) interacts with different types of references. Most memory leaks in Java happen because developers unintentionally hold onto **Strong References**, preventing the GC from cleaning up objects. `WeakHashMap` solves this elegantly for caching scenarios.

---

## 📌 1. The Four Types of References in Java

Java provides four levels of reachability (references) in the `java.lang.ref` package, dictating how the Garbage Collector treats an object.

### 🔸 1. Strong Reference (Default)
This is the standard reference you use every day.
```java
Object obj = new Object(); // Strong reference
```
👉 **GC Behavior:** The GC will **never** reclaim an object as long as a strong reference points to it. If memory runs out, the JVM throws an `OutOfMemoryError` rather than collecting strongly referenced objects.

### 🔸 2. Soft Reference
Used heavily for caching.
```java
SoftReference<Object> softRef = new SoftReference<>(new Object());
```
👉 **GC Behavior:** The GC reclaims softly referenced objects **only if the JVM is desperately running out of memory**. Otherwise, it leaves them alone. Perfect for memory-sensitive caches.

### 🔸 3. Weak Reference
Used for mapping metadata to a primary object.
```java
WeakReference<Object> weakRef = new WeakReference<>(new Object());
```
👉 **GC Behavior:** The GC reclaims weakly referenced objects **eagerly at the very next garbage collection cycle**, assuming no strong references point to the object.

### 🔸 4. Phantom Reference
Extremely rare. Used for pre-mortem cleanup operations as a more flexible alternative to `finalize()`.
👉 **GC Behavior:** You cannot actually retrieve the object from a Phantom Reference (`get()` always returns `null`). It is only used to know exactly *when* an object has been removed from memory.

---

## 📌 2. The Problem with Standard HashMap

Imagine you want to store metadata (like access counts or timestamps) for User objects that you don't control.

```java
Map<User, UserMetadata> map = new HashMap<>();
User user1 = new User("Alice");
map.put(user1, new UserMetadata());

// Later in the program...
user1 = null; // We are done with Alice!
```

**The Memory Leak:** Even though you set `user1 = null` in your application, the `HashMap` itself still holds a **Strong Reference** to the `User` key in its internal array. Therefore, the User object (and its Metadata) will **never be garbage collected**. Over time, your server runs out of memory.

---

## 📌 3. The WeakHashMap Solution

`WeakHashMap` is identical to `HashMap`, except it wraps its **Keys** in `WeakReference` objects.

```java
Map<User, UserMetadata> map = new WeakHashMap<>();
User user1 = new User("Alice");
map.put(user1, new UserMetadata());

// Later...
user1 = null; // No strong references to Alice exist anymore
```

**The Magic:** 
1. When `user1` is set to `null`, the only remaining reference to the `User` object is the `WeakReference` inside the `WeakHashMap`'s key.
2. The Garbage Collector runs. It sees the `User` object is only weakly reachable.
3. The GC **destroys** the `User` object.
4. Internally, `WeakHashMap` detects that the key was collected and automatically purges the corresponding Value (`UserMetadata`) from the map.

---

## 📌 4. Critical Gotchas

### 🔸 Values are NOT Weak
`WeakHashMap` only makes the **Keys** weak. The **Values** are held via Strong References. If your Value holds a strong reference back to the Key, you will create a circular dependency that prevents garbage collection!

### 🔸 String Literals as Keys
```java
Map<String, String> map = new WeakHashMap<>();
map.put("Alice", "Metadata"); // "Alice" is a String Literal
```
String literals go into the String Pool, which holds strong references to them forever. Therefore, a `WeakHashMap` using String literals as keys will **never** purge those entries.

---

## 🔥 Interview Gold Statement

> *"A standard HashMap holds strong references to its keys, which can cause severe memory leaks if used to map metadata to short-lived objects. WeakHashMap solves this by wrapping its keys in WeakReferences. When all strong references to the key outside the map are removed, the Garbage Collector reclaims the key, and the WeakHashMap automatically removes the orphaned value. This makes it perfect for registry-like caches and associating metadata with objects whose lifecycles you don't control."*

---

## ⚡ Final Verdict

* ✅ **Use `WeakHashMap`** when you want map entries to automatically expire the moment the Key object is no longer used by the rest of the application.
* 🎯 **Use `SoftReference`** (custom cache) when you want objects to stick around as long as possible, but be cleared to prevent OutOfMemory errors.
