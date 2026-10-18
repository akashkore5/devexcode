import { Suspense } from 'react';
import JavaTopicsClient from './JavaTopicsClient';

import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Java Developer Learning Path & Core Concepts | DevExCode',
  description: 'Comprehensive Java learning curriculum. Master Core Java, OOP, collections, multithreading, JVM architecture, and Spring Boot on DevExCode.',
  canonicalPath: '/learning/java',
  keywords: ['java learning', 'java tutorial', 'core java', 'multithreading', 'jvm', 'devexcode'],
});

export default function JavaLearningPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <JavaTopicsClient />
    </Suspense>
  );
}
