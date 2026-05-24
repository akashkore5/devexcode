'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Workflow, GitPullRequest, Container, Settings, Zap, ArrowLeft,
  Server, Cpu, Database, Shield, ShieldCheck, HelpCircle, HardDrive, CheckCircle2,
  Users, Cloud, Activity, ArrowDown, Sparkles, ArrowRight, VolumeX, AlertTriangle, PlayCircle
} from "lucide-react";
import FlowCanvas, { FlowNode, FlowPath, CliCommandInfo } from "../../../components/flows/FlowCanvas";
import LogsPanel from "../../../components/flows/LogsPanel";
import MetricsPanel from "../../../components/flows/MetricsPanel";
import SimulationControls from "../../../components/flows/SimulationControls";
import { Button } from "../../../components/ui/button";

// ==========================================================
// 1. CI/CD DEPLOYMENT FLOW CONFIGURATION (DEEP INTERVIEW PREP)
// ==========================================================
const deploymentNodes: FlowNode[] = [
  {
    id: "dev",
    title: "Developer Node",
    subtitle: "Local Git Workspace",
    status: "idle",
    metrics: { label: "Commits", value: "c8f921a" },
    x: 80, y: 110,
    description: "The pipeline begins when an engineer pushes code changes. Direct pushes to main are blocked, forcing feature branches.",
    details: [
      "Syntax protection: Runs pre-commit hooks executing ESLint and Prettier.",
      "Local testing: Executes JUnit or Jest unit test suites before commit registers.",
      "Vulnerability checks: Runs static application security testing (SAST) hooks."
    ],
    interviewQuestions: [
      {
        question: "Why should we enforce pre-commit Git hooks instead of only checking on the CI server?",
        answer: "Enforcing local pre-commit hooks saves expensive remote CI build runners from processing basic linting errors, syntax issues, or broken unit tests, establishing a fast feedback loop for developers."
      }
    ],
    tradeOffs: [
      {
        choice: "Local Hooks vs. Server-Only CI checks",
        pros: "Sub-second feedback loops; reduces remote pipeline CPU utilization.",
        cons: "Can be bypassed using --no-verify; requires local client configurations."
      }
    ],
    failureModes: [
      {
        scenario: "Local linter blocks critical production hotfix commit.",
        mitigation: "Use git commit --no-verify as a last resort, relying on server-side PR checks to maintain absolute build quality."
      }
    ],
    cliCommands: [
      {
        command: "git add . && git commit -m 'feat: auth service' && git push origin main",
        why: "To bundle local file modifications, index them as a secure Git snapshot, and upload them to GitHub.",
        what: "Creates compressed packfiles, executes local pre-commit hooks, registers index updates, and establishes an HTTPS/SSH session to verify permissions and push to the remote branch HEAD.",
        output: "➜ e89c8a1..c8f921a  main -> main\nEverything up-to-date."
      }
    ],
    icon: Users
  },
  {
    id: "git",
    title: "GitHub Webhooks",
    subtitle: "VCS Hosting Hub",
    status: "idle",
    metrics: { label: "Webhooks", value: "Active" },
    x: 260, y: 110,
    description: "GitHub hosts the Git repository, runs repository security scans, and fires webhook payloads.",
    details: [
      "Webhook architecture: Sends real-time POST payloads to Jenkins with commit details.",
      "Security scanning: Scans commit diffs for exposed secrets and API tokens automatically.",
      "Branch locks: Blocks merge actions until status checks are fully green."
    ],
    interviewQuestions: [
      {
        question: "How do you secure webhook payloads between GitHub and your build servers?",
        answer: "Define a secure Webhook Secret in GitHub settings. GitHub uses this secret to sign payloads using an HMAC-SHA256 signature, which the CI receiver validates before initiating builds."
      }
    ],
    tradeOffs: [
      {
        choice: "VCS-hosted CI (GitHub Actions) vs. External Build Servers (Jenkins)",
        pros: "Deeply integrated access management; zero external pipeline infrastructure to manage.",
        cons: "Higher runner concurrency pricing; less customizable plugin ecosystem."
      }
    ],
    failureModes: [
      {
        scenario: "Jenkins fails to receive webhook triggers due to network drops.",
        mitigation: "Implement automated polling fallback configurations in Jenkins or configure GitHub webhook retry limits."
      }
    ],
    cliCommands: [
      {
        command: "gh pr status && gh run list --limit 3",
        why: "To query active branch Pull Requests and check remote pipeline execution status.",
        what: "Queries the GitHub GraphQL API using the logged-in personal access token (PAT) to parse status metadata.",
        output: "➜ Active Pull Requests: 1\n➜ Actions Executions:\n  #142: CI Pipeline - Completed (Success)"
      }
    ],
    icon: GitPullRequest
  },
  {
    id: "jenkins",
    title: "Jenkins Master",
    subtitle: "CI Pipeline Engine",
    status: "idle",
    metrics: { label: "Build Num", value: "#421" },
    x: 440, y: 110,
    description: "Jenkins orchestrates high-performance build agents, compiles dynamic source code, and aggregates tests.",
    details: [
      "Pipeline-as-code: Configured via a declarative Jenkinsfile script inside the Git repository.",
      "Workspace isolation: Launches isolated build runner tasks to prevent dirty build cross-contamination.",
      "Artifact tracking: Archives testing reports and coverage charts."
    ],
    interviewQuestions: [
      {
        question: "What is the benefit of a Declarative Pipeline vs. a Scripted Pipeline in Jenkins?",
        answer: "Declarative pipelines offer a strict, pre-defined layout structure with clear error notifications, making them easier to read, maintain, and integrate with GitOps compared to arbitrary scripted pipelines."
      }
    ],
    tradeOffs: [
      {
        choice: "Dynamic Build Agents vs. Static VM Runners",
        pros: "Scales cost to zero when idle; isolates build environments inside fresh container scopes.",
        cons: "Spawning dynamic agents adds 30-60s build cold-start latency."
      }
    ],
    failureModes: [
      {
        scenario: "Jenkins Master disk becomes 100% full from workspace cache leaks.",
        mitigation: "Configure strict pipeline log rotation policies and use workspace cleaning post-build stages (cleanWs())."
      }
    ],
    cliCommands: [
      {
        command: "jenkinsfile-linter Jenkinsfile",
        why: "Validates local declarative Jenkins syntax schema configurations before committing.",
        what: "Sends the target file as a payload to the Jenkins engine validator endpoint to evaluate structural grammar.",
        output: "➜ Jenkinsfile successfully validated. Syntax matches Declarative Specification."
      }
    ],
    icon: Settings
  },
  {
    id: "docker",
    title: "Docker Build",
    subtitle: "Container Compiler",
    status: "idle",
    metrics: { label: "Image Size", value: "142 MB" },
    x: 620, y: 110,
    description: "Compiles the application binary into a highly optimized, lightweight Docker container layer.",
    details: [
      "Multi-stage builds: Compiles assets in heavy environments, copying outputs to tiny runtime layers.",
      "Base hardening: Employs minimal, read-only images like alpine or distroless to minimize vulnerability surfaces.",
      "CVE scanning: Scans compiled layers for CVE vulnerability disclosures using Trivy."
    ],
    interviewQuestions: [
      {
        question: "Why should you use multi-stage Docker builds for production services?",
        answer: "Multi-stage builds allow you to run heavy compilation tools and package managers in an initial stage, and copy only the final compiled binary into a minimal runner stage. This minimizes the production image size and reduces the vector for security exploits."
      }
    ],
    tradeOffs: [
      {
        choice: "Alpine Base Images vs. Distroless Base Images",
        pros: "Alpine includes standard shell utilities for easier shell debug queries.",
        cons: "Distroless has zero shells/package managers, minimizing security attack vectors to almost zero."
      }
    ],
    failureModes: [
      {
        scenario: "Docker build commands run slowly due to pulling heavy base layers on every build.",
        mitigation: "Implement build cache registries (docker build --cache-from) and use stable, cached base images."
      }
    ],
    cliCommands: [
      {
        command: "docker build --no-cache -t devexcode-app:c8f921a .",
        why: "To compile files into standard, immutable system image tags from fresh layers.",
        what: "Parses the local Dockerfile, runs steps in isolated container layers, registers layer checksum hashes, and saves the final bundle.",
        output: "➜ Step 1/5 : FROM node:20-alpine\nSuccessfully built sha256:d8a2f9"
      }
    ],
    icon: Container
  },
  {
    id: "registry",
    title: "ECR Registry",
    subtitle: "Container Image Hub",
    status: "idle",
    metrics: { label: "Pushes", value: "10/hr" },
    x: 800, y: 110,
    description: "Stores immutable, cryptographically signed Docker images ready for cluster distribution.",
    details: [
      "Image immutability: Tags cannot be overwritten, preventing production configuration changes.",
      "Static scanning: Automatically scans pushed images for software bugs.",
      "Access control: IAM role authentication controls image pull/push privileges."
    ],
    interviewQuestions: [
      {
        question: "What is ECR Image Tag Immutability and why is it critical?",
        answer: "Tag Immutability blocks developers from overwriting existing image tags (e.g. ':latest'). This prevents silent production drift, ensures rollback integrity, and guarantees audit trail accuracy."
      }
    ],
    tradeOffs: [
      {
        choice: "Public Container Registries vs. Private ECR Registries",
        pros: "Easier integration across public tooling platforms.",
        cons: "Lacks robust AWS IAM integration; risk of pulling unverified base image vulnerabilities."
      }
    ],
    failureModes: [
      {
        scenario: "Registry pull limits are reached, blocking Kubernetes pod scale events.",
        mitigation: "Enable local cluster pull cache registries or configure authenticated VPC endpoints to ECR."
      }
    ],
    cliCommands: [
      {
        command: "aws ecr get-login-password --region us-east-1 | docker login --username AWS",
        why: "Authenticates local build runners to securely push to ECR.",
        what: "Queries AWS STS to fetch a temporary 12-hour session authorization token and pipe-passes it to Docker login configs.",
        output: "➜ Login Succeeded. Auth token stored in config.json."
      }
    ],
    icon: Server
  },
  {
    id: "gitops",
    title: "GitOps Config",
    subtitle: "Declarative State Repo",
    status: "idle",
    metrics: { label: "Sync Status", value: "Synced" },
    x: 800, y: 290,
    description: "Hosts declarative Kubernetes manifests (Helm/Kustomize), serving as the absolute single source of truth.",
    details: [
      "Declarative configuration: Represents total cluster states as plain text YAML files.",
      "Infrastructure-as-code: Enables full auditing of changes via Git commit logs.",
      "Fast recovery: Recreating standard infrastructure takes seconds by re-applying GitOps states."
    ],
    interviewQuestions: [
      {
        question: "Why does GitOps mandate separating application code from environment deployment configurations?",
        answer: "Separating code from deployment configurations ensures that cluster updates don't trigger unnecessary code builds, isolates repository access controls, and blocks pipeline interference."
      }
    ],
    tradeOffs: [
      {
        choice: "Helm Charts vs. Plain Kubernetes YAML templates",
        pros: "Provides standard variable mappings, packaging releases, and easy rollback hooks.",
        cons: "Adds complexity with templating logic; hard to debug rendering issues in complex nested states."
      }
    ],
    failureModes: [
      {
        scenario: "Invalid syntax YAML files are merged into main, corrupting downstream clusters.",
        mitigation: "Run GitOps merge validation pipelines (e.g. kubeval, pluto) before pull requests are approved."
      }
    ],
    cliCommands: [
      {
        command: "helm lint ./charts/devexcode-app",
        why: "To verify Helm template values schema logic structures before syncing.",
        what: "Parses template parameters, evaluates structural logic against strict Kubernetes schemas, and reports warnings.",
        output: "➜ 0 chart(s) linted, 0 error(s) found. Templates conform to syntax models."
      }
    ],
    icon: Workflow
  },
  {
    id: "argocd",
    title: "ArgoCD Master",
    subtitle: "Continuous GitOps Router",
    status: "idle",
    metrics: { label: "Reconciliation", value: "3s" },
    x: 620, y: 290,
    description: "ArgoCD continuously monitors the GitOps repository, detects cluster drift, and applies updates.",
    details: [
      "Sync loop mechanism: Reconciles live cluster state with Git targets every 3 seconds.",
      "Drift rectification: Automatically overwrites manual cluster overrides to match Git snapshots.",
      "Zero-trust permissions: Applies updates purely via in-cluster service accounts, locking external APIs."
    ],
    interviewQuestions: [
      {
        question: "How does ArgoCD handle cluster config drift?",
        answer: "ArgoCD polls cluster endpoints, comparing raw live resources against targeted YAMLs in Git. If differences exist, it marks states as 'OutOfSync' and, if configured, triggers automatic sync updates."
      }
    ],
    tradeOffs: [
      {
        choice: "Pull-based CD (ArgoCD) vs. Push-based CD (Jenkins commands)",
        pros: "Enhanced cluster security; no external keys required; self-heals cluster drift configurations.",
        cons: "Adds runtime agent resource overhead in clusters; requires learning specialized CRD controllers."
      }
    ],
    failureModes: [
      {
        scenario: "Continuous Git synching issues occur due to rate limits on VCS servers.",
        mitigation: "Configure webhook triggers from Git to ArgoCD to bypass continuous API polling limits."
      }
    ],
    cliCommands: [
      {
        command: "argocd app get devexcode-prod && argocd app sync devexcode-prod",
        why: "To inspect state differences and force immediate cluster synchronization.",
        what: "Fires queries to the ArgoCD API server, downloads target Git templates, compares checksums, and updates resources.",
        output: "➜ Syncing app 'devexcode-prod'... Success. Application is Healthy."
      }
    ],
    icon: Zap
  },
  {
    id: "k8s",
    title: "AWS EKS Cluster",
    subtitle: "Kubernetes Orchestrator",
    status: "idle",
    metrics: { label: "Nodes Count", value: "6 Nodes" },
    x: 440, y: 290,
    description: "The core orchestration cluster running on AWS EKS, managing rolling service state upgrades.",
    details: [
      "Control Plane safety: Highly available control planes replicated across multiple availability zones.",
      "Network isolation: Applies strict NetworkPolicies to isolate running pods from external networks.",
      "Worker Node Groups: Managed Auto-Scaling worker groups handle incoming node demand."
    ],
    interviewQuestions: [
      {
        question: "What are the core control plane components of a standard Kubernetes cluster?",
        answer: "The control plane consists of: kube-apiserver (API core gateway), etcd (distributed key-value state store), kube-scheduler (assigns pods to nodes), and kube-controller-manager (runs control loops)."
      }
    ],
    tradeOffs: [
      {
        choice: "AWS Managed Node Groups vs. Self-Managed EC2 Workers",
        pros: "Automated operating system patching; easier instance rollouts and rolling updates.",
        cons: "Slightly less access configurations on low-level system settings."
      }
    ],
    failureModes: [
      {
        scenario: "etcd storage runs out of memory, stalling cluster scheduler assignments.",
        mitigation: "Deploy control planes in high-availability multi-AZ regions and monitor etcd compaction metrics."
      }
    ],
    cliCommands: [
      {
        command: "kubectl get nodes -o wide",
        why: "To fetch status and network details for active cluster worker nodes.",
        what: "Authenticates with EKS control API using local credentials and queries active node status maps.",
        output: "➜ NAME               STATUS   ROLES    AGE   VERSION\n  eks-worker-node1   Ready    <none>   14d   v1.28.2"
      }
    ],
    icon: Cloud
  },
  {
    id: "pods",
    title: "App Pods Node",
    subtitle: "Running Instances",
    status: "idle",
    metrics: { label: "Replicas", value: "3 Pods" },
    x: 260, y: 290,
    description: "Isolated pods hosting the container app instances, performing live readiness/liveness checks.",
    details: [
      "Rolling updates: Spawns new pods before terminating old instances (zero-downtime releases).",
      "Readiness probe: Queries /healthz endpoints to verify the database and caches are online before routing traffic.",
      "Resources isolation: Configures CPU/Memory requests and limits to prevent resource monopolization."
    ],
    interviewQuestions: [
      {
        question: "What is the difference between a Liveness Probe and a Readiness Probe in Kubernetes?",
        answer: "A Liveness Probe determines if a pod is alive (if it fails, K8s restarts it). A Readiness Probe determines if a pod is ready to accept incoming traffic (if it fails, the pod is removed from endpoints routing)."
      }
    ],
    tradeOffs: [
      {
        choice: "Soft CPU limits vs. Hard memory limits",
        pros: "Soft CPU limits allow pods to temporarily burst beyond requests when resources permit.",
        cons: "Hard memory limits trigger OOM-Killed terminations if exceeded, making them prone to memory leaks."
      }
    ],
    failureModes: [
      {
        scenario: "A memory leak triggers an OOMKilled exception on a running app container.",
        mitigation: "Configure alert warnings on container memory usage and implement robust graceful shutdown listeners."
      }
    ],
    cliCommands: [
      {
        command: "kubectl describe pod -l app=devexcode",
        why: "To inspect runtime health events, volume attachments, and probe statuses for running pods.",
        what: "Queries the API server for Pod resource specifications and logs real-time scheduling events.",
        output: "➜ Status: Running\n  IP: 10.0.4.12\n  Readiness: Ready (passed health check)"
      }
    ],
    icon: Cpu
  },
  {
    id: "users",
    title: "Web Users Node",
    subtitle: "Clients Gateway",
    status: "idle",
    metrics: { label: "Latency", value: "18ms" },
    x: 80, y: 290,
    description: "Clients access the system smoothly, absorbing zero-downtime rolling service releases.",
    details: [
      "Continuous runtime: Users access services without interruptions during pod transitions.",
      "CDN edge routing: Routes network queries through Cloudflare edge proxy configurations.",
      "Downtime protection: Maintains consistent connection states using SSL session caches."
    ],
    interviewQuestions: [
      {
        question: "How do you achieve 100% uptime deployments when releasing a major update?",
        answer: "Use rolling update strategies with configured readiness probes. MaxSurge allocates temporary pods, while MaxUnavailable ensures sufficient active instances remain online to process requests during updates."
      }
    ],
    tradeOffs: [
      {
        choice: "Rolling Updates vs. Blue-Green Deployments",
        pros: "Rolling updates conserve cloud budget because they do not require doubling cluster resources.",
        cons: "Blue-green allows instant rollbacks but doubles cloud infrastructure budget during merge events."
      }
    ],
    failureModes: [
      {
        scenario: "Users hit old pods returning expired cache records during deployments.",
        mitigation: "Implement version-aware cache key prefixes or run backward-compatible API designs."
      }
    ],
    cliCommands: [
      {
        command: "curl -I https://devexcode.com/healthz",
        why: "To run a manual HTTP request checking the active server connection health.",
        what: "Performs DNS lookup, initiates a TCP handshake, negotiates TLS 1.3, and reads response headers.",
        output: "➜ HTTP/2 200 OK\n  x-powered-by: Next.js\n  cache-control: private, no-cache"
      }
    ],
    icon: Users
  }
];

const deploymentPaths: FlowPath[] = [
  { from: "dev", to: "git", type: "normal" },
  { from: "git", to: "jenkins", type: "normal" },
  { from: "jenkins", to: "docker", type: "normal" },
  { from: "docker", to: "registry", type: "normal" },
  { from: "registry", to: "gitops", type: "normal" },
  { from: "gitops", to: "argocd", type: "normal" },
  { from: "argocd", to: "k8s", type: "normal" },
  { from: "k8s", to: "pods", type: "normal" },
  { from: "pods", to: "users", type: "normal" }
];

const deploymentLogs = [
  "[INFO] Git: Push detected on 'main' branch by user 'akashkore'. Commit: c8f921a.",
  "[INFO] GitHub Webhook: POST request sent successfully to Jenkins build server.",
  "[INFO] Jenkins: Job #421 triggered automatically. Running workspace checkout...",
  "[INFO] Jenkins: Node packages installed. Running ESLint syntax verification... Passed.",
  "[INFO] Jenkins: Running Jest test suite. 48 unit tests executed successfully.",
  "[INFO] Docker: Executing stage 'docker build -t ecr.devexcode.com/app:c8f921a .'",
  "[INFO] Docker: Layer 1 compiled: node:20-alpine base image successfully pulled.",
  "[INFO] Docker: Layer 2 compiled: Source files compiled. Image output size: 142MB.",
  "[INFO] Registry: Authenticating push request with Amazon Web Services IAM token...",
  "[INFO] Registry: Uploading layer sha256:d82fa7... Progress: [==================] 100%",
  "[INFO] GitOps: Updating Helm values.yaml. Target version updated from v1.4.1 to v1.5.0.",
  "[INFO] GitOps: Configuration files committed to GitLab repository automatically.",
  "[INFO] ArgoCD: Poll loop detected manifest revision update. Application State: OutOfSync.",
  "[INFO] ArgoCD: Sync request acknowledged. Applying delta resources to Kubernetes master...",
  "[INFO] K8s Cluster: Deployment configuration received. Rolling update initiated.",
  "[INFO] Pods: Container creating: 'devexcode-v2-7f9a2b'. Replicas current: 4 (1 pending).",
  "[INFO] Pods: Pod 'devexcode-v2-7f9a2b' running. Activating liveness health checks...",
  "[INFO] Pods: Readiness probe /healthz returned 200 OK. Dynamic registration success.",
  "[SUCCESS] Users: Traffic successfully shifted. Active version: v2. Downtime: 0ms. Success!"
];

// ==========================================================
// 2. OAUTH/JWT AUTHENTICATION FLOW (DEEP INTERVIEW PREP)
// ==========================================================
const authNodes: FlowNode[] = [
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

const authPaths: FlowPath[] = [
  { from: "client", to: "api_gw", type: "normal" },
  { from: "api_gw", to: "auth_svc", type: "normal" },
  { from: "auth_svc", to: "database", type: "database" },
  { from: "database", to: "jwt_issuer", type: "normal" },
  { from: "jwt_issuer", to: "redis", type: "cache" },
  { from: "redis", to: "apis", type: "normal" }
];

const authLogs = [
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

// ==========================================================
// 3. KUBERNETES AUTOSCALING FLOW (DEEP INTERVIEW PREP)
// ==========================================================
const scalingNodes: FlowNode[] = [
  {
    id: "traffic",
    title: "User Traffic Node",
    subtitle: "Inbound HTTP Surge",
    status: "idle",
    metrics: { label: "Req Rate", value: "350 rps" },
    x: 80, y: 200,
    description: "External user requests hitting the cloud boundaries, initiating scaling pipelines if demand spikes.",
    details: [
      "Simulated concurrency: Spikes workloads up to 8,500 requests/sec.",
      "Workload modeling: Models traffic spikes to evaluate scaling triggers and system limits.",
      "Edge routing protection: Applies rate-limit rules at Cloudflare borders."
    ],
    interviewQuestions: [
      {
        question: "Why should you run load tests using concurrent socket requests rather than simple linear scripts?",
        answer: "Linear scripts process queries sequentially, masking true concurrency dynamics. True load tests simulate multiple parallel client connections, mimicking production traffic spikes."
      }
    ],
    tradeOffs: [
      {
        choice: "Edge Rate Limiting vs. Service Rate Limiting",
        pros: "Edge rate limiting drops malicious requests at CDN borders, protecting API instances.",
        cons: "Slightly less customizable for deep, business-layer user tier limiting logic."
      }
    ],
    failureModes: [
      {
        scenario: "DDoS floods crash internal network routing nodes.",
        mitigation: "Configure automated Cloudflare mitigation shielding and strict edge ingress limits."
      }
    ],
    cliCommands: [
      {
        command: "hey -n 2000 -c 100 https://devexcode.com/healthz",
        why: "Performs quick concurrent HTTP load testing spikes locally.",
        what: "Spawns 100 parallel worker threads, dispatches 2000 total HTTP queries, and benchmarks latency metrics.",
        output: "➜ Summary:\n  Requests/sec: 1450.21\n  Avg Latency: 22.4ms\n  Success Rate: 100%"
      }
    ],
    icon: Users
  },
  {
    id: "lb",
    title: "Load Balancer",
    subtitle: "AWS Application ALB",
    status: "idle",
    metrics: { label: "Active Conns", value: "1200" },
    x: 260, y: 200,
    description: "Distributes incoming traffic across available, healthy server pods to balance CPU loads.",
    details: [
      "Intelligent balancing: Applies round-robin or least-connections routing configurations.",
      "Ingress routing checks: Continually polls backend /healthz endpoints.",
      "Security parameters: Terminates incoming TLS configurations and rejects invalid headers."
    ],
    interviewQuestions: [
      {
        question: "What is the difference between Round-Robin and Least-Connections routing algorithms?",
        answer: "Round-Robin routes requests sequentially, which works well for identical servers. Least-Connections routes requests to the instance with the lowest active TCP connections, making it better for workloads with highly variable processing costs."
      }
    ],
    tradeOffs: [
      {
        choice: "Application Load Balancers (Layer 7) vs. Network Load Balancers (Layer 4)",
        pros: "ALB performs smart path-based routing, header injections, and SSL decryption.",
        cons: "NLB handles raw TCP streams with higher performance, but lacks layer-7 header inspection."
      }
    ],
    failureModes: [
      {
        scenario: "ALB returns 502 Bad Gateway during rolling node updates.",
        mitigation: "Configure healthy pod readiness probes and enable graceful connection draining."
      }
    ],
    cliCommands: [
      {
        command: "aws elbv2 describe-target-health --target-group-arn tg-xyz",
        why: "Queries ALB target groups to check the status of registered hosts.",
        what: "Fetches target instance health states from the AWS API and verifies TCP health maps.",
        output: "➜ Targets: 3\n  eks-worker-1: Healthy (200 OK)\n  eks-worker-2: Healthy (200 OK)"
      }
    ],
    icon: Shield
  },
  {
    id: "service",
    title: "K8s Service Node",
    subtitle: "Internal Cluster VIP",
    status: "idle",
    metrics: { label: "Endpoints", value: "3 Active" },
    x: 440, y: 200,
    description: "An abstract layer mapping static network VIPs to dynamic, fluctuating container Pod endpoints.",
    details: [
      "Dynamic routing abstraction: Serves as a single stable VIP to abstract fluctuating pod IP changes.",
      "Kube-proxy actions: Manages routing tables using efficient local iptables configurations.",
      "Service discovery: Provides cluster-wide DNS names for service communications."
    ],
    interviewQuestions: [
      {
        question: "How does a Kubernetes Service Route traffic to dynamic Pod IP addresses?",
        answer: "Services associate with pods using selector labels. The cluster controller tracks these selectors, maintaining a real-time list of pod IPs (Endpoints) which kube-proxy maps locally using iptables rules."
      }
    ],
    tradeOffs: [
      {
        choice: "ClusterIP vs. NodePort services",
        pros: "ClusterIP isolates microservice traffic safely within the private cluster network.",
        cons: "Cannot be accessed directly by external clients without ingress or load balancer configurations."
      }
    ],
    failureModes: [
      {
        scenario: "A microservice returns 503 Service Unavailable due to empty Endpoints lists.",
        mitigation: "Deploy readiness probes and configure scaling minimums to ensure at least one healthy pod remains online."
      }
    ],
    cliCommands: [
      {
        command: "kubectl get endpoints backend-service -n production",
        why: "To inspect the list of active backend pod IPs registered to route traffic.",
        what: "Queries api-server metadata to extract current registered pod IP addresses.",
        output: "➜ NAME              ENDPOINTS\n  backend-service   10.0.4.12:3000,10.0.4.15:3000,10.0.4.19:3000"
      }
    ],
    icon: Server
  },
  {
    id: "pods",
    title: "Worker Pods Node",
    subtitle: "App Replicas",
    status: "idle",
    metrics: { label: "Active Pods", value: "3 Pods" },
    x: 620, y: 200,
    description: "The core nodes executing application runtime code, dynamically replicating based on cluster metrics.",
    details: [
      "Dynamic replication: Replicates up to 10 instances when traffic surges require compute power.",
      "Self-healing: Auto-recreates pods on healthy nodes if worker instances crash.",
      "Graceful shutdowns: Receives SIGTERM alerts to drain sockets before terminating containers."
    ],
    interviewQuestions: [
      {
        question: "Why should you implement Graceful Shutdown routines in production containers?",
        answer: "Graceful Shutdown processes SIGTERM signals, stops accepting new requests, drains active TCP sockets, completes pending DB queries, and exits cleanly, avoiding user-facing HTTP 502/504 errors."
      }
    ],
    tradeOffs: [
      {
        choice: "Small pod sizes (250m CPU) vs. Large pod sizes (2000m CPU)",
        pros: "Smaller pods offer granular horizontal scalability and high availability.",
        cons: "Increases control plane scheduling overhead and resource allocation footprint."
      }
    ],
    failureModes: [
      {
        scenario: "Pods are stuck in 'Pending' state due to cluster resource exhaustion.",
        mitigation: "Configure cluster autoscalers (Karpenter) to scale underlying host nodes dynamically."
      }
    ],
    cliCommands: [
      {
        command: "kubectl top pods -n production",
        why: "To monitor real-time CPU and Memory utilization across running container instances.",
        what: "Queries Metrics Server scraper APIs, compiles values, and outputs utilization percentages.",
        output: "➜ NAME                  CPU(cores)   MEMORY(bytes)\n  backend-pod-7a9b      442m         182Mi"
      }
    ],
    icon: Cpu
  },
  {
    id: "metrics",
    title: "Metrics Scraper",
    subtitle: "cAdvisor Aggregator",
    status: "idle",
    metrics: { label: "Scrape Loop", value: "15s" },
    x: 620, y: 380,
    description: "Aggregates real-time container resource utilization data, exposing stats to the autoscaler API.",
    details: [
      "Resource scraping: Scrapes pod utilization metrics directly from host kubelet cAdvisor instances.",
      "Autoscaler hooks: Feeds compiled metrics to the Horizontal Pod Autoscaler controller loop.",
      "Lightweight model: Runs in-memory, retaining transient states for metrics parsing."
    ],
    interviewQuestions: [
      {
        question: "What is Metrics Server and why does the HPA rely on it?",
        answer: "Metrics Server aggregates resource metrics (CPU and Memory) directly from the Kubelet API. The HPA controller queries this API every 15 seconds to compute actual resource metrics against target limits."
      }
    ],
    tradeOffs: [
      {
        choice: "In-memory Metrics Server vs. Persistent Prometheus Datastores",
        pros: "Metrics Server is lightweight and quick to configure for autoscaling loops.",
        cons: "Does not store historical metrics data, making it unsuitable for long-term analytics."
      }
    ],
    failureModes: [
      {
        scenario: "Metrics Server crashes, preventing the cluster from scaling pods during traffic surges.",
        mitigation: "Ensure high availability replicas for Metrics Server pods and set up alert rules."
      }
    ],
    cliCommands: [
      {
        command: "kubectl top nodes",
        why: "Displays total resource utilization across active Kubernetes host VM instances.",
        what: "Fetches aggregate resource metrics from the Kubelet APIs of all running cluster nodes.",
        output: "➜ NAME             CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%\n  eks-worker-1     1210m        30%    3412Mi          42%"
      }
    ],
    icon: Activity
  },
  {
    id: "hpa",
    title: "HPA Controller",
    subtitle: "Autoscaler Core",
    status: "idle",
    metrics: { label: "CPU Target", value: "70%" },
    x: 440, y: 380,
    description: "Compares live resource metrics against defined targets, dynamically adjusting deployment replica counts.",
    details: [
      "Auto scaling logic: Calculates target replicas using: desiredReplicas = ceil[currentReplicas * (currentCPU / targetCPU)].",
      "Cooldown limits: Enforces 5-minute cool-down windows to prevent rapid, unstable pod churn.",
      "Multi-metric logic: Evaluates multiple metrics, scaling using the highest calculated value."
    ],
    interviewQuestions: [
      {
        question: "How does the Horizontal Pod Autoscaler calculate target replica counts?",
        answer: "It uses the formula: desiredReplicas = ceil[currentReplicas * (currentMetricValue / targetValue)]. For example, if target CPU is 70%, current CPU is 91%, and active replicas is 3: ceil[3 * (91 / 70)] = 4 replicas."
      }
    ],
    tradeOffs: [
      {
        choice: "Autoscaling on CPU metrics vs. Custom Prometheus metrics (e.g. Req rate)",
        pros: "CPU autoscaling catches generic compute bottlenecks automatically without complex pipeline setup.",
        cons: "Can respond too slowly to sudden traffic spikes, as CPU metrics take time to climb."
      }
    ],
    failureModes: [
      {
        scenario: "Thumping scaling events (flapping) overload the cluster control plane.",
        mitigation: "Configure strict scale-down cooldown timers (behavior.scaleDown.stabilizationWindowSeconds)."
      }
    ],
    cliCommands: [
      {
        command: "kubectl get hpa -n production",
        why: "To inspect the Horizontal Pod Autoscaler status, active limits, and metric targets.",
        what: "Queries HPA metadata, parses active metrics, and reports replica boundaries.",
        output: "➜ REFERENCE             TARGETS   MINPODS   MAXPODS   REPLICAS\n  devexcode-deployment  91%/70%   3         10        4"
      }
    ],
    icon: Settings
  },
  {
    id: "scaler",
    title: "Cluster Scaler Node",
    subtitle: "AWS Node Group ASG",
    status: "idle",
    metrics: { label: "AWS AutoGroup", value: "OK" },
    x: 260, y: 380,
    description: "Checks for unschedulable pods due to resource exhaustion, automatically scaling underlying EC2 cluster nodes.",
    details: [
      "Host scaling: Spawns new virtual machine host instances when pending pods run out of cluster resources.",
      "Karpenter dynamic integration: Directly triggers Cloud APIs to bypass slow ASG scaling delays.",
      "De-provisioning policies: Gracefully drains nodes and consolidates cluster workloads to save cloud budget."
    ],
    interviewQuestions: [
      {
        question: "How does the Kubernetes Cluster Autoscaler differ from the Horizontal Pod Autoscaler?",
        answer: "The HPA scales pod replicas within the cluster network (horizontal software scaling). The Cluster Autoscaler provision new virtual machine host nodes (physical compute hardware scaling) when pods are stuck 'Pending' due to resource limits."
      }
    ],
    tradeOffs: [
      {
        choice: "Karpenter dynamic provisioning vs. AWS Auto Scaling Groups (ASG)",
        pros: "Karpenter talks directly to EC2 APIs to provision right-sized nodes in under 15 seconds.",
        cons: "Slightly more complex configuration compared to traditional static ASG node groups."
      }
    ],
    failureModes: [
      {
        scenario: "AWS runs out of designated instance types, blocking node provisioning.",
        mitigation: "Configure Karpenter with diverse fallback instance lists across multiple instance families."
      }
    ],
    cliCommands: [
      {
        command: "kubectl get events --field-selector reason=TriggeredScaleUp -n kube-system",
        why: "Queries cluster events to confirm if node scaling has been triggered.",
        what: "Queries the system event logging APIs to verify autoscaler event logs.",
        output: "➜ Event: TriggeredScaleUp (pod backend-pod-8z7 failed to schedule, scaling NodeGroup)"
      }
    ],
    icon: HardDrive
  }
];

const scalingPaths: FlowPath[] = [
  { from: "traffic", to: "lb", type: "normal" },
  { from: "lb", to: "service", type: "normal" },
  { from: "service", to: "pods", type: "normal" },
  { from: "pods", to: "metrics", type: "normal" },
  { from: "metrics", to: "hpa", type: "normal" },
  { from: "hpa", to: "scaler", type: "normal" },
  { from: "scaler", to: "pods", type: "normal" }
];

const scalingLogs = [
  "[INFO] Traffic: Standard traffic base registered. Current load: 350 requests/sec.",
  "[INFO] Load Balancer: Routing requests smoothly to 3 available worker pods.",
  "[INFO] Service: Dynamic cluster connections mapped across 3 running Pod endpoints.",
  "[INFO] Metrics Server: Querying active Pod endpoints... Avg CPU: 32%, Avg RAM: 180MB.",
  "[INFO] HPA Autoscaler: Average utilization: 32% (CPU limit target is 70%). Status: Stable.",
  "[INFO] Scaling Spike: Toggling user surge... Inbound traffic spiking to 8,500 req/sec!",
  "[WARN] Load Balancer: High workload detected. Average CPU load climbing rapidly on target pods...",
  "[WARN] Metrics Server: CPU usage metrics: pod-1: 94%, pod-2: 88%, pod-3: 91%. Cluster Avg: 91%.",
  "[WARN] HPA Autoscaler: Average CPU usage (91%) exceeded target threshold (70%). Initiating scale event.",
  "[INFO] HPA Autoscaler: Scaling directive issued. Replicas state target: scale 3 ➔ 8 pods.",
  "[WARN] Cluster Scaler: Node limits reached! Pod resources pending. Spawning new EC2 instances...",
  "[INFO] Cluster Scaler: New EC2 worker nodes successfully provisioned in AWS Auto Scaling Group.",
  "[INFO] Pods: 5 new pod replicas dynamically created. Launching v2 containers...",
  "[INFO] Pods: Readiness probes returned 200 OK. 8 worker pods successfully registered.",
  "[SUCCESS] Load Balancer: Traffic redistributed. Average pod CPU stabilized to 44%. Success!"
];

// ==========================================================
// 4. CACHE-ASIDE QUERY FLOW (DEEP INTERVIEW PREP)
// ==========================================================
const cacheNodes: FlowNode[] = [
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

const cachePaths: FlowPath[] = [
  { from: "app", to: "api", type: "normal" },
  { from: "api", to: "redis", type: "normal" },
  { from: "redis", to: "database", type: "database" },
  { from: "database", to: "writer", type: "normal" },
  { from: "writer", to: "redis", type: "cache" },
  { from: "redis", to: "sender", type: "normal" }
];

const cacheLogs = [
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

// ==========================================================
// 5. LOAD BALANCER FLOW CONFIGURATION (DEEP INTERVIEW PREP)
// ==========================================================
const lbNodes: FlowNode[] = [
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

const lbPaths: FlowPath[] = [
  { from: "clients", to: "balancer", type: "normal" },
  { from: "balancer", to: "srvA", type: "normal" },
  { from: "balancer", to: "srvB", type: "normal" },
  { from: "balancer", to: "srvC", type: "error" },
  { from: "srvC", to: "router", type: "error" },
  { from: "router", to: "srvA", type: "normal" },
  { from: "srvA", to: "response", type: "normal" }
];

const lbLogs = [
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

// ==========================================================
// 6. DNS RESOLUTION FLOW CONFIGURATION (DEEP INTERVIEW PREP)
// ==========================================================
const dnsNodes: FlowNode[] = [
  {
    id: "browser",
    title: "Browser DNS Node",
    subtitle: "Local RAM Cache",
    status: "idle",
    metrics: { label: "Local Memory", value: "Check" },
    x: 80, y: 110,
    description: "The browser checks local cache databases to see if the domain IP address is already memorized.",
    details: [
      "Memory lookup: Queries the browser's high-speed local memory cache first.",
      "TTL expiration evaluation: Validates key TTLs (often set to 60s) before fetching from network resolver.",
      "Network bypass: Avoids slow network resolution entirely if cached locally."
    ],
    interviewQuestions: [
      {
        question: "Why do web browsers maintain independent DNS caches separate from the OS resolver?",
        answer: "By caching DNS records directly in browser memory, the browser bypasses expensive OS system calls (like getaddrinfo), reducing page load latency to near-zero."
      }
    ],
    tradeOffs: [
      {
        choice: "Short browser DNS TTL (60s) vs. Long TTL (24 hours)",
        pros: "Short TTLs allow changes (e.g. failovers) to propagate quickly to clients.",
        cons: "Increases average page load times, as clients must perform network DNS resolutions more frequently."
      }
    ],
    failureModes: [
      {
        scenario: "Stale IP addresses in browser cache cause connection errors after a server migration.",
        mitigation: "Instruct clients to clear browser cache or configure short DNS TTLs prior to migration."
      }
    ],
    cliCommands: [
      {
        command: "chrome://net-internals/#dns",
        why: "To inspect and clear the browser's internal DNS cache tables.",
        what: "Instructs Chromium engines to dump memory-locked DNS cache records and print active tables.",
        output: "➜ Host Resolver Cache:\n  devexcode.com: 76.76.21.21 (TTL: 42s)"
      }
    ],
    icon: Users
  },
  {
    id: "os",
    title: "OS Resolver Node",
    subtitle: "Local hosts check",
    status: "idle",
    metrics: { label: "OS hosts", value: "Miss" },
    x: 260, y: 110,
    description: "If browser cache misses, the OS resolver checks `/etc/hosts` and system networking stack.",
    details: [
      "Hosts mapping evaluation: Checks the local /etc/hosts file for manual domain-to-IP overrides.",
      "Socket call handling: Calls the system socket function getaddrinfo() to run network lookups.",
      "OS system caching: Evaluates local OS network stack memory caches."
    ],
    interviewQuestions: [
      {
        question: "What is the function of the /etc/hosts file in operating systems?",
        answer: "/etc/hosts is a local plain-text file that maps hostnames directly to IP addresses. The OS resolver parses this file before querying remote DNS servers, enabling manual address overrides."
      }
    ],
    tradeOffs: [
      {
        choice: "Local /etc/hosts overrides vs. Centralized private DNS servers",
        pros: "Enables instant local hostname testing and development overrides without network lookups.",
        cons: "Very hard to manage and sync consistently across large fleets of developer machines."
      }
    ],
    failureModes: [
      {
        scenario: "Invalid static IP mappings in /etc/hosts block connections to production services.",
        mitigation: "Clear stale hosts mappings or configure automated configuration tooling (e.g. Ansible)."
      }
    ],
    cliCommands: [
      {
        command: "cat /etc/hosts",
        why: "Displays local static domain-to-IP mappings on the host OS.",
        what: "Reads the file from disk using system calls and prints contents to standard output.",
        output: "➜ 127.0.0.1  localhost\n  127.0.0.1  lb.devexcode.test"
      }
    ],
    icon: Settings
  },
  {
    id: "recursive",
    title: "ISP Recursive",
    subtitle: "Resolver 1.1.1.1",
    status: "idle",
    metrics: { label: "ISP Query", value: "Active" },
    x: 460, y: 110,
    description: "ISP or cloud resolver (Cloudflare 1.1.1.1) coordinates iterative queries across namespaces.",
    details: [
      "Recursive resolution logic: Performs iterative query loops across nameservers on behalf of clients.",
      "Shared caching: Caches popular records to resolve queries locally and avoid root server requests.",
      "DNSSEC validation: Verifies cryptographic signatures to prevent DNS spoofing attacks."
    ],
    interviewQuestions: [
      {
        question: "What is the difference between a Recursive DNS Query and an Iterative DNS Query?",
        answer: "In a Recursive Query, the client requests the resolver to return the final IP address (the resolver does all the work). In an Iterative Query, the resolver queries nameservers sequentially, receiving referrals to downstream hosts until it finds the target."
      }
    ],
    tradeOffs: [
      {
        choice: "Public DNS Resolvers (1.1.1.1) vs. Default ISP Resolvers",
        pros: "Public resolvers offer faster lookup speeds, robust DNSSEC validation, and strict privacy guarantees.",
        cons: "Slightly less optimized for local CDN edge routing compared to geolocated ISP resolvers."
      }
    ],
    failureModes: [
      {
        scenario: "The recursive resolver experiences packet drops, stalling all client domain resolutions.",
        mitigation: "Configure redundant recursive resolver addresses (e.g. 8.8.8.8 and 1.1.1.1) in OS configurations."
      }
    ],
    cliCommands: [
      {
        command: "dig @1.1.1.1 devexcode.com",
        why: "Queries the Cloudflare recursive resolver to verify domain records.",
        what: "Launches a UDP query on port 53 to 1.1.1.1, parses the DNS response, and displays standard headers.",
        output: "➜ ;; ANSWER SECTION:\n  devexcode.com.  300  IN  A  76.76.21.21\n  ;; Query time: 14 msec"
      }
    ],
    icon: Cloud
  },
  {
    id: "root",
    title: "DNS Root Server",
    subtitle: "DNS Root (.)",
    status: "idle",
    metrics: { label: "Referral", value: ".com" },
    x: 460, y: 290,
    description: "The top-level root server (.) receives the query, directing the resolver to the matching TLD server.",
    details: [
      "Namespace hierarchy: Renders root-level mapping referrals (.) for downstream namespaces.",
      "Iterative redirection: Returns Top-Level Domain (TLD) nameserver lists to resolvers.",
      "Global redundancy: Replicated across hundreds of physical nodes globally using Anycast routing."
    ],
    interviewQuestions: [
      {
        question: "What are Root DNS Servers and how many of them exist?",
        answer: "Root DNS servers are the first step in resolving hostnames. There are 13 logical root server addresses (named a.root-servers.net to m.root-servers.net), but they are backed by hundreds of physical locations globally using Anycast routing."
      }
    ],
    tradeOffs: [
      {
        choice: "Anycast routing vs. Unicast routing for DNS core servers",
        pros: "Anycast automatically routes queries to the physically closest server node, minimizing latency and mitigating DDoS attacks.",
        cons: "Makes routing paths harder to debug, as paths can change dynamically based on ISP network health."
      }
    ],
    failureModes: [
      {
        scenario: "A massive DDoS attack attempts to flood root DNS servers.",
        mitigation: "Utilize Anycast routing to distribute the load globally and configure highly cached resolver layers."
      }
    ],
    cliCommands: [
      {
        command: "dig +trace devexcode.com",
        why: "Traces the iterative DNS resolution path from Root down to Authoritative servers.",
        what: "Bypasses local resolver caches to run step-by-step iterative resolutions directly against root nameservers.",
        output: "➜ ;; Received 239 bytes from 192.5.5.241#53(f.root-servers.net)\n  ;; Referral: .com NS servers"
      }
    ],
    icon: Server
  },
  {
    id: "tld",
    title: "TLD Nameserver",
    subtitle: ".com Registry",
    status: "idle",
    metrics: { label: "Referral", value: "Auth NS" },
    x: 660, y: 290,
    description: "The TLD (.com) server maps domain namespaces, directing queries to the authoritative DNS host.",
    details: [
      "Top-Level registries: Manages domain registrations and records for generic extension scopes (e.g. .com).",
      "Authoritative referral: Redirects resolvers to Authoritative DNS servers (e.g., AWS Route53).",
      "High availability: Managed by registry operators (like Verisign for .com) using robust Anycast networks."
    ],
    interviewQuestions: [
      {
        question: "What is a TLD DNS server and what role does it play in hostname resolution?",
        answer: "TLD (Top-Level Domain) servers manage records for specific domain extensions (like .com, .org, .net). They receive queries from recursive resolvers and return NS records pointing to the domain's Authoritative Nameserver."
      }
    ],
    tradeOffs: [
      {
        choice: "Generic TLDs (.com) vs. Country-Code TLDs (.io, .co.uk)",
        pros: ".com is globally trusted and highly cached in recursive systems.",
        cons: "Country-code TLDs are subject to local government regulations and can experience registry outage failures."
      }
    ],
    failureModes: [
      {
        scenario: "A TLD registry outage drops DNS resolutions for all domains under that extension.",
        mitigation: "Registry operators run highly redundant Anycast datacenters; enterprise clients should monitor TLD availability metrics."
      }
    ],
    cliCommands: [
      {
        command: "dig ns devexcode.com @a.gtld-servers.net",
        why: "Queries TLD nameservers directly to fetch authoritative nameserver records.",
        what: "Launches a UDP query to the TLD nameserver IP address, requesting NS records for the target domain.",
        output: "➜ ;; ANSWER SECTION:\n  devexcode.com.  172800  IN  NS  ns-124.awsdns-15.com."
      }
    ],
    icon: Database
  },
  {
    id: "auth",
    title: "Auth Nameserver",
    subtitle: "AWS Route53 Zone",
    status: "idle",
    metrics: { label: "A-Record", value: "Resolved" },
    x: 820, y: 110,
    description: "The definitive domain authority containing actual DNS maps. Returns target IP records.",
    details: [
      "Definitive response: Holds the official DNS records (A, AAAA, CNAME, TXT) mapped by domain owners.",
      "A-Record translation: Translates the hostname to its public ingress IP address (e.g. Vercel: 76.76.21.21).",
      "Dynamic routing checks: Dynamically resolves active targets using database health validations."
    ],
    interviewQuestions: [
      {
        question: "What is an A Record and how does it differ from a CNAME Record?",
        answer: "An A Record maps a domain name directly to an IPv4 address (e.g. 76.76.21.21). A CNAME (Canonical Name) Record maps a domain name to another domain name (an alias), requiring an extra DNS lookup step."
      }
    ],
    tradeOffs: [
      {
        choice: "CNAME records vs. Alias records at the Zone Apex",
        pros: "Alias records allow mapping the root domain (apex) directly to dynamic cloud endpoints without violating DNS specs.",
        cons: "CNAME records cannot be used at the zone apex because they block other record types (like MX) on that domain."
      }
    ],
    failureModes: [
      {
        scenario: "An authoritative nameserver is misconfigured, returning NXDOMAIN errors to all clients.",
        mitigation: "Run DNS validations in CI/CD configurations before applying Zone updates to live clusters."
      }
    ],
    cliCommands: [
      {
        command: "dig A devexcode.com @ns-124.awsdns-15.com",
        why: "Queries the authoritative AWS Route53 nameserver to retrieve the domain IP mapping.",
        what: "Launches UDP query packets directly to the zone's authoritative IP to retrieve IP records.",
        output: "➜ ;; ANSWER SECTION:\n  devexcode.com.  300  IN  A  76.76.21.21\n  ;; AUTHORITATIVE ANSWER"
      }
    ],
    icon: ShieldCheck
  },
  {
    id: "backfill",
    title: "Resolver Cache",
    subtitle: "ISP Backfill",
    status: "idle",
    metrics: { label: "Caching TTL", value: "300s" },
    x: 660, y: 110,
    description: "Caches the resolved A-Record at the recursive resolver level to avoid repeat iterations.",
    details: [
      "Caching resolved entries: Caches the IP record in the recursive resolver's memory to bypass root lookups.",
      "TTL compliance: Automatically decrements and evicts entries when their configured TTL expires.",
      "Performance optimization: Resolves subsequent queries from different clients locally in <1ms."
    ],
    interviewQuestions: [
      {
        question: "What are the advantages and risks of configuring a high TTL (e.g. 86400s) on DNS records?",
        answer: "Advantages: Minimizes lookup latency and shields authoritative servers from continuous traffic. Risks: Prevents rapid IP modifications during migrations or failovers, as stale records linger in resolver caches."
      }
    ],
    tradeOffs: [
      {
        choice: "Short TTL (300s) vs. Long TTL (86400s) for public APIs",
        pros: "Short TTL enables quick server failover switches and zero-downtime migrations.",
        cons: "Increases average client lookup times and raises DNS query traffic billing costs."
      }
    ],
    failureModes: [
      {
        scenario: "The ISP resolver ignores record TTL limits, continuing to serve expired IP mappings.",
        mitigation: "Configure backup DNS providers or use client-side DNS override scripts where possible."
      }
    ],
    cliCommands: [
      {
        command: "dig +nocmd +noquestion +nostats devexcode.com",
        why: "Fetches domain record mappings quickly from local resolver caches.",
        what: "Sends query packets to the OS resolver, checking local network stack caches and printing active TTL mappings.",
        output: "➜ devexcode.com.  258  IN  A  76.76.21.21"
      }
    ],
    icon: HardDrive
  }
];

const dnsPaths: FlowPath[] = [
  { from: "browser", to: "os", type: "normal" },
  { from: "os", to: "recursive", type: "normal" },
  { from: "recursive", to: "root", type: "database" },
  { from: "root", to: "tld", type: "normal" },
  { from: "tld", to: "auth", type: "normal" },
  { from: "auth", to: "backfill", type: "cache" },
  { from: "backfill", to: "browser", type: "normal" }
];

const dnsLogs = [
  "[INFO] Browser: Query initiated for 'devexcode.com'. Checking local browser memory...",
  "[WARN] Browser: Domain not found in local memory cache. Checking OS resolver hosts...",
  "[WARN] OS Resolver: Hosts file check missed. Forwarding query to ISP recursive resolver...",
  "[INFO] ISP Resolver: Querying Root Nameserver group A.ROOT-SERVERS.NET for '.com'...",
  "[INFO] Root Server: Redirecting recursive resolver to .com TLD Nameserver (Verisign)...",
  "[INFO] TLD Server: Redirecting recursive resolver to Authoritative Nameserver (Amazon Route53)...",
  "[INFO] Auth Server: Querying DNS zone maps. A-Record mapping matched successfully.",
  "[SUCCESS] Auth Server: Resolved devexcode.com ➔ 76.76.21.21 (Vercel Ingress gateway).",
  "[INFO] ISP Cache: Backfilling resolved A-Record to recursive resolver memory. TTL: 300s.",
  "[SUCCESS] Browser: Cached IP address resolved in 12ms. Launching HTTP connection. Success!"
];

// Master list of available system flows (6 master flows!)
const SYSTEM_FLOWS = [
  {
    id: "deployment",
    title: "CI/CD Deployment Flow",
    subtitle: "GitOps Rolling Release",
    icon: Workflow,
    color: "from-blue-600 to-indigo-600 shadow-indigo-500/20",
    category: "DevOps",
    description: "Visualize modern GitOps continuous delivery. Trigger a git push, compile containers, register images, and synchronize ArgoCD updates live.",
    nodes: ["Developer", "GitHub", "Jenkins", "Docker", "ECR Registry", "ArgoCD", "Kubernetes", "Pods"],
    nodesRaw: deploymentNodes,
    paths: deploymentPaths,
    logs: deploymentLogs
  },
  {
    id: "auth",
    title: "Authentication Flow",
    subtitle: "Secure Access & Caching",
    icon: Shield,
    color: "from-purple-600 to-violet-600 shadow-violet-500/20",
    category: "Security",
    description: "Inspect OAuth & secure JWT generation. Trace API Gateway checks, credential matching in PostgreSQL databases, and Redis caching hits.",
    nodes: ["Client", "API Gateway", "Auth Service", "PostgreSQL", "JWT Issuer", "Redis Cache", "API"],
    nodesRaw: authNodes,
    paths: authPaths,
    logs: authLogs
  },
  {
    id: "scaling",
    title: "Kubernetes Autoscaling",
    subtitle: "Dynamic Replicas Scaling",
    icon: Cpu,
    color: "from-emerald-600 to-teal-600 shadow-emerald-500/20",
    category: "Infrastructure",
    description: "Experience autoscaling clusters under massive load. Trigger traffic spikes, monitor CPU graphs, poll metric APIs, and scale nodes.",
    nodes: ["Traffic", "ALB Ingress", "K8s Service", "Pods", "Metrics Server", "HPA Policy", "Node ASG"],
    nodesRaw: scalingNodes,
    paths: scalingPaths,
    logs: scalingLogs
  },
  {
    id: "cache",
    title: "Cache-Aside Query Flow",
    subtitle: "Memory Lookups & Backfill",
    icon: HardDrive,
    color: "from-amber-600 to-orange-600 shadow-orange-500/20",
    category: "Caching",
    description: "Observe caching reads-through sequences, memory lookups, cache misses fallbacks, persistent SQL queries, and asynchronous backfills.",
    nodes: ["User App", "API Server", "Redis Cache", "PostgreSQL DB", "Cache Writer", "Data Sender"],
    nodesRaw: cacheNodes,
    paths: cachePaths,
    logs: cacheLogs
  },
  {
    id: "balancer",
    title: "Load Balancer Failover",
    subtitle: "Least Connections Balance",
    icon: Shield,
    color: "from-cyan-600 to-blue-600 shadow-blue-500/20",
    category: "Networking",
    description: "Trace client load distribution down to EC2 upstream nodes, health-checking hearbeats, node timeouts, and dynamic connection draining failovers.",
    nodes: ["Clients Pool", "Nginx LB", "Server Node A", "Server Node B", "Server Node C", "Failover Router", "Response Pool"],
    nodesRaw: lbNodes,
    paths: lbPaths,
    logs: lbLogs
  },
  {
    id: "dns",
    title: "DNS Resolution Flow",
    subtitle: "Iterative Nameservers Loop",
    icon: Cloud,
    color: "from-indigo-600 to-violet-600 shadow-violet-500/20",
    category: "Performance",
    description: "Follow the full recursive DNS lookup iteration. Query local OS resolvers, recursive ISP resolvers, Root (.) servers, TLD (.com) hosts, and Auth hosts.",
    nodes: ["Browser DNS", "OS Resolver", "ISP Recursive", "Root Server", "TLD Server", "Auth Server", "ISP Cache"],
    nodesRaw: dnsNodes,
    paths: dnsPaths,
    logs: dnsLogs
  }
];

export default function SystemFlowsClient() {
  const [activeFlowId, setActiveFlowId] = useState<"deployment" | "auth" | "scaling" | "cache" | "balancer" | "dns" | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isSpiked, setIsSpiked] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"blueprint" | "qa" | "terminal">("blueprint");
  
  // Ref hooks to target the Live Sandbox Simulator section
  const sandboxRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  
  // Terminal Logs stream state
  const [logsStream, setLogsStream] = useState<string[]>([]);
  
  // Real-time Metrics state
  const [metrics, setMetrics] = useState({
    cpu: 34,
    memory: 42,
    requestsCount: 14210,
    errorRate: 0,
    latency: 18
  });

  const activeFlow = SYSTEM_FLOWS.find(f => f.id === activeFlowId) || SYSTEM_FLOWS[0];
  const activeNode = activeFlow.nodesRaw.find(n => n.id === selectedNodeId);
  const totalSteps = activeFlow.nodesRaw.length;
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const requestsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize dynamic metrics based on visual playground states
  useEffect(() => {
    let targetCpu = 34;
    let targetMem = 42;
    let targetLatency = 18;
    let targetError = 0;

    if (isFailed) {
      targetCpu = 92;
      targetMem = 84;
      targetLatency = 450;
      targetError = 24.8;
    } else if (isSpiked) {
      targetCpu = 88;
      targetMem = 78;
      targetLatency = 145;
      targetError = 0.2;
    } else if (activeStep > 0) {
      // Step progression load
      targetCpu = 34 + (activeStep * 3);
      targetMem = 42 + (activeStep * 2);
      targetLatency = 18 + activeStep;
    }

    // Smooth metrics transitions
    const transition = setInterval(() => {
      setMetrics(prev => {
        const cpuDiff = targetCpu - prev.cpu;
        const memDiff = targetMem - prev.memory;
        const latDiff = targetLatency - prev.latency;
        const errDiff = targetError - prev.errorRate;

        return {
          cpu: prev.cpu + (Math.abs(cpuDiff) < 1 ? cpuDiff : Math.sign(cpuDiff) * 2),
          memory: prev.memory + (Math.abs(memDiff) < 1 ? memDiff : Math.sign(memDiff) * 2),
          latency: prev.latency + (Math.abs(latDiff) < 2 ? latDiff : Math.sign(latDiff) * 5),
          errorRate: prev.errorRate + (Math.abs(errDiff) < 0.1 ? errDiff : Math.sign(errDiff) * 0.5),
          requestsCount: prev.requestsCount
        };
      });
    }, 60);

    return () => clearInterval(transition);
  }, [isSpiked, isFailed, activeStep]);

  // Request counter ticker loop
  useEffect(() => {
    if (requestsIntervalRef.current) clearInterval(requestsIntervalRef.current);

    const intervalDur = isFailed ? 500 : isSpiked ? 80 : 400;
    
    requestsIntervalRef.current = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        requestsCount: prev.requestsCount + (isSpiked ? Math.floor(Math.random() * 45) + 30 : Math.floor(Math.random() * 5) + 1)
      }));
    }, intervalDur);

    return () => {
      if (requestsIntervalRef.current) clearInterval(requestsIntervalRef.current);
    };
  }, [isSpiked, isFailed]);

  // Update visual node status parameters depending on active step & failure conditions
  const currentNodes: FlowNode[] = activeFlow.nodesRaw.map((node, idx) => {
    let status: "idle" | "active" | "success" | "error" = "idle";
    
    if (isFailed && idx === Math.min(activeStep + 1, totalSteps - 2)) {
      status = "error";
    } else if (idx === activeStep) {
      status = "active";
    } else if (idx < activeStep) {
      status = "success";
    }
    
    // Dynamic values mapping
    let metricValue = node.metrics.value;
    if (isFailed && idx === Math.min(activeStep + 1, totalSteps - 2)) {
      metricValue = "Failed";
    } else if (isSpiked && node.id === "traffic") {
      metricValue = "8.5k rps";
    } else if (isSpiked && node.id === "pods") {
      metricValue = "8 Pods";
    } else if (isSpiked && node.id === "redis") {
      metricValue = "Hit: 99%";
    }

    return {
      ...node,
      status,
      metrics: {
        ...node.metrics,
        value: metricValue
      }
    };
  });

  // Timeline Step Forward
  const stepForward = useCallback(() => {
    if (activeStep < totalSteps - 1) {
      setActiveStep(prev => {
        const next = prev + 1;
        // Append matching console log
        if (activeFlow.logs[next]) {
          setLogsStream(logs => [...logs, activeFlow.logs[next]]);
        }
        return next;
      });
    } else {
      setIsPlaying(false);
    }
  }, [activeStep, totalSteps, activeFlow]);

  // Timeline Step Backward
  const stepBackward = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
      setLogsStream(logs => logs.slice(0, -1));
    }
  }, [activeStep]);

  // Sync timeline interval player loop
  useEffect(() => {
    if (isPlaying) {
      const pace = isSpiked ? 1800 : 3000;
      timerRef.current = setInterval(() => {
        stepForward();
      }, pace);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isSpiked, stepForward]);

  // Reset sandbox completely
  const handleReset = () => {
    setIsPlaying(false);
    setActiveStep(0);
    setIsSpiked(false);
    setIsFailed(false);
    setSelectedNodeId(null);
    setLogsStream([activeFlow.logs[0]]);
  };

  // Toggle play/pause
  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  // Switch between system flow categories
  const handleFlowChange = (flowId: "deployment" | "auth" | "scaling" | "cache" | "balancer" | "dns") => {
    setActiveFlowId(flowId);
    setIsPlaying(false);
    setActiveStep(0);
    setIsSpiked(false);
    setIsFailed(false);
    setSelectedNodeId(null);
    const flow = SYSTEM_FLOWS.find(f => f.id === flowId) || SYSTEM_FLOWS[0];
    setLogsStream([flow.logs[0]]);
  };

  // Click handler from catalog grid
  const handleSelectCatalogFlow = (flowId: "deployment" | "auth" | "scaling" | "cache" | "balancer" | "dns") => {
    handleFlowChange(flowId);
    
    // Smooth scroll down to sandbox Ref
    setTimeout(() => {
      sandboxRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  // Initialize flow logs
  useEffect(() => {
    setLogsStream([activeFlow.logs[0]]);
  }, [activeFlowId]);

  // Reset modal scroll and active tab to blueprint when node selection changes
  useEffect(() => {
    if (selectedNodeId) {
      setActiveTab("blueprint");
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
    }
  }, [selectedNodeId]);

  // Prevent background body scroll when node deep-dive drawer is open
  useEffect(() => {
    if (selectedNodeId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedNodeId]);

  // Interactive Chaos Injection mode toggles
  const handleToggleFailure = () => {
    if (isFailed) {
      setIsFailed(false);
      setLogsStream(logs => [...logs, "[INFO] Infrastructure recovered. Resetting health checks."]);
    } else {
      setIsFailed(true);
      setIsPlaying(false);
      const targetErrNodeIdx = Math.min(activeStep + 1, totalSteps - 2);
      const targetErrNode = activeFlow.nodesRaw[targetErrNodeIdx];
      setLogsStream(logs => [
        ...logs,
        `[ERROR] Chaos Engineer: Injected failure in ${targetErrNode.title}! Core connection timeout.`,
        `[ERROR] Alert Manager: Service ${targetErrNode.title} offline. Error threshold exceeded!`
      ]);
    }
  };

  const handleToggleSpike = () => {
    if (isSpiked) {
      setIsSpiked(false);
      setLogsStream(logs => [...logs, "[INFO] Traffic load stabilizing to nominal baseline values."]);
    } else {
      setIsSpiked(true);
      setLogsStream(logs => [...logs, "[WARN] Traffic Surge: Load injection testing active. Simulating concurrency spikes..."]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-16 relative overflow-hidden">
      
      {/* Visual background ambient sphere lights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/interview" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Interview Readiness Hub
          </Link>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 font-black">Architecture Sandbox</span>
        </div>

        {/* Page Main Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight gradient-text mb-4">
            System Flow Sandbox
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl leading-relaxed">
            Choose a system flow below to explore its continuous workflows. Run live pipeline step playbacks, toggle load spikes, inspect Redis validation caches, and inject failure states interactively.
          </p>
        </div>

        {/* ==========================================================
            HERO FLOWS CATALOG GRID (LIST FIRST - 6 flows!)
           ========================================================== */}
        <div className="mb-16">
          <h2 className="text-xs uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            Select System Architecture Flow
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SYSTEM_FLOWS.map((flow) => {
              const Icon = flow.icon;
              const isSelected = activeFlowId === flow.id;
              
              let cardBorder = "border-slate-200 dark:border-white/5 hover:border-indigo-500/30";
              let glowLight = "opacity-0";
              
              if (isSelected) {
                cardBorder = "border-indigo-500/50 dark:border-indigo-500/40 bg-indigo-50/50 dark:bg-indigo-950/10 shadow-[0_0_25px_rgba(99,102,241,0.06)] dark:shadow-[0_0_25px_rgba(99,102,241,0.08)]";
                glowLight = "opacity-10 dark:opacity-15";
              }

              return (
                <motion.div
                  key={flow.id}
                  whileHover={{ y: -5 }}
                  onClick={() => handleSelectCatalogFlow(flow.id as any)}
                  className={`glass dark:glass-dark p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden group cursor-pointer flex flex-col justify-between ${cardBorder}`}
                >
                  {/* Glowing backdrop circle */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 blur-3xl transition-opacity duration-700 pointer-events-none ${glowLight}`} />
                  
                  <div>
                    {/* Top Icon and active indicator */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      {/* Colored Category Tag */}
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-indigo-300 text-[8px] font-black uppercase tracking-wider border border-slate-200 dark:border-white/5">
                        {flow.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                      {flow.title}
                    </h3>
                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-600 dark:text-indigo-400 block mb-4">
                      {flow.subtitle}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                      {flow.description}
                    </p>

                    {/* Nodes flow visual overview */}
                    <div className="flex flex-wrap items-center gap-1 p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl mb-6 min-h-[46px]">
                      {flow.nodes.slice(0, 3).map((node, nIdx) => (
                        <div key={node} className="flex items-center gap-1 text-[8px] font-extrabold text-slate-600 dark:text-slate-400">
                          <span className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded">
                            {node}
                          </span>
                          {nIdx < 2 && <span className="text-slate-400 dark:text-slate-600">➔</span>}
                        </div>
                      ))}
                      {flow.nodes.length > 3 && (
                        <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold px-1">+{flow.nodes.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCatalogFlow(flow.id as any);
                    }}
                    className={`w-full rounded-2xl font-black text-[10px] uppercase tracking-widest py-5 border transition-all ${
                      isSelected 
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-600 shadow-md" 
                        : "bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {isSelected ? "Active in Sandbox" : "Launch in Sandbox"}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ==========================================================
            LIVE PLAYGROUND SIMULATOR VIEW (DYNAMIC)
           ========================================================== */}
        <AnimatePresence mode="wait">
          {activeFlowId ? (
            <motion.div
              ref={sandboxRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, type: "spring", damping: 25 }}
              className="scroll-mt-24 space-y-8"
            >
              {/* Divider header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-200 dark:border-white/5 pt-10 gap-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Workflow className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                    Live Sandbox Simulator
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Running live telemetry and synthetic resource checks for <strong>{activeFlow.title}</strong>.
                  </p>
                </div>

                {/* Sub Selector tabs (as quick selectors while playing) */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl self-stretch sm:self-auto">
                  {SYSTEM_FLOWS.map(f => (
                    <button
                      key={f.id}
                      onClick={() => handleFlowChange(f.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                        f.id === activeFlowId 
                          ? "bg-indigo-600 text-white" 
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {f.id === "deployment" ? "CI/CD" : f.id === "auth" ? "OAuth" : f.id === "scaling" ? "Scale" : f.id === "cache" ? "Cache" : f.id === "balancer" ? "Balancer" : "DNS"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active description card */}
              <div className="p-5 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-500/10 dark:border-indigo-500/10 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-4.5">
                <div className="p-3 bg-indigo-600/10 rounded-2xl text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                  <Workflow className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm text-indigo-700 dark:text-indigo-200 uppercase tracking-wider leading-none mb-1">
                    Simulation Loaded: {activeFlow.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                    {activeFlow.description}
                  </p>
                </div>
              </div>

              {/* Grid visual system playground */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual SVG nodes canvas & timeline player controls */}
                <div className="lg:col-span-8 space-y-6">
                  
                  <FlowCanvas
                    nodes={currentNodes}
                    paths={activeFlow.paths}
                    activeStep={activeStep}
                    isSpiked={isSpiked}
                    isFailed={isFailed}
                    selectedNodeId={selectedNodeId}
                    onSelectNode={(nodeId) => setSelectedNodeId(nodeId === selectedNodeId ? null : nodeId)}
                  />

                  <SimulationControls
                    isPlaying={isPlaying}
                    onTogglePlay={handleTogglePlay}
                    onReset={handleReset}
                    onStepForward={stepForward}
                    onStepBackward={stepBackward}
                    isSpiked={isSpiked}
                    onToggleSpike={handleToggleSpike}
                    isFailed={isFailed}
                    onToggleFailure={handleToggleFailure}
                    activeStep={activeStep}
                    totalSteps={totalSteps}
                  />
                </div>

                {/* Metrics dials & DevOps streaming CLI logs panel */}
                <div className="lg:col-span-4 space-y-6 self-stretch flex flex-col">
                  
                  <div className="flex-grow">
                    <MetricsPanel
                      cpu={metrics.cpu}
                      memory={metrics.memory}
                      requestsCount={metrics.requestsCount}
                      errorRate={metrics.errorRate}
                      latency={metrics.latency}
                    />
                  </div>

                  <div className="flex-shrink-0">
                    <LogsPanel
                      logs={logsStream}
                      activeStep={activeStep}
                    />
                  </div>
                </div>
              </div>

            </motion.div>
          ) : (
            /* Callout helper when no flow is active yet */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center p-16 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-100/20 dark:bg-slate-900/5 text-center mt-8 cursor-pointer"
              onClick={() => handleSelectCatalogFlow("deployment")}
            >
              <Workflow className="w-12 h-12 text-slate-400 dark:text-slate-600 mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1.5">No Active Simulation Loaded</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mb-6">
                Click any of the high-fidelity architecture cards above to launch the visual node stream sandbox.
              </p>
              <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] uppercase tracking-wider py-4.5 px-6 shadow-md shadow-indigo-600/10">
                Load Default Flow (CI/CD) ➔
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==========================================================
            SIDE BAR / NODE INSPECTOR (TABBED DEEP INTERVIEW bluePRINT)
           ========================================================== */}
        <AnimatePresence>
          {selectedNodeId && activeNode && (
            <>
              {/* High-quality backdrop blur overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedNodeId(null)}
                className="fixed inset-0 bg-[#02040a] z-[100] backdrop-blur-sm"
              />
              
              {/* Drawer Container */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-[#070b16] border-l border-slate-200 dark:border-white/10 z-[100] flex flex-col shadow-2xl overflow-hidden"
              >
                {/* Sticky Header Section */}
                <div className="sticky top-0 bg-white dark:bg-[#070b16] z-10 p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center select-none shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                      {activeNode.status === "error" ? (
                        <AlertTriangle className="w-5 h-5 text-rose-500 dark:text-rose-450 animate-pulse" />
                      ) : (
                        <Workflow className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400">
                        Interview Prep Deep-Dive
                      </span>
                      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-none mt-1">
                        {activeNode.title}
                      </h2>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedNodeId(null)}
                    className="text-xs uppercase tracking-widest font-black text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg border border-slate-200 dark:border-white/5 transition-all"
                  >
                    Close
                  </button>
                </div>

                {/* Sub Tab Navigation */}
                <div className="flex bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-white/5 px-6 py-2.5 gap-2 select-none shrink-0 overflow-x-auto custom-scrollbar">
                  {(["blueprint", "qa", "terminal"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border shrink-0 ${
                        activeTab === tab
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                          : "bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {tab === "blueprint" ? "1. Blueprint" : tab === "qa" ? "2. Questions & Choices" : "3. DevOps Terminal"}
                    </button>
                  ))}
                </div>

                {/* Scrollable Content Container */}
                <div 
                  ref={modalContentRef}
                  className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
                >
                  
                  {/* TAB 1: BLUEPRINT TAB */}
                  {activeTab === "blueprint" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Node Status indicators */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col">
                          <span className="text-[8px] uppercase font-black tracking-widest text-slate-500">Node Status</span>
                          <span className={`text-sm font-black mt-1 capitalize flex items-center gap-1.5 ${
                            activeNode.status === "error" 
                              ? "text-rose-500 dark:text-rose-450 animate-pulse" 
                              : activeNode.status === "success" 
                              ? "text-emerald-600 dark:text-emerald-400" 
                              : "text-indigo-600 dark:text-indigo-400"
                          }`}>
                            {activeNode.status}
                            {activeNode.status === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          </span>
                        </div>

                        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col">
                          <span className="text-[8px] uppercase font-black tracking-widest text-slate-500">
                            {activeNode.metrics.label}
                          </span>
                          <span className="text-sm font-black text-slate-900 dark:text-white mt-1">
                            {activeNode.metrics.value}
                          </span>
                        </div>
                      </div>

                      {/* General Description */}
                      <div>
                        <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-2.5">
                          Functional Overview
                        </h3>
                        <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed p-4 bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100/40 dark:border-indigo-500/10 rounded-2xl">
                          {activeNode.description}
                        </p>
                      </div>

                      {/* Technical checklist */}
                      <div>
                        <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                          Operational Blueprint Steps
                        </h3>
                        <ul className="space-y-3">
                          {activeNode.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed p-3.5 bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-xl shadow-sm">
                              <span className="font-black text-indigo-600 dark:text-indigo-450 text-xs mt-0.5">0{idx + 1}.</span>
                              <span className="flex-grow">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: INTERVIEW Q&A TAB */}
                  {activeTab === "qa" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* L5/L6+ Interview Questions */}
                      {activeNode.interviewQuestions && activeNode.interviewQuestions.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            L5/L6+ Core Interview Questions
                          </h3>
                          <div className="space-y-3">
                            {activeNode.interviewQuestions.map((qa, idx) => (
                              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/5 rounded-2xl space-y-2.5">
                                <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex gap-2">
                                  <span>Q:</span>
                                  <span>{qa.question}</span>
                                </h4>
                                <div className="text-[11px] text-slate-655 dark:text-slate-350 leading-relaxed pl-4 border-l-2 border-slate-200 dark:border-indigo-500/25">
                                  {qa.answer}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Architectural Trade-offs Choice Matrix */}
                      {activeNode.tradeOffs && activeNode.tradeOffs.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500">
                            Architectural Choices & Trade-offs
                          </h3>
                          <div className="space-y-3">
                            {activeNode.tradeOffs.map((to, idx) => (
                              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-white/5 rounded-2xl space-y-3">
                                <h4 className="text-xs font-black text-slate-800 dark:text-white border-b border-slate-200 dark:border-white/5 pb-2">
                                  Choice: {to.choice}
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <span className="text-[8px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Pros (+)</span>
                                    <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-normal">{to.pros}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[8px] font-black uppercase text-rose-500 dark:text-rose-450 tracking-wider">Cons (-)</span>
                                    <p className="text-[10px] text-slate-650 dark:text-slate-400 leading-normal">{to.cons}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Failure Scenarios & Recovery Plans */}
                      {activeNode.failureModes && activeNode.failureModes.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500">
                            Chaos Engineering & Fault Tolerance
                          </h3>
                          <div className="space-y-3">
                            {activeNode.failureModes.map((fm, idx) => (
                              <div key={idx} className="p-4 bg-red-50/10 dark:bg-rose-950/5 border border-red-500/10 dark:border-rose-500/10 rounded-2xl space-y-2">
                                <h4 className="text-xs font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  Failure Scenario: {fm.scenario}
                                </h4>
                                <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-normal pl-5">
                                  <strong>Recovery Mitigation:</strong> {fm.mitigation}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* TAB 3: DEVOPS TERMINAL TAB */}
                  {activeTab === "terminal" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500">
                        DevOps Shell command Pipeline
                      </h3>

                      {activeNode.cliCommands && activeNode.cliCommands.length > 0 ? (
                        <div className="space-y-6">
                          {activeNode.cliCommands.map((cmdInfo, idx) => (
                            <div key={idx} className="space-y-4">
                              
                              {/* Annotations explanations block */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-xl">
                                  <span className="text-[8px] font-black uppercase text-indigo-600 tracking-wider">Why we run this:</span>
                                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed mt-1">{cmdInfo.why}</p>
                                </div>
                                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-xl">
                                  <span className="text-[8px] font-black uppercase text-purple-600 tracking-wider">What it does under the hood:</span>
                                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed mt-1">{cmdInfo.what}</p>
                                </div>
                              </div>

                              {/* Terminal Emulator Box */}
                              <div className="font-mono text-[11px] p-5 bg-[#04060d] border border-slate-800 dark:border-white/5 rounded-2xl overflow-hidden shadow-xl">
                                <div className="flex justify-between items-center mb-3.5 border-b border-white/5 pb-2">
                                  <span className="text-[8px] uppercase tracking-wider text-slate-400 font-extrabold flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                                    Terminal Console Shell
                                  </span>
                                  <span className="text-[8px] text-slate-600 font-semibold select-none">akashkore@devex-cluster</span>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-indigo-300 font-medium">
                                    <span className="text-slate-500 font-bold select-none">$</span>
                                    <span>{cmdInfo.command}</span>
                                  </div>
                                  
                                  {/* Outputs */}
                                  <pre className="text-slate-400 font-medium pl-4 pb-1 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                                    {cmdInfo.output}
                                  </pre>
                                </div>
                              </div>

                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 border border-slate-200 dark:border-white/5 rounded-2xl bg-slate-50 dark:bg-slate-950/20 text-slate-500 text-xs">
                          No CLI commands mapped to this node.
                        </div>
                      )}
                    </motion.div>
                  )}

                </div>

                {/* Sticky Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#070b16] shrink-0 select-none">
                  <Button
                    onClick={() => setSelectedNodeId(null)}
                    className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-widest py-6 shadow-lg shadow-indigo-600/10"
                  >
                    Return to Infrastructure Canvas
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
