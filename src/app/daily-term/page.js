import { Suspense } from 'react';
import DailyTermsClient from './DailyTermsClient';

export const metadata = {
  title: 'Daily Tech Term - Learn One Concept Every Day | DevExCode',
  description: 'Expand your developer vocabulary daily on DevExCode (DevEx Code). One technical term explained in-depth every day — from algorithms and data structures to system design and cloud computing.',
  keywords: 'daily tech term, devexcode, devex code, technical term of the day, coding vocabulary, programming concepts, software development terms, tech education, daily learning',
  alternates: { canonical: 'https://devexcode.com/daily-term' },
  openGraph: {
    title: 'Daily Tech Term | DevExCode',
    description: 'One technical term, explained in-depth, every day. Boost your coding vocabulary on DevExCode.',
    url: 'https://devexcode.com/daily-term',
    type: 'website',
  },
};

export default function DailyTermsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <DailyTermsClient />
    </Suspense>
  );
}
