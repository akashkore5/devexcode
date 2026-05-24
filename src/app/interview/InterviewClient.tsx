'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CodeBracketIcon, 
  CpuChipIcon, 
  AcademicCapIcon, 
  ChatBubbleLeftRightIcon,
  DocumentCheckIcon,
  LightBulbIcon,
  QueueListIcon,
  ArrowRightIcon,
  SparklesIcon,
  RocketLaunchIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { Workflow, Sparkles, Cpu, GitPullRequest, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import Link from "next/link";

interface Props {
  stats: {
    java: number;
    database: number;
    react: number;
    systemDesign: number;
    leetcode75: number;
    leetcode150: number;
    mcq: number;
  };
}

const SYSTEM_FLOWS_PREVIEW = [
  {
    id: "deployment",
    title: "CI/CD GitOps Flow",
    subtitle: "Automated Releases",
    description: "Visualize complete continuous integration and delivery from a local Git commit all the way to rolling replica pod updates on Kubernetes clusters.",
    nodes: ["Developer", "GitHub", "Jenkins", "Docker", "ECR", "ArgoCD", "Kubernetes", "Pods"],
    focusPoints: [
      "Declarative GitOps drift state reconciliation loops managed via ArgoCD Master",
      "Multi-stage Docker builds to reduce container sizes and eliminate build dependencies",
      "Zero-downtime Rolling Updates, liveness health checks, and automatic rollbacks"
    ],
    metrics: "Uptime 100% | Replicas: 3-10 Pods",
    color: "from-blue-600 to-indigo-600 shadow-indigo-600/10"
  },
  {
    id: "auth",
    title: "OAuth/JWT Auth Flow",
    subtitle: "Secure Access & Caching",
    description: "Trace client authentication pipelines, credential hash comparisons, private RS256 token signing, and high-performance Redis cache storage.",
    nodes: ["Client", "API Gateway", "Auth Service", "Postgres DB", "JWT Issuer", "Redis Cache", "API"],
    focusPoints: [
      "Asymmetric private/public cryptographic signing verification algorithms (RS256 vs HS256)",
      "Sub-millisecond validation token caching systems utilizing horizontal Redis clusters",
      "SSL Offloading, ingress routing rules, and client rate limits at Kong API Gateway borders"
    ],
    metrics: "Redis Latency < 1ms | Cache Hit: 98.4%",
    color: "from-purple-600 to-violet-600 shadow-violet-600/10"
  },
  {
    id: "scaling",
    title: "K8s Autoscaling Flow",
    subtitle: "Elastic Load Autoscaler",
    description: "Observe cluster autoscaling behavior under intense user workloads. Monitor pod CPU spikes, metrics scraper APIs, HPA directives, and EC2 node groups.",
    nodes: ["Traffic", "Load Balancer", "K8s Service", "Pods Replicas", "Metrics Server", "HPA Policy", "AWS Node ASG"],
    focusPoints: [
      "Horizontal Pod Autoscaler (HPA) target math algorithms matching raw CPU/RAM thresholds",
      "AWS Auto Scaling Groups and Karpenter node provision delays and pending pods schedules",
      "Dynamic ingress routing, connection draining limits, and synthetic load testing"
    ],
    metrics: "Limit: 70% CPU | Peak: 8.5k rps",
    color: "from-emerald-600 to-teal-600 shadow-emerald-500/20"
  },
  {
    id: "cache",
    title: "Cache-Aside Query Flow",
    subtitle: "Lookups & Backfill",
    description: "Observe caching reads-through sequences, memory lookups, cache misses fallbacks, persistent SQL queries, and asynchronous backfills.",
    nodes: ["User App", "API Server", "Redis Cache", "Postgres DB", "Cache Writer", "Data Sender"],
    focusPoints: [
      "Dynamic read-through caching strategies to protect persistent DB disk pools",
      "Sub-millisecond memory lookup latencies and volatilve-lru memory eviction algorithms",
      "Asynchronous backend cache backfilling patterns with custom TTL configurations"
    ],
    metrics: "Hit Ratio: 92.4% | DB latency: 45ms",
    color: "from-amber-600 to-orange-600 shadow-orange-500/20"
  },
  {
    id: "balancer",
    title: "Load Balancer Flow",
    subtitle: "Least Connections Balance",
    description: "Trace client load distribution down to EC2 upstream nodes, health-checking heartbeats, node timeouts, and dynamic connection draining failovers.",
    nodes: ["Clients Pool", "Nginx LB", "Server Node A", "Server Node B", "Server Node C", "Failover Router", "Response Pool"],
    focusPoints: [
      "Round-robin vs least-connections load routing algorithms in high-concurrency ingresses",
      "Heartbeat ping probes and automated downstream failover mechanisms in Nginx networks",
      "Graceful connection draining and health-checking status endpoints implementation"
    ],
    metrics: "LB Uptime: 100% | Reroute latency: 22ms",
    color: "from-cyan-600 to-blue-600 shadow-blue-500/20"
  },
  {
    id: "dns",
    title: "DNS Resolution Flow",
    subtitle: "Iterative Nameservers Loop",
    description: "Follow the full recursive DNS lookup iteration. Query local OS resolvers, recursive ISP resolvers, Root (.) servers, TLD (.com) hosts, and Auth hosts.",
    nodes: ["Browser DNS", "OS Resolver", "ISP Recursive", "Root Server", "TLD Server", "Auth Server", "ISP Cache"],
    focusPoints: [
      "Recursive vs iterative DNS lookups and dynamic system resolve behaviors",
      "Root, TLD, and Authoritative nameservers domain maps routing loops",
      "A-Record caching TTLs and recursive ISP resolver optimization lookups"
    ],
    metrics: "Lookup speed: 12ms | ISP TTL: 300s",
    color: "from-indigo-600 to-violet-600 shadow-violet-500/20"
  }
];

export default function InterviewClient({ stats }: Props) {
  const [activeFlowIdx, setActiveFlowIdx] = useState(0);
  const currentFlow = SYSTEM_FLOWS_PREVIEW[activeFlowIdx];

  const handleNextFlow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveFlowIdx((prev) => (prev + 1) % SYSTEM_FLOWS_PREVIEW.length);
  };

  const categories = [
    {
      title: "Leetcode 75",
      subtitle: "Ace the Coding Interview",
      description: "Carefully curated set of 75 essential problems for a solid foundation.",
      count: stats.leetcode75,
      icon: CodeBracketIcon,
      href: "/leetcode/75",
      color: "from-emerald-500 to-teal-600",
      tag: "Essentials"
    },
    {
      title: "Leetcode 150",
      subtitle: "Top Interview Questions",
      description: "The gold standard set for top-tier tech companies like Google and Meta.",
      count: stats.leetcode150,
      icon: RocketLaunchIcon,
      href: "/leetcode/150",
      color: "from-blue-500 to-indigo-600",
      tag: "Elite"
    },
    {
      title: "System Design",
      subtitle: "Architectural Mastery",
      description: "Comprehensive blueprints and deep-dives into scalable system architecture.",
      count: stats.systemDesign,
      icon: CpuChipIcon,
      href: "/system-design",
      color: "from-purple-500 to-pink-600",
      tag: "L5/L6+"
    }
  ];

  const specialization = [
    { name: "Core Java", count: stats.java, href: "/learning/java", icon: AcademicCapIcon },
    { name: "Core DSA Practice", count: 100, href: "/practice/dsa", icon: CpuChipIcon },
    { name: "Advanced DB", count: stats.database, href: "/learning/database", icon: QueueListIcon },
    { name: "React Internals", count: stats.react, href: "/learning/react", icon: CodeBracketIcon },
  ];

  const experienceTools = [
    {
      title: "Mock Interviews",
      description: "Realistic 1-on-1 simulations with staff engineers from top companies.",
      href: "/interview/mock",
      icon: ChatBubbleLeftRightIcon,
      badge: "High-Signal"
    },
    {
      title: "Coding Tests",
      description: "Time-bound challenges to sharpen your speed and accuracy under pressure.",
      href: "/interview/tests",
      icon: DocumentCheckIcon,
      badge: "Automated"
    },
    {
      title: "Interview Tips",
      description: "Insider strategies on negotiation, behavioral rounds, and whiteboarding.",
      href: "/interview/tips",
      icon: LightBulbIcon,
      badge: "Insider"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 relative overflow-hidden">
      
      {/* Cinematic background glow mesh and blurred lights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-6 border border-indigo-500/20"
          >
            <SparklesIcon className="w-4 h-4" />
            Interview Readiness Platform
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter"
          >
            Mission Critical Prep.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl leading-relaxed"
          >
            The comprehensive ecosystem for engineering candidates. Master the algorithms, understand the systems, and execute the perfect interview.
          </motion.p>
        </div>

        {/* Primary Tracks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {categories.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass dark:glass-dark group p-10 rounded-[38px] border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden flex flex-col h-full shadow-lg dark:shadow-2xl"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`} />
              
              <div className="flex items-start justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-xl`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-white/5 text-indigo-600 dark:text-indigo-300 shadow-sm">
                  {item.tag}
                </span>
              </div>

              <div className="mb-10">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1.5">{item.title}</h3>
                <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">{item.subtitle}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="text-xl font-black text-slate-900 dark:text-white">{item.count}</span>
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Modules</span>
                </div>
                <Link href={item.href}>
                  <Button className="rounded-2xl px-5 py-5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 group">
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Secondary Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
          <div className="lg:col-span-1 space-y-8">
             <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-6">Topic Deep Dives</h3>
             <div className="space-y-4">
                {specialization.map((spec) => (
                  <Link key={spec.name} href={spec.href}>
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="p-5.5 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-indigo-500/20 transition-all flex items-center justify-between group cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/5 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all border border-slate-100 dark:border-indigo-500/10">
                          <spec.icon className="w-4 h-4" />
                        </div>
                        <span className="font-extrabold text-sm text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">{spec.name}</span>
                      </div>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 opacity-60 group-hover:opacity-100 transition-opacity">{spec.count}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
          </div>

          <div className="lg:col-span-3">
             <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-6 md:ml-4">Candidate Toolkit</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {experienceTools.map((tool) => (
                  <motion.div
                    key={tool.title}
                    whileHover={{ scale: 1.02 }}
                    className="glass dark:glass-dark p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-md dark:shadow-xl flex flex-col group h-full"
                  >
                    <div className="flex items-center justify-between mb-6">
                       <tool.icon className="w-9 h-9 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 p-1.5 rounded-xl border border-indigo-500/10" />
                       <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-md border border-slate-200 dark:border-indigo-500/20">
                         {tool.badge}
                       </span>
                    </div>
                    <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3">{tool.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed flex-grow">
                      {tool.description}
                    </p>
                    <Link href={tool.href} className="mt-auto">
                      <Button variant="outline" className="w-full rounded-2xl font-black py-5 border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-all text-xs">
                        Launch Experience
                      </Button>
                    </Link>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>

        {/* ==========================================
            Interview Ready Section Overhaul
           ========================================== */}
        <div className="mb-20">
          <div className="mb-8">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Interview Ready</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Topic-wise master sheets and interactive playgrounds for quick revision and deep prep.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* CARD 1: Java BE Interview */}
            <motion.div
              whileHover={{ y: -5 }}
              className="glass dark:glass-dark p-10 rounded-[38px] border border-slate-200 dark:border-indigo-500/20 bg-slate-50/30 dark:bg-indigo-950/5 relative overflow-hidden group flex flex-col justify-between shadow-md"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none" />
              
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-slate-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                    <DocumentTextIcon className="w-6 h-6" />
                  </div>
                  <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-indigo-500/20 font-black">POPULAR</Badge>
                </div>
                
                <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">Java BE Interview</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
                  End-to-end question banks and optimal answers for Java Backend Developers. JVM internals, Spring architecture, and Microservices trade-offs.
                </p>
              </div>
              
              <Link href="/interview/ready/java" className="w-full mt-auto">
                <Button className="w-full rounded-2xl font-black py-6 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 text-xs">
                  Full Read Prep
                </Button>
              </Link>
            </motion.div>

            {/* CARD 2: Interactive System Flows Master Sheet (Cycles through all 6 flows!) */}
            <motion.div
              whileHover={{ y: -5 }}
              className="glass dark:glass-dark p-8 rounded-[38px] border border-slate-200 dark:border-indigo-500/30 bg-slate-50/30 dark:bg-slate-900/20 relative overflow-hidden group flex flex-col justify-between shadow-md"
            >
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-indigo-500 to-purple-500 opacity-5 blur-3xl group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" />
              
              <div>
                {/* Visual Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-slate-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                      <Workflow className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase tracking-wider border border-slate-200 dark:border-indigo-500/20 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 fill-indigo-500 dark:fill-indigo-400 text-indigo-600 dark:text-indigo-400" />
                        Interactive
                      </span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">System Flows</h4>
                    </div>
                  </div>
                  
                  {/* Flow Tabs Selector inside Card */}
                  <div className="flex gap-1 p-0.5 bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-lg select-none">
                    {SYSTEM_FLOWS_PREVIEW.map((flow, idx) => (
                      <button
                        key={flow.id}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveFlowIdx(idx); }}
                        className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter transition-all ${
                          idx === activeFlowIdx 
                            ? "bg-indigo-600 text-white shadow-sm" 
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animated content layout */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFlowIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-black text-slate-900 dark:text-white">{currentFlow.title}</h5>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black tracking-tight">{currentFlow.subtitle}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-1">
                        {currentFlow.description}
                      </p>
                    </div>

                    {/* Nodes flow visual list representation */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl flex flex-wrap items-center gap-1 min-h-[36px]">
                      {currentFlow.nodes.slice(0, 4).map((node, nIdx) => (
                        <div key={node} className="flex items-center gap-1 text-[9px] font-semibold text-slate-600 dark:text-slate-300">
                          <span className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded shadow-sm">
                            {node}
                          </span>
                          {nIdx < Math.min(3, currentFlow.nodes.length - 1) && (
                            <span className="text-slate-400 dark:text-slate-600 font-bold">➔</span>
                          )}
                        </div>
                      ))}
                      {currentFlow.nodes.length > 4 && (
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black px-1">+{currentFlow.nodes.length - 4} more</span>
                      )}
                    </div>

                    {/* Focus Points Checklist */}
                    <div className="space-y-2">
                      <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500">Interview Focus Area</span>
                      <ul className="space-y-1.5">
                        {currentFlow.focusPoints.slice(0, 2).map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Live Metric Statistics baseline */}
                    <div className="border-t border-slate-100 dark:border-white/5 pt-3 mt-3 flex items-center justify-between text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      <span>Telemetry benchmarks</span>
                      <span className="text-indigo-600 dark:text-indigo-400 text-[9px] tracking-tight">{currentFlow.metrics}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Action Buttons: Next Flow and Launch Sandbox */}
              <div className="grid grid-cols-12 gap-2 mt-6">
                <button 
                  onClick={handleNextFlow}
                  className="col-span-4 py-3.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/10 hover:text-slate-800 dark:hover:text-white transition-all text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-400 text-slate-400" />
                  Next Flow
                </button>
                
                <Link href="/system-design/flows" className="col-span-8">
                  <Button className="w-full rounded-xl font-black py-4.5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5">
                    Launch Sandbox ➔
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* CARD 3: Core DSA Practice & Visualizer */}
            <motion.div
              whileHover={{ y: -5 }}
              className="glass dark:glass-dark p-10 rounded-[38px] border border-slate-200 dark:border-indigo-500/20 bg-slate-50/30 dark:bg-indigo-950/5 relative overflow-hidden group flex flex-col justify-between shadow-md"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none" />
              
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-slate-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                    <CodeBracketIcon className="w-6 h-6" />
                  </div>
                  <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-indigo-500/20 font-black">NEW</Badge>
                </div>
                
                <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">Core DSA Practice</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
                  Master 100 core data structures and algorithms using dynamic animated visualizer playbacks, FAANG-level blueprints, and interactive predictors.
                </p>
              </div>
              
              <Link href="/practice/dsa" className="w-full mt-auto">
                <Button className="w-full rounded-2xl font-black py-6 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 text-xs uppercase tracking-wider">
                  Launch Visualizer ➔
                </Button>
              </Link>
            </motion.div>

          </div>
        </div>

        {/* Confidence CTA */}
        <div className="glass dark:glass-dark p-12 sm:p-20 rounded-[48px] border border-slate-200 dark:border-indigo-500/15 bg-slate-50/10 dark:bg-indigo-950/[0.01] text-center relative overflow-hidden group shadow-lg dark:shadow-2xl">
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="relative z-10">
              <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">Ready to dominate?</h2>
              <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                Our curriculum is trusted by engineers now working at FAANG, OpenAI, and leading startups.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                 <Link href="/leetcode/75">
                   <Button className="rounded-2xl px-10 py-7 text-sm font-black bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-2xl hover:shadow-indigo-600/20 transition-all">
                     Start Training
                   </Button>
                 </Link>
                 <Link href="/services">
                   <Button className="rounded-2xl px-10 py-7 text-sm font-black border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white transition-all">
                     Book Staff Coaching
                   </Button>
                 </Link>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
