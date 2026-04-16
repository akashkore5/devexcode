---
title: "Lifecycle of a REST request in Spring Boot (DispatcherServlet)."
category: "spring"
order: 15
---

1. **Request Received**: The request hits the `DispatcherServlet`.
2. **Handler Mapping**: The servlet consults `HandlerMapping` to find which Controller method should handle the request.
3. **Handler Adapter**: `DispatcherServlet` uses `HandlerAdapter` to invoke the method.
4. **Controller Execution**: Logic runs inside your `@Controller`.
5. **View Resolver**: (If MVC) Result is resolved to a view. (If REST) The result is directly serialized into the response body by message converters.
6. **Response Sent**: The response is sent back to the client.
