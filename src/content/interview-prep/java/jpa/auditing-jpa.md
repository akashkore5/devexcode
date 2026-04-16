---
title: "How to implement auditing in Spring Data JPA?"
category: "jpa"
order: 42
---

1. **Enable Auditing**: Add `@EnableJpaAuditing` to your configuration class.
2. **Add Annotations to Entity**:
```java
@Entity
@EntityListeners(AuditingEntityListener.class)
public class BaseEntity {
    @CreatedDate
    private LocalDateTime createdDate;

    @LastModifiedDate
    private LocalDateTime lastModifiedDate;

    @CreatedBy
    private String createdBy;
}
```
3. **AuditorAware**: Implement this interface to tell Spring who the "current user" is (usually from Spring Security context).
