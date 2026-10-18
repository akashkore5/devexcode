import { Suspense } from 'react';
import LeetcodeClient from './LeetcodeClient';

import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'LeetCode Explorer - 3,500+ Algorithm & Data Structure Solutions | DevExCode',
  description: 'Explore 3,500+ curated LeetCode solutions in Java, Python, and C++. Browse study plans including LeetCode 75, Top Interview 150, SQL 50, and Top 100 Liked with complexity analysis on DevExCode.',
  canonicalPath: '/leetcode',
  keywords: [
    'leetcode solutions', 'devexcode', 'leetcode 75', 'leetcode 150',
    'SQL50', 'top 100 liked', 'algorithm solutions', 'data structures',
    'coding interview prep', 'faang coding interview',
  ],
});

export default function LeetcodePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <LeetcodeClient />
    </Suspense>
  );
}
