---
title: "Best practices for REST endpoints and URL naming."
category: "spring"
order: 30
---

### 1. Nouns, not Verbs
- **Good**: `/users`, `/orders/123`
- **Bad**: `/getUser`, `/createNewOrder`

### 2. Pluralization
- Use plural nouns for collections: `/products` instead of `/product`.

### 3. Use HTTP Methods Correctly
- **GET**: Retrieve data.
- **POST**: Create new resource.
- **PUT**: Update/Replace entire resource.
- **PATCH**: Partial update.
- **DELETE**: Remove resource.

### 4. Categorization (Sub-resources)
- `/users/123/orders`: Gets all orders for user 123.

### 5. Versioning
- Use URL versioning: `/api/v1/users`.
