import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import dailyTerms from "../../data/daily_terms.json";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../../components/Layout";
import Head from "next/head";
import DOMPurify from "isomorphic-dompurify";
import { toast, Toaster } from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  DocumentTextIcon,
  TableCellsIcon,
  ListBulletIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";

// Helper to format date as YYYY-MM-DD in local timezone
const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function DailyTerms({ initialViewMode = "table" }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [perPage, setPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isPerPageOpen, setIsPerPageOpen] = useState(false);
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [userToggledView, setUserToggledView] = useState(false);

  const dateRef = useRef(null);
  const perPageRef = useRef(null);

  // Today's date in YYYY-MM-DD for filtering
  const today = formatLocalDate(new Date());

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setIsDateOpen(false);
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

  // Handle date query parameter
  useEffect(() => {
    if (router.query.date) {
      const queryDate = decodeURIComponent(router.query.date);
      if (dailyTerms.some((t) => t.date === queryDate && t.date <= today)) {
        setSelectedDate(queryDate);
        setPage(1);
      } else {
        setSelectedDate("");
      }
    } else {
      setSelectedDate("");
    }
  }, [router.query.date, today]);

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
    let result = dailyTerms.filter((t) => t.date <= today); // Exclude future dates
    if (search) {
      result = result.filter(
        (t) =>
          t.term.toLowerCase().includes(search.toLowerCase()) ||
          t.shortExplanation.toLowerCase().includes(search.toLowerCase()) ||
          t.date.includes(search)
      );
    }
    if (selectedDate) {
      result = result.filter((t) => t.date === selectedDate);
    }
    return result;
  }, [search, selectedDate, today]);

  const sortedTerms = useMemo(() => {
    if (!sortColumn || !sortDirection) {
      return [...filtered];
    }
    return [...filtered].sort((a, b) => {
      if (sortColumn === "date") {
        return sortDirection === "asc"
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date);
      }
      return sortDirection === "asc"
        ? a.term.localeCompare(b.term)
        : b.term.localeCompare(a.term);
    });
  }, [filtered, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedTerms.length / perPage);
  const paginated = sortedTerms.slice((page - 1) * perPage, page * perPage);

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
    } else if (filterType === "date") {
      setSelectedDate("");
      setPage(1);
      const newQuery = { ...router.query };
      delete newQuery.date;
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

  const handlePageChange = (newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "list" ? "table" : "list"));
    setUserToggledView(true);
  };

  // Calendar date handling
  const minDate = new Date("2025-04-15T00:00:00Z");
  const maxDate = new Date();
  maxDate.setHours(23, 59, 59, 999); // Include today

  const tileDisabled = ({ date }) => {
    return date < minDate || date > maxDate;
  };

  const handleDateChange = (value) => {
    const formattedDate = formatLocalDate(value); // Use local date
    if (formattedDate <= today) {
      setSelectedDate(formattedDate);
      setPage(1);
      setIsDateOpen(false);
      updateQuery({ ...router.query, date: formattedDate });
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const calendarVariants = {
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

  const canonicalUrl = `https://devexcode.com/daily-term${selectedDate ? `?date=${encodeURIComponent(selectedDate)}` : ""}`;

  return (
    <Layout>
      <Head>
        <title>
          {`Daily Terms - ${search || "All"} Terms | DevExCode`}
        </title>
        <meta
          name="description"
          content={`Explore ${search || "all"} daily technical terms to boost your coding knowledge. Filter by ${selectedDate || "all dates"}.`}
        />
        <meta
          name="keywords"
          content={`daily term, technical term, coding, programming, DevExCode, software development, tech education, ${selectedDate || "all dates"}`}
        />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content={`Daily Terms - ${search || "All"} Terms | DevExCode`}
        />
        <meta
          property="og:description"
          content={`Discover ${search || "all"} daily technical terms with concise explanations.`}
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
          content={`Daily Terms - ${search || "All"} Terms | DevExCode`}
        />
        <meta
          name="twitter:description"
          content={`Learn ${search || "all"} daily technical terms with filters for ${selectedDate || "all dates"}.`}
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
                "name": `Daily Terms ${search || "all"} terms`,
                "description": `Explore ${search || "all"} daily technical terms with concise explanations.`,
                "itemListElement": filtered.slice(0, 10).map((t, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "url": `https://devexcode.com/daily-term/${t.date}`,
                  "name": `${t.date}: ${t.term}`,
                  "description": t.shortExplanation,
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
                placeholder="Search by term or date..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md pr-10 text-sm"
                aria-label="Search daily terms"
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
            <div className="relative w-full sm:w-36 mb-3 sm:mb-0" ref={dateRef}>
              <button
                onClick={() => setIsDateOpen(!isDateOpen)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-left flex justify-between items-center transition-all duration-300 shadow-sm hover:shadow-md text-sm truncate"
                aria-label="Select date"
              >
                <span className="truncate">{selectedDate || "Date"}</span>
                <span className="flex-shrink-0 w-4 h-4">
                  {selectedDate ? (
                    <XMarkIcon
                      className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFilter("date");
                      }}
                      aria-label="Clear date filter"
                    />
                  ) : (
                    <svg
                      className={`w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-transform ${isDateOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 24 24"
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
                {isDateOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 mt-2 w-full rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-gray-300 dark:border-gray-600 overflow-hidden p-4"
                  >
                    <Calendar
                      onChange={handleDateChange}
                      value={selectedDate ? new Date(`${selectedDate}T00:00:00Z`) : new Date()}
                      minDate={minDate}
                      maxDate={maxDate}
                      tileDisabled={tileDisabled}
                      className="border-none bg-transparent text-gray-900 dark:text-white w-full"
                      tileClassName={({ date }) =>
                        date.toISOString().split("T")[0] === selectedDate
                          ? "bg-indigo-700 text-white rounded-full"
                          : date.toDateString() === new Date().toDateString()
                          ? "border-2 border-indigo-700 dark:border-indigo-400 text-indigo-700 dark:text-indigo-400 rounded-full"
                          : ""
                      }
                      aria-label="Select a date to filter daily terms"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:w-36">
                <button
                  onClick={() => setIsPerPageOpen(!isPerPageOpen)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-left flex justify-between items-center transition-all duration-300 shadow-sm hover:shadow-md text-sm truncate"
                  aria-label="Select terms per page"
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
                        aria-label="Reset terms per page"
                      />
                    ) : (
                      <svg
                        className={`w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-transform ${isPerPageOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 24 24"
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
          {/* Term List/Table */}
          <div className="w-full lg:w-3/4">
            {viewMode === "list" ? (
              <ul className="space-y-6">
                {paginated.length === 0 ? (
                  <li className="text-center text-gray-500 dark:text-gray-400 py-10 text-lg">
                    No terms found. Try adjusting your filters.
                  </li>
                ) : (
                  paginated.map(({ date, term, shortExplanation }) => (
                    <motion.li
                      key={date}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="border rounded-xl p-6 bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => router.push(`/daily-term/${date}`)}
                    >
                      <div className="flex flex-col">
                        <Link
                          href={`/daily-term/${date}`}
                          className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {term}
                        </Link>
                        <p className="text-gray-600 dark:text-gray-200 text-sm mb-2">
                          {shortExplanation}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Date: {date}
                        </p>
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
                          onClick={() => handleSort("date")}
                        >
                          <div className="flex items-center gap-2">
                            Date
                            {sortColumn === "date" && sortDirection && (
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
                          onClick={() => handleSort("term")}
                        >
                          <div className="flex items-center gap-2">
                            Term
                            {sortColumn === "term" && sortDirection && (
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
                          Short Explanation
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-12"
                        >
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {paginated.length === 0 ? (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-lg"
                          >
                            No terms found. Try adjusting your filters.
                          </td>
                        </tr>
                      ) : (
                        paginated.map((term) => (
                          <motion.tr
                            key={term.date}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="hover:bg-gray-50 dark:hover:bg-slate-900 transition-all duration-200"
                          >
                            <td className="px-4 py-4 text-sm">{term.date}</td>
                            <td className="px-4 py-4 text-sm">
                              <Link
                                href={`/daily-term/${term.date}`}
                                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                              >
                                {term.term}
                              </Link>
                            </td>
                            <td className="px-4 py-4 text-sm">{term.shortExplanation}</td>
                            <td className="px-4 py-4 w-12">
                              <Link
                                href={`/daily-term/${term.date}`}
                                className="inline-flex justify-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-all duration-200 w-full"
                                aria-label={`View details for ${term.term}`}
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

          {/* Calendar Sidebar (Desktop) */}
          <aside className="w-full lg:w-1/4 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden sticky top-6 max-h-[calc(100vh-3rem)]"
            >
              <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Select Date
                </h3>
              </div>
              <div className="px-6 py-4">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate ? new Date(`${selectedDate}T00:00:00Z`) : new Date()}
                  minDate={minDate}
                  maxDate={maxDate}
                  tileDisabled={tileDisabled}
                  className="border-none bg-transparent text-gray-900 dark:text-white w-full"
                  tileClassName={({ date }) =>
                    formatLocalDate(date) === selectedDate
                      ? "bg-indigo-700 text-white rounded-full"
                      : formatLocalDate(date) === today
                      ? "border-2 border-indigo-700 dark:border-indigo-400 text-indigo-700 dark:text-indigo-400 rounded-full"
                      : ""
                  }
                  aria-label="Select a date to view the daily term"
                />
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
                {Math.min(page * perPage, sortedTerms.length)} of{" "}
                {sortedTerms.length} terms
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

        {/* Calendar Section (Mobile) */}
        <div className="mt-8 lg:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                Select Date
              </h3>
            </div>
            <div className="px-6 py-4">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate ? new Date(`${selectedDate}T00:00:00Z`) : new Date()}
                minDate={minDate}
                maxDate={maxDate}
                tileDisabled={tileDisabled}
                className="border-none bg-transparent text-gray-900 dark:text-white w-full"
                tileClassName={({ date }) =>
                  formatLocalDate(date) === selectedDate
                    ? "bg-indigo-700 text-white rounded-full"
                    : formatLocalDate(date) === today
                    ? "border-2 border-indigo-700 dark:border-indigo-400 text-indigo-700 dark:text-indigo-400 rounded-full"
                    : ""
                }
                aria-label="Select a date to view the daily term"
              />
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