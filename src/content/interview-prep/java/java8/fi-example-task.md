---
title: "Write a Functional Interface for summing 2 numbers."
category: "java8"
order: 3
---

### Custom FI for Summing:
```java
@FunctionalInterface
interface Calculator {
    int operate(int a, int b);
}

public class Main {
    public static void main(String[] args) {
        Calculator sum = (a, b) -> a + b;
        System.out.println(sum.operate(10, 20)); // 30
    }
}
```
