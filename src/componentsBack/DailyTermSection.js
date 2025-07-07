import Link from "next/link";
import { motion } from "framer-motion";
import { BellIcon } from "@heroicons/react/24/solid";
import { memo } from "react";

// Daily Term Section: Displays a daily technical term with a short explanation and a link to a detailed page. Fetched via API and shown for all users.
function DailyTermSection({ dailyTerm, isLoadingTerm, fetchDailyTerm, cardVariants }) {
  return (
    <section className="py-6 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
        >
          Daily Technical Term
        </motion.h2>
        {isLoadingTerm ? (
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
            <p className="text-gray-600 dark:text-gray-300 mt-2">Loading daily term...</p>
          </div>
        ) : dailyTerm ? (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="p-6 bg-gray-50 dark:bg-slate-700 rounded-2xl shadow-lg"
          >
            <div className="flex items-center mb-4">
              <BellIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{dailyTerm.term}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{dailyTerm.shortExplanation}</p>
            <Link href={`/daily-term/${dailyTerm.date}`} prefetch={true}>
              <motion.button
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Learn more about ${dailyTerm.term}`}
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">No daily term available.</p>
        )}
      </div>
    </section>
  );
}

export default memo(DailyTermSection);