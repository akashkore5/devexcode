'use client';

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  ArrowsRightLeftIcon,
  LightBulbIcon,
  KeyIcon,
  ChatBubbleLeftRightIcon,
  BookmarkIcon,
  LinkIcon,
  ChevronDownIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import LiveCodeRunner from "../../../../components/frontend/LiveCodeRunner";
import type { FrontendTopic } from "../types";

interface Props {
  topic: FrontendTopic;
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Foundational: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Core: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  Advanced: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
};

const LANG_LABEL: Record<string, string> = {
  html: "HTML", css: "CSS", js: "JavaScript", jsx: "JSX", tsx: "TSX",
  ts: "TypeScript", bash: "Shell", json: "JSON", yaml: "YAML",
};

function CodeBlock({ code, language, label }: { code: string; language: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard may be unavailable */
    }
  };
  return (
    <div className="my-7 rounded-[24px] overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl">
      <div className="flex items-center justify-between px-5 py-2.5 bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-white/5">
        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            {LANG_LABEL[language] ?? language}
          </span>
          <button
            onClick={copy}
            className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-indigo-500 transition-colors"
          >
            {copied ? <CheckIcon className="w-3.5 h-3.5 text-green-500" /> : <ClipboardDocumentIcon className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        language={language === "jsx" || language === "tsx" ? "jsx" : language}
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: "1.5rem", background: "#1E1E1E", fontSize: "0.8rem", lineHeight: "1.7" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function QAItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(idx === 0);
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/40 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
      >
        <span className="flex items-start gap-3 font-bold text-slate-800 dark:text-slate-100 text-sm">
          <span className="text-indigo-600 dark:text-indigo-400 font-black flex-shrink-0">Q{idx + 1}.</span>
          {q}
        </span>
        <ChevronDownIcon
          className={`w-5 h-5 flex-shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-white/5">
              <div className="pt-4 prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{a}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TopicDetailClient({ topic, prev, next }: Props) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const proseClasses =
    "prose dark:prose-invert max-w-none " +
    "prose-p:text-[15px] prose-p:leading-[1.85] prose-p:text-slate-600 dark:prose-p:text-slate-300 " +
    "prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-bold " +
    "prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-code:bg-indigo-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-semibold prose-code:before:content-[''] prose-code:after:content-[''] " +
    "prose-table:text-sm prose-th:text-left prose-th:font-black prose-th:text-slate-700 dark:prose-th:text-slate-200 prose-td:text-slate-600 dark:prose-td:text-slate-300 " +
    "prose-a:text-indigo-600 dark:prose-a:text-indigo-400";

  return (
    <div className="min-h-screen bg-background pb-32 pt-24">
      {/* Scroll progress */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 origin-left z-50"
      />

      {/* Breadcrumb */}
      <nav className="border-b border-border/50 bg-card/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Link href="/interview/frontend">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors group">
              <ChevronLeftIcon className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Frontend Handbook
            </div>
          </Link>
          <span className="text-border/40 text-xs">/</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/50">{topic.part}</span>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Topic #{String(topic.num).padStart(2, "0")}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                DIFFICULTY_STYLES[topic.difficulty] ?? DIFFICULTY_STYLES.Core
              }`}
            >
              {topic.difficulty}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              <ClockIcon className="w-3.5 h-3.5" />
              {topic.readingTime} min read
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-5">
            {topic.title}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{topic.summary}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {topic.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Explanation */}
        <section className={proseClasses}>
          {topic.explanation.map((para, i) => (
            <ReactMarkdown key={i} remarkPlugins={[remarkGfm]}>
              {para}
            </ReactMarkdown>
          ))}
        </section>

        {/* Backend Analogy */}
        {topic.backendAnalogy && (
          <div className="my-9 rounded-[24px] border border-blue-500/20 bg-blue-500/[0.04] p-6 sm:p-7">
            <div className="flex items-center gap-2 mb-3">
              <ArrowsRightLeftIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Backend Analogy
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{topic.backendAnalogy}</p>
          </div>
        )}

        {/* Key Insights */}
        {topic.keyInsights.length > 0 && (
          <div className="my-9 rounded-[24px] border border-amber-500/20 bg-amber-500/[0.04] p-6 sm:p-7">
            <div className="flex items-center gap-2 mb-4">
              <LightBulbIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Key Insights
              </span>
            </div>
            <ul className="space-y-3">
              {topic.keyInsights.map((insight, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Code samples */}
        {topic.codeSamples.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <KeyIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Worked Code
            </h2>
            {topic.codeSamples.map((sample, i) => (
              <CodeBlock key={i} code={sample.code} language={sample.language} label={sample.label} />
            ))}
          </section>
        )}

        {/* Runnable demo */}
        {topic.runnable && (
          <section className="mt-12">
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="text-indigo-600 dark:text-indigo-400">▶</span>
              Try It Live
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Edit the code and press Run — it executes safely in a sandboxed iframe. Use the Console tab for log output.
            </p>
            <LiveCodeRunner
              title={topic.runnable.title}
              html={topic.runnable.html}
              css={topic.runnable.css}
              js={topic.runnable.js}
            />
          </section>
        )}

        {/* Interview Q&A */}
        {topic.interviewQA.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Interview-Ready Q&amp;A
            </h2>
            <div className="space-y-3">
              {topic.interviewQA.map((qa, i) => (
                <QAItem key={i} q={qa.question} a={qa.answer} idx={i} />
              ))}
            </div>
          </section>
        )}

        {/* Things to Remember */}
        {topic.thingsToRemember.length > 0 && (
          <section className="mt-14">
            <div className="rounded-[28px] border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.06] to-purple-500/[0.04] p-7 sm:p-9">
              <div className="flex items-center gap-2 mb-5">
                <BookmarkIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  Things to Remember
                </span>
              </div>
              <ul className="space-y-3.5">
                {topic.thingsToRemember.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-200">
                    <span className="flex items-center justify-center w-5 h-5 rounded-md bg-indigo-600 text-white text-[10px] font-black flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* References */}
        {topic.references.length > 0 && (
          <section className="mt-12">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              References &amp; Further Reading
            </h2>
            <ul className="space-y-2">
              {topic.references.map((ref, i) => (
                <li key={i}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <ChevronRightIcon className="w-3.5 h-3.5 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                    {ref.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Prev / Next */}
        <nav className="mt-16 pt-10 border-t border-slate-200 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prev ? (
            <Link href={`/interview/frontend/${prev.id}`}>
              <div className="group p-5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 bg-white dark:bg-slate-900/40 transition-all">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  <ChevronLeftIcon className="w-3 h-3" /> Previous
                </div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {prev.title}
                </div>
              </div>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/interview/frontend/${next.id}`}>
              <div className="group p-5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 bg-white dark:bg-slate-900/40 transition-all text-right">
                <div className="flex items-center justify-end gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Next <ChevronRightIcon className="w-3 h-3" />
                </div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {next.title}
                </div>
              </div>
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
