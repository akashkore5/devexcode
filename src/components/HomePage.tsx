'use client';

import Link from "next/link";
import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
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
  CommandLineIcon
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
}

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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>DevExCode - Leetcode, System Design & Daily Terms</title>
        <meta name="description" content="Ace coding interviews with DevExCode’s expert Leetcode solutions, system design tutorials, daily technical terms, and comprehensive interview prep resources." />
      </Head>

      <HeroSection showViewProfile={status === "authenticated"} quickStart={fetchQuickStart()} fetchQuickStart={fetchQuickStart} className="bg-background" />
      
      <section className="py-24 relative overflow-hidden bg-background">
        
        {/* Dynamic mesh backgrounds inside feature grid */}
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
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              A <span className="gradient-text">Superior</span> Learning Experience
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
              Everything you need to master technical interviews and system design, all in one cohesive workspace.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "Expert Leetcode Solutions", 
                description: "Step-by-step breakdowns, memory metrics, and time-space complexity trade-offs for over 7,500+ handpicked problem sets.", 
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

      <div ref={statsRef}>{statsInView && <StatsSection />}</div>
      <div ref={testimonialsRef} className="py-24">{testimonialsInView && <TestimonialsSection className="bg-secondary/50 dark:bg-secondary/20 rounded-[3rem]" />}</div>
      
      <NotificationSignupSection session={session} />
    </>
  );
}
