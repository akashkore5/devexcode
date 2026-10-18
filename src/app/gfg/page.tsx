import React from 'react';
import Link from 'next/link';
import gfgProblems from "@/data/gfgproblems.json";
import { constructMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumb";
import { Code2, ArrowRight } from 'lucide-react';

export const metadata = constructMetadata({
  title: "GeeksforGeeks Solutions Hub - 1,100+ Problem Explanations | DevExCode",
  description: "Browse 1,100+ GeeksforGeeks coding problem solutions in Java, C++, and Python with complexity analysis, algorithmic approaches, and clean explanations on DevExCode.",
  canonicalPath: "/gfg",
  keywords: [
    "geeksforgeeks solutions", "gfg problem solutions", "coding interview",
    "algorithms", "data structures", "Java GFG solutions", "DevExCode"
  ],
});

export default function GfgHubPage() {
  const problems = (gfgProblems as Array<{ id: string; title: string; difficulty: string; url?: string }>).slice(0, 100);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "GeeksforGeeks Solutions",
    "itemListElement": problems.slice(0, 30).map((p, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": p.title,
      "url": `https://devexcode.com/gfg/${p.id}`
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
          items={[{ name: 'GeeksforGeeks', path: '/gfg' }]}
          className="mb-6"
        />

        <div className="mb-10 border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-widest mb-4">
            <Code2 className="w-3.5 h-3.5" />
            <span>Problem Archive</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-foreground">
            GeeksforGeeks Solutions Explorer
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
            Curated explanations and optimal implementations for popular GeeksforGeeks coding challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((problem) => {
            const diffColor =
              problem.difficulty === 'Easy'
                ? 'text-emerald-500 bg-emerald-500/10'
                : problem.difficulty === 'Medium'
                ? 'text-amber-500 bg-amber-500/10'
                : 'text-rose-500 bg-rose-500/10';

            return (
              <Link
                key={problem.id}
                href={`/gfg/${problem.id}`}
                className="group glass dark:glass-dark rounded-2xl p-5 border border-border hover:border-primary/40 transition-all hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-muted-foreground">
                      #{problem.id}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${diffColor}`}>
                      {problem.difficulty || 'Medium'}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {problem.title}
                  </h2>
                </div>

                <div className="pt-4 mt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <span>View Solution</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
