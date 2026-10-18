import React from 'react';
import Link from 'next/link';
import databaseTopics from "@/data/database_topics.json";
import { constructMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumb";
import { Database, ArrowRight, Layers, Tag } from 'lucide-react';

export const metadata = constructMetadata({
  title: "Database Engineering & Architecture Guide | DevExCode",
  description: "Master database internals, relational modeling, NoSQL systems, indexing strategies, transactions, ACID properties, and distributed data systems on DevExCode.",
  canonicalPath: "/databases",
  keywords: [
    "database architecture", "relational databases", "NoSQL", "SQL indexing",
    "ACID transactions", "database design", "distributed databases", "DevExCode"
  ],
});

export default function DatabasesHubPage() {
  const topics = databaseTopics.topics;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Database Engineering Modules",
    "itemListElement": topics.map((t, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": t.title,
      "url": `https://devexcode.com/databases/${t.id}`
    }))
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: 'Databases', path: '/databases' }]}
          className="mb-6"
        />

        <div className="mb-12 border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            <Database className="w-3.5 h-3.5" />
            <span>Architecture & Data Systems</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-foreground">
            Database Engineering Curriculum
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
            From relational schemas and B-Tree indexing to distributed consensus, transactions, and NoSQL storage engines. Master production data architectures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="group glass dark:glass-dark rounded-3xl p-6 border border-border hover:border-primary/40 transition-all hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {topic.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    {topic.subtopics?.length || 0} subtopics
                  </span>
                </div>

                <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  <Link href={`/databases/${topic.id}`}>
                    {topic.title}
                  </Link>
                </h2>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                  {topic.description}
                </p>

                {topic.subtopics && topic.subtopics.length > 0 && (
                  <ul className="space-y-1.5 mb-4 border-t border-border/50 pt-3">
                    {topic.subtopics.slice(0, 3).map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/databases/${sub.id}`}
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 truncate"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                          <span className="truncate">{sub.title}</span>
                        </Link>
                      </li>
                    ))}
                    {topic.subtopics.length > 3 && (
                      <li className="text-[11px] text-muted-foreground/60 italic">
                        +{topic.subtopics.length - 3} more subtopics
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {(topic.tags || []).slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/databases/${topic.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
