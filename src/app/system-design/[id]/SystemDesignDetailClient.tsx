'use client';

import React, { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "../../../components/ui/button";
import { 
  ChevronLeftIcon, 
  CheckCircleIcon, 
  HeartIcon, 
  ShareIcon,
  BookOpenIcon,
  CpuChipIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Problem } from "../../../lib/data-service";

interface Props {
  question: Problem;
  content: string;
  frontmatter: any;
}

export default function SystemDesignDetailClient({ question, content, frontmatter }: Props) {
  const { data: session, status } = useSession();
  const [isSolved, setIsSolved] = useState(false);
  const [isTagged, setIsTagged] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProgress();
    }
  }, [status, question.id]);

  const fetchProgress = useCallback(async () => {
    try {
      const response = await fetch("/api/user/progress/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "systemdesign", action: "all" }),
      });
      const data = await response.json();
      const numericId = Number(question.id);
      setIsSolved((data.solved || []).includes(numericId));
      setIsTagged((data.tagged || []).includes(numericId));
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  }, [question.id]);

  const handleMarkAction = async (action: 'solved' | 'tagged') => {
    if (status !== 'authenticated') {
      toast.error("Please sign in to track progress");
      return;
    }
    const numericId = Number(question.id);
    const isCompleted = action === 'solved' ? isSolved : isTagged;

    try {
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'systemdesign', action, id: numericId, remove: isCompleted }),
      });
      if (response.ok) {
        if (action === 'solved') setIsSolved(!isCompleted);
        else setIsTagged(!isCompleted);
        toast.success(`Marked as ${action}!`);
      }
    } catch (error) {
      toast.error('An error occurred.');
    }
  };

  const difficultyColors = {
    Easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Beginner: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Intermediate: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Hard: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    Advanced: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  const components = {
    pre: ({ node, children, ...props }: any) => {
      return (
        <div className="relative group my-8">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-[#0D0E12] backdrop-blur-xl border border-white/5 rounded-[24px] shadow-2xl overflow-hidden m-0 p-0">
            {children}
          </div>
        </div>
      );
    },
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');
      const [copied, setCopied] = useState(false);

      const handleCopy = () => {
        navigator.clipboard.writeText(codeString);
        setCopied(true);
        toast.success("Code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      };

      if (inline) {
        return (
          <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-md text-sm font-semibold">
            {children}
          </code>
        );
      }

      const displayLang = match ? match[1] : 'code';

      return (
        <div>
          <div className="flex items-center justify-between px-6 py-3 bg-[#13141C] border-b border-white/5 select-none">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              {displayLang}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/60 hover:text-primary transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/5"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-emerald-500 uppercase text-[9px] tracking-wider font-black">Copied</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                  </svg>
                  <span className="uppercase text-[9px] tracking-wider font-black">Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="overflow-x-auto">
            {match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  padding: '1.5rem 2rem',
                  background: 'transparent',
                  fontSize: '0.875rem',
                  lineHeight: '1.7',
                }}
              >
                {codeString}
              </SyntaxHighlighter>
            ) : (
              <pre className="p-6 m-0 text-sm leading-relaxed text-muted-foreground/90 font-mono">
                <code>{children}</code>
              </pre>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/system-design">
            <Button variant="ghost" className="rounded-2xl gap-2 font-black group">
              <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Explorer
            </Button>
          </Link>
          <div className="flex gap-3">
             <Button 
               variant="outline" 
               className={`rounded-2xl gap-2 font-black transition-all ${isSolved ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/50' : ''}`}
               onClick={() => handleMarkAction('solved')}
             >
               <CheckCircleIcon className={`w-5 h-5 ${isSolved ? 'fill-current' : ''}`} />
               {isSolved ? 'Solved' : 'Mark Solved'}
             </Button>
             <Button 
               variant="outline" 
               className={`rounded-2xl gap-2 font-black transition-all ${isTagged ? 'bg-rose-500/10 text-rose-500 border-rose-500/50' : ''}`}
               onClick={() => handleMarkAction('tagged')}
             >
               <HeartIcon className={`w-5 h-5 ${isTagged ? 'fill-current' : ''}`} />
               {isTagged ? 'Tagged' : 'Tag Concept'}
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <main className="lg:col-span-2 space-y-8">
            <div className="glass dark:glass-dark p-8 sm:p-12 rounded-[40px] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${difficultyColors[question.difficulty as keyof typeof difficultyColors] || difficultyColors.Easy}`}>
                   {question.difficulty}
                 </span>
                 {question.tags?.map(t => (
                   <span key={t} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                     {t}
                   </span>
                 ))}
              </div>

              <h1 className="text-4xl sm:text-6xl font-black mb-8 leading-tight">
                {question.title}
              </h1>

              <div className="prose dark:prose-invert max-w-none prose-headings:font-black prose-p:text-muted-foreground prose-p:leading-relaxed prose-pre:bg-muted prose-pre:rounded-3xl prose-pre:border prose-pre:border-border">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={components}
                >
                  {content}
                </ReactMarkdown>
              </div>
              
              <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-muted-foreground text-sm font-medium">Found this helpful? Share with your network.</p>
                <Button variant="outline" className="rounded-2xl gap-2 font-black w-full sm:w-auto" onClick={() => {
                   navigator.clipboard.writeText(window.location.href);
                   toast.success("Link copied!");
                }}>
                  <ShareIcon className="w-5 h-5" />
                  Copy Link
                </Button>
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="glass dark:glass-dark p-8 rounded-[40px] border border-white/10 shadow-xl sticky top-32">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <CpuChipIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black">Quick Brief</h3>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-muted/30 border border-border">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Core Requirement</label>
                  <p className="text-sm font-bold leading-relaxed">
                    Design a system that {question.title.toLowerCase()} specifically focusing on high availability and multi-region consistency.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Key Concepts</label>
                  {['Load Balancing', 'Data Partitioning', 'Caching Strategies', 'Consistency Models'].map(concept => (
                    <div key={concept} className="flex items-center gap-2 group cursor-pointer hover:text-primary transition-colors">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm font-black">{concept}</span>
                      <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </div>
                  ))}
                </div>

                <Button className="w-full rounded-2xl font-black py-8 bg-gradient-to-r from-primary to-indigo-600 hover:shadow-xl hover:shadow-primary/20 transition-all">
                  Next Challenge
                </Button>
              </div>
            </div>

            <div className="p-8 rounded-[40px] bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                   <BookOpenIcon className="w-5 h-5" />
                 </div>
                 <h4 className="font-black">Resources</h4>
              </div>
              <p className="text-xs text-muted-foreground font-medium mb-6 leading-relaxed">
                 Explore deep-dive whitepapers and architectural patterns related to this system.
              </p>
              <Button variant="link" className="p-0 h-auto font-black text-primary hover:text-indigo-600">
                View Architecture Guide →
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
