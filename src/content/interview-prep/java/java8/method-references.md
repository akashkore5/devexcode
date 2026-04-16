---
title: "Method references? Syntax and Scenarios."
category: "java8"
order: 6
---

### Syntax: `ClassName::methodName`

### 4 Types:
1. **Static method**: `Math::max`
2. **Instance method of a particular object**: `myObj::getName`
3. **Instance method of an arbitrary object of a particular type**: `String::toLowerCase`
4. **Constructor**: `ArrayList::new`

### Scenario: Sorting ignoring case
Instead of lambdas:
```java
list.sort((s1, s2) -> s1.compareToIgnoreCase(s2));
```
Use method reference:
```java
list.sort(String::compareToIgnoreCase);
```
