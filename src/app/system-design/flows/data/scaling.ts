import {
  Workflow, GitPullRequest, Container, Settings, Zap,
  Server, Cpu, Database, Shield, ShieldCheck, HardDrive, Cloud, Activity, Users
} from "lucide-react";
import type { FlowNode, FlowPath } from '../../../../components/flows/FlowCanvas';

export const scalingNodes: FlowNode[] = [
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

export const scalingPaths: FlowPath[] = [
  { from: "traffic", to: "lb", type: "normal" },
  { from: "lb", to: "service", type: "normal" },
  { from: "service", to: "pods", type: "normal" },
  { from: "pods", to: "metrics", type: "normal" },
  { from: "metrics", to: "hpa", type: "normal" },
  { from: "hpa", to: "scaler", type: "normal" },
  { from: "scaler", to: "pods", type: "normal" }
];

export const scalingLogs = [
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
