'use client';

import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Zap, ShieldAlert } from "lucide-react";
import { Button } from "../../components/ui/button";

interface SimulationControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  isSpiked: boolean;
  onToggleSpike: () => void;
  isFailed: boolean;
  onToggleFailure: () => void;
  activeStep: number;
  totalSteps: number;
}

export default function SimulationControls({
  isPlaying,
  onTogglePlay,
  onReset,
  onStepForward,
  onStepBackward,
  isSpiked,
  onToggleSpike,
  isFailed,
  onToggleFailure,
  activeStep,
  totalSteps
}: SimulationControlsProps) {
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-5 p-5 bg-slate-55/60 dark:bg-[#090d19]/60 border border-slate-200 dark:border-white/5 rounded-3xl backdrop-blur-md shadow-md dark:shadow-2xl">
      {/* Step Progress & Timeline Player */}
      <div className="flex items-center gap-3">
        <Button
          onClick={onStepBackward}
          disabled={activeStep === 0}
          variant="outline"
          size="icon"
          className="rounded-xl w-10 h-10 border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          onClick={onTogglePlay}
          className={`rounded-2xl px-6 py-5 font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 ${
            isPlaying 
              ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/10" 
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Play Flow
            </>
          )}
        </Button>

        <Button
          onClick={onStepForward}
          disabled={activeStep === totalSteps - 1}
          variant="outline"
          size="icon"
          className="rounded-xl w-10 h-10 border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        <Button
          onClick={onReset}
          variant="ghost"
          size="icon"
          className="rounded-xl w-10 h-10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
          title="Reset Pipeline"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Step count indicator progress */}
      <div className="hidden lg:flex items-center gap-4 flex-grow max-w-sm">
        <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 select-none">
          Progress
        </span>
        <div className="flex-grow h-2.5 bg-slate-200 dark:bg-slate-900 border border-slate-300/40 dark:border-white/5 rounded-full overflow-hidden flex gap-0.5 p-0.5">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-grow rounded-sm transition-all duration-300 ${
                idx === activeStep
                  ? isFailed ? "bg-rose-500 shadow-[0_0_8px_#f43f5e]" : "bg-indigo-600 dark:bg-indigo-500 shadow-[0_0_8px_#6366f1]"
                  : idx < activeStep
                  ? "bg-emerald-500"
                  : "bg-slate-300 dark:bg-slate-800"
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 font-mono w-10 text-right">
          {activeStep + 1}/{totalSteps}
        </span>
      </div>

      {/* Environment Controls: Traffic Spike & Failure Injection */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        {/* Traffic Spike Button */}
        <button
          onClick={onToggleSpike}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
            isSpiked
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
              : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/10 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Zap className={`w-4 h-4 ${isSpiked ? "fill-amber-500 text-amber-500 dark:text-amber-400" : ""}`} />
          {isSpiked ? "Traffic: High" : "Traffic: Normal"}
        </button>

        {/* Failure Injection Button */}
        <button
          onClick={onToggleFailure}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
            isFailed
              ? "bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.1)]"
              : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/10 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          {isFailed ? "Chaos Active" : "Inject Failure"}
        </button>
      </div>
    </div>
  );
}
