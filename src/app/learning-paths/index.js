// pages/learning-paths/index.js
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Layout from "../../components/Layout";
import { toast, Toaster } from "react-hot-toast";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import DOMPurify from "isomorphic-dompurify";
import { useSession } from "next-auth/react";
import { useState } from "react";

// Import JSON files (assume they exist or will be created)
import javaTopics from "../../data/java_topics.json";
import databaseTopics from "../../data/database_topics.json";
import reactTopics from "../../data/react_topics.json";
import pythonTopics from "../../data/python_topics.json";
import javascriptTopics from "../../data/javascript_topics.json";
import cppTopics from "../../data/cpp_topics.json";
import sqlTopics from "../../data/sql_topics.json";
import typescriptTopics from "../../data/typescript_topics.json";
import goTopics from "../../data/go_topics.json";
import rubyTopics from "../../data/ruby_topics.json";
import phpTopics from "../../data/php_topics.json";
import nodejsTopics from "../../data/nodejs_topics.json";
import dsaTopics from "../../data/dsa_topics.json";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

// Centralized configuration for learning paths
const learningPathsConfig = [
  {
    title: "Java Learning Path",
    description: "Master Java from basics to advanced topics like concurrency and design patterns.",
    link: "/java",
    topicsData: javaTopics,
    difficulty: "Beginner to Advanced",
  },
  {
    title: "Database Learning Path",
    description: "Learn relational, NoSQL, graph, and time-series databases, plus pagination techniques.",
    link: "/databases",
    topicsData: databaseTopics,
    difficulty: "Beginner to Advanced",
  },
  {
    title: "React Learning Path",
    description: "Master React development with topics from components and hooks to advanced state management.",
    link: "/react",
    topicsData: reactTopics,
    difficulty: "Beginner to Advanced",
  },
  {
    title: "Python Learning Path",
    description: "Learn Python from basic syntax to advanced topics like data science and machine learning.",
    link: "/python",
    topicsData: pythonTopics,
    difficulty: "Beginner to Advanced",
  },
  {
    title: "JavaScript Learning Path",
    description: "Master JavaScript for web development, including ES6+, async programming, and DOM manipulation.",
    link: "/javascript",
    topicsData: javascriptTopics,
    difficulty: "Beginner to Advanced",
  },
  {
    title: "C++ Learning Path",
    description: "Learn C++ for system programming, game development, and competitive programming.",
    link: "/cpp",
    topicsData: cppTopics,
    difficulty: "Beginner to Advanced",
  },
  {
    title: "SQL Learning Path",
    description: "Master SQL for database querying, optimization, and data analysis.",
    link: "/sql",
    topicsData: sqlTopics,
    difficulty: "Beginner to Intermediate",
  },
  {
    title: "TypeScript Learning Path",
    description: "Learn TypeScript for type-safe JavaScript development and modern frameworks.",
    link: "/typescript",
    topicsData: typescriptTopics,
    difficulty: "Intermediate to Advanced",
  },
  {
    title: "Go Learning Path",
    description: "Master Go for building scalable, concurrent, and cloud-native applications.",
    link: "/go",
    topicsData: goTopics,
    difficulty: "Beginner to Advanced",
  },
  {
    title: "Ruby Learning Path",
    description: "Learn Ruby for web development, scripting, and Ruby on Rails.",
    link: "/ruby",
    topicsData: rubyTopics,
    difficulty: "Beginner to Intermediate",
  },
  {
    title: "PHP Learning Path",
    description: "Master PHP for server-side web development and content management systems.",
    link: "/php",
    topicsData: phpTopics,
    difficulty: "Beginner to Intermediate",
  },
  {
    title: "Node.js Learning Path",
    description: "Learn Node.js for building scalable server-side applications and APIs.",
    link: "/nodejs",
    topicsData: nodejsTopics,
    difficulty: "Intermediate to Advanced",
  },
  {
    title: "Data Structures & Algorithms",
    description: "Master DSA for coding interviews and competitive programming.",
    link: "/dsa",
    topicsData: dsaTopics,
    difficulty: "Beginner to Advanced",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "DevExCode Learning Paths",
  url: "https://devexcode.com/learning-paths",
  description: "Explore curated learning paths for programming languages and technical skills to excel in interviews and development.",
  publisher: {
    "@type": "Organization",
    name: "DevExCode Team",
  },
  hasPart: learningPathsConfig.map((path) => ({
    "@type": "CreativeWork",
    name: path.title,
    url: `https://devexcode.com${path.link}`,
    description: path.description,
  })),
};

export default function LearningPathsPage({ topicCounts }) {
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(!!session);
  const [userName, setUserName] = useState(session?.user?.name || "");

  const { ref: pathsSectionRef, inView: pathsSectionInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Layout isLoggedIn={isLoggedIn} userName={userName}>
      <Head>
        <title>DevExCode - Learning Paths</title>
        <meta
          name="description"
          content="Explore curated learning paths for programming languages like Java, Python, JavaScript, and more to master technical skills for interviews and beyond."
        />
        <meta
          name="keywords"
          content="learning paths, java, python, javascript, react, databases, sql, typescript, go, ruby, php, nodejs, dsa, technical interview prep"
        />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="DevExCode - Learning Paths" />
        <meta
          property="og:description"
          content="Master programming with curated learning paths for Java, Python, JavaScript, and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devexcode.com/learning-paths" />
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
            Curated Learning Paths
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Master programming with our structured learning paths for languages and technologies, designed for beginners to advanced learners.
          </motion.p>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section ref={pathsSectionRef} className="py-16 bg-white dark:bg-slate-800">
        {pathsSectionInView && (
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
              Explore Learning Paths
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPathsConfig.map((path, index) => (
                <Link key={index} href={path.link} prefetch={Boolean(index)}>
                  <motion.div
                    variants={cardVariants}
                    className="p-6 bg-gray-50 dark:bg-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BookOpenIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{path.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{path.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                        {topicCounts[path.link.slice(1)]} Topics
                      </p>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">{path.difficulty}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Start Your Learning Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Choose a learning path and build the skills you need to succeed in technical interviews and beyond.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link href="/python" prefetch={true}>
              <motion.button
                className="px-8 py-4 bg-indigo-700 text-white rounded-lg text-lg font-semibold hover:bg-indigo-800 transition shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Start Python learning path"
              >
                Start Learning
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  // Calculate total topics for each learning path
  const topicCounts = {};
  for (const path of learningPathsConfig) {
    const key = path.link.slice(1); // Remove leading slash
    topicCounts[key] = path.topicsData.topics.reduce(
      (acc, topic) => acc + 1 + (topic.subtopics?.length || 0),
      0
    );
  }

  return {
    props: {
      topicCounts,
    },
  };
}