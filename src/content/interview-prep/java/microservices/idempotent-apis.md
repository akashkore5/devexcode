---
title: "What are Idempotent APIs? Examples with GET, PUT, DELETE"
category: "microservices"
order: 26
---

### What is Idempotency?
An API is **idempotent** if making the **same request multiple times** produces the **same result** as making it once. The server state doesn't change after the first call.

> **Analogy**: Pressing an elevator button 5 times has the same effect as pressing it once — the elevator is still called.

### HTTP Methods & Idempotency

| Method | Idempotent? | Safe? | Explanation |
|--------|:-----------:|:-----:|-------------|
| **GET** | ✅ Yes | ✅ Yes | Retrieves data. `GET /users/1` always returns the same user (no state change) |
| **PUT** | ✅ Yes | ❌ No | Replaces a resource. `PUT /users/1 {name: "Akash"}` — calling 10 times still results in the same user state |
| **DELETE** | ✅ Yes | ❌ No | `DELETE /users/1` — first call deletes, subsequent calls return 404 but **server state is unchanged** |
| **PATCH** | ❌ Maybe | ❌ No | Depends on implementation. `PATCH /users/1 {age: age+1}` is NOT idempotent (increments each time) |
| **POST** | ❌ No | ❌ No | `POST /orders {item: "phone"}` — each call creates a **new** order |

### Why Does Idempotency Matter?
In distributed systems, **network failures** and **retries** are inevitable:

```
Client → POST /payments {amount: 5000}     → 200 OK (payment created)
Client → [timeout, no response received]
Client → POST /payments {amount: 5000}     → 200 OK (DUPLICATE payment! ❌)
```

Without idempotency, the user is charged **twice**.

### Making POST Idempotent: Idempotency Keys
```java
@PostMapping("/payments")
public ResponseEntity<Payment> createPayment(
    @RequestHeader("Idempotency-Key") String idempotencyKey,
    @RequestBody PaymentRequest request
) {
    // Check if this key was already processed
    Optional<Payment> existing = paymentRepo.findByIdempotencyKey(idempotencyKey);
    if (existing.isPresent()) {
        return ResponseEntity.ok(existing.get()); // Return cached result
    }
    
    // First time — process the payment
    Payment payment = paymentService.process(request);
    payment.setIdempotencyKey(idempotencyKey);
    paymentRepo.save(payment);
    return ResponseEntity.status(201).body(payment);
}
```

Client sends a unique key per logical operation:
```
POST /payments
Idempotency-Key: "txn-abc-123"
{amount: 5000}
```

### PUT vs POST — The Idempotency Difference
```java
// PUT — Idempotent: replaces the ENTIRE resource
PUT /users/1
{ "name": "Akash", "age": 25 }
// Call 1: Sets user to {name: Akash, age: 25}
// Call 2: Sets user to {name: Akash, age: 25}  ← Same state

// POST — NOT Idempotent: creates a NEW resource each time
POST /users
{ "name": "Akash", "age": 25 }
// Call 1: Creates user with id=1
// Call 2: Creates user with id=2  ← Different state!
```

### Real-World Examples

| Service | Idempotency Strategy |
|---------|---------------------|
| **Stripe** | `Idempotency-Key` header on all POST requests |
| **Razorpay** | Unique `receipt` ID for order creation |
| **AWS SQS** | `MessageDeduplicationId` for FIFO queues |
| **Kafka** | Producer `enable.idempotence=true` with sequence numbers |
