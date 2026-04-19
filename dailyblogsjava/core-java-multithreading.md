---
"id": "core-java-multithreading",
"title": "Multithreading Basics",
"slug": "core-java-multithreading",
"description": "Learn the fundamentals of creating and managing threads in Java for concurrent programming.",
"difficulty": "Intermediate",
"tags": ["Multithreading", "Java", "Intermediate", "Interview"],
"related_questions": [
    "What is the difference between a thread and a process in Java?",
    "How do you create a thread using the Thread class and Runnable interface?",
    "Explain the role of the synchronized keyword in Java."
]
---

## Introduction

Java multithreading is a powerful tool for developing applications that can utilize multiple CPUs. It allows a program to run multiple threads concurrently, which can improve the performance of the application. In this blog post, we will explore the basics of multithreading in Java, including how to create threads, how to use the `synchronized` keyword, and how to use the `Thread` class and `Runnable` interface.

## Creating a Thread

There are several ways to create a thread in Java. The most common is to extend the `Thread` class and override the `run()` method. Another way is to implement the `Runnable` interface and pass an instance of the class to the `Thread` constructor. The `Thread` class provides a constructor that takes a `Runnable` object as an argument, so you can pass an instance of the class to the constructor.
### Using the Thread Class

```java 
class MyThread extends Thread {
    public void run() {
        System.out.println("Thread is running");
    }
}
public class Main {
    public static void main(String[] args) {
        MyThread thread = new MyThread();
        thread.start(); // Start the thread
    }
}
```
### Using the Runnable Interface

```java
class MyRunnable implements Runnable {
    public void run() {
        System.out.println("Thread is running");
    }
}
public class Main {
    public static void main(String[] args) {
        Thread thread = new Thread(new MyRunnable());
        thread.start(); // Start the thread
    }
}
``` 
## Synchronization

When multiple threads access shared resources, it can lead to inconsistent 
behavior and race conditions. To prevent this, you can use the `synchronized` keyword to ensure that only one thread can access a shared resource at a time. This can be applied to methods or blocks of code.
```java
public class Main {
    public static void main(String[] args) {
        synchronized (this) {
            // Code that should be synchronized
        }
    }
}
```
## Thread Lifecycle

A thread has the following lifecycle:
1. New: The thread is created but not yet started.
2. Runnable: The thread is ready to run.
3. Running: The thread is executing.
4. Terminated: The thread has completed execution.
## Conclusion
Multithreading is a powerful feature in Java that allows you to create applications that can perform multiple tasks concurrently. By understanding how to create threads, use synchronization, and manage the thread lifecycle, you can build efficient and responsive applications. In future posts, we will explore more advanced topics such as thread pools, deadlocks, and concurrency utilities in Java.