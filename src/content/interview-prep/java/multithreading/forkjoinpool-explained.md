---
title: "What is ForkJoinPool and how does it improve performance?"
category: "multithreading"
order: 18
---

### What is ForkJoinPool?
A specialized `ExecutorService` (introduced in Java 7) designed for **divide-and-conquer** parallelism. It recursively breaks a large task into smaller subtasks, processes them in parallel, and combines the results.

### The Work-Stealing Algorithm
This is ForkJoinPool's **killer feature**:
1. Each worker thread has its own **double-ended queue (deque)** of tasks.
2. When a thread finishes its own tasks, it **steals** tasks from the tail of another thread's deque.
3. This ensures all CPU cores are utilized — **no idle threads**.

> In a standard `ThreadPoolExecutor`, idle threads simply wait. In `ForkJoinPool`, they actively find work to do.

### Core Abstractions

| Class | Description |
|-------|-------------|
| `RecursiveTask<V>` | Returns a result (like `Callable`) |
| `RecursiveAction` | No return value (like `Runnable`) |
| `fork()` | Submits a subtask for async execution |
| `join()` | Waits for the subtask result |

### Example: Parallel Sum using RecursiveTask
```java
class SumTask extends RecursiveTask<Long> {
    private final long[] array;
    private final int start, end;
    private static final int THRESHOLD = 10_000;

    SumTask(long[] array, int start, int end) {
        this.array = array; this.start = start; this.end = end;
    }

    @Override
    protected Long compute() {
        if (end - start <= THRESHOLD) {
            // Base case: compute directly
            long sum = 0;
            for (int i = start; i < end; i++) sum += array[i];
            return sum;
        }
        // Divide
        int mid = (start + end) / 2;
        SumTask left = new SumTask(array, start, mid);
        SumTask right = new SumTask(array, mid, end);
        left.fork();           // async execution
        long rightResult = right.compute(); // compute in-place
        long leftResult = left.join();      // wait for left
        return leftResult + rightResult;
    }
}

// Usage
ForkJoinPool pool = new ForkJoinPool();
long sum = pool.invoke(new SumTask(array, 0, array.length));
```

### How Does It Improve Performance?
1. **CPU Utilization**: Work-stealing keeps all cores busy.
2. **Less Overhead**: Subtasks are lightweight; the deque operations are lock-free.
3. **Automatic Scaling**: The common pool defaults to `Runtime.getRuntime().availableProcessors() - 1` threads.

### Connection to Parallel Streams
Java's `parallelStream()` uses `ForkJoinPool.commonPool()` under the hood. This is why a heavy parallel stream can starve other parallel tasks in your application — they all share the same pool.

### When to Use?
- ✅ CPU-intensive recursive algorithms (merge sort, tree traversal, matrix multiplication).
- ✅ Large dataset processing with splittable workloads.
- ❌ I/O-bound tasks — use a standard `ExecutorService` instead.
