import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Layout from "../../../components/Layout";
import { useSession } from "next-auth/react";
import DOMPurify from "isomorphic-dompurify";
import sql50 from "../../../data/sql50.json";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

const COLORS = {
  primary: "#4f46e5",
  secondary: "#ec4899",
  accent: "#3b82f6",
};

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

// Helper to generate URL-friendly slug from title
const generateSlug = (title) => {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "DevExCode - Top SQL 50 Study Plan",
  url: "https://devexcode.com/interview/sql-50",
  description: "Master the Top SQL 50 study plan with 50 essential database problems, organized by topics like Select, Joins, and Subqueries, to ace your technical interviews.",
  keywords: `Top SQL 50, database interview prep, technical interviews, SQL queries, LeetCode, DevExCode, Select, Joins, Subqueries, ${sql50.map((s) => s.name).join(", ")}`,
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
  image: "https://devexcode.com/og-image-sql50.jpg",
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
        name: "Top SQL 50 Study Plan",
        item: "https://devexcode.com/interview/sql-50",
      },
    ],
  },
  mainEntity: {
    "@type": "ItemList",
    name: "Top SQL 50 Problems",
    description: "A curated list of 50 SQL problems to prepare for technical interviews, grouped by topics like Select, Joins, and Subqueries.",
    numberOfItems: sql50.reduce((sum, section) => sum + section.questions.length, 0),
    itemListElement: sql50.flatMap((section, sectionIndex) =>
      section.questions.map((question, qIndex) => ({
        "@type": "ListItem",
        position: sectionIndex * section.questions.length + qIndex + 1,
        name: question.title,
        item: {
          "@type": "CreativeWork",
          name: question.title,
          url: `https://devexcode.com/leetcode/${question.id}-${generateSlug(question.title)}`,
          description: `A ${question.difficulty.toLowerCase()} SQL problem in the ${section.name} category of the Top SQL 50 study plan.`,
          keywords: `${question.title}, ${question.difficulty.toLowerCase()}, ${section.name}, SQL problem, LeetCode, DevExCode`,
        },
      }))
    ),
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://devexcode.com/interview/sql-50",
  },
  mainEntity: [
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the Top SQL 50 Study Plan on DevExCode?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Top SQL 50 Study Plan is a curated collection of 50 essential LeetCode SQL problems, organized by topics like Select, Joins, and Subqueries, designed to help you prepare for database-focused technical interviews.",
          },
        },
        {
          "@type": "Question",
          name: "How can I filter problems in the Top SQL 50 Study Plan?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can filter problems by difficulty (All, Easy, Medium, Hard) using the filter buttons on the page, allowing you to focus on specific challenge levels.",
          },
        },
        {
          "@type": "Question",
          name: "Are solutions available for the Top SQL 50 problems?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, each problem includes a link to a detailed solution, accessible by clicking the 'Solution' button next to the problem title.",
          },
        },
      ],
    },
  ],
};

export default function SQL50Page({ totalQuestions }) {
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(!!session);
  const [userName, setUserName] = useState(session?.user?.name || "");
  const [filter, setFilter] = useState("all");
  const [filteredSections, setFilteredSections] = useState(sql50);

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoggedIn(true);
      setUserName(session.user.name || "User");
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  }, [status, session]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredSections(sql50);
    } else {
      setFilteredSections(
        sql50.filter((section) =>
          section.questions.some((q) => q.difficulty.toLowerCase() === filter)
        )
      );
    }
  }, [filter]);

  const sectionRefs = sql50.map(() =>
    useInView({ triggerOnce: true, threshold: 0.1 })
  );

  if (status === "loading") {
    return (
      <Layout isLoggedIn={false} userName="">
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
            <p className="text-gray-600 dark:text-gray-300 mt-4">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isLoggedIn={isLoggedIn} userName={userName}>
      <Head>
        <title>DevExCode - Top SQL 50 Study Plan ({totalQuestions} Problems)</title>
        <meta
          name="description"
          content={`Master the Top SQL 50 study plan with ${totalQuestions} essential database problems, organized by topics like Select, Joins, and Subqueries, to prepare for technical interviews.`}
        />
        <meta
          name="keywords"
          content={`Top SQL 50, database interview prep, technical interviews, SQL queries, LeetCode, DevExCode, Select, Joins, Subqueries, ${sql50.map((s) => s.name).join(", ")}`}
        />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={`DevExCode - Top SQL 50 Study Plan (${totalQuestions} Problems)`} />
        <meta
          property="og:description"
          content={`Explore ${totalQuestions} curated LeetCode SQL problems to ace your database interviews, organized by topics like Select, Joins, and Subqueries.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devexcode.com/interview/sql-50" />
        <meta property="og:image" content="https://devexcode.com/og-image-sql50.jpg" />
        <meta property="og:image:alt" content="Top SQL 50 Study Plan on DevExCode" />
        <meta property="og:site_name" content="DevExCode" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`DevExCode - Top SQL 50 Study Plan (${totalQuestions} Problems)`} />
        <meta
          name="twitter:description"
          content={`Prepare for database interviews with ${totalQuestions} essential LeetCode SQL problems in the Top SQL 50 study plan, organized by topic.`}
        />
        <meta name="twitter:image" content="https://devexcode.com/twitter-image-sql50.jpg" />
        <meta name="twitter:image:alt" content="Top SQL 50 Study Plan on DevExCode" />
        <meta name="twitter:creator" content="@DevExCode" />
        <link rel="canonical" href="https://devexcode.com/interview/sql-50" />
        <link rel="sitemap" href="/sitemap.xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="theme-color" content="#4f46e5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(JSON.stringify(structuredData)),
          }}
        />
      </Head>

      <section className="py-20 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Top SQL 50 Study Plan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Master {totalQuestions} essential SQL problems curated for interview prep, organized by topics like Select, Joins, and Subqueries.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link href="#problems" prefetch={true}>
              <motion.button
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Explore Top SQL 50 problems"
              >
                Explore Problems
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-white dark:bg-slate-800">
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
                aria-label={`Filter by ${level} difficulty`}
              >
                {level}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section id="problems" className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
          >
            All {totalQuestions} Problems
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
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-400 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400"
                          aria-label={`Mark ${question.title} as completed`}
                        />
                        <Link href={`/leetcode/${question.id}-${generateSlug(question.title)}`} prefetch={true}>
                          <span className="text-gray-900 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                            {question.title}
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
                            question.difficulty === "EASY"
                              ? "text-green-600 dark:text-green-400"
                              : question.difficulty === "MEDIUM"
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

      <section className="py-16 bg-indigo-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Start Solving Now
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Dive into the Top SQL 50 study plan with {totalQuestions} problems and build the skills needed to ace your database interviews.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link href="#problems" prefetch={true}>
              <motion.button
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Start solving Top SQL 50 problems"
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
      totalQuestions: sql50.reduce(
        (sum, section) => sum + section.questions.length,
        0
      ),
    },
  };
}