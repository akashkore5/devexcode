import { Suspense } from 'react';
import SystemFlowsClient from './SystemFlowsClient';

export const metadata = {
  title: 'Interactive System Flows Playground | DevExCode',
  description: 'Visualize backend and DevOps architectures in real time. Run step-by-step deployments, trigger CPU traffic spikes, scale Kubernetes pods, test OAuth auth sequences, and inject chaos engineering failures.',
};

export default function SystemFlowsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#0b0f17] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground animate-pulse">Initializing Flow Sandbox...</span>
        </div>
      </div>
    }>
      <SystemFlowsClient />
    </Suspense>
  );
}
