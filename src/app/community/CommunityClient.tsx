'use client';

import { motion } from "framer-motion";
import { 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon, 
  HandRaisedIcon,
  BeakerIcon,
  ArrowTopRightOnSquareIcon,
  GlobeAltIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export default function CommunityClient() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-8"
          >
            <GlobeAltIcon className="w-4 h-4" />
            Global Tech Network
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl font-black gradient-text mb-8 leading-tight"
          >
            Where Engineers Evolve Together.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground leading-relaxed font-medium"
          >
            Join 15,000+ developers in a high-signal environment. Share architectural patterns, debug complex systems, and accelerate your path to senior engineering roles.
          </motion.p>
        </div>

        {/* Community Channels */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
        >
          {[
            { 
              title: "Engineering Forum", 
              desc: "Deep-dive discussions on system design trade-offs, database scaling, and distributed patterns.",
              icon: ChatBubbleLeftRightIcon,
              action: "Enter Forum",
              stats: "1.2k Regulars"
            },
            { 
              title: "Code Reviews", 
              desc: "Get an expert pair of eyes on your Leetcode solutions or project architectures.",
              icon: BeakerIcon,
              action: "Request Review",
              stats: "450 Active Peer Reviews"
            },
            { 
              title: "Tech Battles", 
              desc: "Competitive coding sessions and architecture design shootouts. Rise through the ranks.",
              icon: SparklesIcon,
              action: "Join Arena",
              stats: "Next Battle in 2h"
            },
          ].map((card, i) => (
            <motion.div key={i} variants={itemVariants} className="premium-card p-10 rounded-[45px] group">
               <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                 <card.icon className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-black mb-4">{card.title}</h3>
               <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8">
                 {card.desc}
               </p>
               <div className="flex items-center justify-between pt-6 border-t border-border">
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {card.stats}
                 </span>
                 <Button variant="ghost" className="rounded-xl gap-2 font-black group/btn">
                    {card.action}
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                 </Button>
               </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Community Pulse Section */}
        <div className="glass dark:glass-dark rounded-[60px] p-12 sm:p-20 border border-white/10 shadow-3xl text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -ml-48 -mb-48" />
           
           <div className="relative z-10">
              <UserGroupIcon className="w-16 h-16 text-primary mx-auto mb-8" />
              <h2 className="text-4xl sm:text-6xl font-black mb-8">Ready to Contribute?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium">
                The best way to master a concept is to explain it to others. Join our contributor network and impact thousands of developers.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                 <Button className="rounded-2xl px-12 py-8 text-xl font-black shadow-xl shadow-primary/20 transition-all hover:scale-105">
                   Apply as Contributor
                 </Button>
                 <Button variant="outline" className="rounded-2xl px-12 py-8 text-xl font-black border-2 hover:bg-primary/5">
                   Visit Discord
                 </Button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
