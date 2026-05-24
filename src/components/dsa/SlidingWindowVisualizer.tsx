'use client';

import { motion } from 'framer-motion';

interface Props {
  indices?: number[];
  windowRange?: [number, number];
}

export default function SlidingWindowVisualizer({ indices = [], windowRange }: Props) {
  const arr = [2, 1, 5, 1, 3, 2];
  const win = windowRange || null;

  return (
    <div className="relative h-full w-full py-6 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
      
      <div className="flex items-center gap-4 relative z-10">
        {arr.map((val, idx) => {
          const isPointer = indices.includes(idx);
          const isInWindow = win && idx >= win[0] && idx <= win[1];
          
          return (
            <motion.div
              key={idx}
              animate={{ 
                scale: isPointer ? 1.15 : 1,
                borderColor: isPointer ? '#6366f1' : isInWindow ? '#10b981' : 'rgba(255,255,255,0.15)'
              }}
              className={`w-16 h-16 rounded-[22px] border flex flex-col items-center justify-center relative font-mono text-lg font-bold transition-all shadow-lg ${
                isPointer 
                  ? 'bg-gradient-to-b from-indigo-500/20 to-indigo-600/30 border-indigo-400 text-indigo-200 shadow-[0_0_25px_rgba(99,102,241,0.25)]' 
                  : isInWindow 
                  ? 'bg-gradient-to-b from-emerald-500/20 to-emerald-600/30 border-emerald-400 text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.25)] font-bold' 
                  : 'bg-slate-900/50 border-white/10 text-slate-400'
              }`}
            >
              <span>{val}</span>
              <span className="text-[9px] font-bold text-slate-600 absolute -bottom-5">idx {idx}</span>
              {win && win[0] === idx && (
                <span className="absolute -top-7 px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[8px] font-black uppercase tracking-wider shadow-md">
                  Start
                </span>
              )}
              {win && win[1] === idx && (
                <span className="absolute -top-7 px-2 py-0.5 rounded bg-red-500 text-white text-[8px] font-black uppercase tracking-wider shadow-md">
                  End
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
