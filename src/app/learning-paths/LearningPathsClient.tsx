'use client';

import { motion } from "framer-motion";
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  ChevronRightIcon,
  ArrowRightIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LearningPathsClient({ paths }: { paths: any[] }) {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6 inline-block">Skill Matrices</span>
          <h1 className="text-5xl sm:text-7xl font-black gradient-text mb-8 leading-tight">
            Curated Learning Paths.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Stop wandering. Follow precision-engineered roadmaps designed by industry veterans to take you from hello world to system architect.
          </p>
        </div>

        {/* Paths Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {paths.map((path, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Link href={`/${path.slug}`}>
                <div className="premium-card p-10 rounded-[40px] group h-full flex flex-col justify-between hover:-translate-y-2 transition-all duration-300">
                  <div>
                    <div className="flex justify-between items-start mb-8">
                       <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                         <BookOpenIcon className="w-7 h-7" />
                       </div>
                       <span className="px-3 py-1 rounded-full bg-card border border-border text-[10px] font-black uppercase tracking-widest">
                         {path.difficulty}
                       </span>
                    </div>
                    <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{path.title}</h3>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8">
                      {path.desc}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      {path.topics} Modules
                    </span>
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <ChevronRightIcon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Global CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-24 p-12 rounded-[50px] bg-gradient-to-br from-indigo-600 to-primary text-white text-center shadow-3xl shadow-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <SparklesIcon className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl font-black mb-6">Need a custom curriculum?</h2>
            <p className="text-primary-foreground/80 mb-10 font-medium">
              Join 15,000+ developers in our community and get personalized advice on which path fits your current career goals.
            </p>
            <Link href="/community">
              <Button variant="secondary" className="rounded-2xl px-12 py-8 text-xl font-black text-primary hover:scale-105 transition-all">
                Join the Forum
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
