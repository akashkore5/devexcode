---
title: "Callable vs Runnable: Return Values, Exceptions & When to Use Each"
category: "multithreading"
order: 17
---

### Key Differences

| Feature | Runnable | Callable\<V\> |
|---------|----------|--------------|
| Method | `void run()` | `V call() throws Exception` |
| Return value | ❌ None | ✅ Returns a result |
| Checked exceptions | ❌ Cannot throw | ✅ Can throw checked exceptions |
| Introduced in | Java 1.0 | Java 1.5 |
| Used with | `Thread`, `ExecutorService` | `ExecutorService` only |

### Runnable Example
```java
Runnable task = () -> {
    System.out.println("Fire-and-forget task");
};
new Thread(task).start();
```

### Callable Example
```java
Callable<Integer> task = () -> {
    TimeUnit.SECONDS.sleep(2);
    return 42;
};

ExecutorService executor = Executors.newSingleThreadExecutor();
Future<Integer> future = executor.submit(task);
Integer result = future.get(); // Blocks until result is ready → 42
executor.shutdown();
```

### How Future Works with Callable
- `executor.submit(callable)` returns a `Future<V>`.
- `future.get()` — blocks the calling thread until the result is available.
- `future.get(timeout, unit)` — blocks with a timeout.
- `future.isDone()` — checks if task completed.
- `future.cancel(true)` — attempts to cancel execution.

### Exception Handling
```java
Callable<String> riskyTask = () -> {
    throw new IOException("Disk failure!");
};

Future<String> f = executor.submit(riskyTask);
try {
    f.get();
} catch (ExecutionException e) {
    // e.getCause() → the original IOException
    System.out.println("Root cause: " + e.getCause().getMessage());
}
```

### When to Use Each?
- **Runnable**: Fire-and-forget tasks — logging, sending notifications, updating a cache.
- **Callable**: When you need a **result** or need to **propagate exceptions** — API calls, database queries, computation results.

### Modern Alternative: CompletableFuture
For complex async workflows, prefer `CompletableFuture` over raw `Callable + Future`:
```java
CompletableFuture.supplyAsync(() -> fetchFromDB())
    .thenApply(data -> transform(data))
    .thenAccept(result -> sendResponse(result));
```
