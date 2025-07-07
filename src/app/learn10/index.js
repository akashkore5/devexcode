import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import questions from "../../data/10min_topics.json";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../../components/Layout";
import Head from "next/head";
import DOMPurify from "isomorphic-dompurify";
import { toast, Toaster } from "react-hot-toast";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  DocumentTextIcon,
  TableCellsIcon,
  ListBulletIcon,
} from "@heroicons/react/24/solid";

// Define categories based on your groupings
const CATEGORIES = [
  "All",
  "System Design",
  "Databases",
  "LLM/AI Tools",
  "Dev Tools",
  "Backend Frameworks",
  "Frontend & Design",
  "API Design",
  "Debugging & Monitoring",
  "Cloud Native & Kubernetes",
  "Computer Science",
];

// Assign categories to questions based on ID ranges
const getCategory = (id) => {
  if (id <= 10 || (id >= 101 && id <= 110) || (id >= 201 && id <= 210)) return "System Design";
  if ((id >= 11 && id <= 20) || (id >= 211 && id <= 220)) return "Databases";
  if (id >= 221 && id <= 230) return "LLM/AI Tools";
  if (id >= 231 && id <= 240) return "Dev Tools";
  if (id >= 241 && id <= 250) return "Backend Frameworks";
  if (id >= 251 && id <= 260) return "Frontend & Design";
  if (id >= 261 && id <= 270) return "API Design";
  if (id >= 271 && id <= 280) return "Debugging & Monitoring";
  if (id >= 281 && id <= 290) return "Cloud Native & Kubernetes";
  if (id >= 291 && id <= 300) return "Computer Science";
  if ((id >= 111 && id <= 120) || (id >= 171 && id <= 180)) return "API Design";
  if (id >= 121 && id <= 130) return "System Design";
  if ((id >= 131 && id <= 140) || (id >= 161 && id <= 170)) return "Computer Science";
  if (id >= 141 && id <= 150) return "Databases";
  if (id >= 151 && id <= 160) return "Frontend & Design";
  if (id >= 181 && id <= 190) return "Debugging & Monitoring";
  if (id >= 191 && id <= 200) return "Computer Science";
  return "System Design"; // Fallback
};

export default function Learn10({ initialViewMode = "table" }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [perPage, setPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPerPageOpen, setIsPerPageOpen] = useState(false);
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [userToggledView, setUserToggledView] = useState(false);

  const categoryRef = useRef(null);
  const perPageRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (perPageRef.current && !perPageRef.current.contains(event.target)) {
        setIsPerPageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle resize for view mode
  useEffect(() => {
    let timeout;
    const handleResize = () => {
      if (userToggledView) return;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setViewMode(window.innerWidth >= 768 ? "table" : "list");
      }, 200);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [userToggledView]);

  // Handle category query parameter
  useEffect(() => {
    if (router.query.category) {
      const queryCategory = decodeURIComponent(router.query.category);
      if (CATEGORIES.includes(queryCategory)) {
        setCategory(queryCategory);
        setPage(1);
      }
    } else {
      setCategory("");
    }
  }, [router.query.category]);

  const updateQuery = (newQuery) => {
    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const filtered = useMemo(() => {
    let result = questions.map((q) => ({
      ...q,
      category: getCategory(q.id),
    }));
    if (search) {
      result = result.filter(
        (q) =>
          q.question.toLowerCase().includes(search.toLowerCase()) ||
          q.id.toString() === search
      );
    }
    if (category && category !== "All") {
      result = result.filter((q) => q.category === category);
    }
    return result;
  }, [search, category]);

  const sortedQuestions = useMemo(() => {
    if (!sortColumn || !sortDirection) {
      return [...filtered];
    }
    return [...filtered].sort((a, b) => {
      if (sortColumn === "question") {
        return sortDirection === "asc"
          ? Number(a.id) - Number(b.id)
          : Number(b.id) - Number(a.id);
      }
      return sortDirection === "asc"
        ? String(a.category).localeCompare(String(b.category))
        : String(b.category).localeCompare(String(a.category));
    });
  }, [filtered, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedQuestions.length / perPage);
  const paginated = sortedQuestions.slice((page - 1) * perPage, page * perPage);

  const handleSort = (column) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const clearFilter = (filterType) => {
    if (filterType === "search") {
      setSearch("");
      setPage(1);
    } else if (filterType === "category") {
      setCategory("");
      setPage(1);
      const newQuery = { ...router.query };
      delete newQuery.category;
      updateQuery(newQuery);
    } else if (filterType === "perPage") {
      setPerPage(15);
      setPage(1);
    }
  };

  const truncateText = (text, maxLength = 16) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
  };

  const getCategoryColor = (category) => {
    const colors = {
      "System Design": { bg: "#3B82F6", text: "#FFFFFF" },
      Databases: { bg: "#10B981", text: "#FFFFFF" },
      "LLM/AI Tools": { bg: "#F59E0B", text: "#FFFFFF" },
      "Dev Tools": { bg: "#8B5CF6", text: "#FFFFFF" },
      "Backend Frameworks": { bg: "#EC4899", text: "#FFFFFF" },
      "Frontend & Design": { bg: "#14B8A6", text: "#FFFFFF" },
      "API Design": { bg: "#F97316", text: "#FFFFFF" },
      "Debugging & Monitoring": { bg: "#6B7280", text: "#FFFFFF" },
      "Cloud Native & Kubernetes": { bg: "#6366F1", text: "#FFFFFF" },
      "Computer Science": { bg: "#D1D5DB", text: "#1F2937" },
    };
    return colors[category] || { bg: "#E5E7EB", text: "#1F2937" };
  };

  const handlePageChange = (newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "list" ? "table" : "list"));
    setUserToggledView(true);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const categoryVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 100 },
    },
  };

  const iconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2 },
    tap: { scale: 0.9 },
  };

  const canonicalUrl = `https://devexcode.com/learn10${category ? `?category=${encodeURIComponent(category)}` : ""}`;

  return (
    <Layout>
      <Head>
        <title>
          {`10-Minute Learn Questions - ${search || "All"} Topics | DevExCode`}
        </title>
        <meta
          name="description"
          content={`Explore ${search || "all"} 10-minute learn topics covering system design, databases, AI tools, and more. Filter by ${category || "all categories"}.`}
        />
        <meta
          name="keywords"
          content={`10-minute learn, system design, databases, AI tools, dev tools, backend frameworks, frontend, API design, debugging, kubernetes, computer science, ${category || "all categories"}, tutorials`}
        />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content={`10-Minute Learn Questions - ${search || "All"} Topics | DevExCode`}
        />
        <meta
          property="og:description"
          content={`Master ${search || "all"} 10-minute learn topics with concise guides on system design, AI tools, and more.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta
          property="og:image"
          content="https://devexcode.com/og-image-learn10.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`10-Minute Learn Questions - ${search || "All"} Topics | DevExCode`}
        />
        <meta
          name="twitter:description"
          content={`Learn ${search || "all"} 10-minute topics with filters for ${category || "all categories"}.`}
        />
        <meta
          name="twitter:image"
          content="https://devexcode.com/twitter-image-learn10.jpg"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "url": canonicalUrl,
                "name": `10-Minute Learn ${search || "all"} topics`,
                "description": `Explore ${search || "all"} 10-minute learn questions with concise guides.`,
                "itemListElement": filtered.slice(0, 10).map((q, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "url": `https://devexcode.com/learn10/${q.id}`,
                  "name": `${q.id}. ${q.question}`,
                  "description": `Category: ${q.category}`,
                })),
              })
            ),
          }}
        />
      </Head>
      <Toaster />
      <main className="flex-grow max-w-7xl mx-auto px-2 sm:px-6 lg:px-0 py-0">
        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 sm:flex-nowrap">
            <div className="relative flex-grow min-w-[150px] mb-3 sm:mb-0">
              <input
                type="text"
                placeholder="Search by title or ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md pr-10 text-sm"
                aria-label="Search 10-minute learn questions"
              />
              {search && (
                <button
                  onClick={() => clearFilter("search")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Clear search"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="relative w-full sm:w-36 mb-3 sm:mb-0" ref={categoryRef}>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-left flex justify-between items-center transition-all duration-300 shadow-sm hover:shadow-md text-sm truncate"
                aria-label="Select category"
              >
                <span className="truncate">{truncateText(category || "Category")}</span>
                <span className="flex-shrink-0 w-4 h-4">
                  {category ? (
                    <XMarkIcon
                      className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFilter("category");
                      }}
                      aria-label="Clear category filter"
                    />
                  ) : (
                    <svg
                      className={`w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </span>
              </button>
              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 mt-2 w-full rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-gray-300 dark:border-gray-600 overflow-hidden"
                  >
                    {CATEGORIES.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setCategory(option === "All" ? "" : option);
                          setPage(1);
                          setIsCategoryOpen(false);
                          if (option !== "All") {
                            updateQuery({ ...router.query, category: option });
                          } else {
                            const newQuery = { ...router.query };
                            delete newQuery.category;
                            updateQuery(newQuery);
                          }
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200"
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:w-36">
                <button
                  onClick={() => setIsPerPageOpen(!isPerPageOpen)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-left flex justify-between items-center transition-all duration-300 shadow-sm hover:shadow-md text-sm truncate"
                  aria-label="Select questions per page"
                >
                  <span className="truncate">{truncateText(`${perPage} / Page`)}</span>
                  <span className="flex-shrink-0 w-4 h-4">
                    {perPage !== 15 ? (
                      <XMarkIcon
                        className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearFilter("perPage");
                        }}
                        aria-label="Reset questions per page"
                      />
                    ) : (
                      <svg
                        className={`w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-transform ${isPerPageOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </span>
                </button>
                <AnimatePresence>
                  {isPerPageOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-10 mt-2 w-full rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-gray-300 dark:border-gray-600 overflow-hidden"
                    >
                      {[15, 25, 50, 100].map((value) => (
                        <button
                          key={value}
                          onClick={() => {
                            setPerPage(value);
                            setPage(1);
                            setIsPerPageOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200"
                        >
                          {value} / page
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={toggleViewMode}
                className="p-2 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow-md w-10 h-10 flex items-center justify-center flex-shrink-0"
                aria-label={`Switch to ${viewMode === "list" ? "table" : "list"} view`}
              >
                {viewMode === "list" ? (
                  <TableCellsIcon className="w-5 h-5" />
                ) : (
                  <ListBulletIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Content and Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Question List/Table */}
          <div className="w-full lg:w-3/4">
            {viewMode === "list" ? (
              <ul className="space-y-6">
                {paginated.length === 0 ? (
                  <li className="text-center text-gray-500 dark:text-gray-400 py-10 text-lg">
                    No questions found. Try adjusting your filters.
                  </li>
                ) : (
                  paginated.map(({ id, question, category }) => (
                    <motion.li
                      key={id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="border rounded-xl p-6 bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => router.push(`/learn10/${id}`)}
                    >
                      <div className="flex flex-col">
                        <Link
                          href={`/learn10/${id}`}
                          className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {id}. {question}
                        </Link>
                        <div className="flex items-center mt-2">
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={categoryVariants}
                            custom={category}
                            className="cursor-pointer"
                            whileHover={{ scale: 0.98 }}
                          >
                            <span
                              className="px-3 py-1 rounded-full text-sm font-medium"
                              style={{
                                backgroundColor: getCategoryColor(category).bg,
                                color: getCategoryColor(category).text,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCategory(category);
                                setPage(1);
                              }}
                            >
                              {category}
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    </motion.li>
                  ))
                )}
              </ul>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-slate-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200"
                          onClick={() => handleSort("question")}
                        >
                          <div className="flex items-center gap-2">
                            Title
                            {sortColumn === "question" && sortDirection && (
                              sortDirection === "asc" ? (
                                <ChevronUpIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                              ) : (
                                <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                              )
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200"
                          onClick={() => handleSort("category")}
                        >
                          <div className="flex items-center gap-2">
                            Category
                            {sortColumn === "category" && sortDirection && (
                              sortDirection === "asc" ? (
                                <ChevronUpIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                              ) : (
                                <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                              )
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-12"
                        >
                          Article
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {paginated.length === 0 ? (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-lg"
                          >
                            No questions found. Try adjusting your filters.
                          </td>
                        </tr>
                      ) : (
                        paginated.map((question) => (
                          <motion.tr
                            key={question.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="hover:bg-gray-50 dark:hover:bg-slate-900 transition-all duration-200"
                          >
                            <td className="px-4 py-4 text-sm">
                              <Link
                                href={`/learn10/${question.id}`}
                                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                              >
                                {question.id}. {question.question}
                              </Link>
                            </td>
                            <td className="px-4 py-4">
                              <button
                                onClick={() => {
                                  setCategory(question.category);
                                  setPage(1);
                                  updateQuery({ ...router.query, category: question.category });
                                }}
                                className="px-3 py-1 rounded-full text-sm font-medium"
                                style={{
                                  backgroundColor: getCategoryColor(question.category).bg,
                                  color: getCategoryColor(question.category).text,
                                }}
                              >
                                {question.category}
                              </button>
                            </td>
                            <td className="px-4 py-4 w-12">
                              <Link
                                href={`/learn10/${question.id}`}
                                className="inline-flex justify-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-all duration-200 w-full"
                                aria-label={`View article for ${question.question}`}
                              >
                                <DocumentTextIcon className="w-5 h-5" />
                              </Link>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>

          {/* Category Sidebar (Desktop) */}
          <aside className="w-full lg:w-1/4 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden sticky top-6 max-h-[calc(100vh-3rem)]"
            >
              <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Categories
                </h3>
              </div>
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
                <ul className="space-y-3">
                  {CATEGORIES.map((cat) => (
                    <li key={cat}>
                      <Link
                        href={`/learn10${cat === "All" ? "" : `?category=${encodeURIComponent(cat)}`}`}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline flex justify-between items-center text-base"
                        onClick={() => {
                          setCategory(cat === "All" ? "" : cat);
                          setPage(1);
                        }}
                      >
                        <span>{cat}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          ({cat === "All" ? questions.length : questions.filter((q) => getCategory(q.id) === cat).length})
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </aside>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span>
                Showing {(page - 1) * perPage + 1} to{" "}
                {Math.min(page * perPage, sortedQuestions.length)} of{" "}
                {sortedQuestions.length} questions
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm"
                aria-label="Previous page"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium transition-all duration-200 shadow-sm ${
                        p === page
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
              </div>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm"
                aria-label="Next page"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Category Section (Mobile) */}
        <div className="mt-8 lg:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Categories
              </h3>
            </div>
            <div className="px-6 py-4 overflow-y-auto max-h-96">
              <ul className="space-y-3">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <Link
                      href={`/learn10${cat === "All" ? "" : `?category=${encodeURIComponent(cat)}`}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex justify-between items-center text-base"
                      onClick={() => {
                        setCategory(cat === "All" ? "" : cat);
                        setPage(1);
                      }}
                    >
                      <span>{cat}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        ({cat === "All" ? questions.length : questions.filter((q) => getCategory(q.id) === cat).length})
                      </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </main>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const userAgent = req.headers["user-agent"] || "";
  const isMobile = /mobile/i.test(userAgent);
  return {
    props: {
      initialViewMode: isMobile ? "list" : "table",
    },
  };
}