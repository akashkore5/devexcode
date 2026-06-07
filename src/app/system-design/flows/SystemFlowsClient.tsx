'use client';
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { SYSTEM_FLOWS } from "./flows-data";

export default function SystemFlowsClient() {
  const router = useRouter();

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

              return (
                <motion.div
                  key={flow.id}
                  whileHover={{ y: -5 }}
                  onClick={() => router.push(`/system-design/flows/${flow.id}`)}
                  className="glass dark:glass-dark p-8 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden group cursor-pointer flex flex-col justify-between"
                >
                  {/* Glowing backdrop circle */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 blur-3xl opacity-0 group-hover:opacity-10 dark:group-hover:opacity-15 transition-opacity duration-700 pointer-events-none" />

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

                  <Link
                    href={`/system-design/flows/${flow.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full rounded-2xl font-black text-[10px] uppercase tracking-widest py-3 px-4 border transition-all bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/60 flex items-center justify-center"
                  >
                    Launch in Sandbox
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
