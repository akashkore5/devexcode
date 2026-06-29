import {
  Workflow, GitPullRequest, Container, Settings, Zap,
  Server, Cpu, Database, Shield, ShieldCheck, HardDrive, Cloud, Activity, Users
} from "lucide-react";
import type { FlowNode, FlowPath } from '../../../../components/flows/FlowCanvas';

export const lbNodes: FlowNode[] = [
  {
    id: "clients",
    title: "Clients Pool Node",
    subtitle: "Distributed Reqs",
    status: "idle",
    metrics: { label: "Req Rate", value: "1.2k rps" },
    x: 80, y: 200,
    description: "Multiple web and mobile clients sending concurrent requests to the system boundaries.",
    details: [
      "Concurrency load modeling: Simulates up to 1,200 concurrent socket connections.",
      "Global traffic routing: Spreads queries across multiple network routing endpoints.",
      "Transport security: Mandates encrypted TLS 1.3 tunnels for all incoming connections."
    ],
    interviewQuestions: [
      {
        question: "Why does TLS 1.3 offer better latency performance compared to TLS 1.2?",
        answer: "TLS 1.3 reduces the handshake sequence from 2 round-trips to 1 round-trip (1-RTT). It also supports 0-RTT session resumption, significantly cutting connection setup latency for returning clients."
      }
    ],
    tradeOffs: [
      {
        choice: "TLS 1.3 vs. TLS 1.2 specifications",
        pros: "Provides 1-RTT connection setup times and modern, secure cipher suites.",
        cons: "Can fail on obsolete client browsers that do not support modern ciphers."
      }
    ],
    failureModes: [
      {
        scenario: "Client requests drop due to network routing loop configurations.",
        mitigation: "Implement automated Route53 geo-routing DNS health checks to redirect traffic."
      }
    ],
    cliCommands: [
      {
        command: "openssl s_client -connect lb.devexcode.com:443 -tls1_3",
        why: "Manually validates TLS 1.3 configurations on the load balancer ingress.",
        what: "Initiates a secure TLS socket connection to verify handshakes and active ciphers.",
        output: "➜ New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384\n  Secure Renegotiation IS NOT supported"
      }
    ],
    icon: Users
  },
  {
    id: "balancer",
    title: "Nginx Load Balancer",
    subtitle: "Ingress ALB proxy",
    status: "idle",
    metrics: { label: "Algorithm", value: "Least-Conn" },
    x: 260, y: 200,
    description: "Performs SSL decryption, applies health heartbeat probes, and maps least-connections routing.",
    details: [
      "Traffic distribution logic: Evaluates real-time node workloads to map least-connections routing pathways.",
      "SSL termination configuration: Handles TLS decryption to route decrypted HTTP downstream.",
      "Heartbeat query loop: Runs continuous health heartbeats to detect and isolate backend node failures."
    ],
    interviewQuestions: [
      {
        question: "Why is the Least-Connections algorithm preferred over standard Round-Robin for backend microservices?",
        answer: "Microservices process diverse request payloads with highly variable compute costs. Round-Robin can overload a single instance with heavy tasks, whereas Least-Connections balances workloads by directing traffic to nodes with the fewest active TCP sockets."
      }
    ],
    tradeOffs: [
      {
        choice: "Least-Connections vs. Consistent Hashing routing",
        pros: "Least-Connections provides dynamic, resource-aware workload balancing.",
        cons: "Consistent Hashing is required if backend nodes rely on localized memory caches, as it maps identical clients to identical nodes."
      }
    ],
    failureModes: [
      {
        scenario: "The load balancer experiences a single point of failure (SPOF) crash.",
        mitigation: "Deploy multiple active load balancer instances behind public AWS Route53 Anycast VIP configurations."
      }
    ],
    cliCommands: [
      {
        command: "nginx -T | grep -A 10 upstream",
        why: "To inspect active Nginx upstream load balancing definitions.",
        what: "Parses active configuration syntax structures and outputs upstream backend mappings.",
        output: "➜ upstream backend_nodes {\n    least_conn;\n    server 10.0.8.20 max_fails=2 fail_timeout=10s;\n    server 10.0.8.21 max_fails=2 fail_timeout=10s;\n  }"
      }
    ],
    icon: Shield
  },
  {
    id: "srvA",
    title: "Server Node A",
    subtitle: "Active Upstream Host",
    status: "idle",
    metrics: { label: "Workload CPU", value: "32%" },
    x: 460, y: 100,
    description: "Active server instance running normally, absorbing dynamic application loads.",
    details: [
      "Compute capacity: Handles up to 150 concurrent TCP sockets simultaneously.",
      "Host monitoring: Continually exports CPU usage, RAM utilization, and system metrics.",
      "Dynamic auto-discovery: Registered in Nginx upstream groups via automated consul hooks."
    ],
    interviewQuestions: [
      {
        question: "What is an active upstream server registration, and how do auto-discovery hooks function?",
        answer: "Active servers register their dynamic private IPs with a registry service (like Consul). Dynamic discovery hooks update the load balancer config in real time, avoiding static IP file updates."
      }
    ],
    tradeOffs: [
      {
        choice: "Stateless nodes vs. Stateful session nodes",
        pros: "Stateless nodes scale horizontally without requiring complex session synchronization layers.",
        cons: "Requires external sessions databases (e.g. Redis), adding networking hops."
      }
    ],
    failureModes: [
      {
        scenario: "Local connection leaks exhaust system sockets, blocking new queries.",
        mitigation: "Configure strict connection limits and enforce socket timeout configurations in runtime servers."
      }
    ],
    cliCommands: [
      {
        command: "ssh server-a \"ss -s\"",
        why: "To inspect active socket counts and verify TCP connection health.",
        what: "Launches an SSH tunnel, executes the Linux ss command, and outputs open socket allocations.",
        output: "➜ Total: 184 (kernel 244)\n  TCP:   42 (estab, pilot), closed 2, orth 0"
      }
    ],
    icon: Cpu
  },
  {
    id: "srvB",
    title: "Server Node B",
    subtitle: "Active Upstream Host",
    status: "idle",
    metrics: { label: "Workload CPU", value: "48%" },
    x: 460, y: 200,
    description: "Active server instance running normally, absorbing secondary balanced requests.",
    details: [
      "Compute capability: Mirrors Capacity configurations of Node A in different AZs.",
      "Resilient distribution: Receives balanced least-connections traffic.",
      "Uptime status: Dynamic heartbeats register 200 OK statuses."
    ],
    interviewQuestions: [
      {
        question: "How does deploying upstream servers across multiple Availability Zones (AZs) improve system resilience?",
        answer: "Deploying hosts across multiple AZs ensures that even if an entire physical AWS datacenter experiences a power outage or hardware failure, the load balancer automatically reroutes traffic to nodes in healthy zones."
      }
    ],
    tradeOffs: [
      {
        choice: "Multi-AZ host distribution vs. Single-AZ host groupings",
        pros: "Guarantees system resilience and high availability in physical disaster scenarios.",
        cons: "Adds minor inter-AZ data transmission networking costs."
      }
    ],
    failureModes: [
      {
        scenario: "High internal latency occurs due to database cross-AZ queries.",
        mitigation: "Deploy localized database read replicas in identical target AZ datacenters."
      }
    ],
    cliCommands: [
      {
        command: "ssh server-b \"free -m\"",
        why: "Inspects system RAM utilization on Node B to check cache states.",
        what: "Establishes a remote terminal session and runs native Linux memory aggregation diagnostics.",
        output: "➜        total        used        free      shared  buff/cache   available\n  Mem:    7982        3820        1420         128        2742        3842"
      }
    ],
    icon: Cpu
  },
  {
    id: "srvC",
    title: "Server Node C",
    subtitle: "Failing Upstream",
    status: "idle",
    metrics: { label: "Workload CPU", value: "0%" },
    x: 460, y: 300,
    description: "Experiencing hardware network timeouts. Triggers Nginx health probe failure states.",
    details: [
      "Failure diagnostics: Simulates hardware timeouts, returning socket-level 503 errors.",
      "Connection draining: The load balancer initiates connection draining to close active sockets gracefully.",
      "Dynamic exclusion: Isolated from active upstream pools instantly by health checkers."
    ],
    interviewQuestions: [
      {
        question: "What is Connection Draining and why is it critical when de-registering servers?",
        answer: "Connection Draining allows active requests on a de-registering node to finish processing within a defined timeout (e.g. 30s) while blocking new incoming requests, preventing abrupt client connection drops."
      }
    ],
    tradeOffs: [
      {
        choice: "Instant node isolation vs. Draining grace periods",
        pros: "Draining grace periods prevent active user queries from dropping and throwing errors.",
        cons: "Delays instance shutdowns, temporarily consuming resources during scale-in events."
      }
    ],
    failureModes: [
      {
        scenario: "The server crashes abruptly without connection draining, causing active user queries to fail.",
        mitigation: "Ensure client requests implement automatic HTTP retry policies for idempotent endpoints."
      }
    ],
    cliCommands: [
      {
        command: "ssh server-c \"systemctl status api-service\"",
        why: "To inspect service daemon states on the failing host instance.",
        what: "Queries the Linux systemd controller to check process status and view standard error logs.",
        output: "➜ api-service.service - backend API service\n  Active: failed (Result: core-dump since Sun 16:04:12)"
      }
    ],
    icon: Cpu
  },
  {
    id: "router",
    title: "Failover Router",
    subtitle: "Traffic Redirector",
    status: "idle",
    metrics: { label: "Failovers", value: "Active" },
    x: 660, y: 200,
    description: "Detects node failures instantly, dynamically removing unhealthy nodes from Nginx backend upstream lists.",
    details: [
      "Failover orchestration: Automatically intercepts upstream routing tables when failures occur.",
      "Traffic redirection: Reroutes incoming queries from Node C to active healthy nodes A/B.",
      "Dynamic health monitoring: Runs continuous health heartbeats to identify when Node C recovers."
    ],
    interviewQuestions: [
      {
        question: "How do active and passive health checks differ in load balancing architectures?",
        answer: "Active health checks proactively query backend endpoints at defined intervals (e.g. every 5s). Passive health checks monitor actual client request responses; if a server throws multiple consecutive errors, it is dynamically isolated."
      }
    ],
    tradeOffs: [
      {
        choice: "Proactive Active Health checks vs. Passive monitoring loops",
        pros: "Active health checks detect server failures *before* clients hit them, avoiding errors.",
        cons: "Creates minor, continuous background traffic overhead on internal services."
      }
    ],
    failureModes: [
      {
        scenario: "Health checkers mark healthy servers as dead due to tight timeout settings, causing cascading failures.",
        mitigation: "Configure realistic timeout thresholds and use robust healthy/unhealthy threshold parameters."
      }
    ],
    cliCommands: [
      {
        command: "curl http://localhost:8080/upstream_status",
        why: "Queries the Nginx status endpoint to verify failover routing states.",
        what: "Initiates local HTTP checks to extract operational performance logs and active upstreams.",
        output: "➜ Upstreams: backend_nodes\n  Node A: Online (Up)\n  Node B: Online (Up)\n  Node C: Offline (Down)"
      }
    ],
    icon: Settings
  },
  {
    id: "response",
    title: "Response Unified",
    subtitle: "Consolidated Out",
    status: "idle",
    metrics: { label: "Uptime Rate", value: "100%" },
    x: 820, y: 200,
    description: "Aggregates successful responses to clients, preventing user-facing HTTP 502/503 errors.",
    details: [
      "Client resilience: Clients experience consistent responses without knowing that Node C crashed.",
      "Error concealment: Mitigates upstream errors by routing traffic to healthy nodes.",
      "Latency stabilization: Stabilizes average response times under 22ms."
    ],
    interviewQuestions: [
      {
        question: "How does the load balancer conceal backend server failures from clients?",
        answer: "When Nginx detects an upstream failure (e.g., a connection timeout or 503 error), it automatically retries the request against a different backend server (using 'proxy_next_upstream'), concealing the failure from the client."
      }
    ],
    tradeOffs: [
      {
        choice: "Enable proxy_next_upstream vs. Return immediate errors",
        pros: "Hides transient host errors from clients, maintaining a seamless user experience.",
        cons: "Can double request latency if the initial node times out before the retry is sent."
      }
    ],
    failureModes: [
      {
        scenario: "The load balancer retries non-idempotent POST requests, causing duplicate transactions.",
        mitigation: "Configure proxy_next_upstream to only retry idempotent methods (e.g., GET, HEAD, OPTIONS)."
      }
    ],
    cliCommands: [
      {
        command: "curl -I -X GET https://lb.devexcode.com/status",
        why: "Verifies public accessibility and checks load balancer response headers.",
        what: "Launches TLS 1.3 handshakes, resolves public nameservers, and reads HTTP response headers.",
        output: "➜ HTTP/2 200 OK\n  server: nginx\n  x-lb-healthy-upstreams: 2/3"
      }
    ],
    icon: Server
  }
];

export const lbPaths: FlowPath[] = [
  { from: "clients", to: "balancer", type: "normal" },
  { from: "balancer", to: "srvA", type: "normal" },
  { from: "balancer", to: "srvB", type: "normal" },
  { from: "balancer", to: "srvC", type: "error" },
  { from: "srvC", to: "router", type: "error" },
  { from: "router", to: "srvA", type: "normal" },
  { from: "srvA", to: "response", type: "normal" }
];

export const lbLogs = [
  "[INFO] Reqs: Generating distributed HTTP request spikes. Rate: 1,200 req/sec.",
  "[INFO] Nginx LB: SSL Decryption validated. Proxying HTTP requests downstream...",
  "[INFO] Nginx LB: Round-robin algorithm assigned: Routing connections to upstreams.",
  "[INFO] Server A: Heartbeat check passed (200 OK). Active connections: 42. CPU: 32%.",
  "[INFO] Server B: Heartbeat check passed (200 OK). Active connections: 58. CPU: 48%.",
  "[WARN] Server C: Heartbeat probe failed! Socket connection timeout at 10.0.8.21.",
  "[WARN] Failover: Server C marked UNHEALTHY. Dynamic upstream list updating...",
  "[WARN] Failover: Initiating connection draining on Server C (active sockets closed safely).",
  "[SUCCESS] Failover: Rerouted 100% of Server C load to Server A. Latency stable at 22ms.",
  "[SUCCESS] Response: Aggregated balanced outputs. Uptime: 100.00%. Zero errors. Success!"
];
