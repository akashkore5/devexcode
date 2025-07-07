---
id: "hibernate-jpa-queries"
title: "JPQL and Criteria API"
slug: "hibernate-jpa-queries"
description: "Write complex database queries using JPQL and the Criteria API."
difficulty: "Intermediate"
date: "2025-05-09"
author: "DevCodeEx Team"
category: "Java Intermediate"
tags: ["JPQL", "Criteria", "Java", "Intermediate"]
---

## Introduction
Java Persistence Query Language (JPQL) and the Criteria API are powerful tools for querying databases in Java applications using JPA. They allow developers to write complex queries in a more object-oriented way, making it easier to work with data stored in relational databases.
JPQL is a query language similar to SQL but operates on JPA entities rather than database tables. The Criteria API provides a programmatic way to construct queries using Java code, which can be more flexible and type-safe compared to JPQL.
Understanding these concepts is crucial for Java developers working with JPA, as they enhance the ability to perform complex queries and manipulate data effectively.

## Prerequisites
- Basic knowledge of JPA and Java programming.
- Familiarity with Java development environments (e.g., IntelliJ IDEA, Eclipse).
- Understanding of SQL and relational databases.


## Key Concepts
- **JPQL (Java Persistence Query Language)**: A query language that allows developers to write queries against JPA entities. It is similar to SQL but operates on entity objects.
- **Criteria API**: A type-safe, programmatic way to construct queries using Java code. It allows for dynamic query creation and is useful for building complex queries without writing raw SQL.
- **EntityManager**: The primary interface for interacting with the persistence context, providing methods to create, read, update, and delete entities.
- **Query**: An interface in JPA that represents a query against the database, allowing execution of JPQL or Criteria API queries.
- **TypedQuery**: A subinterface of Query that allows for type-safe queries, ensuring that the result type is known at compile time.
- **Root**: Represents the root entity in a Criteria query, allowing access to its attributes and relationships.
- **CriteriaBuilder**: An interface used to construct Criteria queries, providing methods to create predicates, expressions, and other query components.

## Practical Examples
```java
import javax.persistence.*;
import javax.persistence.criteria.*;    
import java.util.List;
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String product;
    private int quantity;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
```
```java
import javax.persistence.*;
import javax.persistence.criteria.*;    
import java.util.List;  
import java.util.ArrayList; // Added import for ArrayList
public class UserService {
    private EntityManagerFactory emf = Persistence.createEntityManagerFactory("my-persistence-unit");

    public void createUser(User user) {
        EntityManager em = emf.createEntityManager();
        em.getTransaction().begin();
        em.persist(user);
        em.getTransaction().commit();
        em.close();
    }

    public User findUser(Long id) {
        EntityManager em = emf.createEntityManager();
        User user = em.find(User.class, id);
        em.close();
        return user;
    }

    public List<User> findUsersByName(String name) {
        EntityManager em = emf.createEntityManager();
        TypedQuery<User> query = em.createQuery("SELECT u FROM User u WHERE u.name = :name", User.class);
        query.setParameter("name", name);
        List<User> users = query.getResultList();
        em.close();
        return users;
    }

    public List<User> findUsersByEmail(String email) {
        EntityManager em = emf.createEntityManager();
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<User> cq = cb.createQuery(User.class);
        Root<User> userRoot = cq.from(User.class);
        cq.select(userRoot).where(cb.equal(userRoot.get("email"), email));
        TypedQuery<User> query = em.createQuery(cq);
        List<User> users = query.getResultList();
        em.close();
        return users;
    }
}
```
```java
import javax.persistence.*;
import javax.persistence.criteria.*;
import java.util.List;      
public class OrderService {
    private EntityManagerFactory emf = Persistence.createEntityManagerFactory("my-persistence-unit");

    public void createOrder(Order order) {
        EntityManager em = emf.createEntityManager();
        em.getTransaction().begin();
        em.persist(order);
        em.getTransaction().commit();
        em.close();
    }

    public List<Order> findOrdersByProduct(String product) {
        EntityManager em = emf.createEntityManager();
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Order> cq = cb.createQuery(Order.class);
        Root<Order> orderRoot = cq.from(Order.class);
        cq.select(orderRoot).where(cb.equal(orderRoot.get("product"), product));
        TypedQuery<Order> query = em.createQuery(cq);
        List<Order> orders = query.getResultList();
        em.close();
        return orders;
    }
}
```
```java
import javax.persistence.*;
import javax.persistence.criteria.*;
import java.util.List;  
public class UserRepository {
    private EntityManager em;

    public UserRepository(EntityManager em) {
        this.em = em;
    }

    public List<User> findAllUsers() {
        Query query = em.createQuery("SELECT u FROM User u");
        return query.getResultList();
    }

    public List<User> findUsersByCriteria(String name, String email) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<User> cq = cb.createQuery(User.class);
        Root<User> userRoot = cq.from(User.class);
        
        Predicate namePredicate = cb.equal(userRoot.get("name"), name);
        Predicate emailPredicate = cb.equal(userRoot.get("email"), email);
        
        cq.select(userRoot).where(cb.and(namePredicate, emailPredicate));
        
        TypedQuery<User> query = em.createQuery(cq);
        return query.getResultList();
    }
}
```
```java
import javax.persistence.*;
import javax.persistence.criteria.*;
import java.util.List;  
public class CriteriaQueryExample {
    private EntityManagerFactory emf = Persistence.createEntityManagerFactory("my-persistence-unit");

    public List<User> findUsersWithCriteria(String name, String email) {
        EntityManager em = emf.createEntityManager();
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<User> cq = cb.createQuery(User.class);
        Root<User> userRoot = cq.from(User.class);
        
        Predicate namePredicate = cb.equal(userRoot.get("name"), name);
        Predicate emailPredicate = cb.equal(userRoot.get("email"), email);
        
        cq.select(userRoot).where(cb.and(namePredicate, emailPredicate));
        
        TypedQuery<User> query = em.createQuery(cq);
        List<User> users = query.getResultList();
        em.close();
        return users;
    }
}
```

## Interview Questions and Answers
### Q1: What is JPQL and how does it differ from SQL?
**A1:** JPQL (Java Persistence Query Language) is a query language similar to SQL but operates on JPA entities rather than database tables. It allows developers to write queries in an object-oriented manner, focusing on entity relationships rather than database structure. Unlike SQL, JPQL queries are not tied to a specific database schema, making them more portable across different databases.
### Q2: What is the Criteria API and when would you use it?
**A2:** The Criteria API is a type-safe, programmatic way to construct queries using Java code. It allows for dynamic query creation and is useful for building complex queries without writing raw SQL. You would use the Criteria API when you need to create queries dynamically based on user input or when you want to avoid hardcoding query strings, which can lead to errors and make maintenance difficult.
### Q3: How do you create a Criteria query to find users by name and email?
**A3:** To create a Criteria query to find users by name and email, you would use the `CriteriaBuilder` to construct the query. You would create a `CriteriaQuery` object, define the root entity, and then add predicates for the name and email conditions. Finally, you would execute the query using a `TypedQuery`. Here’s an example:
```java
CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<User> cq = cb.createQuery(User.class);
Root<User> userRoot = cq.from(User.class);
Predicate namePredicate = cb.equal(userRoot.get("name"), name);
Predicate emailPredicate = cb.equal(userRoot.get("email"), email);
cq.select(userRoot).where(cb.and(namePredicate, emailPredicate));
TypedQuery<User> query = em.createQuery(cq);
List<User> users = query.getResultList();
```
### Q4: What are the advantages of using TypedQuery over Query in JPA?
**A4:** The advantages of using `TypedQuery` over `Query` in JPA include:
- **Type Safety**: `TypedQuery` ensures that the result type is known at compile time, reducing the risk of runtime errors due to type mismatches.
- **Cleaner Code**: It eliminates the need for casting the result set, making the code cleaner and easier to read.
- **Better IDE Support**: IDEs can provide better code completion and error checking for `TypedQuery`, enhancing developer productivity.
### Q5: How do you handle transactions in JPA?
**A5:** In JPA, transactions are handled using the `EntityManager`'s transaction API. You begin a transaction using `em.getTransaction().begin()`, perform your operations (like persist, merge, or remove), and then commit the transaction with `em.getTransaction().commit()`. If an error occurs, you can roll back the transaction using `em.getTransaction().rollback()`. It is important to manage transactions properly to ensure data consistency and integrity.
## Best Practices
- Use JPQL for complex queries that involve multiple entities and relationships.
- Prefer the Criteria API for dynamic queries where conditions may change based on user input.
- Always use `TypedQuery` for type safety and cleaner code.
- Manage transactions properly to ensure data integrity.
- Close the `EntityManager` after use to prevent memory leaks.
- Use parameterized queries to prevent SQL injection attacks.

## Conclusion
JPQL and the Criteria API are essential tools for Java developers working with JPA. They provide powerful ways to query and manipulate data in a more object-oriented manner, enhancing the flexibility and maintainability of Java applications. By mastering these concepts, developers can write complex queries efficiently and effectively, leading to better application performance and user experience.