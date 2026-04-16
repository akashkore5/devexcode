---
title: "@Autowired, @Primary, and @Qualifier."
category: "spring"
order: 3
---

### Collision Handling:
When multiple beans of the same type exist and you try to `@Autowired` one, Spring will throw a `NoUniqueBeanDefinitionException`.

### Solutions:
1. **@Primary**: Marks one bean as the default choice.
2. **@Qualifier("name")**: Explicitly specifies which bean to inject by its ID/Name.
3. **Naming Convention**: If you name your variable the same as the bean ID, Spring uses that to resolve the dependency (less reliable than Qualifiers).
