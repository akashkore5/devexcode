'use client';

import { motion } from "framer-motion";
import { 
  QuestionMarkCircleIcon, 
  ChevronLeftIcon,
  AcademicCapIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import mcqTopics from "../../../data/mcq_topics.json";

export default function MCQHubPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="mb-12">
          <Link href="/interview">
            <Button variant="ghost" className="rounded-2xl gap-2 font-black group px-6 py-6 border border-transparent hover:border-border transition-all">
              <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Hub
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
           <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6"
              >
                <BoltIcon className="w-4 h-4" />
                Gamified Knowledge Verification
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl sm:text-8xl font-black gradient-text mb-8 tracking-tighter"
              >
                MCQ Arena.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-muted-foreground font-medium leading-relaxed"
              >
                Quick-fire rounds to sharpen your recall. Master the technical details that separate lead engineers from seniors.
              </motion.p>
           </div>
           
           <div className="flex gap-4">
              <div className="glass-modern p-6 rounded-[32px] border border-white/10 flex flex-col items-center min-w-[120px]">
                 <FireIcon className="w-6 h-6 text-orange-500 mb-2" />
                 <span className="text-2xl font-black">12</span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Day Streak</span>
              </div>
              <div className="glass-modern p-6 rounded-[32px] border border-white/10 flex flex-col items-center min-w-[120px]">
                 <TrophyIcon className="w-6 h-6 text-yellow-500 mb-2" />
                 <span className="text-2xl font-black">2.4k</span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Pts</span>
              </div>
           </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mcqTopics.map((topic, index) => (
            <motion.div
              key={topic.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="premium-card group p-10 rounded-[48px] border border-border/50 hover:border-primary/50 transition-all duration-500 relative overflow-hidden flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 rounded-[24px] bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-primary/20">
                  <QuestionMarkCircleIcon className="w-8 h-8" />
                </div>
                <div className="flex flex-col items-end">
                   <span className="px-3 py-1 bg-muted/50 rounded-full text-[10px] font-black uppercase tracking-widest border border-border">
                     {topic.difficulty}
                   </span>
                </div>
              </div>

              <div className="mb-10 flex-grow">
                <h3 className="text-2xl font-black mb-4 tracking-tighter group-hover:text-primary transition-colors">{topic.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed line-clamp-3">
                  {topic.description}
                </p>
              </div>

              <div className="pt-8 border-t border-border flex items-center justify-between">
                <div className="flex gap-6">
                   <div className="flex flex-col">
                      <span className="text-lg font-black">{topic.noOfQuestions}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Ques</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-lg font-black">{topic.timeInMinutes}m</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Limit</span>
                   </div>
                </div>
                
                <Link href={`/mcq/${topic.slug}`}>
                  <Button variant="premium" className="rounded-2xl px-6 py-6 group">
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              {/* Progress Bar (Simulated) */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                 <div className="h-full bg-primary/20 w-[40%] group-hover:w-[60%] transition-all duration-1000" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Leaderboard Call (Teaser) */}
        <div className="mt-20 premium-card p-12 sm:p-20 rounded-[56px] border border-white/10 shadow-3xl flex flex-col items-center text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-indigo-500/5" />
           <div className="relative z-10 max-w-2xl">
              <AcademicCapIcon className="w-16 h-16 text-primary mb-8 mx-auto opacity-40" />
              <h2 className="text-4xl sm:text-6xl font-black mb-8 tracking-tighter">Enter the Hall of Fame.</h2>
              <p className="text-muted-foreground text-lg font-medium mb-12">
                Compete with over 150,000+ developers globally. Top performers get priority access to our Staff Engineering coaching network.
              </p>
              <Button className="rounded-2xl px-12 py-8 text-lg font-black bg-primary hover:shadow-2xl hover:shadow-primary/20 transition-all">
                Join Global Leaderboard
              </Button>
           </div>
        </div>

      </div>
    </div>
  );
}
