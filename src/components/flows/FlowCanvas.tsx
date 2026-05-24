'use client';

import { motion } from "framer-motion";
import { 
  Terminal, Cpu, Database, Activity, Cloud, Shield, Server, Users, ArrowRight,
  Workflow, GitPullRequest, Container, Settings, Zap, Play, CheckCircle
} from "lucide-react";

export type CliCommandInfo = {
  command: string;
  why: string;
  what: string;
  output: string;
};

export type FlowNode = {
  id: string;
  title: string;
  subtitle: string;
  status: "idle" | "active" | "success" | "error";
  metrics: { label: string; value: string };
  description: string;
  details: string[];
  interviewQuestions?: { question: string; answer: string }[];
  tradeOffs?: { choice: string; pros: string; cons: string }[];
  failureModes?: { scenario: string; mitigation: string }[];
  cliCommands: CliCommandInfo[];
  icon: any;
  x: number;
  y: number;
};

export type FlowPath = {
  from: string;
  to: string;
  type: "normal" | "database" | "error" | "cache";
  curved?: boolean;
};

interface FlowCanvasProps {
  nodes: FlowNode[];
  paths: FlowPath[];
  activeStep: number;
  isSpiked: boolean;
  isFailed: boolean;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
}

export default function FlowCanvas({
  nodes,
  paths,
  activeStep,
  isSpiked,
  isFailed,
  selectedNodeId,
  onSelectNode
}: FlowCanvasProps) {
  
  // Custom SVG path drawing logic with smooth bezier curves
  const getPathDefinition = (fromNode: FlowNode, toNode: FlowNode, curved = true) => {
    const { x: x1, y: y1 } = fromNode;
    const { x: x2, y: y2 } = toNode;
    
    if (!curved) {
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    }
    
    // Draw sweeping cubic Bezier curves
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    
    if (y1 === y2) {
      // Horizontal bezier
      const controlX = x1 + (x2 - x1) / 2;
      return `M ${x1} ${y1} C ${controlX} ${y1}, ${controlX} ${y2}, ${x2} ${y2}`;
    } else if (x1 === x2) {
      // Vertical bezier
      const controlY = y1 + (y2 - y1) / 2;
      return `M ${x1} ${y1} C ${x1} ${controlY}, ${x2} ${controlY}, ${x2} ${y2}`;
    } else {
      // Sweeping S-Curve
      const controlX1 = x1 + (x2 - x1) / 2;
      const controlY1 = y1;
      const controlX2 = x1 + (x2 - x1) / 2;
      const controlY2 = y2;
      return `M ${x1} ${y1} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${x2} ${y2}`;
    }
  };

  return (
    <div className="relative w-full overflow-x-auto custom-scrollbar bg-slate-100/50 dark:bg-[#0c1020]/45 border border-slate-200 dark:border-white/5 rounded-3xl backdrop-blur-md shadow-lg dark:shadow-2xl">
      
      {/* Swipe Alert Indicator for Mobile viewports */}
      <div className="md:hidden absolute top-4 right-4 z-20 px-3 py-1.5 bg-indigo-600/10 dark:bg-indigo-600/20 border border-indigo-500/20 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-wider rounded-lg animate-pulse pointer-events-none select-none">
        Swipe Canvas ➔
      </div>

      {/* Locked size inner container to preserve SVG paths and card coordinates perfectly */}
      <div className="w-[1000px] h-[520px] relative shrink-0 p-4 overflow-hidden">
        
        {/* Visual background engineering grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#6b72800a_1px,transparent_1px),linear-gradient(to_bottom,#6b72800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f29370c_1px,transparent_1px),linear-gradient(to_bottom,#1f29370c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
        
        {/* Background neon ambient lights */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* SVG Connections & Particle Stream Canvas */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 520">
          <defs>
            <linearGradient id="normalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="successGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="errorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.7" />
            </linearGradient>
            
            {/* Drop shadows for glowing particles */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Draw Neon Connection Lines */}
          {paths.map((path, idx) => {
            const fromNode = nodes.find(n => n.id === path.from);
            const toNode = nodes.find(n => n.id === path.to);
            
            if (!fromNode || !toNode) return null;
            
            const pathD = getPathDefinition(fromNode, toNode, path.curved !== false);
            
            // Determine path styling based on system states
            const isErrorLine = isFailed && (path.type === "error" || toNode.status === "error" || fromNode.status === "error");
            const isActiveLine = activeStep >= nodes.findIndex(n => n.id === path.from) && activeStep >= nodes.findIndex(n => n.id === path.to);
            
            let strokeColor = "url(#normalGrad)";
            let strokeWidth = 2.2;
            let dashArray = "";
            
            if (isErrorLine) {
              strokeColor = "url(#errorGrad)";
              strokeWidth = 2.8;
              dashArray = "4, 4";
            } else if (isActiveLine) {
              strokeColor = "url(#successGrad)";
              strokeWidth = 2.6;
            }

            return (
              <g key={`group-${idx}`}>
                {/* Backgroud thick glow connection */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isErrorLine ? "#ef4444" : isActiveLine ? "#10b981" : "#818cf8"}
                  strokeWidth={strokeWidth * 3}
                  strokeOpacity={isErrorLine ? 0.15 : isActiveLine ? 0.12 : 0.04}
                  className="transition-all duration-500"
                />
                {/* Main connection curve */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                  className="transition-all duration-500"
                />

                {/* Streaming Data Packets (Moving Particles) */}
                {!isFailed && (
                  <>
                    {/* Particle 1 */}
                    <circle r={isSpiked ? 5.5 : 4.5} fill={isSpiked ? "#f59e0b" : "#8b5cf6"} filter="url(#glow)">
                      <animateMotion 
                        dur={isSpiked ? "1.1s" : "2.4s"} 
                        repeatCount="indefinite" 
                        path={pathD} 
                      />
                    </circle>
                    
                    {/* Particle 2 */}
                    <circle r={isSpiked ? 5 : 4} fill={isSpiked ? "#10b981" : "#4f46e5"} filter="url(#glow)">
                      <animateMotion 
                        dur={isSpiked ? "1.3s" : "2.7s"} 
                        begin={isSpiked ? "0.3s" : "0.9s"}
                        repeatCount="indefinite" 
                        path={pathD} 
                      />
                    </circle>
                  </>
                )}

                {/* Red Failure Alert Packets in Failure/Chaos mode */}
                {isErrorLine && (
                  <circle r={5} fill="#ef4444" filter="url(#glow)">
                    <animateMotion 
                      dur="0.8s" 
                      repeatCount="indefinite" 
                      path={pathD} 
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Architecture Node Cards */}
        <div className="absolute inset-0 pointer-events-none">
          {nodes.map((node, idx) => {
            const Icon = node.icon;
            const isSelected = selectedNodeId === node.id;
            const isActiveStep = activeStep === idx;
            
            let cardBorder = "border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/60";
            let shadow = "shadow-md dark:shadow-2xl";
            let glowDot = "bg-slate-400 dark:bg-slate-600";
            
            if (node.status === "error") {
              cardBorder = "border-red-500/40 bg-red-50 dark:bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] dark:shadow-[0_0_15px_rgba(239,68,68,0.15)]";
              glowDot = "bg-red-500 animate-pulse";
            } else if (isActiveStep || node.status === "active") {
              cardBorder = "border-indigo-500/50 bg-indigo-50/50 dark:border-indigo-500/40 dark:bg-indigo-950/25 shadow-[0_0_15px_rgba(99,102,241,0.1)] dark:shadow-[0_0_15px_rgba(99,102,241,0.15)]";
              glowDot = "bg-indigo-500 dark:bg-indigo-400 animate-ping";
            } else if (node.status === "success") {
              cardBorder = "border-emerald-500/40 bg-emerald-50/10 dark:border-emerald-500/30 dark:bg-slate-900/70";
              glowDot = "bg-emerald-500 shadow-[0_0_8px_#10b981]";
            } else if (isSelected) {
              cardBorder = "border-purple-500/40 bg-purple-50/10 dark:border-purple-500/40 dark:bg-slate-900/80 shadow-[0_0_10px_rgba(168,85,247,0.1)] dark:shadow-[0_0_10px_rgba(168,85,247,0.15)]";
            }

          return (
            <motion.button
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: isSelected ? 1.05 : 1, 
                opacity: 1,
                x: node.x - 70, // Shift to center cards
                y: node.y - 45
              }}
              whileHover={{ scale: isSelected ? 1.05 : 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`absolute pointer-events-auto flex flex-col items-start w-[155px] p-3 rounded-2xl border backdrop-blur-md transition-all text-left group cursor-pointer ${cardBorder} ${shadow}`}
            >
              {/* Top status ribbon */}
              <div className="flex justify-between items-center w-full mb-1.5">
                <div className={`p-1.5 rounded-lg transition-colors duration-300 ${
                  node.status === "error" 
                    ? "bg-red-500/10 text-red-500 dark:text-red-400" 
                    : node.status === "success" 
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                    : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                {/* Visual Status Indicator Light */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] uppercase tracking-tighter text-slate-500 dark:text-slate-400 font-semibold opacity-80">
                    {node.status}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${glowDot}`} />
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-extrabold text-xs text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-300 truncate w-full transition-colors">
                {node.title}
              </h3>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate w-full opacity-90 leading-none mt-0.5 mb-1.5">
                {node.subtitle}
              </p>

              {/* Live Metric Counter Badge */}
              <div className="flex items-center justify-between w-full border-t border-slate-100 dark:border-white/5 pt-1.5 mt-auto">
                <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider">
                  {node.metrics.label}
                </span>
                <span className={`text-[10px] font-black tracking-tight ${
                  node.status === "error" 
                    ? "text-red-500 dark:text-red-400" 
                    : node.status === "success" 
                    ? "text-emerald-600 dark:text-emerald-400 font-bold" 
                    : "text-indigo-600 dark:text-indigo-400"
                }`}>
                  {node.metrics.value}
                </span>
              </div>
            </motion.button>
          );
        })}
        </div>
      </div>
    </div>
  );
}
