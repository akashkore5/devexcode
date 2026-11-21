import LeetcodeClient from './LeetcodeClient';
import { DataService } from '../../lib/data-service';

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

export default async function LeetcodePage() {
  const [problems, tags] = await Promise.all([
    DataService.getProblems(),
    DataService.getTags(),
  ]);

  return <LeetcodeClient initialProblems={problems} initialTags={tags} />;
}
