---
title: "Difference between a = a + b and a += b expressions."
category: "miscellaneous"
order: 10
---

### The Difference: **Implicit Casting**

1. **a = a + b**:
- Performs addition and requires manual casting if types differ.
- Example: 
  ```java
  byte a = 10;
  a = a + 5; // Compilation Error (Result is int)
  a = (byte)(a + 5); // Correct
  ```

2. **a += b**:
- Performs the operation and **automatically casts** the result to the type of 'a'.
- Example:
  ```java
  byte a = 10;
  a += 5; // Valid. Automatically casts result to byte.
  ```
