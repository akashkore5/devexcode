'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Workflow, ArrowLeft, Sparkles,
  CheckCircle2, AlertTriangle
} from "lucide-react";
import FlowCanvas, { FlowNode } from "../../../../components/flows/FlowCanvas";
import LogsPanel from "../../../../components/flows/LogsPanel";
import MetricsPanel from "../../../../components/flows/MetricsPanel";
import SimulationControls from "../../../../components/flows/SimulationControls";
import { Button } from "../../../../components/ui/button";
import { SYSTEM_FLOWS, type FlowId } from "../flows-data";

export default function FlowSimulatorClient({ flowId }: { flowId: string }) {
  const router = useRouter();

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isSpiked, setIsSpiked] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"blueprint" | "qa" | "terminal">("blueprint");

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

  const activeFlow = SYSTEM_FLOWS.find(f => f.id === flowId) || SYSTEM_FLOWS[0];
  const activeNode = activeFlow.nodesRaw.find(n => n.id === selectedNodeId);
  const totalSteps = activeFlow.nodesRaw.length;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const requestsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Initialize flow logs when flowId changes
  useEffect(() => {
    setLogsStream([activeFlow.logs[0]]);
    setActiveStep(0);
    setIsPlaying(false);
    setIsSpiked(false);
    setIsFailed(false);
    setSelectedNodeId(null);
  }, [flowId]);

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
      targetCpu = 34 + (activeStep * 3);
      targetMem = 42 + (activeStep * 2);
      targetLatency = 18 + activeStep;
    }

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

  // Switch between system flow categories — navigate via router
  const handleFlowChange = (newFlowId: FlowId) => {
    router.push(`/system-design/flows/${newFlowId}`);
  };

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
          <Link href="/system-design/flows" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            System Flows Catalog
          </Link>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 font-black">Live Sandbox</span>
        </div>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight gradient-text mb-3">
            {activeFlow.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl leading-relaxed">
            {activeFlow.description}
          </p>
        </div>

        {/* ==========================================================
            LIVE PLAYGROUND SIMULATOR VIEW
           ========================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", damping: 25 }}
          className="space-y-8"
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

            {/* Sub Selector tabs (quick flow switcher) */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl self-stretch sm:self-auto">
              {SYSTEM_FLOWS.map(f => (
                <button
                  key={f.id}
                  onClick={() => handleFlowChange(f.id as FlowId)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                    f.id === flowId
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
          <div className="p-5 bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-500/10 dark:border-indigo-500/10 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
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

      </div>

      {/* ==========================================================
          SIDE BAR / NODE INSPECTOR (TABBED DEEP INTERVIEW BLUEPRINT)
          Rendered outside relative z-10 container to avoid stacking
          context conflict with the navbar (z-50).
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
              className="fixed inset-0 bg-[#02040a] z-[200] backdrop-blur-sm"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-[#070b16] border-l border-slate-200 dark:border-white/10 z-[200] flex flex-col shadow-2xl overflow-hidden"
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
  );
}
