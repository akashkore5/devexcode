import { Suspense } from 'react';
import JavaTopicsClient from './JavaTopicsClient';

export const metadata = {
  title: 'Java Learning - DevExCode',
  description: 'Master Java with our comprehensive learning path. Cover basics, OOP, core concepts, and more.',
};

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
