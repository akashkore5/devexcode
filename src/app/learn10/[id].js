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
import questions from "../../data/10min_topics.json";
import { ChevronLeftIcon, CheckCircleIcon, HeartIcon, PencilSquareIcon, ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import { useState, useCallback, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function Learn10Article({ frontmatter, content, relatedQuestions }) {
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

  // Assign categories based on ID ranges
  const getCategory = (id) => {
    id = Number(id);
    if (id <= 10 || (id >= 101 && id <= 110) || (id >= 201 && id <= 210)) return "System Design";
    if ((id >= 11 && id <= 20) || (id >= 211 && id <= 220)) return "Databases";
    if (id >= 221 && id <= 230) return "LLM/AI Tools";
    if (id >= 231 && id <= 240) return "Dev Tools";
    if (id >= 241 && id <= 250) return "Backend Frameworks";
    if (id >= 251 && id <= 260) return "Frontend & Design";
    if (id >= 261 && id <= 270) return "API Design";
    if (id >= 271 && id <= 280) return "Debugging & Monitoring";
    if (id >= 281 && id <= 290) return "Cloud Native & Kubernetes";
    if (id >= 291 && id <= 300) return "Computer Science";
    if ((id >= 111 && id <= 120) || (id >= 171 && id <= 180)) return "API Design";
    if (id >= 121 && id <= 130) return "System Design";
    if ((id >= 131 && id <= 140) || (id >= 161 && id <= 170)) return "Computer Science";
    if (id >= 141 && id <= 150) return "Databases";
    if (id >= 151 && id <= 160) return "Frontend & Design";
    if (id >= 181 && id <= 190) return "Debugging & Monitoring";
    if (id >= 191 && id <= 200) return "Computer Science";
    return "System Design"; // Fallback
  };

  // Category colors
  const getCategoryColor = () => {
    const colors = {
      "System Design": { bg: "#3B82F6", text: "#FFFFFF" },
      Databases: { bg: "#10B981", text: "#FFFFFF" },
      "LLM/AI Tools": { bg: "#F59E0B", text: "#FFFFFF" },
      "Dev Tools": { bg: "#8B5CF6", text: "#FFFFFF" },
      "Backend Frameworks": { bg: "#EC4899", text: "#FFFFFF" },
      "Frontend & Design": { bg: "#14B8A6", text: "#FFFFFF" },
      "API Design": { bg: "#F97316", text: "#FFFFFF" },
      "Debugging & Monitoring": { bg: "#6B7280", text: "#FFFFFF" },
      "Cloud Native & Kubernetes": { bg: "#6366F1", text: "#FFFFFF" },
      "Computer Science": { bg: "#D1D5DB", text: "#1F2937" },
    };
    return colors[frontmatter.category] || { bg: "#E5E7EB", text: "#1F2937" };
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
      console.error("[Learn10Article] Error fetching CSRF token:", error.message, error.stack);
      if (retries > 0) {
        console.log(`[Learn10Article] Retrying CSRF fetch (${retries} attempts left)...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchCsrfToken(retries - 1, delay * 2);
      }
      console.error("[Learn10Article] CSRF token fetch failed after retries");
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
          body: JSON.stringify({ type: "learn10", action: "all" }),
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        const numericId = Number(id);
        setIsSolved(data.solved.includes(numericId));
        setIsTagged(data.tagged.includes(numericId));
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
          body: JSON.stringify({ type: "learn10", action: "viewed", id: numericId }),
          credentials: "include",
        });
        const data = await response.json();
        if (data.isPresent) return;

        const markResponse = await fetch("/api/user/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "learn10", action: "viewed", id: numericId }),
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
          type: "learn10",
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
          type: "learn10",
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
      console.log("[Learn10Article] Submitting contribution with payload:", {
        articleId: id,
        url: `https://devexcode.com/learn10/${id}`,
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
          url: `https://devexcode.com/learn10/${id}`,
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
              url: `https://devexcode.com/learn10/${id}`,
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
            console.error("[Learn10Article] Retry failed:", retryData.message);
            toast.error(retryData.message || "Failed to submit contribution");
          }
        } else {
          toast.error("Failed to refresh CSRF token");
        }
      } else {
        console.error("[Learn10Article] Contribution submission failed:", data.message);
        toast.error(data.message || "Failed to submit contribution");
      }
    } catch (error) {
      console.error("[Learn10Article] Error submitting contribution:", error.message, error.stack);
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
    headline: frontmatter.title || "10-Minute Learn Guide",
    description: `Concise guide for ${frontmatter.title || "Untitled 10-Minute Learn Topic"}, covering ${frontmatter.category || "technical concepts"} in a 10-minute format.`,
    keywords: `${frontmatter.keywords || ""}, ${frontmatter.category || "technical guide"}, 10-minute learn, quick learning, developer guide`,
    author: {
      "@type": "Organization",
      name: "DevExCode",
    },
    publisher: {
      "@type": "Organization",
      name: "DevExCode",
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
      "@id": `https://devexcode.com/learn10/${id}`,
    },
    image: [
      "https://devexcode.com/og-image-learn10.jpg",
      `https://devexcode.com/learn10-${id}-guide.png`,
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
          name: "10-Minute Learn",
          item: "https://devexcode.com/learn10",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: frontmatter.title,
          item: `https://devexcode.com/learn10/${id}`,
        },
      ],
    },
  };

  return (
    <Layout
      title={`${frontmatter.title} | DevExCode`}
      description={`Learn ${frontmatter.title || "Untitled 10-Minute Learn Topic"} in 10 minutes with a concise guide on ${frontmatter.category || "technical concepts"}.`}
      isLoginModalOpen={isLoginModalOpen}
      setIsLoginModalOpen={setIsLoginModalOpen}
    >
      <Head>
        <meta
          name="keywords"
          content={`${frontmatter.keywords || ""}, ${frontmatter.category || "technical guide"}, 10-minute learn, quick learning, developer guide, tutorial`}
        />
        <meta
          name="description"
          content={`Learn ${frontmatter.title || "Untitled 10-Minute Learn Topic"} in 10 minutes with a concise guide on ${frontmatter.category || "technical concepts"}.`}
        />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content={`${frontmatter.title} | DevExCode`}
        />
        <meta
          property="og:description"
          content={`Explore ${frontmatter.title || "Untitled 10-Minute Learn Topic"} with a 10-minute guide on ${frontmatter.category || "technical concepts"}.`}
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://devexcode.com/learn10/${id}`}
        />
        <meta
          property="og:image"
          content={`https://devexcode.com/learn10-${id}-guide.png`}
        />
        <meta
          property="og:image:alt"
          content={`10-Minute Learn Guide for ${frontmatter.title}`}
        />
        <meta property="og:site_name" content="DevExCode" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${frontmatter.title} | DevExCode`}
        />
        <meta
          name="twitter:description"
          content={`Master ${frontmatter.title || "Untitled 10-Minute Learn Topic"} in 10 minutes with expert insights on ${frontmatter.category || "technical concepts"}.`}
        />
        <meta
          name="twitter:image"
          content={`https://devexcode.com/learn10-${id}-guide.png`}
        />
        <meta
          name="twitter:image:alt"
          content={`10-Minute Learn Guide for ${frontmatter.title}`}
        />
        <meta name="twitter:creator" content="@DevExCode" />
        <link
          rel="canonical"
          href={`https://devexcode.com/learn10/${id}`}
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
              href="/learn10"
              className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
              aria-label="Back to 10-Minute Learn Questions"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Back to 10-Minute Learn Questions
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
                onClick={() => router.push(`/learn10?category=${encodeURIComponent(frontmatter.category)}`)}
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: getCategoryColor().bg,
                  color: getCategoryColor().text,
                }}
                aria-label={`Filter by ${frontmatter.category} category`}
              >
                {frontmatter.category}
              </button>
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
                aria-label="Contribute to this 10-minute learn guide"
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
                    Suggest edits to the 10-minute learn guide below using Markdown. Your changes will be sent for review.
                  </p>
                  <textarea
                    value={contributionContent}
                    onChange={(e) => setContributionContent(e.target.value)}
                    className="w-full h-64 p-4 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                    placeholder="Edit the 10-minute learn content in Markdown..."
                    aria-label="Edit 10-minute learn content"
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
                  Related Questions
                </h3>
                <ul className="space-y-3">
                  {relatedQuestions.length > 0 ? (
                    relatedQuestions.map((q) => (
                      <li key={q.id}>
                        <Link
                          href={`/learn10/${q.id}`}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline text-base font-medium"
                          aria-label={`View ${q.question}`}
                        >
                          {q.question}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 dark:text-gray-400 text-sm">
                      No related questions found.
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
  const paths = questions.map((q) => ({
    params: { id: q.id.toString() },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  try {
    const currentQuestion = questions.find((q) => q.id.toString() === params?.id);
    if (!currentQuestion) {
      console.error(`No question found for ID ${params?.id}`);
      return { notFound: true };
    }

    const sanitizeFilename = (filename) => {
      return filename.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");
    };

    const filePath = path.join(process.cwd(), "learn10", `${params.id.padStart(3, "0")}_${sanitizeFilename(currentQuestion.question)}.md`);
    let frontmatter, content;
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content: markdownContent } = matter(fileContent);
      frontmatter = data;
      content = markdownContent;
    } catch (error) {
      console.error(`Error reading blog file for ID ${params?.id}:`, error);
      frontmatter = {
        title: currentQuestion.question || "Untitled",
        category: getCategory(params.id) || "Unknown",
        keywords: "",
        date: null,
      };
      content = `## Placeholder Content\n\nThis 10-minute learn guide is under construction. Please check back later.`;
    }

    const getCategory = (id) => {
      id = Number(id);
      if (id <= 10 || (id >= 101 && id <= 110) || (id >= 201 && id <= 210)) return "System Design";
      if ((id >= 11 && id <= 20) || (id >= 211 && id <= 220)) return "Databases";
      if (id >= 221 && id <= 230) return "LLM/AI Tools";
      if (id >= 231 && id <= 240) return "Dev Tools";
      if (id >= 241 && id <= 250) return "Backend Frameworks";
      if (id >= 251 && id <= 260) return "Frontend & Design";
      if (id >= 261 && id <= 270) return "API Design";
      if (id >= 271 && id <= 280) return "Debugging & Monitoring";
      if (id >= 281 && id <= 290) return "Cloud Native & Kubernetes";
      if (id >= 291 && id <= 300) return "Computer Science";
      if ((id >= 111 && id <= 120) || (id >= 171 && id <= 180)) return "API Design";
      if (id >= 121 && id <= 130) return "System Design";
      if ((id >= 131 && id <= 140) || (id >= 161 && id <= 170)) return "Computer Science";
      if (id >= 141 && id <= 150) return "Databases";
      if (id >= 151 && id <= 160) return "Frontend & Design";
      if (id >= 181 && id <= 190) return "Debugging & Monitoring";
      if (id >= 191 && id <= 200) return "Computer Science";
      return "System Design"; // Fallback
    };

    const relatedQuestions = questions
      .filter((q) => q.id.toString() !== params?.id && getCategory(q.id) === getCategory(params.id))
      .slice(0, 5)
      .map((q) => ({ id: q.id, question: q.question }));

    return {
      props: {
        frontmatter: {
          title: frontmatter.title || currentQuestion.question || "Untitled",
          category: frontmatter.category || getCategory(params.id) || "Unknown",
          keywords: frontmatter.keywords || "",
          date: frontmatter.date || null,
        },
        content,
        relatedQuestions,
      },
    };
  } catch (error) {
    console.error(`Unexpected error for ID ${params?.id}:`, error);
    return {
      notFound: true,
    };
  }
}