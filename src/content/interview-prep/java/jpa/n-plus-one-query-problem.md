---
title: "Explain the N+1 Query Problem and how to fix it."
category: "jpa"
order: 2
---

### What is it?
Occurs when you fetch a list of N objects, and for each object, a separate query is executed to fetch a related detail (e.g., fetching 10 Orders and then 10 separate queries for each Order's Customer).

### How to Fix:
1. **Join Fetch**: Use `JOIN FETCH` in JPQL (`SELECT o FROM Order o JOIN FETCH o.customer`).
2. **Entity Graph**: Use `@EntityGraph` to define which attributes should be fetched eagerly for a specific query.
3. **Batch Size**: Use `@BatchSize` to fetch related entities in larger chunks.
