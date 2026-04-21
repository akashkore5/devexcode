"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import {
  CheckCircleIcon,
  ArrowRightCircleIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../../../components/ui/button";
import javaTopics from "../../../data/java_topics.json";
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
          body: JSON.stringify({ type: "java", action: "all" }),
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        setProgress({
          completed: data.completed || [],
          viewed: data.viewed || [],
        });
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [status]);

  const handleMarkCompleted = useCallback(
    async (id) => {
      if (status !== "authenticated") {
        toast.error("Please sign in to track progress");
        return;
      }

      const isCompleted = progress.completed.includes(id);
      setIsUpdating((prev) => ({ ...prev, [id]: true }));

      try {
        const response = await fetch("/api/user/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "java",
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
          toast.success(isCompleted ? "Unmarked!" : "Marked Complete!");
        }
      } catch (error) {
        toast.error("Update failed");
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
              subtopic.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            : true;
          const matchesDifficulty =
            difficultyFilter === "All" || subtopic.difficulty === difficultyFilter;
          const matchesTag = tagFilter === "All" || subtopic.tags?.includes(tagFilter);
          return matchesSearch && matchesDifficulty && matchesTag;
        });

        const topicMatchesSearch = searchQuery
          ? topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topic.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          : true;
        
        if (topicMatchesSearch || filteredSubtopics.length > 0) {
          return { ...topic, subtopics: filteredSubtopics };
        }
        return null;
      })
      .filter((topic) => topic !== null);
  }, [searchQuery, difficultyFilter, tagFilter]);

  const progressStats = useMemo(() => {
    const totalItems = javaTopics.topics.reduce(
      (acc, topic) => acc + topic.subtopics.length,
      0
    );
    const completedItems = progress.completed.length;
    const percentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    return { totalItems, completedItems, percentage };
  }, [progress.completed]);

  const uniqueTags = useMemo(() => {
    const tags = new Set();
    javaTopics.topics.forEach((topic) => {
      topic.tags?.forEach((tag) => tags.add(tag));
      topic.subtopics?.forEach((subtopic) => subtopic.tags?.forEach((tag) => tags.add(tag)));
    });
    return ["All", ...Array.from(tags).sort()];
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10">
      <Toaster position="top-right" />
      
      {/* Premium Hero Section */}
      <header className="relative pt-32 pb-20 overflow-hidden border-b border-border/50 bg-card/10">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-end justify-between gap-8"
          >
            <div className="max-w-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10 mb-6 inline-block">
                Mastery Path
              </span>
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-foreground leading-[0.9] mb-6">
                Java Backend <br/><span className="text-muted-foreground/60 underline decoration-primary/20 decoration-8 underline-offset-8">Blueprint</span>
              </h1>
              <p className="text-lg text-muted-foreground/80 font-medium leading-relaxed max-w-lg">
                The ultimate structured guide to mastering the Java ecosystem, from JVM internals to high-scale Microservices.
              </p>
            </div>

            {/* Compact Progress Dashboard */}
            <div className="w-full md:w-80 bg-card/30 backdrop-blur-3xl p-6 rounded-[32px] border border-border/50 shadow-2xl relative group overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="relative">
                 <div className="flex justify-between items-end mb-4">
                   <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Overall Roadmap</span>
                   <span className="text-2xl font-black tabular-nums tracking-tighter">{Math.round(progressStats.percentage)}%</span>
                 </div>
                 <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden mb-6">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${progressStats.percentage}%` }}
                     className="h-full bg-primary"
                   />
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold">
                   <span className="text-muted-foreground/50">{progressStats.completedItems} Completed</span>
                   <span className="text-primary/60">{progressStats.totalItems} Remaining</span>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Launch Banner - Liquid Style */}
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mb-24 overflow-hidden rounded-[48px] bg-slate-950 p-12 shadow-2xl group"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.1),transparent)]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48 group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary mb-6">
                  <SparklesIcon className="w-3 h-3" />
                  Expert Curated
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight leading-[1]">Java Interview <br/>Master Sheet</h2>
                <p className="text-slate-400 text-lg font-medium max-w-xl leading-relaxed">
                  Fast-track your preparation with 150+ perfectly curated QA pairs. Designed for quick revision and deep mastery.
                </p>
              </div>
              <Link href="/interview/ready/java">
                <button className="px-10 py-6 bg-white text-black rounded-[24px] font-black text-lg hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                  Launch Master Sheet
                  <ArrowRightCircleIcon className="w-6 h-6 opacity-30 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-16 px-4">
          <div className="flex-1 min-w-[300px] relative group">
            <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search concepts, tools or architecture..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-border/50 bg-card/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm placeholder:text-muted-foreground/30"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-6 py-4 rounded-2xl border border-border/50 bg-card/20 backdrop-blur-md focus:outline-none font-black text-[10px] uppercase tracking-widest"
            >
              <option value="All">Difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Topics Grid - Surgical Precision */}
        <div className="grid gap-12 lg:grid-cols-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-64 rounded-[40px] bg-muted/10 animate-pulse" />
            ))
          ) : filteredTopics.map((topic) => (
            <motion.div
              layout
              key={topic.id}
              className="group relative"
            >
              <div className="mb-8 flex items-end justify-between px-2">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary/50">{topic.id}</span>
                    <div className="inline-flex items-center rounded-full border border-border/50 px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter opacity-50">{topic.difficulty}</div>
                  </div>
                  <h3 className="text-3xl font-black tracking-tight group-hover:text-primary transition-colors">{topic.title}</h3>
                </div>
              </div>

              <div className="bg-card/30 backdrop-blur-xl rounded-[40px] border border-border/50 p-10 group-hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/5">
                <p className="text-muted-foreground/80 font-medium text-base mb-10 leading-relaxed line-clamp-2">
                  {topic.description}
                </p>
                
                <div className="space-y-3">
                  {topic.subtopics.map((subtopic) => (
                    <div
                      key={subtopic.id}
                      className="flex items-center justify-between p-4 rounded-2xl hover:bg-primary/5 transition-all group/item"
                    >
                      <Link
                        href={`/learning/java/${subtopic.id}`}
                        className="flex items-center gap-4 flex-1"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-border group-hover/item:bg-primary transition-colors" />
                        <span className="text-sm font-bold text-muted-foreground group-hover/item:text-foreground transition-all">
                          {subtopic.title}
                        </span>
                      </Link>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          handleMarkCompleted(subtopic.id);
                        }}
                        className={`w-8 h-8 rounded-lg border transition-all ${
                          progress.completed.includes(subtopic.id)
                            ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                            : 'text-muted-foreground/30 border-transparent hover:text-green-500 hover:bg-green-500/5 hover:border-green-500/20'
                        }`}
                      >
                        {progress.completed.includes(subtopic.id) ? (
                            <CheckCircleIcon className="w-5 h-5" />
                        ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-current" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>


    </div>
  );
}