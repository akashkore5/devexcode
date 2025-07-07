import Link from "next/link";
import Head from "next/head";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import Layout from "../components/Layout";
import { toast, Toaster } from "react-hot-toast";
import {
  CodeBracketIcon,
  UsersIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon,
  BookOpenIcon,
  AcademicCapIcon,
  StarIcon,
  BellIcon,
  UserIcon,
  ChartBarIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import DOMPurify from "isomorphic-dompurify";
import { useSession, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import authOptions from "./api/auth/[...nextauth]";
import problems from "../data/problems.json";
import systemDesignQuestions from "../data/system_design_questions.json";
import { subscribeToNotifications, checkSubscriptionStatus } from "../utils/notifications";
import HeroSection from "../components/HeroSection";
import NotificationSignupSection from "../components/NotificationSignupSection";

// Dynamic imports for heavy components to reduce initial load time
const TestimonialsSection = dynamic(() => import("../components/TestimonialsSection"), { ssr: false });
const TechBattlesSection = dynamic(() => import("../components/TechBattlesSection"), { ssr: false });
const DevTipsSection = dynamic(() => import("../components/DevTipsSection"), { ssr: false });

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const popupVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DevExCode",
  url: "https://devexcode.com/",
  description: "Master coding interviews with expert Leetcode solutions, system design guides, daily technical terms, and interview preparation resources.",
  publisher: {
    "@type": "Organization",
    name: "DevExCode Team",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://devexcode.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  mainEntity: [
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How to solve Leetcode problems?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "DevExCode provides detailed Leetcode solutions in C++ and Python with step-by-step explanations to help you master algorithms and data structures.",
          },
        },
        {
          "@type": "Question",
          name: "What are system design questions?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "System design questions test your ability to architect scalable systems. DevExCode offers comprehensive guides on topics like URL shorteners and messaging apps.",
          },
        },
        {
          "@type": "Question",
          name: "What is the daily term feature?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "DevExCode’s daily term feature provides a new technical term each day with a short explanation, sent via push notifications, and a detailed page for deeper learning.",
          },
        },
      ],
    },
    {
      "@type": "CreativeWork",
      name: "Leetcode Solutions Content",
      description: "Learn algorithms and data structures through expert Leetcode explanations in C++ and Python.",
      provider: {
        "@type": "Organization",
        name: "DevExCode",
        sameAs: "https://devexcode.com/",
      },
    },
    {
      "@type": "CreativeWork",
      name: "System Design Content",
      description: "Master scalable system design with tutorials on designing complex systems.",
      provider: {
        "@type": "Organization",
        name: "DevExCode",
        sameAs: "https://devexcode.com/",
      },
    },
    {
      "@type": "CreativeWork",
      name: "Daily Term Content",
      description: "Learn a new technical term daily with concise explanations and detailed guides.",
      provider: {
        "@type": "Organization",
        name: "DevExCode",
        sameAs: "devexcode.com/",
      },
    },
  ],
};

export default function Home({
  initialLoggedIn = false,
  initialName = "",
  totalLeetcodeQuestions,
  totalSystemDesignQuestions,
  serverError = false,
}) {
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn);
  const [userName, setUserName] = useState(initialName);
  const [authError, setAuthError] = useState(serverError ? "Failed to connect to authentication service. Retrying..." : null);
  const [retryCount, setRetryCount] = useState(serverError ? 1 : 0);
  const [dailyTerm, setDailyTerm] = useState(null);
  const [isLoadingTerm, setIsLoadingTerm] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [hasDismissedPrompt, setHasDismissedPrompt] = useState(false);
  const maxRetries = 3;
  const retryDelay = 5000;

  // Lazy load sections below the fold
  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: techBattlesRef, inView: techBattlesInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: devTipsRef, inView: devTipsInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Handle session status and initial data fetching
  useEffect(() => {
    if (status === "authenticated") {
      setIsLoggedIn(true);
      setUserName(session.user.name || "User");
      setAuthError(null);
      setRetryCount(0);
      checkNotificationPrompt();
      fetchDailyTerm();
    } else if (status === "unauthenticated") {
      setIsLoggedIn(false);
      setUserName("");
      setShowNotificationPrompt(false);
      fetchDailyTerm();
    }
  }, [status, session]);

  // Retry authentication on error
  useEffect(() => {
    if (authError && retryCount < maxRetries && status !== "authenticated") {
      const timer = setTimeout(() => {
        console.log(`Retrying session fetch (attempt ${retryCount}/${maxRetries})`);
        setRetryCount(retryCount + 1);
        signIn(null, { redirect: false });
      }, retryDelay);
      return () => clearTimeout(timer);
    }
  }, [authError, retryCount, status]);

  // Check if user should see notification prompt
  const checkNotificationPrompt = useCallback(async () => {
    if (!session?.user?.id || hasDismissedPrompt) return;
    const isSubscribed = await checkSubscriptionStatus(session.user.id);
    if (!isSubscribed && Notification.permission === "default") {
      setShowNotificationPrompt(true);
    }
  }, [session, hasDismissedPrompt]);

  // Fetch daily term
  const fetchDailyTerm = useCallback(async () => {
    setIsLoadingTerm(true);
    try {
      const response = await fetch("/api/daily-term");
      const data = await response.json();
      if (response.ok) {
        setDailyTerm(data);
      } else {
        toast.error(data.message || "Failed to fetch daily term");
      }
    } catch (error) {
      console.error("Fetch daily term error:", error.message);
      toast.error("Error loading daily term");
    } finally {
      setIsLoadingTerm(false);
    }
  }, []);

  // Fetch quick start item
  const fetchQuickStart = useCallback(() => {
    const isLeetcode = false;
    const items = isLeetcode ? problems : systemDesignQuestions;
    const randomItem = items[Math.floor(Math.random() * items.length)];
    const formattedTitle = randomItem.title.toLowerCase().replace(/\s+/g, "-");
    return {
      type: isLeetcode ? "leetcode" : "system-design",
      id: randomItem.id,
      title: randomItem.title,
      url: isLeetcode ? `/leetcode/${randomItem.id}-${formattedTitle}` : `/system-design/${randomItem.id}`,
    };
  }, []);

  // Handle sign-in
  const handleSignIn = useCallback(async (provider) => {
    try {
      await signIn(provider, { redirect: false });
    } catch (err) {
      console.error("Sign-in error:", err);
      setAuthError("Failed to connect to authentication service. Retrying...");
      setRetryCount(1);
    }
  }, []);

  // Dismiss notification prompt
  const handleDismissPrompt = useCallback(() => {
    setShowNotificationPrompt(false);
    setHasDismissedPrompt(true);
    localStorage.setItem("notificationPromptDismissed", "true");
  }, []);

  // Handle loading and error states
  if (status === "loading" || (authError && retryCount < maxRetries)) {
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
            <p className="text-gray-600 dark:text-gray-300 mt-4">{authError || "Loading..."}</p>
            {authError && <p className="text-gray-600 dark:text-gray-300 mt-2">Retrying in {retryDelay / 1000} seconds...</p>}
          </div>
        </div>
      </Layout>
    );
  }

  if (authError && retryCount >= maxRetries) {
    return (
      <Layout isLoggedIn={false} userName="">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 text-lg">Service temporarily unavailable. Please try again later.</p>
            <motion.button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-500 transition shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Refresh page"
            >
              Refresh Page
            </motion.button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isLoggedIn={isLoggedIn} userName={userName}>
      <Head>
        <title>DevExCode - Leetcode, System Design & Daily Terms</title>
        <meta
          name="description"
          content="Ace coding interviews with DevExCode’s expert Leetcode solutions, system design tutorials, daily technical terms, and comprehensive interview prep resources."
        />
        <meta
          name="keywords"
          content="Leetcode solutions, system design questions, daily term, coding interviews, algorithms, data structures, C++, Python, interview preparation, technical interviews, coding tutorials, programming challenges"
        />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="DevExCode - Leetcode, System Design & Daily Terms" />
        <meta
          property="og:description"
          content="Master technical interviews with expert Leetcode solutions, system design tutorials, daily technical terms, and coding challenges."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devexcode.com/" />
        <meta property="og:image" content="https://devexcode.com/og-image.jpg" />
        <meta property="og:image:alt" content="DevExCode platform for coding and system design" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DevExCode - Leetcode, System Design & Daily Terms" />
        <meta
          property="twitter:description"
          content="Level up your coding skills with DevExCode’s Leetcode solutions, system design guides, daily terms, and interview prep."
        />
        <meta name="twitter:image" content="https://devexcode.com/twitter-image.jpg" />
        <meta name="twitter:image:alt" content="DevExCode platform for coding and system design" />
        <link rel="canonical" href="https://devexcode.com/" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="preload" href="/favicon.ico" as="image" />
        <link rel="preload" href="/og-image.jpg" as="image" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="sitemap" href="/sitemaps.xml" />
        <style>
          {`
            @font-face {
              font-family: 'Inter';
              src: url('/fonts/Inter-Regular.woff2') format('woff2');
              font-weight: 400;
              font-display: swap;
            }
            @font-face {
              font-family: 'Inter';
              src: url('/fonts/Inter-Bold.woff2') format('woff2');
              font-weight: 700;
              font-display: swap;
            }
            .hero-section {
              font-family: 'Inter', sans-serif;
            }
          `}
        </style>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(JSON.stringify(structuredData)),
          }}
        />
      </Head>

      <Toaster position="top-right" toastOptions={{ duration: 4000, className: "mt-4" }} />

      {/* Hero Section: Static introduction to the platform with CTAs and View Profile button for authenticated users. */}
      <HeroSection
        showViewProfile={status === "authenticated"}
        quickStart={fetchQuickStart()}
        fetchQuickStart={fetchQuickStart}
        className="bg-indigo-50 dark:bg-slate-900 text-indigo-900 dark:text-indigo-300"
      />

      {/* Features Section: Highlights key tools and features of DevExCode in a grid of cards. */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-12"
          >
            Tools for Coders to Thrive
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Leetcode Solutions",
                description: "Master algorithms with detailed C++ and Python solutions, including time and space complexity analysis.",
                icon: <CodeBracketIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                link: "/leetcode",
              },
              {
                title: "System Design Mastery",
                description: "Learn to design scalable systems like Netflix or Twitter with step-by-step guides.",
                icon: <RocketLaunchIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                link: "/system-design",
              },
              {
                title: "Daily Technical Terms",
                description: "Learn a new technical term each day with concise explanations and notifications.",
                icon: <BellIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                link: "/daily-term",
              },
              {
                title: "10-Minute Learn",
                description: "Quickly grasp key concepts like Kafka and Docker with concise, focused lessons.",
                icon: <BookOpenIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                link: "/learn10",
              },
              {
                title: "Interview Preparation",
                description: "Ace technical interviews with curated problem sets and mock interview resources.",
                icon: <PuzzlePieceIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                link: "/interview",
              },
              {
                title: "Community Discussions",
                description: "Join forums to collaborate, share solutions, and learn from other developers.",
                icon: <UsersIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                link: "/community",
              },
            ].map((feature, index) => (
              <Link key={`feature-${index}`} href={feature.link} prefetch={true}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-6 bg-gray-50 dark:bg-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-indigo-200 dark:border-indigo-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 10-Minute Learn Section: Showcases quick learning topics in a card grid. */}
      <section className="py-16 bg-blue-50 dark:bg-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-center text-blue-900 dark:text-blue-300 mb-12"
          >
            10-Minute Learn Topics
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "What is Kafka?",
                description: "Learn the basics of Apache Kafka for distributed streaming.",
                icon: <BookOpenIcon className="w-8 h-8 text-white" />,
                link: "/learn10/1",
              },
              {
                title: "Docker Essentials",
                description: "Understand containerization and Docker in a quick lesson.",
                icon: <BookOpenIcon className="w-8 h-8 text-white" />,
                link: "/learn10/31",
              },
              {
                title: "REST API Design",
                description: "Master the principles of designing robust REST APIs.",
                icon: <BookOpenIcon className="w-8 h-8 text-white" />,
                link: "/learn10/111",
              },
            ].map((topic, index) => (
              <Link key={`topic-${index}`} href={topic.link} prefetch={true}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-6 bg-white dark:bg-blue-900 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-blue-200 dark:border-blue-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center" aria-label={`${topic.title} topic icon`}>
                      {topic.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2 text-center">{topic.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">{topic.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center mt-12"
          >
            <Link href="/learn10" prefetch={true}>
              <motion.button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 transition shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Explore all 10-minute learn topics"
              >
                Explore All Topics
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Learning Paths Section: Displays curated learning paths for different skill levels. */}
      <section className="py-6 bg-purple-50 dark:bg-purple-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-center text-purple-900 dark:text-purple-300 mb-12"
          >
            Curated Learning Paths
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Beginner to Intermediate",
                description: "Start with basic algorithms and progress to intermediate data structures.",
                icon: <AcademicCapIcon className="w-8 h-8 text-white" />,
                link: "/paths/beginner",
              },
              {
                title: "Advanced Algorithms",
                description: "Master complex topics like dynamic programming and graph algorithms.",
                icon: <ChartBarIcon className="w-8 h-8 text-white" />,
                link: "/paths/advanced",
              },
              {
                title: "FAANG Interview Prep",
                description: "Prepare for top-tier tech interviews with a comprehensive curriculum.",
                icon: <StarIcon className="w-8 h-8 text-white" />,
                link: "/paths/faang",
              },
            ].map((path, index) => (
              <Link key={`path-${index}`} href={path.link} prefetch={true}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-6 bg-white dark:bg-purple-900 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-purple-200 dark:border-purple-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center" aria-label={`${path.title} learning path icon`}>
                      {path.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-300 mb-2 text-center">{path.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">{path.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center mt-12"
          >
            <Link href="/paths" prefetch={true}>
              <motion.button
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-500 transition shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Explore all learning paths"
              >
                Explore All Paths
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tech Battles Section: Showcases coding competitions. Lazy-loaded for performance. */}
      <div ref={techBattlesRef}>
        {techBattlesInView && <TechBattlesSection className="bg-teal-50 dark:bg-teal-950 text-teal-900 dark:text-teal-300" />}
      </div>

      {/* Dev Tips Section: Displays bite-sized coding tips. Lazy-loaded for performance. */}
      <div ref={devTipsRef}>
        {devTipsInView && <DevTipsSection className="bg-gray-100 dark:bg-slate-700 text-indigo-800 dark:text-indigo-300" />}
      </div>

      {/* Stats Section: Highlights platform metrics in a grid. */}
      <section className="py-16 bg-indigo-100 dark:bg-indigo-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-indigo-900 dark:text-indigo-300 mb-12"
          >
            Empowering Coders Worldwide
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { label: "Problems Solved", value: 7500 },
              { label: "Design Guides", value: 75 },
              { label: "Code Submissions", value: 25000 },
              { label: "Happy Learners", value: 15000 },
              { label: "Community Members", value: 1000 },
            ].map((stat, index) => (
              <motion.div
                key={`stat-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-4"
              >
                <motion.p
                  className="text-4xl font-bold text-indigo-600 dark:text-indigo-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                >
                  {stat.value.toLocaleString()}
                </motion.p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section: Displays community testimonials. Lazy-loaded for performance. */}
      <div ref={testimonialsRef}>
        {testimonialsInView && <TestimonialsSection className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200" />}
      </div>

      {/* Community Section: Encourages users to join the developer community. */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-6"
          >
            Join Our Developer Community
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Collaborate with thousands of coders, share solutions, and grow your skills in our vibrant forums.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link href="/community" prefetch={true}>
              <motion.button
                className="px-8 py-4 bg-purple-600 text-white rounded-lg text-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-500 transition shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Join the community"
              >
                Join Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Resources Section: Lists additional learning resources. */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-center text-teal-800 dark:text-teal-300 mb-12"
          >
            Explore More Resources
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Coding Tutorials",
                description: "Dive into our blog for in-depth articles on algorithms and data structures.",
                link: "/resources/blog",
              },
              {
                title: "Video Guides",
                description: "Watch video walkthroughs of Leetcode problems and system design solutions.",
                link: "/resources/videos",
              },
              {
                title: "Cheat Sheets",
                description: "Download quick-reference guides for common coding patterns and design principles.",
                link: "/resources/cheatsheets",
              },
            ].map((resource, index) => (
              <Link key={`resource-${index}`} href={resource.link} prefetch={true}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-teal-200 dark:border-teal-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <h3 className="text-xl font-semibold text-teal-900 dark:text-teal-300 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{resource.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Notification Signup Section: Encourages users to subscribe to notifications. */}
      <NotificationSignupSection
        session={session}
        showNotificationPrompt={showNotificationPrompt}
        setShowNotificationPrompt={setShowNotificationPrompt}
        hasDismissedPrompt={hasDismissedPrompt}
        handleDismissPrompt={handleDismissPrompt}
        subscribeToNotifications={subscribeToNotifications}
        className="bg-indigo-50 dark:bg-slate-900 text-indigo-900 dark:text-indigo-300"
      />
    </Layout>
  );
}

export async function getServerSideProps({ req, res }) {
  let session = null;
  let serverError = false;

  try {
    session = await getServerSession(req, res, authOptions);
  } catch (error) {
    console.error("getServerSideProps: Failed to fetch session:", error.message);
    serverError = true;
  }

  return {
    props: {
      initialLoggedIn: !!session,
      initialName: session?.user?.name || "",
      totalLeetcodeQuestions: problems.length,
      totalSystemDesignQuestions: systemDesignQuestions.length,
      serverError,
    },
  };
}