---
title: "Try-with-resources and recent changes."
category: "exceptions"
order: 4
---

### What is it?
Introduced in Java 7, it ensures that resources (like streams/connections) are closed automatically at the end of the block.

### Requirement:
The resource must implement the `AutoCloseable` interface.

### Java 9 Update:
You can use effectively final variables in the resource block:
```java
BufferedReader reader = new BufferedReader(new FileReader("file.txt"));
try (reader) { // Valid in Java 9+
    System.out.println(reader.readLine());
}
```
