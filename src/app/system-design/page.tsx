import { Suspense } from 'react';
import SystemDesignClient from './SystemDesignClient';

export const metadata = {
  title: 'System Design Explorer | DevExCode',
  description: 'Master system design interviews with our comprehensive guides, case studies, and architecture deep dives.',
};

export default function SystemDesignPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <SystemDesignClient />
    </Suspense>
  );
}
