'use client';

import { useState, useEffect, useRef } from "react";
import { Terminal, Shield, RefreshCw, Layers, CheckCircle2 } from "lucide-react";

interface LogsPanelProps {
  logs: string[];
  activeStep: number;
}

export default function LogsPanel({ logs, activeStep }: LogsPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(logs.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#070913] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-lg dark:shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#090b16] border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="w-px h-3.5 bg-white/10 mx-1.5" />
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
            DevOps Console
          </span>
        </div>
        
        {/* Copy Shell Action */}
        <button
          onClick={handleCopyLogs}
          className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 hover:text-white px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-all flex items-center gap-1.5 animate-none"
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Copied!
            </>
          ) : (
            <>
              <Layers className="w-3 h-3 text-indigo-400" />
              Copy Output
            </>
          )}
        </button>
      </div>

      {/* Terminal Screen lines */}
      <div
        ref={containerRef}
        className="flex-grow p-5 font-mono text-[11px] leading-relaxed text-indigo-200/90 overflow-y-auto max-h-[220px] custom-scrollbar scroll-smooth"
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-slate-500 border-b border-white/5 pb-2 mb-2 font-semibold">
            $ init-sandbox --system-flow --active-deployment
            <br />
            <span className="text-[10px] text-indigo-400/60 font-medium">
              Initializing infrastructure monitor socket... Connected.
            </span>
          </span>

          {logs.map((log, index) => {
            const isError = log.includes("[ERROR]");
            const isWarn = log.includes("[WARN]");
            const isSuccess = log.includes("Success!") || log.includes("[SUCCESS]") || log.includes("passed");
            
            let textColor = "text-indigo-200/85";
            let label = "🔧 [SYS]";
            
            if (isError) {
              textColor = "text-rose-400 font-semibold";
              label = "🚨 [ERR]";
            } else if (isWarn) {
              textColor = "text-amber-400";
              label = "⚠️ [WRN]";
            } else if (isSuccess) {
              textColor = "text-emerald-400 font-semibold";
              label = "✅ [OK] ";
            }

            return (
              <div 
                key={index} 
                className={`flex items-start gap-2.5 transition-all duration-300 ${textColor}`}
              >
                <span className="select-none text-slate-600 font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-extrabold text-[10px] tracking-wide text-slate-500 uppercase select-none leading-relaxed">
                  {label}
                </span>
                <span className="flex-grow break-all select-text font-medium leading-relaxed">
                  {log.replace("[ERROR]", "").replace("[WARN]", "").replace("[SUCCESS]", "").replace("[INFO]", "")}
                </span>
              </div>
            );
          })}
          
          {/* Mock shell typing cursor */}
          <div className="flex items-center gap-1.5 text-slate-500 pt-1.5 animate-pulse select-none">
            <span className="font-bold text-indigo-400">$</span>
            <span className="w-1.5 h-3 bg-indigo-400 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
