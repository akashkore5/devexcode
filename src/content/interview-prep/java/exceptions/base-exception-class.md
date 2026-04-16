---
title: "Base class for Error and Exception? Throwable."
category: "exceptions"
order: 1
---

**Throwable** is the superclass of all errors and exceptions in the Java language.

### Hierarchy:
- **Object**
  - **Throwable**
    - **Error**: Serious problems (OutOfMemory, StackOverflow). Apps should not catch these.
    - **Exception**: Problems that a well-written app might want to catch.
      - **RuntimeException**: Unchecked.
      - **Checked Exceptions**: Logic/Environment errors.
