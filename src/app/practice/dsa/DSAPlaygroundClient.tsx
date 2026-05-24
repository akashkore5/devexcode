'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  CodeBracketIcon,
  CpuChipIcon,
  InformationCircleIcon,
  ClipboardDocumentIcon,
  CommandLineIcon,
  AcademicCapIcon,
  BeakerIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  Bars3BottomLeftIcon,
  ChevronDownIcon,
  ClockIcon
} from "@heroicons/react/24/solid";
import Link from 'next/link';

// Import our custom visualizer components
import SortingVisualizer from '../../../components/dsa/SortingVisualizer';
import GraphVisualizer from '../../../components/dsa/GraphVisualizer';
import TreeVisualizer from '../../../components/dsa/TreeVisualizer';
import DPVisualizer from '../../../components/dsa/DPVisualizer';
import SlidingWindowVisualizer from '../../../components/dsa/SlidingWindowVisualizer';
import BinarySearchVisualizer from '../../../components/dsa/BinarySearchVisualizer';

// Import the database
import { DSA_CONCEPTS, DSAConcept } from '../../../data/dsa_concepts';

// ---------- Tab Types ----------
type DetailTab = 'visualizer' | 'code' | 'interview';

export default function DSAPlaygroundClient() {
  const [selectedConcept, setSelectedConcept] = useState<DSAConcept>(DSA_CONCEPTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showConceptPicker, setShowConceptPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>('visualizer');
  
  // Progress State
  const [completedList, setCompletedList] = useState<number[]>([]);

  // Animation Playback States
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1500);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Active Code Language Tab
  const [codeLanguage, setCodeLanguage] = useState<'java' | 'typescript'>('java');

  // Copy Code Success State
  const [copied, setCopied] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('devexcode_dsa_progress');
    if (saved) {
      try {
        setCompletedList(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse progress data', e);
      }
    }
  }, []);

  // Sync progress to localStorage
  const toggleComplete = (id: number) => {
    const nextList = completedList.includes(id) 
      ? completedList.filter(item => item !== id)
      : [...completedList, id];
    setCompletedList(nextList);
    localStorage.setItem('devexcode_dsa_progress', JSON.stringify(nextList));
  };

  // Filter categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    DSA_CONCEPTS.forEach(c => set.add(c.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredConcepts = useMemo(() => {
    return DSA_CONCEPTS.filter(c => {
      const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.blueprint.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategory === 'All' || c.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, activeCategory]);

  // Handle concept selection
  const handleSelectConcept = useCallback((concept: DSAConcept) => {
    setSelectedConcept(concept);
    setStepIndex(0);
    setIsPlaying(false);
    setShowConceptPicker(false);
    setActiveTab('visualizer');
  }, []);

  // Playback Logic Loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= selectedConcept.telemetrySteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, animationSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, selectedConcept, animationSpeed]);

  const activeStep = (selectedConcept.telemetrySteps[stepIndex] || selectedConcept.telemetrySteps[0]) as any;

  // Handle Copy Code action
  const handleCopyCode = () => {
    const code = codeLanguage === 'java' ? selectedConcept.sampleCode.java : selectedConcept.sampleCode.typescript;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render proper canvas depending on concept's visualType
  const renderCanvasModel = () => {
    const highlights = activeStep.highlights;
    
    switch (selectedConcept.visualType) {
      case 'linear':
        if (selectedConcept.slug.includes('sort')) {
          const barsData = highlights.indices?.map((val: number, idx: number) => ({
            value: val,
            state: (idx === activeStep.highlightedLine ? 'compare' : 'normal') as 'normal' | 'compare' | 'swap' | 'sorted' | 'pivot'
          })) || [];
          return <SortingVisualizer bars={barsData} />;
        }
        return <SlidingWindowVisualizer indices={highlights.indices} windowRange={highlights.window} />;
      case 'binary-search':
        return <BinarySearchVisualizer indices={highlights.indices} />;
      case 'dp-grid': {
        const gridData = highlights.gridValues?.map((row: any[], rIdx: number) => 
          row.map((val: any, cIdx: number) => ({
            r: rIdx,
            c: cIdx,
            val,
            state: (highlights.gridActive && highlights.gridActive[0] === rIdx && highlights.gridActive[1] === cIdx ? 'active' : 'normal') as 'normal' | 'active' | 'fill' | 'dependency'
          }))
        ) || [];
        return <DPVisualizer grid={gridData} />;
      }
      case 'tree':
      case 'recursion-tree': {
        const nodesData = highlights.treeNodes?.map((val: string) => ({
          id: val,
          state: (highlights.treeNodes[highlights.treeNodes.length - 1] === val ? 'active' : 'path') as 'normal' | 'active' | 'path'
        })) || [];
        return <TreeVisualizer nodes={nodesData} />;
      }
      case 'graph': {
        const nodesData = highlights.treeNodes?.map((val: string) => ({
          id: val,
          state: (highlights.treeNodes[highlights.treeNodes.length - 1] === val ? 'active' : 'visited') as 'normal' | 'visited' | 'active' | 'path'
        })) || [];
        const edgesData = highlights.indices?.map((val: number, idx: number) => ({
          source: String(idx),
          target: String(val),
          active: true
        })) || [];
        return <GraphVisualizer nodes={nodesData} edges={edgesData} />;
      }
      default:
        return <SlidingWindowVisualizer indices={highlights.indices} windowRange={highlights.window} />;
    }
  };

  // Stats
  const totalConceptsCount = DSA_CONCEPTS.length;
  const completedConceptsCount = completedList.length;
  const completionPercentage = Math.round((completedConceptsCount / totalConceptsCount) * 100) || 0;
  const totalSteps = selectedConcept.telemetrySteps.length;
  const isCompleted = completedList.includes(selectedConcept.id);

  // Detail tabs configuration
  const tabs: { id: DetailTab; label: string; icon: React.ElementType }[] = [
    { id: 'visualizer', label: 'Visualizer', icon: BeakerIcon },
    { id: 'code', label: 'Code', icon: CodeBracketIcon },
    { id: 'interview', label: 'Interview', icon: ChatBubbleLeftRightIcon },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-24 relative overflow-hidden font-sans">
      
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-500/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-purple-500/5 dark:bg-purple-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ============================================
            HEADER: Breadcrumb + Title + Stats
           ============================================ */}
        <header className="mb-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4 text-xs font-black uppercase tracking-widest">
            <Link href="/interview" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
              Practice
            </Link>
            <span className="text-slate-300 dark:text-slate-700 select-none">/</span>
            <span className="text-slate-400 dark:text-slate-500">DSA Lab</span>
          </div>

          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight gradient-text mb-2">
                DSA Practice Lab
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg leading-relaxed">
                Master {totalConceptsCount} core algorithms through step-by-step animated visualizations, real code, and FAANG interview prep.
              </p>
            </div>

            {/* Progress Card */}
            <div className="flex items-center gap-4 bg-card dark:bg-card/30 border border-border rounded-2xl px-5 py-3 shadow-sm shrink-0">
              <div className="w-11 h-11 relative flex items-center justify-center">
                <svg className="w-11 h-11 transform -rotate-90">
                  <circle cx="22" cy="22" r="18" className="stroke-border" strokeWidth="3" fill="none" />
                  <circle cx="22" cy="22" r="18" stroke="#10b981" strokeWidth="3" fill="none"
                    strokeDasharray={2 * Math.PI * 18}
                    strokeDashoffset={2 * Math.PI * 18 * (1 - completionPercentage / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute text-[10px] font-black text-emerald-600 dark:text-emerald-400">{completionPercentage}%</span>
              </div>
              <div>
                <div className="text-sm font-black text-foreground leading-none">{completedConceptsCount}<span className="text-muted-foreground font-bold"> / {totalConceptsCount}</span></div>
                <div className="text-[10px] font-bold text-muted-foreground mt-1">Mastered</div>
              </div>
            </div>
          </div>
        </header>

        {/* ============================================
            CONCEPT SELECTOR BAR
           ============================================ */}
        <section className="mb-8">
          <button
            onClick={() => setShowConceptPicker(!showConceptPicker)}
            className="w-full glass dark:glass-dark border border-border rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <AcademicCapIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest font-mono bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                    {selectedConcept.category}
                  </span>
                  <span className="text-[9px] font-bold text-muted-foreground font-mono">#{selectedConcept.id.toString().padStart(3, '0')}</span>
                  {isCompleted && (
                    <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                </div>
                <h2 className="text-lg font-black text-foreground truncate">{selectedConcept.title}</h2>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-3 mr-2">
                <div className="text-right">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">Time</span>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono">{selectedConcept.complexity.time}</span>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-right">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">Space</span>
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">{selectedConcept.complexity.space}</span>
                </div>
              </div>
              <ChevronDownIcon className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${showConceptPicker ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Concept Picker Dropdown */}
          <AnimatePresence>
            {showConceptPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 glass dark:glass-dark border border-border rounded-2xl p-5 shadow-xl">
                  {/* Search + Filter Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search algorithms..."
                        className="w-full bg-background border border-border rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none placeholder-muted-foreground text-foreground transition-all"
                      />
                      <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition whitespace-nowrap border ${
                            activeCategory === cat 
                              ? 'bg-primary border-primary text-white' 
                              : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Concept Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                    {filteredConcepts.map((concept) => {
                      const isSelected = concept.id === selectedConcept.id;
                      const isDone = completedList.includes(concept.id);
                      return (
                        <button
                          key={concept.id}
                          onClick={() => handleSelectConcept(concept)}
                          className={`text-left p-4 rounded-xl border transition-all group/card relative ${
                            isSelected
                              ? 'bg-primary/5 dark:bg-primary/10 border-primary/40 shadow-sm'
                              : 'bg-card border-border hover:border-primary/20 hover:bg-primary/[0.02]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="text-[8px] font-black text-primary uppercase tracking-widest font-mono">
                              {concept.category}
                            </span>
                            {isDone && <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                          </div>
                          <h3 className={`text-sm font-bold leading-snug ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {concept.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[9px] font-mono font-bold text-amber-600 dark:text-amber-400">{concept.complexity.time}</span>
                            <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400">{concept.complexity.space}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {filteredConcepts.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                      No algorithms found matching your search.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ============================================
            TAB NAVIGATION
           ============================================ */}
        <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-xl mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ============================================
            TAB CONTENT
           ============================================ */}
        <AnimatePresence mode="wait">
          {/* ---------- VISUALIZER TAB ---------- */}
          {activeTab === 'visualizer' && (
            <motion.div
              key="visualizer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Blueprint Summary */}
              <div className="glass dark:glass-dark border border-border rounded-2xl p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <InformationCircleIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 select-none">How It Works</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">{selectedConcept.blueprint}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2">
                    <ClockIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Time</span>
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono">{selectedConcept.complexity.time}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2">
                    <CpuChipIcon className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Space</span>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">{selectedConcept.complexity.space}</span>
                  </div>
                  <button
                    onClick={() => toggleComplete(selectedConcept.id)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition border ${
                      isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
                    }`}
                  >
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    {isCompleted ? 'Mastered' : 'Mark Done'}
                  </button>
                </div>
              </div>

              {/* Visualizer Canvas */}
              <div className="glass dark:glass-dark border border-border rounded-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-60" />
                
                {/* Dark Canvas */}
                <div className="bg-[#080d19] min-h-[260px] sm:min-h-[300px] flex items-center justify-center p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_50%,rgba(0,0,0,0.06)_50%)] bg-[size:100%_4px] pointer-events-none" />
                  {renderCanvasModel()}
                </div>

                {/* Console Log */}
                <div className="border-t border-white/5 bg-[#0a0f1e] px-5 py-3 font-mono text-xs flex items-start gap-3">
                  <span className="text-slate-600 shrink-0 select-none">&gt;</span>
                  <span className="text-indigo-300 leading-relaxed">{activeStep.log}</span>
                </div>
              </div>

              {/* Step Controls + Progress Bar */}
              <div className="glass dark:glass-dark border border-border rounded-2xl p-4 sm:p-5">
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground select-none">Execution Progress</span>
                    <span className="text-[10px] font-black text-primary font-mono">{stepIndex + 1} / {totalSteps}</span>
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      animate={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  </div>
                  {/* Step dots */}
                  <div className="flex gap-1 mt-2">
                    {selectedConcept.telemetrySteps.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setStepIndex(idx); setIsPlaying(false); }}
                        className={`h-1.5 rounded-full transition-all flex-1 max-w-[32px] ${
                          idx <= stepIndex
                            ? idx === stepIndex ? 'bg-primary' : 'bg-primary/40'
                            : 'bg-border'
                        }`}
                        aria-label={`Step ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStepIndex(prev => Math.max(0, prev - 1))}
                      disabled={stepIndex === 0}
                      className="p-2.5 bg-card border border-border rounded-xl hover:bg-primary/5 transition disabled:opacity-20"
                      aria-label="Step back"
                    >
                      <ChevronLeftIcon className="w-4 h-4 text-foreground" />
                    </button>

                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`px-6 py-2.5 rounded-xl font-black text-[10px] tracking-widest uppercase flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-md ${
                        isPlaying 
                          ? 'bg-amber-500 text-slate-950 shadow-amber-500/15' 
                          : 'bg-primary text-white shadow-primary/20'
                      }`}
                    >
                      {isPlaying ? <><PauseIcon className="w-4 h-4" /> Pause</> : <><PlayIcon className="w-4 h-4" /> Play</>}
                    </button>

                    <button
                      onClick={() => setStepIndex(prev => Math.min(totalSteps - 1, prev + 1))}
                      disabled={stepIndex === totalSteps - 1}
                      className="p-2.5 bg-card border border-border rounded-xl hover:bg-primary/5 transition disabled:opacity-20"
                      aria-label="Step forward"
                    >
                      <ChevronRightIcon className="w-4 h-4 text-foreground" />
                    </button>

                    <button
                      onClick={() => { setStepIndex(0); setIsPlaying(false); }}
                      className="p-2.5 bg-card border border-border rounded-xl hover:bg-primary/5 transition text-muted-foreground"
                      aria-label="Reset"
                    >
                      <ArrowPathIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Speed */}
                  <div className="hidden sm:flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase text-muted-foreground font-mono whitespace-nowrap">
                      {Math.round(2000 - animationSpeed)}ms
                    </span>
                    <input
                      type="range"
                      min="500"
                      max="1900"
                      step="200"
                      value={2000 - animationSpeed}
                      onChange={(e) => setAnimationSpeed(2000 - Number(e.target.value))}
                      className="w-20 accent-primary h-1 bg-border rounded-lg appearance-none cursor-pointer"
                      aria-label="Adjust speed"
                    />
                  </div>
                </div>
              </div>

              {/* Variable Watch */}
              {Object.keys(activeStep.variables || {}).length > 0 && (
                <div className="glass dark:glass-dark border border-border rounded-2xl p-4 sm:p-5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2 select-none">
                    <CpuChipIcon className="w-4 h-4 text-primary" />
                    Variables
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(activeStep.variables || {}).map(([name, val]: [string, any]) => (
                      <div key={name} className="bg-card border border-border rounded-xl p-3 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest font-mono select-none">{name}</span>
                        <span className="text-sm font-black text-foreground font-mono">
                          {Array.isArray(val) ? `[${val.join(', ')}]` : String(val ?? 'null')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ---------- CODE TAB ---------- */}
          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Language Toggle + Copy */}
              <div className="glass dark:glass-dark border border-border rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <CodeBracketIcon className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground select-none">Production Code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex p-0.5 bg-card border border-border rounded-lg">
                      {(['java', 'typescript'] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setCodeLanguage(lang)}
                          className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition ${
                            codeLanguage === lang
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {lang === 'java' ? 'Java' : 'TypeScript'}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg hover:bg-primary/5 active:scale-95 transition"
                    >
                      <ClipboardDocumentIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-[10px] font-black uppercase text-muted-foreground">{copied ? '✓ Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
                <pre className="bg-[#050811] p-6 overflow-x-auto text-[12px] font-mono text-emerald-300 leading-relaxed max-h-[500px] custom-scrollbar">
                  {codeLanguage === 'java' ? selectedConcept.sampleCode.java : selectedConcept.sampleCode.typescript}
                </pre>
              </div>

              {/* Blueprint Detail */}
              <div className="glass dark:glass-dark border border-border rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpenIcon className="w-5 h-5 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground select-none">Algorithm Blueprint</h3>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-5">{selectedConcept.blueprint}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-xl p-4">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest font-mono block mb-1.5">Time Complexity</span>
                    <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">{selectedConcept.complexity.time}</span>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest font-mono block mb-1.5">Space Complexity</span>
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">{selectedConcept.complexity.space}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------- INTERVIEW TAB ---------- */}
          {activeTab === 'interview' && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {selectedConcept.interviewQuestions.map((q, qIdx) => (
                <div key={qIdx} className="glass dark:glass-dark border border-border rounded-2xl p-5 sm:p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-black shrink-0 mt-0.5">
                      Q{qIdx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-foreground leading-relaxed mb-3">
                        {q.question}
                      </h4>
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        {q.answer}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="bg-card border border-border rounded-xl p-4">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-2">Trade-offs & Optimizations</span>
                      <p className="text-xs text-foreground/70 leading-relaxed">{q.tradeoffs}</p>
                    </div>
                    <div className="bg-destructive/5 border border-destructive/10 rounded-xl p-4">
                      <span className="text-[9px] font-black text-destructive uppercase tracking-widest block mb-2">Chaos Failure Scenario</span>
                      <p className="text-xs text-foreground/70 leading-relaxed">{q.chaosScenario}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
