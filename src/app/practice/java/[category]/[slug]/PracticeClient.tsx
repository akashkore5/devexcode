'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { 
  ChevronLeftIcon, 
  CodeBracketIcon,
  PlayIcon,
  InformationCircleIcon,
  QueueListIcon,
  BeakerIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

interface Props {
  content: string;
  frontmatter: {
    title: string;
    category: string;
    order: number;
  };
  slug: string;
  category: string;
}

export default function PracticeClient({ content, frontmatter, category }: Props) {
  const [userOutput, setUserOutput] = useState('');
  const [showExpected, setShowExpected] = useState(false);

  // Split content into "Before Output" and "After Output"
  const { beforeOutput, afterOutput } = useMemo(() => {
    const parts = content.split(/### Expected Output/i);
    if (parts.length < 2) return { beforeOutput: content, afterOutput: '' };
    return { 
      beforeOutput: parts[0], 
      afterOutput: '### Expected Output' + parts[1] 
    };
  }, [content]);
  
  // Custom components for ReactMarkdown
  const components = {
    h3: ({ node, ...props }) => {
      const title = props.children?.toString().toLowerCase();
      let icon = <InformationCircleIcon className="w-5 h-5" />;
      let color = "text-primary";
      let bgColor = "bg-primary/5";

      if (title.includes('code')) {
        icon = <CodeBracketIcon className="w-5 h-5" />;
        color = "text-blue-500";
        bgColor = "bg-blue-500/5";
      } else if (title.includes('output')) {
        icon = <PlayIcon className="w-5 h-5" />;
        color = "text-green-500";
        bgColor = "bg-green-500/5";
      } else if (title.includes('flow')) {
        icon = <QueueListIcon className="w-5 h-5" />;
        color = "text-amber-500";
        bgColor = "bg-amber-500/5";
      } else if (title.includes('dive') || title.includes('works')) {
        icon = <BeakerIcon className="w-5 h-5" />;
        color = "text-purple-500";
        bgColor = "bg-purple-500/5";
      }

      return (
        <div className="mt-16 mb-8">
          <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-2xl ${bgColor} ${color} mb-4`}>
            {icon}
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              {props.children}
            </span>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-border via-border/50 to-transparent" />
        </div>
      );
    },
    pre: ({ node, ...props }) => (
      <div className="relative group">
        <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <pre {...props} className="relative bg-slate-950/90 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 sm:p-10 shadow-2xl overflow-x-auto my-8" />
      </div>
    ),
    ol: ({ node, ...props }) => <ol {...props} className="space-y-4 my-8" />,
    li: ({ node, ...props }) => (
      <li className="flex gap-4 group">
        <div className="flex-none w-8 h-8 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary text-[10px] font-black group-hover:bg-primary group-hover:text-white transition-all duration-300">
          •
        </div>
        <div className="pt-1 text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-relaxed">
          {props.children}
        </div>
      </li>
    ),
    blockquote: ({ node, ...props }) => (
      <blockquote className="border-l-4 border-primary/20 pl-8 py-2 italic text-muted-foreground/80 my-10 bg-primary/[0.02] rounded-r-3xl pr-8" {...props} />
    )
  };

  return (
    <div className="min-h-screen bg-background pb-32 font-sans pt-24">
      
      {/* Breadcrumb */}
      <nav className="border-b border-border/50 bg-card/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/practice/java">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors group">
                <ChevronLeftIcon className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                JAVA PRACTICE LIST
              </div>
            </Link>
            <span className="text-border/40 text-xs">/</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 truncate max-w-[150px]">
              {frontmatter.title}
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              {category}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight mb-4">
            {frontmatter.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Analyze the code, write your predicted output, and then reveal the solution.
          </p>
        </header>

        {/* Content Area */}
        <div className="prose dark:prose-invert max-w-none 
            prose-p:text-lg prose-p:leading-[1.8] prose-p:text-muted-foreground/80
            prose-strong:text-foreground prose-strong:font-black
            prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
        ">
          {/* 1. Render content before "Expected Output" */}
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
            {beforeOutput}
          </ReactMarkdown>

          {/* 2. Render Interactive User Box */}
          <div className="mt-16 mb-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary/5 text-primary mb-8 border border-primary/10">
              <PencilSquareIcon className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Take Your Shot</span>
            </div>
            
            <div className="bg-card/30 border border-border/50 rounded-[40px] p-10 mb-8 backdrop-blur-sm shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                  <PlayIcon className="w-12 h-12 rotate-12" />
               </div>
               <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Predicted Output</span>
               </div>
               <textarea 
                  value={userOutput}
                  onChange={(e) => setUserOutput(e.target.value)}
                  placeholder="System.out.println(...)"
                  className="w-full h-40 bg-background/50 border border-border/50 rounded-3xl p-8 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm resize-none shadow-inner"
               />
               <div className="mt-8 flex justify-between items-center">
                  <p className="text-[10px] font-bold text-muted-foreground/40 italic">
                    Type exactly what you think will be printed in the console.
                  </p>
                  <Button 
                    onClick={() => setShowExpected(!showExpected)}
                    variant={showExpected ? "outline" : "default"}
                    className="rounded-2xl px-8 py-6 font-black text-xs tracking-widest uppercase flex items-center gap-3 shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    {showExpected ? <><EyeSlashIcon className="w-5 h-5" /> Hide Solution</> : <><EyeIcon className="w-5 h-5" /> Reveal Solution</>}
                  </Button>
               </div>
            </div>
          </div>

          {/* 3. Render content after "Expected Output" (including the output itself) if revealed */}
          <AnimatePresence mode="wait">
            {showExpected && (
              <motion.div
                key="solution"
                initial={{ opacity: 0, height: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
                exit={{ opacity: 0, height: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="overflow-hidden"
              >
                     <div className="bg-green-500/5 rounded-[40px] border border-green-500/10 p-2 mt-8">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
                    {afterOutput}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
