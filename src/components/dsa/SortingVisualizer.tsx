'use client';

import { motion } from 'framer-motion';
import { SortingBar } from './types';

interface Props {
  bars: SortingBar[];
}

export default function SortingVisualizer({ bars }: Props) {
  // Find max value to scale heights proportionally
  const maxValue = Math.max(...bars.map(b => b.value), 1);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-8 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
      
      {/* Bars container */}
      <div className="flex items-end justify-center gap-2.5 sm:gap-4 h-48 w-full max-w-xl relative z-10">
        {bars.map((bar, idx) => {
          const heightPercent = `${(bar.value / maxValue) * 100}%`;
          
          let colorClass = 'bg-slate-800 border-slate-700/50 text-slate-400';
          let shadowClass = '';
          
          if (bar.state === 'compare') {
            colorClass = 'bg-gradient-to-t from-blue-600/40 to-blue-500 border-blue-400 text-blue-200';
            shadowClass = 'shadow-[0_0_15px_rgba(59,130,246,0.3)]';
          } else if (bar.state === 'swap') {
            colorClass = 'bg-gradient-to-t from-red-600/40 to-red-500 border-red-400 text-red-200';
            shadowClass = 'shadow-[0_0_15px_rgba(239,68,68,0.3)]';
          } else if (bar.state === 'sorted') {
            colorClass = 'bg-gradient-to-t from-emerald-600/40 to-emerald-500 border-emerald-400 text-emerald-200';
            shadowClass = 'shadow-[0_0_15px_rgba(16,185,129,0.3)]';
          } else if (bar.state === 'pivot') {
            colorClass = 'bg-gradient-to-t from-yellow-600/40 to-yellow-500 border-yellow-400 text-yellow-200';
            shadowClass = 'shadow-[0_0_15px_rgba(251,191,36,0.3)]';
          }

          return (
            <div key={idx} className="flex flex-col items-center flex-1 max-w-[40px] h-full justify-end relative group">
              {/* Animated Height Bar */}
              <motion.div
                layout
                animate={{ height: heightPercent }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`w-full rounded-t-xl border-t border-x transition-all duration-300 relative flex items-center justify-center ${colorClass} ${shadowClass}`}
              >
                {/* Embedded bar height/value */}
                <span className="text-[10px] font-black font-mono tracking-tighter absolute bottom-2 select-none">
                  {bar.value}
                </span>
              </motion.div>
              
              {/* Index marker */}
              <span className="text-[8px] font-black font-mono text-slate-600 mt-2 select-none">
                idx {idx}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
