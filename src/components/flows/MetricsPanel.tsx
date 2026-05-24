'use client';

import { motion } from "framer-motion";
import { Cpu, HardDrive, Activity } from "lucide-react";

interface MetricsPanelProps {
  cpu: number;
  memory: number;
  requestsCount: number;
  errorRate: number;
  latency: number;
}

export default function MetricsPanel({
  cpu,
  memory,
  requestsCount,
  errorRate,
  latency
}: MetricsPanelProps) {
  
  const getCpuColor = (val: number) => {
    if (val > 80) return "bg-rose-500 shadow-[0_0_8px_#f43f5e]";
    if (val > 60) return "bg-amber-500 shadow-[0_0_8px_#f59e0b]";
    return "bg-indigo-600 dark:bg-indigo-500 shadow-[0_0_8px_#6366f1]";
  };

  const getErrorColor = (val: number) => {
    if (val > 5) return "text-rose-500 dark:text-rose-400";
    if (val > 0) return "text-amber-500 dark:text-amber-400";
    return "text-emerald-600 dark:text-emerald-400";
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-full bg-slate-50/50 dark:bg-[#080c16]/50 border border-slate-200 dark:border-white/5 p-5 rounded-3xl backdrop-blur-md shadow-md dark:shadow-2xl">
      {/* Metric 1: CPU load */}
      <div className="flex flex-col justify-between p-4 bg-white dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center w-full mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400">
              Cluster CPU
            </span>
          </div>
          <span className="text-xs font-black text-slate-900 dark:text-white">{cpu}%</span>
        </div>
        
        {/* Animated Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-all duration-700 ${getCpuColor(cpu)}`}
            initial={{ width: 0 }}
            animate={{ width: `${cpu}%` }}
          />
        </div>
      </div>

      {/* Metric 2: Memory Load */}
      <div className="flex flex-col justify-between p-4 bg-white dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center w-full mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400">
              Memory Usage
            </span>
          </div>
          <span className="text-xs font-black text-slate-900 dark:text-white">{memory}%</span>
        </div>
        
        {/* Animated Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-purple-600 dark:bg-purple-500 shadow-[0_0_8px_#a855f7] transition-all duration-700`}
            initial={{ width: 0 }}
            animate={{ width: `${memory}%` }}
          />
        </div>
      </div>

      {/* Metric 3: Total Requests Speed */}
      <div className="flex items-center gap-3.5 p-4 bg-white dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Activity className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500">
            Total Requests
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white leading-tight mt-0.5">
            {requestsCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Metric 4: Latency & Errors */}
      <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
        <div className="flex flex-col justify-center">
          <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500">
            Avg Latency
          </span>
          <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 leading-tight mt-0.5">
            {latency}ms
          </span>
        </div>
        
        <div className="w-px h-8 bg-slate-200 dark:bg-white/5" />
        
        <div className="flex flex-col justify-center items-end">
          <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500">
            Error Rate
          </span>
          <span className={`text-xl font-black leading-tight mt-0.5 ${getErrorColor(errorRate)}`}>
            {errorRate.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}
