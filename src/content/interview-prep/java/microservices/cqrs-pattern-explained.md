---
title: "CQRS Pattern (Command Query Responsibility Segregation)."
category: "microservices"
order: 3
---

### What is it?
The idea that you should use a different model to update information (Command) than the model you use to read information (Query).

### Benefits:
- **Scalability**: You can scale read and write operations independently.
- **Performance**: Optimize the read DB schema for complex queries (e.g., using a flat table or NoSQL) and the write DB for transactional integrity.
- **Security**: Ensures only the right people have access to write vs read.

### Challenge:
**Eventual Consistency**: There is a delay between writing to the Command DB and updating the Query DB.
