'use client';

import { motion } from "framer-motion";
import { 
  BookOpenIcon, 
  ChevronRightIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/Breadcrumb";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LearningPathsClient({ paths }: { paths: any[] }) {
  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumb
          items={[
            { name: "Home", path: "/" },
            { name: "Learning Paths", path: "/learning-paths" },
          ]}
        />

        {/* Header */}
        <div className="max-w-3xl my-12">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6 inline-block">Skill Matrices</span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black gradient-text mb-6 leading-tight">
            Curated Learning Paths.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
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
                <div className="premium-card p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] group h-full flex flex-col justify-between hover:-translate-y-2 transition-all duration-300">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                         <BookOpenIcon className="w-7 h-7" />
                       </div>
                       <div className="flex items-center gap-1.5">
                         {path.category && (
                           <span className="px-2.5 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-wider">
                             {path.category}
                           </span>
                         )}
                         <span className="px-2.5 py-1 rounded-full bg-card border border-border text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                           {path.difficulty}
                         </span>
                       </div>
                    </div>
                    <h2 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors">{path.title}</h2>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-6">
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
          transition={{ delay: 0.6 }}
          className="mt-20 p-8 sm:p-12 rounded-[36px] sm:rounded-[50px] bg-gradient-to-br from-indigo-600 to-primary text-white text-center shadow-3xl shadow-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <SparklesIcon className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight">Need a custom curriculum?</h3>
            <p className="text-primary-foreground/90 text-sm sm:text-base leading-relaxed font-medium">
              Join 15,000+ developers in our community and get personalized advice on which path fits your current career goals.
            </p>
            <div className="pt-2">
              <Link href="/community">
                <Button variant="secondary" className="rounded-2xl px-10 py-6 text-base sm:text-lg font-black text-primary hover:scale-105 active:scale-95 transition-all">
                  Join the Community
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
