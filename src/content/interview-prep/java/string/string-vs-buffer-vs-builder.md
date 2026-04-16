---
title: "String vs StringBuffer vs StringBuilder."
category: "string"
order: 3
---

| Feature | String | StringBuffer | StringBuilder |
| :--- | :--- | :--- | :--- |
| **Mututability** | Immutable | Mutable | Mutable |
| **Thread Safe** | Yes | Yes (Synchronized) | No |
| **Performance** | Slow (for mods) | Moderate | Fast |
| **Intro Version** | Java 1.0 | Java 1.0 | Java 5.0 |

**Winner**: Use `StringBuilder` for single-threaded string manipulations.
