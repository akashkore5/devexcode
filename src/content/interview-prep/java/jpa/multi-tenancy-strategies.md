---
title: "Multi-tenancy strategies with Spring Data JPA."
category: "jpa"
order: 43
---

### 1. DB per Tenant:
Each tenant has its own physical database instance. High isolation, high cost.

### 2. Schema per Tenant:
One database instance, but each tenant has its own schema (namespace). Good balance of isolation and cost.

### 3. Shared Schema (Discriminator):
All tenants share the same tables. A `tenant_id` column distinguishes between them. Easiest to scale, requires strict logic to prevent data leaks.

### Implementation:
Use a `AbstractRoutingDataSource` to dynamically switch databases based on the current tenant's context (stored in a `ThreadLocal`).
