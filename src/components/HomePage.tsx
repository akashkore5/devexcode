'use client';

import Link from "next/link";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import { useSession } from "next-auth/react";
import { HeroSection } from "./HeroSection";
import { NotificationSignupSection } from "./NotificationSignupSection";
import {
  CodeBracketIcon,
  UsersIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon,
  BookOpenIcon,
  LightBulbIcon,
  ChevronRightIcon,
  CommandLineIcon,
  CircleStackIcon,
  ScaleIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  SparklesIcon,
  AcademicCapIcon,
  StarIcon,
  FireIcon
} from "@heroicons/react/24/outline";

const TestimonialsSection = dynamic(() => import("./TestimonialsSection"), { ssr: false });
const StatsSection = dynamic(() => import("./StatsSection"), { ssr: false });

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

type HomePageProps = {
  initialLoggedIn: boolean;
  initialName: string;
  totalLeetcodeQuestions: number;
  totalSystemDesignQuestions: number;
  serverError: boolean;
};

const FEATURED_ROADMAPS = [
  {
    title: "System Design Blueprint",
    category: "Architecture",
    level: "Advanced",
    modules: "180+ Blueprints",
    desc: "Master high-throughput caching, database sharding, microservices, and CAP theorem with production designs.",
    href: "/system-design",
    icon: RocketLaunchIcon,
    color: "from-purple-500/10 via-indigo-500/5 to-transparent",
    border: "border-purple-500/20 hover:border-purple-500/50",
    badgeBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
  },
  {
    title: "Core Java & JVM Internals",
    category: "Backend",
    level: "Intermediate",
    modules: "146+ Modules",
    desc: "JVM memory model, GC tuning, concurrency primitives, ExecutorService, and Spring ecosystem.",
    href: "/learning/java",
    icon: AcademicCapIcon,
    color: "from-rose-500/10 via-pink-500/5 to-transparent",
    border: "border-rose-500/20 hover:border-rose-500/50",
    badgeBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
  },
  {
    title: "React.js & Web Architecture",
    category: "Frontend",
    level: "Intermediate",
    modules: "89+ Modules",
    desc: "Server components, fiber reconciler internals, custom hooks, state machines, and web vitals.",
    href: "/learning/react",
    icon: CodeBracketIcon,
    color: "from-cyan-500/10 via-blue-500/5 to-transparent",
    border: "border-cyan-500/20 hover:border-cyan-500/50",
    badgeBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20"
  },
  {
    title: "Distributed Databases",
    category: "Storage",
    level: "Advanced",
    modules: "95+ Topics",
    desc: "B-Trees vs LSM-Trees, SQL indexing, isolation levels, replication topologies, and WAL logs.",
    href: "/databases",
    icon: CircleStackIcon,
    color: "from-emerald-500/10 via-teal-500/5 to-transparent",
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
  },
  {
    title: "Algorithms & DSA Interview Kit",
    category: "Algorithms",
    level: "Hard",
    modules: "7,000+ Solutions",
    desc: "LeetCode 75 and Top 150 categorized patterns with optimal proofs and interactive code execution.",
    href: "/practice/dsa",
    icon: CodeBracketIcon,
    color: "from-amber-500/10 via-yellow-500/5 to-transparent",
    border: "border-amber-500/20 hover:border-amber-500/50",
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
  },
  {
    title: "Tech Battles & Trade-Offs",
    category: "Decisions",
    level: "Advanced",
    modules: "415 Battles",
    desc: "Real-world trade-off comparisons: Kafka vs RabbitMQ, PostgreSQL vs MongoDB, REST vs gRPC.",
    href: "/tech-battles",
    icon: ScaleIcon,
    color: "from-blue-500/10 via-indigo-500/5 to-transparent",
    border: "border-blue-500/20 hover:border-blue-500/50",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
  }
];

export function HomePage({ initialLoggedIn, initialName, totalLeetcodeQuestions, totalSystemDesignQuestions, serverError }: HomePageProps) {
  const { data: session, status } = useSession();

  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const fetchQuickStart = useCallback(() => {
    return {
      type: "leetcode",
      id: "1",
      title: "Two Sum",
      url: `/leetcode/1-two-sum`,
    };
  }, []);

  return (
    <>
      <HeroSection 
        showViewProfile={status === "authenticated" || initialLoggedIn} 
        quickStart={fetchQuickStart()} 
        fetchQuickStart={fetchQuickStart} 
        className="bg-background" 
      />

      {/* =========================================================================
          SECTION 1: CURATED ENGINEERING LEARNING TRACKS
      ========================================================================== */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div className="space-y-3 max-w-2xl">
              <span className="px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest inline-flex items-center gap-1.5">
                <SparklesIcon className="w-3.5 h-3.5" /> Curated Roadmaps
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Engineering <span className="gradient-text">Learning Paths</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base font-medium leading-relaxed">
                Step-by-step career roadmaps crafted by senior engineers. Skip the noise and follow clear, first-principles curricula.
              </p>
            </div>
            <Link
              href="/learning"
              className="inline-flex items-center text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors self-start md:self-auto"
            >
              View All 10 Tracks
              <ArrowRightIcon className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {FEATURED_ROADMAPS.map((track, idx) => {
              const Icon = track.icon;
              return (
                <Link key={idx} href={track.href} className="group flex">
                  <div className={`w-full rounded-3xl p-7 flex flex-col justify-between border bg-gradient-to-b ${track.color} bg-card/70 dark:bg-card/40 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 ${track.border}`}>
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${track.badgeBg}`}>
                            {track.category}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-card border border-border text-muted-foreground">
                            {track.level}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                        {track.title}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed font-medium mb-6">
                        {track.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs font-bold text-muted-foreground">
                      <span className="text-foreground font-black">{track.modules}</span>
                      <span className="flex items-center text-primary font-black uppercase text-[11px] tracking-wider group-hover:translate-x-1 transition-transform">
                        Start Track
                        <ChevronRightIcon className="w-3.5 h-3.5 ml-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: FEATURED TECH BATTLE & SYSTEM DESIGN FLOW SHOWCASE
      ========================================================================== */}
      <section className="py-20 bg-muted/30 dark:bg-card/20 border-y border-border/60 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Tech Battle Card */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest border border-blue-500/20">
                <ScaleIcon className="w-3.5 h-3.5" />
                <span>Featured Tech Battle</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Kafka vs. RabbitMQ: <span className="gradient-text">Stream vs. Queue</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-medium max-w-xl">
                When should you use Kafka&apos;s append-only distributed commit log versus RabbitMQ&apos;s smart broker routing topology? In-depth throughput, latency, and operational cost breakdown.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-card border border-border">
                  <div className="text-xs font-black uppercase text-primary mb-1">Apache Kafka</div>
                  <div className="text-sm font-bold text-foreground">High-Throughput Streaming</div>
                  <div className="text-[11px] text-muted-foreground mt-1">1M+ msg/sec, re-playable log, event-driven architectures.</div>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border">
                  <div className="text-xs font-black uppercase text-purple-600 dark:text-purple-400 mb-1">RabbitMQ</div>
                  <div className="text-sm font-bold text-foreground">Complex AMQP Routing</div>
                  <div className="text-[11px] text-muted-foreground mt-1">Microsecond latency, priority queues, flexible exchange patterns.</div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/tech-battles/20"
                  className="px-6 py-3 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center gap-1.5"
                >
                  Read Battle Verdict
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/tech-battles"
                  className="px-6 py-3 rounded-xl bg-card border border-border text-foreground font-black text-xs uppercase tracking-wider hover:bg-muted/50 transition-all"
                >
                  Explore All 415 Battles
                </Link>
              </div>
            </div>

            {/* System Flow Sandbox Visual Teaser */}
            <div className="lg:col-span-5">
              <Link href="/system-design/flows" className="group block">
                <div className="p-8 rounded-3xl glass dark:glass-dark border border-amber-500/20 hover:border-amber-500/40 shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <CommandLineIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      Live Telemetry
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-2 group-hover:text-amber-500 transition-colors">
                    Interactive System Flow Sandbox
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed font-medium mb-6">
                    Step through real-time traffic spikes, token bucket rate limiters, database read replicas, and chaos circuit breakers at 60fps.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] leading-relaxed border border-slate-800">
                    <div className="text-slate-500">// Simulating Rate Limiter Spike</div>
                    <div>&gt; Token Bucket capacity: 100 req/s</div>
                    <div>&gt; Inbound: 250 req/s [SURGE]</div>
                    <div className="text-amber-400">&gt; Status: 429 Too Many Requests [BLOCKED]</div>
                  </div>
                  <div className="mt-5 flex items-center text-xs font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                    Launch Interactive Flow
                    <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE 6 CORE LEARNING PILLARS
      ========================================================================== */}
      <section className="py-24 relative overflow-hidden bg-background">
        <div className="absolute top-[30%] left-[-10%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[125px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-3"
          >
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              A <span className="gradient-text">Complete</span> Developer Ecosystem
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
              Everything you need to master technical interviews and system design, all in one cohesive workspace.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "Expert LeetCode Solutions", 
                description: "Step-by-step breakdowns, memory metrics, and time-space complexity trade-offs for over 7,000+ handpicked problem sets.", 
                icon: <CodeBracketIcon className="w-6 h-6" />, 
                link: "/leetcode", 
                color: "from-blue-500/20 to-indigo-500/20 border-indigo-500/10 shadow-indigo-500/5 hover:border-indigo-500/30" 
              },
              { 
                title: "System Design Mastery", 
                description: "Architect elite global-scale systems using structured, professional blueprints, interactive workflows, and physical failure modes.", 
                icon: <RocketLaunchIcon className="w-6 h-6" />, 
                link: "/system-design", 
                color: "from-purple-500/20 to-pink-500/20 border-purple-500/10 shadow-purple-500/5 hover:border-purple-500/30" 
              },
              { 
                title: "System Flow Sandbox", 
                description: "Trace backend & DevOps pipelines in 6 interactive 60fps sandboxes. Run step playbacks, toggle load spikes, and inject chaos failures live.", 
                icon: <CommandLineIcon className="w-6 h-6" />, 
                link: "/system-design/flows", 
                color: "from-amber-500/20 to-orange-500/20 border-amber-500/10 shadow-amber-500/5 hover:border-amber-500/30" 
              },
              { 
                title: "Daily TechBit", 
                description: "Keep your first-principles knowledge fresh with a dynamic, bite-sized technical term and production conceptual deep-dive every single day.", 
                icon: <LightBulbIcon className="w-6 h-6" />, 
                link: "/daily-term", 
                color: "from-yellow-500/20 to-orange-500/20 border-yellow-500/10 shadow-yellow-500/5 hover:border-yellow-500/30" 
              },
              { 
                title: "Interview Playbook", 
                description: "Question banks, revision ready master sheets, and mock interview strategy matrices used by staff engineers at top-tier FAANG companies.", 
                icon: <PuzzlePieceIcon className="w-6 h-6" />, 
                link: "/interview", 
                color: "from-rose-500/20 to-pink-500/20 border-rose-500/10 shadow-rose-500/5 hover:border-rose-500/30" 
              },
              { 
                title: "Dev Community", 
                description: "Collaborate with 15,000+ peer developers, share architectural reviews, and grow together in our active forums.", 
                icon: <UsersIcon className="w-6 h-6" />, 
                link: "/community", 
                color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/10 shadow-cyan-500/5 hover:border-cyan-500/30" 
              },
            ].map((feature, index) => (
              <Link key={`feature-${index}`} href={feature.link}>
                <motion.div 
                  variants={cardVariants} 
                  initial="hidden" 
                  whileInView="visible"
                  whileHover={{ y: -8 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className={`glass dark:glass-dark p-8 rounded-3xl h-full flex flex-col justify-between group cursor-pointer border shadow-md relative overflow-hidden ${feature.color}`}
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-primary flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2.5 transition-colors group-hover:text-primary">{feature.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed font-medium">{feature.description}</p>
                  </div>
                  
                  <div className="mt-8 flex items-center text-primary font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                    Explore Now
                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats & Testimonials */}
      <div ref={statsRef}>{statsInView && <StatsSection />}</div>
      <div ref={testimonialsRef} className="py-24">{testimonialsInView && <TestimonialsSection className="bg-secondary/50 dark:bg-secondary/20 rounded-[3rem]" />}</div>
      
      <NotificationSignupSection session={session} />
    </>
  );
}
