---
title: "Microservices vs Monolith Architecture."
category: "microservices"
order: 1
---

### Monolith:
- Single codebase where all features (UI, DB access, Logic) are bundled together.
- **Pros**: Easy to develop, test, and deploy initially.
- **Cons**: Becomes a "Big Ball of Mud". Difficult to scale individual components. Single point of failure.

### Microservices:
- Collection of small, independent services communicating over a network (REST/gRPC).
- **Pros**:
  - **Scalability**: Scale only the service that needs it.
  - **Resilience**: A failure in one service doesn't necessarily bring down the whole app.
  - **Tech Diversity**: Different services can use different languages/DBs.
- **Cons**: Increased operational complexity, distributed transaction challenges, network latency.
