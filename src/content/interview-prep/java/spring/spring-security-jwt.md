---
title: "Securing APIs with Spring Security and JWT."
category: "spring"
order: 20
---

### Why JWT (JSON Web Token)?
- Stateless, scalable, and ideal for microservices.

### JWT Structure:
- **Header**: Algorithm and token type.
- **Payload**: Claims (User info, expiration, etc.).
- **Signature**: Verifies that the sender is who they say they are and ensures the message wasn't changed.

### Authentication Flow:
1. User logs in with credentials.
2. Server validates and returns a JWT.
3. User sends JWT in the `Authorization` header for subsequent requests.
4. Server validates signature using a **Secret Key**.
