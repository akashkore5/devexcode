import LearningPathsClient from "./LearningPathsClient";
import { constructMetadata, constructCourseSchema } from "@/lib/seo";

export const metadata = constructMetadata({
  title: 'Engineering Learning Paths & Career Roadmaps | DevExCode',
  description: 'Structured developer learning paths for System Design, Core Java, Modern React, Distributed Databases, Algorithms, and Tech Battles on DevExCode.',
  canonicalPath: '/learning-paths',
  keywords: [
    'engineering learning paths',
    'developer career roadmaps',
    'system design roadmap',
    'java developer learning path',
    'react developer roadmap',
    'data structures roadmap',
    'devexcode learning paths'
  ],
});

const paths = [
  { title: "System Design Blueprint", slug: "system-design", desc: "Design global-scale architectures, microservices, and distributed caching systems.", topics: 180, difficulty: "Advanced", category: "Architecture" },
  { title: "Java & JVM Architecture", slug: "learning/java", desc: "Master core Java, concurrency, memory models, collections, and Spring Boot.", topics: 146, difficulty: "Intermediate", category: "Backend" },
  { title: "React.js & Next.js", slug: "learning/react", desc: "Modern frontend with Server Components, Fiber engine, state machines, and Web Vitals.", topics: 89, difficulty: "Intermediate", category: "Frontend" },
  { title: "Distributed Databases", slug: "databases", desc: "Relational ACID engines, NoSQL stores, B-Trees, and Query Optimization.", topics: 95, difficulty: "Advanced", category: "Storage" },
  { title: "Algorithms & DSA Interview Kit", slug: "practice/dsa", desc: "7,000+ solved LeetCode and GFG challenges with optimal complexity proofs.", topics: "7,000+", difficulty: "Hard", category: "Algorithms" },
  { title: "Tech Battles & Trade-offs", slug: "tech-battles", desc: "415 head-to-head architectural showdowns (Kafka vs RabbitMQ, SQL vs NoSQL).", topics: 415, difficulty: "Advanced", category: "Architecture" },
  { title: "System Flows Sandbox", slug: "system-design/flows", desc: "Trace backend & DevOps pipelines in 6 interactive 60fps sandboxes with chaos injection.", topics: 7, difficulty: "Advanced", category: "Interactive" },
  { title: "10-Minute Rapid Deep-Dives", slug: "learn10", desc: "Bite-sized system design and engineering concepts explained in 10 minutes or less.", topics: 300, difficulty: "Beginner", category: "QuickLearn" },
  { title: "Daily TechBits & Terminology", slug: "daily-term", desc: "First-principles engineering vocabulary and production conceptual deep-dives daily.", topics: 260, difficulty: "Beginner", category: "Concepts" },
];

export default async function LearningPathsPage() {
  const courseSchemas = paths.map((path) =>
    constructCourseSchema({
      name: path.title,
      description: path.desc,
      url: `/${path.slug}`,
      educationalLevel: path.difficulty as any,
    })
  );

  return (
    <>
      {courseSchemas.map((schema, i) => (
        <script
          key={`course-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <LearningPathsClient paths={paths} />
    </>
  );
}
