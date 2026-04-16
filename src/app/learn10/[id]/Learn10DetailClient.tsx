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
  BookOpenIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  ShareIcon,
  BookmarkIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Problem } from "@/lib/data-service";

interface Props {
  topic: Problem;
  content: string;
  frontmatter: any;
}

export default function Learn10DetailClient({ topic, content, frontmatter }: Props) {
  const { data: session, status } = useSession();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProgress();
    }
  }, [status, topic.id]);

  const fetchProgress = useCallback(async () => {
    try {
      const response = await fetch("/api/user/progress/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "learn10", action: "all" }),
      });
      if (response.ok) {
        const data = await response.json();
        const numericId = Number(topic.id);
        setIsCompleted((data.solved || []).includes(numericId));
        setIsSaved((data.tagged || []).includes(numericId));
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  }, [topic.id]);

  const handleMarkAction = async (action: 'solved' | 'tagged') => {
    if (status !== 'authenticated') {
      toast.error("Please sign in to track progress");
      return;
    }
    const numericId = Number(topic.id);
    const currentState = action === 'solved' ? isCompleted : isSaved;

    try {
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'learn10', action, id: numericId, remove: currentState }),
      });
      if (response.ok) {
        if (action === 'solved') setIsCompleted(!currentState);
        else setIsSaved(!currentState);
        toast.success(`Brief marked as ${action === 'solved' ? 'mastered' : 'saved'}!`);
      }
    } catch (error) {
      toast.error('Operation failed.');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/learn10">
            <Button variant="ghost" className="rounded-2xl gap-2 font-black group px-6 py-6 hover:bg-card border border-transparent hover:border-border transition-all">
              <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Series Explorer
            </Button>
          </Link>
          
          <div className="flex gap-3">
             <Button 
               variant="outline" 
               className={`rounded-2xl gap-3 font-black px-6 py-6 transition-all ${isCompleted ? 'bg-primary/10 text-primary border-primary/50' : 'hover:border-primary/50'}`}
               onClick={() => handleMarkAction('solved')}
             >
               <CheckCircleIcon className={`w-5 h-5 ${isCompleted ? 'fill-current' : ''}`} />
               {isCompleted ? 'Mastered' : 'Mark Mastered'}
             </Button>
             <Button 
               variant="outline" 
               className={`rounded-2xl gap-3 font-black px-6 py-6 transition-all ${isSaved ? 'bg-amber-500/10 text-amber-500 border-amber-500/50' : 'hover:border-amber-500/50'}`}
               onClick={() => handleMarkAction('tagged')}
             >
               <BookmarkIcon className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
               {isSaved ? 'Saved' : 'Save Brief'}
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Main Context Area */}
          <main className="lg:col-span-3 space-y-12">
            <div className="glass-modern p-8 sm:p-16 rounded-[48px] border border-white/10 shadow-3xl relative overflow-hidden group">
              {/* Architectural Underlay Decorations */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32" />
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-10">
                   <div className="px-4 py-2 rounded-2xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 flex items-center gap-2">
                     <AcademicCapIcon className="w-4 h-4" />
                     {topic.category || 'Engineering Brief'}
                   </div>
                   <div className="h-px flex-grow bg-border/50" />
                   <span className="text-muted-foreground font-black text-sm uppercase tracking-tighter">10-Min Deep Dive</span>
                </div>

                <h1 className="text-5xl sm:text-7xl font-black mb-12 leading-[1.1] gradient-text tracking-tighter">
                  {topic.title}
                </h1>

                <div className="prose dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-lg prose-p:leading-relaxed prose-p:text-muted-foreground prose-strong:text-foreground prose-strong:font-black prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none prose-pre:bg-card prose-pre:rounded-[32px] prose-pre:border prose-pre:border-border prose-pre:p-8">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {content}
                  </ReactMarkdown>
                </div>
                
                <div className="mt-20 pt-10 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-4 text-muted-foreground font-medium">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <ShareIcon className="w-5 h-5" />
                    </div>
                    <span>Propagate this knowledge. Link copied automatically on click.</span>
                  </div>
                  <Button variant="premium" className="rounded-2xl gap-2 font-black w-full sm:w-auto px-8 py-7" onClick={() => {
                     navigator.clipboard.writeText(window.location.href);
                     toast.success("Blueprint URL copied to clipboard.");
                  }}>
                    Propagate Blueprint
                  </Button>
                </div>
              </div>
            </div>
          </main>

          {/* Blueprint Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="glass-modern p-10 rounded-[40px] border border-white/10 shadow-xl sticky top-32 group">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <BookOpenIcon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Technical Spec</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Accelerated Briefing</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="p-8 rounded-[32px] bg-card border border-border group-hover:border-primary/30 transition-colors">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary block mb-4">Mastery Outcome</label>
                  <p className="text-sm font-bold leading-relaxed">
                    By reading this briefing, you will grasp the fundamental architectural trade-offs and implementation pitfalls associated with {topic.title.toLowerCase()} in high-load distributed environments.
                  </p>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block px-2">Knowledge Branches</label>
                  {['Distributed Ledger', 'Scalability Models', 'Event Driven Arch', 'Performance Audits'].map(concept => (
                    <div key={concept} className="flex items-center gap-4 group/item cursor-pointer hover:text-primary transition-all p-2 rounded-xl hover:bg-primary/5">
                      <div className="w-2 h-2 rounded-full bg-primary transition-all group-hover/item:scale-150" />
                      <span className="text-sm font-black tracking-tight">{concept}</span>
                      <ArrowRightIcon className="w-3 h-3 ml-auto opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>

                <Link href="/learn10" className="block">
                  <Button className="w-full rounded-2xl font-black py-8 bg-foreground text-background hover:bg-primary hover:text-white transition-all">
                    Next Briefing
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-10 rounded-[40px] bg-card border border-border group relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl transition-transform group-hover:scale-150 duration-700" />
               <div className="relative">
                  <h4 className="font-black mb-4 flex items-center gap-3">
                    <SparklesIcon className="w-5 h-5 text-primary" />
                    Need Live Support?
                  </h4>
                  <p className="text-xs text-muted-foreground font-medium mb-8 leading-relaxed">
                     Get 1-on-1 coaching for this specific topic from our staff engineers.
                  </p>
                  <Link href="/services">
                    <Button variant="link" className="p-0 h-auto font-black text-primary hover:text-indigo-600 transition-colors">
                      Book a Session →
                    </Button>
                  </Link>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// SparklesIcon was missing from imports, adding it or swapping
import { SparklesIcon } from "@heroicons/react/24/outline";
