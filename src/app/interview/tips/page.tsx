'use client';

import { motion } from "framer-motion";
import { 
  LightBulbIcon, 
  ChevronLeftIcon,
  AcademicCapIcon,
  BoltIcon,
  ShieldCheckIcon,
  ChatBubbleBottomCenterTextIcon
} from "@heroicons/react/24/outline";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

const tips = [
  {
    title: "Solution Optimization",
    category: "Technical Strategy",
    description: "Learn to analyze time and space complexity to impress interviewers. Focus on writing efficient code by understanding constraints.",
    icon: BoltIcon,
    highlights: [
      "Always analyze O(n) vs O(1) trade-offs before typing.",
      "Identify the 'Bottle Neck' in brute force approaches (O(n²) -> O(n)).",
      "Test with minimal edge cases (empty set, single node) immediately.",
      "Example: Using a Hash Map for 'Two Sum' transforms an O(n²) problem into linear time."
    ],
    color: "from-amber-500 to-orange-600"
  },
  {
    title: "Articulation & Flow",
    category: "Communication",
    description: "Master the art of explaining your thought process clearly to demonstrate problem-solving skills and build rapport.",
    icon: ChatBubbleBottomCenterTextIcon,
    highlights: [
      "Restate the problem in your own words to confirm alignment.",
      "Narrate your logic even when you are stuck; interviewers value the 'how'.",
      "Ask clarifying questions about constraints (negatives, duplicates).",
      "Draft a high-level algorithm on the whiteboard before implementation."
    ],
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: "Edge Case Hardening",
    category: "Reliability",
    description: "Discover strategies to identify and address edge cases ensuring your solutions are production-ready and robust.",
    icon: ShieldCheckIcon,
    highlights: [
      "Validate null inputs and empty data structures at the method start.",
      "Check extreme numerical values (Max Int, Min Int).",
      "Handle cycles in graph/linked list problems (Floyd's Cycle Finding).",
      "Ensure recursive calls have well-defined base cases to avoid stack overflow."
    ],
    color: "from-emerald-500 to-teal-600"
  },
];

export default function InterviewTipsPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="mb-12">
          <Link href="/interview">
            <Button variant="ghost" className="rounded-2xl gap-2 font-black group px-6 py-6 hover:bg-card border border-transparent hover:border-border transition-all">
              <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Hub
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6"
          >
            <AcademicCapIcon className="w-4 h-4" />
            Engineer's Field Guide
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black gradient-text mb-8 tracking-tighter"
          >
            The Interview Playbook.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground font-medium max-w-3xl leading-relaxed"
          >
            Tactical strategies used by senior engineers to navigate complex technical rounds and behavioral evaluations at world-class companies.
          </motion.p>
        </div>

        {/* Tips Stack */}
        <div className="space-y-12">
          {tips.map((tip, idx) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-modern overflow-hidden rounded-[48px] border border-white/10 shadow-2xl flex flex-col lg:flex-row group"
            >
              <div className={`lg:w-1/3 p-12 bg-gradient-to-br ${tip.color} relative overflow-hidden flex flex-col justify-center`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 text-white">
                  <tip.icon className="w-20 h-20 mb-8 opacity-20 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/70 block mb-2">{tip.category}</span>
                  <h2 className="text-4xl font-black tracking-tight">{tip.title}</h2>
                </div>
                {/* Visual grid overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              </div>
              
              <div className="lg:w-2/3 p-12 sm:p-16 flex flex-col justify-center">
                 <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-10">
                   {tip.description}
                 </p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {tip.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex gap-4 group/item">
                         <div className="w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all">
                            <span className="text-[10px] font-black">{hIdx + 1}</span>
                         </div>
                         <p className="text-sm font-bold text-foreground/80 leading-relaxed">{highlight}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
           <div className="p-10 rounded-[40px] bg-primary/5 border border-primary/20 group">
              <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                 <LightBulbIcon className="w-6 h-6 text-primary" />
                 Last Minute Check
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed mb-8">
                Is your camera framed correctly? Is your environment quiet? Have you tested your internet latency? The small details matter in remote rounds.
              </p>
              <Button variant="link" className="p-0 h-auto font-black text-primary group-hover:text-indigo-600 transition-colors">
                 Full Pre-Interview Checklist →
              </Button>
           </div>
           
           <div className="p-10 rounded-[40px] bg-card border border-border group">
              <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                 <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-primary" />
                 Post-Interview Flow
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed mb-8">
                Send a technical thank-you note within 24 hours. Reference a specific challenge discussed during the round to show you were engaged.
              </p>
              <Button variant="link" className="p-0 h-auto font-black text-primary group-hover:text-indigo-600 transition-colors">
                 Thank You Letter Templates →
              </Button>
           </div>
        </div>

      </div>
    </div>
  );
}
