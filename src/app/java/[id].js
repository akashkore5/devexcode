import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import Head from "next/head";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "isomorphic-dompurify";
import javaTopics from "../../data/java_topics.json";
import { ChevronLeftIcon, CheckCircleIcon, ClipboardDocumentIcon, PencilSquareIcon, ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Mermaid from "react-mermaid2";

export default function JavaArticle({ frontmatter, content, relatedTopics }) {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [sanitizedContent, setSanitizedContent] = useState("");
  const [contributionContent, setContributionContent] = useState(content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [csrfError, setCsrfError] = useState(false);
  const [modalWidth, setModalWidth] = useState("md"); // sm, md, lg

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
      console.error("[JavaArticle] Error fetching CSRF token:", error.message, error.stack);
      if (retries > 0) {
        console.log(`[JavaArticle] Retrying CSRF fetch (${retries} attempts left)...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchCsrfToken(retries - 1, delay * 2);
      }
      console.error("[JavaArticle] CSRF token fetch failed after retries");
      setCsrfError(true);
      toast.error("Failed to initialize contribution form. Please refresh the page.");
      return null;
    }
  }, []);

  useEffect(() => {
    fetchCsrfToken();
  }, [fetchCsrfToken]);

  // Sanitize content
  useEffect(() => {
    const cleanContent = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
      ALLOWED_TAGS: [
        "p", "div", "span", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6",
        "strong", "em", "code", "pre", "table", "thead", "tbody", "tr", "th", "td",
        "a", "img", "br", "hr", "blockquote", "mermaid"
      ],
      ALLOWED_ATTR: ["class", "href", "src", "alt", "title"],
    });
    setSanitizedContent(cleanContent);
  }, [content]);

  // Fetch completion status
  useEffect(() => {
    if (status !== "authenticated" || !id) return;

    const fetchProgress = async () => {
      try {
        const response = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "java", action: "all" }),
          credentials: "include",
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        setIsCompleted((data.completed || []).includes(id));
      } catch (error) {
        console.error("[JavaArticle] Error fetching progress:", error);
        toast.error("Failed to load progress");
      }
    };

    fetchProgress();
  }, [id, status]);

  // Mark topic as viewed
  useEffect(() => {
    if (status !== "authenticated" || !id) return;

    const checkAndMarkViewed = async () => {
      try {
        const response = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "java", action: "viewed", id }),
          credentials: "include",
        });
        const data = await response.json();
        if (data.isPresent) return;

        const markResponse = await fetch("/api/user/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "java", action: "viewed", id }),
          credentials: "include",
        });
        if (!markResponse.ok) console.error("[JavaArticle] Failed to mark viewed:", markResponse.statusText);
      } catch (error) {
        console.error("[JavaArticle] Error checking/marking viewed:", error);
      }
    };

    checkAndMarkViewed();
  }, [id, status]);

  const handleMarkCompleted = useCallback(async () => {
    if (status !== "authenticated") {
      setIsLoginModalOpen(true);
      return;
    }

    const willRemove = isCompleted;
    setIsCompleting(true);
    try {
      const response = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "java",
          action: "completed",
          id,
          remove: willRemove,
        }),
        credentials: "include",
      });
      if (response.ok) {
        setIsCompleted(!willRemove);
        toast.success(willRemove ? "Topic unmarked as completed!" : "Topic marked as completed!");
      } else {
        toast.error("Failed to update completion status");
      }
    } catch (error) {
      console.error("[JavaArticle] Error updating completion status:", error);
      toast.error("An error occurred");
    } finally {
      setIsCompleting(false);
    }
  }, [id, status, isCompleted]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

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

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: id,
          url: `https://devexcode.com/java/${id}`,
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
      } else if (response.status === 403 && data.message === "Invalid CSRF token") {
        const newCsrfToken = await fetchCsrfToken();
        if (newCsrfToken) {
          const retryResponse = await fetch("/api/contributions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              articleId: id,
              url: `https://devexcode.com/java/${id}`,
              title: frontmatter.title,
              content: contributionContent,
              userEmail: session?.user?.email || "anonymous",
              csrfToken: newCsrfToken,
            }),
            credentials: "include",
          });
          const retryData = await retryResponse.json();
          if (retryResponse.ok) {
            toast.success("Contribution submitted successfully!");
            setIsContributeModalOpen(false);
            setContributionContent(content);
          } else {
            console.error("[JavaArticle] Retry failed:", retryData.message);
            toast.error(retryData.message || "Failed to submit contribution");
          }
        } else {
          toast.error("Failed to refresh CSRF token");
        }
      } else {
        console.error("[JavaArticle] Contribution submission failed:", data.message);
        toast.error(data.message || "Failed to submit contribution");
      }
    } catch (error) {
      console.error("[JavaArticle] Error submitting contribution:", error.message, error.stack);
      toast.error("An error occurred while submitting");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalWidthChange = (size) => {
    setModalWidth(size);
  };

  const getModalWidthClass = () => {
    switch (modalWidth) {
      case "sm":
        return "max-w-xl";
      case "lg":
        return "max-w-6xl";
      case "md":
      default:
        return "max-w-4xl";
    }
  };

  const getDifficultyColor = () => {
    switch (frontmatter.difficulty) {
      case "Beginner":
        return { bg: "bg-emerald-100 dark:bg-emerald-900", text: "text-emerald-800 dark:text-emerald-200" };
      case "Intermediate":
        return { bg: "bg-amber-100 dark:bg-amber-900", text: "text-amber-800 dark:text-amber-200" };
      case "Advanced":
        return { bg: "bg-rose-100 dark:bg-rose-900", text: "text-rose-800 dark:text-rose-200" };
      default:
        return { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-800 dark:text-gray-200" };
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } },
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title || "Java Developer Guide",
    description: frontmatter.description || "Comprehensive guide for Java developers covering essential topics.",
    keywords: `Java, ${frontmatter.title}, ${frontmatter.tags.join(", ")}, programming, software development, ${frontmatter.difficulty.toLowerCase()}`,
    author: {
      "@type": "Organization",
      name: "DevCodeEx",
    },
    publisher: {
      "@type": "Organization",
      name: "DevCodeEx",
      logo: {
        "@type": "ImageObject",
        url: "https://devexcode.com/logo.png",
        width: 150,
        height: 50,
      },
    },
    datePublished: frontmatter.date || new Date().toISOString(),
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://devexcode.com/java/${id}`,
    },
    image: [
      `https://devexcode.com/java-${id}-guide.png`,
      "https://devexcode.com/java-guide.png",
    ],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://devexcode.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Java Learning Path",
          item: "https://devexcode.com/java",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: frontmatter.title,
          item: `https://devexcode.com/java/${id}`,
        },
      ],
    },
  };

  return (
    <Layout
      title={`${frontmatter.title} | DevCodeEx`}
      description={frontmatter.description || "Comprehensive guide for Java developers."}
      isLoginModalOpen={isLoginModalOpen}
      setIsLoginModalOpen={setIsLoginModalOpen}
    >
      <Head>
        <meta
          name="keywords"
          content={`Java, ${frontmatter.title}, ${frontmatter.tags.join(", ")}, programming, software development, ${frontmatter.difficulty.toLowerCase()}`}
        />
        <meta
          name="description"
          content={frontmatter.description || "Comprehensive guide for Java developers."}
        />
        <meta name="author" content="DevCodeEx Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content={`${frontmatter.title} | DevCodeEx`}
        />
        <meta
          property="og:description"
          content={frontmatter.description || "Comprehensive guide for Java developers."}
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://devexcode.com/java/${id}`}
        />
        <meta
          property="og:image"
          content={`https://devexcode.com/java-${id}-guide.png`}
        />
        <meta
          property="og:image:alt"
          content={`Java guide for ${frontmatter.title}`}
        />
        <meta property="og:site_name" content="DevCodeEx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${frontmatter.title} | DevCodeEx`}
        />
        <meta
          name="twitter:description"
          content={frontmatter.description || "Comprehensive guide for Java developers."}
        />
        <meta
          name="twitter:image"
          content={`https://devexcode.com/java-${id}-guide.png`}
        />
        <meta
          name="twitter:image:alt"
          content={`Java guide for ${frontmatter.title}`}
        />
        <meta name="twitter:creator" content="@DevCodeEx" />
        <link
          rel="canonical"
          href={`https://devexcode.com/java/${id}`}
        />
        <link rel="sitemap" href="/sitemap.xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#4f46e5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(JSON.stringify(structuredData)),
          }}
        />
      </Head>
      <Toaster position="top-right" />
      <main className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 pt-0 pb-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.nav
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <Link
              href="/java"
              className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium transition-colors duration-200"
              aria-label="Back to Java Learning Path"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Back to Java Learning Path
            </Link>
          </motion.nav>

          <motion.header
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="mb-8 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-slate-700"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 leading-tight tracking-tight">
              {frontmatter.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getDifficultyColor().bg} ${getDifficultyColor().text} shadow-sm`}
              >
                {frontmatter.difficulty}
              </span>
              {frontmatter.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/java?tag=${encodeURIComponent(tag)}`}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200 shadow-sm"
                  aria-label={`Filter by tag ${tag}`}
                >
                  {tag}
                </Link>
              ))}
              <motion.button
                onClick={handleMarkCompleted}
                disabled={isCompleting}
                className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-transform duration-200 bg-gradient-to-r ${
                  isCompleted
                    ? "from-emerald-600 to-emerald-700 text-white"
                    : "from-indigo-600 to-indigo-700 text-white"
                } hover:scale-105 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isCompleted ? "Unmark as completed" : "Mark as completed"}
              >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                {isCompleting ? "Processing..." : isCompleted ? "Completed" : "Mark Complete"}
              </motion.button>
              <motion.button
                onClick={handleContributeClick}
                disabled={csrfError}
                className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-transform duration-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:scale-105 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                whileHover={{ scale: csrfError ? 1 : 1.05 }}
                whileTap={{ scale: csrfError ? 1 : 0.95 }}
                aria-label="Contribute to this article"
              >
                <PencilSquareIcon className="w-5 h-5 mr-2" />
                Contribute
              </motion.button>
            </div>
          </motion.header>

          <AnimatePresence>
            {isContributeModalOpen && (
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                role="dialog"
                aria-labelledby="contribute-modal-title"
                aria-modal="true"
              >
                <motion.div
                  className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full ${getModalWidthClass()} max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-slate-700`}
                  variants={modalVariants}
                >
                  <h2 id="contribute-modal-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Contribute to {frontmatter.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Suggest edits to the article content below using Markdown. Your changes will be sent for review.
                  </p>
                  <textarea
                    value={contributionContent}
                    onChange={(e) => setContributionContent(e.target.value)}
                    className="w-full h-64 p-4 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                    placeholder="Edit the article content in Markdown..."
                    aria-label="Edit article content"
                    disabled={isSubmitting}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => handleModalWidthChange("sm")}
                        className={`p-2 rounded-lg ${modalWidth === "sm" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"} hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Set modal width to small"
                      >
                        <ArrowsPointingInIcon className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleModalWidthChange("md")}
                        className={`p-2 rounded-lg ${modalWidth === "md" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"} hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Set modal width to medium"
                      >
                        <ArrowsPointingInIcon className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleModalWidthChange("lg")}
                        className={`p-2 rounded-lg ${modalWidth === "lg" ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"} hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Set modal width to large"
                      >
                        <ArrowsPointingOutIcon className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <div className="flex gap-4">
                      <motion.button
                        onClick={() => setIsContributeModalOpen(false)}
                        className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Cancel contribution"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        onClick={handleSubmitContribution}
                        disabled={isSubmitting || csrfError}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        whileHover={{ scale: isSubmitting || csrfError ? 1 : 1.05 }}
                        whileTap={{ scale: isSubmitting || csrfError ? 1 : 0.95 }}
                        aria-label="Submit contribution"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="flex flex-col lg:flex-row gap-8"
          >
            <article className="lg:w-3/4">
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
                className="prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-slate-700"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    p: ({ node, children }) => {
                      const hasBlockElement = node.children.some(
                        (child) =>
                          child.tagName &&
                          ["pre", "ul", "ol", "table", "blockquote", "h1", "h2", "h3", "h4", "h5", "h6", "mermaid"].includes(child.tagName)
                      );
                      return hasBlockElement ? <div className="mb-6">{children}</div> : <p className="mb-6 text-gray-700 dark:text-gray-300">{children}</p>;
                    },
                    code: ({ node, inline, className = "", children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      const language = match ? match[1] : null;

                      if (inline) {
                        return (
                          <code
                            className="bg-gray-100 dark:bg-gray-700 rounded px-1.5 py-0.5 text-gray-900 dark:text-gray-100 font-mono text-sm"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }

                      if (language === "mermaid") {
                        return (
                          <div className="relative my-6 bg-gray-50 dark:bg-slate-900 p-4 rounded-lg shadow-sm">
                            <Mermaid chart={String(children).trim()} />
                          </div>
                        );
                      }

                      return (
                        <div className="relative my-6 bg-gray-50 dark:bg-slate-900 rounded-lg shadow-sm">
                          <pre
                            className="bg-transparent text-gray-900 dark:text-gray-100 p-4 overflow-x-auto font-mono text-sm leading-relaxed"
                            {...props}
                          >
                            <code>{String(children).trim()}</code>
                          </pre>
                          <button
                            onClick={() => handleCopyCode(String(children).trim())}
                            className="absolute top-3 right-3 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                            aria-label="Copy code to clipboard"
                          >
                            <ClipboardDocumentIcon className="w-5 h-5" />
                          </button>
                        </div>
                      );
                    },
                    h2: ({ children }) => {
                      const id = String(children).toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
                      return (
                        <h2 id={id} className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-10 mb-4 scroll-mt-20 border-b border-gray-200 dark:border-slate-700 pb-2">
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => {
                      const id = String(children).toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
                      return (
                        <h3 id={id} className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-3 scroll-mt-20">
                          {children}
                        </h3>
                      );
                    },
                    ul: ({ children }) => (
                      <ul className="list-disc list-outside ml-6 mb-6 text-gray-700 dark:text-gray-300">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-outside ml-6 mb-6 text-gray-700 dark:text-gray-300">{children}</ol>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-6">
                        <table className="min-w-full border-collapse border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg">{children}</table>
                      </div>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-indigo-600 dark:border-indigo-400 pl-4 italic text-gray-700 dark:text-gray-300 my-6 bg-gray-50 dark:bg-slate-900 p-4 rounded-r-lg">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {sanitizedContent}
                </ReactMarkdown>
              </motion.div>
            </article>

            <aside className="lg:w-1/4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl p-6 sticky top-16 border border-gray-200 dark:border-slate-700"
              >
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Related Topics
                </h3>
                <ul className="space-y-3">
                  {relatedTopics.length > 0 ? (
                    relatedTopics.map((topic) => (
                      <li key={topic.id}>
                        <Link
                          href={`/java/${topic.id}`}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-base font-medium transition-colors duration-200 block hover:underline"
                          aria-label={`View ${topic.title}`}
                        >
                          {topic.title}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 dark:text-gray-400 text-sm">
                      No related topics found.
                    </li>
                  )}
                </ul>
              </motion.div>
            </aside>
          </motion.div>
        </motion.div>
      </main>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = [];
  javaTopics.topics.forEach((topic) => {
    paths.push({ params: { id: topic.id } });
    topic.subtopics.forEach((subtopic) => {
      paths.push({ params: { id: subtopic.id } });
    });
  });
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  try {
    const filePath = path.join(process.cwd(), "dailyblogsjava", `${params?.id}.md`);
    let frontmatter, content;
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content: markdownContent } = matter(fileContent);
      frontmatter = {
        title: data.title || "Untitled",
        description: data.description || "Comprehensive guide for Java developers.",
        difficulty: data.difficulty || "Unknown",
        tags: data.tags || [],
        date: data.date || new Date().toISOString(),
        author: data.author || "DevCodeEx Team",
        category: data.category || "Java",
      };
      content = markdownContent;
    } catch (error) {
      console.error(`Error reading blog file for ID ${params?.id}:`, error);
      const allTopics = javaTopics.topics.flatMap((t) => [t, ...t.subtopics]);
      const currentTopic = allTopics.find((t) => t.id === params?.id);
      if (!currentTopic) {
        return { notFound: true };
      }
      frontmatter = {
        title: currentTopic.title || "Untitled",
        description: currentTopic.description || "Comprehensive guide for Java developers.",
        difficulty: currentTopic.difficulty || "Unknown",
        tags: currentTopic.tags || [],
        date: new Date().toISOString(),
        author: "DevCodeEx Team",
        category: "Java",
      };
      content = `## Placeholder Content\n\nThis Java topic blog is under construction. Please check back later.`;
    }

    // Find the current topic and its parent (if it’s a subtopic)
    const allTopics = javaTopics.topics.flatMap((t) => [t, ...t.subtopics]);
    const currentTopic = allTopics.find((t) => t.id === params?.id) || {};
    
    let relatedTopics = [];

    // Check if the current topic is a subtopic
    const parentTopic = javaTopics.topics.find((t) =>
      t.subtopics.some((sub) => sub.id === params?.id)
    );

    if (parentTopic) {
      // If it’s a subtopic, include the parent topic and all its subtopics (except the current one)
      relatedTopics = [
        { id: parentTopic.id, title: parentTopic.title },
        ...parentTopic.subtopics
          .filter((sub) => sub.id !== params?.id)
          .map((sub) => ({ id: sub.id, title: sub.title })),
      ];
    } else {
      // If it’s a top-level topic, include its subtopics
      const topic = javaTopics.topics.find((t) => t.id === params?.id);
      if (topic && topic.subtopics.length > 0) {
        relatedTopics = topic.subtopics.map((sub) => ({
          id: sub.id,
          title: sub.title,
        }));
      } else {
        // Fallback to tag-based filtering for top-level topics without subtopics
        relatedTopics = allTopics
          .filter(
            (t) =>
              t.id !== params?.id &&
              t.tags.some((tag) => currentTopic?.tags?.includes(tag))
          )
          .slice(0, 5)
          .map((t) => ({ id: t.id, title: t.title }));
      }
    }

    return {
      props: {
        frontmatter,
        content,
        relatedTopics,
      },
      revalidate: 86400, // Revalidate every 24 hours
    };
  } catch (error) {
    console.error(`Unexpected error for ID ${params?.id}:`, error);
    return {
      notFound: true,
    };
  }
}