'use client';

import { motion } from "framer-motion";
import { 
  CodeBracketIcon, 
  CpuChipIcon, 
  AcademicCapIcon, 
  ChatBubbleLeftRightIcon,
  DocumentCheckIcon,
  LightBulbIcon,
  QueueListIcon,
  ArrowRightIcon,
  SparklesIcon,
  RocketLaunchIcon
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  stats: {
    java: number;
    database: number;
    react: number;
    systemDesign: number;
    leetcode75: number;
    leetcode150: number;
    mcq: number;
  };
}

export default function InterviewClient({ stats }: Props) {
  const categories = [
    {
      title: "Leetcode 75",
      subtitle: "Ace the Coding Interview",
      description: "Carefully curated set of 75 essential problems for a solid foundation.",
      count: stats.leetcode75,
      icon: CodeBracketIcon,
      href: "/leetcode/75",
      color: "from-emerald-500 to-teal-600",
      tag: "Essentials"
    },
    {
      title: "Leetcode 150",
      subtitle: "Top Interview Questions",
      description: "The gold standard set for top-tier tech companies like Google and Meta.",
      count: stats.leetcode150,
      icon: RocketLaunchIcon,
      href: "/leetcode/150",
      color: "from-blue-500 to-indigo-600",
      tag: "Elite"
    },
    {
      title: "System Design",
      subtitle: "Architectural Mastery",
      description: "Comprehensive blueprints and deep-dives into scalable system architecture.",
      count: stats.systemDesign,
      icon: CpuChipIcon,
      href: "/system-design",
      color: "from-purple-500 to-pink-600",
      tag: "L5/L6+"
    }
  ];

  const specialization = [
    { name: "Core Java", count: stats.java, href: "/learning/java", icon: AcademicCapIcon },
    { name: "Advanced DB", count: stats.database, href: "/learning/database", icon: QueueListIcon },
    { name: "React Internals", count: stats.react, href: "/learning/react", icon: CodeBracketIcon },
    { name: "MCQ Engine", count: stats.mcq, href: "/interview/mcq", icon: DocumentCheckIcon },
  ];

  const experienceTools = [
    {
      title: "Mock Interviews",
      description: "Realistic 1-on-1 simulations with staff engineers from top companies.",
      href: "/interview/mock",
      icon: ChatBubbleLeftRightIcon,
      badge: "High-Signal"
    },
    {
      title: "Coding Tests",
      description: "Time-bound challenges to sharpen your speed and accuracy under pressure.",
      href: "/interview/tests",
      icon: DocumentCheckIcon,
      badge: "Automated"
    },
    {
      title: "Interview Tips",
      description: "Insider strategies on negotiation, behavioral rounds, and whiteboarding.",
      href: "/interview/tips",
      icon: LightBulbIcon,
      badge: "Insider"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6"
          >
            <SparklesIcon className="w-4 h-4" />
            Interview Readiness Platform
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-8xl font-black gradient-text mb-8 tracking-tighter"
          >
            Mission Critical Prep.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground font-medium max-w-3xl leading-relaxed"
          >
            The comprehensive ecosystem for engineering candidates. Master the algorithms, understand the systems, and execute the perfect interview.
          </motion.p>
        </div>

        {/* Primary Tracks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {categories.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="premium-card group p-10 rounded-[48px] border border-border/50 hover:border-primary/50 transition-all duration-500 relative overflow-hidden flex flex-col h-full"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`} />
              
              <div className="flex items-start justify-between mb-8">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-xl`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <span className="px-3 py-1 bg-muted/50 rounded-full text-[10px] font-black uppercase tracking-widest border border-border">
                  {item.tag}
                </span>
              </div>

              <div className="mb-10">
                <h3 className="text-3xl font-black mb-1">{item.title}</h3>
                <p className="text-sm font-black text-primary/70 uppercase tracking-widest mb-4">{item.subtitle}</p>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-auto pt-8 border-t border-border flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="text-2xl font-black">{item.count}</span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Modules</span>
                </div>
                <Link href={item.href}>
                  <Button variant="premium" className="rounded-2xl px-6 py-6 group">
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Secondary Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
          <div className="lg:col-span-1 space-y-8">
             <h3 className="text-2xl font-black tracking-tight mb-8">Topic Deep Dives</h3>
             <div className="space-y-4">
                {specialization.map((spec) => (
                  <Link key={spec.name} href={spec.href}>
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="p-6 rounded-[32px] bg-card border border-border hover:border-primary/30 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <spec.icon className="w-5 h-5" />
                        </div>
                        <span className="font-black text-sm">{spec.name}</span>
                      </div>
                      <span className="text-xs font-black opacity-40">{spec.count}</span>
                    </motion.div>
                  </Link>
                ))}
             </div>
          </div>

          <div className="lg:col-span-3">
             <h3 className="text-2xl font-black tracking-tight mb-8 ml-4">Candidate Toolkit</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {experienceTools.map((tool) => (
                  <motion.div
                    key={tool.title}
                    whileHover={{ scale: 1.02 }}
                    className="glass-modern p-10 rounded-[40px] border border-white/10 shadow-xl flex flex-col group h-full"
                  >
                    <div className="flex items-center justify-between mb-8">
                       <tool.icon className="w-10 h-10 text-primary" />
                       <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary rounded-md">
                         {tool.badge}
                       </span>
                    </div>
                    <h4 className="text-xl font-black mb-4">{tool.title}</h4>
                    <p className="text-sm text-muted-foreground font-medium mb-10 leading-relaxed flex-grow">
                      {tool.description}
                    </p>
                    <Link href={tool.href} className="mt-auto">
                      <Button variant="outline" className="w-full rounded-2xl font-black py-7 group-hover:bg-primary group-hover:text-white transition-all">
                        Launch Experience
                      </Button>
                    </Link>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>

        {/* Confidence CTA */}
        <div className="premium-card p-12 sm:p-20 rounded-[56px] border border-primary/20 bg-primary/[0.02] text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="relative z-10">
              <h2 className="text-4xl sm:text-6xl font-black mb-8 tracking-tighter">Ready to dominate?</h2>
              <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto mb-12">
                Our curriculum is trusted by engineers now working at FAANG, OpenAI, and leading startups.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                 <Link href="/leetcode/75">
                   <Button className="rounded-2xl px-12 py-8 text-lg font-black bg-primary hover:shadow-2xl hover:shadow-primary/20 transition-all">
                     Start Training
                   </Button>
                 </Link>
                 <Link href="/services">
                   <Button variant="ghost" className="rounded-2xl px-12 py-8 text-lg font-black border border-border">
                     Book Staff Coaching
                   </Button>
                 </Link>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
