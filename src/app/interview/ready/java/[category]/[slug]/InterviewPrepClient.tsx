'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  ChevronLeftIcon, 
  PencilSquareIcon, 
  CheckIcon, 
  XMarkIcon,
  DocumentTextIcon,
  EyeIcon,
  TagIcon,
  CheckCircleIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid, TagIcon as TagIconSolid } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { useSession } from "next-auth/react";

interface Props {
  content: string;
  frontmatter: {
    title: string;
    category: string;
    order: number;
  };
  slug: string;
  category: string;
  isDev: boolean;
}

export default function InterviewPrepClient({ content: initialContent, frontmatter, slug, category, isDev }: Props) {
  const { data: session, status: authStatus } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [tempContent, setTempContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  
  // Progress/Tags State (Now from DB)
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTagged, setIsTagged] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Fetch Progress from DB
  useEffect(() => {
    if (authStatus !== 'authenticated') {
      setIsLoadingProgress(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/user/progress/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'java', action: 'all' }),
        });
        if (response.ok) {
          const data = await response.json();
          setIsCompleted(data.completed?.includes(slug) || false);
          setIsTagged(data.tagged?.includes(slug) || false);
        }
      } catch (err) {
        console.error('Failed to fetch progress', err);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    fetchProgress();
  }, [slug, authStatus]);

  const toggleProgress = async (action: 'completed' | 'tagged') => {
    if (authStatus !== 'authenticated') {
      toast.error('Please log in to track progress');
      return;
    }

    const isCurrent = action === 'completed' ? isCompleted : isTagged;
    const setLocal = action === 'completed' ? setIsCompleted : setIsTagged;

    try {
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'java',
          action: action,
          id: slug,
          remove: isCurrent
        }),
      });

      if (response.ok) {
        setLocal(!isCurrent);
        toast.success(isCurrent ? 'Progress removed' : 'Progress saved');
      }
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/interview/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          slug,
          content: tempContent,
          frontmatter: {
            ...frontmatter
          }
        }),
      });

      if (response.ok) {
        setContent(tempContent);
        setIsEditing(false);
        toast.success('Question content updated locally!');
      } else {
        const error = await response.json();
        toast.error(`Error: ${error.error}`);
      }
    } catch (err) {
      toast.error('Failed to save content');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempContent(content);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background pb-32 font-sans pt-24">
      <Toaster position="top-right" />

      {/* Modern Minimal Breadcrumb - Non-fixed to avoid overlapping global header */}
      <nav className="border-b border-border/50 bg-card/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/interview/ready/java">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors group">
                <ChevronLeftIcon className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                JAVA MASTER LIST
              </div>
            </Link>
            <span className="text-border/40 text-xs">/</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 truncate max-w-[150px]">
              {frontmatter.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tag Action */}
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => toggleProgress('tagged')}
              disabled={authStatus !== 'authenticated' || isLoadingProgress}
              className={`w-8 h-8 rounded-lg transition-all ${
                isTagged ? 'text-amber-500 bg-amber-500/5' : 'text-muted-foreground/40 hover:text-amber-500'
              }`}
            >
              {isTagged ? <TagIconSolid className="w-4 h-4" /> : <TagIcon className="w-4 h-4" />}
            </Button>

            {/* Complete Action */}
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => toggleProgress('completed')}
              disabled={authStatus !== 'authenticated' || isLoadingProgress}
              className={`w-8 h-8 rounded-lg transition-all ${
                isCompleted ? 'text-green-500 bg-green-500/5' : 'text-muted-foreground/40 hover:text-green-500'
              }`}
            >
              {isCompleted ? <CheckCircleSolid className="w-4 h-4" /> : <CheckCircleIcon className="w-4 h-4" />}
            </Button>

            {/* Edit Action */}
            {isDev && (
              <div className="flex gap-2 ml-1 pl-2 border-l border-border/50">
                {!isEditing ? (
                  <Button 
                    variant="ghost" size="icon" onClick={() => setIsEditing(true)}
                    className="w-8 h-8 rounded-lg text-primary/40 hover:text-primary hover:bg-primary/5"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleCancel} className="w-8 h-8 rounded-lg"><XMarkIcon className="w-4 h-4" /></Button>
                    <Button size="icon" onClick={handleSave} className="w-8 h-8 rounded-lg bg-green-600 text-white"><CheckIcon className="w-4 h-4" /></Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {/* Header Section - Clean & Readable */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/50">
              {category}
            </span>
            {isCompleted && (
              <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/5 font-black px-2 py-0 text-[9px] tracking-widest uppercase rounded-md">
                MASTERED
              </Badge>
            )}
            {isTagged && (
              <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/5 font-black px-2 py-0 text-[9px] tracking-widest uppercase rounded-md">
                REVISION
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight mb-8">
            {frontmatter.title}
          </h1>

          {authStatus !== 'authenticated' && !isLoadingProgress && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/5 border border-amber-500/10 rounded-xl text-amber-600/80 text-[10px] font-bold tracking-tight">
              <UserCircleIcon className="w-4 h-4 opacity-50" />
              Sign in to sync your progress
            </div>
          )}
        </header>

        {/* Content Area - Optimized for Reading */}
        <div className={`grid grid-cols-1 ${isEditing ? 'lg:grid-cols-2 gap-12 max-w-none' : 'max-w-4xl mx-auto'} transition-all duration-700`}>
          
          {/* Editor Mode */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-4"
              >
                 <div className="flex items-center gap-2 text-muted-foreground mb-2 px-6">
                  <DocumentTextIcon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Raw Markdown</span>
                </div>
                <textarea
                  value={tempContent}
                  onChange={(e) => setTempContent(e.target.value)}
                  className="w-full h-[600px] p-10 rounded-[40px] bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono text-sm leading-relaxed resize-none shadow-2xl"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preview / Read Mode */}
          <div className="space-y-4">
            {isEditing && (
              <div className="flex items-center gap-2 text-muted-foreground mb-2 px-6">
                <EyeIcon className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Live Preview</span>
              </div>
            )}
            
            <motion.div 
              layout
              className={`prose dark:prose-invert max-w-none transition-all duration-500
                prose-h2:text-3xl prose-h2:font-black prose-h2:tracking-tight prose-h2:mt-24 prose-h2:mb-8 prose-h2:pb-4 prose-h2:border-b prose-h2:border-border/50
                prose-h3:text-xl prose-h3:font-bold prose-h3:mt-12
                prose-p:text-lg prose-p:leading-[1.8] prose-p:text-muted-foreground/80 prose-p:mb-8
                prose-strong:text-foreground prose-strong:font-black
                prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-slate-900 prose-pre:rounded-[40px] prose-pre:p-10 prose-pre:shadow-2xl prose-pre:my-12
                prose-li:text-muted-foreground/80 prose-li:mb-3
                prose-blockquote:border-l-4 prose-blockquote:border-primary/20 prose-blockquote:pl-10 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:my-10
                prose-img:rounded-[40px] prose-img:my-12
                prose-ul:my-10 prose-ol:my-10
              `}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {isEditing ? tempContent : content}
              </ReactMarkdown>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
