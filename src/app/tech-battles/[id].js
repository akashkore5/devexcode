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
import techBattles from "../../data/tech_battles.json";
import { ChevronLeftIcon, CheckCircleIcon, HeartIcon, PencilSquareIcon, ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import { useState, useCallback, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function TechBattlesArticle({ frontmatter, content, relatedBattles }) {
  const router = useRouter();
  const { id } = router.query;
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
      console.error("[TechBattlesArticle] Error fetching CSRF token:", error.message, error.stack);
      if (retries > 0) {
        console.log(`[TechBattlesArticle] Retrying CSRF fetch (${retries} attempts left)...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchCsrfToken(retries - 1, delay * 2);
      }
      console.error("[TechBattlesArticle] CSRF token fetch failed after retries");
      setCsrfError(true);
      toast.error("Failed to initialize contribution form. Please refresh the page.");
      return null;
    }
  }, []);

  useEffect(() => {
    fetchCsrfToken();
  }, [fetchCsrfToken]);

  // Log CSRF state for debugging
  useEffect(() => {
    
  }, [csrfToken, csrfError]);

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

    setIsSolving(true); // Reuse isSolving for submission state
    try {
      console.log("[TechBattlesArticle] Submitting contribution with payload:", {
        articleId: id,
        url: `https://devexcode.com/tech-battles/${id}`,
        title: frontmatter.title,
        contentLength: contributionContent.length,
        userEmail: session?.user?.email || "anonymous",
        csrfToken,
      });
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
      } else if (response.status === 403 && data.message === "Invalid CSRF token") {
        
        const newCsrfToken = await fetchCsrfToken();
        if (newCsrfToken) {
          const retryResponse = await fetch("/api/contributions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              articleId: id,
              url: `https://devexcode.com/tech-battles/${id}`,
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
            console.error("[TechBattlesArticle] Retry failed:", retryData.message);
            toast.error(retryData.message || "Failed to submit contribution");
          }
        } else {
          toast.error("Failed to refresh CSRF token");
        }
      } else {
        console.error("[TechBattlesArticle] Contribution submission failed:", data.message);
        toast.error(data.message || "Failed to submit contribution");
      }
    } catch (error) {
      console.error("[TechBattlesArticle] Error submitting contribution:", error.message, error.stack);
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
      case "sm":
        return "max-w-xl";
      case "lg":
        return "max-w-6xl";
      case "md":
      default:
        return "max-w-4xl";
    }
  };

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } },
  };

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title || "Tech Battle Comparison",
    description: `Comprehensive comparison of ${frontmatter.title || "Untitled Tech Battle"}, analyzing features, performance, and use cases.`,
    keywords: `tech battle, ${frontmatter.title}, ${frontmatter.difficulty || "technology comparison"}, ${frontmatter.tags.join(", ")}, software comparison, technology stack`,
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
      "@id": `https://devexcode.com/tech-battles/${id}`,
    },
    image: [
      "https://devexcode.com/og-image.jpg",
      `https://devexcode.com/tech-battles-${id}-comparison.png`,
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
          name: "Tech Battles",
          item: "https://devexcode.com/tech-battles",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: frontmatter.title,
          item: `https://devexcode.com/tech-battles/${id}`,
        },
      ],
    },
  };

  return (
    <Layout
      title={`${frontmatter.title} | DevCodeEx`}
      description={`Compare ${frontmatter.title || "Untitled Tech Battle"} with a detailed analysis of features, performance, and use cases.`}
      isLoginModalOpen={isLoginModalOpen}
      setIsLoginModalOpen={setIsLoginModalOpen}
    >
      <Head>
        <meta
          name="keywords"
          content={`tech battle, ${frontmatter.title}, ${frontmatter.difficulty || "technology comparison"}, ${frontmatter.tags.join(", ")}, software comparison, technology stack`}
        />
        <meta
          name="description"
          content={`Learn about ${frontmatter.title || "Untitled Tech Battle"} with a comprehensive comparison of features and performance.`}
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
          content={`Explore ${frontmatter.title || "Untitled Tech Battle"} with detailed analysis of features and performance.`}
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://devexcode.com/tech-battles/${id}`}
        />
        <meta
          property="og:image"
          content={`https://devexcode.com/tech-battles-${id}-comparison.png`}
        />
        <meta
          property="og:image:alt"
          content={`Tech Battle Comparison for ${frontmatter.title}`}
        />
        <meta property="og:site_name" content="DevCodeEx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${frontmatter.title} | DevCodeEx`}
        />
        <meta
          name="twitter:description"
          content={`Master ${frontmatter.title || "Untitled Tech Battle"} with expert comparison insights.`}
        />
        <meta
          name="twitter:image"
          content={`https://devexcode.com/tech-battles-${id}-comparison.png`}
        />
        <meta
          name="twitter:image:alt"
          content={`Tech Battle Comparison for ${frontmatter.title}`}
        />
        <meta name="twitter:creator" content="@DevCodeEx" />
        <link
          rel="canonical"
          href={`https://devexcode.com/tech-battles/${id}`}
        />
        <link rel="sitemap" href="/sitemap.xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#4f46e5" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(JSON.stringify(structuredData)),
          }}
        />
      </Head>
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
              aria-label="Back to Tech Battles"
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
              <button
                onClick={() => router.push(`/tech-battles?difficulty=${frontmatter.difficulty}`)}
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: getDifficultyColor().bg,
                  color: getDifficultyColor().text,
                }}
                aria-label={`Filter by ${frontmatter.difficulty} difficulty`}
              >
                {frontmatter.difficulty}
              </button>
              {frontmatter.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tech-battles?tag=${encodeURIComponent(tag)}`}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
                  aria-label={`Filter by ${tag} tag`}
                >
                  {tag}
                </Link>
              ))}
              <motion.button
                onClick={handleMarkSolved}
                disabled={isSolving}
                className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  isSolved
                    ? "bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 text-white"
                    : "bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-800 dark:to-gray-900 text-white"
                } hover:scale-105 disabled:opacity-50`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isSolved ? "Unmark as solved" : "Mark as solved"}
              >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                {isSolving ? "Processing..." : "Solved"}
              </motion.button>
              <motion.button
                onClick={handleLikeTag}
                disabled={isTagging}
                className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  isTagged
                    ? "bg-gradient-to-r from-pink-600 to-pink-700 dark:from-pink-800 dark:to-pink-900 text-white"
                    : "bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-800 dark:to-gray-900 text-white"
                } hover:scale-105 disabled:opacity-50`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isTagged ? "Untag article" : "Tag article"}
              >
                <HeartIcon className="w-5 h-5 mr-2" />
                {isTagging ? "Processing..." : "Tag"}
              </motion.button>
              <motion.button
                onClick={handleContributeClick}
                disabled={csrfError}
                className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-transform duration-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                whileHover={{ scale: csrfError ? 1 : 1.05 }}
                whileTap={{ scale: csrfError ? 1 : 0.95 }}
                aria-label="Contribute to this tech battle"
              >
                <PencilSquareIcon className="w-5 h-5 mr-2" />
                Contribute
              </motion.button>
            </div>
          </motion.header>

          {/* Contribution Modal */}
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
                    Suggest edits to the tech battle comparison below using Markdown. Your changes will be sent for review.
                  </p>
                  <textarea
                    value={contributionContent}
                    onChange={(e) => setContributionContent(e.target.value)}
                    className="w-full h-64 p-4 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                    placeholder="Edit the tech battle content in Markdown..."
                    aria-label="Edit tech battle content"
                    disabled={isSolving}
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
                        disabled={isSolving}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        onClick={handleSubmitContribution}
                        disabled={isSolving || csrfError}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        whileHover={{ scale: isSolving || csrfError ? 1 : 1.05 }}
                        whileTap={{ scale: isSolving || csrfError ? 1 : 0.95 }}
                        aria-label="Submit contribution"
                      >
                        {isSolving ? "Submitting..." : "Submit"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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
                    const isSql = className.includes("language-sql") || content.toLowerCase().startsWith("create table");
                    const isSpec = className.includes("language-yaml") || className.includes("language-json") || content.includes("spec:");
                    const blockClass = isAscii
                      ? "bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
                      : isSql
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
                      : isSpec
                      ? "bg-purple-50 dark:bg-purple-950 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800"
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
                  h1: ({ children }) => (
                    <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">{children}</h2>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">{children}</h4>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-outside ml-6 mb-4">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-outside ml-6 mb-4">{children}</ol>
                  ),
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
                  {relatedBattles.length > 0 ? (
                    relatedBattles.map((battle) => (
                      <li key={battle.id}>
                        <Link
                          href={`/tech-battles/${battle.id}`}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline text-base font-medium"
                          aria-label={`View ${battle.title}`}
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
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = techBattles.map((battle) => ({
    params: { id: battle.id.toString() },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  try {
    const filePath = path.join(process.cwd(), "tech_battles_blogs", `battle_${params?.id}_blog.md`);
    let frontmatter, content;
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content: markdownContent } = matter(fileContent);
      frontmatter = data;
      content = markdownContent;
    } catch (error) {
      console.error(`Error reading blog file for ID ${params?.id}:`, error);
      const currentBattle = techBattles.find((battle) => battle.id.toString() === params?.id);
      if (!currentBattle) {
        console.error(`No battle found for ID ${params?.id}`);
        return { notFound: true };
      }
      frontmatter = {
        title: currentBattle.title || "Untitled",
        difficulty: currentBattle.difficulty || "Unknown",
        tags: currentBattle.tags || [],
        date: currentBattle.date || null,
      };
      content = `## Placeholder Content\n\nThis tech battle comparison is under construction. Please check back later.`;
    }

    const currentBattle = techBattles.find((battle) => battle.id.toString() === params?.id) || {};
    const relatedBattles = techBattles
      .filter(
        (battle) =>
          battle.id.toString() !== params?.id &&
          battle.tags.some((tag) => currentBattle?.tags?.includes(tag))
      )
      .slice(0, 5)
      .map((battle) => ({ id: battle.id, title: battle.title }));

    return {
      props: {
        frontmatter: {
          title: frontmatter.title || currentBattle.title || "Untitled",
          difficulty: frontmatter.difficulty || currentBattle.difficulty || "Unknown",
          tags: frontmatter.tags || currentBattle.tags || [],
          date: frontmatter.date || currentBattle.date || null,
        },
        content,
        relatedBattles,
      },
    };
  } catch (error) {
    console.error(`Unexpected error for ID ${params?.id}:`, error);
    return {
      notFound: true,
    };
  }
}