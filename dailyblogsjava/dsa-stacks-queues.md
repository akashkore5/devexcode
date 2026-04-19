---
id: "dsa-stacks-queues"
title: "Stacks and Queues"
slug: "dsa-stacks-queues"
description: "Use stacks and queues for problems like expression evaluation and task scheduling."
difficulty: "Beginner"
date: "2025-05-09"
author: "DevCodeEx Team"
category: "Java Beginner"
tags: ["Stacks", "Queues", "Java", "Beginner", "Interview"]
---

# Stacks and Queues
## dsa-stacks-queues
## Description: Use stacks and queues for problems like expression evaluation and task scheduling.

### Difficulty: Beginner

### Tags: Stacks, Queues, Java, Beginner, Interview

## Introduction
As a Java developer, understanding the fundamentals of data structures is crucial. Stacks and queues are two fundamental concepts that can help you solve complex problems efficiently. In this post, we'll explore what stacks and queues are, why they're important, and how to implement them in Java.

For beginners, imagine a stack of plates or a line at a movie theater. You add plates (or people) one by one, and when you need to remove something, it's the last one added that comes out first (LIFO - Last In, First Out). For advanced developers, think about real-world applications like parsing expressions in a programming language or handling tasks in a job scheduler.

## Prerequisites
To understand this topic, you'll need to know:

* Basic Java syntax and data types
* What is an array? (for beginners)
* Object-Oriented Programming (OOP) concepts like classes and inheritance (for advanced developers)

## Key Concepts
Here are the core components of stacks and queues:

### Stacks

* A stack is a Last-In-First-Out (LIFO) data structure, where elements are added and removed from the top.
* Push: add an element to the top of the stack.
* Pop: remove the top element from the stack.
* Peek: view the top element without removing it.

Beginners: Think of a stack as a plate tower. You can add plates (push) or take them away (pop). Advanced developers: Stacks are often implemented using arrays, with efficient push and pop operations for large datasets.

### Queues

* A queue is a First-In-First-Out (FIFO) data structure, where elements are added to the end and removed from the front.
* Enqueue: add an element to the end of the queue.
* Dequeue: remove the front element from the queue.
* Peek: view the front element without removing it.

Beginners: Picture a line at a bank or a bus stop. The first person in line (enqueued) is the next one served (dequeued). Advanced developers: Queues are commonly used for task scheduling, where tasks are added and removed based on their priority or due date.

### Deques

* A deque (double-ended queue) is a data structure that combines features of stacks and queues.
* Add and remove elements from both ends.
* Use cases: efficient insertion and deletion in a database query result set, or handling concurrent requests in a web server.

Beginners: Think of a deque as a library bookshelf. You can add books to the front or back, and remove them from either end. Advanced developers: Deques are often implemented using linked lists for efficient operations.

## Practical Examples
Here are three Java code examples demonstrating stacks, queues, and deques:

### Example 1: Evaluating an Expression
```java
import java.util.Stack;

public class ExpressionEvaluator {
    public static int evaluate(String expression) {
        Stack stack = new Stack&lt;&gt;();
        for (char c : expression.toCharArray()) {
            if (c == '(') {
                stack.push(0); // push 0 to represent the opening parenthesis
            } else if (c == ')') {
                int top = stack.pop(); // pop and evaluate the inner expression
                return top; // return the evaluated result
            }
        }
        return -1; // invalid expression
    }
}
```

Beginners: This example demonstrates how to use a stack to evaluate an arithmetic expression. Advanced developers: Note the optimization of using a stack instead of recursive function calls.

### Example 2: Task Scheduling
```java
import java.util.PriorityQueue;

public class TaskScheduler {
    public static void scheduleTasks(PriorityQueue tasks) {
        while (!tasks.isEmpty()) {
            Task task = tasks.poll(); // dequeue the highest-priority task
            System.out.println("Scheduling task: " + task.getName());
        }
    }
}
```

Beginners: This example shows how to use a queue to schedule tasks based on their priority. Advanced developers: Note the use of a priority queue for efficient sorting and scheduling.

### Example 3: Implementing a Stack
```java
public class MyStack {
    private int[] array;
    private int size;

    public MyStack(int capacity) {
        array = new int[capacity];
        size = 0;
    }

    public void push(int value) {
        if (size == array.length) {
            // handle overflow
        }
        array[size++] = value;
    }

    public int pop() {
        return array[--size]; // or use a copy of the last element to maintain original order
    }
}
```

Beginners: This example demonstrates how to implement a basic stack using an array. Advanced developers: Note the considerations for handling overflow and optimizing performance.

## Diagrams
No diagrams required.

## Best Practices

### 1. Choose the Right Data Structure
Select the most suitable data structure (stack, queue, or deque) based on your problem's requirements.

Beginners: Understand that each data structure has its strengths and weaknesses.

### 2. Optimize Performance
Consider the time complexity of operations when implementing stacks and queues.

Advanced developers: Use efficient algorithms and data structures to minimize overhead.

### 3. Handle Edge Cases
Be aware of edge cases, such as stack overflow or queue underflow, and handle them accordingly.

Beginners: Think about what happens when you try to push onto a full stack or dequeue from an empty queue.

## Further Reading

* "Introduction to Algorithms" by Thomas H. Cormen (book)
* "Data Structures and Algorithms in Java" by Michael T. Goodrich (book)
* Oracle's Java documentation on collections and data structures (online resource)

In conclusion, stacks and queues are fundamental data structures that can help you solve complex problems efficiently. By understanding the concepts, implementing them correctly, and following best practices, you'll be well-equipped to tackle a wide range of programming challenges.