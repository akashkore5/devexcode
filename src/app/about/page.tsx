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
import Link from "next/link";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function About() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-24"
        >
          {/* Hero Section */}
          <motion.section variants={itemVariants} className="text-center max-w-4xl mx-auto">
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6 inline-block">Our Story</span>
            <h1 className="text-5xl sm:text-7xl font-black gradient-text mb-8 leading-[1.1]">
              Architecting the Next Generation of Developers.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              DevExCode started with a simple belief: high-quality technical education should be as intuitive as the best user experiences. We've built a ecosystem where 15,000+ developers master the art of the interview through precision-crafted content.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <Link href="/community">
                 <Button className="rounded-2xl px-10 py-7 text-lg font-black shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">Join the Community</Button>
               </Link>
               <Link href="/leetcode">
                 <Button variant="outline" className="rounded-2xl px-10 py-7 text-lg font-black border-2 transition-all hover:bg-primary/5 active:scale-95">Explore Problems</Button>
               </Link>
            </div>
          </motion.section>

          {/* Core Intent Section */}
          <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="premium-card p-12 rounded-[40px] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                 <CubeTransparentIcon className="w-48 h-48 text-primary" />
               </div>
               <h2 className="text-3xl font-black mb-6 relative">Our Mission & Vision</h2>
               <div className="space-y-6 text-muted-foreground relative">
                 <p className="text-lg leading-relaxed">
                   At <span className="text-foreground font-black">DevExCode</span>, we bridge the gap between academic theory and industry reality. We're not just solving problems—we're teaching architectural thinking.
                 </p>
                 <p className="text-lg leading-relaxed">
                   With <span className="text-foreground font-bold">7500+ Leetcode solutions</span> and <span className="text-foreground font-bold">75+ Systems Designs</span>, we provide the blueprints for technical excellence.
                 </p>
               </div>
               <div className="mt-8 flex gap-3 relative">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                   <StarIcon className="w-6 h-6" />
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                   <StarIcon className="w-6 h-6" />
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                   <StarIcon className="w-6 h-6" />
                 </div>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
               {[
                 { label: "FAANG Hires", value: "2.4k+", color: "primary" },
                 { label: "Community Members", value: "15k+", color: "indigo" },
                 { label: "Problem Sets", value: "7.5k", color: "emerald" },
                 { label: "Interactive Tools", value: "12+", color: "rose" },
               ].map((stat, i) => (
                 <div key={i} className="glass dark:glass-dark p-8 rounded-[32px] border border-white/5 flex flex-col justify-between h-48 shadow-xl">
                    <span className="text-4xl font-black gradient-text">{stat.value}</span>
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                 </div>
               ))}
            </div>
          </motion.section>

          {/* Services Grid */}
          <motion.section variants={itemVariants} className="space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-black mb-4">What We Engineer</h2>
              <p className="text-muted-foreground font-medium">Tools designed for deep learning, not just memorization.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: BellIcon, title: "Tech Terminals", desc: "Daily precision-focused micro-lessons delivered to your device." },
                { icon: BookOpenIcon, title: "Micro-Learns", desc: "Complex systems like Kafka & Docker explained in 10-minute deep dives." },
                { icon: AcademicCapIcon, title: "Career Matrices", desc: "Curated learning paths specifically mapped to big tech career rungs." },
                { icon: CodeBracketIcon, title: "Algorithm DNA", desc: "Solutions cross-referenced by company, frequency, and trade-off patterns." },
                { icon: CpuChipIcon, title: "System Blueprints", desc: "End-to-end architectural designs for global scalable platforms." },
                { icon: UserGroupIcon, title: "Pulse Community", desc: "A high-signals forum for elite engineering discussion and battle." },
              ].map((service, i) => (
                <div key={i} className="premium-card p-10 rounded-[35px] group hover:-translate-y-2 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-primary/10">
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Team Section */}
          <motion.section variants={itemVariants} className="glass dark:glass-dark rounded-[50px] p-12 sm:p-20 border border-white/10 shadow-3xl text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-32 -mb-32" />

             <h2 className="text-4xl font-black mb-16 relative">The Architects</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
               {[
                 { name: "Akash Kore", role: "Chief Architect", bio: "Loves elegant abstractions and high-performance algorithms." },
                 { name: "Vipul Sukhdeve", role: "Systems Specialist", bio: "Expert in distributed systems and cloud native architecture." },
                 { name: "Yogesh Pandav", role: "Learning Strategist", bio: "Transforms technical complexity into intuitive educational journeys." },
               ].map((member, i) => (
                 <div key={i} className="space-y-6">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-indigo-500/20 border-2 border-primary/20 p-2 shadow-2xl">
                       <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-4xl font-black text-primary/40">
                         {member.name.split(' ').map(n => n[0]).join('')}
                       </div>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black mb-1">{member.name}</h4>
                      <p className="text-primary font-bold text-xs uppercase tracking-widest mb-4">{member.role}</p>
                      <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[250px] mx-auto">{member.bio}</p>
                    </div>
                 </div>
               ))}
             </div>
          </motion.section>

          {/* CTA Footer */}
          <motion.section variants={itemVariants} className="text-center py-20 bg-primary rounded-[50px] text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
             <div className="relative z-10 px-8">
               <h2 className="text-4xl sm:text-6xl font-black mb-8">Ready to Level Up?</h2>
               <p className="text-primary-foreground/80 text-lg mb-12 max-w-2xl mx-auto font-medium">
                 Join 15,000+ developers who are building their careers on a foundation of technical excellence.
               </p>
               <div className="flex flex-wrap justify-center gap-4">
                 <Link href="/auth/signup">
                   <Button variant="secondary" className="rounded-2xl px-12 py-8 text-xl font-black transition-all hover:scale-105 active:scale-95 text-primary">Get Started Free</Button>
                 </Link>
                 <Link href="/contact">
                   <Button variant="outline" className="rounded-2xl px-12 py-8 text-xl font-black border-white/20 hover:bg-white/10 transition-all text-white active:scale-95">Contact Team</Button>
                 </Link>
               </div>
             </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
