---
title: "Rules for throwing Exceptions when overriding methods."
category: "exceptions"
order: 6
---

### 1. If Parent throws no Exception:
- Child can throw **Unchecked** (RuntimeException).
- Child **cannot** throw **Checked** exceptions.

### 2. If Parent throws Checked Exception:
- Child can throw the **same** exception.
- Child can throw a **subclass** of the parent's exception.
- Child **cannot** throw a broader/different checked exception.
- Child can throw no exception at all.

### Summary: 
Overriding methods can never throw broader checked exceptions than the original method.
