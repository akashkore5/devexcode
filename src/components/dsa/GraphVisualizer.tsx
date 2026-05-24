'use client';

import { motion } from 'framer-motion';
import { GraphNode, GraphEdge } from './types';

interface Props {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export default function GraphVisualizer({ nodes, edges }: Props) {
  // Default responsive layout coordinates for 6 standard nodes
  const nodeCoordinates: Record<string, { x: number; y: number }> = {
    '0': { x: 100, y: 130 },
    '1': { x: 220, y: 70 },
    '2': { x: 220, y: 190 },
    '3': { x: 340, y: 70 },
    '4': { x: 340, y: 190 },
    '5': { x: 460, y: 130 }
  };

  return (
    <div className="relative h-full w-full py-4 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
      
      <svg className="w-full max-w-2xl h-60 relative z-10 overflow-visible" viewBox="0 0 560 260">
        
        {/* Draw Edges */}
        {edges.map((edge, idx) => {
          const start = nodeCoordinates[edge.source] || { x: 0, y: 0 };
          const end = nodeCoordinates[edge.target] || { x: 0, y: 0 };
          
          return (
            <g key={`edge-${idx}`}>
              {/* Backing base edge */}
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="3"
              />
              
              {/* Glowing animated overlay edge */}
              <motion.line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                animate={{
                  stroke: edge.active ? '#6366f1' : 'rgba(255,255,255,0.18)',
                  strokeWidth: edge.active ? 4.5 : 3
                }}
                className={edge.active ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''}
              />

              {/* Edge weights */}
              {edge.weight !== undefined && (
                <text
                  x={(start.x + end.x) / 2}
                  y={(start.y + end.y) / 2 - 8}
                  fill="#cbd5e1"
                  fontSize="9"
                  fontWeight="black"
                  className="font-mono text-center select-none"
                  textAnchor="middle"
                >
                  {edge.weight}
                </text>
              )}

              {/* Dynamic traveling particle on active edges */}
              {edge.active && (
                <motion.circle
                  r="4"
                  fill="#818cf8"
                  animate={{
                    cx: [start.x, end.x],
                    cy: [start.y, end.y]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'linear'
                  }}
                  className="drop-shadow-[0_0_6px_rgba(129,140,248,0.8)]"
                />
              )}
            </g>
          );
        })}

        {/* Draw Nodes */}
        {nodes.map((node) => {
          const coords = nodeCoordinates[node.id] || { x: 0, y: 0 };
          
          let circleColor = 'bg-slate-900 border-slate-800 text-slate-300 font-bold';
          let glowClass = '';
          
          if (node.state === 'active') {
            circleColor = 'bg-indigo-500/20 border-indigo-400 text-indigo-200';
            glowClass = 'drop-shadow-[0_0_12px_rgba(99,102,241,0.55)]';
          } else if (node.state === 'visited') {
            circleColor = 'bg-emerald-500/20 border-emerald-400 text-emerald-200';
            glowClass = 'drop-shadow-[0_0_12px_rgba(16,185,129,0.45)]';
          } else if (node.state === 'path') {
            circleColor = 'bg-yellow-500/20 border-yellow-400 text-yellow-200';
            glowClass = 'drop-shadow-[0_0_12px_rgba(251,191,36,0.45)]';
          }

          return (
            <g key={`node-${node.id}`} className="cursor-pointer">
              {/* Outer glowing halo ring on active nodes */}
              {node.state === 'active' && (
                <motion.circle
                  cx={coords.x}
                  cy={coords.y}
                  r="30"
                  fill="none"
                  stroke="rgba(99,102,241,0.2)"
                  strokeWidth="2.5"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
              
              <foreignObject
                x={coords.x - 22}
                y={coords.y - 22}
                width="44"
                height="44"
                className="overflow-visible"
              >
                <motion.div
                  layout
                  whileHover={{ scale: 1.08 }}
                  className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-xl transition-all ${circleColor} ${glowClass}`}
                >
                  {node.label || node.id}
                </motion.div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
