---
title: "Client-side vs Server-side Load Balancing (L4 vs L7)."
category: "microservices"
order: 21
---

### 1. Client-side vs Server-side LB:
- **Server-side**: Request hits a central LB (like Nginx), which then routes to an instance. (Pros: Simple. Cons: Central point of failure).
- **Client-side**: The calling service (Client) gets a list of instances from Service Discovery (Eureka) and decides which one to call. (Pros: Better performance, no central hop).

### 2. Layer 4 vs Layer 7:
- **Layer 4 (Transport)**: Routes based on IP and Port. Very fast.
- **Layer 7 (Application)**: Routes based on URL path, Headers, or Cookies. Slower but much more "Intelligent". Most microservices use L7 for routing.
