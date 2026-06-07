import { Suspense } from 'react';
import SystemDesignClient from './SystemDesignClient';

export const metadata = {
  title: 'System Design Explorer - 75+ Architecture Blueprints | DevExCode',
  description: 'Master system design interviews with 75+ architecture blueprints on DevExCode (DevEx Code). Deep dives into distributed systems, microservices, Kafka, Redis, Kubernetes, databases, and real-world case studies.',
  keywords: [
    'system design', 'devexcode', 'devex code', 'system design interview',
    'distributed systems', 'microservices', 'Kafka architecture', 'Redis',
    'Kubernetes', 'system design blueprints', 'architecture patterns',
    'FAANG system design', 'scalability', 'high availability',
  ],
  alternates: { canonical: 'https://devexcode.com/system-design' },
  openGraph: {
    title: 'System Design Explorer | DevExCode',
    description: '75+ system design blueprints on DevExCode. Master architecture interviews.',
    url: 'https://devexcode.com/system-design',
    type: 'website',
  },
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
