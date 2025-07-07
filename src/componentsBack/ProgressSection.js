import Link from "next/link";
import { motion } from "framer-motion";
import { memo } from "react";

// Progress Section: Displays authenticated users’ progress in Leetcode and System Design with pie charts and progress bars. Includes a link to the user’s profile.
function ProgressSection({
  progress,
  isLoadingProgress,
  fetchProgress,
  totalLeetcodeQuestions,
  totalSystemDesignQuestions,
  legendColor,
  COLORS,
  CHART_HEIGHT,
  cardVariants,
  Pie,
  leetcodeStats,
  systemDesignStats,
  leetcodePieData,
  systemDesignPieData,
  pieOptions,
}) {
  return (
    <section className="py-0 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
        >
          Your Coding Journey
        </motion.h2>
        {isLoadingProgress ? (
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
            <p className="text-gray-600 dark:text-gray-300 mt-2">Loading progress...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 rounded-3xl shadow-xl"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Leetcode Progress</h3>
              <div className="space-y-6">
                {["solved", "viewed", "tagged"].map((key) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-300 font-medium capitalize">{key}</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {leetcodeStats[key]}/{key === "solved" ? totalLeetcodeQuestions : leetcodeStats[key]}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                      <motion.div
                        className="h-3 rounded-full"
                        style={{ backgroundColor: COLORS[key] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(leetcodeStats[key] / totalLeetcodeQuestions) * 100}%` }}
                        transition={{ duration: 0.7 }}
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Remaining</span>
                    <span className="font-semibold text-gray-600 dark:text-gray-400">{leetcodeStats.remaining}</span>
                  </div>
                </div>
                <div className={`h-${CHART_HEIGHT}`}>
                  <Pie
                    data={leetcodePieData}
                    options={pieOptions}
                    aria-label={`Leetcode progress chart: Solved ${leetcodeStats.solved}, Viewed ${leetcodeStats.viewed}, Tagged ${leetcodeStats.tagged}, Remaining ${leetcodeStats.remaining}`}
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 rounded-3xl shadow-xl"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">System Design Progress</h3>
              <div className="space-y-6">
                {["solved", "viewed", "tagged"].map((key) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-300 font-medium capitalize">{key}</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {systemDesignStats[key]}/{key === "solved" ? totalSystemDesignQuestions : systemDesignStats[key]}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                      <motion.div
                        className="h-3 rounded-full"
                        style={{ backgroundColor: COLORS[key] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(systemDesignStats[key] / totalSystemDesignQuestions) * 100}%` }}
                        transition={{ duration: 0.7 }}
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Remaining</span>
                    <span className="font-semibold text-gray-600 dark:text-gray-400">{systemDesignStats.remaining}</span>
                  </div>
                </div>
                <div className={`h-${CHART_HEIGHT}`}>
                  <Pie
                    data={systemDesignPieData}
                    options={pieOptions}
                    aria-label={`System Design progress chart: Solved ${systemDesignStats.solved}, Viewed ${systemDesignStats.viewed}, Tagged ${systemDesignStats.tagged}, Remaining ${systemDesignStats.remaining}`}
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2 text-center mt-8"
            >
              <Link href="/profile" prefetch={true}>
                <motion.button
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="View your profile"
                >
                  View Profile
                </motion.button>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(ProgressSection);