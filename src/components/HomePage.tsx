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
      
      <section className="py-16 bg-secondary/50 dark:bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-12">
            A Better Way to Prepare
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Expert Leetcode Solutions", description: "Master algorithms with detailed solutions and complexity analysis.", icon: <CodeBracketIcon className="w-10 h-10 text-primary mb-4" />, link: "/leetcode", },
              { title: "System Design Mastery", description: "Learn to design scalable systems like the pros with step-by-step guides.", icon: <RocketLaunchIcon className="w-10 h-10 text-primary mb-4" />, link: "/system-design", },
              { title: "Daily TechBit", description: "Learn a new technical term each day with concise explanations.", icon: <LightBulbIcon className="w-10 h-10 text-primary mb-4" />, link: "/daily-term", },
              { title: "QuickLearn MCQs", description: "Quickly grasp key concepts with multiple choice questions.", icon: <BookOpenIcon className="w-10 h-10 text-primary mb-4" />, link: "/mcqs", },
              { title: "Interview Preparation", description: "Ace technical interviews with curated problem sets and resources.", icon: <PuzzlePieceIcon className="w-10 h-10 text-primary mb-4" />, link: "/interview", },
              { title: "Community Discussions", description: "Join forums to collaborate, share solutions, and learn from others.", icon: <UsersIcon className="w-10 h-10 text-primary mb-4" />, link: "/community", },
            ].map((feature, index) => (
              <Link key={`feature-${index}`} href={feature.link}>
                <motion.div variants={cardVariants} initial="hidden" animate="visible" className="p-6 bg-card rounded-xl shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 border" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div ref={statsRef}>{statsInView && <StatsSection />}</div>
      <div ref={testimonialsRef}>{testimonialsInView && <TestimonialsSection className="bg-secondary/50 dark:bg-secondary/20" />}</div>
      
      <NotificationSignupSection session={session} />
    </>
  );
}
