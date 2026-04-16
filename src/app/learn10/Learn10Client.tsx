'use client';

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ViewColumnsIcon, 
  ListBulletIcon,
  ChevronRightIcon,
  SparklesIcon,
  AcademicCapIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "../../components/ui/button";

export default function Learn10Client({ initialTopics, categories }: { initialTopics: any[], categories: string[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTopics = useMemo(() => {
    return initialTopics.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toString() === search;
      const matchCategory = selectedCategory === "All" || t.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [search, selectedCategory, initialTopics]);

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6"
            >
              <AcademicCapIcon className="w-4 h-4" />
              Micro Learning Series
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-7xl font-black gradient-text mb-6 leading-tight"
            >
              10-Minute Learn.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground font-medium"
            >
              Complex engineering concepts distilled into high-density 10-minute reads. Master system design, AI, and backend architectures on your coffee break.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4"
          >
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-2xl border transition-all ${viewMode === 'grid' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' : 'bg-card border-border text-muted-foreground hover:border-primary/50'}`}
            >
              <ViewColumnsIcon className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-2xl border transition-all ${viewMode === 'list' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' : 'bg-card border-border text-muted-foreground hover:border-primary/50'}`}
            >
              <ListBulletIcon className="w-6 h-6" />
            </button>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-8 flex-shrink-0">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Internal Search</label>
              <div className="relative group">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="ID or Topic..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Category Filter</label>
              <div className="flex flex-col gap-2">
                {["All", ...categories].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left px-4 py-3 rounded-xl text-sm font-black transition-all ${selectedCategory === cat ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-muted-foreground hover:bg-card border-l-4 border-transparent'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Grid */}
          <div className="flex-grow">
            <AnimatePresence mode="popLayout">
              {filteredTopics.length > 0 ? (
                <motion.div 
                  layout
                  className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}
                >
                  {filteredTopics.map((topic) => (
                    <motion.div
                      key={topic.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link href={`/learn10/${topic.id}`}>
                        <div className={`premium-card group rounded-[32px] overflow-hidden transition-all duration-300 hover:-translate-y-1 ${viewMode === 'grid' ? 'p-8' : 'p-6 flex items-center justify-between gap-6'}`}>
                          <div className="flex items-start gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-xs flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                              #{topic.id}
                            </div>
                            <div>
                               <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">{topic.category}</span>
                               <h3 className={`font-black text-lg leading-tight transition-colors group-hover:text-primary ${viewMode === 'list' ? 'line-clamp-1' : ''}`}>
                                 {topic.title}
                               </h3>
                               {viewMode === 'grid' && (
                                 <p className="mt-4 text-sm text-muted-foreground font-medium line-clamp-2">
                                   Explore the core principles and architectural trade-offs of {topic.title} in our accelerated learning format.
                                 </p>
                               )}
                            </div>
                          </div>
                          
                          <div className={`flex items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 ${viewMode === 'grid' ? 'w-10 h-10 mt-8 ml-auto' : 'w-10 h-10 flex-shrink-0'}`}>
                            <ChevronRightIcon className="w-5 h-5" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-20 bg-card border border-border rounded-[40px] border-dashed">
                   <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                     <SparklesIcon className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-black mb-2">No matches found</h3>
                   <p className="text-muted-foreground font-medium">Try broadening your search or switching categories.</p>
                   <Button variant="outline" onClick={() => {setSearch(""); setSelectedCategory("All");}} className="mt-8 rounded-xl font-black">Reset Filters</Button>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
