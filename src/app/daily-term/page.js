import { Suspense } from 'react';
import Link from 'next/link';
import DailyTermsClient from './DailyTermsClient';
import dailyTerms from '../../data/daily_terms.json';

export const metadata = {
  title: 'Daily Tech Term - Learn One Concept Every Day | DevExCode',
  description: 'Expand your developer vocabulary daily on DevExCode (DevEx Code). One technical term explained in-depth every day — from algorithms and data structures to system design and cloud computing.',
  keywords: 'daily tech term, devexcode, devex code, technical term of the day, coding vocabulary, programming concepts, software development terms, tech education, daily learning',
  alternates: { canonical: 'https://www.devexcode.com/daily-term' },
  openGraph: {
    title: 'Daily Tech Term | DevExCode',
    description: 'One technical term, explained in-depth, every day. Boost your coding vocabulary on DevExCode.',
    url: 'https://www.devexcode.com/daily-term',
    type: 'website',
  },
};

export default function DailyTermsPage() {
  // DailyTermsClient reads useSearchParams, so during prerender only the
  // Suspense fallback reaches the HTML and none of the term links are emitted.
  // This archive renders outside the boundary, server-side, so every real term
  // has a crawlable inbound link.
  const archive = [...dailyTerms].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      }>
        <DailyTermsClient />
      </Suspense>

      <nav aria-label="Daily term archive" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Full term archive
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
          {archive.map((t) => (
            <li key={t.date}>
              <Link
                href={`/daily-term/${t.date}`}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {t.term}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
