'use client';

import { motion } from 'framer-motion';
import { DPCell } from './types';

interface Props {
  grid: DPCell[][];
}

export default function DPVisualizer({ grid }: Props) {
  return (
    <div className="relative h-full w-full py-4 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
      
      {/* Dynamic Grid Container */}
      <div className="border border-white/5 rounded-3xl overflow-hidden bg-slate-950 p-4 shadow-2xl relative z-10 max-w-lg w-full">
        <table className="border-collapse w-full">
          <tbody>
            {grid.map((row, rIdx) => (
              <tr key={rIdx} className="border-b border-white/5 last:border-0">
                {row.map((cell, cIdx) => {
                  let cellClass = 'text-slate-500 border-r border-white/5 last:border-0';
                  let glowClass = '';
                  
                  if (cell.state === 'active') {
                    cellClass = 'bg-indigo-500/20 text-indigo-300 font-bold border-indigo-400/40 shadow-inner';
                    glowClass = 'shadow-[0_0_12px_rgba(99,102,241,0.2)]';
                  } else if (cell.state === 'fill') {
                    cellClass = 'bg-emerald-500/15 text-emerald-300 font-bold border-emerald-400/40';
                    glowClass = 'shadow-[0_0_12px_rgba(16,185,129,0.15)]';
                  } else if (cell.state === 'dependency') {
                    cellClass = 'bg-blue-500/10 text-blue-400 border-blue-400/20';
                  }

                  return (
                    <motion.td 
                      key={cIdx} 
                      layout
                      className={`w-14 h-12 text-center font-mono text-xs transition-all duration-300 ${cellClass} ${glowClass}`}
                    >
                      {cell.val}
                    </motion.td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Visual Ticker for Grid coordinate */}
      <div className="mt-4 text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">
         Matrix Coordinates Loop: [Row, Col]
      </div>
    </div>
  );
}
