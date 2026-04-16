---
title: "Saga Pattern for Distributed Transactions."
category: "microservices"
order: 2
---

### Why Saga?
In Microservices, traditional 2PC (Two-Phase Commit) is slow and doesn't scale. Saga manages data consistency across services in a distributed system.

### How it works:
A Saga is a sequence of local transactions. Each transaction updates the database and publishes a message/event. 

### Types:
1. **Choreography**: Each service produces and listens to events from other services. No central controller.
2. **Orchestration**: A central controller (Orchestrator) tells the participants what local transactions to execute.

### Failure Handling:
If one step fails, the Saga executes **Compensating Transactions** to undo the changes made by the previous successful steps.
