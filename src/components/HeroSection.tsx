'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Rocket, ArrowRight, Sparkles, BookOpen, Layers, Flame, Trophy } from 'lucide-react';

type QuickStart = {
  url: string;
  title: string;
};

type HeroSectionProps = {
  showViewProfile: boolean;
  quickStart: QuickStart;
  fetchQuickStart: () => QuickStart;
  className?: string;
};

const POPULAR_SEARCHES = [
  { label: 'System Design Blueprints', href: '/system-design', icon: '📐' },
  { label: 'Kafka vs RabbitMQ', href: '/tech-battles', icon: '⚔️' },
  { label: 'Rate Limiter Sandbox', href: '/system-design/flows', icon: '⚡' },
  { label: 'Java Architecture', href: '/learning/java', icon: '☕' },
  { label: 'React Architecture', href: '/learning/react', icon: '⚛️' },
  { label: 'Two Sum Solution', href: '/leetcode/1-two-sum', icon: '💻' },
];

export const HeroSection = ({ showViewProfile, quickStart, className }: HeroSectionProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/leetcode?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <section className={`relative overflow-hidden pt-36 pb-20 bg-background ${className || ''}`}>
      {/* Cinematic Glowing Background Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 select-none pointer-events-none">
        <div className="absolute top-[-10%] left-[-15%] w-[520px] h-[520px] bg-primary/10 blur-[130px] rounded-full animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[580px] h-[580px] bg-indigo-500/10 blur-[140px] rounded-full animate-pulse duration-[10000ms] [animation-delay:3s]" />
        <div className="absolute top-[35%] left-[25%] w-[320px] h-[320px] bg-purple-500/5 blur-[110px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293704_1px,transparent_1px),linear-gradient(to_bottom,#1f293704_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-7">
        {/* Floating Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-widest shadow-sm"
        >
          <Rocket className="w-3.5 h-3.5 fill-primary text-primary" />
          <span>The #1 Engineering Learning & Interview Platform</span>
        </motion.div>

        {/* Primary Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.04] text-foreground max-w-5xl mx-auto">
          Master the <span className="gradient-text">Architecture</span> of Modern Software
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl lg:text-2xl max-w-3xl mx-auto text-muted-foreground leading-relaxed font-medium">
          Step-by-step LeetCode breakdowns in 3 languages, interactive 60fps system flow sandboxes, 415+ architectural trade-offs, and FAANG interview roadmaps.
        </p>

        {/* Hero Interactive Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-2xl mx-auto pt-2"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center rounded-2xl glass dark:glass-dark p-2 border border-primary/20 shadow-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
          >
            <div className="pl-3 text-muted-foreground">
              <MagnifyingGlassIcon className="w-6 h-6 text-primary" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 8,200+ algorithms, system designs, tech battles..."
              className="w-full bg-transparent border-none px-4 py-2 text-sm sm:text-base text-foreground focus:outline-none placeholder:text-muted-foreground font-medium"
              aria-label="Search learning topics and solutions"
            />
            <Button
              type="submit"
              size="sm"
              className="h-10 px-5 rounded-xl font-black text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-white shrink-0 shadow-md shadow-primary/20"
            >
              Search
            </Button>
          </form>

          {/* Quick Query Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs">
            <span className="text-muted-foreground font-bold flex items-center mr-1">
              <Flame className="w-3.5 h-3.5 text-orange-500 mr-1" /> Popular:
            </span>
            {POPULAR_SEARCHES.map((chip) => (
              <Link
                key={chip.label}
                href={chip.href}
                className="px-3 py-1 rounded-full bg-card/60 border border-border/80 hover:border-primary/40 text-muted-foreground hover:text-primary transition-colors text-[11px] font-semibold flex items-center gap-1 shadow-2xs backdrop-blur-xs"
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Primary CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
        >
          <Link href="/learning">
            <Button
              size="lg"
              className="h-14 px-8 text-sm rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/45 transition-all font-black uppercase tracking-wider flex items-center justify-center gap-2 group"
            >
              <BookOpen className="w-4 h-4" />
              Explore Learning Tracks
              <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/system-design/flows">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-sm rounded-2xl border-2 border-primary/20 hover:bg-primary/5 transition-all font-black uppercase tracking-wider flex items-center justify-center gap-2 bg-slate-50/50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200"
            >
              <Layers className="w-4 h-4 text-primary" />
              Launch System Flows Sandbox
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Live Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="pt-10 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { count: '8,200+', label: 'Coding Solutions', sub: 'LeetCode & GFG' },
              { count: '180+', label: 'System Blueprints', sub: 'Microservices & Scale' },
              { count: '415', label: 'Tech Battles', sub: 'Benchmark Decisions' },
              { count: '100%', label: 'Free & Open', sub: 'Zero Paywalls' },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl glass dark:glass-dark border border-white/10 shadow-sm text-center"
              >
                <div className="text-2xl sm:text-3xl font-black text-foreground gradient-text">{stat.count}</div>
                <div className="text-xs font-black uppercase tracking-wider text-foreground/90 mt-0.5">{stat.label}</div>
                <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
