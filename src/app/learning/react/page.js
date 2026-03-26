import { Suspense } from 'react';
import ReactTopicsClient from './ReactTopicsClient';

export const metadata = {
  title: 'React Learning - DevExCode',
  description: 'Master React.js with our comprehensive learning path. Cover basics, hooks, state management, and more.',
};

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
