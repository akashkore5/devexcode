---
title: "@ControllerAdvice vs @RestControllerAdvice."
category: "spring"
order: 25
---

### @ControllerAdvice:
- A global exception handler that works across multiple controllers.
- Typically returns a View (for MVC).

### @RestControllerAdvice:
- Specialized version: **@ControllerAdvice + @ResponseBody**.
- Ideal for REST APIs. Returns serialized objects (like a custom ErrorResponse) directly to the client.

### Method Example:
```java
@ExceptionHandler(UserNotFoundException.class)
public ResponseEntity<ErrorDetails> handleUserNotFound(UserNotFoundException ex) {
    return new ResponseEntity<>(new ErrorDetails(ex.getMessage()), HttpStatus.NOT_FOUND);
}
```
