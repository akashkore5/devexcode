---
title: "Distributed Tracing (Sleuth and Zipkin)."
category: "microservices"
order: 5
---

### Why needed?
In Microservices, a single request might traverse 10+ services. Without tracing, it's impossible to know where a delay or error occurred.

### Key Concepts:
- **Trace ID**: A unique ID for the entire request journey.
- **Span ID**: A unique ID for a specific segment/hop (service call) within that journey.

### Implementation:
- **Spring Cloud Sleuth / Micrometer**: Automatically adds Trace IDs and Span IDs to logs and headers.
- **Zipkin**: A visual UI to see the timing and flow of these traces across services.
