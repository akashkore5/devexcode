import { Suspense } from 'react';
import DSAPlaygroundClient from './DSAPlaygroundClient';

export const metadata = {
  title: 'Core DSA Practice & Telemetry Visualizer - DevExCode',
  description: 'Master 100 core Data Structures and Algorithms through dynamic, 60fps real-time animated visualizations, first-principles blueprints, and FAANG interview masterclasses.',
  keywords: 'DSA, Data Structures, Algorithms, Visualizer, Coding, Coding Interview, Permutations, Binary Search, Dijkstra, LeetCode, DevExCode',
};

export default function DSAPracticePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Loading DSA Telemetry Sandbox...</p>
      </div>
    }>
      <DSAPlaygroundClient />
    </Suspense>
  );
}
