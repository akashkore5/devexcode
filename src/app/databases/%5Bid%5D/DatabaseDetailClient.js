'use client';
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Layout from "../../../components/Layout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "isomorphic-dompurify";
import { ChevronLeftIcon, CheckCircleIcon, ClipboardDocumentIcon, PencilSquareIcon, ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import { Toaster, toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import Mermaid from "react-mermaid2";

export default function DatabaseDetailClient({ id, frontmatter, content, relatedTopics }) {
  const { data: session, status } = useSession();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [sanitizedContent, setSanitizedContent] = useState("");
  const [contributionContent, setContributionContent] = useState(content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [csrfError, setCsrfError] = useState(false);
  const [modalWidth, setModalWidth] = useState("md");

  useEffect(() => {
    const cleanContent = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
      ALLOWED_TAGS: ["p", "div", "span", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "em", "code", "pre", "table", "thead", "tbody", "tr", "th", "td", "a", "img", "br", "hr", "blockquote", "mermaid"],
      ALLOWED_ATTR: ["class", "href", "src", "alt", "title"],
    });
    setSanitizedContent(cleanContent);
  }, [content]);

  useEffect(() => {
    if (status !== "authenticated" || !id) return;
    const fetchProgress = async () => {
      try {
        const response = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "databases", action: "all" }),
        });
        const data = await response.json();
        setIsCompleted((data.completed || []).includes(id));
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };
    fetchProgress();
  }, [id, status]);

  const handleMarkCompleted = async () => {
    if (status !== "authenticated") { setIsLoginModalOpen(true); return; }
    setIsCompleting(true);
    try {
      await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "databases", action: "completed", id, remove: isCompleted }),
      });
      setIsCompleted(!isCompleted);
      toast.success(isCompleted ? "Unmarked" : "Completed!");
    } catch (error) {
      toast.error("Error updating status");
    } finally { setIsCompleting(false); }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Copied!");
  };

  return (
    <Layout isLoginModalOpen={isLoginModalOpen} setIsLoginModalOpen={setIsLoginModalOpen}>
      <Toaster />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <nav className="mb-6">
            <Link href="/databases" className="flex items-center text-indigo-600 hover:underline text-sm font-medium">
              <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back to Learning Path
            </Link>
          </nav>

          <header className="mb-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
            <h1 className="text-3xl font-bold mb-6">{frontmatter.title}</h1>
            <div className="flex flex-wrap gap-4 items-center">
              <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">{frontmatter.difficulty}</span>
              <button onClick={handleMarkCompleted} disabled={isCompleting} className={`flex items-center px-4 py-2 rounded-lg ${isCompleted ? "bg-green-600 text-white" : "bg-indigo-600 text-white"}`}>
                <CheckCircleIcon className="w-5 h-5 mr-2" /> {isCompleted ? "Completed" : "Mark Complete"}
              </button>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row gap-8">
            <article className="lg:w-3/4 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw]}
                components={{
                  code: ({ inline, className, children }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    if (match && match[1] === "mermaid") return <Mermaid chart={String(children).trim()} />;
                    return <code className={className}>{children}</code>;
                  }
                }}
              >
                {sanitizedContent}
              </ReactMarkdown>
            </article>

            <aside className="lg:w-1/4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sticky top-6">
                <h3 className="font-bold mb-4">Related Topics</h3>
                <ul className="space-y-2">
                  {relatedTopics.map(t => (
                    <li key={t.id}><Link href={`/databases/${t.id}`} className="text-indigo-600 hover:underline">{t.title}</Link></li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </motion.div>
      </main>
    </Layout>
  );
}
