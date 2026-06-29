import {
  Workflow, GitPullRequest, Container, Settings, Zap,
  Server, Cpu, Database, Shield, ShieldCheck, HardDrive, Cloud, Activity, Users
} from "lucide-react";
import type { FlowNode, FlowPath } from '../../../../components/flows/FlowCanvas';

export const cacheNodes: FlowNode[] = [
  {
    id: "app",
    title: "Application Client",
    subtitle: "Client Frontend App",
    status: "idle",
    metrics: { label: "GraphQL Qs", value: "4820/m" },
    x: 80, y: 110,
    description: "The application initiates a query request, asking for a specific profile or dataset.",
    details: [
      "API request formulation: Constructs structured REST or GraphQL queries.",
      "Telemetry tracking: Tracks initial query launch times to compute client-perceived latency.",
      "Connection reuse: Employs HTTP/2 multiplexing pipelines to reduce socket overhead."
    ],
    interviewQuestions: [
      {
        question: "How does HTTP/2 multiplexing improve client API performance compared to HTTP/1.1?",
        answer: "HTTP/1.1 requires opening separate TCP connections or queueing requests (Head-of-Line blocking). HTTP/2 multiplexes multiple parallel requests over a single TCP connection, reducing connection overhead."
      }
    ],
    tradeOffs: [
      {
        choice: "GraphQL queries vs. REST endpoints",
        pros: "GraphQL queries allow the client to request only the specific fields it needs, saving bandwidth.",
        cons: "GraphQL complicates server-side response caching, as request structures can vary infinitely."
      }
    ],
    failureModes: [
      {
        scenario: "Client requests queue up because of local browser connection limit constraints.",
        mitigation: "Transition API requests to HTTP/2 and optimize asset delivery."
      }
    ],
    cliCommands: [
      {
        command: "curl https://devexcode.com/api/v1/user/992a -w \"\\nTime: %{time_total}s\"",
        why: "To measure API response times and verify cache performance.",
        what: "Initiates a client API query, records request duration metrics, and reports total latency.",
        output: "➜ {\"id\":\"992a\",\"name\":\"akash\"}\n  Time: 0.045s (Miss fallback)"
      }
    ],
    icon: Users
  },
  {
    id: "api",
    title: "API Router",
    subtitle: "Backend Server",
    status: "idle",
    metrics: { label: "Router Engine", value: "NestJS" },
    x: 260, y: 110,
    description: "Accepts dynamic query requests, checks rate limits, and proxies queries to the cache layer.",
    details: [
      "Cache-Aside pattern implementation: Implements logical checks: read cache, fetch DB on miss, backfill cache.",
      "Deserialization processing: Parses queries into validated memory objects.",
      "Logging infrastructure: Dispatches telemetry payloads to monitoring pipelines."
    ],
    interviewQuestions: [
      {
        question: "Explain the logical flow of the Cache-Aside (Lazy Loading) caching pattern.",
        answer: "1. The application queries the cache for data. 2. If it is a Cache Hit, it returns the data immediately. 3. If it is a Cache Miss, the application queries the database, returns the data, and writes it back to the cache for subsequent queries."
      }
    ],
    tradeOffs: [
      {
        choice: "Cache-Aside vs. Write-Through caching patterns",
        pros: "Cache-Aside is resilient to cache node failures; database queries serve as a robust fallback.",
        cons: "Cache Misses introduce higher initial latency for the first request."
      }
    ],
    failureModes: [
      {
        scenario: "A sudden traffic spike causes a Cache Stampede (Thundering Herd) when a key expires.",
        mitigation: "Implement mutex locks (single-flight loaders) or configure soft expirations with background updates."
      }
    ],
    cliCommands: [
      {
        command: "node -e \"console.log(process.memoryUsage())\"",
        why: "To inspect Node.js API server heap memory allocation.",
        what: "Executes JavaScript bindings to fetch V8 engine memory profiles directly.",
        output: "➜ { rss: 88421000, heapTotal: 44210000, heapUsed: 32410000 }"
      }
    ],
    icon: Settings
  },
  {
    id: "redis",
    title: "Redis Cache Node",
    subtitle: "Memory Store",
    status: "idle",
    metrics: { label: "Redis Hit Rate", value: "92.4%" },
    x: 460, y: 110,
    description: "A fast, memory-locked database which queries keys instantly to achieve sub-millisecond lookups.",
    details: [
      "In-memory storage: Locks key-value states in fast, volatile system RAM, avoiding slow disk read operations.",
      "Eviction algorithms: Employs volatile-lru configurations to evict least-recently-used keys when memory limits are hit.",
      "Data formatting: Stores JSON values as compact strings or structured hash tables."
    ],
    interviewQuestions: [
      {
        question: "What is the volatile-lru eviction policy in Redis and when is it triggered?",
        answer: "volatile-lru (Least Recently Used) is triggered when Redis hits its memory limit. It evicts the least recently used keys, but only among those configured with an active expiration TTL."
      }
    ],
    tradeOffs: [
      {
        choice: "Redis Hashes vs. Stringified JSON strings",
        pros: "Hashes allow updating individual object fields without pulling and rewriting the entire payload.",
        cons: "Stringified JSON is easier to compress and store as a single, simple key value."
      }
    ],
    failureModes: [
      {
        scenario: "Data inconsistency occurs because updates bypass the cache, leaving stale values in memory.",
        mitigation: "Enforce cache eviction in application mutation hooks or set short, conservative TTL limits."
      }
    ],
    cliCommands: [
      {
        command: "redis-cli GET user:992a:profile",
        why: "To query Redis session cache keys manually.",
        what: "Queries the Redis server port, executes an in-memory key lookup, and prints the result.",
        output: "➜ \"{\\\"username\\\":\\\"akash\\\",\\\"tier\\\":\\\"premium\\\"}\""
      }
    ],
    icon: HardDrive
  },
  {
    id: "database",
    title: "PostgreSQL DB",
    subtitle: "Persistent Disk SQL",
    status: "idle",
    metrics: { label: "Disk Read Lat", value: "45ms" },
    x: 460, y: 290,
    description: "The primary persistent database queried on a cache miss to fetch original profile records from disk.",
    details: [
      "Disk I/O operations: Performs heavy SSD disk seek actions to pull master SQL records.",
      "Query compilation: Plans parsing, compiles parameters, and reads active database records.",
      "Transactional integrity: Enforces ACID guarantees on all operations."
    ],
    interviewQuestions: [
      {
        question: "What are ACID properties in database systems?",
        answer: "ACID stands for: Atomicity (all-or-nothing transactions), Consistency (state transitions validate rules), Isolation (concurrent transactions don't interfere), and Durability (committed data is persistently written to disk)."
      }
    ],
    tradeOffs: [
      {
        choice: "Relational SQL (Postgres) vs. NoSQL (MongoDB)",
        pros: "Provides strict relational schemas, ACID transactional guarantees, and robust JOIN capabilities.",
        cons: "Harder to scale horizontally; schema changes require running structural migrations."
      }
    ],
    failureModes: [
      {
        scenario: "A cache failure exposes the primary database to a massive read surge, causing connection timeout crashes.",
        mitigation: "Implement circuit breaker patterns on the API layer and utilize database read replicas."
      }
    ],
    cliCommands: [
      {
        command: "psql -U postgres -d devex -c \"SELECT * FROM profiles WHERE user_id='992a';\"",
        why: "Directly queries the SQL database to verify persistent record states.",
        what: "Launches a PostgreSQL client query session, reads tablespace indexes on disk, and prints output rows.",
        output: "➜ user_id | name  | tier\n  992a    | akash | premium"
      }
    ],
    icon: Database
  },
  {
    id: "writer",
    title: "Cache Backfiller",
    subtitle: "Write Daemon",
    status: "idle",
    metrics: { label: "Writes Status", value: "Ready" },
    x: 660, y: 290,
    description: "Backfills SQL database records into the cache to speed up subsequent queries.",
    details: [
      "Asynchronous backfilling: Writes retrieved SQL rows back to Redis cache keys asynchronously.",
      "TTL assignment: Attaches default 3600-second expiration limits to prevent stale data lingering in memory.",
      "Lock controls: Prevents concurrent backfill collisions using lightweight optimistic locking configurations."
    ],
    interviewQuestions: [
      {
        question: "Why should cached database records always have an active expiration TTL?",
        answer: "Setting a Time-to-Live (TTL) ensures that stale data is eventually evicted from memory, preventing silent data drift if updates bypass cache invalidation logic."
      }
    ],
    tradeOffs: [
      {
        choice: "Async Cache Backfill vs. Sync Blocking Backfill",
        pros: "Async backfilling unblocks the user response immediately, delivering fast response times.",
        cons: "Slight race condition risk if a duplicate write request arrives before the async write finishes."
      }
    ],
    failureModes: [
      {
        scenario: "The backfiller crashes, leaving keys unpopulated and causing continuous database query hits.",
        mitigation: "Configure automated backfill recovery loops and set alert thresholds on cache misses."
      }
    ],
    cliCommands: [
      {
        command: "redis-cli SETEX user:992a:profile 3600 \"{\\\"name\\\":\\\"akash\\\"}\"",
        why: "Manually caches a profile payload with a 1-hour expiration TTL.",
        what: "Fires a SET command to Redis with expiration parameters, allocating and storing data in RAM.",
        output: "➜ OK (Key user:992a:profile created with TTL 3600s)"
      }
    ],
    icon: Zap
  },
  {
    id: "sender",
    title: "Data Dispatcher",
    subtitle: "Output Compiler",
    status: "idle",
    metrics: { label: "Sender Status", value: "200 OK" },
    x: 820, y: 110,
    description: "Returns the validated data record back to the user app, closing the read-through loop.",
    details: [
      "JSON response parsing: Formats response payloads into validated, compliant JSON structures.",
      "Compression policies: Applies dynamic gzip or brotli compression to minimize payload size.",
      "Caching headers: Attaches Cache-Control headers to enable browser-level caching."
    ],
    interviewQuestions: [
      {
        question: "How do Brotli compression and Gzip compression compare for API payloads?",
        answer: "Brotli uses a modern dictionary-based algorithm that yields smaller payloads than Gzip, particularly for text assets like JSON, reducing client bandwidth consumption."
      }
    ],
    tradeOffs: [
      {
        choice: "Server Compression vs. Client-side decompressing processing overhead",
        pros: "Significantly reduces network transmission size and transfer latency.",
        cons: "Adds minor CPU processing latency on the server during high concurrency surges."
      }
    ],
    failureModes: [
      {
        scenario: "Heavy payload sizes trigger network transmission delays and client timeouts.",
        mitigation: "Configure pagination limits and strip out unused fields from responses."
      }
    ],
    cliCommands: [
      {
        command: "curl -I -H \"Accept-Encoding: br\" https://devexcode.com/api/v1/user/992a",
        why: "Tests if the API router successfully compresses responses using Brotli.",
        what: "Initiates a connection, specifies Brotli support in headers, and checks response compression fields.",
        output: "➜ HTTP/2 200 OK\n  Content-Encoding: br\n  Vary: Accept-Encoding"
      }
    ],
    icon: Cpu
  }
];

export const cachePaths: FlowPath[] = [
  { from: "app", to: "api", type: "normal" },
  { from: "api", to: "redis", type: "normal" },
  { from: "redis", to: "database", type: "database" },
  { from: "database", to: "writer", type: "normal" },
  { from: "writer", to: "redis", type: "cache" },
  { from: "redis", to: "sender", type: "normal" }
];

export const cacheLogs = [
  "[INFO] App: Initiated profile request for user ID '992a' over REST protocol.",
  "[INFO] API Server: Checked endpoint routing limits. Query payload valid.",
  "[INFO] Redis Cache: Performing memory lookup for key 'user:992a:profile'...",
  "[WARN] Redis Cache: Cache Miss! Key 'user:992a:profile' does not exist in memory.",
  "[WARN] Postgres DB: Cache miss fallback. Executing primary disk query for user '992a'...",
  "[INFO] Postgres DB: Fetched user record successfully. Disk query latency: 45ms.",
  "[INFO] Cache Writer: Triggering backfill sequence for Redis cache database...",
  "[SUCCESS] Cache Writer: Backfilled key 'user:992a:profile' successfully. TTL: 3600s.",
  "[INFO] Redis Cache: Secondary query execution successful. Latency: 1.8ms.",
  "[SUCCESS] Data Sender: Compiled JSON response payload. Returned 200 OK. Success!"
];
