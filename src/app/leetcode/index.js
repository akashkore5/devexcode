import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import problems from "../../data/problems.json";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../../components/Layout";
import Head from "next/head";
import DOMPurify from "isomorphic-dompurify";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  DocumentTextIcon,
  TableCellsIcon,
  ListBulletIcon,
  CheckCircleIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";

export default function Leetcode({ initialViewMode = "table" }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tag, setTag] = useState("");
  const [perPage, setPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [isPerPageOpen, setIsPerPageOpen] = useState(false);
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [userToggledView, setUserToggledView] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [taggedProblems, setTaggedProblems] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const difficultyRef = useRef(null);
  const tagRef = useRef(null);
  const perPageRef = useRef(null);

  // Fetch user's progress
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchProgress = async () => {
      try {
        const response = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "leetcode", action: "all" }),
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        if (!data || typeof data !== "object") throw new Error("Invalid API response");
        const solved = (data.solved || []).map(Number);
        const tagged = (data.tagged || []).map(Number);
        setSolvedProblems(solved);
        setTaggedProblems(tagged);
      } catch (error) {
        console.error("Error fetching progress:", error);
        toast.error("Failed to load progress");
      }
    };

    fetchProgress();
  }, [status]);

  // Handle tag query parameter
  useEffect(() => {
    if (router.query.tag) {
      const queryTag = decodeURIComponent(router.query.tag);
      setTag(queryTag);
      setPage(1);
    } else {
      setTag("");
    }
  }, [router.query.tag]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (difficultyRef.current && !difficultyRef.current.contains(event.target)) setIsDifficultyOpen(false);
      if (tagRef.current && !tagRef.current.contains(event.target)) setIsTagOpen(false);
      if (perPageRef.current && !perPageRef.current.contains(event.target)) setIsPerPageOpen(false);
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

  const updateQuery = (newQuery) => {
    router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
  };

  const allTags = useMemo(() => {
    const tags = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
    return ["All", ...Array.from(tags).sort()];
  }, []);

  const tagCounts = useMemo(() => {
    const counts = {};
    problems.forEach((p) => p.tags?.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    return counts;
  }, []);

  const filtered = useMemo(() => {
    let result = problems;
    if (search) {
      result = result.filter(
        (p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.id.toString() === search
      );
    }
    if (difficulty && difficulty !== "All") result = result.filter((p) => p.difficulty === difficulty);
    if (tag && tag !== "All") result = result.filter((p) => p.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()));
    return result;
  }, [search, difficulty, tag]);

  const sortedProblems = useMemo(() => {
    if (!sortColumn || !sortDirection) return [...filtered];
    return [...filtered].sort((a, b) => {
      if (sortColumn === "title") {
        return sortDirection === "asc" ? Number(a.id) - Number(b.id) : Number(b.id) - Number(a.id);
      }
      return sortDirection === "asc"
        ? String(a.difficulty).localeCompare(String(b.difficulty))
        : String(b.difficulty).localeCompare(String(a.difficulty));
    });
  }, [filtered, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedProblems.length / perPage);
  const paginated = sortedProblems.slice((page - 1) * perPage, page * perPage);

  const handleSort = (column) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      } else setSortDirection("asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const clearFilter = (filterType) => {
    if (filterType === "search") {
      setSearch("");
      setPage(1);
    } else if (filterType === "difficulty") {
      setDifficulty("");
      setPage(1);
      const newQuery = { ...router.query };
      delete newQuery.difficulty;
      updateQuery(newQuery);
    } else if (filterType === "tag") {
      setTag("");
      setPage(1);
      const newQuery = { ...router.query };
      delete newQuery.tag;
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return { bg: "#34D399", text: "#1A3C34" };
      case "Medium":
        return { bg: "#FBBF24", text: "#3F2A00" };
      case "Hard":
        return { bg: "#EF4444", text: "#3C0F0F" };
      default:
        return { bg: "#E5E7EB", text: "#1F2937" };
    }
  };

  const handlePageChange = (newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "list" ? "table" : "list"));
    setUserToggledView(true);
  };

  const handleMarkSolved = useCallback(
    async (id, isSolved) => {
      if (status !== "authenticated") {
        setIsLoginModalOpen(true);
        return;
      }
      const numericId = Number(id);
      try {
        const response = await fetch("/api/user/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "leetcode",
            action: "solved",
            id: numericId,
            remove: isSolved,
          }),
        });
        if (response.ok) {
          setSolvedProblems((prev) =>
            isSolved ? prev.filter((pid) => pid !== numericId) : [...prev, numericId]
          );
          toast.success(isSolved ? "Problem unmarked as solved" : "Problem marked as solved");
        } else toast.error("Failed to update solved status");
      } catch (error) {
        console.error("Error updating solved status:", error);
        toast.error("An error occurred");
      }
    },
    [status]
  );

  const handleTagProblem = useCallback(
    async (id, isTagged) => {
      if (status !== "authenticated") {
        setIsLoginModalOpen(true);
        return;
      }
      const numericId = Number(id);
      try {
        const response = await fetch("/api/user/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "leetcode",
            action: "tagged",
            id: numericId,
            remove: isTagged,
          }),
        });
        if (response.ok) {
          setTaggedProblems((prev) =>
            isTagged ? prev.filter((pid) => pid !== numericId) : [...prev, numericId]
          );
          toast.success(isTagged ? "Problem untagged" : "Problem tagged");
        } else toast.error("Failed to update tag status");
      } catch (error) {
        console.error("Error updating tag status:", error);
        toast.error("An error occurred");
      }
    },
    [status]
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const difficultyVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5, type: "spring", stiffness: 100 } },
  };

  const iconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2 },
    tap: { scale: 0.9 },
  };

  // Generate canonical URL dynamically
  const canonicalUrl = `https://devexcode.com/leetcode${tag ? `?tag=${encodeURIComponent(tag)}` : ""}`;

  // Structured Data with FAQ
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Leetcode Solutions | DevExCode",
    "description": "Explore optimized Leetcode solutions in Java, Python, and C++ with detailed explanations. Filter by difficulty, topic, or problem ID.",
    "url": canonicalUrl,
    "mainEntity": [
      {
        "@type": "ItemList",
        "name": `Leetcode ${search || "All"} Problems`,
        "itemListElement": filtered.slice(0, 10).map((p, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `https://devexcode.com/leetcode/${p.id}-${p.title.toLowerCase().replace(/\s+/g, "-")}`,
          "name": `${p.id}. ${p.title}`,
          "description": `Difficulty: ${p.difficulty}, Tags: ${p.tags?.join(", ") || "None"}`,
        })),
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are Leetcode solutions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Leetcode solutions on DevExCode provide detailed explanations and optimized code in Java, Python, and C++ for Leetcode problems, helping you prepare for coding interviews."
            }
          },
          {
            "@type": "Question",
            "name": "How to filter Leetcode problems by difficulty?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use the difficulty dropdown on the DevExCode Leetcode page to select Easy, Medium, or Hard problems, or search by problem ID or title."
            }
          },
          {
            "@type": "Question",
            "name": "Can I practice Leetcode problems on DevExCode?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, DevExCode offers an interactive code editor for each Leetcode problem, allowing you to write, test, and run code in Java, Python, or C++."
            }
          }
        ]
      }
    ],
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://devexcode.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Leetcode Solutions",
          "item": "https://devexcode.com/leetcode"
        }
      ]
    }
  };

  return (
    <Layout isLoginModalOpen={isLoginModalOpen} setIsLoginModalOpen={setIsLoginModalOpen}>
      <Head>
        <title>Leetcode Solutions in Java, Python, C++ | DevExCode</title>
        <meta
          name="description"
          content="Discover optimized Leetcode solutions in Java, Python, and C++ with detailed explanations. Filter by difficulty (Easy, Medium, Hard), topic, or problem ID to ace your coding interviews."
        />
        <meta
          name="keywords"
          content="Leetcode, Leetcode solutions, Leetcode Java, Leetcode Python, Leetcode C++, coding interview, algorithms, data structures, programming tutorials"
        />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Leetcode Solutions in Java, Python, C++ | DevExCode" />
        <meta
          property="og:description"
          content="Explore optimized Leetcode solutions with code and explanations in Java, Python, and C++. Filter by difficulty or topic for coding interview prep."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://devexcode.com/og-image-leetcode.jpg" />
        <meta property="og:image:alt" content="Leetcode solutions preview on DevExCode" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Leetcode Solutions in Java, Python, C++ | DevExCode" />
        <meta
          name="twitter:description"
          content="Level up your coding skills with Leetcode solutions in Java, Python, and C++ on DevExCode."
        />
        <meta name="twitter:image" content="https://devexcode.com/og-image-leetcode.jpg" />
        <meta name="twitter:image:alt" content="Leetcode solutions preview" />
        <meta name="twitter:creator" content="@DevExCode" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="sitemap" href="/sitemap.xml" />
        <meta name="theme-color" content="#4f46e5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(JSON.stringify(structuredData)),
          }}
        />
      </Head>
      <Toaster />
      <main className="flex-grow max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        {/* Intro Section */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Leetcode Solutions Hub
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            Master Leetcode problems with our comprehensive solutions in Java, Python, and C++. Filter by difficulty, topic, or search by problem ID or title to find optimized code and detailed explanations for your coding interview preparation.
          </p>
        </section>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <div className="relative flex-grow min-w-[150px] mb-3 sm:mb-0">
              <input
                type="text"
                placeholder="Search Leetcode problems by title or ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md pr-10 text-sm"
                aria-label="Search Leetcode problems"
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
            <div className="relative w-full sm:w-36 mb-3 sm:mb-0" ref={difficultyRef}>
              <button
                onClick={() => setIsDifficultyOpen(!isDifficultyOpen)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-left flex justify-between items-center transition-all duration-300 shadow-sm hover:shadow-md text-sm truncate"
                aria-label="Select Leetcode difficulty"
              >
                <span className="truncate">{truncateText(difficulty || "Difficulty")}</span>
                <span className="flex-shrink-0 w-4 h-4">
                  {difficulty ? (
                    <XMarkIcon
                      className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFilter("difficulty");
                      }}
                      aria-label="Clear difficulty filter"
                    />
                  ) : (
                    <svg
                      className={`w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-transform ${isDifficultyOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
              </button>
              <AnimatePresence>
                {isDifficultyOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 mt-2 w-full rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-gray-300 dark:border-gray-600 overflow-hidden"
                  >
                    {["All", "Easy", "Medium", "Hard"].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setDifficulty(option === "All" ? "" : option);
                          setPage(1);
                          setIsDifficultyOpen(false);
                          if (option !== "All") updateQuery({ ...router.query, difficulty: option });
                          else {
                            const newQuery = { ...router.query };
                            delete newQuery.difficulty;
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
            <div className="relative w-full sm:w-36 mb-3 sm:mb-0" ref={tagRef}>
              <button
                onClick={() => setIsTagOpen(!isTagOpen)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-left flex justify-between items-center transition-all duration-300 shadow-sm hover:shadow-md text-sm truncate"
                aria-label="Select Leetcode topic"
              >
                <span className="truncate">{truncateText(tag || "Topics")}</span>
                <span className="flex-shrink-0 w-4 h-4">
                  {tag ? (
                    <XMarkIcon
                      className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFilter("tag");
                      }}
                      aria-label="Clear topic filter"
                    />
                  ) : (
                    <svg
                      className={`w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-transform ${isTagOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
              </button>
              <AnimatePresence>
                {isTagOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 mt-2 w-full rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-gray-300 dark:border-gray-600 overflow-y-auto max-h-60"
                  >
                    {allTags.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTag(t === "All" ? "" : t);
                          setPage(1);
                          setIsTagOpen(false);
                          if (t !== "All") updateQuery({ ...router.query, tag: t });
                          else {
                            const newQuery = { ...router.query };
                            delete newQuery.tag;
                            updateQuery(newQuery);
                          }
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200"
                      >
                        {t}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:w-36" ref={perPageRef}>
                <button
                  onClick={() => setIsPerPageOpen(!isPerPageOpen)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-left flex justify-between items-center transition-all duration-300 shadow-sm hover:shadow-md text-sm truncate"
                  aria-label="Select problems per page"
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
                        aria-label="Reset problems per page"
                      />
                    ) : (
                      <svg
                        className={`w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-transform ${isPerPageOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
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
              className="p-2 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm w-10 h-10 flex items-center justify-center flex-shrink-0"
              aria-label={`Switch to ${viewMode === "list" ? "table" : "list"} view`}
            >
              {viewMode === "list" ? <TableCellsIcon className="w-5 h-5" /> : <ListBulletIcon className="w-5 h-5" />}
            </button>
          </div>
          </div>
        </motion.div>

        {/* Main Content and Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Problem List/Table */}
          <div className="w-full lg:w-3/4">
            {viewMode === "list" ? (
              <ul className="space-y-6">
                {paginated.length === 0 ? (
                  <li className="text-center text-gray-500 dark:text-gray-400 py-10 text-lg">
                    No Leetcode problems found. Try adjusting your filters.
                  </li>
                ) : (
                  paginated.map(({ id, title, difficulty: diff, tags }) => (
                    <motion.li
                      key={id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="border rounded-xl p-6 bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transition cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => router.push(`/leetcode/${id}-${title.toLowerCase().replace(/\s+/g, "-")}`)}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/leetcode/${id}-${title.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {id}. {title}
                          </Link>
                          <motion.button
                            variants={iconVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkSolved(id, solvedProblems.includes(Number(id)));
                            }}
                            className={`rounded-full p-1 ${solvedProblems.includes(Number(id)) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                            aria-label={solvedProblems.includes(Number(id)) ? "Unmark as solved" : "Mark as solved"}
                          >
                            <CheckCircleIcon className="w-6 h-6" />
                          </motion.button>
                        </div>
                        <div className="mt-2">
                          <motion.div initial="hidden" animate="visible" variants={difficultyVariants} className="cursor-pointer" whileHover={{ scale: 0.98 }}>
                            <span
                              className="px-3 py-1 rounded-full text-sm font-medium"
                              style={{ backgroundColor: getDifficultyColor(diff).bg, color: getDifficultyColor(diff).text }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDifficulty(diff);
                                setPage(1);
                              }}
                            >
                              {diff}
                            </span>
                          </motion.div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {tags?.map((t, i) => (
                            <Link
                              key={i}
                              href={`/leetcode?tag=${encodeURIComponent(t)}`}
                              className="text-sm bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPage(1);
                              }}
                            >
                              {t}
                            </Link>
                          ))}
                        </div>
                        <div className="flex gap-3 mt-4">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkSolved(id, solvedProblems.includes(Number(id)));
                            }}
                            className={`flex items-center px-4 py-2 rounded-lg shadow-md text-white transition-transform duration-200 ${solvedProblems.includes(Number(id)) ? "bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900" : "bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-800 dark:to-gray-900"}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={solvedProblems.includes(Number(id)) ? "Unmark as solved" : "Mark as solved"}
                          >
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                            Solved
                          </motion.button>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTagProblem(id, taggedProblems.includes(Number(id)));
                            }}
                            className={`flex items-center px-4 py-2 rounded-lg shadow-md text-white transition-transform duration-200 ${taggedProblems.includes(Number(id)) ? "bg-gradient-to-r from-pink-600 to-pink-700 dark:from-pink-800 dark:to-pink-900" : "bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-800 dark:to-gray-900"}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={taggedProblems.includes(Number(id)) ? "Untag problem" : "Tag problem"}
                          >
                            <HeartIcon className="w-5 h-5 mr-2" />
                            Tag
                          </motion.button>
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
                        <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-12">
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200"
                          onClick={() => handleSort("title")}
                        >
                          <div className="flex items-center gap-2">
                            Title
                            {sortColumn === "title" && sortDirection && (
                              sortDirection === "asc" ? <ChevronUpIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" /> : <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200"
                          onClick={() => handleSort("difficulty")}
                        >
                          <div className="flex items-center gap-2">
                            Difficulty
                            {sortColumn === "difficulty" && sortDirection && (
                              sortDirection === "asc" ? <ChevronUpIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" /> : <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Topics
                        </th>
                        <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-12">
                          Tag/Like
                        </th>
                        <th scope="col" className="px-4 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-12">
                          Article
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {paginated.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-lg">
                            No Leetcode problems found. Try adjusting your filters.
                          </td>
                        </tr>
                      ) : (
                        paginated.map((problem) => (
                          <motion.tr
                            key={problem.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="hover:bg-gray-50 dark:hover:bg-slate-900 transition-all duration-200"
                          >
                            <td className="px-4 py-4 w-12">
                              <motion.button
                                variants={iconVariants}
                                initial="initial"
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => handleMarkSolved(problem.id, solvedProblems.includes(Number(problem.id)))}
                                className={`rounded-full p-1 ${solvedProblems.includes(Number(problem.id)) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                                aria-label={solvedProblems.includes(Number(problem.id)) ? "Unmark as solved" : "Mark as solved"}
                              >
                                <CheckCircleIcon className="w-6 h-6" />
                              </motion.button>
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <Link href={`/leetcode/${problem.id}-${problem.title.toLowerCase().replace(/\s+/g, "-")}`} className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                                {problem.id}. {problem.title}
                              </Link>
                            </td>
                            <td className="px-4 py-4">
                              <button
                                onClick={() => {
                                  setDifficulty(problem.difficulty);
                                  setPage(1);
                                  updateQuery({ ...router.query, difficulty: problem.difficulty });
                                }}
                                className={`inline-block text-center px-1.5 py-1 rounded-lg text-xs font-medium border transition-all duration-200 truncate max-w-[80px] sm:max-w-[60px] whitespace-nowrap`}
                                style={{ backgroundColor: getDifficultyColor(problem.difficulty).bg, color: getDifficultyColor(problem.difficulty).text }}
                                title={problem.difficulty}
                                aria-label={`Filter by ${problem.difficulty} difficulty`}
                              >
                                {problem.difficulty}
                              </button>
                            </td>
                            <td className="px-4 py-4 min-w-[150px] max-w-[250px]">
                              <div className="flex flex-wrap gap-2 sm:gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600" aria-label="Leetcode problem tags">
                                {problem.tags?.map((t) => (
                                  <Link
                                    key={t}
                                    href={`/leetcode?tag=${encodeURIComponent(t)}`}
                                    className={`inline-block text-center px-1 py-0.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 border border-gray-200 dark:border-gray-600 transition-all duration-200 truncate max-w-[100px] sm:max-w-[60px] whitespace-nowrap ${t.length > 15 ? "text-[10px]" : ""}`}
                                    onClick={() => setPage(1)}
                                    title={t}
                                    aria-label={`Filter by ${t} tag`}
                                  >
                                    {t}
                                  </Link>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-4 w-12">
                              <motion.button
                                variants={iconVariants}
                                initial="initial"
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => handleTagProblem(problem.id, taggedProblems.includes(Number(problem.id)))}
                                className={`p-1 ${taggedProblems.includes(Number(problem.id)) ? "text-pink-500" : "text-gray-400"}`}
                                aria-label={taggedProblems.includes(Number(problem.id)) ? "Untag problem" : "Tag problem"}
                              >
                                <HeartIcon className="w-6 h-6" />
                              </motion.button>
                            </td>
                            <td className="px-4 py-4 w-12">
                              <Link
                                href={`/leetcode/${problem.id}-${problem.title.toLowerCase().replace(/\s+/g, "-")}`}
                                className="inline-flex justify-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-all duration-200 w-full"
                                aria-label={`View Leetcode solution for ${problem.title}`}
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

          {/* Tag Sidebar (Desktop) */}
          <aside className="w-full lg:w-1/4 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden sticky top-6 max-h-[calc(100vh-3rem)]"
            >
              <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Popular Leetcode Topics</h2>
              </div>
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
                <ul className="space-y-3">
                  {allTags.map(
                    (t) =>
                      t !== "All" && (
                        <li key={t}>
                          <Link
                            href={`/leetcode?tag=${encodeURIComponent(t)}`}
                            className="text-indigo-600 dark:text-indigo-400 hover:underline flex justify-between items-center text-base"
                            onClick={() => {
                              setTag(t);
                              setPage(1);
                            }}
                          >
                            <span>{t}</span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">({tagCounts[t] || 0})</span>
                          </Link>
                        </li>
                      )
                  )}
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
                Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, sortedProblems.length)} of {sortedProblems.length} Leetcode problems
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
                      className={`px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium transition-all duration-200 shadow-sm ${p === page ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"}`}
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

        {/* Tag Section (Mobile) */}
        <div className="mt-8 lg:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Popular Leetcode Topics</h2>
            </div>
            <div className="px-6 py-4 overflow-y-auto max-h-96">
              <ul className="space-y-3">
                {allTags.map(
                  (t) =>
                    t !== "All" && (
                      <li key={t}>
                        <Link
                          href={`/leetcode?tag=${encodeURIComponent(t)}`}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline flex justify-between items-center text-base"
                          onClick={() => {
                            setTag(t);
                            setPage(1);
                          }}
                        >
                          <span>{t}</span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">({tagCounts[t] || 0})</span>
                        </Link>
                      </li>
                    )
                )}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                What are Leetcode solutions?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Leetcode solutions on DevExCode provide detailed explanations and optimized code in Java, Python, and C++ for Leetcode problems, helping you prepare for coding interviews.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                How to filter Leetcode problems by difficulty?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Use the difficulty dropdown on this page to select Easy, Medium, or Hard problems, or search by problem ID or title to find specific Leetcode challenges.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Can I practice Leetcode problems on DevExCode?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes, DevExCode offers an interactive code editor for each Leetcode problem, allowing you to write, test, and run code in Java, Python, or C++ directly on the site.
              </p>
            </div>
          </div>
        </section>
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