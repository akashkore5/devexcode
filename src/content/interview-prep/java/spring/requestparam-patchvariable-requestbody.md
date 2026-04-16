---
title: "@RequestParam vs @PathVariable vs @RequestBody."
category: "spring"
order: 10
---

### 1. @PathVariable:
Used to extract values from the URL template.
- URL: `/users/123`
- Code: `@GetMapping("/users/{id}") public User get(@PathVariable String id) { ... }`

### 2. @RequestParam:
Used for query parameters (key-value pairs) in the URL.
- URL: `/users?id=123`
- Code: `@GetMapping("/users") public User get(@RequestParam String id) { ... }`

### 3. @RequestBody:
Used to extract the body of the request (typically JSON) and deserialize it into a Java object.
- Code: `@PostMapping("/users") public void save(@RequestBody User user) { ... }`
