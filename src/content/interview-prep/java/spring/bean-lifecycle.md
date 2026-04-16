---
title: "Bean Lifecycle in Spring?"
category: "spring"
order: 1
---

The Spring Bean lifecycle is managed by the Spring Container.

1. **Instantiation**: The container creates the bean instance.
2. **Populate Properties**: Dependencies are injected.
3. **Aware Interfaces**: If the bean implements `BeanNameAware`, `BeanFactoryAware`, etc., those methods are called.
4. **Post Processor (Before)**: `postProcessBeforeInitialization` is called.
5. **Initialisation**: `afterPropertiesSet` (InitializingBean) or custom init-method.
6. **Post Processor (After)**: `postProcessAfterInitialization` is called.
7. **Ready**: Bean is ready for use.
8. **Destruction**: `destroy` (DisposableBean) or custom destroy-method.
