import { Suspense } from 'react';
import DSAPlaygroundClient from './DSAPlaygroundClient';

import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Core DSA Practice & Telemetry Visualizer | DevExCode',
  description: 'Master core Data Structures and Algorithms through dynamic real-time visualizations, step-by-step state tracking, and FAANG interview masterclasses on DevExCode.',
  canonicalPath: '/practice/dsa',
  keywords: ['DSA', 'Data Structures', 'Algorithms', 'Visualizer', 'Coding Interview', 'LeetCode', 'DevExCode'],
});

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
