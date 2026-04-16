---
title: "How Spring Boot auto-configures Jackson?"
category: "spring"
order: 32
---

### 1. Auto-Configuration:
Spring Boot includes `spring-boot-starter-json` which provides the **ObjectMapper** bean.

### 2. Customizing Jackson:
- **Application Properties**: Use `spring.jackson.*` properties (e.g., `spring.jackson.date-format`).
- **Jackson2ObjectMapperBuilderCustomizer**: Register a bean of this type for fine-grained control.
- **@JsonIgnore / @JsonProperty**: Use annotations on your DTOs to control serialization/deserialization.

### 3. Java 8 Support:
Spring Boot automatically registers the `JavaTimeModule` to handle `LocalDateTime` and other Java 8 date types.
