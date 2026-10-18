import type { Metadata } from 'next';
import CommunityClient from "./CommunityClient";

import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'Developer Community - Connect & Share Solutions | DevExCode',
  description: 'Join the DevExCode engineering community. Discuss LeetCode approaches, system design architecture questions, career growth, and FAANG interview prep.',
  canonicalPath: '/community',
  keywords: [
    'devexcode community', 'developer community', 'coding forum',
    'leetcode community', 'tech interview community', 'software engineering discussion'
  ],
});

export default async function CommunityPage() {
  return <CommunityClient />;
}
