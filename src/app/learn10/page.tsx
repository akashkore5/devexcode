import type { Metadata } from 'next';
import { DataService } from "../../lib/data-service";
import Learn10Client from "./Learn10Client";

import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: 'Learn in 10 Minutes - High-Density Engineering Briefs | DevExCode',
  description: 'Master core engineering concepts in 10-minute deep dives on DevExCode. High-density technical briefs covering Kafka, Kubernetes, Redis, distributed databases, and system architecture.',
  canonicalPath: '/learn10',
  keywords: [
    'learn10', 'devexcode', '10 minute learning', 'engineering briefs',
    'Kafka tutorial', 'Kubernetes guide', 'Redis tutorial', 'system design concepts',
  ],
});

export default async function Learn10Page() {
  const topics = await DataService.getLearn10Topics();
  const categories = await DataService.getLearn10Categories();

  return <Learn10Client initialTopics={topics} categories={categories} />;
}
