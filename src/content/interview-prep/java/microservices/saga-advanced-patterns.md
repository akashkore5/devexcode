---
title: "Saga Advanced: Retries, Idempotency, and High Throughput."
category: "microservices"
order: 8
---

### 1. Compensating Transactions:
A logic that "undoes" a previous step. If step 2 fails, we must run a compensating transaction for step 1 (e.g., if "Payment" fails, we must "Cancel Booking").

### 2. Retries and Idempotency:
- **Retries**: If a step fails due to a network glitch, we retry.
- **Idempotency**: Essential because retries might result in the same message being processed twice. The consumer must ensure that processing the same event twice results in the same state change.

### 3. Challenges in High Throughput:
- **Message Ordering**: Ensuring events are processed in the correct sequence.
- **State Management**: Keeping track of the Saga's current state (usually in a Saga Log or Database).

### 4. Globally Distributed Sagas:
- **Latency**: Network hops across regions are slow. 
- **Solution**: Use asynchronous choreography to prevent blocking. Accept that global consistency will be "Eventually Consistent".
