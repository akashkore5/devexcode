import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import techBattles from "../../data/tech_battles.json";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../../components/Layout";
import Head from "next/head";
import DOMPurify from "isomorphic-dompurify";
import { useSession } from "next-auth/react";
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
  CheckCircleIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";

export default function TechBattles({ initialViewMode = "table" }) {
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
  const [solvedBattles, setSolvedBattles] = useState([]);
  const [taggedBattles, setTaggedBattles] = useState([]);
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
          body: JSON.stringify({ type: "techbattles", action: "all" }),
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        if (!data || typeof data !== "object") throw new Error("Invalid API response");
        const solved = (data.solved || []).map(Number);
        const tagged = (data.tagged || []).map(Number);
        setSolvedBattles(solved);
        setTaggedBattles(tagged);
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
      if (difficultyRef.current && !difficultyRef.current.contains(event.target)) {
        setIsDifficultyOpen(false);
      }
      if (tagRef.current && !tagRef.current.contains(event.target)) {
        setIsTagOpen(false);
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

  const allTags = useMemo(() => {
    const tags = new Set();
    techBattles.forEach((battle) => battle.tags?.forEach((t) => tags.add(t)));
    return ["All", ...Array.from(tags).sort()];
  }, []);

  const tagCounts = useMemo(() => {
    const counts = {};
    techBattles.forEach((battle) =>
      battle.tags?.forEach((t) => (counts[t] = (counts[t] || 0) + 1))
    );
    return counts;
  }, []);

  const filtered = useMemo(() => {
    let result = techBattles;
    if (search) {
      result = result.filter(
        (battle) =>
          battle.title.toLowerCase().includes(search.toLowerCase()) ||
          battle.id.toString() === search
      );
    }
    if (difficulty && difficulty !== "All") {
      result = result.filter((battle) => battle.difficulty === difficulty);
    }
    if (tag && tag !== "All") {
      result = result.filter((battle) =>
        battle.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
      );
    }
    return result;
  }, [search, difficulty, tag]);

  const sortedBattles = useMemo(() => {
    if (!sortColumn || !sortDirection) {
      return [...filtered];
    }
    return [...filtered].sort((a, b) => {
      if (sortColumn === "title") {
        return sortDirection === "asc"
          ? Number(a.id) - Number(b.id)
          : Number(b.id) - Number(a.id);
      }
      return sortDirection === "asc"
        ? String(a.difficulty).localeCompare(String(b.difficulty))
        : String(b.difficulty).localeCompare(String(a.difficulty));
    });
  }, [filtered, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedBattles.length / perPage);
  const paginated = sortedBattles.slice((page - 1) * perPage, page * perPage);

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
      case "Beginner":
      case "Easy":
        return { bg: "#34D399", text: "#1A3C34" };
      case "Intermediate":
      case "Medium":
        return { bg: "#FBBF24", text: "#3F2A00" };
      case "Advanced":
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
            type: "techbattles",
            action: "solved",
            id: numericId,
            remove: isSolved,
          }),
        });
        if (response.ok) {
          setSolvedBattles((prev) =>
            isSolved
              ? prev.filter((battleId) => battleId !== numericId)
              : [...prev, numericId]
          );
          toast.success(isSolved ? "Battle unmarked as solved" : "Battle marked as solved");
        } else {
          toast.error("Failed to update solved status");
        }
      } catch (error) {
        console.error("Error updating solved status:", error);
        toast.error("An error occurred");
      }
    },
    [status]
  );

  const handleTagBattle = useCallback(
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
            type: "techbattles",
            action: "tagged",
            id: numericId,
            remove: isTagged,
          }),
        });
        if (response.ok) {
          setTaggedBattles((prev) =>
            isTagged
              ? prev.filter((battleId) => battleId !== numericId)
              : [...prev, numericId]
          );
          toast.success(isTagged ? "Battle untagged" : "Battle tagged");
        } else {
          toast.error("Failed to update tag status");
        }
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

  const canonicalUrl = `https://devexcode.com/tech-battles${tag ? `?tag=${encodeURIComponent(tag)}` : ""}`;

  return (
    <Layout
      isLoginModalOpen={isLoginModalOpen}
      setIsLoginModalOpen={setIsLoginModalOpen}
    >
      <Head>
        <title>
          {`Tech Battles - ${search || "All"} Topics | DevCodeEx`}
        </title>
        <meta
          name="description"
          content={`Explore ${search || "all"} tech battles with detailed comparisons, features, and use cases. Filter by ${difficulty || "all difficulties"} and ${tag || "all topics"}.`}
        />
        <meta
          name="keywords"
          content={`tech battles, technology comparison, ${difficulty || "easy medium hard"}, ${tag || "all topics"}, software comparison, technology stack`}
        />
        <meta name="author" content="DevCodeEx Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content={`Tech Battles - ${search || "All"} Topics | DevCodeEx`}
        />
        <meta
          property="og:description"
          content={`Master ${search || "all"} tech battles with in-depth comparisons and insights.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta
          property="og:image"
          content="https://devexcode.com/og-image.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Tech Battles - ${search || "All"} Topics | DevCodeEx`}
        />
        <meta
          name="twitter:description"
          content={`Learn ${search || "all"} tech battles with filters for ${difficulty || "all difficulties"} and ${tag || "all topics"}.`}
        />
        <meta
          name="twitter:image"
          content="https://devexcode.com/twitter-image.jpg"
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
                "name": `Tech Battles ${search || "all"} topics`,
                "description": `Explore ${search || "all"} tech battles with detailed comparisons.`,
                "itemListElement": filtered.slice(0, 10).map((battle, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "url": `https://devexcode.com/tech-battles/${battle.id}`,
                  "name": `${battle.id}. ${battle.title}`,
                  "description": `Difficulty: ${battle.difficulty}, Tags: ${battle.tags?.join(", ") || ""}`,
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
                aria-label="Search tech battles"
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
                aria-label="Select difficulty"
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
                          if (option !== "All") {
                            updateQuery({ ...router.query, difficulty: option });
                          } else {
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
                aria-label="Select topic"
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
                          if (t !== "All") {
                            updateQuery({ ...router.query, tag: t });
                          } else {
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
            <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:w-36" ref={perPageRef}>
                <button
                  onClick={() => setIsPerPageOpen(!isPerPageOpen)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-left flex justify-between items-center transition-all duration-300 shadow-sm hover:shadow-md text-sm truncate"
                  aria-label="Select battles per page"
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
                        aria-label="Reset battles per page"
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
                      className="absolute z-10 mt-2 w integrantefull rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-gray-300 dark:border-gray-600 overflow-hidden"
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
          {/* Battle List/Table */}
          <div className="w-full lg:w-3/4">
            {viewMode === "list" ? (
              <ul className="space-y-6">
                {paginated.length === 0 ? (
                  <li className="text-center text-gray-500 dark:text-gray-400 py-10 text-lg">
                    No tech battles found. Try adjusting your filters.
                  </li>
                ) : (
                  paginated.map(({ id, title, difficulty: diff, tags }) => (
                    <motion.li
                      key={id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="border rounded-xl p-6 bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => router.push(`/tech-battles/${id}`)}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/tech-battles/${id}`}
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
                              handleMarkSolved(id, solvedBattles.includes(Number(id)));
                            }}
                            className={`rounded-full p-1 ${
                              solvedBattles.includes(Number(id))
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                            aria-label={
                              solvedBattles.includes(Number(id))
                                ? "Unmark as solved"
                                : "Mark as solved"
                            }
                          >
                            <CheckCircleIcon className="w-6 h-6" />
                          </motion.button>
                        </div>
                        <div className="flex items-center mt-2">
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={difficultyVariants}
                            custom={diff}
                            className="cursor-pointer"
                            whileHover={{ scale: 0.98 }}
                          >
                            <span
                              className="px-3 py-1 rounded-full text-sm font-medium"
                              style={{
                                backgroundColor: getDifficultyColor(diff).bg,
                                color: getDifficultyColor(diff).text,
                              }}
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
                              href={`/tech-battles?tag=${encodeURIComponent(t)}`}
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
                              handleMarkSolved(id, solvedBattles.includes(Number(id)));
                            }}
                            className={`flex items-center px-4 py-2 rounded-lg shadow-md text-white transition-transform duration-200 ${
                              solvedBattles.includes(Number(id))
                                ? "bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900"
                                : "bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-800 dark:to-gray-900"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={
                              solvedBattles.includes(Number(id))
                                ? "Unmark as solved"
                                : "Mark as solved"
                            }
                          >
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                            Solved
                          </motion.button>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTagBattle(id, taggedBattles.includes(Number(id)));
                            }}
                            className={`flex items-center px-4 py-2 rounded-lg shadow-md text-white transition-transform duration-200 ${
                              taggedBattles.includes(Number(id))
                                ? "bg-gradient-to-r from-pink-600 to-pink-700 dark:from-pink-800 dark:to-pink-900"
                                : "bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-800 dark:to-gray-900"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={
                              taggedBattles.includes(Number(id)) ? "Untag battle" : "Tag battle"
                            }
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
                        <th
                          scope="col"
                          className="px-4 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-12"
                        >
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
                          onClick={() => handleSort("difficulty")}
                        >
                          <div className="flex items-center gap-2">
                            Difficulty
                            {sortColumn === "difficulty" && sortDirection && (
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
                          className="px-4 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Topics
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-12"
                        >
                          Tag/Like
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
                            colSpan="6"
                            className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-lg"
                          >
                            No tech battles found. Try adjusting your filters.
                          </td>
                        </tr>
                      ) : (
                        paginated.map((battle) => (
                          <motion.tr
                            key={battle.id}
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
                                onClick={() =>
                                  handleMarkSolved(
                                    battle.id,
                                    solvedBattles.includes(Number(battle.id))
                                  )
                                }
                                className={`rounded-full p-1 ${
                                  solvedBattles.includes(Number(battle.id))
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-500"
                                }`}
                                aria-label={
                                  solvedBattles.includes(Number(battle.id))
                                    ? "Unmark as solved"
                                    : "Mark as solved"
                                }
                              >
                                <CheckCircleIcon className="w-6 h-6" />
                              </motion.button>
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <Link
                                href={`/tech-battles/${battle.id}`}
                                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                              >
                                {battle.id}. {battle.title}
                              </Link>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-2 sm:gap-1">
                                <button
                                  onClick={() => {
                                    setDifficulty(battle.difficulty);
                                    setPage(1);
                                    updateQuery({ ...router.query, difficulty: battle.difficulty });
                                  }}
                                  className={`inline-block text-center px-1.5 py-1 rounded-lg text-xs font-medium border transition-all duration-200 truncate max-w-[80px] sm:max-w-[60px] overflow-hidden text-overflow-ellipsis whitespace-nowrap`}
                                  style={{
                                    backgroundColor: getDifficultyColor(battle.difficulty).bg,
                                    color: getDifficultyColor(battle.difficulty).text,
                                  }}
                                  title={battle.difficulty}
                                  aria-label={`Filter by ${battle.difficulty} difficulty`}
                                >
                                  {battle.difficulty}
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-4 min-w-[150px] max-w-[250px]">
                              <div
                                className="flex flex-wrap gap-2 sm:gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
                                aria-label="Battle tags"
                              >
                                {battle.tags?.map((t) => (
                                  <Link
                                    key={t}
                                    href={`/tech-battles?tag=${encodeURIComponent(t)}`}
                                    className={`inline-block text-center px-1 py-0.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 border border-gray-200 dark:border-gray-600 transition-all duration-200 truncate max-w-[100px] sm:max-w-[60px] overflow-hidden text-overflow-ellipsis whitespace-nowrap ${
                                      t.length > 15 ? "text-[10px]" : ""
                                    }`}
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
                                onClick={() =>
                                  handleTagBattle(
                                    battle.id,
                                    taggedBattles.includes(Number(battle.id))
                                  )
                                }
                                className={`p-1 ${
                                  taggedBattles.includes(Number(battle.id))
                                    ? "text-pink-500"
                                    : "text-gray-500"
                                }`}
                                aria-label={
                                  taggedBattles.includes(Number(battle.id))
                                    ? "Untag battle"
                                    : "Tag battle"
                                }
                              >
                                <HeartIcon className="w-6 h-6" />
                              </motion.button>
                            </td>
                            <td className="px-4 py-4 w-12">
                              <Link
                                href={`/tech-battles/${battle.id}`}
                                className="inline-flex justify-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-all duration-200 w-full"
                                aria-label={`View article for ${battle.title}`}
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
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Popular Topics
                </h3>
              </div>
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
                <ul className="space-y-3">
                  {allTags.map(
                    (t) =>
                      t !== "All" && (
                        <li key={t}>
                          <Link
                            href={`/tech-battles?tag=${encodeURIComponent(t)}`}
                            className="text-indigo-600 dark:text-indigo-400 hover:underline flex justify-between items-center text-base"
                            onClick={() => {
                              setTag(t);
                              setPage(1);
                            }}
                          >
                            <span>{t}</span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                              ({tagCounts[t] || 0})
                            </span>
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
                Showing {(page - 1) * perPage + 1} to{" "}
                {Math.min(page * perPage, sortedBattles.length)} of{" "}
                {sortedBattles.length} battles
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

        {/* Tag Section (Mobile) */}
        <div className="mt-8 lg:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Popular Topics
              </h3>
            </div>
            <div className="px-6 py-4 overflow-y-auto max-h-96">
              <ul className="space-y-3">
                {allTags.map(
                  (t) =>
                    t !== "All" && (
                      <li key={t}>
                        <Link
                          href={`/tech-battles?tag=${encodeURIComponent(t)}`}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline flex justify-between items-center text-base"
                          onClick={() => {
                            setTag(t);
                            setPage(1);
                          }}
                        >
                          <span>{t}</span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            ({tagCounts[t] || 0})
                          </span>
                        </Link>
                      </li>
                    )
                )}
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