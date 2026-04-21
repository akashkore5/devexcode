---
title: "Shallow vs Deep Cloning"
category: "collections"
order: 8
status: "not-started"
tags: ["Cloning", "Memory", "Architecture", "Best Practices"]
---

# 🔹 Shallow vs Deep Cloning (Deep Dive, Interview-Ready)

Cloning is the process of creating an exact copy of an object. In interviews, simply knowing what cloning is isn't enough; you must understand the memory implications of how nested objects are copied, and the dangers of using Java's built-in `clone()` method.

---

## 📌 1. Shallow Cloning (The Default)

When you call `Object.clone()`, Java performs a **Shallow Clone**. 
It copies the raw memory layout of the object. 
* Primitive fields (int, double) are copied directly.
* **Object References are copied as memory addresses.**

### 🔸 The Danger
If your object contains a reference to another mutable object (like an `Address` or an `ArrayList`), the cloned object and the original object will point to the **exact same nested object in memory**.

```java
// Original Employee has an Address object
Employee original = new Employee("Alice", new Address("New York"));
Employee shallowClone = (Employee) original.clone();

// Changing the address in the CLONE...
shallowClone.getAddress().setCity("Los Angeles");

// ...also affects the ORIGINAL!
System.out.println(original.getAddress().getCity()); // Prints "Los Angeles"
```
Because they share the same reference, a shallow clone is extremely dangerous if the nested objects are mutable.

---

## 📌 2. Deep Cloning

A **Deep Clone** creates an entirely new object, and recursively creates entirely new copies of *all nested objects* as well.

If you deep clone an `Employee`, you also create a brand new `Address` object specifically for the clone. Modifying the clone will have zero impact on the original.

### 🔸 How to Implement Deep Cloning

There are three common ways to achieve this:

#### 1. Manual Recursive Cloning (Cumbersome)
You must override `clone()` in every single class down the hierarchy.
```java
@Override
protected Object clone() throws CloneNotSupportedException {
    Employee clone = (Employee) super.clone();
    // Manually clone the mutable nested object
    clone.address = (Address) this.address.clone(); 
    return clone;
}
```

#### 2. Copy Constructors (Recommended)
Instead of relying on the broken `Cloneable` interface, simply pass the original object into a constructor and manually copy the fields.
```java
public Employee(Employee original) {
    this.name = original.name;
    // Create a NEW Address object using the original's data
    this.address = new Address(original.address); 
}
```

#### 3. Serialization (The Hack)
You serialize the entire object to a byte stream (e.g., using JSON like Jackson/Gson, or Java's `ObjectOutputStream`), and then immediately deserialize it back into a new object. This forces deep copying of the entire tree but is computationally expensive.

---

## 📌 3. Why `Cloneable` is considered broken

Joshua Bloch (Architect of Java Collections) famously stated that the `Cloneable` interface is broken and should be avoided.
1. It is a **Marker Interface** (it has no methods), yet it magically changes the behavior of the protected `Object.clone()` method.
2. It completely bypasses constructors, which breaks invariants and `final` fields.
3. It forces you to deal with `CloneNotSupportedException`, a checked exception.

**Best Practice:** Always prefer **Copy Constructors** or **Factory Methods** over implementing `Cloneable`.

---

## 🔥 Interview Gold Statement

> *"By default, Java's `Object.clone()` performs a Shallow Clone, meaning it copies primitive fields but only copies memory references for nested objects. This causes the original and the clone to share mutable state, leading to unpredictable side effects. To solve this, we must perform a Deep Clone, which creates independent copies of all nested objects. Because Java's `Cloneable` interface is fundamentally flawed—bypassing constructors and forcing checked exceptions—I always prefer implementing Deep Cloning via Copy Constructors or Serialization libraries rather than relying on `Object.clone()`."*

---

## ⚡ Final Verdict

* ✅ **Use Copy Constructors** `new Employee(originalEmployee)` for safe, predictable deep copying.
* ❌ **Avoid `Cloneable` and `Object.clone()`** in modern Java architecture.
