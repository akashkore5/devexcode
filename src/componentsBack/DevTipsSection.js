import Link from "next/link";
import { motion } from "framer-motion";
import { memo } from "react";
import { LightBulbIcon } from "@heroicons/react/24/solid";

// Dev Tips Section: Displays bite-sized coding tips (micro-dev tips) to help developers learn key concepts quickly. Shows title, difficulty, tags, and date, with a CTA to read the full tip. Designed to show up to three tips in a grid on large screens, with "Read Dev Tip" buttons aligned at the bottom of each card.
const DevTipsSection = () => {
  // Static data for dev tips (could be fetched via API in a real implementation)
  const tips = [
    {
      id: 1,
      title: "Inheritance vs Composition",
      slug: "inheritance-vs-composition",
      difficulty: "Medium",
      tags: ["OOP", "Design Patterns", "Java", "Python", "C++"],
      date: "2025-04-01",
      description: "Learn the differences between inheritance and composition in object-oriented programming, with practical examples.",
    },
    {
      id: 2,
      title: "Memoization in Dynamic Programming",
      slug: "memoization-dynamic-programming",
      difficulty: "Hard",
      tags: ["Algorithms", "Dynamic Programming", "JavaScript", "Python"],
      date: "2025-04-02",
      description: "Understand how memoization optimizes recursive algorithms, with examples in Python and JavaScript.",
    },
    {
      id: 3,
      title: "REST vs GraphQL APIs",
      slug: "rest-vs-graphql",
      difficulty: "Medium",
      tags: ["APIs", "Web Development", "JavaScript"],
      date: "2025-04-03",
      description: "Compare REST and GraphQL for building APIs, focusing on flexibility and performance.",
    },
  ];

  // Animation variants for tip cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-6 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
        >
          Dev Tips
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tips.map((tip) => (
            <motion.div
              key={tip.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-indigo-200 dark:border-indigo-800 min-h-[300px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center mb-4">
                <LightBulbIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{tip.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{tip.description}</p>
              <div className="flex justify-between mb-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Difficulty: {tip.difficulty}
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Date: {new Date(tip.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {tip.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto">
                <Link href={`/micro-dev-tips/${tip.id}`} prefetch={true}>
                  <motion.button
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Read the ${tip.title} dev tip`}
                  >
                    Read Dev Tip
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/micro-dev-tips" prefetch={true}>
            <motion.button
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Explore all dev tips"
            >
              Explore All Tips
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(DevTipsSection);