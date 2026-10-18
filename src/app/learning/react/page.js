import { Suspense } from 'react';
import ReactTopicsClient from './ReactTopicsClient';

import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'React.js Learning Path & Architecture Guide | DevExCode',
  description: 'Master modern React.js from fundamentals to advanced patterns. Deep dives into hooks, state management, Server Components, performance, and best practices on DevExCode.',
  canonicalPath: '/learning/react',
  keywords: ['react learning', 'react tutorial', 'react hooks', 'next.js', 'frontend architecture', 'devexcode'],
});

export default function ReactLearningPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <ReactTopicsClient />
    </Suspense>
  );
}
