import { Suspense } from 'react';
import SystemDesignClient from './SystemDesignClient';

import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'System Design Explorer - 75+ Architecture Blueprints | DevExCode',
  description: 'Master system design interviews with 75+ architecture blueprints on DevExCode. In-depth guides for distributed systems, microservices, Kafka, Redis, load balancers, caching, and scalability.',
  canonicalPath: '/system-design',
  keywords: [
    'system design', 'devexcode', 'system design interview',
    'distributed systems', 'microservices', 'Kafka architecture', 'Redis',
    'Kubernetes', 'system design blueprints', 'architecture patterns',
    'FAANG system design', 'scalability', 'high availability',
  ],
});

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
