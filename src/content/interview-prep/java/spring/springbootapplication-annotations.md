---
title: "What does @SpringBootApplication comprise of?"
category: "spring"
order: 5
---

It is a convenience annotation that combines three key annotations:

1. **@SpringBootConfiguration**: Tags the class as a source of bean definitions for the application context.
2. **@EnableAutoConfiguration**: Tells Spring Boot to start adding beans based on classpath settings, other beans, and various property settings.
3. **@ComponentScan**: Tells Spring to look for other components, configurations, and services in the package, allowing it to find and register beans.
