---
title: "View vs Materialized View."
category: "db"
order: 21
---

### Standard View:
- A "Virtual Table" (saved query).
- **Storage**: Does not store data physically.
- **Performance**: Runs the underlying query every time the view is called. Best for simplifying complex joins.

### Materialized View:
- A physical table that stores the result of the query.
- **Storage**: Occurs physical disk space.
- **Performance**: Very fast (just reading a table). Best for complex aggregations that don't change often.
- **Refresh**: Needs to be updated/refreshed manually or on a schedule.
