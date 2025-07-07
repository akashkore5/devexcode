import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Layout from "../../../components/Layout";
import { Toaster } from "react-hot-toast";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import DOMPurify from "isomorphic-dompurify";
import { useSession } from "next-auth/react";
import mcqTopics from "../../../data/mcq_topics.json";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "DevExCode MCQ Challenges",
  url: "https://devexcode.com/interview/mcq",
  description: "Test your technical knowledge with our curated MCQ challenges covering various programming and system design topics to prepare for coding interviews.",
  publisher: {
    "@type": "Organization",
    name: "DevExCode Team",
  },
  mainEntity: {
    "@type": "CollectionPage",
    name: "MCQ Challenges",
    description: "A collection of multiple-choice question challenges to enhance your technical interview preparation.",
    hasPart: mcqTopics.map((topic) => ({
      "@type": "CreativeWork",
      name: topic.title,
      url: `https://devexcode.com/mcq/${topic.slug}`,
      description: topic.description,
    })),
  },
};

export default function MCQPage() {
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(!!session);
  const [userName, setUserName] = useState(session?.user?.name || "");

  // Lazy load section
  const { ref: mcqChallengesRef, inView: mcqChallengesInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Update session state
  useEffect(() => {
    if (status === "authenticated") {
      setIsLoggedIn(true);
      setUserName(session.user.name || "User");
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  }, [status, session]);

  // Handle loading state
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
        <title>DevExCode - MCQ Challenges</title>
        <meta
          name="description"
          content="Test your technical knowledge with our curated MCQ challenges covering various programming and system design topics to prepare for coding interviews."
        />
        <meta
          name="keywords"
          content="MCQ challenges, coding interviews, technical interviews, programming quizzes, Java MCQs, database MCQs, system design MCQs"
        />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="DevExCode - MCQ Challenges" />
        <meta
          property="og:description"
          content="Prepare for technical interviews with our curated multiple-choice question challenges covering programming and system design topics."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devexcode.com/interview/mcq" />
        <meta property="og:image" content="https://devexcode.com/og-image-mcq.jpg" />
        <meta property="og:image:alt" content="DevExCode MCQ challenges" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DevExCode - MCQ Challenges" />
        <meta
          property="twitter:description"
          content="Enhance your interview prep with our MCQ challenges on programming and system design topics."
        />
        <meta name="twitter:image" content="https://devexcode.com/twitter-image-mcq.jpg" />
        <link rel="canonical" href="https://devexcode.com/interview/mcq" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="theme-color" content="#4f46e5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(JSON.stringify(structuredData)),
          }}
        />
      </Head>

      <Toaster position="top-right" toastOptions={{ duration: 4000, className: "mt-4" }} />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            MCQ Challenges for Interview Prep
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Test and strengthen your technical knowledge with our curated multiple-choice question challenges, covering programming, system design, and more.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link href="#mcq-challenges" prefetch={true}>
              <motion.button
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Start MCQ challenges"
              >
                Start Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* MCQ Challenges Section */}
      <section id="mcq-challenges" ref={mcqChallengesRef} className="py-16 bg-gray-50 dark:bg-slate-900">
        {mcqChallengesInView && (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <motion.h2
              variants={cardVariants}
              className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
            >
              All MCQ Challenges
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {mcqTopics.map((challenge, index) => (
                <Link key={`mcq-${index}`} href={`/mcq/${challenge.slug}`} prefetch={true}>
                  <motion.div
                    variants={cardVariants}
                    className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-indigo-200 dark:border-indigo-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <QuestionMarkCircleIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{challenge.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{challenge.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                        {challenge.noOfQuestions} Questions
                      </p>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                        {challenge.timeInMinutes} min
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Difficulty: {challenge.difficulty}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Ready to Test Your Knowledge?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Dive into our MCQ challenges to prepare for technical interviews and boost your confidence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link href="#mcq-challenges" prefetch={true}>
              <motion.button
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Start MCQ challenges now"
              >
                Start Practicing
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}