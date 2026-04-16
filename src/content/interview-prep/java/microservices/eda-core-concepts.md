---
title: "Event vs Command vs Query in EDA (and Broker roles)."
category: "microservices"
order: 7
---

### 1. The Trinity of EDA:
- **Command**: A request for an action to happen in the future (`CreateOrder`). It can be rejected. Typically point-to-point.
- **Event**: A factual statement that something happened in the past (`OrderCreated`). It cannot be retracted. It is broadcasted (one-to-many).
- **Query**: A request for information (`GetOrderDetails`). It is idempotent and has no side effects.

### 2. Role of the Message Broker (Event Bus):
- **Decoupling**: The producer doesn't need to know who is listening.
- **Buffering**: Handles spikes in traffic by queuing messages.
- **Durability**: Ensures messages aren't lost if the consumer is temporarily down.
- **Example**: Kafka (High throughput, log-based), RabbitMQ (Complex routing, AMQP).
