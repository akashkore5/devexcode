---
title: "How to sort Customer objects in ArrayList by firstName."
category: "collections"
order: 13
---

### Using Lambda (Java 8+):
```java
customers.sort((c1, c2) -> c1.getFirstName().compareTo(c2.getFirstName()));
```

### Using Comparator.comparing:
```java
customers.sort(Comparator.comparing(Customer::getFirstName));
```

### Using Collections.sort (Pre-Java 8):
```java
Collections.sort(customers, new Comparator<Customer>() {
    public int compare(Customer c1, Customer c2) {
        return c1.getFirstName().compareTo(c2.getFirstName());
    }
});
```
