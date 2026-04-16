---
title: "How to convert a Map to a List in Java?"
category: "collections"
order: 25
---

You can convert map keys, values, or entries to a list:

### 1. Converting Keys to List:
```java
List<String> keyList = new ArrayList<>(map.keySet());
```

### 2. Converting Values to List:
```java
List<String> valueList = new ArrayList<>(map.values());
```

### 3. Converting Entries to List:
```java
List<Map.Entry<String, String>> entryList = new ArrayList<>(map.entrySet());
```

This is common when you need to sort map elements by value (by sorting the `entryList`).
