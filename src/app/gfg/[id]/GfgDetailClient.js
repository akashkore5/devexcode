'use client';
import { useState, useCallback, useEffect, useMemo, memo, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { motion } from "framer-motion";
import Layout from "../../../components/Layout";
import DOMPurify from "isomorphic-dompurify";
import { useSession } from "next-auth/react";
import { CheckCircleIcon, HeartIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const GfgDetailClient = memo(function GfgDetailClient({ id, frontMatter, contentHtml, codeBlocks }) {
  const [activeTab, setActiveTab] = useState("java");
  const [copyIcon, setCopyIcon] = useState("copy");
  const [isSolving, setIsSolving] = useState(false);
  const [isTagging, setIsTagging] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [isTagged, setIsTagged] = useState(false);
  const [editorCode, setEditorCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const codeRef = useRef(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const currentId = parseInt(id, 10);

  const sanitizedContentHtml = useMemo(() => {
    return DOMPurify.sanitize(contentHtml, { USE_PROFILES: { html: true } });
  }, [contentHtml]);

  useEffect(() => {
    if (status !== "authenticated" || !currentId) return;
    const fetchProgress = async () => {
      try {
        const response = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "gfg", action: "all", id: currentId }),
        });
        const data = await response.json();
        setIsSolved((data.solved || []).includes(currentId));
        setIsTagged((data.tagged || []).includes(currentId));
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };
    fetchProgress();
  }, [currentId, status]);

  useEffect(() => {
    if (typeof window !== "undefined" && codeRef.current) {
      if (codeRef.current.dataset.highlighted) {
        delete codeRef.current.dataset.highlighted;
      }
      hljs.highlightElement(codeRef.current);
    }
  }, [activeTab, codeBlocks]);

  useEffect(() => {
    const fetchMainCode = async () => {
      try {
        const response = await fetch(`/api/main-code?lang=${activeTab}&id=${currentId}&type=gfg`);
        const data = await response.json();
        if (data.code) {
          const cleanedCode = data.code.replace(/^```[\s\S]*?\n([\s\S]*)\n```$/, "$1").trim();
          setEditorCode(cleanedCode);
        } else {
          setEditorCode(codeBlocks[activeTab] || "");
        }
      } catch (error) {
        setEditorCode(codeBlocks[activeTab] || "");
      }
    };
    fetchMainCode();
  }, [activeTab, currentId, codeBlocks]);

  const copyToClipboard = useCallback(async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyIcon("check");
      toast.success("Code copied!");
      setTimeout(() => setCopyIcon("copy"), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  }, []);

  const handleToggleSolved = async () => {
    if (status !== "authenticated") { setIsLoginModalOpen(true); return; }
    setIsSolving(true);
    try {
      await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "gfg", action: "solved", id: currentId, remove: isSolved }),
      });
      setIsSolved(!isSolved);
      toast.success(isSolved ? "Unmarked" : "Solved");
    } catch (error) {
      toast.error("Error updating");
    } finally { setIsSolving(false); }
  };

  const handleToggleTagged = async () => {
    if (status !== "authenticated") { setIsLoginModalOpen(true); return; }
    setIsTagging(true);
    try {
      await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "gfg", action: "tagged", id: currentId, remove: isTagged }),
      });
      setIsTagged(!isTagged);
      toast.success(isTagged ? "Untagged" : "Tagged");
    } catch (error) {
      toast.error("Error updating");
    } finally { setIsTagging(false); }
  };

  const getDifficultyColor = () => {
    switch (frontMatter.difficulty) {
      case "Easy": return { bg: "#34D399", text: "#1A3C34" };
      case "Medium": return { bg: "#FBBF24", text: "#3F2A00" };
      case "Hard": return { bg: "#EF4444", text: "#3C0F0F" };
      default: return { bg: "#E5E7EB", text: "#1F2937" };
    }
  };

  return (
    <Layout
      title={`${id}. ${frontMatter.title || "GFG Solution"} - DevExCode`}
      isLoginModalOpen={isLoginModalOpen}
      setIsLoginModalOpen={setIsLoginModalOpen}
    >
      <Toaster />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <header className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold mb-6">{id}. {frontMatter.title}</h1>
            <div className="flex flex-wrap gap-4 items-center">
              <span className="px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: getDifficultyColor().bg, color: getDifficultyColor().text }}>
                {frontMatter.difficulty}
              </span>
              <button onClick={handleToggleSolved} disabled={isSolving} className={`flex items-center px-4 py-2 rounded-lg ${isSolved ? "bg-green-600 text-white" : "bg-gray-600 text-white"}`}>
                <CheckCircleIcon className="w-5 h-5 mr-2" /> Solved
              </button>
              <button onClick={handleToggleTagged} disabled={isTagging} className={`flex items-center px-4 py-2 rounded-lg ${isTagged ? "bg-pink-600 text-white" : "bg-gray-600 text-white"}`}>
                <HeartIcon className="w-5 h-5 mr-2" /> Tag
              </button>
            </div>
          </header>

          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="prose dark:prose-invert max-w-none mb-6" dangerouslySetInnerHTML={{ __html: sanitizedContentHtml }} />
            <a href={frontMatter.gfgUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg">
              View on GeeksforGeeks
            </a>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="flex border-b border-gray-200 dark:border-slate-700">
              {["java", "cpp", "python"].map((lang) => (
                <button key={lang} onClick={() => setActiveTab(lang)} className={`px-6 py-3 text-sm font-medium ${activeTab === lang ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 dark:bg-slate-700" : "text-gray-600"}`}>
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="p-4 bg-gray-900">
              {codeBlocks[activeTab] ? (
                <pre><code ref={codeRef} className={`language-${activeTab}`}>{codeBlocks[activeTab]}</code></pre>
              ) : (
                <p className="text-gray-500 text-center">Not available</p>
              )}
            </div>
          </section>
        </motion.article>
      </main>
    </Layout>
  );
});

export default GfgDetailClient;
