// pages/interview/tests/index.js
import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Layout from "../../../components/Layout";
import { toast, Toaster } from "react-hot-toast";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import DOMPurify from "isomorphic-dompurify";
import { useSession } from "next-auth/react";

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
  name: "DevExCode Timed Coding Tests",
  url: "https://devexcode.com/interview/tests",
  description: "Practice timed coding tests to simulate real interview conditions with a built-in code editor and timer.",
  publisher: {
    "@type": "Organization",
    name: "DevExCode Team",
  },
};

const sampleProblem = {
  title: "Two Sum",
  description:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
  example: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
  difficulty: "Easy",
  timeLimit: 30 * 60, // 30 minutes in seconds
};

export default function TimedCodingTestsPage() {
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(!!session);
  const [userName, setUserName] = useState(session?.user?.name || "");
  const [code, setCode] = useState("// Write your solution here\nfunction twoSum(nums, target) {\n  \n}");
  const [timeLeft, setTimeLeft] = useState(sampleProblem.timeLimit);
  const [isRunning, setIsRunning] = useState(false);

  const { ref: testsSectionRef, inView: testsSectionInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            toast.error("Time's up!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleStartTest = () => {
    setIsRunning(true);
    toast.success("Test started!");
  };

  const handleSubmit = () => {
    setIsRunning(false);
    toast.success("Code submitted! Review pending.");
    // Simulate submission logic (e.g., send to API or evaluate)
  };

  return (
    <Layout isLoggedIn={isLoggedIn} userName={userName}>
      <Head>
        <title>DevExCode - Timed Coding Tests</title>
        <meta
          name="description"
          content="Practice timed coding tests to simulate real interview conditions with a built-in code editor and timer."
        />
        <meta name="keywords" content="timed coding tests, coding interviews, practice coding, interview preparation" />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="DevExCode - Timed Coding Tests" />
        <meta property="og:description" content="Test your coding skills under time pressure with our interactive coding environment." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devexcode.com/interview/tests" />
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
            Timed Coding Tests
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Simulate real coding interviews with timed challenges and an interactive coding environment.
          </motion.p>
        </div>
      </section>

      {/* Test Selection */}
      <section ref={testsSectionRef} className="py-16 bg-white dark:bg-slate-800">
        {testsSectionInView && (
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
              Choose Your Test
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Beginner Challenge",
                  description: "Test your skills with basic algorithms and data structures.",
                  duration: "30 min",
                  link: "/interview/tests/beginner",
                },
                {
                  title: "Intermediate Challenge",
                  description: "Tackle medium-difficulty problems under time pressure.",
                  duration: "45 min",
                  link: "/interview/tests/intermediate",
                },
                {
                  title: "Advanced Challenge",
                  description: "Solve complex problems to prepare for top-tier interviews.",
                  duration: "60 min",
                  link: "/interview/tests/advanced",
                },
              ].map((test, index) => (
                <Link key={`test-${index}`} href={test.link} prefetch={true}>
                  <motion.div
                    variants={cardVariants}
                    className="p-6 bg-gray-50 dark:bg-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ClipboardDocumentListIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />
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

      {/* Coding Environment */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
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
            Coding Environment
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{sampleProblem.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{sampleProblem.description}</p>
              <pre className="bg-gray-100 dark:bg-slate-700 p-4 rounded-lg text-sm text-gray-800 dark:text-gray-200">
                {sampleProblem.example}
              </pre>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-4">
                Difficulty: {sampleProblem.difficulty}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Code Editor</h3>
                <div className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                  Time Left: {formatTime(timeLeft)}
                </div>
              </div>
              <AceEditor
                mode="javascript"
                theme="monokai"
                value={code}
                onChange={setCode}
                name="code-editor"
                editorProps={{ $blockScrolling: true }}
                width="100%"
                height="300px"
                className="rounded-lg"
              />
              <div className="flex justify-end mt-4 gap-4">
                <motion.button
                  onClick={handleStartTest}
                  disabled={isRunning}
                  className={`px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition ${
                    isRunning ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Test
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  disabled={!isRunning}
                  className={`px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition ${
                    !isRunning ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Submit
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}