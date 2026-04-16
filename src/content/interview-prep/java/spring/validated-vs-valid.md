---
title: "@Valid vs @Validated."
category: "spring"
order: 7
---

| Feature | @Valid | @Validated |
| :--- | :--- | :--- |
| **Source** | JSR-303 (Standard Bean Validation) | Spring Specific |
| **Scope** | Methods, Fields, Params | Class level (enables method-level validation) |
| **Groups** | No support for validation groups | **Supports validation groups** |
| **Nested** | Used to trigger nested validation | Not used for nesting |

**Use Case**: Use `@Validated` at the Controller level to enable validation of RequestParams/PathVariables.
