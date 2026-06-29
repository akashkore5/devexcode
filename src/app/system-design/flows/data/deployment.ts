import {
  Workflow, GitPullRequest, Container, Settings, Zap,
  Server, Cpu, Database, Shield, ShieldCheck, HardDrive, Cloud, Activity, Users
} from "lucide-react";
import type { FlowNode, FlowPath } from '../../../../components/flows/FlowCanvas';

export const deploymentNodes: FlowNode[] = [
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

export const deploymentPaths: FlowPath[] = [
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

export const deploymentLogs = [
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
