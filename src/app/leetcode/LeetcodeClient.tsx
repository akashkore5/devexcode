'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DataService, Problem } from "@/lib/data-service";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
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
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

// Helper to generate URL-friendly slug from title
const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function LeetcodePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [tag, setTag] = useState("All");
  const [perPage, setPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("table");
  const [solvedProblems, setSolvedProblems] = useState<number[]>([]);
  const [taggedProblems, setTaggedProblems] = useState<number[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [probs, tags] = await Promise.all([
        DataService.getProblems(),
        DataService.getTags()
      ]);
      setProblems(probs);
      setAllTags(["All", ...tags]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProgress();
    }
  }, [status]);

  const fetchProgress = useCallback(async () => {
    try {
      const response = await fetch("/api/user/progress/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "leetcode", action: "all" }),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      setSolvedProblems((data.solved || []).map(Number));
      setTaggedProblems((data.tagged || []).map(Number));
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  }, []);

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.id.toString() === search;
      const matchesDifficulty = difficulty === "All" || p.difficulty === difficulty;
      const matchesTag = tag === "All" || p.tags?.some((t) => t.toLowerCase() === tag.toLowerCase());
      return matchesSearch && matchesDifficulty && matchesTag;
    });
  }, [problems, search, difficulty, tag]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkAction = async (id: string | number, action: 'solved' | 'tagged') => {
    if (status !== 'authenticated') {
      toast.error("Please sign in to track progress");
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
      }
    } catch (error) {
      toast.error('An error occurred.');
    }
  };

  const difficultyColors = {
    Easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Hard: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black gradient-text mb-2">LeetCode Explorer</h1>
          <p className="text-muted-foreground">Master {problems.length} coding challenges with expert solutions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 bg-card border border-border rounded-2xl w-full sm:w-[300px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-xl w-12 h-12"
            onClick={() => setViewMode(viewMode === 'table' ? 'list' : 'table')}
          >
            {viewMode === 'table' ? <ListBulletIcon className="w-5 h-5" /> : <TableCellsIcon className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="glass dark:glass-dark p-6 rounded-3xl border border-white/10 shadow-xl sticky top-32">
            <div className="flex items-center gap-2 mb-6">
              <FunnelIcon className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Filters</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 block">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  {["All", "Easy", "Medium", "Hard"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        difficulty === d ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-card border-border hover:border-primary/50"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 block">Topics</label>
                <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar flex flex-wrap gap-2">
                  {allTags.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTag(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        tag === t ? "bg-primary text-white border-primary" : "bg-card border-border hover:border-primary/50 text-foreground/70"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Problems List */}
        <main className="lg:col-span-3">
          {viewMode === 'table' ? (
            <div className="glass dark:glass-dark rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Status</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Problem</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Difficulty</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginated.map((p) => (
                      <motion.tr 
                        key={p.id} 
                        variants={cardVariants} 
                        initial="hidden" 
                        animate="visible"
                        className="group hover:bg-primary/5 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex gap-2">
                            <CheckCircleIcon className={`w-5 h-5 ${solvedProblems.includes(Number(p.id)) ? 'text-emerald-500' : 'text-muted-foreground/30'}`} />
                            <HeartIcon className={`w-5 h-5 ${taggedProblems.includes(Number(p.id)) ? 'text-rose-500' : 'text-muted-foreground/30'}`} />
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <Link href={`/leetcode/${p.id}-${generateSlug(p.title)}`} className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {p.id}. {p.title}
                          </Link>
                          <div className="flex gap-1 mt-1">
                            {p.tags?.slice(0, 3).map(t => <span key={t} className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">#{t}</span>)}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${difficultyColors[p.difficulty as keyof typeof difficultyColors]}`}>
                            {p.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg" onClick={() => handleMarkAction(p.id, 'solved')}>
                               <CheckCircleIcon className="w-4 h-4" />
                             </Button>
                             <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg" onClick={() => handleMarkAction(p.id, 'tagged')}>
                               <HeartIcon className="w-4 h-4" />
                             </Button>
                           </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginated.map((p) => (
                <motion.div 
                  key={p.id} 
                  variants={cardVariants} 
                  initial="hidden" 
                  animate="visible"
                  className="premium-card p-6 rounded-3xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${difficultyColors[p.difficulty as keyof typeof difficultyColors]}`}>
                      {p.difficulty}
                    </span>
                    <div className="flex gap-2">
                       <CheckCircleIcon className={`w-5 h-5 ${solvedProblems.includes(Number(p.id)) ? 'text-emerald-500' : 'text-muted-foreground/30'}`} />
                       <HeartIcon className={`w-5 h-5 ${taggedProblems.includes(Number(p.id)) ? 'text-rose-500' : 'text-muted-foreground/30'}`} />
                    </div>
                  </div>
                  <Link href={`/leetcode/${p.id}-${generateSlug(p.title)}`} className="text-xl font-bold hover:text-primary transition-colors block mb-4">
                    {p.id}. {p.title}
                  </Link>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {p.tags?.map(t => <span key={t} className="px-2 py-1 bg-muted rounded-lg text-[10px] font-bold text-muted-foreground">{t}</span>)}
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-grow rounded-xl font-bold" size="sm" onClick={() => handleMarkAction(p.id, 'solved')}>Solve</Button>
                    <Button variant="outline" className="rounded-xl font-bold" size="sm" onClick={() => handleMarkAction(p.id, 'tagged')}>Tag</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex justify-between items-center glass dark:glass-dark p-4 rounded-3xl border border-white/10 shadow-xl">
              <Button 
                variant="ghost" 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 1}
                className="rounded-xl font-bold px-6"
              >
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Prev
              </Button>
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const pNum = i + 1;
                  // Only show 3 pages around current
                  if (pNum === 1 || pNum === totalPages || (pNum >= page - 1 && pNum <= page + 1)) {
                    return (
                      <button
                        key={pNum}
                        onClick={() => handlePageChange(pNum)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                          page === pNum ? "bg-primary text-white" : "hover:bg-primary/10"
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  }
                  if (pNum === 2 || pNum === totalPages - 1) return <span key={pNum}>...</span>;
                  return null;
                })}
              </div>
              <Button 
                variant="ghost" 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page === totalPages}
                className="rounded-xl font-bold px-6"
              >
                Next
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
