import Link from "next/link";
import { motion } from "framer-motion";
import { memo, useEffect } from "react";

// Hero Section: Displays a welcoming banner with a personalized message for logged-in users or a generic tagline for guests. Includes quick start link and CTAs for Leetcode, System Design, and 10-Minute Learn.
function HeroSection({ isLoggedIn, userName, quickStart, fetchQuickStart }) {
  // Fetch quick start item on mount
  useEffect(() => {
    fetchQuickStart();
  }, [fetchQuickStart]);

  return (
    <section className="relative py-10 sm:py-16 bg-gradient-to-br from-indigo-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      <div className="relative max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6"
        >
          {isLoggedIn ? (
            <>
              Welcome Back, <span className="text-indigo-600 dark:text-indigo-400">{userName}!</span>
            </>
          ) : (
            <>
              Code. Design. <span className="text-indigo-600 dark:text-indigo-400">Succeed.</span>
            </>
          )}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
        >
          Master technical interviews with expert Leetcode solutions, system design guides, and daily technical terms.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/leetcode" prefetch={true}>
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-800 dark:to-indigo-900 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-500 transition shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Start solving Leetcode problems"
            >
              Solve Leetcode
            </motion.button>
          </Link>
          <Link href="/system-design" prefetch={true}>
            <motion.button
              className="px-8 py-4 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-lg text-lg font-semibold hover:bg-indigo-50 dark:hover:bg-slate-600 transition shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Learn system design"
            >
              Master System Design
            </motion.button>
          </Link>
          <Link href="/learn10" prefetch={true}>
            <motion.button
              className="px-8 py-4 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-lg text-lg font-semibold hover:bg-indigo-50 dark:hover:bg-slate-600 transition shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Explore 10-minute learn topics"
            >
              10-Minute Learn
            </motion.button>
          </Link>
        </motion.div>
        {quickStart && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-6 text-gray-600 dark:text-gray-300"
          >
            Quick Start: Try{" "}
            <Link
              href={`/${quickStart.type}/${quickStart.id}`}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
              prefetch={true}
            >
              {quickStart.title}
            </Link>
          </motion.p>
        )}
      </div>
    </section>
  );
}

export default memo(HeroSection);