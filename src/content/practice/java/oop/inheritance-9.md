---
title: "9. Covariant Return Types: Specificity"
category: "oop"
order: 9
---

### Scenario
Can an overriding method return a different type than the original? Yes, if it's a subclass of the original return type.

### Code Block
```java
class Food {}
class Pizza extends Food {}

class Restaurant {
    Food order() {
        return new Food();
    }
}

class Pizzeria extends Restaurant {
    @Override
    Pizza order() { // Covariant return type (Pizza is a Food)
        return new Pizza();
    }
}

public class Main {
    public static void main(String[] args) {
        Restaurant res = new Pizzeria();
        Food f = res.order();
        System.out.println("Ordered: " + f.getClass().getSimpleName());
    }
}
```

### Expected Output
```text
Ordered: Pizza
```

### Explanation
- **Covariant Return**: Introduced in Java 5. An overriding method can return a subtype of the type returned by the overridden method.
- **Benefits**: Allows for more specific typing and avoids unnecessary casting.

### Execution Flow
1. `Pizzeria` object created.
2. `res.order()` called on `Pizzeria` object.
3. JVM dispatches to `Pizzeria.order()`.
4. A `Pizza` object is returned and stored in a `Food` reference.

### Deep Dive
Before Java 5, overriding methods had to have the exact same return type. Covariant returns make the API cleaner when working with hierarchies. Note: This only works for return types, not parameter types (changing parameters would be overloading, not overriding).
