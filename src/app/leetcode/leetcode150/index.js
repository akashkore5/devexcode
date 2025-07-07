import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Layout from "../../../components/Layout";
import { useSession } from "next-auth/react";
import DOMPurify from "isomorphic-dompurify";
import leetcode150 from "../../../data/leetcode150.json";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { Toaster, toast } from "react-hot-toast";

// Constants
const COLORS = {
  primary: "#4f46e5",
  secondary: "#ec4899",
  accent: "#3b82f6",
};

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const progressVariants = {
  hidden: { width: 0 },
  visible: (progress) => ({
    width: `${progress}%`,
    transition: { duration: 0.8, ease: "easeOut" },
  }),
};

// Helper to generate URL-friendly slug from title
const generateSlug = (title) => {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};

// Structured Data with FAQ and ItemList Schema
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "LeetCode 150 Study Plan - DevExCode",
  url: "https://devexcode.com/interview/leetcode-150",
  description: "Master the LeetCode 150 Study Plan with 150 essential coding problems to ace technical interviews. Organized by topics like Array, Two Pointers, and Dynamic Programming.",
  keywords: `LeetCode 150, coding interview prep, technical interviews, algorithms, data structures, DevExCode, LeetCode, Array, Two Pointers, Dynamic Programming, ${leetcode150.map((s) => s.name).join(", ")}`,
  author: {
    "@type": "Organization",
    name: "DevExCode",
  },
  publisher: {
    "@type": "Organization",
    name: "DevExCode",
    logo: {
      "@type": "ImageObject",
      url: "https://devexcode.com/logo.png",
      width: 150,
      height: 50,
    },
  },
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  image: "https://devexcode.com/og-image-leetcode150.jpg",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://devexcode.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Interview Prep",
        item: "https://devexcode.com/interview",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "LeetCode 150 Study Plan",
        item: "https://devexcode.com/interview/leetcode-150",
      },
    ],
  },
  mainEntity: [
    {
      "@type": "ItemList",
      name: "LeetCode 150 Problems",
      description: "A curated list of 150 coding problems to prepare for technical interviews, covering key algorithms and data structures.",
      numberOfItems: leetcode150.reduce((sum, section) => sum + section.questions.length, 0),
      itemListElement: leetcode150.flatMap((section, sectionIndex) =>
        section.questions.map((question, qIndex) => ({
          "@type": "ListItem",
          position: sectionIndex * section.questions.length + qIndex + 1,
          name: question.title,
          item: {
            "@type": "CreativeWork",
            name: question.title,
            url: `https://devexcode.com/leetcode/${question.id}-${generateSlug(question.title)}`,
            description: `A ${question.difficulty.toLowerCase()} coding problem in the ${section.name} category of the LeetCode 150 Study Plan.`,
            keywords: `${question.title}, ${question.difficulty.toLowerCase()}, ${section.name}, coding problem, LeetCode, DevExCode`,
          },
        }))
      ),
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the LeetCode 150 Study Plan?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The LeetCode 150 Study Plan is a curated list of 150 coding problems designed to cover essential algorithms and data structures for technical interview preparation.",
          },
        },
        {
          "@type": "Question",
          name: "How to track progress in LeetCode 150?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Log in to DevExCode to track your progress across the LeetCode 150 problems. Mark problems as solved to see your completion percentage in real-time.",
          },
        },
        {
          "@type": "Question",
          name: "Are solutions available for LeetCode 150 problems?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, each problem includes a link to a detailed solution, accessible by clicking the 'Solution' button next to the problem title.",
          },
        },
      ],
    },
  ],
};

export default function LeetCode150Page({ totalQuestions }) {
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(!!session);
  const [userName, setUserName] = useState(session?.user?.name || "");
  const [filter, setFilter] = useState("all");
  const [filteredSections, setFilteredSections] = useState(leetcode150);
  const [progress, setProgress] = useState(0);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Update session state
  useEffect(() => {
    if (status === "authenticated") {
      setIsLoggedIn(true);
      setUserName(session.user.name || "User");
    } else {
      setIsLoggedIn(false);
      setUserName("");
      setProgress(0);
      setSolvedProblems([]);
    }
  }, [status, session]);

  // Fetch progress for logged-in users
  useEffect(() => {
    if (!isLoggedIn || status !== "authenticated") {
      
      return;
    }

    const fetchProgress = async () => {
      try {
        
        const response = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "leetcode", action: "all" }),
        });
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        const solved = (data.solved || []).map(Number);
        
        setSolvedProblems(solved);
        const progressPercentage = (solved.length / totalQuestions) * 100;
        setProgress(progressPercentage);
      } catch (error) {
        console.error("[Progress Fetch] Error:", error);
        toast.error("Failed to load progress");
      }
    };

    fetchProgress();
  }, [isLoggedIn, status, totalQuestions]);

  // Handle filter changes
  useEffect(() => {
    if (filter === "all") {
      setFilteredSections(leetcode150);
    } else {
      setFilteredSections(
        leetcode150.filter((section) =>
          section.questions.some((q) => q.difficulty.toLowerCase() === filter)
        )
      );
    }
  }, [filter]);

  // Handle checkbox toggle for progress
  const handleToggleSolved = useCallback(
    async (questionId) => {
      if (!isLoggedIn) {
        
        setIsLoginModalOpen(true);
        toast.error("Log in to track your progress", { duration: 3000 });
        return;
      }

      const isSolved = solvedProblems.includes(questionId);
      
      try {
        const response = await fetch("/api/user/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "leetcode",
            action: "solved",
            id: questionId,
            remove: isSolved,
          }),
        });
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const updatedSolved = isSolved
          ? solvedProblems.filter((id) => id !== questionId)
          : [...solvedProblems, questionId];
        
        setSolvedProblems(updatedSolved);
        const progressPercentage = (updatedSolved.length / totalQuestions) * 100;
        setProgress(progressPercentage);
        toast.success(isSolved ? "Problem unmarked as solved" : "Problem marked as solved");
      } catch (error) {
        console.error("[Toggle Solved] Error:", error);
        toast.error("Failed to update progress");
      }
    },
    [isLoggedIn, solvedProblems, totalQuestions]
  );

  // Lazy load sections
  const sectionRefs = leetcode150.map(() =>
    useInView({ triggerOnce: true, threshold: 0.1 })
  );

  // Loading state
  if (status === "loading") {
    return (
      <Layout isLoggedIn={false} userName="" isLoginModalOpen={isLoginModalOpen} setIsLoginModalOpen={setIsLoginModalOpen}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
          <div className="text-center">
            <svg
              className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-300 mt-4">Loading LeetCode 150...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Stats for Hero Section
  const stats = [
    { label: "Total Problems", value: totalQuestions },
    { label: "Topics Covered", value: leetcode150.length },
    {
      label: "Difficulty Levels",
      value: ["Easy", "Medium", "Hard"].filter((level) =>
        leetcode150.some((section) =>
          section.questions.some((q) => q.difficulty.toLowerCase() === level.toLowerCase())
        )
      ).join(", "),
    },
  ];

  return (
    <Layout
      isLoggedIn={isLoggedIn}
      userName={userName}
      isLoginModalOpen={isLoginModalOpen}
      setIsLoginModalOpen={setIsLoginModalOpen}
    >
      <Head>
        <title>LeetCode 150 Study Plan - DevExCode ({totalQuestions} Problems)</title>
        <meta
          name="description"
          content={`Master the LeetCode 150 Study Plan with ${totalQuestions} curated coding problems to ace technical interviews. Organized by Array, Two Pointers, Dynamic Programming, and more.`}
        />
        <meta
          name="keywords"
          content={`LeetCode 150, coding interview prep, technical interviews, algorithms, data structures, DevExCode, LeetCode, Array, Two Pointers, Dynamic Programming, ${leetcode150.map((s) => s.name).join(", ")}`}
        />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={`LeetCode 150 Study Plan - DevExCode (${totalQuestions} Problems)`} />
        <meta
          property="og:description"
          content={`Prepare for coding interviews with ${totalQuestions} essential problems in the LeetCode 150 Study Plan, organized by topics like Array, Two Pointers, and Dynamic Programming.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devexcode.com/interview/leetcode-150" />
        <meta property="og:image" content="https://devexcode.com/og-image-leetcode150.jpg" />
        <meta property="og:image:alt" content="LeetCode 150 Study Plan on DevExCode" />
        <meta property="og:site_name" content="DevExCode" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`LeetCode 150 Study Plan - DevExCode (${totalQuestions} Problems)`} />
        <meta
          name="twitter:description"
          content={`Master technical interviews with ${totalQuestions} curated coding problems in the LeetCode 150 Study Plan.`}
        />
        <meta name="twitter:image" content="https://devexcode.com/twitter-image-leetcode150.jpg" />
        <meta name="twitter:image:alt" content="LeetCode 150 Study Plan on DevExCode" />
        <meta name="twitter:creator" content="@DevCodeEx" />
        <link rel="canonical" href="https://devexcode.com/interview/leetcode-150" />
        <link rel="sitemap" href="/sitemap.xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#4f46e5" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(JSON.stringify(structuredData)),
          }}
        />
      </Head>
      <Toaster />

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-6xl font-extrabold text-white mb-6"
          >
            LeetCode 150 Study Plan
          </motion.h1>
          <motion.p
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-indigo-100 dark:text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Master {totalQuestions} essential coding problems curated for technical interview preparation, covering Array, Two Pointers, Dynamic Programming, and more.
          </motion.p>
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-4"
          >
            <Link href="#problems" prefetch={true}>
              <motion.button
                className="px-8 py-4 bg-white text-indigo-600 rounded-lg text-lg font-semibold hover:bg-indigo-100 transition shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Explore LeetCode 150 problems"
              >
                Start Solving
              </motion.button>
            </Link>
            {isLoggedIn && (
              <Link href="/profile" prefetch={true}>
                <motion.button
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg text-lg font-semibold hover:bg-white hover:text-indigo-600 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="View your LeetCode 150 progress"
                >
                  View Progress
                </motion.button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={heroVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 * index }}
                className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg shadow-md"
              >
                <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      {isLoggedIn && (
        <section className="py-8 bg-gray-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="text-2xl font-semibold text-gray-900 dark:text-white mb-4"
            >
              Your LeetCode 150 Progress
            </motion.h2>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4">
                <motion.div
                  className="bg-indigo-600 h-4 rounded-full"
                  variants={progressVariants}
                  initial="hidden"
                  animate="visible"
                  custom={progress}
                />
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {solvedProblems.length} / {totalQuestions} Problems Solved ({Math.round(progress)}%)
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Filter Section */}
      <section className="py-8 bg-white dark:bg-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-4">
            {["all", "easy", "medium", "hard"].map((level) => (
              <motion.button
                key={level}
                className={`px-4 py-2 rounded-lg font-semibold capitalize ${
                  filter === level
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                }`}
                onClick={() => setFilter(level)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Filter LeetCode 150 by ${level} difficulty`}
              >
                {level}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section id="problems" className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
          >
            LeetCode 150 Problems
          </motion.h2>
          {filteredSections.map((section, index) => {
            const { ref, inView } = sectionRefs[index];
            const filteredQuestions = section.questions.filter(
              (q) => filter === "all" || q.difficulty.toLowerCase() === filter
            );
            if (filteredQuestions.length === 0) return null;

            return (
              <motion.div
                key={section.slug}
                ref={ref}
                variants={sectionVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="mb-12"
                id={section.slug}
              >
                <motion.h3
                  variants={listItemVariants}
                  className="text-xl font-semibold text-gray-900 dark:text-white mb-4"
                >
                  {section.name} ({filteredQuestions.length} Problems)
                </motion.h3>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700">
                  {filteredQuestions.map((question, qIndex) => (
                    <motion.div
                      key={question.id}
                      variants={listItemVariants}
                      className={`flex items-center justify-between px-6 py-4 ${
                        qIndex % 2 === 0
                          ? "bg-gray-50 dark:bg-slate-800"
                          : "bg-white dark:bg-slate-700"
                      } border-b border-gray-200 dark:border-slate-600 last:border-b-0`}
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={solvedProblems.includes(Number(question.id))}
                          onChange={() => handleToggleSolved(Number(question.id))}
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-400 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 cursor-pointer"
                          aria-label={`Mark LeetCode ${question.id}: ${question.title} as completed`}
                        />
                        <Link href={`/leetcode/${question.id}-${generateSlug(question.title)}`} prefetch={true}>
                          <span className="text-gray-900 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                            LeetCode {question.id}: {question.title}
                          </span>
                        </Link>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Link href={`/leetcode/${question.id}-${generateSlug(question.title)}/solution`} prefetch={true}>
                          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                            <DocumentTextIcon className="w-5 h-5" />
                            <span className="text-sm">Solution</span>
                          </div>
                        </Link>
                        <span
                          className={`text-sm font-semibold ${
                            question.difficulty.toLowerCase() === "easy"
                              ? "text-green-600 dark:text-green-400"
                              : question.difficulty.toLowerCase() === "medium"
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {question.difficulty.charAt(0) +
                            question.difficulty.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Ace Your Technical Interviews
          </motion.h2>
          <motion.p
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Start the LeetCode 150 Study Plan today and build the skills needed to excel in coding interviews.
          </motion.p>
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <Link href="#problems" prefetch={true}>
              <motion.button
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Start solving LeetCode 150 problems"
              >
                Start Solving
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      totalQuestions: leetcode150.reduce(
        (sum, section) => sum + section.questions.length,
        0
      ),
    },
  };
}