'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from './ui/button';
import { RocketLaunchIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

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
        <section className={`relative overflow-hidden pt-32 pb-20 ${className}`}>
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
            </div>

            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8"
                >
                    <RocketLaunchIcon className="w-4 h-4" />
                    <span>Your journey to engineering excellence starts here</span>
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight"
                >
                    Master the <span className="gradient-text">Future</span> of <br />
                    Technical Interviews
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl sm:text-2xl max-w-3xl mx-auto mb-12 text-muted-foreground leading-relaxed"
                >
                    Join 10,000+ developers acing their interviews with high-quality Leetcode solutions, 
                    deep system design dives, and daily technical insights.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col sm:flex-row justify-center items-center gap-4"
                >
                    {showViewProfile ? (
                        <Link href="/profile">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-semibold">
                                View Profile
                                <ChevronRightIcon className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    ) : (
                         <Link href={quickStart.url}>
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-semibold">
                                Quick Start: {quickStart.title}
                                <ChevronRightIcon className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    )}
                    <Link href="/leetcode">
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 border-primary/20 hover:bg-primary/5 transition-all font-semibold">
                            Explore All Problems
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
