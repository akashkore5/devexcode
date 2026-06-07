import { Suspense } from 'react';
import LeetcodeClient from './LeetcodeClient';

export const metadata = {
  title: 'LeetCode Explorer - 7500+ Solutions | DevExCode',
  description: 'Explore 7,500+ Leetcode solutions on DevExCode (DevEx Code). Leetcode 75, Leetcode 150, SQL50, Top 100 Liked — with algorithmic explanations, time complexity analysis, and interview patterns.',
  keywords: [
    'leetcode solutions', 'devexcode', 'devex code', 'leetcode 75', 'leetcode 150',
    'SQL50', 'top 100 liked', 'coding challenges', 'algorithm solutions',
    'data structures', 'dynamic programming', 'coding interview',
    'FAANG coding interview', 'competitive programming',
  ],
  alternates: { canonical: 'https://devexcode.com/leetcode' },
  openGraph: {
    title: 'LeetCode Explorer | DevExCode',
    description: '7,500+ Leetcode solutions on DevExCode. Master coding interviews.',
    url: 'https://devexcode.com/leetcode',
    type: 'website',
  },
};

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
