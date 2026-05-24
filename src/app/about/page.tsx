'use client';

import { motion } from "framer-motion";
import {
  CodeBracketIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  StarIcon,
  BellIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CpuChipIcon,
  CubeTransparentIcon,
} from "@heroicons/react/24/outline";
import { 
  Sparkles, Cpu, Layers, Activity, Shield, Users, 
  Calendar, MapPin, ArrowRight, Award, Terminal 
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const timelineData = [
  {
    year: "2024",
    title: "The Genesis",
    subtitle: "Algorithmic Foundations",
    desc: "DevExCode was founded to revolutionize technical interview prep, introducing dynamic visual catalogs mapping 7,500+ LeetCode patterns.",
    icon: CodeBracketIcon,
    color: "from-blue-600 to-indigo-600 shadow-indigo-500/20"
  },
  {
    year: "2025",
    title: "Blueprint Expansion",
    subtitle: "System Architecture Blueprints",
    desc: "We scaled our curriculum, publishing 75+ advanced end-to-end System Design architectures, mapping distributed caching, Kafka event streams, and relational shard models.",
    icon: Cpu,
    color: "from-purple-600 to-pink-600 shadow-purple-500/20"
  },
  {
    year: "2026",
    title: "Telemetry Sandboxes",
    subtitle: "6 Master Visual Flows",
    desc: "Pioneered production-grade live telemetry sandboxes. Candidates trace container builds, HPA policies, load balancer rerouting, and DNS resolutions interactively.",
    icon: Activity,
    color: "from-emerald-600 to-teal-600 shadow-emerald-500/20"
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 overflow-hidden relative">
      
      {/* Cinematic Glowing Background Mesh */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 select-none">
        <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[130px] animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] animate-pulse duration-[10000ms]" />
        <div className="absolute top-[50%] left-[20%] w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293706_1px,transparent_1px),linear-gradient(to_bottom,#1f293706_1px,transparent_1px)] bg-[size:6rem_6rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-24"
        >
          
          {/* ==========================================================
              HERO STORY SECTION
             ========================================================== */}
          <motion.section variants={itemVariants} className="text-center max-w-4xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-2 border border-primary/20 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-primary text-primary" />
              Our Story
            </span>
            <h1 className="text-5xl sm:text-7xl font-black gradient-text tracking-tighter mb-6 leading-[1.05]">
              Architecting the Next Generation of Developers.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-medium">
              DevExCode started with a simple belief: high-quality technical education should be as intuitive and telemetry-driven as the best modern developer tooling. We've built an interactive ecosystem where 15,000+ engineers master technical interviews through hands-on system designs.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
               <Link href="/community">
                 <Button className="rounded-2xl px-10 py-7 text-sm font-black shadow-xl shadow-primary/25 transition-all hover:scale-105 active:scale-95 uppercase tracking-wider">
                   Join the Community
                 </Button>
               </Link>
               <Link href="/system-design/flows">
                 <Button variant="outline" className="rounded-2xl px-10 py-7 text-sm font-black border-2 border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95 uppercase tracking-wider flex items-center gap-1.5">
                   Launch Sandbox <ArrowRight className="w-4 h-4" />
                 </Button>
               </Link>
            </div>
          </motion.section>

          {/* ==========================================================
              STATS GRID SECTION
             ========================================================== */}
          <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 p-10 sm:p-12 glass dark:glass-dark rounded-[40px] border border-slate-200 dark:border-white/5 relative overflow-hidden group shadow-lg dark:shadow-2xl flex flex-col justify-between min-h-[350px]">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                 <CubeTransparentIcon className="w-64 h-64 text-primary" />
               </div>
               <div>
                 <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-6">Our Mission & Vision</h2>
                 <div className="space-y-5 text-muted-foreground font-medium text-sm leading-relaxed">
                   <p>
                     At <span className="text-slate-900 dark:text-white font-black">DevExCode</span>, we bridge the gap between academic theory and industry reality. We're not just helping you pass tests—we're teaching you first-principles architectural thinking.
                   </p>
                   <p>
                     With <span className="text-slate-900 dark:text-white font-bold">7,500+ Leetcode solutions</span>, <span className="text-slate-900 dark:text-white font-bold">75+ Systems Designs</span>, and <span className="text-slate-900 dark:text-white font-bold">6 interactive telemetry flows</span>, we provide structural blueprints for technical excellence.
                   </p>
                 </div>
               </div>
               <div className="mt-8 flex gap-3">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                   <Award className="w-5 h-5" />
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
                   <Shield className="w-5 h-5" />
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                   <Cpu className="w-5 h-5" />
                 </div>
               </div>
            </div>
            
            <div className="lg:col-span-6 grid grid-cols-2 gap-6 self-stretch">
               {[
                 { label: "FAANG Offers", value: "2.4k+", color: "from-blue-500 to-indigo-600" },
                 { label: "Elite Members", value: "15k+", color: "from-purple-500 to-violet-600" },
                 { label: "Design Sheets", value: "75+", color: "from-emerald-500 to-teal-600" },
                 { label: "Telemetry Flows", value: "6 Flows", color: "from-orange-500 to-amber-600" },
               ].map((stat, i) => (
                 <motion.div 
                   key={i} 
                   whileHover={{ y: -8 }}
                   className="glass dark:glass-dark p-8 rounded-3xl border border-slate-200 dark:border-white/5 flex flex-col justify-between shadow-md dark:shadow-xl relative overflow-hidden group cursor-pointer"
                 >
                    {/* Glowing background on hover */}
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-500 pointer-events-none`} />
                    
                    <span className={`text-4xl sm:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent tracking-tight`}>
                      {stat.value}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      {stat.label}
                    </span>
                 </motion.div>
               ))}
            </div>
          </motion.section>

          {/* ==========================================================
              INTERACTIVE CORE PILLARS SECTION
             ========================================================== */}
          <motion.section variants={itemVariants} className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Core Engineering Pillars
              </h2>
              <p className="text-muted-foreground font-medium text-sm">
                Educational paradigms designed for systems engineers, not stack-overflow memorizers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Cpu, 
                  title: "First-Principles Blueprinting", 
                  desc: "Learn from deep layers up. Map standard algorithms to database indexes, TCP handshakes, TLS verification algorithms, and dynamic CPU limits directly.",
                  border: "hover:border-indigo-500/30"
                },
                { 
                  icon: Activity, 
                  title: "Live Sandbox Telemetry", 
                  desc: "Visualize concurrent socket operations, Nginx hearthbeat probe failovers, DNS recursive resolvers, and Jenkins continuous integrations in live 60fps sandboxes.",
                  border: "hover:border-purple-500/30"
                },
                { 
                  icon: Shield, 
                  title: "Production-Grade Rigor", 
                  desc: "Prep for L5/L6+ staff positions. Deep-dive into cache stampedes, Volatile-LRU memory evictions, asymmetrically signed JWT payloads, and Karpenter provisioning limits.",
                  border: "hover:border-emerald-500/30"
                },
              ].map((pillar, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -6 }}
                  className={`glass dark:glass-dark p-8 rounded-[32px] border border-slate-200 dark:border-white/5 transition-all duration-300 relative group overflow-hidden ${pillar.border}`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    <pillar.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                    {pillar.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ==========================================================
              DEVEXCODE CHRONOLOGY TIMELINE
             ========================================================== */}
          <motion.section variants={itemVariants} className="space-y-12 relative">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Chronology & Evolution
              </h2>
              <p className="text-muted-foreground font-medium text-sm">
                Tracing our engineering trajectory from simple pattern mapping to live cluster simulations.
              </p>
            </div>

            {/* Vertical timeline timeline component */}
            <div className="max-w-4xl mx-auto relative pt-8 pb-4">
              
              {/* Connecting line */}
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 border-l border-dashed border-slate-200 dark:border-white/5 -translate-x-1/2 hidden md:block" />

              <div className="space-y-12">
                {timelineData.map((milestone, idx) => {
                  const Icon = milestone.icon;
                  const isLeft = idx % 2 === 0;

                  return (
                    <div key={milestone.year} className="flex flex-col md:flex-row items-start md:items-center relative">
                      
                      {/* Timeline Central Badge Indicator */}
                      <div className="absolute left-6 md:left-1/2 w-10 h-10 -translate-x-1/2 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-md z-10">
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content block left or right alignment */}
                      <div className={`w-full md:w-1/2 ${isLeft ? "md:pr-16 md:text-right" : "md:pl-16 md:order-2"}`}>
                        <div className="pl-16 md:pl-0 space-y-2">
                          <span className={`inline-block px-3 py-1 rounded-full bg-gradient-to-br ${milestone.color} text-white text-[9px] font-black uppercase tracking-wider`}>
                            {milestone.year}
                          </span>
                          <h4 className="text-xl font-black text-slate-900 dark:text-white leading-none">
                            {milestone.title}
                          </h4>
                          <span className="text-[10px] uppercase font-black tracking-widest text-indigo-600 dark:text-indigo-400 block">
                            {milestone.subtitle}
                          </span>
                          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                            {milestone.desc}
                          </p>
                        </div>
                      </div>

                      {/* Empty spacer block to maintain symmetric alignment */}
                      <div className="hidden md:block w-1/2" />
                    </div>
                  );
                })}
              </div>

            </div>
          </motion.section>

          {/* ==========================================================
              THE TEAM / LEADERSHIP SECTION
             ========================================================== */}
          <motion.section variants={itemVariants} className="glass dark:glass-dark rounded-[48px] p-12 sm:p-20 border border-slate-200 dark:border-white/5 shadow-2xl text-center relative overflow-hidden">
             {/* Radial backdrop glows inside card */}
             <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

             <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-16 relative">
               The Tech Architects
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
               {[
                 { name: "Akash Kore", role: "Chief Systems Architect", bio: "Fascinated by elegant abstraction structures, multi-threading CPU mappings, and high-performance algorithms." },
                 { name: "Vipul Sukhdeve", role: "Distributed Systems Specialist", bio: "Infrastructure engineer focusing on container topologies, AWS cluster optimization, and GitOps pipelines." },
                 { name: "Yogesh Pandav", role: "UI/UX Learning Strategist", bio: "Transforms technical complexities into intuitive visual layouts, micro-animations, and educational flows." },
               ].map((member, i) => (
                 <div key={i} className="space-y-5">
                    {/* Pulsing Avatar glow */}
                    <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-slate-200 dark:border-white/5 p-1.5 shadow-md flex items-center justify-center relative group select-none">
                       <div className="absolute inset-0 rounded-full bg-indigo-500/5 group-hover:scale-105 transition-all duration-300 blur-sm" />
                       <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center text-2xl font-black text-indigo-600 dark:text-indigo-400 relative z-10 shadow-inner">
                         {member.name.split(' ').map(n => n[0]).join('')}
                       </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1">
                        {member.name}
                      </h4>
                      <p className="text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px] uppercase tracking-widest mb-3">
                        {member.role}
                      </p>
                      <p className="text-muted-foreground text-xs font-medium leading-relaxed max-w-[240px] mx-auto">
                        {member.bio}
                      </p>
                    </div>
                 </div>
               ))}
             </div>
          </motion.section>

          {/* ==========================================================
              PREMIUM GLASSMORPHIC CTA FOOTER
             ========================================================== */}
          <motion.section variants={itemVariants} className="text-center p-12 sm:p-20 bg-gradient-to-r from-indigo-950/70 via-purple-950/75 to-indigo-950/70 border border-indigo-500/20 backdrop-blur-md rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
             {/* Carbon fibers overlay */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
             
             {/* Ambient glows inside CTA */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

             <div className="relative z-10 px-4 space-y-6">
               <h2 className="text-4xl sm:text-6xl font-black tracking-tighter">Ready to Level Up?</h2>
               <p className="text-indigo-200/80 text-sm sm:text-base mb-8 max-w-2xl mx-auto font-semibold leading-relaxed">
                 Join 15,000+ software engineers building their careers on a foundation of first-principles technical excellence.
               </p>
               <div className="flex flex-wrap justify-center gap-4 pt-4">
                 <Link href="/auth/signup">
                   <Button className="rounded-2xl px-12 py-8 text-sm font-black transition-all hover:scale-105 active:scale-95 bg-white text-indigo-950 hover:bg-slate-50 shadow-xl shadow-white/5 uppercase tracking-wider">
                     Get Started Free
                   </Button>
                 </Link>
                 <Link href="/contact">
                   <Button variant="outline" className="rounded-2xl px-12 py-8 text-sm font-black border-white/20 hover:bg-white/5 transition-all text-white active:scale-95 uppercase tracking-wider">
                     Contact Team
                   </Button>
                 </Link>
               </div>
             </div>
          </motion.section>

        </motion.div>
      </div>
    </div>
  );
}
