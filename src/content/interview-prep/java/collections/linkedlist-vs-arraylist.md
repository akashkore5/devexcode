---
title: "LinkedList vs ArrayList: When to use which?"
category: "collections"
order: 4
---

### Use ArrayList when:
- Frequent **retrieval/access** operations (O(1)).
- Adding elements to the end of the list.
- Memory is a concern (LinkedList has node overhead).

### Use LinkedList when:
- Frequent **insertions/deletions** in the middle or beginning (O(1) once position is found, no array shifting).
- Implementing a Queue or Deque.
