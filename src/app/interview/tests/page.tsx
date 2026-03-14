'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardDocumentListIcon, 
  ChevronLeftIcon,
  PlayIcon,
  StopIcon,
  CheckCircleIcon,
  CpuChipIcon,
  VariableIcon,
  BeakerIcon
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Link from "next/link";

const sampleProblem = {
  title: "Two Sum",
  difficulty: "Easy",
  duration: 30,
  description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Each input has exactly one solution.",
  starterCode: "function twoSum(nums, target) {\n  // Implementation here\n}"
};

export default function CodingTestsPage() {
  const [timeLeft, setTimeLeft] = useState(sampleProblem.duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [code, setCode] = useState(sampleProblem.starterCode);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      toast.error("Time is up! Diagnostic complete.");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="mb-12 flex items-center justify-between">
          <Link href="/interview">
            <Button variant="ghost" className="rounded-2xl gap-2 font-black group px-6 py-6 border border-transparent hover:border-border transition-all">
              <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Terminate Session
            </Button>
          </Link>
          
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</span>
                <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {isActive ? 'Live Diagnostic' : 'System Standby'}
                </span>
             </div>
             <div className="h-12 w-[1px] bg-border" />
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time Remaining</span>
                <span className="text-2xl font-black tabular-nums">{formatTime(timeLeft)}</span>
             </div>
          </div>
        </div>

        {/* Diagnostic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           
           {/* Left: Problem Statement */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="space-y-8"
           >
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6"
                >
                  <BeakerIcon className="w-4 h-4" />
                  Algorithm Evaluation
                </motion.div>
                <h1 className="text-5xl font-black tracking-tighter mb-4">{sampleProblem.title}</h1>
                <div className="flex items-center gap-4 mb-8">
                   <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase border border-emerald-500/20">
                     {sampleProblem.difficulty}
                   </span>
                   <span className="text-muted-foreground text-xs font-medium">Target: 30 Minutes</span>
                </div>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed bg-card p-8 rounded-[32px] border border-border">
                  {sampleProblem.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="p-8 rounded-[32px] border border-border bg-card/50">
                    <VariableIcon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-black mb-2">Variables</h3>
                    <p className="text-xs text-muted-foreground font-medium">Numbers array, target integer.</p>
                 </div>
                 <div className="p-8 rounded-[32px] border border-border bg-card/50">
                    <CpuChipIcon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-black mb-2">Complexity</h3>
                    <p className="text-xs text-muted-foreground font-medium">Desired: O(n) Time, O(n) Space.</p>
                 </div>
              </div>

              <div className="p-8 rounded-[40px] border border-primary/20 bg-primary/[0.02] flex items-center justify-between">
                 <div>
                    <h4 className="font-black mb-1">Ready to initiate?</h4>
                    <p className="text-xs text-muted-foreground font-medium">The timer starts as soon as you open the editor.</p>
                 </div>
                 <Button 
                   onClick={() => setIsActive(!isActive)}
                   className="rounded-2xl px-8 py-6 font-black gap-2 transition-all shadow-xl shadow-primary/20"
                 >
                   {isActive ? (
                     <><StopIcon className="w-5 h-5" /> Pause Diagnostic</>
                   ) : (
                     <><PlayIcon className="w-5 h-5" /> Start Testing</>
                   )}
                 </Button>
              </div>
           </motion.div>

           {/* Right: Code Environment */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="relative"
           >
              <div className="glass-modern h-[600px] rounded-[48px] border border-white/10 shadow-3xl overflow-hidden flex flex-col">
                 {/* Editor Header */}
                 <div className="h-16 px-8 flex items-center justify-between bg-black/40 border-b border-white/5">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/50" />
                       <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                       <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">solution.js</span>
                    <div className="w-8" />
                 </div>

                 {/* Simulated Editor */}
                 <div className="flex-grow relative p-8 bg-zinc-950 font-mono text-sm leading-relaxed overflow-hidden">
                    <div className="absolute left-8 top-8 opacity-20 select-none">
                       {Array.from({length: 20}).map((_, i) => (
                         <div key={i}>{i+1}</div>
                       ))}
                    </div>
                    <textarea 
                      disabled={!isActive}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-full bg-transparent border-none focus:outline-none focus:ring-0 text-emerald-400 pl-8 resize-none selection:bg-primary/30"
                      spellCheck={false}
                    />
                    {!isActive && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                         <Button 
                           variant="outline" 
                           onClick={() => setIsActive(true)}
                           className="rounded-2xl border-white/10 text-white font-black px-10 py-8 bg-white/5 hover:bg-white/10"
                         >
                           Resume Coding
                         </Button>
                      </div>
                    )}
                 </div>

                 {/* Console/Action Footer */}
                 <div className="h-24 px-8 flex items-center justify-between bg-black/20 border-t border-white/5">
                    <div className="text-xs text-white/40 font-black tracking-widest">
                       CONSOLE: <span className="text-white/60">READY</span>
                    </div>
                    <Button 
                      onClick={() => {
                        toast.success("Solution submitted to execution cluster!");
                        setIsActive(false);
                      }}
                      className="rounded-2xl font-black gap-2 bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-500/20"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      Final Submission
                    </Button>
                 </div>
              </div>
              
              {/* Floating Performance Indicator */}
              <div className="absolute -bottom-6 -right-6 glass-modern p-6 rounded-[32px] border border-white/10 shadow-2xl flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full border-4 border-primary/20 flex items-center justify-center font-black text-primary">
                    98%
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-muted-foreground">Confidence</span>
                    <span className="text-xs font-black">Ready to Submit</span>
                 </div>
              </div>
           </motion.div>
        </div>

      </div>
    </div>
  );
}
