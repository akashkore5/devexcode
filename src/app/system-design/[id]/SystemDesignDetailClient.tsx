'use client';

import React, { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
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
import { Problem } from "@/lib/data-service";

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

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
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
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
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
