---
title: "How to enable pagination and sorting in Spring Data JPA?"
category: "jpa"
order: 40
---

### 1. In Repository:
Extend `JpaRepository` which already includes `PagingAndSortingRepository`.
```java
Page<User> findAll(Pageable pageable);
```

### 2. In Controller:
```java
@GetMapping("/users")
public Page<User> getUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(defaultValue = "id") String sortBy) {
    
    Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
    return userRepository.findAll(pageable);
}
```
