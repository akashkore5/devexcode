'use client';
import Link from "next/link";
import Layout from "../../../components/Layout";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "isomorphic-dompurify";
import { ChevronLeftIcon, CheckCircleIcon, HeartIcon, PencilSquareIcon, ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import { useState, useCallback, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TechBattleDetailClient({ id, frontmatter, content, relatedBattles }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSolving, setIsSolving] = useState(false);
  const [isTagging, setIsTagging] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [isTagged, setIsTagged] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [sanitizedContent, setSanitizedContent] = useState("");
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [contributionContent, setContributionContent] = useState(content);
  const [csrfToken, setCsrfToken] = useState("");
  const [csrfError, setCsrfError] = useState(false);
  const [modalWidth, setModalWidth] = useState("md"); // sm, md, lg

  // Difficulty colors for better contrast
  const getDifficultyColor = () => {
    switch (frontmatter.difficulty) {
      case "Easy":
        return { bg: "#34D399", text: "#1A3C34" };
      case "Medium":
        return { bg: "#FBBF24", text: "#3F2A00" };
      case "Hard":
        return { bg: "#EF4444", text: "#3C0F0F" };
      default:
        return { bg: "#E5E7EB", text: "#1F2937" };
    }
  };

  // Sanitize content on mount
  useEffect(() => {
    const cleanContent = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
      ALLOWED_TAGS: [
        "p", "div", "span", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6",
        "strong", "em", "code", "pre", "table", "thead", "tbody", "tr", "th", "td",
        "a", "img", "br", "hr", "blockquote",
      ],
      ALLOWED_ATTR: ["class", "href", "src", "alt", "title"],
    });
    setSanitizedContent(cleanContent);
  }, [content]);

  // Fetch CSRF token with retry logic
  const fetchCsrfToken = useCallback(async (retries = 3, delay = 1000) => {
    try {
      const res = await fetch("/api/auth/csrf", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      const data = await res.json();
      const { csrfToken } = data;
      if (!csrfToken) {
        throw new Error("CSRF token not returned");
      }
      
      setCsrfToken(csrfToken);
      setCsrfError(false);
      return csrfToken;
    } catch (error) {
      console.error("[TechBattleDetailClient] Error fetching CSRF token:", error.message);
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchCsrfToken(retries - 1, delay * 2);
      }
      setCsrfError(true);
      toast.error("Failed to initialize contribution form. Please refresh the page.");
      return null;
    }
  }, []);

  useEffect(() => {
    fetchCsrfToken();
  }, [fetchCsrfToken]);

  // Fetch solved and tagged status
  useEffect(() => {
    if (status !== "authenticated" || !id) return;

    const fetchProgress = async () => {
      try {
        const response = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "techbattles", action: "all" }),
        });
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        const numericId = Number(id);
        setIsSolved((data.solved || []).includes(numericId));
        setIsTagged((data.tagged || []).includes(numericId));
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, [id, status]);

  // Mark article as viewed
  useEffect(() => {
    if (status !== "authenticated" || !id) return;

    const checkAndMarkViewed = async () => {
      try {
        const numericId = Number(id);
        const response = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "techbattles", action: "viewed", id: numericId }),
        });
        const data = await response.json();
        if (data.isPresent) return;

        const markResponse = await fetch("/api/user/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "techbattles", action: "viewed", id: numericId }),
        });
        if (!markResponse.ok) {
          console.error("Failed to mark viewed:", markResponse.statusText);
        }
      } catch (error) {
        console.error("Error checking/marking viewed:", error);
      }
    };

    checkAndMarkViewed();
  }, [id, status]);

  const handleMarkSolved = useCallback(async () => {
    if (status !== "authenticated") {
      setIsLoginModalOpen(true);
      return;
    }

    const numericId = Number(id);
    const willRemove = isSolved;
    setIsSolving(true);
    try {
      const response = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "techbattles",
          action: "solved",
          id: numericId,
          remove: willRemove,
        }),
      });
      if (response.ok) {
        setIsSolved(!willRemove);
        toast.success(willRemove ? "Article unmarked as solved!" : "Article marked as solved!");
      } else {
        toast.error("Failed to update solved status");
      }
    } catch (error) {
      console.error("Error updating solved status:", error);
      toast.error("An error occurred");
    } finally {
      setIsSolving(false);
    }
  }, [id, status, isSolved]);

  const handleLikeTag = useCallback(async () => {
    if (status !== "authenticated") {
      setIsLoginModalOpen(true);
      return;
    }

    const numericId = Number(id);
    const willRemove = isTagged;
    setIsTagging(true);
    try {
      const response = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "techbattles",
          action: "tagged",
          id: numericId,
          remove: willRemove,
        }),
      });
      if (response.ok) {
        setIsTagged(!willRemove);
        toast.success(willRemove ? "Article untagged!" : "Article tagged!");
      } else {
        toast.error("Failed to update tag status");
      }
    } catch (error) {
      console.error("Error updating tag status:", error);
      toast.error("An error occurred");
    } finally {
      setIsTagging(false);
    }
  }, [id, status, isTagged]);

  const handleContributeClick = () => {
    if (status !== "authenticated") {
      setIsLoginModalOpen(true);
      return;
    }
    if (csrfError) {
      toast.error("Contribution is disabled due to initialization failure.");
      return;
    }
    setIsContributeModalOpen(true);
  };

  const handleSubmitContribution = async () => {
    if (!contributionContent.trim()) {
      toast.error("Contribution content cannot be empty");
      return;
    }
    if (csrfError || !csrfToken) {
      toast.error("Contribution submission is disabled due to initialization failure.");
      return;
    }

    setIsSolving(true);
    try {
      const response = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: id,
          url: `https://devexcode.com/tech-battles/${id}`,
          title: frontmatter.title,
          content: contributionContent,
          userEmail: session?.user?.email || "anonymous",
          csrfToken,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Contribution submitted successfully!");
        setIsContributeModalOpen(false);
      } else {
        toast.error(data.message || "Failed to submit contribution");
      }
    } catch (error) {
      console.error("Error submitting contribution:", error);
      toast.error("An error occurred while submitting");
    } finally {
      setIsSolving(false);
    }
  };

  const handleModalWidthChange = (size) => {
    setModalWidth(size);
  };

  const getModalWidthClass = () => {
    switch (modalWidth) {
      case "sm": return "max-w-xl";
      case "lg": return "max-w-6xl";
      case "md":
      default: return "max-w-4xl";
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <Layout
      isLoginModalOpen={isLoginModalOpen}
      setIsLoginModalOpen={setIsLoginModalOpen}
    >
      <Toaster />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.nav variants={sectionVariants} initial="hidden" animate="visible" className="mb-6">
            <Link href="/tech-battles" className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Back to Tech Battles
            </Link>
          </motion.nav>

          <motion.header variants={sectionVariants} initial="hidden" animate="visible" className="mb-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {frontmatter.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: getDifficultyColor().bg, color: getDifficultyColor().text }}>
                {frontmatter.difficulty}
              </span>
              {frontmatter.tags.map((tag) => (
                <Link key={tag} href={`/tech-battles?tag=${encodeURIComponent(tag)}`} className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200">
                  {tag}
                </Link>
              ))}
              <motion.button onClick={handleMarkSolved} disabled={isSolving} className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-transform duration-200 ${isSolved ? "bg-green-600 text-white" : "bg-gray-600 text-white"}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                {isSolving ? "Processing..." : "Solved"}
              </motion.button>
              <motion.button onClick={handleLikeTag} disabled={isTagging} className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-transform duration-200 ${isTagged ? "bg-pink-600 text-white" : "bg-gray-600 text-white"}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <HeartIcon className="w-5 h-5 mr-2" />
                {isTagging ? "Processing..." : "Tag"}
              </motion.button>
              <motion.button onClick={handleContributeClick} disabled={csrfError} className="flex items-center px-4 py-2 rounded-lg shadow-md transition-transform duration-200 bg-blue-600 text-white" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <PencilSquareIcon className="w-5 h-5 mr-2" />
                Contribute
              </motion.button>
            </div>
          </motion.header>

          <AnimatePresence>
            {isContributeModalOpen && (
              <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <motion.div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full ${getModalWidthClass()} max-h-[90vh] overflow-y-auto`}>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Contribute to {frontmatter.title}</h2>
                  <textarea value={contributionContent} onChange={(e) => setContributionContent(e.target.value)} className="w-full h-64 p-4 border rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 font-mono text-sm mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                       <button onClick={() => handleModalWidthChange("sm")} className="p-2 bg-gray-100 dark:bg-slate-700 rounded"><ArrowsPointingInIcon className="w-5 h-5"/></button>
                       <button onClick={() => handleModalWidthChange("md")} className="p-2 bg-gray-100 dark:bg-slate-700 rounded"><ArrowsPointingInIcon className="w-5 h-5"/></button>
                       <button onClick={() => handleModalWidthChange("lg")} className="p-2 bg-gray-100 dark:bg-slate-700 rounded"><ArrowsPointingOutIcon className="w-5 h-5"/></button>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setIsContributeModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded-lg">Cancel</button>
                      <button onClick={handleSubmitContribution} disabled={isSolving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Submit</button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col lg:flex-row gap-8">
            <article className="lg:w-3/4 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {sanitizedContent}
              </ReactMarkdown>
            </article>

            <aside className="lg:w-1/4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Related Tech Battles</h3>
                <ul className="space-y-3">
                  {relatedBattles.map((battle) => (
                    <li key={battle.id}>
                      <Link href={`/tech-battles/${battle.id}`} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                        {battle.title}
                      </Link>
                    </li>
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
