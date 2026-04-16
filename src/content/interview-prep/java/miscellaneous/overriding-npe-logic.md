---
title: "Method Overriding and NullPointerException rules."
category: "miscellaneous"
order: 11
---

### Scenario:
Superclass method throws `NullPointerException` (Checked/Unchecked?).
Parent method: `void process() throws NullPointerException { ... }`

### Question:
Can Child override it with `void process() throws RuntimeException { ... }`?

### Answer: **Yes.**
- `NullPointerException` is a **RuntimeException** (Unchecked).
- If the superclass method throws an unchecked exception, the child can throw **any** unchecked exception (including `RuntimeException` itself, which is a superclass of NPE).
- Rules for broader exceptions only apply to **Checked Exceptions**.
