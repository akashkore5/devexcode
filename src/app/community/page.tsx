import type { Metadata } from 'next';
import CommunityClient from "./CommunityClient";

export const metadata: Metadata = {
  title: 'Developer Community - DevExCode',
  description: 'Join the DevExCode community of 15,000+ engineers. Share knowledge, discuss Leetcode solutions, system design patterns, and connect with peers preparing for FAANG interviews.',
  keywords: [
    'devexcode community', 'devex community', 'developer community', 'coding community',
    'leetcode community', 'tech interview community', 'software engineers community',
    'devexcode forum', 'developer forum',
  ],
  alternates: { canonical: 'https://devexcode.com/community' },
  openGraph: {
    title: 'Developer Community - DevExCode',
    description: 'Join 15,000+ engineers on DevExCode. Discuss coding problems, system design, and ace your next tech interview.',
    url: 'https://devexcode.com/community',
    type: 'website',
  },
};

export default async function CommunityPage() {
  return <CommunityClient />;
}
