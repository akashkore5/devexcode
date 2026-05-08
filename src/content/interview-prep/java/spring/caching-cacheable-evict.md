---
title: "Spring Caching: @Cacheable, @CachePut, and @CacheEvict"
category: "spring"
order: 6
---

### Introduction to Spring Cache Abstraction

The **Spring Cache Abstraction** is a declarative, annotation-driven framework that simplifies caching in Java applications. It allows developers to apply caching to methods without coupling the business logic to specific caching technologies.

Instead of writing boilerplate caching logic (checking the cache, fetching from the database, updating the cache), Spring handles this transparently using **Aspect-Oriented Programming (AOP)**. It supports pluggable caching backends including:
* **In-Memory**: Caffeine, Ehcache, Hazelcast, Guava, or simple `ConcurrentMapCache` (default).
* **Distributed**: Redis, Memcached.

To enable caching in a Spring Boot application, add the `@EnableCaching` annotation to any configuration or main application class.

---

### The Core Caching Annotations

The caching framework relies on three main annotations to manage the lifecycle of cached data:

```
                      ┌───────────────────────────┐
                      │    Method Invocation      │
                      └─────────────┬─────────────┘
                                    │
                     Is it @Cacheable or @CachePut?
                     /                             \
          [@Cacheable]                             [@CachePut]
               /                                         \
     Does Key Exist in Cache?                      Always Executes Method
       /               \                                   │
    [Yes]             [No]                         Updates Cache Key
     /                   \                                 │
Returns Cached    Executes Method                          ▼
    Value         Caches & Returns                  Returns Result
                      Result
```

#### 1. `@Cacheable` (Read-Through Caching)
The `@Cacheable` annotation is applied to methods whose results can be cached safely. 
* **Behavior**: Before invoking the method, Spring checks if the specified key exists in the cache. 
  * If the key **is found**, Spring returns the cached value directly, **bypassing** method execution.
  * If the key **is not found**, the method executes normally, its returned value is stored in the cache, and then returned to the caller.
* **Common Parameters**:
  ```java
  @Cacheable(value = "users", key = "#id")
  public User getUserById(Long id) {
      return userRepository.findById(id).orElseThrow();
  }
  ```

#### 2. `@CachePut` (Cache Update)
The `@CachePut` annotation is used when you need to update the cache without skipping method execution.
* **Behavior**: The annotated method is **always executed**. Once it completes successfully, Spring stores the method's returned result in the cache under the specified key, overwriting any pre-existing value.
* **Typical Use Case**: Create or Update operations (e.g., updating user details).
  ```java
  @CachePut(value = "users", key = "#user.id")
  public User updateUser(User user) {
      return userRepository.save(user);
  }
  ```

#### 3. `@CacheEvict` (Cache Invalidation)
The `@CacheEvict` annotation removes stale or obsolete data from the cache.
* **Behavior**: It invalidates one or more entries in the cache.
* **Typical Use Case**: Delete operations or bulk clearing.
* **Key Parameters**:
  * `key`: Specifies the single entry key to evict.
  * `allEntries = true`: Clears **all** entries within the specified cache name.
  * `beforeInvocation = true`: If `true`, the eviction occurs **before** the method runs. If `false` (default), the eviction happens **after** the method executes successfully. If the method throws an exception, the cache is **not** evicted.
  ```java
  @CacheEvict(value = "users", key = "#id")
  public void deleteUser(Long id) {
      userRepository.deleteById(id);
  }
  ```

---

### Additional Caching Annotations

* **`@Caching`**: Allows grouping multiple caching annotations of the same type on a single method (e.g., multiple `@CacheEvict` rules across different caches).
  ```java
  @Caching(evict = {
      @CacheEvict(value = "users", key = "#id"),
      @CacheEvict(value = "directory", key = "#id")
  })
  public void removeUser(Long id) { ... }
  ```
* **`@CacheConfig`**: A class-level annotation that centralizes common cache configurations (like the cache name) so you don't have to repeat them on every method.
  ```java
  @Service
  @CacheConfig(cacheNames = "users")
  public class UserService {
      @Cacheable(key = "#id") // Inherits "users" cache name
      public User getUser(Long id) { ... }
  }
  ```

---

### How Caching Works Under the Hood (Spring AOP Proxy)

The single most common interview question regarding Spring Caching is: **"Why does my `@Cacheable` method fail to cache when called internally from another method in the same class?"**

To answer this, you must understand **Spring AOP Proxies**.

```
                       Client Call
                            │
                            ▼
               ┌────────────────────────┐
               │    Spring Proxy Bean   │
               │                        │
               │  Checks Cache:         │
               │  Is Key present?       │
               └────────────┬───────────┘
               Cache Hit   / \  Cache Miss
               ┌──────────┘   └──────────┐
               ▼                         ▼
         Return Cached             ┌───────────┐
            Value                  │Target Bean│ (Your actual code)
                                   │           │
                                   │  Method   │
                                   └───────────┘
```

When a Spring Bean contains caching annotations, Spring does not inject the actual class instance. Instead, it injects a dynamically generated **Proxy class** (using JDK Dynamic Proxies or CGLIB).

1. The client invokes the method on the **Proxy**.
2. The proxy intercepts the call, checks the cache manager, and resolves the cache hit/miss.
3. On a miss, the proxy delegates the call to the **Target Bean** (your actual code), takes the return value, caches it, and returns it.

#### The Self-Invocation Trap:
If `Method A` calls `Method B` internally within the same class, **the call bypasses the Spring Proxy**. It executes directly on `this` (the Target Bean instance). Because the proxy is never reached, the AOP interceptor is skipped, and **no caching occurs**.

#### Solutions to Self-Invocation:
1. **Refactor (Best Practice)**: Move the cached method into a separate, dedicated service class.
2. **Inject Self**: Autowire the bean into itself (lazy-loaded) and invoke the method through the self-reference.
   ```java
   @Service
   public class UserService {
       @Autowired
       @Lazy
       private UserService self; // Self-proxy reference

       public User getProfile(Long id) {
           return self.getCachedUser(id); // Traverses the proxy successfully!
       }

       @Cacheable(value = "users", key = "#id")
       public User getCachedUser(Long id) { ... }
   }
   ```
3. **Use AspectJ**: Switch from Spring AOP proxying to AspectJ compile-time or load-time weaving, which modifies the bytecode directly and doesn't rely on proxies.

---

### Dynamic Key Generation using SpEL

By default, Spring uses a `SimpleKeyGenerator` which generates keys based on the method's arguments. If you need dynamic, custom, or compound keys, you can use **Spring Expression Language (SpEL)**:

| Expression | Description | Example |
| :--- | :--- | :--- |
| `#root.methodName` | Name of the active method | `#root.methodName` |
| `#root.caches[0].name` | Name of the current cache | `#root.caches[0].name` |
| `#argumentName` / `#p0` | Reference method arguments by name or index | `#id` or `#p0` |
| `#result` | The returned object (only in `@CachePut` or `@Cacheable`'s `unless`) | `#result.username` |

```java
// Compound dynamic key using argument properties
@Cacheable(value = "users", key = "#user.id + '-' + #user.region")
public User getUser(User user) { ... }
```

---

### Conditional Caching: `condition` vs. `unless`

Spring allows you to control *when* results are cached using the `condition` and `unless` attributes:

```java
@Cacheable(value = "users", key = "#id", condition = "#id > 100", unless = "#result == null")
public User getUserById(Long id) { ... }
```

* **`condition` (Evaluated BEFORE method execution)**:
  * Restricts caching based on the **input arguments**.
  * If the condition evaluates to `false`, caching is entirely disabled (no cache lookup, and the result is not stored).
  * **Note**: You **cannot** use `#result` here because the method hasn't executed yet.
* **`unless` (Evaluated AFTER method execution)**:
  * Prevents caching based on the **returned result**.
  * If the `unless` expression evaluates to `true`, the result is **not** cached (even if the `condition` was true).
  * **Note**: Perfect for preventing caching of `null`, empty lists, or error responses (e.g., `unless = "#result == null"`).

---

### High-Throughput Production Considerations

#### 1. Cache Stampede / Thundering Herd (Mitigation with `sync = true`)
In a highly concurrent system, when a hot cache key expires, dozens of threads might read a cache miss simultaneously. All of them will hit the database to calculate the result, causing a database spike (cache stampede).
* **The Solution**: Set `@Cacheable(sync = true)`. This synchronizes the underlying cache access. Only **one** thread is allowed to compute the value while other threads block until the key is populated, dramatically protecting databases from load spikes.
  ```java
  @Cacheable(value = "hot_products", key = "#id", sync = true)
  public Product getHotProduct(Long id) { ... }
  ```

#### 2. Serialization Issues
When using distributed caches like **Redis**, all objects stored in the cache must implement `java.io.Serializable`. Failing to do so throws a `SerializationException`. Furthermore, always define a explicit `serialVersionUID` to prevent cache breakdown upon minor class modifications.

#### 3. Transaction Failures and Cache Consistency
If a method annotated with `@CacheEvict(beforeInvocation = false)` finishes executing but the database transaction is subsequently rolled back by Spring's transactional manager, **the cache remains invalidated**. 
* To align cache eviction with transactional commits, use Spring's `@TransactionalEventListener` or configure your cache manager to execute evictions only on successful transaction commits.

---

### Spring Caching Summary Matrix

| Annotation | Method Executed? | Cache Interaction | SpEL `#result` available? | Typical Use Case |
| :--- | :---: | :---: | :---: | :--- |
| **`@Cacheable`** | Only on Cache Miss | Reads cache; Writes on miss | ❌ No (Can use only in `unless`) | Fetching static/semi-static data (e.g., `getUserById`). |
| **`@CachePut`** | **Always** | Always writes/updates cache | ✅ Yes | Saving or modifying data (e.g., `updateProfile`). |
| **`@CacheEvict`** | **Always** (unless `beforeInvocation=true` and method fails) | Removes/evicts entry | ❌ No | Deleting data or clearing stale state (e.g., `deleteUser`). |

---

### Interview Gold: High-Impact Answers

#### Q: Explain Spring's Cache Abstraction and the difference between `@Cacheable` and `@CachePut`.
> *"Spring's Caching Abstraction is a declarative, AOP-driven framework that separates business code from cache management. The key difference between `@Cacheable` and `@CachePut` is their execution flow. `@Cacheable` operates on a 'check-then-compute' model: it skips method execution entirely on a cache hit and serves cached data. In contrast, `@CachePut` always executes the method and updates the cache with the returned result, making it ideal for save/update operations where cache synchronization is needed."*

#### Q: What is the self-invocation issue in Spring caching, and how do you resolve it?
> *"Because Spring's caching mechanism relies on dynamic AOP proxies, caching annotations are only intercepted when a call goes through the proxy. When a method invokes another cached method within the same class (self-invocation), the call bypasses the proxy and executes directly on the target instance (`this`), skipping the caching logic entirely. To resolve this, the best practice is to refactor and separate concerns by moving the cached method to a separate Spring bean. Alternatively, you can inject a lazy self-reference proxy into the class, or use AspectJ bytecode weaving."*

#### Q: How do you prevent caching `null` values or handling cache stampedes in Spring Boot?
> *"To prevent caching null or invalid results, I use the `unless` attribute with SpEL, such as `@Cacheable(unless = "#result == null")`. To mitigate cache stampedes under high concurrency, I set the `sync = true` attribute on `@Cacheable`. This forces the cache provider to synchronize the load operation, ensuring only one thread hits the database on a cache miss while others wait for the cache to be populated."*
