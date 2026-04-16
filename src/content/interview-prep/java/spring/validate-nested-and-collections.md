---
title: "Validating nested objects and collections."
category: "spring"
order: 34
---

### 1. Nested Objects:
Use `@Valid` on the nested object field inside your DTO.
```java
public class UserDTO {
    @Valid
    private AddressDTO address;
}
```

### 2. Collections:
To validate a list of objects, you can use `@Valid` as well:
```java
public void saveUsers(@RequestBody @Valid List<UserDTO> users) { ... }
```
**Note**: For method-level validation of collections, you often need `@Validated` on the Class level.
