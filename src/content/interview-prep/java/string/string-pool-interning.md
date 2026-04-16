---
title: "What is String interning and the String Pool?"
category: "string"
order: 2
---

### String Pool:
A special storage area in the JVM Metaspace (formerly PermGen) that stores a single copy of each unique string literal.

### String Interning:
- When a literal is used (`"abc"`), the JVM automatically checks the pool.
- If it exists, the reference is returned. If not, the string is added to the pool.
- `s.intern()`: Manually ensures that if the pool already contains a string equal to this `String` object, the pool's reference is returned.
