---
id: "core-java-packages"
title: "Java Packages and Access Modifiers"
slug: "core-java-packages"
description: "Organize code using packages and control access with public, private, protected, and default modifiers."
difficulty: "Beginner"
tags: ["Packages", "Java", "Access Modifiers", "Beginner"]
related_questions:
  - "What is the purpose of packages in Java?"
  - "How do access modifiers affect class, method, and variable visibility?"
  - "Explain the difference between protected and default access modifiers."
---

## Introduction
In Java, packages are used to group related classes and interfaces together, providing a way to organize code and avoid naming conflicts. Access modifiers control the visibility of classes, methods, and variables, allowing developers to encapsulate their code effectively. In this blog post, we will explore how to create and use packages in Java, as well as the different access modifiers available.
## Creating a Package
To create a package in Java, you use the `package` keyword followed by the package name at the top of your Java file. The package name should be unique and typically follows a reverse domain name convention.

```java
package com.example.myapp;
public class MyClass {
    public void display() {
        System.out.println("Hello from MyClass in com.example.myapp package!");
    }
}
```
## Using a Package
To use a class from a package, you can either import the class using the `import` statement or use the fully qualified name of the class.

```java 
import com.example.myapp.MyClass;
public class Main {
    public static void main(String[] args) {
        MyClass myClass = new MyClass();
        myClass.display(); // Output: Hello from MyClass in com.example.myapp package!
    }
}
```
## Access Modifiers
Access modifiers in Java control the visibility of classes, methods, and variables. There are four main access modifiers:
- **public**: The class, method, or
variable is accessible from any other class in any package.
- **private**: The class, method, or
variable is accessible only within the class it is declared in.
- **protected**: The class, method, or variable is accessible within the same package and by subclasses in other packages.
- **default** (no modifier): The class, method, or variable is accessible only within the same package.
```java
public class MyClass {
    public void display() {
        System.out.println("Public method in MyClass");
    }
    private void privateMethod() {
        System.out.println("Private method in MyClass");
    }
    protected void protectedMethod() {
        System.out.println("Protected method in MyClass");
    }
    void defaultMethod() {
        System.out.println("Default method in MyClass");    
    }
}
```
## Conclusion
In this blog post, we explored how to create and use packages in Java, as well as the different access modifiers available. Packages help organize code and avoid naming conflicts, while access modifiers allow developers to control the visibility of classes, methods, and variables. Understanding these concepts is essential for writing clean, maintainable, and encapsulated Java code.