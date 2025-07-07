'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import problems from "../../data/problems.json";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
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

// Helper to generate URL-friendly slug from title
const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};

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

export default function LeetcodePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tag, setTag] = useState("");
  const [perPage, setPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<string | null>(null);
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [isPerPageOpen, setIsPerPageOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [userToggledView, setUserToggledView] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState<number[]>([]);
  const [taggedProblems, setTaggedProblems] = useState<number[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const difficultyRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const perPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProgress();
    }
  }, [status]);

  useEffect(() => {
    const queryTag = new URLSearchParams(window.location.search).get('tag');
    if (queryTag) {
      setTag(decodeURIComponent(queryTag));
      setPage(1);
    } else {
      setTag("");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (difficultyRef.current && !difficultyRef.current.contains(event.target as Node)) setIsDifficultyOpen(false);
      if (tagRef.current && !tagRef.current.contains(event.target as Node)) setIsTagOpen(false);
      if (perPageRef.current && !perPageRef.current.contains(event.target as Node)) setIsPerPageOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProgress = useCallback(async () => {
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
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    problems.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
    return ["All", ...Array.from(tags).sort()];
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

  const handleSort = (column: string) => {
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

  const clearFilter = (filterType: string) => {
    if (filterType === "search") setSearch("");
    if (filterType === "difficulty") setDifficulty("");
    if (filterType === "tag") setTag("");
    if (filterType === "perPage") setPerPage(15);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const handleMarkAction = async (id: string, action: 'solved' | 'tagged') => {
    if (status !== 'authenticated') {
      setIsLoginModalOpen(true);
      return;
    }
    const numericId = Number(id);
    const currentSet = action === 'solved' ? solvedProblems : taggedProblems;
    const isCompleted = currentSet.includes(numericId);

    try {
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'leetcode', action, id: numericId, remove: isCompleted }),
      });
      if (response.ok) {
        const updater = action === 'solved' ? setSolvedProblems : setTaggedProblems;
        updater((prev) => (isCompleted ? prev.filter((pid) => pid !== numericId) : [...prev, numericId]));
        toast.success(`Problem ${isCompleted ? 'un' : ''}${action}!`);
      } else {
        toast.error('Failed to update status.');
      }
    } catch (error) {
      console.error(`Error updating ${action} status:`, error);
      toast.error('An error occurred.');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Hard": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
      <>
      <Head>
        <title>LeetCode Solutions - DevExCode</title>
        <meta name="description" content="Explore LeetCode solutions with filters and progress tracking."/>
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">LeetCode Problems</h1>
        
        <div className="flex justify-end mb-4">
          <button onClick={() => setViewMode(viewMode === 'list' ? 'table' : 'list')} className="p-2 rounded-lg bg-gray-200 dark:bg-slate-700">
            {viewMode === 'list' ? <TableCellsIcon className="w-5 h-5" /> : <ListBulletIcon className="w-5 h-5" />}
          </button>
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("title")}>Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("difficulty")}>Difficulty</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Topics</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {paginated.map(problem => (
                  <motion.tr key={problem.id} variants={cardVariants} initial="hidden" animate="visible">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className={`w-5 h-5 ${solvedProblems.includes(Number(problem.id)) ? 'text-green-500' : 'text-gray-400'}`} />
                        <HeartIcon className={`w-5 h-5 ${taggedProblems.includes(Number(problem.id)) ? 'text-pink-500' : 'text-gray-400'}`} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <Link href={`/leetcode/${problem.id}-${generateSlug(problem.title)}`} className="hover:text-primary">{problem.id}. {problem.title}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex flex-wrap gap-1">
                        {problem.tags?.map(t => <span key={t} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded-md text-xs">{t}</span>)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleMarkAction(problem.id, 'solved')} className="text-indigo-600 hover:text-indigo-900 mr-2">Solve</button>
                      <button onClick={() => handleMarkAction(problem.id, 'tagged')} className="text-pink-600 hover:text-pink-900">Tag</button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map(problem => (
              <motion.div key={problem.id} variants={cardVariants} initial="hidden" animate="visible" className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                      <Link href={`/leetcode/${problem.id}-${generateSlug(problem.title)}`} className="hover:text-primary">{problem.id}. {problem.title}</Link>
                    </h3>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <CheckCircleIcon className={`w-4 h-4 ${solvedProblems.includes(Number(problem.id)) ? 'text-green-500' : 'text-gray-400'}`} />
                      <HeartIcon className={`w-4 h-4 ${taggedProblems.includes(Number(problem.id)) ? 'text-pink-500' : 'text-gray-400'}`} />
                    </div>
                  </div>
                  <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {problem.tags?.map(t => <span key={t} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded-md text-xs">{t}</span>)}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button onClick={() => handleMarkAction(problem.id, 'solved')} className="text-xs text-indigo-600 hover:text-indigo-900">Solve</button>
                  <button onClick={() => handleMarkAction(problem.id, 'tagged')} className="text-xs text-pink-600 hover:text-pink-900">Tag</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-between items-center">
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded-lg disabled:opacity-50">Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded-lg disabled:opacity-50">Next</button>
        </div>
      </div>
      </>
  );
}
