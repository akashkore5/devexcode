---
title: "Event Sourcing vs Traditional CRUD."
category: "microservices"
order: 10
---

### CRUD (Traditional):
- Stores the **current state** of the entity in the database.
- Past states are lost unless you have an audit log.

### Event Sourcing:
- Stores the **entire history of events** (changes) for an entity.
- The current state is replayed from the event log whenever needed (or via cached snapshots).
- **Benefit**: "Audit by design". You can see exactly what changed and why at any point in time.
- **Challenge**: Complexity in querying (usually paired with CQRS).
