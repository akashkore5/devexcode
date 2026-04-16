---
title: "Asynchronous Programming with CompletableFuture."
category: "java8"
order: 8
---

**CompletableFuture** is an extension to Java's `Future` API that supports functional-style callbacks and complex task chaining.

### Key Capabilities:
- **Chaining**: `thenApply()`, `thenAccept()`, `thenRun()`.
- **Composition**: `thenCompose()` (like flatMap), `thenCombine()` (combining two futures).
- **Error Handling**: `exceptionally()`, `handle()`.
- **Async Execution**: By default, uses the `ForkJoinPool.commonPool()` unless a custom executor is provided.
