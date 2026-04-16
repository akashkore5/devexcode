---
title: "Why ListIterator has add() method but Iterator does not have?"
category: "collections"
order: 23
---

### Iterator vs ListIterator:
1. **Direction**: `Iterator` can only move forward. `ListIterator` can move both forward and backward.
2. **Support**: `Iterator` works with all collections. `ListIterator` only works with `List` implementations.
3. **Modification**: `Iterator` only supports `remove()`. `ListIterator` supports `add()`, `set()`, and `remove()`.

### Why no add() in Iterator?
- `Iterator` is designed to be universal for all collections (Set, List, Queue).
- Not all collections support adding elements at a specific point during iteration (e.g., in a `Set`, where would you add it? In a `Queue`, order is strict).
- `ListIterator` is specific to indexed lists, where adding an element at the current cursor position is a well-defined operation.
