import {
  Workflow, GitPullRequest, Container, Settings, Zap,
  Server, Cpu, Database, Shield, ShieldCheck, HardDrive, Cloud, Activity, Users
} from "lucide-react";
import type { FlowNode, FlowPath } from '../../../../components/flows/FlowCanvas';

export const authNodes: FlowNode[] = [
  {
    id: "client",
    title: "User Client Node",
    subtitle: "SPA Web Browser",
    status: "idle",
    metrics: { label: "Client TLS", value: "v1.3" },
    x: 80, y: 110,
    description: "The client browser captures user credentials and initiates a secure TLS encrypted handshake over HTTPS.",
    details: [
      "Transport layer protection: Encrypts credential payloads via TLS 1.3.",
      "Input validation: Sanitizes inputs before dispatching requests to block XSS payloads.",
      "Storage policy: Holds authentication JWT tokens in memory or secure httpOnly cookie stores."
    ],
    interviewQuestions: [
      {
        question: "Why should you store JWTs in httpOnly cookies instead of localStorage?",
        answer: "localStorage is vulnerable to Cross-Site Scripting (XSS) attacks. httpOnly cookies prevent client-side JavaScript from reading the token, mitigating XSS-based session highjacking."
      }
    ],
    tradeOffs: [
      {
        choice: "localStorage vs. httpOnly Cookies",
        pros: "localStorage allows direct access from frontend scripts, enabling easy header injection.",
        cons: "localStorage is fully vulnerable to malicious XSS script access."
      }
    ],
    failureModes: [
      {
        scenario: "Client requests block due to expired SSL certificates.",
        mitigation: "Configure automated certificate renewal pipelines using Let's Encrypt and monitor expiry durations."
      }
    ],
    cliCommands: [
      {
        command: "curl -X POST https://devexcode.com/api/login -d '{\"email\":\"user@devexcode.com\"}'",
        why: "To send secure login payloads manually and test API connectivity.",
        what: "Resolves DNS, negotiates TLS 1.3, transmits JSON payloads, and outputs response headers.",
        output: "➜ HTTP/2 202 Accepted\n  Set-Cookie: __Host-session=xyz; Secure; HttpOnly; SameSite=Strict"
      }
    ],
    icon: Users
  },
  {
    id: "api_gw",
    title: "API Ingress Gateway",
    subtitle: "Kong API Ingress",
    status: "idle",
    metrics: { label: "Rate Limit", value: "OK" },
    x: 260, y: 110,
    description: "The ingress API gateway terminates SSL certificates, rate-limits user traffic, and routes requests down.",
    details: [
      "SSL termination: Decrypts HTTPS payloads at cluster borders to relieve down-stream nodes.",
      "Rate limiting: Implements sliding-window counter policies to prevent brute-force attacks.",
      "Dynamic routing: Inspects endpoint headers to map targets."
    ],
    interviewQuestions: [
      {
        question: "What is SSL Termination and what are its performance trade-offs?",
        answer: "SSL termination handles complex cryptographic decryption at the gateway level, allowing downstream cluster microservices to process requests in fast, plain-text HTTP without repeating TLS handshakes."
      }
    ],
    tradeOffs: [
      {
        choice: "SSL Termination vs. SSL Passthrough",
        pros: "SSL termination decrypts payloads at gateway borders, enabling deep inspection and rate limiting.",
        cons: "SSL passthrough provides end-to-end security but increases CPU overhead on downstream worker nodes."
      }
    ],
    failureModes: [
      {
        scenario: "DDoS spikes overwhelm API Gateway memory limits.",
        mitigation: "Configure scale-out configurations with multiple gateway pods behind network load balancers."
      }
    ],
    cliCommands: [
      {
        command: "curl -I https://devexcode.com/api/v1/auth/status",
        why: "To verify routing and retrieve rate limiting status headers.",
        what: "Initiates an HTTP HEAD check, parses response headers, and reports rate-limiting metrics.",
        output: "➜ X-RateLimit-Limit: 100\n  X-RateLimit-Remaining: 99\n  X-RateLimit-Reset: 58"
      }
    ],
    icon: Shield
  },
  {
    id: "auth_svc",
    title: "Auth Service Node",
    subtitle: "Identity Controller",
    status: "idle",
    metrics: { label: "Uptime", value: "99.99%" },
    x: 440, y: 110,
    description: "Contains authentication core logic, validating credentials and coordinating databases checks.",
    details: [
      "Hashing checks: Employs Bcrypt password validation (salt rounds: 12).",
      "Account security: Triggers lock-out timers after 5 failed authentication attempts.",
      "Decoupled models: Isolates identity records from core business databases."
    ],
    interviewQuestions: [
      {
        question: "What is Bcrypt salting and why is it resistant to brute force?",
        answer: "Bcrypt combines password strings with randomized salts before hashing. It incorporates a configurable 'work factor' (cost) to intentionally slow down computation times, mitigating offline brute-force attacks."
      }
    ],
    tradeOffs: [
      {
        choice: "Bcrypt Cost Factor: 10 vs. 14",
        pros: "Cost 10 is fast, returning query validations within 100ms.",
        cons: "Cost 14 is secure but requires up to 1.5 seconds of CPU time, creating potential DoS vulnerabilities."
      }
    ],
    failureModes: [
      {
        scenario: "Bcrypt operations cause 100% CPU spikes during high-concurrency login surges.",
        mitigation: "Isolate the authentication microservice and scale instances horizontally using CPU autoscalers."
      }
    ],
    cliCommands: [
      {
        command: "npm run test:auth",
        why: "Runs automated credential hashing validations.",
        what: "Executes identity check unit tests locally to verify salt assignments and verify hashing logic.",
        output: "➜ Bcrypt verification test: PASS (salt round cost: 12, latency: 84ms)"
      }
    ],
    icon: Settings
  },
  {
    id: "database",
    title: "User DB",
    subtitle: "PostgreSQL Database",
    status: "idle",
    metrics: { label: "Query Latency", value: "4ms" },
    x: 440, y: 290,
    description: "Performs user profile queries to verify registered records and compare credentials.",
    details: [
      "Index query patterns: Uses indexed lookups on user email fields (unique B-Tree indexes).",
      "Connection pooling: Employs connection limit layers to prevent DB thread exhaustion.",
      "Replication systems: Syncs user updates to read-replicas instantly."
    ],
    interviewQuestions: [
      {
        question: "Why should you index the 'email' field in user registration database tables?",
        answer: "Enforcing a B-Tree index on unique email fields shifts database queries from slow O(N) sequential table scans to O(log N) indexed lookups, reducing response times."
      }
    ],
    tradeOffs: [
      {
        choice: "PostgreSQL Connection Pools vs. Dynamic Connections",
        pros: "Reuses pre-allocated sockets, avoiding the latency of repeatedly establishing TCP connections.",
        cons: "Locks resources; idle pools can exhaust system sockets if not configured with strict timeouts."
      }
    ],
    failureModes: [
      {
        scenario: "Postgres thread pools fill up during read spikes, dropping incoming queries.",
        mitigation: "Deploy connection pool management proxies (e.g. pgBouncer) and scale read-replicas."
      }
    ],
    cliCommands: [
      {
        command: "psql -U postgres -c \"EXPLAIN ANALYZE SELECT * FROM users WHERE email='user@devexcode.com';\"",
        why: "To inspect database performance and verify query index utilization.",
        what: "Compiles query paths, returns database execution plans, and details index scan metrics.",
        output: "➜ Index Scan using users_email_idx on users (cost=0.15..8.21 rows=1 width=244) (actual time=0.045ms)"
      }
    ],
    icon: Database
  },
  {
    id: "jwt_issuer",
    title: "JWT Generator Node",
    subtitle: "Asymmetric RS256 Issuer",
    status: "idle",
    metrics: { label: "Crypto", value: "RS256" },
    x: 620, y: 110,
    description: "Signs dynamic, secure JSON Web Tokens with private cryptographic keys.",
    details: [
      "Cryptographic signing: Implements RS256 asymmetric signing algorithms.",
      "Payload parameters: Registers unique claims including user ID, token expiration, and permission scopes.",
      "Rotation schedules: Auto-rotates private cryptographic keys every 30 days."
    ],
    interviewQuestions: [
      {
        question: "What is the difference between RS256 and HS256 JWT signing algorithms?",
        answer: "HS256 uses a single shared secret key for signing and verification. RS256 uses an asymmetric key pair: a private key signs the token, and a public key verifies it. This is secure because downstream microservices only need the public key."
      }
    ],
    tradeOffs: [
      {
        choice: "Asymmetric RS256 vs. Symmetric HS256",
        pros: "Downstream services don't require access to private signing keys, preventing key leaks.",
        cons: "RS256 is computationally heavier and requires robust public key distribution configurations."
      }
    ],
    failureModes: [
      {
        scenario: "Private key is compromised, enabling attackers to mint arbitrary administrator tokens.",
        mitigation: "Enforce rotation parameters using KMS/Vault and immediately invalidate compromised keys via JWKS."
      }
    ],
    cliCommands: [
      {
        command: "openssl genrsa -out private.pem 2048",
        why: "Generates secure asymmetric 2048-bit RSA private keys.",
        what: "Executes standard RSA key-generation algorithms, writes PEM headers, and exports key hashes.",
        output: "➜ Generating RSA private key, 2048 bit long modulus...\n  e is 65537 (0x010001)"
      }
    ],
    icon: ShieldCheck
  },
  {
    id: "redis",
    title: "Session Cache Node",
    subtitle: "In-Memory Redis",
    status: "idle",
    metrics: { label: "Cache Hit Ratio", value: "98.4%" },
    x: 620, y: 290,
    description: "Caches authorization metadata and token validation status for extremely fast, sub-millisecond retrieval.",
    details: [
      "Sub-millisecond latency: Queries RAM-locked key-value states in ~1ms.",
      "Dynamic invalidation: Sets automatic token TTL matching access token expirations.",
      "Token blacklisting: Registers revoked token hashes instantly to invalidate sessions."
    ],
    interviewQuestions: [
      {
        question: "How do you invalidate a stateless JWT token before its natural expiration?",
        answer: "Maintain a high-performance Redis cache of revoked token hashes. Downstream services check the Redis blacklist before processing requests. The blacklisted token automatically expires after its original TTL."
      }
    ],
    tradeOffs: [
      {
        choice: "In-Memory Session Caches vs. Database lookups",
        pros: "Provides sub-millisecond lookup speeds, shielding primary SQL databases from read spikes.",
        cons: "Data is volatile; cache node crashes will terminate all active session validations."
      }
    ],
    failureModes: [
      {
        scenario: "Redis runs out of memory, dropping active session blacklist states.",
        mitigation: "Configure Redis eviction policies to volatile-lru and scale with multi-AZ replication."
      }
    ],
    cliCommands: [
      {
        command: "redis-cli GET session:user@devexcode.com",
        why: "Queries Redis session keys to check token status.",
        what: "Executes socket connections to the Redis daemon and runs in-memory key-value lookups.",
        output: "➜ \"{\\\"status\\\":\\\"active\\\",\\\"roles\\\":[\\\"user\\\"],\\\"exp\\\":1786524300}\""
      }
    ],
    icon: HardDrive
  },
  {
    id: "apis",
    title: "Protected APIs Node",
    subtitle: "Secure Resource API",
    status: "idle",
    metrics: { label: "Resource status", value: "200 OK" },
    x: 800, y: 110,
    description: "The targeted business service APIs which validate incoming bearer headers and return secure data.",
    details: [
      "Access validation: Parses Bearer tokens and validates signatures against public JWKS endpoints.",
      "Role-based check: Evaluates scopes inside JWT payloads before serving resources.",
      "Payload mapping: Compiles and returns secure business JSON payloads."
    ],
    interviewQuestions: [
      {
        question: "How do downstream microservices verify JWT signatures without contacting the identity service on every request?",
        answer: "Downstream services fetch the public key array (JWKS) during boot. They cache this key locally and verify JWT signatures offline, entirely eliminating authentication network latency."
      }
    ],
    tradeOffs: [
      {
        choice: "Local Offline JWT Signature Verification vs. API Gateway Authorization",
        pros: "Minimizes inner-service networking loops and scales microservices independently.",
        cons: "Slightly harder to manage instant global logouts without an active cache checker hook."
      }
    ],
    failureModes: [
      {
        scenario: "JWKS endpoints crash, preventing downstream APIs from verifying valid user signatures.",
        mitigation: "Cache public JWKS elements locally in microservice memory with fallback timers."
      }
    ],
    cliCommands: [
      {
        command: "curl -H \"Authorization: Bearer eyJhbGc...\" https://devexcode.com/api/v1/profile",
        why: "Simulates an authenticated user request to verify access controls.",
        what: "Constructs HTTP GET requests, appends authorization headers, validates JWTs, and processes outputs.",
        output: "➜ HTTP/2 200 OK\n  Content-Type: application/json\n  {\"username\":\"akash\",\"role\":\"dev\"}"
      }
    ],
    icon: Cpu
  }
];

export const authPaths: FlowPath[] = [
  { from: "client", to: "api_gw", type: "normal" },
  { from: "api_gw", to: "auth_svc", type: "normal" },
  { from: "auth_svc", to: "database", type: "database" },
  { from: "database", to: "jwt_issuer", type: "normal" },
  { from: "jwt_issuer", to: "redis", type: "cache" },
  { from: "redis", to: "apis", type: "normal" }
];

export const authLogs = [
  "[INFO] Client: POST request submitted to /api/v1/auth/login. TLS handshake successful.",
  "[INFO] Gateway: Access check passed. Client IP: 198.162.1.4. Forwarding to Auth node.",
  "[INFO] Auth Service: Query received. Validating email format 'user@devexcode.com'.",
  "[INFO] DB: Establishing connection block. Querying users table for 'user@devexcode.com'...",
  "[INFO] DB: User profile fetched. Comparing password hashes using Bcrypt standard...",
  "[INFO] DB: Credentials match verified. SQL Query successfully terminated in 4ms.",
  "[INFO] JWT Generator: Encoding payload claims. Target role permissions: [user:read, user:write].",
  "[INFO] JWT Generator: Signing token hash using RS256 cryptographic private key...",
  "[INFO] JWT Generator: Signed JWT access token created: 'eyJhbGciOiJSUzI1NiIsIn...' Uptime stable.",
  "[INFO] Cache: Caching validation token state to Redis to prevent continuous DB lookup hits.",
  "[INFO] Cache: Stored key 'session:user@devexcode.com' with Expire TTL set to 3600 seconds.",
  "[INFO] APIs: User requested profile page with Header 'Authorization: Bearer <JWT>'",
  "[INFO] APIs: JWT Signature verified against public signing key. Token valid.",
  "[SUCCESS] APIs: Permission matched. Access granted. Status code: 200 OK. Session established!"
];
