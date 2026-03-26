"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Layout from "../../../components/Layout";
import { useSession } from "next-auth/react";
import { Toaster, toast } from "react-hot-toast";

const generateSlug = (title) => {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};

export default function SQL50Client({ sql50, totalQuestions }) {
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [filter, setFilter] = useState("all");
  const [progress, setProgress] = useState(0);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const sql50Ids = new Set(
    sql50.sections.flatMap((section) =>
      section.questions.map((q) => Number(q.id))
    )
  );

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoggedIn(true);
      setUserName(session.user.name || "User");
    } else if (status === "unauthenticated") {
      setIsLoggedIn(false);
      setUserName("");
    }
  }, [status, session]);

  useEffect(() => {
    if (!isLoggedIn || status !== "authenticated") return;

    const fetchProgress = async () => {
      try {
        const response = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "leetcode", action: "all" }),
        });
        const data = await response.json();
        const solved = (data.solved || [])
          .map(Number)
          .filter((id) => sql50Ids.has(id));
        
        setSolvedProblems(solved);
        setProgress((solved.length / totalQuestions) * 100);
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, [isLoggedIn, status, totalQuestions]);

  const handleToggleSolved = useCallback(
    async (questionId) => {
      if (!isLoggedIn) {
        setIsLoginModalOpen(true);
        toast.error("Log in to track your progress");
        return;
      }

      const isSolved = solvedProblems.includes(questionId);
      
      try {
        const response = await fetch("/api/user/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "leetcode",
            action: "solved",
            id: questionId,
            remove: isSolved,
          }),
        });
        if (!response.ok) throw new Error("Failed to update");
        
        const updatedSolved = isSolved
          ? solvedProblems.filter((id) => id !== questionId)
          : [...solvedProblems, questionId];
        
        setSolvedProblems(updatedSolved);
        setProgress((updatedSolved.length / totalQuestions) * 100);
        toast.success(isSolved ? "Unmarked" : "Marked");
      } catch (error) {
        toast.error("Failed to update progress");
      }
    },
    [isLoggedIn, solvedProblems, totalQuestions]
  );

  return (
    <Layout
      isLoggedIn={isLoggedIn}
      userName={userName}
      isLoginModalOpen={isLoginModalOpen}
      setIsLoginModalOpen={setIsLoginModalOpen}
    >
      <Toaster />
      <main className="bg-gray-50 dark:bg-slate-900 min-h-screen pt-20 pb-20">
        <section className="py-20 bg-indigo-600">
           <div className="max-w-7xl mx-auto px-4 text-center text-white">
             <h1 className="text-4xl sm:text-6xl font-black mb-6">Master SQL 50</h1>
             <p className="text-indigo-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
               Essential SQL queries for database interview preparation.
             </p>
             {isLoggedIn && (
               <div className="max-w-md mx-auto bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                 <div className="w-full bg-white/20 rounded-full h-3 mb-4 overflow-hidden">
                    <motion.div className="bg-white h-full" initial={{width:0}} animate={{width:`${progress}%`}} />
                 </div>
                 <p className="font-bold">{solvedProblems.length} / {totalQuestions} Solved ({Math.round(progress)}%)</p>
               </div>
             )}
           </div>
        </section>

        <section className="sticky top-0 z-20 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 py-4 shadow-sm">
           <div className="max-w-7xl mx-auto px-4 flex justify-center gap-3">
             {["all", "easy", "medium", "hard"].map(lv => (
               <button 
                 key={lv} 
                 onClick={() => setFilter(lv)}
                 className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition ${filter === lv ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-500'}`}
               >
                 {lv}
               </button>
             ))}
           </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            {sql50.sections.map((section) => {
              const filteredQuestions = section.questions.filter(q => filter === "all" || q.difficulty.toLowerCase() === filter);
              if (filteredQuestions.length === 0) return null;
              return (
                <div key={section.slug} className="mb-12">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                     <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black">SQL</span>
                     {section.name}
                  </h2>
                  <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
                    {filteredQuestions.map((q, i) => (
                      <div key={q.id} className={`flex items-center justify-between p-6 ${i % 2 === 0 ? 'bg-gray-50/50 dark:bg-slate-800/50' : ''} border-b border-gray-100 dark:border-slate-700 last:border-0`}>
                        <div className="flex items-center gap-4">
                          <input 
                            type="checkbox" 
                            checked={solvedProblems.includes(Number(q.id))} 
                            onChange={() => handleToggleSolved(Number(q.id))}
                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <Link href={`/leetcode/${q.id}-${generateSlug(q.title)}`} className="font-bold text-gray-900 dark:text-gray-100 hover:text-indigo-600 transition">
                            {q.id}. {q.title}
                          </Link>
                        </div>
                        <div className="flex items-center gap-4">
                           <Link href={`/leetcode/${q.id}-${generateSlug(q.title)}`} className="text-xs font-black uppercase tracking-widest text-indigo-600">Solution</Link>
                           <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${q.difficulty.toLowerCase() === 'easy' ? 'bg-emerald-100 text-emerald-600' : q.difficulty.toLowerCase() === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
                             {q.difficulty}
                           </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </Layout>
  );
}
