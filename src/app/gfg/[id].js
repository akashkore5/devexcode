import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import Link from "next/link";
import { useState, useCallback, useEffect, useMemo, memo, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Component } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import Head from "next/head";
import DOMPurify from "isomorphic-dompurify";
import { useSession } from "next-auth/react";
import { CheckCircleIcon, HeartIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import gfgProblems from "../../data/gfgproblems.json"; // Import GFG problems data

// Monaco Editor with SSR disabled for better performance
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// Error Boundary Component to handle rendering errors gracefully
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <p className="text-red-500 text-center py-4" role="alert">Failed to render code block</p>;
    }
    return this.props.children;
  }
}

// Generate static paths for all GFG problems based on markdown files
export async function getStaticPaths() {
  const postsDir = path.join(process.cwd(), "gfgblogs");
  let files;
  try {
    files = fs.readdirSync(postsDir);
  } catch (error) {
    console.error("[getStaticPaths] Error reading GFG posts directory:", error);
    files = [];
  }

  const paths = files
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => ({
      params: {
        id: filename.replace(".md", ""),
      },
    }));

  return {
    paths,
    fallback: false, // If a path doesn't exist, return 404
  };
}

// Fetch static props for each problem page
export async function getStaticProps({ params }) {
  try {
    const filePath = path.join(process.cwd(), "gfgblogs", `${params.id}.md`);
    if (!fs.existsSync(filePath)) {
      console.warn(`[getStaticProps] Markdown file not found for id: ${params.id}`);
      return { notFound: true };
    }
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    // Extract code blocks for supported languages
    const langs = ["java", "cpp", "python"];
    const codeBlocks = {};

    langs.forEach((lang) => {
      const regex = new RegExp(`\`\`\`${lang}\n([\\s\\S]*?)\n\`\`\``, "i");
      const match = content.match(regex);
      codeBlocks[lang] = match ? match[1].trim() : "";
    });

    // Process the explanation content as HTML
    const explanationContent = content.split(/```[a-z]+/i)[0].trim();
    const processedContent = await remark().use(html).process(explanationContent);
    const contentHtml = processedContent.toString();

    // Find the problem in gfg_problems.json by matching params.id with the id field
    const problem = gfgProblems.find((p) => p.id === params.id);
    const gfgUrl = problem?.url || `https://www.geeksforgeeks.org/problems/problem-${params.id}/1`;

    return {
      props: {
        frontMatter: { ...data, gfgUrl }, // Pass the GFG URL to the component
        contentHtml,
        codeBlocks,
      },
    };
  } catch (error) {
    console.error(`[getStaticProps] Error for id: ${params.id}:`, error);
    return { notFound: true };
  }
}

// Memoized ProblemPage component to prevent unnecessary re-renders
const ProblemPage = memo(function ProblemPage({ frontMatter, contentHtml, codeBlocks }) {
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

  // Calculate next and previous IDs for navigation
  const currentId = parseInt(frontMatter.id, 10);
  const nextId = currentId + 1;
  const prevId = currentId > 1 ? currentId - 1 : null;

  // Sanitize HTML content to prevent XSS
  const sanitizedContentHtml = useMemo(() => {
    return DOMPurify.sanitize(contentHtml, { USE_PROFILES: { html: true } });
  }, [contentHtml]);

  // Check user's progress (solved/tagged status) when authenticated
  useEffect(() => {
    if (status !== "authenticated" || !currentId) return;

    const checkProgress = async () => {
      try {
        const response = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "gfg", action: "all", id: currentId }),
        });
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        if (!data || typeof data !== "object") {
          throw new Error("Invalid API response");
        }
        const solved = (data.solved || []).map(Number);
        const tagged = (data.tagged || []).map(Number);
        setIsSolved(solved.includes(currentId));
        setIsTagged(tagged.includes(currentId));
      } catch (error) {
        console.error(`[checkProgress] Error for GFG ID ${currentId}:`, error);
        toast.error("Failed to load progress", { id: "progress-error" });
      }
    };

    checkProgress();
  }, [currentId, status]);

  // Highlight code blocks when the active tab changes
  useEffect(() => {
    if (typeof window !== "undefined" && codeRef.current) {
      try {
        if (!codeBlocks[activeTab]) {
          console.warn(`No code available for language: ${activeTab}`);
          return;
        }
        if (codeRef.current.dataset.highlighted) {
          delete codeRef.current.dataset.highlighted;
        }
        hljs.highlightElement(codeRef.current);
      } catch (error) {
        console.error(`[highlightCode] Error for language ${activeTab}:`, error);
        toast.error("Failed to highlight code", { id: "highlight-error" });
      }
    }
  }, [activeTab, codeBlocks]);

  // Fetch main method code for the editor
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
        console.error(`[fetchMainCode] Error for GFG ID ${currentId}, lang ${activeTab}:`, error);
        toast.error("Failed to load main code", { id: "main-code-error" });
        setEditorCode(codeBlocks[activeTab] || "");
      }
    };

    fetchMainCode();
  }, [activeTab, currentId, codeBlocks]);

  // Mark the problem as viewed when authenticated
  useEffect(() => {
    if (status !== "authenticated" || !currentId) return;

    const checkAndMarkViewed = async () => {
      try {
        const response = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "gfg", action: "viewed", id: currentId }),
        });
        const data = await response.json();
        if (data.isPresent) return;

        const markResponse = await fetch("/api/user/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "gfg", action: "viewed", id: currentId }),
        });
        if (!markResponse.ok) {
          console.error(`[markViewed] Failed for GFG ID ${currentId}:`, markResponse.statusText);
        }
      } catch (error) {
        console.error(`[markViewed] Error for GFG ID ${currentId}:`, error);
      }
    };

    checkAndMarkViewed();
  }, [currentId, status]);

  // Copy code to clipboard
  const copyToClipboard = useCallback(async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyIcon("check");
      toast.success("Code copied to clipboard!", {
        duration: 2000,
        position: "bottom-right",
        id: "copy-success",
      });
      setTimeout(() => setCopyIcon("copy"), 2000);
    } catch (err) {
      console.error("[copyToClipboard] Error:", err);
      toast.error("Failed to copy code", { id: "copy-error" });
    }
  }, []);

  // Toggle solved status
  const handleToggleSolved = useCallback(async () => {
    if (status !== "authenticated") {
      setIsLoginModalOpen(true);
      return;
    }

    const willRemove = isSolved;
    setIsSolving(true);
    try {
      const response = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "gfg",
          action: "solved",
          id: currentId,
          remove: willRemove,
        }),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const checkResponse = await fetch("/api/user/progress/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "gfg", action: "all", id: currentId }),
      });
      const data = await checkResponse.json();
      const solved = (data.solved || []).map(Number);
      setIsSolved(solved.includes(currentId));
      toast.success(solved.includes(currentId) ? "Problem marked as solved!" : "Problem unmarked as solved", {
        id: "solved-toggle",
      });
    } catch (error) {
      console.error(`[handleToggleSolved] Error for GFG ID ${currentId}:`, error);
      toast.error("Failed to update solved status", { id: "solved-error" });
    } finally {
      setIsSolving(false);
    }
  }, [currentId, status, isSolved]);

  // Toggle tagged status
  const handleToggleTagged = useCallback(async () => {
    if (status !== "authenticated") {
      setIsLoginModalOpen(true);
      return;
    }

    const willRemove = isTagged;
    setIsTagging(true);
    try {
      const response = await fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "gfg",
          action: "tagged",
          id: currentId,
          remove: willRemove,
        }),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const checkResponse = await fetch("/api/user/progress/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "gfg", action: "all", id: currentId }),
      });
      const data = await checkResponse.json();
      const tagged = (data.tagged || []).map(Number);
      setIsTagged(tagged.includes(currentId));
      toast.success(tagged.includes(currentId) ? "Problem tagged!" : "Problem untagged", {
        id: "tagged-toggle",
      });
    } catch (error) {
      console.error(`[handleToggleTagged] Error for GFG ID ${currentId}:`, error);
      toast.error("Failed to update tag status", { id: "tagged-error" });
    } finally {
      setIsTagging(false);
    }
  }, [currentId, status, isTagged]);

  // Run code in the editor
  const handleRunCode = useCallback(async () => {
    if (!editorCode) {
      toast.error("No code to execute", { id: "run-code-empty" });
      return;
    }

    setIsSubmitting(true);
    setExecutionResult(null);

    try {
      const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          source_code: editorCode,
          language_id: activeTab === "java" ? 62 : activeTab === "cpp" ? 54 : 71,
          stdin: "",
        }),
      });

      if (!response.ok) {
        throw new Error(`Judge0 submission failed: ${response.statusText}`);
      }

      const { token } = await response.json();

      let result;
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const statusResponse = await fetch(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true`,
          {
            headers: {
              "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );
        result = await statusResponse.json();
        if (result.status.id > 2) break;
      }

      let errorDetails = null;
      if (result.stderr) {
        const stderr = atob(result.stderr);
        const lineMatch = stderr.match(/:(\d+):/);
        errorDetails = {
          message: stderr,
          line: lineMatch ? parseInt(lineMatch[1]) : null,
        };
      }

      setExecutionResult({
        stdout: result.stdout ? atob(result.stdout) : null,
        stderr: errorDetails ? errorDetails.message : null,
        line: errorDetails ? errorDetails.line : null,
        status: result.status.description,
      });
    } catch (error) {
      console.error(`[handleRunCode] Error for GFG ID ${currentId}:`, error);
      toast.error(`Failed to execute code: ${error.message}`, { id: "run-code-error" });
    } finally {
      setIsSubmitting(false);
    }
  }, [editorCode, activeTab, currentId]);

  // Compute difficulty color for UI
  const getDifficultyColor = useMemo(() => {
    switch (frontMatter.difficulty) {
      case "Easy":
        return { bg: "#34D399", text: "#1A3C34" };
      case "Medium":
        return { bg: "#FBBF24", text: "#3F2A00" };
      case "Hard":
        return { bg: "#EF4444", text: "#3C0F0F" };
      default:
        return { bg: "#E5E7EB", text: "#1F2937" };
    }
  }, [frontMatter.difficulty]);

  // Animation variants for smooth transitions
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${frontMatter.id}. ${frontMatter.title || "GFG Solution"}`,
    description: `Solve GeeksforGeeks problem ${frontMatter.id}: ${frontMatter.title || "Untitled Problem"} with optimized solutions in Java, C++, and Python. Includes detailed explanations, code editor, and execution results.`,
    keywords: `GeeksforGeeks ${frontMatter.id}, ${frontMatter.title}, ${frontMatter.difficulty || "programming"} problem, coding solution, Java, C++, Python, algorithms, data structures, coding interview`,
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
    datePublished: frontMatter.date || new Date().toISOString(),
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://devexcode.com/gfg/${frontMatter.id}`,
    },
    image: [
      "https://devexcode.com/og-image.jpg",
      `https://devexcode.com/gfg-${frontMatter.id}-solution.png`,
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
          name: "GFG Solutions",
          item: "https://devexcode.com/gfg",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${frontMatter.id}. ${frontMatter.title}`,
          item: `https://devexcode.com/gfg/${frontMatter.id}`,
        },
      ],
    },
  };

  return (
    <Layout
      title={`${frontMatter.id}. ${frontMatter.title || "GFG Solution"} - DevCodeEx`}
      description={`Solve GeeksforGeeks problem ${frontMatter.id}: ${frontMatter.title || "Untitled Problem"} with optimized Java, C++, and Python solutions, detailed explanations, and interactive code editor.`}
      isLoginModalOpen={isLoginModalOpen}
      setIsLoginModalOpen={setIsLoginModalOpen}
    >
      <Head>
        <meta
          name="keywords"
          content={`GeeksforGeeks ${frontMatter.id}, ${frontMatter.title}, ${frontMatter.difficulty || "programming"} solution, Java, C++, Python, algorithms, data structures, coding interview, GFG problem, optimized code`}
        />
        <meta
          name="description"
          content={`Master GeeksforGeeks problem ${frontMatter.id}: ${frontMatter.title || "Untitled Problem"} with step-by-step solutions in Java, C++, and Python, plus interactive code execution.`}
        />
        <meta name="author" content="DevCodeEx Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content={`${frontMatter.id}. ${frontMatter.title || "GFG Solution"} - DevCodeEx`}
        />
        <meta
          property="og:description"
          content={`Solve GeeksforGeeks ${frontMatter.id}: ${frontMatter.title || "Untitled Problem"} with optimized Java, C++, and Python code, detailed explanations, and an interactive editor.`}
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://devexcode.com/gfg/${frontMatter.id}`}
        />
        <meta
          property="og:image"
          content={`https://devexcode.com/gfg-${frontMatter.id}-solution.png`}
        />
        <meta
          property="og:image:alt"
          content={`GeeksforGeeks ${frontMatter.id}: ${frontMatter.title} solution preview`}
        />
        <meta property="og:site_name" content="DevCodeEx" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${frontMatter.id}. ${frontMatter.title || "GFG Solution"} - DevCodeEx`}
        />
        <meta
          name="twitter:description"
          content={`Master GeeksforGeeks ${frontMatter.id}: ${frontMatter.title || "Untitled Problem"} with expert Java, C++, and Python solutions and interactive coding.`}
        />
        <meta
          property="twitter:image"
          content={`https://devexcode.com/gfg-${frontMatter.id}-solution.png`}
        />
        <meta
          property="twitter:image:alt"
          content={`GeeksforGeeks ${frontMatter.id}: ${frontMatter.title} solution preview`}
        />
        <meta name="twitter:creator" content="@DevCodeEx" />
        <link
          rel="canonical"
          href={`https://devexcode.com/gfg/${frontMatter.id}`}
        />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="sitemap" href="/sitemap.xml" />
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
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Problem Header */}
          <motion.header
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 mb-6"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {frontMatter.id}. {frontMatter.title || "Untitled Problem"}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => router.push(`/gfg?difficulty=${frontMatter.difficulty}`)}
                className={`px-4 py-2 rounded-full text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${getDifficultyColor.bg}`}
                style={{
                  backgroundColor: getDifficultyColor.bg,
                  color: getDifficultyColor.text,
                }}
                aria-label={`Filter by ${frontMatter.difficulty} difficulty`}
              >
                {frontMatter.difficulty || "Unknown"}
              </button>
              {frontMatter.tags?.map((tag) => (
                <Link
                  key={tag}
                  href={`/gfg?tag=${encodeURIComponent(tag)}`}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  prefetch={false}
                  aria-label={`Filter by ${tag} tag`}
                >
                  {tag}
                </Link>
              ))}
              <motion.button
                onClick={handleToggleSolved}
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
                onClick={handleToggleTagged}
                disabled={isTagging}
                className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  isTagged
                    ? "bg-gradient-to-r from-pink-600 to-pink-700 dark:from-pink-800 dark:to-pink-900 text-white"
                    : "bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-800 dark:to-gray-900 text-white"
                } hover:scale-105 disabled:opacity-50`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isTagged ? "Untag problem" : "Tag problem"}
              >
                <HeartIcon className="w-5 h-5 mr-2" />
                {isTagging ? "Processing..." : "Tag"}
              </motion.button>
            </div>
          </motion.header>

          {/* Problem Explanation */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 mb-6"
          >
            <div
              className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-200"
              dangerouslySetInnerHTML={{
                __html: sanitizedContentHtml || "<p>No explanation available.</p>",
              }}
              aria-label="Problem explanation"
            />
            <div className="mt-6">
              <a
                href={frontMatter.gfgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-800 dark:to-indigo-900 text-white rounded-lg shadow-md hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="View the problem on GeeksforGeeks"
              >
                View GeeksforGeeks Problem
              </a>
            </div>
          </motion.section>

          {/* Solutions */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg mb-6"
          >
            <nav className="border-b border-gray-200 dark:border-slate-700">
              <div className="flex" role="tablist" aria-label="Programming languages">
                {["java", "cpp", "python"].map((lang) => (
                  <button
                    key={lang}
                    role="tab"
                    aria-selected={activeTab === lang}
                    aria-controls={`panel-${lang}`}
                    id={`tab-${lang}`}
                    onClick={() => setActiveTab(lang)}
                    className={`px-4 sm:px-6 py-3 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                      activeTab === lang
                        ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-slate-700"
                        : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </nav>

            <div className="p-0 sm:p-2">
              <ErrorBoundary>
                {codeBlocks[activeTab] ? (
                  <div
                    className="relative group"
                    id={`panel-${activeTab}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${activeTab}`}
                  >
                    <button
                      onClick={() => copyToClipboard(codeBlocks[activeTab])}
                      className="absolute right-3 top-3 p-2 rounded-md bg-gray-700/50 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      title="Copy code"
                      aria-label="Copy code to clipboard"
                    >
                      {copyIcon === "copy" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                      <pre>
                        <code ref={codeRef} className={`language-${activeTab}`}>
                          {codeBlocks[activeTab]}
                        </code>
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div
                    className="text-center py-4"
                    id={`panel-${activeTab}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${activeTab}`}
                  >
                    <p className="text-gray-500 dark:text-gray-400">
                      Solution not available in {activeTab.toUpperCase()}
                    </p>
                  </div>
                )}
              </ErrorBoundary>
            </div>
          </motion.section>

          {/* Code Editor */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 mb-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Code Editor (Testing phase)
            </h2>
            <div className="mb-4 p-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg">
              <h4 className="font-semibold mb-2">Improve Your Solution</h4>
              <div className="text-sm">
                <p className="mb-2">
                  Use the editor below to refine the provided solution. Select a programming language and try the following:
                </p>
                <ul className="list-disc list-inside">
                  <li>Add import statement if required.</li>
                  <li>Optimize the code for better time or space complexity.</li>
                  <li>Add test cases to validate edge cases and common scenarios.</li>
                  <li>Handle error conditions or invalid inputs gracefully.</li>
                  <li>Experiment with alternative approaches to deepen your understanding.</li>
                </ul>
                <p className="mt-2">
                  Click "Run Code" to execute your solution and view the output. If errors occur, check the line numbers and debug accordingly. Resize the editor by dragging its bottom edge.
                </p>
              </div>
            </div>
            <nav className="border-b border-gray-200 dark:border-slate-700 mb-4">
              <div className="flex" role="tablist" aria-label="Editor programming languages">
                {["java", "cpp", "python"].map((lang) => (
                  <button
                    key={lang}
                    role="tab"
                    aria-selected={activeTab === lang}
                    aria-controls={`editor-panel-${lang}`}
                    id={`editor-tab-${lang}`}
                    onClick={() => setActiveTab(lang)}
                    className={`px-4 py-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                      activeTab === lang
                        ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-slate-700"
                        : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </nav>
            <div
              id={`editor-panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`editor-tab-${activeTab}`}
            >
              <MonacoEditor
                height="400px"
                minHeight="300px"
                maxHeight="600px"
                language={activeTab}
                theme="vs-dark"
                value={editorCode}
                onChange={(value) => setEditorCode(value)}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  automaticLayout: true,
                  wordWrap: "on",
                  resize: "vertical",
                  pasteAsText: true,
                  contextmenu: true,
                  autocorrect: "off",
                  autocapitalize: "off",
                  spellcheck: false,
                }}
              />
            </div>
            <div className="flex justify-end mt-4 gap-4">
              <button
                onClick={handleRunCode}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white rounded-lg shadow-md hover:scale-105 disabled:opacity-50 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Run code in editor"
              >
                {isSubmitting ? "Running..." : "Run Code"}
              </button>
            </div>
            {executionResult && (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-slate-700 rounded-lg">
                <h3 className="font-semibold mb-2">Execution Result:</h3>
                <p>Status: {executionResult.status}</p>
                {executionResult.stdout && (
                  <pre className="mt-2 p-2 bg-gray-200 dark:bg-slate-600 rounded">
                    {executionResult.stdout}
                  </pre>
                )}
                {executionResult.stderr && (
                  <pre className="mt-2 p-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
                    {executionResult.line ? `Error at line ${executionResult.line}:\n` : ""}
                    {executionResult.stderr}
                  </pre>
                )}
              </div>
            )}
          </motion.section>

          {/* Navigation Buttons */}
          <motion.div
            className="flex justify-between mt-6"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            {prevId !== null && (
              <Link
                href={`/gfg/${prevId}`}
                className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Go to previous question"
              >
                Previous Question
              </Link>
            )}
            <Link
              href={`/gfg/${nextId}`}
              className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Go to next question"
            >
              Next Question
            </Link>
          </motion.div>
        </motion.article>
      </main>
    </Layout>
  );
});

export default ProblemPage;