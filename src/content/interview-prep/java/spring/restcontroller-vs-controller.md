---
title: "@RestController vs @Controller."
category: "spring"
order: 4
---

### @Controller:
- Used for traditional Spring MVC web applications.
- Typically returns a **View** (HTML/JSP) via a ViewResolver.
- Requires `@ResponseBody` on methods if you want to return data (JSON/XML).

### @RestController:
- A specialized version of `@Controller`.
- Equivalent to `@Controller + @ResponseBody`.
- Every method's return value is automatically serialized into the response body (typically JSON).
