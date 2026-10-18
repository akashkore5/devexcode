import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import FlowSimulatorClient from './FlowSimulatorClient';
import { SYSTEM_FLOWS } from '../flows-data';

const VALID_FLOW_IDS = ['deployment', 'auth', 'scaling', 'cache', 'balancer', 'dns', 'payment'];

import { constructMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ flowId: string }> }) {
  const { flowId } = await params;
  const flow = SYSTEM_FLOWS.find(f => f.id === flowId);
  if (!flow) return { title: 'Flow Not Found | DevExCode' };
  return constructMetadata({
    title: `${flow.title} - Interactive Flow Simulator | DevExCode`,
    description: flow.description,
    canonicalPath: `/system-design/flows/${flowId}`,
    keywords: [flow.title, 'system flow', 'architecture simulation', 'interactive sandbox', 'devexcode'],
  });
}

export async function generateStaticParams() {
  return VALID_FLOW_IDS.map(id => ({ flowId: id }));
}

export default async function FlowPage({ params }: { params: Promise<{ flowId: string }> }) {
  const { flowId } = await params;
  if (!VALID_FLOW_IDS.includes(flowId)) {
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
      <FlowSimulatorClient flowId={flowId} />
    </Suspense>
  );
}
