---
title: "How to implement custom validation annotations?"
category: "spring"
order: 33
---

1. **Create the Annotation**:
```java
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MyValidator.class)
public @interface MyConstraint {
    String message() default "Invalid value";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

2. **Implement the Validator**:
```java
public class MyValidator implements ConstraintValidator<MyConstraint, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value != null && value.startsWith("ABC");
    }
}
```

3. **Use it on DTO**:
```java
@MyConstraint
private String code;
```
