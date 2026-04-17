---
title: "Spring Boot Auto-Configuration: How does it work internally?"
category: "spring"
order: 35
---

### What is Auto-Configuration?
Spring Boot **automatically configures beans** based on the libraries present on your classpath and the properties you've set. You don't write boilerplate `@Bean` definitions for common setups.

> Example: If `spring-boot-starter-data-jpa` is on the classpath, Spring Boot auto-configures a `DataSource`, `EntityManagerFactory`, and `TransactionManager` — without you writing a single `@Bean`.

### How Does It Work Internally?

#### Step 1: `@SpringBootApplication` triggers it
```java
@SpringBootApplication
// This is equivalent to:
@SpringBootConfiguration
@EnableAutoConfiguration  // ← The magic starts here
@ComponentScan
```

#### Step 2: `@EnableAutoConfiguration` loads candidates
- This annotation imports `AutoConfigurationImportSelector`.
- The selector reads **`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`** (Spring Boot 3.x) or `META-INF/spring.factories` (Spring Boot 2.x) from ALL jars on the classpath.
- These files list hundreds of auto-configuration classes.

```
# Example: spring-boot-autoconfigure jar
org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration
org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration
```

#### Step 3: `@Conditional` annotations filter what applies
Each auto-configuration class uses **conditional annotations** to decide whether to activate:

| Annotation | Condition |
|-----------|-----------|
| `@ConditionalOnClass` | Class is on classpath |
| `@ConditionalOnMissingBean` | No user-defined bean of this type exists |
| `@ConditionalOnProperty` | A specific property is set |
| `@ConditionalOnWebApplication` | Running as a web app |

```java
@Configuration
@ConditionalOnClass(DataSource.class)                    // Only if JDBC is on classpath
@ConditionalOnMissingBean(DataSource.class)              // Only if user hasn't defined one
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {
    
    @Bean
    public DataSource dataSource(DataSourceProperties props) {
        return DataSourceBuilder.create()
            .url(props.getUrl())
            .username(props.getUsername())
            .build();
    }
}
```

### The Priority Rule
> **Your beans always win.** If you define a `@Bean DataSource`, Spring Boot's auto-configured `DataSource` backs off because of `@ConditionalOnMissingBean`.

### Debugging Auto-Configuration
```properties
# Add to application.properties
debug=true
```
This prints the **Auto-Configuration Report** at startup:
- **Positive matches**: Auto-configs that were applied.
- **Negative matches**: Auto-configs that were skipped (and why).

### Flow Summary
```
@SpringBootApplication
    → @EnableAutoConfiguration
        → AutoConfigurationImportSelector
            → Reads META-INF/spring.factories (or .imports)
                → Loads candidate classes
                    → @Conditional filters
                        → Only matching beans are created
```
