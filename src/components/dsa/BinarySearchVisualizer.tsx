'use client';

import { motion } from 'framer-motion';

interface Props {
  indices?: number[];
}

export default function BinarySearchVisualizer({ indices = [] }: Props) {
  const arr = [2, 5, 8, 12, 16, 23, 38, 56];
  
  const low = indices[0] ?? 0;
  const high = indices[1] ?? 7;
  const mid = Math.floor((low + high) / 2);

  return (
    <div className="relative h-full w-full py-4 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
      
      <div className="flex items-center gap-3 relative z-10">
        {arr.map((val, idx) => {
          const isSearching = idx >= low && idx <= high;
          const isMid = idx === mid;
          
          return (
            <motion.div
              key={idx}
              animate={{
                opacity: isSearching ? 1 : 0.25,
                scale: isMid ? 1.15 : 1,
                borderColor: isMid ? '#fbbf24' : isSearching ? '#60a5fa' : 'rgba(255,255,255,0.15)'
              }}
              className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center relative font-mono text-base font-bold shadow-md transition-all ${
                isMid 
                  ? 'bg-gradient-to-b from-yellow-500/20 to-yellow-600/30 border-yellow-400 text-yellow-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] animate-pulse' 
                  : isSearching 
                  ? 'bg-gradient-to-b from-blue-500/10 to-blue-600/20 border-blue-400 text-blue-300' 
                  : 'bg-slate-900/40 border-white/5 text-slate-500'
              }`}
            >
              <span>{val}</span>
              {idx === low && (
                <span className="absolute -top-7 text-[8px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">Low</span>
              )}
              {idx === high && (
                <span className="absolute -bottom-7 text-[8px] font-black text-red-400 uppercase tracking-widest bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 font-mono">High</span>
              )}
              {isMid && (
                <span className="absolute -top-7 text-[8px] font-black text-yellow-400 uppercase tracking-widest bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20 font-mono">Mid</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
