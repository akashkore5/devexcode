import Link from "next/link";
import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import Layout from "../../components/Layout";
import { toast, Toaster } from "react-hot-toast";
import {
  CodeBracketIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon,
  DocumentTextIcon,
  StarIcon,
  ClipboardDocumentListIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";
import DOMPurify from "isomorphic-dompurify";
import { useSession } from "next-auth/react";
import problems from "../../data/problems.json";
import systemDesignQuestions from "../../data/system_design_questions.json";
import mcqTopics from "../../data/mcq_topics.json";
import javaTopics from "../../data/java_topics.json";
import databaseTopics from "../../data/database_topics.json";
import reactTopics from "../../data/react_topics.json";

const DevTipsSection = dynamic(() => import("../../components/DevTipsSection"), { ssr: false });

const COLORS = {
  primary: "#4f46e5",
  secondary: "#ec4899",
  accent: "#3b82f6",
};

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
  name: "DevExCode Interview Preparation",
  url: "https://devexcode.com/interview",
  description: "Ace technical interviews with curated Leetcode problem sets, system design questions, mock interviews, coding tests, MCQ challenges, Java and Database learning paths, and expert tips.",
  publisher: {
    "@type": "Organization",
    name: "DevExCode Team",
  },
  mainEntity: [
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How to prepare for coding interviews?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "DevExCode offers curated problem sets like Leetcode 75 and Leetcode 150, along with coding tests, MCQ challenges, mock interview resources, and Java/Database learning paths to build your skills.",
          },
        },
        {
          "@type": "Question",
          name: "What are the best system design questions for interviews?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Explore our top system design questions covering scalable systems like URL shorteners and messaging apps, with detailed guides.",
          },
        },
        {
          "@type": "Question",
          name: "How to practice for technical interviews?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use DevExCode’s mock interviews, timed coding tests, MCQ challenges, Java and Database learning paths, and interview tip sheets to simulate real interview conditions and improve performance.",
          },
        },
      ],
    },
    {
      "@type": "CreativeWork",
      name: "Interview Preparation Content",
      description: "Comprehensive resources for technical interview prep, including Leetcode problem sets, system design tutorials, mock interviews, coding tests, MCQ challenges, and Java/Database learning paths.",
      provider: {
        "@type": "Organization",
        name: "DevExCode",
        sameAs: "https://devexcode.com/",
      },
    },
    {
      "@type": "CollectionPage",
      name: "Learning Paths",
      description: "Curated learning paths for Java programming, database management, and more, covering beginner to advanced topics.",
      hasPart: [
        {
          "@type": "CreativeWork",
          name: "Java Learning Path",
          url: "https://devexcode.com/java",
          description: "Master Java programming with topics from basics to advanced concurrency and design patterns.",
        },
        {
          "@type": "CreativeWork",
          name: "Database Learning Path",
          url: "https://devexcode.com/databases",
          description: "Learn database management, covering relational, NoSQL, graph, time-series databases, and pagination techniques.",
        },
      ],
    },
  ],
};

export default function InterviewPage({
  totalLeetcodeQuestions,
  totalSystemDesignQuestions,
  totalMCQTopics,
  totalJavaTopics,
  totalDatabaseTopics,
  totalReactTopics,
}) {
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(!!session);
  const [userName, setUserName] = useState(session?.user?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  // Lazy load sections
  const { ref: problemSetsRef, inView: problemSetsInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: systemDesignRef, inView: systemDesignInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: mockInterviewsRef, inView: mockInterviewsInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: codingTestsRef, inView: codingTestsInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: mcqChallengesRef, inView: mcqChallengesInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: learningPathsRef, inView: learningPathsInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: tipsRef, inView: tipsInView } = useInView({ triggerOnce: true, threshold: 0.1 });

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
        <title>DevExCode - Interview Preparation</title>
        <meta
          name="description"
          content="Prepare for technical interviews with curated Leetcode problem sets, system design questions, mock interviews, coding tests, MCQ challenges, Java and Database learning paths, and expert tips."
        />
        <meta
          name="keywords"
          content="technical interviews, Leetcode 75, Leetcode 150, system design interviews, mock interviews, coding tests, MCQ challenges, Java learning path, database learning path, interview tips, coding interview prep"
        />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="DevExCode - Interview Preparation" />
        <meta
          property="og:description"
          content="Ace coding interviews with curated Leetcode sets, system design tutorials, mock interviews, coding tests, MCQ challenges, and Java/Database learning paths."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devexcode.com/interview" />
        <meta property="og:image" content="https://devexcode.com/og-image-interview.jpg" />
        <meta property="og:image:alt" content="DevExCode interview preparation resources" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DevExCode - Interview Preparation" />
        <meta
          property="twitter:description"
          content="Level up your interview skills with Leetcode problem sets, system design guides, mock interviews, MCQ challenges, and Java/Database learning paths."
        />
        <meta name="twitter:image" content="https://devexcode.com/twitter-image-interview.jpg" />
        <link rel="canonical" href="https://devexcode.com/interview" />
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
            Ace Your Technical Interviews
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Prepare with curated Leetcode problem sets, top system design questions, mock interviews, coding tests, MCQ challenges, Java and Database learning paths, and expert tips tailored for success.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link href="#problem-sets" prefetch={true}>
              <motion.button
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Start interview preparation"
              >
                Get Started
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Curated Problem Sets Section */}
      <section id="problem-sets" ref={problemSetsRef} className="py-16 bg-white dark:bg-slate-800">
        {problemSetsInView && (
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
              Curated Leetcode Problem Sets
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Leetcode 75",
                  description: "Essential problems to build a strong foundation for coding interviews.",
                  icon: <CodeBracketIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/leetcode/leetcode75",
                  count: 75,
                },
                {
                  title: "Leetcode 150",
                  description: "Comprehensive set covering all key algorithms and data structures.",
                  icon: <CodeBracketIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/leetcode/leetcode150",
                  count: 150,
                },
                {
                  title: "FAANG Favorites",
                  description: "Top problems frequently asked by top-tier tech companies.",
                  icon: <StarIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/interview/faang",
                  count: 100,
                },
              ].map((set, index) => (
                <Link key={`set-${index}`} href={set.link} prefetch={true}>
                  <motion.div
                    variants={cardVariants}
                    className="p-6 bg-gray-50 dark:bg-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {set.icon}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{set.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{set.description}</p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">{set.count} Problems</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </section>

      {/* Top System Design Questions Section */}
      <section ref={systemDesignRef} className="py-16 bg-gray-50 dark:bg-slate-900">
        {systemDesignInView && (
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
              Top System Design Questions
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Design a URL Shortener",
                  description: "Learn to architect a scalable URL shortening service like Bitly.",
                  icon: <RocketLaunchIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/system-design/url-shortener",
                },
                {
                  title: "Design a Messaging App",
                  description: "Build a robust messaging system like WhatsApp or Telegram.",
                  icon: <RocketLaunchIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/system-design/messaging-app",
                },
                {
                  title: "Design a Ride-Sharing Service",
                  description: "Create a scalable system for a service like Uber or Lyft.",
                  icon: <RocketLaunchIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/system-design/ride-sharing",
                },
              ].map((question, index) => (
                <Link key={`question-${index}`} href={question.link} prefetch={true}>
                  <motion.div
                    variants={cardVariants}
                    className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-indigo-200 dark:border-indigo-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {question.icon}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{question.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{question.description}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
            <motion.div
              variants={cardVariants}
              className="text-center mt-12"
            >
              <Link href="/system-design" prefetch={true}>
                <motion.button
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Explore all system design questions"
                >
                  Explore All Designs
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* Learning Paths Section */}
      <section ref={learningPathsRef} className="py-16 bg-white dark:bg-slate-800">
        {learningPathsInView && (
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
              Curated Learning Paths
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Java Learning Path",
                  description: "Master Java from basics to advanced topics like concurrency and design patterns.",
                  icon: <BookOpenIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/java",
                  count: totalJavaTopics,
                  difficulty: "Beginner to Advanced",
                },
                {
                  title: "Database Learning Path",
                  description: "Learn relational, NoSQL, graph, and time-series databases, plus pagination techniques.",
                  icon: <BookOpenIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/databases",
                  count: totalDatabaseTopics,
                  difficulty: "Beginner to Advanced",
                },
                {
                  title: "React Learning Path",
                  description: "Master React development with topics from components and hooks to advanced state management and performance optimization.",
                  icon: <BookOpenIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/react",
                  count: totalReactTopics,
                  difficulty: "Beginner to Advanced",
                },
              ].map((path, index) => (
                <Link key={`path-${index}`} href={path.link} prefetch={true}>
                  <motion.div
                    variants={cardVariants}
                    className="p-6 bg-gray-50 dark:bg-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {path.icon}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{path.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{path.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">{path.count} Topics</p>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">{path.difficulty}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
            <motion.div
              variants={cardVariants}
              className="text-center mt-12"
            >
              <Link href="/learning-paths" prefetch={true}>
                <motion.button
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Explore all learning paths"
                >
                  Explore All Learning Paths
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* Mock Interviews Section */}
      <section ref={mockInterviewsRef} className="py-16 bg-gray-50 dark:bg-slate-900">
        {mockInterviewsInView && (
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
              Mock Interviews
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Coding Interview",
                  description: "Simulate a live coding session with real-time feedback.",
                  icon: <CodeBracketIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/interview/mock",
                },
                {
                  title: "System Design Interview",
                  description: "Practice designing scalable systems with expert guidance.",
                  icon: <RocketLaunchIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/interview/mock",
                },
                {
                  title: "Behavioral Interview",
                  description: "Prepare for behavioral questions with mock scenarios.",
                  icon: <PuzzlePieceIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/interview/mock",
                },
              ].map((mock, index) => (
                <Link key={`mock-${index}`} href={mock.link} prefetch={true}>
                  <motion.div
                    variants={cardVariants}
                    className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-indigo-200 dark:border-indigo-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {mock.icon}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{mock.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{mock.description}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </section>

      {/* Coding Tests Section */}
      <section ref={codingTestsRef} className="py-16 bg-white dark:bg-slate-800">
        {codingTestsInView && (
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
              Timed Coding Tests
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Beginner Challenge",
                  description: "Test your skills with basic algorithms and data structures.",
                  icon: <ClipboardDocumentListIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/interview/tests",
                  duration: "30 min",
                },
                {
                  title: "Intermediate Challenge",
                  description: "Tackle medium-difficulty problems under time pressure.",
                  icon: <ClipboardDocumentListIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/interview/tests",
                  duration: "45 min",
                },
                {
                  title: "Advanced Challenge",
                  description: "Solve complex problems to prepare for top-tier interviews.",
                  icon: <ClipboardDocumentListIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/interview/tests",
                  duration: "60 min",
                },
              ].map((test, index) => (
                <Link key={`test-${index}`} href={test.link} prefetch={true}>
                  <motion.div
                    variants={cardVariants}
                    className="p-6 bg-gray-50 dark:bg-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-indigo-200 dark:border-indigo-800"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {test.icon}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{test.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{test.description}</p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">Duration: {test.duration}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </section>

      {/* MCQ Challenges Section */}
      <section ref={mcqChallengesRef} className="py-16 bg-gray-50 dark:bg-slate-900">
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
              Top MCQ Challenges
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {mcqTopics.slice(0, 3).map((challenge, index) => (
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
            <motion.div
              variants={cardVariants}
              className="text-center mt-12"
            >
              <Link href="/interview/mcq" prefetch={true}>
                <motion.button
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="View all MCQ challenges"
                >
                  View All MCQs
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* Interview Tips Section */}
      <section ref={tipsRef} className="py-16 bg-white dark:bg-slate-800">
        {tipsInView && (
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
              Expert Interview Tips
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Optimize Your Solutions",
                  description: "Learn to analyze time and space complexity to impress interviewers.",
                  icon: <DocumentTextIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/interview/tips",
                },
                {
                  title: "Communicate Effectively",
                  description: "Master the art of explaining your thought process clearly.",
                  icon: <DocumentTextIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/interview/tips",
                },
                {
                  title: "Handle Edge Cases",
                  description: "Discover strategies to identify and address edge cases in problems.",
                  icon: <DocumentTextIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/interview/tips",
                },
              ].map((tip, index) => (
                <Link key={`tip-${index}`} href={tip.link} prefetch={true}>
                  <motion.div
                    variants={cardVariants}
                    className="p-6 bg-gray-50 dark:bg-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tip.icon}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{tip.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{tip.description}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
            <motion.div
              variants={cardVariants}
              className="text-center mt-12"
            >
              <Link href="/interview/tips" prefetch={true}>
                <motion.button
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Explore all interview tips"
                >
                  Explore All Tips
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* Dev Tips Section */}
      <section ref={tipsRef} className="py-16 bg-gray-50 dark:bg-slate-900">
        {tipsInView && <DevTipsSection />}
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
            Ready to Crush Your Interviews?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Start practicing with our curated resources and learning paths to land your dream job.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link href="#problem-sets" prefetch={true}>
              <motion.button
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Start practicing now"
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

export async function getServerSideProps({ req, res }) {
  // Calculate total Java topics (main topics + subtopics)
  const totalJavaTopics = javaTopics.topics.reduce(
    (acc, topic) => acc + 1 + topic.subtopics.length,
    0
  );

  // Calculate total Database topics (main topics + subtopics)
  const totalDatabaseTopics = databaseTopics.topics.reduce(
    (acc, topic) => acc + 1 + topic.subtopics.length,
    0
  );

  const totalReactTopics = reactTopics.topics.reduce(
    (acc, topic) => acc + 1 + topic.subtopics.length,
    0
  );

  return {
    props: {
      totalLeetcodeQuestions: problems.length,
      totalSystemDesignQuestions: systemDesignQuestions.length,
      totalMCQTopics: mcqTopics.length,
      totalJavaTopics,
      totalDatabaseTopics,
      totalReactTopics,
    },
  };
}