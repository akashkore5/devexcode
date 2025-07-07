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
import questions from "../../data/system_design_questions.json";
import {
  ChevronLeftIcon,
  CheckCircleIcon,
  HeartIcon,
  PencilSquareIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/solid";
import { useState, useCallback, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

export default function SystemDesignArticle({ frontmatter, content, relatedQuestions, questionId }) {
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

  // Updated difficulty colors for better contrast
  const getDifficultyColor = () => {
    switch (frontmatter.difficulty) {
      case "Easy":
      case "Beginner":
        return { bg: "#34D399", text: "#1A3C34" }; // Green, ~7:1 contrast
      case "Medium":
      case "Intermediate":
        return { bg: "#FBBF24", text: "#3F2A00" }; // Yellow, ~4.7:1 contrast
      case "Hard":
      case "Advanced":
        return { bg: "#EF4444", text: "#3C0F0F" }; // Red, ~5:1 contrast
      default:
        return { bg: "#E5E7EB", text: "#1F2937" }; // Gray, ~7:1 contrast
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
      console.error("[SystemDesignArticle] Error fetching CSRF token:", error.message, error.stack);
      if (retries > 0) {
        console.log(`[SystemDesignArticle] Retrying CSRF fetch (${retries} attempts left)...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchCsrfToken(retries - 1, delay * 2);
      }
      console.error("[SystemDesignArticle] CSRF token fetch failed after retries");
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
    if (status !== "authenticated" || !questionId) return;

    const fetchProgress = async () => {
      try {
        const response = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "systemdesign", action: "all" }),
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        const numericId = Number(questionId);
        setIsSolved((data.solved || []).includes(numericId));
        setIsTagged((data.tagged || []).includes(numericId));
      } catch (error) {
        console.error("Error fetching progress:", error);
        toast.error("Failed to load progress");
      }
    };

    fetchProgress();
  }, [questionId, status]);

  // Mark article as viewed
  useEffect(() => {
    if (status !== "authenticated" || !questionId) return;

    const checkAndMarkViewed = async () => {
      try {
        const numericId = Number(questionId);
        const response = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "systemdesign", action: "viewed", id: numericId }),
          credentials: "include",
        });
        const data = await response.json();
        if (data.isPresent) return;

        const markResponse = await fetch("/api/user/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "systemdesign", action: "viewed", id: numericId }),
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
  }, [questionId, status]);

  const handleMarkSolved = useCallback(async () => {
    if (status !== "authenticated") {
      setIsLoginModalOpen(true);
      return;
    }

    const numericId = Number(questionId);
    const willRemove = isSolved;
    setIsSolving(true);
    try {
      const response = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "systemdesign",
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
  }, [questionId, status, isSolved]);

  const handleLikeTag = useCallback(async () => {
    if (status !== "authenticated") {
      setIsLoginModalOpen(true);
      return;
    }

    const numericId = Number(questionId);
    const willRemove = isTagged;
    setIsTagging(true);
    try {
      const response = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "systemdesign",
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
  }, [questionId, status, isTagged]);

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
      console.log("[SystemDesignArticle] Submitting contribution with payload:", {
        articleId: questionId,
        url: `https://devexcode.com/system-design/${questionId}-${generateSlug(frontmatter.title || "system-design")}`,
        title: frontmatter.title,
        contentLength: contributionContent.length,
        userEmail: session?.user?.email || "anonymous",
        csrfToken,
      });
      const response = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: questionId,
          url: `https://devexcode.com/system-design/${questionId}-${generateSlug(frontmatter.title || "system-design")}`,
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
              articleId: questionId,
              url: `https://devexcode.com/system-design/${questionId}-${generateSlug(frontmatter.title || "system-design")}`,
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
            console.error("[SystemDesignArticle] Retry failed:", retryData.message);
            toast.error(retryData.message || "Failed to submit contribution");
          }
        } else {
          toast.error("Failed to refresh CSRF token");
        }
      } else {
        console.error("[SystemDesignArticle] Contribution submission failed:", data.message);
        toast.error(data.message || "Failed to submit contribution");
      }
    } catch (error) {
      console.error("[SystemDesignArticle] Error submitting contribution:", error.message, error.stack);
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

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } },
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title || "System Design Guide",
    description: `Comprehensive system design guide for ${frontmatter.title || "Untitled System Design Question"}, covering microservices, scalability, caching, and architecture patterns.`,
    keywords: `system design, ${frontmatter.title || "system design"}, ${frontmatter.difficulty || "system architecture"}, ${(Array.isArray(frontmatter.tags) ? frontmatter.tags : []).join(", ") || "system design"}, microservices, scalability, caching, load balancing`,
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
      "@id": `https://devexcode.com/system-design/${questionId}-${generateSlug(frontmatter.title || "system-design")}`,
    },
    image: [
      "https://devexcode.com/og-image.jpg",
      `https://devexcode.com/system-design-${questionId}-guide.png`,
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
          name: "System Design",
          item: "https://devexcode.com/system-design",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: frontmatter.title || "System Design Article",
          item: `https://devexcode.com/system-design/${questionId}-${generateSlug(frontmatter.title || "system-design")}`,
        },
      ],
    },
  };

  return (
    <Layout
      title={`${frontmatter.title || "System Design Article"} | DevCodeEx`}
      description={`Master system design for ${frontmatter.title || "Untitled System Design Question"} with a detailed guide on microservices, scalability, and architecture.`}
      isLoginModalOpen={isLoginModalOpen}
      setIsLoginModalOpen={setIsLoginModalOpen}
    >
      <Head>
        <meta
          name="keywords"
          content={`system design, ${frontmatter.title || "system design"}, ${frontmatter.difficulty || "system architecture"}, ${(Array.isArray(frontmatter.tags) ? frontmatter.tags : []).join(", ") || "system design"}, microservices, scalability, caching, load balancing, system design interview`}
        />
        <meta
          name="description"
          content={`Learn system design for ${frontmatter.title || "Untitled System Design Question"} with a comprehensive guide on architecture, microservices, and scalability.`}
        />
        <meta name="author" content="DevCodeEx Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content={`${frontmatter.title || "System Design Article"} | DevCodeEx`}
        />
        <meta
          property="og:description"
          content={`Explore system design for ${frontmatter.title || "Untitled System Design Question"} with detailed architecture, microservices, and scalability strategies.`}
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://devexcode.com/system-design/${questionId}-${generateSlug(frontmatter.title || "system-design")}`}
        />
        <meta
          property="og:image"
          content={`https://devexcode.com/system-design-${questionId}-guide.png`}
        />
        <meta
          property="og:image:alt"
          content={`System Design Guide for ${frontmatter.title || "System Design"}`}
        />
        <meta property="og:site_name" content="DevCodeEx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${frontmatter.title || "System Design Article"} | DevCodeEx`}
        />
        <meta
          name="twitter:description"
          content={`Master system design for ${frontmatter.title || "Untitled System Design Question"} with expert architecture and scalability insights.`}
        />
        <meta
          name="twitter:image"
          content={`https://devexcode.com/system-design-${questionId}-guide.png`}
        />
        <meta
          name="twitter:image:alt"
          content={`System Design Guide for ${frontmatter.title || "System Design"}`}
        />
        <meta name="twitter:creator" content="@DevCodeEx" />
        <link
          rel="canonical"
          href={`https://devexcode.com/system-design/${questionId}-${generateSlug(frontmatter.title || "system-design")}`}
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
              href="/system-design"
              className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
              aria-label="Back to System Design Questions"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Back to System Design Questions
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
              {frontmatter.title || "System Design Article"}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => router.push(`/system-design?difficulty=${frontmatter.difficulty || ""}`)}
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: getDifficultyColor().bg,
                  color: getDifficultyColor().text,
                }}
                aria-label={`Filter by ${frontmatter.difficulty || "difficulty"}`}
              >
                {frontmatter.difficulty || "Unknown"}
              </button>
              {(Array.isArray(frontmatter.tags) ? frontmatter.tags : []).map((tag) => (
                <Link
                  key={tag}
                  href={`/system-design?tag=${encodeURIComponent(tag)}`}
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
                aria-label="Contribute to this article"
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
                  <div className="flex justify-between items-center mb-4">
                    <h2 id="contribute-modal-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Contribute to {frontmatter.title || "System Design Article"}
                    </h2>
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
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Suggest edits to the system design article below using Markdown. Your changes will be sent for review.
                  </p>
                  <textarea
                    value={contributionContent}
                    onChange={(e) => setContributionContent(e.target.value)}
                    className="w-full h-64 p-4 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                    placeholder="Edit the article content in Markdown..."
                    aria-label="Edit system design article content"
                    disabled={isSolving}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                    <div className="flex gap-4">
                      <motion.button
                        onClick={() => {
                          setIsContributeModalOpen(false);
                          setContributionContent(content);
                        }}
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
                      ? "bg-gray-800 text-gray-100 border border-gray-600" // High contrast: ~10:1
                      : isSql
                      ? "bg-blue-900 text-blue-100 border border-blue-700" // High contrast: ~8:1
                      : isSpec
                      ? "bg-purple-900 text-purple-100 border border-purple-700" // High contrast: ~7:1
                      : "bg-gray-900 text-gray-100 border border-gray-700"; // High contrast: ~12:1

                    return inline ? (
                      <code className="bg-gray-200 text-gray-900 rounded px-1 py-0.5" {...props}>
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
                  table: ({ children }) => (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{children}</td>
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
                          href={`/system-design/${q.id}-${generateSlug(q.title)}`}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline text-base font-medium"
                          aria-label={`View ${q.title}`}
                        >
                          {q.title}
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
  try {
    const questions = require("../../data/system_design_questions.json");
    const paths = questions.map((question) => ({
      params: { id: [`${question.id}-${generateSlug(question.title)}`] },
    }));
    
    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error loading system_design_questions.json in getStaticPaths:", error.message);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}

export async function getStaticProps({ params }) {
  // Extract id from the route (first part before the slug)
  const idParam = params.id[0];
  const id = idParam.split("-")[0];
  const numericId = Number(id);

  // Log for debugging
  

  // Find the question
  let question;
  try {
    question = questions.find((q) => String(q.id) === String(id));
    if (!question) {
      console.error(`Question not found for id: ${id}`);
      return {
        notFound: true,
      };
    }
  } catch (error) {
    console.error("Error accessing system_design_questions.json:", error.message);
    return {
      notFound: true,
    };
  }

  // Generate the correct slug
  const correctSlug = generateSlug(question.title);
  const requestedPath = idParam;

  // Log slug comparison
  

  // Redirect if the slug is missing or incorrect
  if (!requestedPath.includes("-") || requestedPath !== `${id}-${correctSlug}`) {
    
    return {
      redirect: {
        destination: `/system-design/${id}-${correctSlug}`,
        permanent: true,
      },
    };
  }

  // Read the markdown file
  const postsDirectory = path.join(process.cwd(), "system_design_blogs");
  let fileContent;
  let frontmatter = {};
  let content = `# ${question.title}\n\nContent not available yet. Please check back later or contribute to this article.`;

  try {
    const filePath = path.join(postsDirectory, `design_${id}_blog.md`);
    
    fileContent = fs.readFileSync(filePath, "utf8");
    const matterResult = matter(fileContent);
    frontmatter = {
      ...matterResult.data,
      title: matterResult.data.title || question.title || "System Design Article",
      difficulty: matterResult.data.difficulty || question.difficulty || "Unknown",
      tags: Array.isArray(matterResult.data.tags) ? matterResult.data.tags : [],
      date: matterResult.data.date || new Date().toISOString(),
    };
    content = matterResult.content;
  } catch (error) {
    console.warn(`Markdown file design_${id}_blog.md not found or error reading: ${error.message}`);
    frontmatter = {
      title: question.title || "System Design Article",
      difficulty: question.difficulty || "Unknown",
      tags: Array.isArray(question.tags) ? question.tags : [],
      date: new Date().toISOString(),
    };
    console.log(`Using fallback frontmatter: ${JSON.stringify(frontmatter)}`);
  }

  // Find related questions (same tags, excluding the current question)
  const relatedQuestions = questions
    .filter(
      (q) =>
        String(q.id) !== String(id) &&
        (Array.isArray(q.tags) && Array.isArray(frontmatter.tags) && q.tags.some((tag) => frontmatter.tags.includes(tag)))
    )
    .slice(0, 5);

  return {
    props: {
      frontmatter,
      content,
      relatedQuestions,
      questionId: id,
    },
    revalidate: 86400, // Revalidate every 24 hours
  };
}