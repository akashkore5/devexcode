'use client';

import Link from "next/link";
import Head from "next/head";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import { toast } from "react-hot-toast";
import {
  CodeBracketIcon,
  UsersIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon,
  BookOpenIcon,
  AcademicCapIcon,
  StarIcon,
  BellIcon,
} from "@heroicons/react/24/solid";
import DOMPurify from "isomorphic-dompurify";
import { useSession, signIn } from "next-auth/react";
import { HeroSection } from "./HeroSection";
import { NotificationSignupSection } from "./NotificationSignupSection";

const TestimonialsSection = dynamic(() => import("./TestimonialsSection"), { ssr: false });
const TechBattlesSection = dynamic(() => import("./TechBattlesSection"), { ssr: false });
const DevTipsSection = dynamic(() => import("./DevTipsSection"), { ssr: false });

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

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DevExCode",
  url: "https://devexcode.com/",
  description: "Master coding interviews with expert Leetcode solutions, system design guides, daily technical terms, and interview preparation resources.",
};

export function HomePage({ initialLoggedIn, initialName, totalLeetcodeQuestions, totalSystemDesignQuestions, serverError }: HomePageProps) {
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn);
  const [userName, setUserName] = useState(initialName);
  const [authError, setAuthError] = useState(serverError ? "Failed to connect to authentication service. Retrying..." : null);
  const [retryCount, setRetryCount] = useState(serverError ? 1 : 0);

  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: techBattlesRef, inView: techBattlesInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: devTipsRef, inView: devTipsInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoggedIn(true);
      setUserName(session.user?.name || "User");
      setAuthError(null);
      setRetryCount(0);
    } else if (status === "unauthenticated") {
      setIsLoggedIn(false);
      setUserName("");
    }
  }, [status, session]);

  useEffect(() => {
    if (authError && retryCount < 3 && status !== "authenticated") {
      const timer = setTimeout(() => {
        setRetryCount(retryCount + 1);
        signIn(undefined, { redirect: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [authError, retryCount, status]);

  const fetchQuickStart = useCallback(() => {
    return {
      type: "leetcode",
      id: "1",
      title: "Two Sum",
      url: `/leetcode/1-two-sum`,
    };
  }, []);

  if (status === "loading" || (authError && retryCount < 3)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-primary dark:text-indigo-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-300 mt-4">{authError || "Loading..."}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>DevExCode - Leetcode, System Design & Daily Terms</title>
        <meta name="description" content="Ace coding interviews with DevExCode’s expert Leetcode solutions, system design tutorials, daily technical terms, and comprehensive interview prep resources." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(JSON.stringify(structuredData)) }}/>
      </Head>

      <HeroSection showViewProfile={status === "authenticated"} quickStart={fetchQuickStart()} fetchQuickStart={fetchQuickStart} className="bg-indigo-50 dark:bg-slate-900 text-indigo-900 dark:text-indigo-300" />
      
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl sm:text-4xl font-bold text-center text-primary dark:text-indigo-400 mb-12">
            Tools for Coders to Thrive
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Expert Leetcode Solutions", description: "Master algorithms with detailed C++ and Python solutions, including time and space complexity analysis.", icon: <CodeBracketIcon className="w-12 h-12 text-primary dark:text-indigo-400 mb-4" />, link: "/leetcode", },
              { title: "System Design Mastery", description: "Learn to design scalable systems like Netflix or Twitter with step-by-step guides.", icon: <RocketLaunchIcon className="w-12 h-12 text-primary dark:text-indigo-400 mb-4" />, link: "/system-design", },
              { title: "Daily Technical Terms", description: "Learn a new technical term each day with concise explanations and notifications.", icon: <BellIcon className="w-12 h-12 text-primary dark:text-indigo-400 mb-4" />, link: "/daily-term", },
              { title: "10-Minute Learn", description: "Quickly grasp key concepts like Kafka and Docker with concise, focused lessons.", icon: <BookOpenIcon className="w-12 h-12 text-primary dark:text-indigo-400 mb-4" />, link: "/learn10", },
              { title: "Interview Preparation", description: "Ace technical interviews with curated problem sets and mock interview resources.", icon: <PuzzlePieceIcon className="w-12 h-12 text-primary dark:text-indigo-400 mb-4" />, link: "/interview", },
              { title: "Community Discussions", description: "Join forums to collaborate, share solutions, and learn from other developers.", icon: <UsersIcon className="w-12 h-12 text-primary dark:text-indigo-400 mb-4" />, link: "/community", },
            ].map((feature, index) => (
              <Link key={`feature-${index}`} href={feature.link}>
                <motion.div variants={cardVariants} initial="hidden" animate="visible" className="p-6 bg-gray-50 dark:bg-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-indigo-200 dark:border-indigo-600" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div ref={techBattlesRef}>{techBattlesInView && <TechBattlesSection className="bg-teal-50 dark:bg-teal-950 text-teal-900 dark:text-teal-300" />}</div>
      <div ref={devTipsRef}>{devTipsInView && <DevTipsSection className="bg-gray-100 dark:bg-slate-700 text-indigo-800 dark:text-indigo-300" />}</div>
      <div ref={testimonialsRef}>{testimonialsInView && <TestimonialsSection className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200" />}</div>
      
      <NotificationSignupSection session={session} className="bg-indigo-50 dark:bg-slate-900 text-indigo-900 dark:text-indigo-300" />
    </>
  );
}
