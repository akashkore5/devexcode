import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import FlowSimulatorClient from './FlowSimulatorClient';
import { SYSTEM_FLOWS } from '../flows-data';

const VALID_FLOW_IDS = ['deployment', 'auth', 'scaling', 'cache', 'balancer', 'dns'];

export async function generateMetadata({ params }: { params: { flowId: string } }) {
  const flow = SYSTEM_FLOWS.find(f => f.id === params.flowId);
  if (!flow) return { title: 'Flow Not Found' };
  return {
    title: `${flow.title} | System Flow Sandbox | DevExCode`,
    description: flow.description,
  };
}

export async function generateStaticParams() {
  return VALID_FLOW_IDS.map(id => ({ flowId: id }));
}

export default function FlowPage({ params }: { params: { flowId: string } }) {
  if (!VALID_FLOW_IDS.includes(params.flowId)) {
    notFound();
  }
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#0b0f17] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground animate-pulse">Initializing Flow Sandbox...</span>
        </div>
      </div>
    }>
      <FlowSimulatorClient flowId={params.flowId} />
    </Suspense>
  );
}
