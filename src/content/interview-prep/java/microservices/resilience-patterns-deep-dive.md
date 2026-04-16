---
title: "Fault Tolerance vs Resilience (and Bulkhead pattern)."
category: "microservices"
order: 15
---

### 1. Fault Tolerance vs Resilience:
- **Fault Tolerance**: The internal ability of a system to continue operating despite a component failure. (Hardware redundancy).
- **Resilience**: The external ability of a system to recover from failures and absorb shocks while maintaining service (Software patterns like Circuit Breakers).

### 2. Bulkhead Pattern:
Iterated from the hull of a ship. It isolates system parts into pools so that if one fails, the others continue.
- **Thread Pool Bulkhead**: Limit the number of threads for a specific service call.
- **Semaphore Bulkhead**: Limit the number of concurrent executions.

### 3. Retry with Exponential Backoff:
Instead of retrying immediately, wait longer between each attempt (1s, 2s, 4s...) to give the downstream service time to recover.
