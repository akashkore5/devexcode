'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
        <section className={`py-20 text-center ${className}`}>
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4"
            >
                Welcome to DevExCode
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl max-w-3xl mx-auto mb-8"
            >
                Your one-stop platform for mastering coding interviews and system design.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-center space-x-4"
            >
                {showViewProfile ? (
                    <Link href="/profile">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow-md">
                            View Profile
                        </motion.button>
                    </Link>
                ) : (
                     <Link href={quickStart.url}>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow-md">
                            Quick Start: {quickStart.title}
                        </motion.button>
                    </Link>
                )}
            </motion.div>
        </section>
    );
};
