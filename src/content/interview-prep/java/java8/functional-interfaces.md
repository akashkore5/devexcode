---
title: "What are Functional interfaces? Why they were added? Is FI annotation mandatory?"
category: "java8"
order: 1
---

### What is a Functional Interface?
An interface that has **exactly one abstract method**. It can have any number of `default` and `static` methods.

### Why were they added?
- To enable **Lambda Expressions**.
- To support **Functional Programming** patterns in Java.
- To use methods as arguments (behavioral parameterization).

### Is @FunctionalInterface mandatory?
- **No**, it is not mandatory. Any interface with one abstract method is technically a functional interface.
- However, using the annotation is highly recommended because it triggers a compiler error if you accidentally add a second abstract method.
