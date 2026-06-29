import { Workflow, Shield, Cpu, HardDrive, Cloud, CreditCard } from "lucide-react";
import { deploymentNodes, deploymentPaths, deploymentLogs } from './deployment';
import { authNodes, authPaths, authLogs } from './auth';
import { scalingNodes, scalingPaths, scalingLogs } from './scaling';
import { cacheNodes, cachePaths, cacheLogs } from './cache';
import { lbNodes, lbPaths, lbLogs } from './balancer';
import { dnsNodes, dnsPaths, dnsLogs } from './dns';
import { paymentNodes, paymentPaths, paymentLogs } from './payment';

export * from './deployment';
export * from './auth';
export * from './scaling';
export * from './cache';
export * from './balancer';
export * from './dns';
export * from './payment';

export const SYSTEM_FLOWS = [
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
  },
  {
    id: "payment",
    title: "Razorpay Payment Flow",
    subtitle: "Flight Booking End-to-End",
    icon: CreditCard,
    color: "from-green-600 to-emerald-600 shadow-green-500/20",
    category: "Payments",
    description: "Trace the complete Razorpay integration for a flight booking — from SDK initialization and card tokenization, through 3DS OTP, card network routing, issuer authorization, settlement, webhook verification, to PNR confirmation and refunds.",
    nodes: ["Customer App", "Flight API", "Razorpay Order", "Checkout SDK", "Payment GW", "Card Network", "Issuing Bank", "Settlement", "Webhook", "Booking Svc", "Notifications", "Refund Engine"],
    nodesRaw: paymentNodes,
    paths: paymentPaths,
    logs: paymentLogs
  }
];

export type FlowId = "deployment" | "auth" | "scaling" | "cache" | "balancer" | "dns" | "payment";
