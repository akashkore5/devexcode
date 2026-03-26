"use client";

import Link from "next/link";
import Layout from "../../../components/Layout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "isomorphic-dompurify";
import { ChevronLeftIcon, CheckCircleIcon, HeartIcon, PencilSquareIcon, ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import { useState, useCallback, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";

export default function TechBattlesDetailClient({ frontmatter, content, relatedBattles }) {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
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
      console.error("[TechBattlesDetailClient] Error fetching CSRF token:", error.message, error.stack);
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
          credentials: "include",
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
        toast.error("Failed to load progress");
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
          credentials: "include",
        });
        const data = await response.json();
        if (data.isPresent) return;

        const markResponse = await fetch("/api/user/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "techbattles", action: "viewed", id: numericId }),
          credentials: "include",
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
        credentials: "include",
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
        credentials: "include",
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
    if (status !== "authenticated") {
      setIsLoginModalOpen(true);
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
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Contribution submitted successfully!");
        setIsContributeModalOpen(false);
        setContributionContent(content);
      } else {
        toast.error(data.message || "Failed to submit contribution");
      }
    } catch (error) {
      console.error("[TechBattlesDetailClient] Error submitting contribution:", error);
      toast.error("An error occurred while submitting");
    } finally {
      setIsSolving(false);
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
          {/* Breadcrumb */}
          <motion.nav
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <Link
              href="/tech-battles"
              className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Back to Tech Battles
            </Link>
          </motion.nav>

          {/* Article Header */}
          <motion.header
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="mb-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {frontmatter.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <span
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: getDifficultyColor().bg,
                  color: getDifficultyColor().text,
                }}
              >
                {frontmatter.difficulty}
              </span>
              {frontmatter.tags?.map((tag) => (
                <Link
                  key={tag}
                  href={`/tech-battles?tag=${encodeURIComponent(tag)}`}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
                >
                  {tag}
                </Link>
              ))}
              <motion.button
                onClick={handleMarkSolved}
                disabled={isSolving}
                className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  isSolved
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
                    : "bg-gradient-to-r from-gray-600 to-gray-700 text-white"
                } hover:scale-105 disabled:opacity-50`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                {isSolving ? "Processing..." : isSolved ? "Solved" : "Mark Solved"}
              </motion.button>
              <motion.button
                onClick={handleLikeTag}
                disabled={isTagging}
                className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  isTagged
                    ? "bg-gradient-to-r from-pink-600 to-pink-700 text-white"
                    : "bg-gradient-to-r from-gray-600 to-gray-700 text-white"
                } hover:scale-105 disabled:opacity-50`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HeartIcon className="w-5 h-5 mr-2" />
                {isTagging ? "Processing..." : isTagged ? "Tagged" : "Tag"}
              </motion.button>
              <motion.button
                onClick={handleContributeClick}
                disabled={csrfError}
                className="flex items-center px-4 py-2 rounded-lg shadow-md transition-transform duration-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileHover={{ scale: csrfError ? 1 : 1.05 }}
                whileTap={{ scale: csrfError ? 1 : 0.95 }}
              >
                <PencilSquareIcon className="w-5 h-5 mr-2" />
                Contribute
              </motion.button>
            </div>
          </motion.header>

          {/* Article Content and Sidebar */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="flex flex-col lg:flex-row gap-8"
          >
            <article className="lg:w-3/4 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  p({ node, children }) {
                    const hasBlockElement = node.children.some(
                      (child) =>
                        child.tagName &&
                        ["pre", "ul", "ol", "table", "blockquote", "h1", "h2", "h3", "h4", "h5", "h6"].includes(child.tagName)
                    );
                    return hasBlockElement ? <div className="mb-4">{children}</div> : <p className="mb-4">{children}</p>;
                  },
                  code({ node, inline, className = "", children, ...props }) {
                    const content = String(children).trim();
                    const isAscii = content.includes("──") || content.includes("│") || content.includes("┌");
                    const blockClass = isAscii
                      ? "bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100";

                    return inline ? (
                      <code className="bg-gray-100 dark:bg-gray-700 rounded px-1 py-0.5 text-gray-900 dark:text-gray-100" {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className={`${blockClass} rounded-lg p-4 overflow-x-auto font-mono text-sm my-4`}>
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                }}
              >
                {sanitizedContent}
              </ReactMarkdown>
            </article>

            {/* Sidebar */}
            <aside className="lg:w-1/4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sticky top-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Related Tech Battles
                </h3>
                <ul className="space-y-3">
                  {relatedBattles?.length > 0 ? (
                    relatedBattles.map((battle) => (
                      <li key={battle.id}>
                        <Link
                          href={`/tech-battles/${battle.id}`}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline text-base font-medium"
                        >
                          {battle.title}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 dark:text-gray-400 text-sm">
                      No related battles found.
                    </li>
                  )}
                </ul>
              </motion.div>
            </aside>
          </motion.div>
        </motion.div>
      </main>

      <AnimatePresence>
        {isContributeModalOpen && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full ${modalWidth === 'sm' ? 'max-w-xl' : modalWidth === 'lg' ? 'max-w-6xl' : 'max-w-4xl'} max-h-[90vh] overflow-y-auto`}>
              <h2 className="text-2xl font-bold mb-4">Contribute to {frontmatter.title}</h2>
              <textarea
                value={contributionContent}
                onChange={(e) => setContributionContent(e.target.value)}
                className="w-full h-64 p-4 border rounded-lg dark:bg-slate-900 mb-4 font-mono text-sm"
              />
              <div className="flex justify-end gap-4">
                <button onClick={() => setIsContributeModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded-lg">Cancel</button>
                <button onClick={handleSubmitContribution} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Submit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
