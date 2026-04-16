---
title: "Floating point puzzle: 5 * 0.1 == 0.5?"
category: "miscellaneous"
order: 12
---

### Code:
```java
System.out.println(5 * 0.1 == 0.5); 
```

### Answer: **true**
- 0.5 can be represented exactly in binary floating-point format (unlike many other decimals like 0.1 or 0.2).
- Therefore, in this specific case, the calculation results in exactly 0.5 and returns `true`.

### Caution:
Never rely on `==` for floating-point comparisons in production logic (e.g., `0.1 + 0.2 == 0.3` is `false`). Use a small epsilon value or `BigDecimal` for monetary calculations.
