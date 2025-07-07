import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import {
  CheckCircleIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import javaTopics from "../../data/database_topics.json";
import Layout from "../../components/Layout";
import debounce from "lodash/debounce";

export default function JavaTopicsDashboard() {
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState({ completed: [], viewed: [] });
  const [isUpdating, setIsUpdating] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      setIsLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "databases", action: "all" }),
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        setProgress({
          completed: data.completed || [],
          viewed: data.viewed || [],
        });
      } catch (error) {
        console.error("Error fetching progress:", error);
        toast.error("Failed to load progress");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [status]);

  const handleMarkCompleted = useCallback(
    async (id) => {
      if (status !== "authenticated") {
        setIsLoginModalOpen(true);
        return;
      }

      const isCompleted = progress.completed.includes(id);
      setIsUpdating((prev) => ({ ...prev, [id]: true }));

      try {
        const response = await fetch("/api/user/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "databases",
            action: "completed",
            id,
            remove: isCompleted,
          }),
        });
        if (response.ok) {
          setProgress((prev) => ({
            ...prev,
            completed: isCompleted
              ? prev.completed.filter((item) => item !== id)
              : [...prev.completed, id],
          }));
          toast.success(isCompleted ? "Topic unmarked!" : "Topic marked as completed!");
        } else {
          toast.error("Failed to update completion status");
        }
      } catch (error) {
        console.error("Error updating completion:", error);
        toast.error("An error occurred");
      } finally {
        setIsUpdating((prev) => ({ ...prev, [id]: false }));
      }
    },
    [status, progress.completed]
  );

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  const filteredTopics = useMemo(() => {
    return javaTopics.topics
      .map((topic) => {
        const filteredSubtopics = topic.subtopics.filter((subtopic) => {
          const matchesSearch = searchQuery
            ? subtopic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              subtopic.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            : true;
          const matchesDifficulty =
            difficultyFilter === "All" || subtopic.difficulty === difficultyFilter;
          const matchesTag = tagFilter === "All" || subtopic.tags.includes(tagFilter);
          return matchesSearch && matchesDifficulty && matchesTag;
        });

        const topicMatchesSearch = searchQuery
          ? topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topic.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          : true;
        const topicMatchesDifficulty =
          difficultyFilter === "All" || topic.difficulty === difficultyFilter;
        const topicMatchesTag = tagFilter === "All" || topic.tags.includes(tagFilter);

        if (
          (topicMatchesSearch && topicMatchesDifficulty && topicMatchesTag) ||
          filteredSubtopics.length > 0
        ) {
          return { ...topic, subtopics: filteredSubtopics };
        }
        return null;
      })
      .filter((topic) => topic !== null);
  }, [searchQuery, difficultyFilter, tagFilter]);

  const progressStats = useMemo(() => {
    const totalItems = javaTopics.topics.reduce(
      (acc, topic) => acc + 1 + topic.subtopics.length,
      0
    );
    const completedItems = progress.completed.length;
    const percentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    return { totalItems, completedItems, percentage };
  }, [progress.completed]);

  const uniqueTags = useMemo(() => {
    const tags = new Set();
    javaTopics.topics.forEach((topic) => {
      topic.tags.forEach((tag) => tags.add(tag));
      topic.subtopics.forEach((subtopic) => subtopic.tags.forEach((tag) => tags.add(tag)));
    });
    return ["All", ...Array.from(tags).sort()];
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    headline: "Databases Learning Path | DevCodeEx",
    description:
      "Master Java development with our comprehensive learning path covering Core Java, Spring, Microservices, System Design, and more.",
    keywords:
      "Java, Core Java, Spring, Spring Boot, Microservices, Hibernate, System Design, DSA, Testing, CI/CD, Cloud, Interview Preparation",
    author: { "@type": "Organization", name: "DevCodeEx" },
    publisher: {
      "@type": "Organization",
      name: "DevCodeEx",
      logo: { "@type": "ImageObject", url: "https://devexcode.com/logo.png" },
    },
    mainEntity: javaTopics.topics.map((topic) => ({
      "@type": "Course",
      name: topic.title,
      description: topic.description,
      provider: { "@type": "Organization", name: "DevCodeEx" },
      hasPart: topic.subtopics.map((subtopic) => ({
        "@type": "Course",
        name: subtopic.title,
        description: subtopic.description,
      })),
    })),
  };

  return (
    <Layout
      title="Java Developer Learning Path | DevCodeEx"
      description="Master Java with our comprehensive learning path covering Core Java, Spring, Microservices, and more."
      isLoginModalOpen={isLoginModalOpen}
      setIsLoginModalOpen={setIsLoginModalOpen}
    >
      <Head>
        <meta
          name="keywords"
          content="Java, Core Java, Spring, Spring Boot, Microservices, Hibernate, System Design, DSA, Testing, CI/CD, Cloud, Interview Preparation"
        />
        <meta
          name="description"
          content="Master Java with our comprehensive learning path covering Core Java, Spring, Microservices, and more."
        />
        <meta property="og:title" content="Java Developer Learning Path | DevCodeEx" />
        <meta
          property="og:description"
          content="Master Java with our comprehensive learning path covering Core Java, Spring, Microservices, and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devexcode.com/java" />
        <meta property="og:image" content="https://devexcode.com/java-learning-path.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Java Developer Learning Path | DevCodeEx" />
        <meta
          name="twitter:description"
          content="Master Java with our comprehensive learning path covering Core Java, Spring, Microservices, and more."
        />
        <meta name="twitter:image" content="https://devexcode.com/java-learning-path.png" />
        <link rel="canonical" href="https://devexcode.com/java" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <Toaster position="top-right" />
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 min-h-screen overflow-x-hidden">
        {/* Hero Section */}
        <header className=" mx-auto px-0 sm:px-0 lg:px-0 pt-0 pb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="w-full sm:w-auto">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Databases Learning Path
              </h1>
              <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-300">
                Master databases with our expertly curated learning path, covering SQL, NoSQL, and more.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 rounded-full py-2 px-4 shadow-sm">
                  <UserCircleIcon className="w-6 sm:w-8 h-6 sm:h-8 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                    {session.user.name}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-indigo-600 text-white text-sm sm:text-base font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                  aria-label="Sign in"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Progress Stats */}
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Your Learning Progress
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-200">
                    {progressStats.completedItems} of {progressStats.totalItems} topics completed
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {progressStats.percentage.toFixed(1)}% complete
                  </p>
                </div>
                <div className="w-full sm:w-2/3">
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-3 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressStats.percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Search and Filters */}
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search topics or tags..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  aria-label="Search topics"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full sm:w-40 px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  aria-label="Filter by difficulty"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="w-full sm:w-40 px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  aria-label="Filter by tag"
                >
                  {uniqueTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.section>

          {/* Topics Grid */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-live="polite"
          >
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
                </div>
              ))
            ) : filteredTopics.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
                  No topics found. Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              filteredTopics.map((topic) => (
                <motion.div
                  key={topic.id}
                  variants={cardVariants}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/databases/${topic.id}`}
                        className="text-lg sm:text-xl font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        aria-label={`View ${topic.title}`}
                      >
                        {topic.title}
                      </Link>
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                          topic.difficulty === "Beginner"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : topic.difficulty === "Intermediate"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {topic.difficulty}
                      </span>
                    </div>
                    <motion.button
                      onClick={() => handleMarkCompleted(topic.id)}
                      disabled={isUpdating[topic.id]}
                      className={`flex items-center px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm font-semibold transition-transform duration-200 bg-gradient-to-r ${
                        progress.completed.includes(topic.id)
                          ? "from-green-500 to-green-600 text-white"
                          : "from-gray-500 to-gray-600 text-white"
                      } hover:scale-105 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={
                        progress.completed.includes(topic.id)
                          ? `Unmark ${topic.title} as completed`
                          : `Mark ${topic.title} as completed`
                      }
                    >
                      <CheckCircleIcon className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2" />
                      {isUpdating[topic.id] ? "Updating..." : "Complete"}
                    </motion.button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3">
                    {topic.description}
                  </p>
                  {topic.subtopics.length > 0 && (
                    <ul className="space-y-3">
                      {topic.subtopics.map((subtopic) => (
                        <li key={subtopic.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ChevronRightIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <Link
                              href={`/databases/${subtopic.id}`}
                              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                              aria-label={`View ${subtopic.title}`}
                            >
                              {subtopic.title}
                            </Link>
                          </div>
                          <motion.button
                            onClick={() => handleMarkCompleted(subtopic.id)}
                            disabled={isUpdating[subtopic.id]}
                            className={`flex items-center px-2 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-transform duration-200 bg-gradient-to-r ${
                              progress.completed.includes(subtopic.id)
                                ? "from-green-500 to-green-600 text-white"
                                : "from-gray-500 to-gray-600 text-white"
                            } hover:scale-105 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500`}
                            while ThunHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={
                              progress.completed.includes(subtopic.id)
                                ? `Unmark ${subtopic.title} as completed`
                                : `Mark ${subtopic.title} as completed`
                            }
                          >
                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                            {isUpdating[subtopic.id] ? "..." : "Done"}
                          </motion.button>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))
            )}
          </motion.section>
        </main>
      </div>
    </Layout>
  );
}