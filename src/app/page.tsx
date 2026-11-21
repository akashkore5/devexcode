import type { Metadata } from 'next';
import { HomePage } from "../components/HomePage";
import problems from "../data/problems.json";
import systemDesignQuestions from "../data/system_design_questions.json";

import { constructMetadata } from "@/lib/seo";

export const dynamic = 'force-static';

export const metadata: Metadata = constructMetadata({
  title: 'DevExCode - #1 DevEx & Coding Interview Prep Platform',
  description: 'Master LeetCode solutions in Java, Python, and C++, system design architecture blueprints, daily technical terms, and FAANG interview preparation on DevExCode.',
  canonicalPath: '',
  keywords: [
    'devexcode', 'devex code', 'devex', 'dev ex code', 'leetcode solutions',
    'system design interview', 'coding interview prep', 'developer experience platform',
    'algorithms', 'data structures', 'FAANG interview preparation'
  ],
});

export default function Home() {
  // Organization and WebSite are emitted once, globally, from app/layout.tsx.
  // Emitting them again here gave the homepage two of each, with conflicting
  // logo, sameAs and SearchAction values, so Google saw two unrelated entities
  // for one domain.
  return (
    <>
      <HomePage 
        initialLoggedIn={false}
        initialName=""
        totalLeetcodeQuestions={problems.length}
        totalSystemDesignQuestions={systemDesignQuestions.length}
        serverError={false}
      />
    </>
  );
}
