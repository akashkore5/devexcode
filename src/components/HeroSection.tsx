'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from './ui/button';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Rocket, ArrowRight, Sparkles } from 'lucide-react';

type QuickStart = {
    url: string;
    title: string;
}

type HeroSectionProps = {
    showViewProfile: boolean;
    quickStart: QuickStart;
    fetchQuickStart: () => QuickStart;
    className?: string;
}

export const HeroSection = ({ showViewProfile, quickStart, fetchQuickStart, className }: HeroSectionProps) => {
    return (
        <section className={`relative overflow-hidden pt-36 pb-24 bg-background ${className || ''}`}>
            
            {/* Cinematic Glowing Background Mesh */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 select-none pointer-events-none">
                <div className="absolute top-[-10%] left-[-15%] w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full animate-pulse duration-[8000ms]" />
                <div className="absolute bottom-[-15%] right-[-15%] w-[550px] h-[550px] bg-indigo-500/10 blur-[140px] rounded-full animate-pulse duration-[10000ms] [animation-delay:3s]" />
                <div className="absolute top-[35%] left-[25%] w-[300px] h-[300px] bg-purple-500/5 blur-[110px] rounded-full" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293704_1px,transparent_1px),linear-gradient(to_bottom,#1f293704_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container mx-auto px-4 text-center relative z-10 space-y-6">
                
                {/* Floating badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black uppercase tracking-widest shadow-sm border-dashed"
                >
                    <Rocket className="w-3.5 h-3.5 fill-primary text-primary" />
                    <span>Your journey to engineering excellence starts here</span>
                </motion.div>

                {/* Primary Title */}
                <motion.h1 
                    initial={{ opacity: 0, y: -25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 tracking-tighter leading-[1.02]"
                >
                    Master the <span className="gradient-text">Future</span> of <br />
                    Technical Interviews
                </motion.h1>

                {/* Description */}
                <motion.p 
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                    className="text-lg sm:text-xl sm:text-2xl max-w-3xl mx-auto mb-12 text-muted-foreground leading-relaxed font-medium"
                >
                    Join 15,000+ developers acing their interviews with high-quality Leetcode solutions, 
                    interactive system design sandboxes, and real-time backend telemetry playgrounds.
                </motion.p>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                    className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
                >
                    {showViewProfile ? (
                        <Link href="/profile">
                            <Button size="lg" className="h-14 px-8 text-sm rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/45 transition-all font-black uppercase tracking-wider flex items-center justify-center gap-2 group">
                                View Profile
                                <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    ) : (
                         <Link href={quickStart.url}>
                            <Button size="lg" className="h-14 px-8 text-sm rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/45 transition-all font-black uppercase tracking-wider flex items-center justify-center gap-2 group">
                                Quick Start: {quickStart.title}
                                <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    )}
                    <Link href="/system-design/flows">
                        <Button size="lg" variant="outline" className="h-14 px-8 text-sm rounded-2xl border-2 border-primary/20 hover:bg-primary/5 transition-all font-black uppercase tracking-wider flex items-center justify-center gap-1.5 bg-slate-50/50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200">
                            Explore Flows Sandbox <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
