'use client';

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  SparklesIcon,
  PlayCircleIcon,
  ClockIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import type { FrontendTopic } from "./types";

interface Group {
  partId: string;
  name: string;
  tagline: string;
  topics: FrontendTopic[];
}

interface Props {
  groups: Group[];
  stats: { totalTopics: number; totalParts: number; totalQuestions: number; totalRunnable: number };
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Foundational: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Core: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  Advanced: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
};

export default function FrontendPrepClient({ groups, stats }: Props) {
  const [query, setQuery] = useState("");
  const [activePart, setActivePart] = useState<string | "all">("all");

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .filter((g) => activePart === "all" || g.partId === activePart)
      .map((g) => ({
        ...g,
        topics: g.topics.filter(
          (t) =>
            q === "" ||
            t.title.toLowerCase().includes(q) ||
            t.summary.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.includes(q))
        ),
      }))
      .filter((g) => g.topics.length > 0);
  }, [groups, query, activePart]);

  const heroStats = [
    { label: "Topics", value: stats.totalTopics, icon: BookOpenIcon },
    { label: "Parts", value: stats.totalParts, icon: SparklesIcon },
    { label: "Interview Q&A", value: stats.totalQuestions, icon: ChevronLeftIcon },
    { label: "Live Demos", value: stats.totalRunnable, icon: PlayCircleIcon },
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 relative overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        <Link href="/interview">
          <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors group mb-8">
            <ChevronLeftIcon className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Interview Hub
          </div>
        </Link>

        {/* Header */}
        <div className="mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-6 border border-indigo-500/20"
          >
            <SparklesIcon className="w-4 h-4" />
            Frontend Engineering Handbook
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter"
          >
            Learn Frontend. Perfectly.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl leading-relaxed"
          >
            A complete, interview-ready reference — from the browser rendering pipeline to micro-frontends.
            Every topic ships with worked code, live runnable demos, interview Q&amp;A, and things to remember.
          </motion.p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 max-w-3xl">
            {heroStats.map((s) => (
              <div
                key={s.label}
                className="glass dark:glass-dark p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm"
              >
                <div className="text-3xl font-black text-slate-900 dark:text-white">{s.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search + part filter */}
        <div className="mb-12 space-y-5 sticky top-20 z-20 py-3 bg-background/80 backdrop-blur-xl rounded-3xl">
          <div className="relative max-w-2xl">
            <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics, e.g. hooks, specificity, CSP, hydration…"
              className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm font-medium shadow-sm transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActivePart("all")}
              className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${
                activePart === "all"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20"
                  : "bg-white dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:border-indigo-500/30"
              }`}
            >
              All Parts
            </button>
            {groups.map((g) => (
              <button
                key={g.partId}
                onClick={() => setActivePart(g.partId)}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${
                  activePart === g.partId
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20"
                    : "bg-white dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:border-indigo-500/30"
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* Groups */}
        <div className="space-y-16">
          {filteredGroups.length === 0 && (
            <div className="text-center py-20 text-slate-400 font-medium">
              No topics match “{query}”.
            </div>
          )}
          {filteredGroups.map((group, gi) => (
            <section key={group.partId}>
              <div className="flex items-end justify-between mb-7 pb-3 border-b border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-black uppercase border border-indigo-500/20">
                    {group.partId}
                  </span>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{group.name}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{group.tagline}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {group.topics.length} {group.topics.length === 1 ? "topic" : "topics"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.topics.map((topic, ti) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(ti * 0.03 + gi * 0.02, 0.3) }}
                  >
                    <Link href={`/interview/frontend/${topic.id}`}>
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="glass dark:glass-dark group h-full p-6 rounded-[26px] border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all duration-300 shadow-sm dark:shadow-lg flex flex-col cursor-pointer relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black text-slate-300 dark:text-slate-600">
                            #{String(topic.num).padStart(2, "0")}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                              DIFFICULTY_STYLES[topic.difficulty] ?? DIFFICULTY_STYLES.Core
                            }`}
                          >
                            {topic.difficulty}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-5 flex-grow">
                          {topic.summary}
                        </p>

                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <ClockIcon className="w-3.5 h-3.5" />
                              {topic.readingTime}m
                            </span>
                            {topic.runnable && (
                              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                                <PlayCircleIcon className="w-3.5 h-3.5" />
                                Live
                              </span>
                            )}
                          </div>
                          <ArrowRightIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
