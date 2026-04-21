---
title: "Sorting Custom Objects in Java"
category: "collections"
order: 13
status: "not-started"
tags: ["Sorting", "Collections", "Comparator", "Lambda", "Java 8"]
---

# 🔹 Sorting Custom Objects (Deep Dive, Interview-Ready)

In technical interviews, you will frequently be asked to sort a collection of custom objects (like `Customer`, `Employee`, or `Transaction`) by a specific field. While this used to require verbose anonymous inner classes, modern Java (Java 8+) has turned this into an elegant one-liner using method references and lambdas.

---

## 📌 1. The Scenario

Imagine we have a `Customer` class:

```java
public class Customer {
    private String firstName;
    private String lastName;
    private int age;
    
    // constructor, getters, setters
}
```

We have an `ArrayList<Customer> customers`. Our goal: **Sort them by `firstName`**.

---

## 📌 2. Modern Java (The "Gold Standard")

If you are asked this in an interview today, you should immediately write the Java 8+ `Comparator.comparing` approach. It is the cleanest, most idiomatic way to sort in modern Java.

### 🔸 Using `Comparator.comparing` (Method Reference)
This is highly preferred because it's instantly readable.

```java
customers.sort(Comparator.comparing(Customer::getFirstName));
```

### 🔸 Using a Lambda Expression
If you need slightly more custom logic during the comparison, a lambda works perfectly.

```java
customers.sort((c1, c2) -> c1.getFirstName().compareTo(c2.getFirstName()));
```

---

## 📌 3. Advanced Sorting (Chaining Comparators)

Interviewers often add a twist: *"What if two customers have the same first name? Sort them by last name as a fallback."*

With Java 8+, you don't need complex `if/else` logic. You can just chain Comparators using `.thenComparing()`.

```java
customers.sort(
    Comparator.comparing(Customer::getFirstName)
              .thenComparing(Customer::getLastName)
);
```

### 🔸 Sorting Primitives (Avoiding Autoboxing)
If the twist is to sort by `age` (an `int`), you should avoid the performance penalty of autoboxing (converting `int` to `Integer`). Use `.comparingInt()`:

```java
// Sorts by first name, then by age (using primitive comparison for speed)
customers.sort(
    Comparator.comparing(Customer::getFirstName)
              .thenComparingInt(Customer::getAge)
);
```

### 🔸 Reverse Sorting (Descending Order)
Need it in descending order? Just chain `.reversed()`.

```java
customers.sort(Comparator.comparing(Customer::getFirstName).reversed());
```

---

## 📌 4. The Legacy Approach (Pre-Java 8)

You should know this just in case you are working on a very old codebase, but always tell the interviewer you prefer the Java 8 approach.

```java
Collections.sort(customers, new Comparator<Customer>() {
    @Override
    public int compare(Customer c1, Customer c2) {
        return c1.getFirstName().compareTo(c2.getFirstName());
    }
});
```

👉 **Why it's bad:** It requires 6 lines of boilerplate code to achieve what Java 8 does in 1 line. It clutters the codebase and reduces readability.

---

## 📌 5. Sorting via Streams (Creating a new List)

If you don't want to mutate the original `customers` list, but instead want to create a brand new sorted list, use the Stream API.

```java
List<Customer> sortedCustomers = customers.stream()
    .sorted(Comparator.comparing(Customer::getFirstName))
    .collect(Collectors.toList()); // or .toList() in Java 16+
```

---

## 🔥 Interview Gold Statement

> *"To sort custom objects in modern Java, I always use the `List.sort()` method combined with `Comparator.comparing()`. It allows for elegant, highly readable one-liners using method references like `Customer::getFirstName`. Furthermore, it makes complex multi-level sorting trivial by chaining `.thenComparing()` or `.reversed()`, completely eliminating the verbose anonymous inner classes required in older versions of Java."*

---

## ⚡ Final Verdict

* ✅ **Use `List.sort(Comparator.comparing(...))`** for all in-place sorting.
* ✅ **Use `stream().sorted(...)`** when you need a new sorted copy without modifying the original array.
* ❌ **Avoid `Collections.sort()` with anonymous classes** unless strictly required by a legacy Java 7 compiler.
