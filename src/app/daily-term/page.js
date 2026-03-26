import { Suspense } from 'react';
import DailyTermsClient from './DailyTermsClient';

export const metadata = {
  title: 'Daily Tech Terms - DevExCode',
  description: 'Explore daily technical terms to boost your coding knowledge. Master concepts in software development, system design, and more.',
  keywords: 'daily term, technical term, coding, programming, DevExCode, software development, tech education',
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
