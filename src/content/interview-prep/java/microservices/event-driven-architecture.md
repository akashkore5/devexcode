---
title: "Event Driven Architecture (EDA)."
category: "microservices"
order: 6
---

### What is it?
An architecture where services communicate via **Events** (something that happened in the past, like "OrderCreated") instead of direct synchronous commands ("CreateOrder").

### Components:
- **Event Producer**: Emits the event.
- **Event Consumer**: Reacts to the event.
- **Message Broker**: Intermediate storage (Kafka, RabbitMQ) that decouples producers from consumers.

### Benefits:
- **Extreme Decoupling**: Producers don't know who is consuming the event.
- **High Availability**: If a consumer is down, it can process the message later.
- **Scalability**: Easy to add more consumers to handle high load.
