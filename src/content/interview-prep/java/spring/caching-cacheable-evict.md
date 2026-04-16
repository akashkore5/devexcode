---
title: "@Cacheable, @CachePut, and @CacheEvict."
category: "spring"
order: 6
---

### 1. @Cacheable:
- Checks the cache before method execution. If found, returns the cached value. If not, executes the method and caches the result.

### 2. @CachePut:
- Always executes the method and updates the cache with the result. Useful for **update** operations.

### 3. @CacheEvict:
- Removes one or more entries from the cache. Useful for **delete** operations or clearing the cache.
