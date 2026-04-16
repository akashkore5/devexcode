---
title: "12-Factor App and CAP Theorem."
category: "microservices"
order: 23
---

### 1. 12-Factor App:
A set of best practices for building scalable, portable, and manageable cloud-native applications. Key factors include:
- **Codebase**: One codebase, multiple deploys.
- **Config**: Store config in the environment.
- **Backing Services**: Treat DBs/Queues as attached resources.
- **Statelessness**: Processes should be stateless.

### 2. CAP Theorem:
In a distributed system, you can only have 2 out of 3:
1. **Consistency**: Every read receives the most recent write.
2. **Availability**: Every request receives a response (not necessarily the latest).
3. **Partition Tolerance**: The system continues to operate despite network partitions.

**Key Insight**: In our world, network partitions happen. So we must choose between **CP** (Consistency) or **AP** (Availability).
