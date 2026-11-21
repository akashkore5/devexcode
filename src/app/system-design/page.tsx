import Link from 'next/link';
import SystemDesignClient from './SystemDesignClient';
import { DataService } from '../../lib/data-service';

const slugify = (title: string) =>
  title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

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

export default async function SystemDesignPage() {
  // Resolved on the server so all 182 question links ship in the HTML.
  const [questions, tags] = await Promise.all([
    DataService.getSystemDesignQuestions(),
    DataService.getSystemDesignTags(),
  ]);

  return (
    <>
      <SystemDesignClient initialQuestions={questions} initialTags={tags} />

      {/* The client paginates in React state, so only the first page of links
          reaches the HTML. These 182 guides are the deepest content on the
          site; this index gives every one a crawlable inbound link. */}
      <nav aria-label="All system design guides" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          All system design guides
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
          {questions.map((q) => (
            <li key={q.id}>
              <Link
                href={`/system-design/${q.id}-${slugify(q.title)}`}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {q.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
