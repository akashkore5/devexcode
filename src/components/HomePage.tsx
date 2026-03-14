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
} from "@heroicons/react/24/outline";

const TestimonialsSection = dynamic(() => import("./TestimonialsSection"), { ssr: false });
const StatsSection = dynamic(() => import("./StatsSection"), { ssr: false });

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
      
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              A <span className="gradient-text">Superior</span> Learning Experience
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to master technical interviews, all in one place.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Expert Leetcode Solutions", description: "Step-by-step breakdowns and time-space complexity analysis for over 500+ handpicked problems.", icon: <CodeBracketIcon className="w-8 h-8" />, link: "/leetcode", color: "from-blue-500/20 to-indigo-500/20" },
              { title: "System Design Mastery", description: "Learn to architect scalable systems with interactive diagrams and real-world case studies.", icon: <RocketLaunchIcon className="w-8 h-8" />, link: "/system-design", color: "from-purple-500/20 to-pink-500/20" },
              { title: "Daily TechBit", description: "Keep your knowledge fresh with a bite-sized technical concept every single day.", icon: <LightBulbIcon className="w-8 h-8" />, link: "/daily-term", color: "from-amber-500/20 to-orange-500/20" },
              { title: "QuickLearn MCQs", description: "Validate your knowledge with curated multiple-choice questions on core CS fundamentals.", icon: <BookOpenIcon className="w-8 h-8" />, link: "/mcqs", color: "from-emerald-500/20 to-teal-500/20" },
              { title: "Interview Playbook", description: "Curated resources and mock interview strategies used by engineers at top-tier tech companies.", icon: <PuzzlePieceIcon className="w-8 h-8" />, link: "/interview", color: "from-rose-500/20 to-orange-500/20" },
              { title: "Dev Community", description: "Collaborate with 5,000+ peers, share insights, and grow together in our active forums.", icon: <UsersIcon className="w-8 h-8" />, link: "/community", color: "from-cyan-500/20 to-blue-500/20" },
            ].map((feature, index) => (
              <Link key={`feature-${index}`} href={feature.link}>
                <motion.div 
                  variants={cardVariants} 
                  initial="hidden" 
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="premium-card p-8 rounded-3xl h-full flex flex-col group cursor-pointer"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed flex-grow">{feature.description}</p>
                  
                  <div className="mt-8 flex items-center text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
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
