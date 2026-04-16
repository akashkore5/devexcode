---
title: "ACID Properties in Databases."
category: "db"
order: 15
---

1. **Atomicity**: "All or nothing". Either the whole transaction follows through, or none of it does.
2. **Consistency**: A transaction takes the database from one valid state to another valid state, maintaining all constraints/triggers.
3. **Isolation**: Concurrent transactions are independent. They should not see intermediate states of each other.
4. **Durability**: Once a transaction is committed, its changes are permanent, even in the case of a system crash.
