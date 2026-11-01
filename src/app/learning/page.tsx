import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { constructMetadata, constructCourseSchema } from '@/lib/seo';
import {
  RocketLaunchIcon,
  CommandLineIcon,
  CircleStackIcon,
  CodeBracketIcon,
  ScaleIcon,
  BookOpenIcon,
  LightBulbIcon,
  PuzzlePieceIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  SparklesIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = constructMetadata({
  title: 'Engineering Learning Center & Software Architect Tracks | DevExCode',
  description: 'Master system design, core Java, modern React, distributed databases, LeetCode algorithms, and architectural trade-offs with curated engineering roadmaps on DevExCode.',
  canonicalPath: '/learning',
  keywords: [
    'engineering learning center',
    'software engineer roadmap',
    'system design course',
    'java architect track',
    'react architecture learning',
    'distributed systems course',
    'leetcode learning paths',
    'devexcode learning'
  ],
});

interface LearningTrack {
  id: string;
  title: string;
  badge: string;
  category: 'Architecture' | 'Backend' | 'Frontend' | 'Algorithms' | 'Concepts';
  description: string;
  modulesCount: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  href: string;
  highlights: string[];
  gradient: string;
  accentBorder: string;
  iconBg: string;
  icon: any;
}

const LEARNING_TRACKS: LearningTrack[] = [
  {
    id: 'system-design',
    title: 'System Design & Distributed Architectures',
    badge: 'Flagship Track',
    category: 'Architecture',
    description: 'Design global-scale web systems. Master distributed caching, database sharding, microservices, CAP theorem, and event-driven patterns with battle-tested blueprints.',
    modulesCount: '180+ Blueprints',
    duration: '40 Hours',
    level: 'Advanced',
    href: '/system-design',
    highlights: ['Distributed Caching & Redis', 'Database Sharding & Partitioning', 'Message Queues & Kafka', 'Rate Limiting & API Gateways'],
    gradient: 'from-purple-500/10 via-indigo-500/5 to-transparent',
    accentBorder: 'border-purple-500/20 hover:border-purple-500/50',
    iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    icon: RocketLaunchIcon,
  },
  {
    id: 'system-flows',
    title: 'System Flow Telemetry Sandbox',
    badge: 'Interactive Sandbox',
    category: 'Architecture',
    description: 'Trace backend and DevOps pipelines in 6 interactive 60fps sandboxes. Execute step playbacks, toggle load spikes, and inject chaos failures live.',
    modulesCount: '7 Interactive Flows',
    duration: 'Live Simulator',
    level: 'Advanced',
    href: '/system-design/flows',
    highlights: ['Rate Limiting Algorithms', 'OAuth2 / JWT Token Lifecycle', 'CQRS & Event Sourcing', 'Database Read Replicas'],
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    accentBorder: 'border-amber-500/20 hover:border-amber-500/50',
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    icon: CommandLineIcon,
  },
  {
    id: 'java-architecture',
    title: 'Core Java & JVM Internals',
    badge: 'Enterprise Backend',
    category: 'Backend',
    description: 'From language fundamentals to senior backend architect. Master concurrency, memory model, JVM garbage collectors, collections internals, and Spring ecosystem.',
    modulesCount: '146+ Modules',
    duration: '35 Hours',
    level: 'Intermediate',
    href: '/learning/java',
    highlights: ['Java Memory Model & GC', 'Multithreading & ExecutorService', 'Collections Deep Dive', 'Spring Boot & Microservices'],
    gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    accentBorder: 'border-rose-500/20 hover:border-rose-500/50',
    iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    icon: AcademicCapIcon,
  },
  {
    id: 'react-frontend',
    title: 'React.js & Modern Web Architecture',
    badge: 'Full-Stack UI',
    category: 'Frontend',
    description: 'Deep dive into modern React architecture. Master fiber reconciler, server components, hooks lifecycle, state management, and web vitals optimization.',
    modulesCount: '89+ Modules',
    duration: '25 Hours',
    level: 'Intermediate',
    href: '/learning/react',
    highlights: ['React 19 & Server Components', 'Fiber Engine & Virtual DOM', 'State Management Patterns', 'Core Web Vitals & Hydration'],
    gradient: 'from-cyan-500/10 via-blue-500/5 to-transparent',
    accentBorder: 'border-cyan-500/20 hover:border-cyan-500/50',
    iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    icon: CodeBracketIcon,
  },
  {
    id: 'databases',
    title: 'Distributed Databases & Storage Engines',
    badge: 'Storage & DB',
    category: 'Backend',
    description: 'Understand how databases store, retrieve, and replicate data. Compare relational ACID engines with NoSQL distributed document and key-value stores.',
    modulesCount: '95+ Topics',
    duration: '20 Hours',
    level: 'Advanced',
    href: '/databases',
    highlights: ['B-Trees & LSM-Trees', 'SQL Query Optimization', 'Transaction Isolation Levels', 'Write-Ahead Logging (WAL)'],
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    accentBorder: 'border-emerald-500/20 hover:border-emerald-500/50',
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    icon: CircleStackIcon,
  },
  {
    id: 'tech-battles',
    title: 'Tech Battles: Architectural Trade-Offs',
    badge: 'Decision Matrix',
    category: 'Architecture',
    description: 'Head-to-head architectural showdowns. Benchmark latency, throughput, complexity, and real-world failure modes to make sound technical decisions.',
    modulesCount: '415 Battles',
    duration: 'Continuous',
    level: 'Advanced',
    href: '/tech-battles',
    highlights: ['Kafka vs RabbitMQ', 'PostgreSQL vs MongoDB', 'REST vs gRPC vs GraphQL', 'Redis vs Memcached'],
    gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    accentBorder: 'border-blue-500/20 hover:border-blue-500/50',
    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    icon: ScaleIcon,
  },
  {
    id: 'algorithms-dsa',
    title: 'Data Structures & Algorithms Mastery',
    badge: 'FAANG Interview Kit',
    category: 'Algorithms',
    description: 'Over 7,000+ solved problems across LeetCode & GeeksforGeeks with optimal time/space complexity proofs and interactive code runners in Java, Python, and C++.',
    modulesCount: '7,000+ Solutions',
    duration: '60 Hours',
    level: 'Intermediate',
    href: '/practice/dsa',
    highlights: ['Two Pointers & Sliding Window', 'Dynamic Programming Patterns', 'Graph Traversals (BFS/DFS)', 'Tries & Segment Trees'],
    gradient: 'from-amber-500/10 via-yellow-500/5 to-transparent',
    accentBorder: 'border-amber-500/20 hover:border-amber-500/50',
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    icon: CodeBracketIcon,
  },
  {
    id: 'quicklearn-10min',
    title: '10-Minute Rapid Deep-Dives',
    badge: 'QuickLearn',
    category: 'Concepts',
    description: 'Bite-sized system design and engineering concepts explained in 10 minutes or less. Perfect for daily commute and pre-interview refresher sessions.',
    modulesCount: '300 Topics',
    duration: '10 Min / Topic',
    level: 'Beginner',
    href: '/learn10',
    highlights: ['HLD of Uber in 10 Mins', 'LLD of Amazon Cart', 'CAP Theorem Simplified', 'Virtual DOM in 10 Mins'],
    gradient: 'from-indigo-500/10 via-purple-500/5 to-transparent',
    accentBorder: 'border-indigo-500/20 hover:border-indigo-500/50',
    iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    icon: BookOpenIcon,
  },
  {
    id: 'daily-techbits',
    title: 'Daily TechBits & System Terminology',
    badge: 'Daily Habit',
    category: 'Concepts',
    description: 'Expand your engineering vocabulary. Learn one high-impact technical term every day with deep-dive definitions, architecture diagrams, and production context.',
    modulesCount: '260+ Terms',
    duration: 'Daily',
    level: 'Beginner',
    href: '/daily-term',
    highlights: ['Consistent Hashing', 'Split-Brain Scenario', 'Idempotency Keys', 'Backpressure Control'],
    gradient: 'from-sky-500/10 via-blue-500/5 to-transparent',
    accentBorder: 'border-sky-500/20 hover:border-sky-500/50',
    iconBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    icon: PuzzlePieceIcon,
  },
  {
    id: 'micro-dev-tips',
    title: 'Micro DevTips: Clean Code & Best Practices',
    badge: 'Craftsmanship',
    category: 'Concepts',
    description: 'Actionable tips from staff engineers. Clean code heuristics, debugging shortcuts, performance optimizations, and design patterns in Java, React, and Python.',
    modulesCount: '493+ Tips',
    duration: 'Bite-sized',
    level: 'Beginner',
    href: '/micro-dev-tips',
    highlights: ['Composition Over Inheritance', 'Async Error Handling', 'Memory Leak Prevention', 'Clean Architecture Rules'],
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    accentBorder: 'border-emerald-500/20 hover:border-emerald-500/50',
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    icon: LightBulbIcon,
  },
];

export default function LearningCenterPage() {
  const courseSchemas = LEARNING_TRACKS.map((track) =>
    constructCourseSchema({
      name: track.title,
      description: track.description,
      url: track.href,
      teaches: track.highlights,
      educationalLevel: track.level,
    })
  );

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'DevExCode Engineering Learning Roadmaps & Tracks',
    description: 'Comprehensive software engineering learning tracks covering system design, Java, React, databases, algorithms, and architectural trade-offs.',
    itemListElement: LEARNING_TRACKS.map((track, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: track.title,
      url: `https://devexcode.com${track.href}`,
    })),
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 relative overflow-hidden">
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {courseSchemas.map((schema, i) => (
        <script
          key={`course-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Atmospheric Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-secondary/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Breadcrumb
          items={[
            { name: 'Home', path: '/' },
            { name: 'Learning Center', path: '/learning' },
          ]}
        />

        {/* Hero Header */}
        <div className="text-center max-w-4xl mx-auto my-14 space-y-5">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Curated Engineering Roadmaps</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05]">
            Engineering <span className="gradient-text">Learning Center</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
            Structured, first-principles curricula designed by senior engineers. Master system architectures, backend ecosystems, modern frontend, and coding interviews.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-6 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs font-bold uppercase tracking-wider text-muted-foreground border-y border-border/60 py-4 max-w-3xl mx-auto">
            <div>
              <span className="text-foreground text-base sm:text-lg font-black block">10</span> Tracks
            </div>
            <div className="h-4 w-px bg-border" />
            <div>
              <span className="text-foreground text-base sm:text-lg font-black block">8,500+</span> Solutions
            </div>
            <div className="h-4 w-px bg-border" />
            <div>
              <span className="text-foreground text-base sm:text-lg font-black block">180+</span> Blueprints
            </div>
            <div className="h-4 w-px bg-border" />
            <div>
              <span className="text-foreground text-base sm:text-lg font-black block">415</span> Battles
            </div>
            <div className="h-4 w-px bg-border" />
            <div>
              <span className="text-primary text-base sm:text-lg font-black block">100% Free</span>
            </div>
          </div>
        </div>

        {/* Learning Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {LEARNING_TRACKS.map((track) => {
            const Icon = track.icon;
            return (
              <Link key={track.id} href={track.href} className="group flex">
                <div
                  className={`w-full rounded-3xl p-7 flex flex-col justify-between border bg-gradient-to-b ${track.gradient} bg-card/60 dark:bg-card/30 backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${track.accentBorder}`}
                >
                  <div>
                    {/* Card Top: Icon & Pills */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${track.iconBg} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {track.badge}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                          {track.level}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2.5 transition-colors group-hover:text-primary leading-snug">
                      {track.title}
                    </h2>
                    <p className="text-muted-foreground text-xs leading-relaxed font-medium mb-5">
                      {track.description}
                    </p>

                    {/* Key Highlights */}
                    <div className="space-y-1.5 mb-6 pt-3 border-t border-border/50">
                      {track.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-center text-[11px] text-foreground/80 font-medium">
                          <CheckBadgeIcon className="w-4 h-4 text-primary mr-1.5 flex-shrink-0" />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs font-bold text-muted-foreground">
                    <span className="text-foreground/90 font-black">{track.modulesCount}</span>
                    <span className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
                      Start Learning
                      <ArrowRightIcon className="w-3.5 h-3.5 ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-primary to-secondary text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-black uppercase tracking-widest inline-block">
              Daily Practice Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to test your knowledge against real FAANG interviews?
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-medium">
              Jump into the interactive code sandbox, solve daily coding problems, or explore live distributed system flows.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/practice/dsa"
                className="px-6 py-3 rounded-xl bg-white text-primary font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                Launch Code Sandbox
              </Link>
              <Link
                href="/system-design/flows"
                className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black text-xs uppercase tracking-wider backdrop-blur-md transition-all"
              >
                Explore System Flows
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
