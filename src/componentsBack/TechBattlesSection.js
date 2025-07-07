import Link from "next/link";
import { motion } from "framer-motion";
import { memo } from "react";
import { TrophyIcon } from "@heroicons/react/24/solid";

// Tech Battles Section: Showcases coding competitions where users compare technologies (e.g., React vs. Vue). Displays battle details like title, difficulty, tags, and description, with a CTA to join the battle.
const TechBattlesSection = () => {
  // Static data for tech battles (could be fetched via API in a real implementation)
  const battles = [
    {
      id: "1",
      title: "React vs. Vue: Which Frontend Framework to Choose?",
      slug: "react-vs-vue",
      difficulty: "Medium",
      tags: ["Frontend", "JavaScript", "Frameworks"],
      comparison_type: "Frontend Frameworks",
      description: "A detailed comparison of React and Vue, focusing on performance, scalability, learning curve, and ecosystem support.",
    },
    {
      id: "2",
      title: "Node.js vs. Django: Backend Framework Showdown",
      slug: "nodejs-vs-django",
      difficulty: "Hard",
      tags: ["Backend", "JavaScript", "Python", "Frameworks"],
      comparison_type: "Backend Frameworks",
      description: "Comparing Node.js and Django for building scalable backend systems, analyzing speed, ease of use, and community support.",
    },
  ];

  // Animation variants for battle cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-6 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
        >
          Tech Battles
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {battles.map((battle) => (
            <motion.div
              key={battle.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="p-6 bg-gray-50 dark:bg-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center mb-4">
                <TrophyIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{battle.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{battle.description}</p>
              <div className="flex justify-between mb-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Difficulty: {battle.difficulty}
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Type: {battle.comparison_type}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {battle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/tech-battles/${battle.id}`} prefetch={true}>
                <motion.button
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Join the ${battle.title} tech battle`}
                >
                  See Details
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/tech-battles" prefetch={true}>
            <motion.button
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Explore all tech battles"
            >
              Explore All Battles
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(TechBattlesSection);