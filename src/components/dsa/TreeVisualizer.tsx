'use client';

import { motion } from 'framer-motion';

interface TreeNode {
  id: string;
  val: string;
  x: number;
  y: number;
  leftId?: string;
  rightId?: string;
  state: 'normal' | 'active' | 'highlight';
}

interface Props {
  nodes?: { id: string; state: 'normal' | 'active' | 'path' }[];
}

export default function TreeVisualizer({ nodes = [] }: Props) {
  // Pre-calculated balanced BST node layout for 7 nodes
  const treeNodes: TreeNode[] = [
    { id: '1', val: '4', x: 280, y: 40, leftId: '2', rightId: '3', state: 'normal' },
    { id: '2', val: '2', x: 160, y: 110, leftId: '4', rightId: '5', state: 'normal' },
    { id: '3', val: '6', x: 400, y: 110, leftId: '6', rightId: '7', state: 'normal' },
    { id: '4', val: '1', x: 100, y: 180, state: 'normal' },
    { id: '5', val: '3', x: 220, y: 180, state: 'normal' },
    { id: '6', val: '5', x: 340, y: 180, state: 'normal' },
    { id: '7', val: '7', x: 460, y: 180, state: 'normal' }
  ];

  // Map state highlights from props
  const activeNodeIds = nodes.map(n => n.id);
  const activeStates = nodes.reduce((acc, curr) => {
    acc[curr.id] = curr.state;
    return acc;
  }, {} as Record<string, 'normal' | 'active' | 'path'>);

  return (
    <div className="relative h-full w-full py-4 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.02] pointer-events-none" />
      
      <svg className="w-full max-w-2xl h-60 relative z-10 overflow-visible" viewBox="0 0 560 240">
        
        {/* Draw Edges */}
        {treeNodes.map((node) => {
          const edges = [];
          if (node.leftId) {
            const leftNode = treeNodes.find(t => t.id === node.leftId);
            if (leftNode) edges.push(leftNode);
          }
          if (node.rightId) {
            const rightNode = treeNodes.find(t => t.id === node.rightId);
            if (rightNode) edges.push(rightNode);
          }
          
          return edges.map((target) => {
            const isEdgeActive = activeNodeIds.includes(node.id) && activeNodeIds.includes(target.id);
            
            return (
              <g key={`edge-${node.id}-${target.id}`}>
                <line
                  x1={node.x}
                  y1={node.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="2.5"
                />
                <motion.line
                  x1={node.x}
                  y1={node.y}
                  x2={target.x}
                  y2={target.y}
                  animate={{
                    stroke: isEdgeActive ? '#818cf8' : 'rgba(255,255,255,0.15)',
                    strokeWidth: isEdgeActive ? 3.5 : 2.5
                  }}
                  className={isEdgeActive ? 'drop-shadow-[0_0_6px_rgba(129,140,248,0.5)]' : ''}
                />
              </g>
            );
          });
        })}

        {/* Draw Nodes */}
        {treeNodes.map((node) => {
          const isActive = activeNodeIds.includes(node.id);
          const state = activeStates[node.id] || 'normal';
          
          let circleColor = 'bg-slate-900 border-slate-800 text-slate-350 font-bold';
          let glowClass = '';
          
          if (state === 'active') {
            circleColor = 'bg-indigo-500/20 border-indigo-400 text-indigo-200';
            glowClass = 'drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]';
          } else if (state === 'path') {
            circleColor = 'bg-emerald-500/25 border-emerald-400 text-emerald-200';
            glowClass = 'drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]';
          }

          return (
            <g key={`node-${node.id}`}>
              {/* Outer pulsing ring on active node */}
              {state === 'active' && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="26"
                  fill="none"
                  stroke="rgba(99,102,241,0.2)"
                  strokeWidth="2"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                />
              )}
              
              <foreignObject
                x={node.x - 18}
                y={node.y - 18}
                width="36"
                height="36"
                className="overflow-visible"
              >
                <motion.div
                  layout
                  whileHover={{ scale: 1.1 }}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-xl transition-all ${circleColor} ${glowClass}`}
                >
                  {node.val}
                </motion.div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
