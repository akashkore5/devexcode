import type { Metadata } from 'next';
import { DataService } from "../../lib/data-service";
import Learn10Client from "./Learn10Client";

export const metadata: Metadata = {
  title: 'Learn in 10 Minutes - Quick Engineering Briefs | DevExCode',
  description: 'Master 300+ engineering concepts in 10 minutes each on DevExCode. High-density technical briefs on Kafka, Kubernetes, Redis, databases, system design, and more.',
  keywords: [
    'learn10', 'devexcode', 'devex code', '10 minute learning', 'quick tech briefs',
    'engineering concepts', 'Kafka tutorial', 'Kubernetes guide', 'Redis tutorial',
    'system design concepts', 'quick learning', 'tech education',
  ],
  alternates: { canonical: 'https://devexcode.com/learn10' },
  openGraph: {
    title: 'Learn in 10 Minutes - Quick Engineering Briefs | DevExCode',
    description: '300+ engineering concepts explained in 10 minutes. Level up your technical knowledge on DevExCode.',
    url: 'https://devexcode.com/learn10',
    type: 'website',
  },
};

export default async function Learn10Page() {
  const topics = await DataService.getLearn10Topics();
  const categories = await DataService.getLearn10Categories();

  return <Learn10Client initialTopics={topics} categories={categories} />;
}
