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
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import Head from "next/head";
import DOMPurify from "isomorphic-dompurify";
import { useSession } from "next-auth/react";
import { CheckCircleIcon, HeartIcon, PencilSquareIcon, ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

// Cache problems.json to avoid repeated require calls
const problemsData = require("../../data/problems.json");

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <p className="text-gray-500 dark:text-gray-400">Loading code editor...</p>,
});

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <p className="text-red-500 text-center py-4">Failed to render code block</p>;
    }
    return this.props.children;
  }
}

export async function getStaticPaths() {
  const postsDir = path.join(process.cwd(), "posts");
  let files;
  try {
    files = fs.readdirSync(postsDir);
  } catch (error) {
    console.error("Error reading posts directory:", error);
    files = [];
  }

  const paths = files
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const filePath = path.join(postsDir, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);
      return {
        params: {
          id: `${data.id}-${data.title.toLowerCase().replace(/\s+/g, "-")}`,
        },
      };
    });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  try {
    const id = params.id.split("-")[0];
    const filePath = path.join(process.cwd(), "posts", `${id}.md`);
    if (!fs.existsSync(filePath)) {
      return { notFound: true };
    }
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const langs = ["java", "cpp", "python"];
    const codeBlocks = {};

    langs.forEach((lang) => {
      const regex = new RegExp(`\`\`\`${lang}\n([\\s\\S]*?)\n\`\`\``, "i");
      const match = content.match(regex);
      codeBlocks[lang] = match ? match[1].trim() : "";
    });

    const explanationContent = content.split(/```[a-z]+/i)[0].trim();
    const processedContent = await remark().use(html).process(explanationContent);
    const contentHtml = processedContent.toString();

    return {
      props: {
        frontMatter: data,
        contentHtml,
        codeBlocks,
      },
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { notFound: true };
  }
}

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
  const [editorHeight, setEditorHeight] = useState(500);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [contributionContent, setContributionContent] = useState(contentHtml);
  const [csrfToken, setCsrfToken] = useState("");
  const [csrfError, setCsrfError] = useState(false);
  const [modalWidth, setModalWidth] = useState("md"); // sm, md, lg
  const codeRef = useRef(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  const currentId = parseInt(frontMatter.id, 10);
  const nextId = currentId + 1;
  const prevId = currentId > 1 ? currentId - 1 : null;

  const sanitizedContentHtml = useMemo(() => {
    return DOMPurify.sanitize(contentHtml, { USE_PROFILES: { html: true } });
  }, [contentHtml]);

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
      console.error("[ProblemPage] Error fetching CSRF token:", error.message, error.stack);
      if (retries > 0) {
        console.log(`[ProblemPage] Retrying CSRF fetch (${retries} attempts left)...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchCsrfToken(retries - 1, delay * 2);
      }
      console.error("[ProblemPage] CSRF token fetch failed after retries");
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

  useEffect(() => {
    if (status !== "authenticated" || !currentId) return;

    const checkProgress = async () => {
      try {
        const response = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "leetcode", action: "all", id: currentId }),
          credentials: "include",
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
        console.error("[Progress Check] Error:", error);
        toast.error("Failed to load progress");
      }
    };

    checkProgress();
  }, [currentId, status]);

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
        console.error("Failed to highlight code:", error);
        toast.error("Failed to highlight code");
      }
    }
  }, [activeTab, codeBlocks]);

  useEffect(() => {
    const fetchMainCode = async () => {
      try {
        const response = await fetch(`/api/main-code?lang=${activeTab}&id=${currentId}`);
        const data = await response.json();
        if (data.code) {
          const cleanedCode = data.code.replace(/^```[\s\S]*?\n([\s\S]*)\n```$/, "$1").trim();
          setEditorCode(cleanedCode);
        } else {
          setEditorCode(codeBlocks[activeTab] || "");
        }
      } catch (error) {
        console.error("Error fetching main code:", error);
        toast.error("Failed to load main code");
        setEditorCode(codeBlocks[activeTab] || "");
      }
    };

    fetchMainCode();
  }, [activeTab, currentId, codeBlocks]);

  useEffect(() => {
    if (status !== "authenticated" || !currentId) return;

    const checkAndMarkViewed = async () => {
      try {
        const response = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "leetcode", action: "viewed", id: currentId }),
          credentials: "include",
        });
        const data = await response.json();
        if (data.isPresent) return;

        const markResponse = await fetch("/api/user/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "leetcode", action: "viewed", id: currentId }),
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
  }, [currentId, status]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const container = document.getElementById(`editor-panel-${activeTab}`);
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newHeight = e.clientY - containerRect.top - 50;
    const minHeight = 200;
    const maxHeight = containerRect.height - 200;

    if (newHeight >= minHeight && newHeight <= maxHeight) {
      setEditorHeight(newHeight);
    }
  }, [isDragging, activeTab]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  const copyToClipboard = useCallback(async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyIcon("check");
      toast.success("Code copied to clipboard!", {
        duration: 2000,
        position: "bottom-right",
      });
      setTimeout(() => setCopyIcon("copy"), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
      console.error("Failed to copy code:", err);
    }
  }, []);

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
          type: "leetcode",
          action: "solved",
          id: currentId,
          remove: willRemove,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const checkResponse = await fetch("/api/user/progress/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "leetcode", action: "all", id: currentId }),
        credentials: "include",
      });
      const data = await checkResponse.json();
      const solved = (data.solved || []).map(Number);
      setIsSolved(solved.includes(currentId));
      toast.success(solved.includes(currentId) ? "Problem marked as solved!" : "Problem unmarked as solved");
    } catch (error) {
      console.error("[Toggle Solved] Error:", error);
      toast.error("Failed to update solved status");
    } finally {
      setIsSolving(false);
    }
  }, [currentId, status, isSolved]);

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
          type: "leetcode",
          action: "tagged",
          id: currentId,
          remove: willRemove,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const checkResponse = await fetch("/api/user/progress/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "leetcode", action: "all", id: currentId }),
        credentials: "include",
      });
      const data = await checkResponse.json();
      const tagged = (data.tagged || []).map(Number);
      setIsTagged(tagged.includes(currentId));
      toast.success(tagged.includes(currentId) ? "Problem tagged!" : "Problem untagged");
    } catch (error) {
      console.error("[Toggle Tagged] Error:", error);
      toast.error("Failed to update tag status");
    } finally {
      setIsTagging(false);
    }
  }, [currentId, status, isTagged]);

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
      console.log("[ProblemPage] Submitting contribution with payload:", {
        articleId: currentId.toString(),
        url: `https://devexcode.com/leetcode/${frontMatter.id}-${frontMatter.title.toLowerCase().replace(/\s+/g, "-")}`,
        title: `LeetCode ${frontMatter.id}: ${frontMatter.title}`,
        contentLength: contributionContent.length,
        userEmail: session?.user?.email || "anonymous",
        csrfToken,
      });
      const response = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: currentId.toString(),
          url: `https://devexcode.com/leetcode/${frontMatter.id}-${frontMatter.title.toLowerCase().replace(/\s+/g, "-")}`,
          title: `LeetCode ${frontMatter.id}: ${frontMatter.title}`,
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
        setContributionContent(contentHtml);
      } else if (response.status === 403 && data.message === "Invalid CSRF token") {
        
        const newCsrfToken = await fetchCsrfToken();
        if (newCsrfToken) {
          const retryResponse = await fetch("/api/contributions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              articleId: currentId.toString(),
              url: `https://devexcode.com/leetcode/${frontMatter.id}-${frontMatter.title.toLowerCase().replace(/\s+/g, "-")}`,
              title: `LeetCode ${frontMatter.id}: ${frontMatter.title}`,
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
            setContributionContent(contentHtml);
          } else {
            console.error("[ProblemPage] Retry failed:", retryData.message);
            toast.error(retryData.message || "Failed to submit contribution");
          }
        } else {
          toast.error("Failed to refresh CSRF token");
        }
      } else {
        console.error("[ProblemPage] Contribution submission failed:", data.message);
        toast.error(data.message || "Failed to submit contribution");
      }
    } catch (error) {
      console.error("[ProblemPage] Error submitting contribution:", error.message, error.stack);
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

  const handleRunCode = useCallback(async () => {
    if (!editorCode) {
      toast.error("No code to execute");
      return;
    }

    setIsSubmitting(true);
    setExecutionResult(null);

    try {
      const languageMap = {
        java: { name: "java", version: "15.0.2", fileName: "Main.java" },
        cpp: { name: "cpp", version: "10.2.0", fileName: "main.cpp" },
        python: { name: "python", version: "3.10.0", fileName: "main.py" },
      };

      const { name, version, fileName } = languageMap[activeTab] || {};

      if (!name || !version) {
        throw new Error(`Unsupported language: ${activeTab}`);
      }

      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: name,
          version: version,
          files: [
            {
              name: fileName,
              content: editorCode,
            },
          ],
          stdin: "",
          args: [],
          compile_timeout: 10000,
          run_timeout: 3000,
          compile_memory_limit: -1,
          run_memory_limit: -1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Piston API failed: ${response.statusText}`);
      }

      const result = await response.json();

      let errorDetails = null;
      if (result.run.stderr) {
        const stderr = result.run.stderr;
        const lineMatch = stderr.match(/:(\d+):/);
        errorDetails = {
          message: stderr,
          line: lineMatch ? parseInt(lineMatch[1]) : null,
        };
      }

      setExecutionResult({
        stdout: result.run.stdout || null,
        stderr: errorDetails ? errorDetails.message : null,
        line: errorDetails ? errorDetails.line : null,
        status: result.run.code === 0 ? "Success" : `Failed (Exit Code: ${result.run.code})`,
      });
    } catch (error) {
      console.error("Error executing code:", error);
      toast.error("Failed to execute code: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [editorCode, activeTab]);

  const getDifficultyColor = useMemo(() => {
    switch (frontMatter.difficulty) {
      case "Easy":
        return { bg: "bg-green-100 text-green-800", text: "text-green-800" };
      case "Medium":
        return { bg: "bg-yellow-100 text-yellow-800", text: "text-yellow-800" };
      case "Hard":
        return { bg: "bg-red-100 text-red-800", text: "text-red-800" };
      default:
        return { bg: "bg-gray-100 text-gray-800", text: "text-gray-800" };
    }
  }, [frontMatter.difficulty]);

  // Structured Data with FAQ
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `LeetCode ${frontMatter.id}: ${frontMatter.title} Solution`,
    "description": `Solve LeetCode problem ${frontMatter.id} (${frontMatter.title}) with optimized solutions in Java, C++, and Python. Includes detailed explanations, interactive code editor, and execution results.`,
    "keywords": `LeetCode ${frontMatter.id}, LeetCode ${frontMatter.title}, LeetCode problem ${frontMatter.id} solution, ${frontMatter.difficulty} LeetCode problem, Java, C++, Python, algorithms, data structures, coding interview`,
    "author": {
      "@type": "Organization",
      "name": "DevExCode",
    },
    "publisher": {
      "@type": "Organization",
      "name": "DevExCode",
      "logo": {
        "@type": "ImageObject",
        "url": "https://devexcode.com/logo.png",
        "width": 150,
        "height": 50,
      },
    },
    "datePublished": frontMatter.date || new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://devexcode.com/leetcode/${frontMatter.id}-${frontMatter.title.toLowerCase().replace(/\s+/g, "-")}`,
    },
    "image": [
      `https://devexcode.com/leetcode-${frontMatter.id}-solution.png`,
      "https://devexcode.com/og-image.jpg",
    ],
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://devexcode.com/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "LeetCode Solutions",
          "item": "https://devexcode.com/leetcode",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `LeetCode ${frontMatter.id}: ${frontMatter.title}`,
          "item": `https://devexcode.com/leetcode/${frontMatter.id}-${frontMatter.title.toLowerCase().replace(/\s+/g, "-")}`,
        },
      ],
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `How to solve LeetCode ${frontMatter.id} (${frontMatter.title})?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `This page provides optimized solutions for LeetCode problem ${frontMatter.id} (${frontMatter.title}) in Java, C++, and Python, along with a detailed explanation and an interactive code editor to test your code.`,
          },
        },
        {
          "@type": "Question",
          "name": `What is the time complexity of LeetCode ${frontMatter.id} (${frontMatter.title})?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `The time complexity for LeetCode ${frontMatter.id} (${frontMatter.title}) varies by solution. Check the detailed explanation section for specific complexities in Java, C++, and Python implementations.`,
          },
        },
        {
          "@type": "Question",
          "name": `Can I run code for LeetCode ${frontMatter.id} on DevExCode?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Yes, DevExCode provides an interactive code editor where you can write, test, and run your code for LeetCode ${frontMatter.id} in Java, C++, or Python.`,
          },
        },
      ],
    },
  };

  // Fetch related problems dynamically
  const relatedProblems = useMemo(() => {
    return problemsData
      .filter((p) => p.id !== currentId && p.tags?.some((t) => frontMatter.tags?.includes(t)))
      .slice(0, 4)
      .map((p) => ({
        id: p.id,
        title: p.title,
      }));
  }, [currentId, frontMatter.tags]);

  // Validate prevId and nextId
  const prevProblem = prevId ? problemsData.find((p) => p.id === prevId) : null;
  const nextProblem = problemsData.find((p) => p.id === nextId);

  // Animation variants for contribution modal
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <Layout
      title={`LeetCode ${frontMatter.id}: ${frontMatter.title} Solution - DevExCode`}
      description={`Master LeetCode problem ${frontMatter.id} (${frontMatter.title}) with optimized Java, C++, and Python solutions. Detailed explanations, interactive code editor, and execution results included.`}
      isLoginModalOpen={isLoginModalOpen}
      setIsLoginModalOpen={setIsLoginModalOpen}
    >
      <Head>
        <meta
          name="keywords"
          content={`LeetCode ${frontMatter.id}, LeetCode ${frontMatter.title}, LeetCode problem ${frontMatter.id} solution, ${frontMatter.difficulty} LeetCode solution, Java, C++, Python, algorithms, data structures, coding interview, programming tutorial`}
        />
        <meta
          name="description"
          content={`Solve LeetCode ${frontMatter.id} (${frontMatter.title}) with expert Java, C++, and Python solutions. Includes step-by-step explanations, interactive code editor, and execution results.`}
        />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content={`LeetCode ${frontMatter.id}: ${frontMatter.title} Solution - DevExCode`}
        />
        <meta
          property="og:description"
          content={`Master LeetCode ${frontMatter.id} (${frontMatter.title}) with optimized Java, C++, and Python solutions, detailed explanations, and an interactive code editor.`}
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://devexcode.com/leetcode/${frontMatter.id}-${frontMatter.title.toLowerCase().replace(/\s+/g, "-")}`}
        />
        <meta
          property="og:image"
          content={`https://devexcode.com/leetcode-${frontMatter.id}-solution.png`}
        />
        <meta
          property="og:image:alt"
          content={`LeetCode ${frontMatter.id}: ${frontMatter.title} solution preview`}
        />
        <meta property="og:site_name" content="DevExCode" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`LeetCode ${frontMatter.id}: ${frontMatter.title} Solution - DevExCode`}
        />
        <meta
          name="twitter:description"
          content={`Solve LeetCode ${frontMatter.id} (${frontMatter.title}) with optimized Java, C++, and Python solutions on DevExCode.`}
        />
        <meta
          name="twitter:image"
          content={`https://devexcode.com/leetcode-${frontMatter.id}-solution.png`}
        />
        <meta
          name="twitter:image:alt"
          content={`LeetCode ${frontMatter.id}: ${frontMatter.title} solution preview`}
        />
        <meta name="twitter:creator" content="@DevExCode" />
        <link
          rel="canonical"
          href={`https://devexcode.com/leetcode/${frontMatter.id}-${frontMatter.title.toLowerCase().replace(/\s+/g, "-")}`}
        />
        <link rel="sitemap" href="/sitemap.xml" />
        <meta name="theme-color" content="#4f46e5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(JSON.stringify(structuredData)),
          }}
        />
      </Head>
      <Toaster />
      <main className="flex-grow max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        {/* Intro Section */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            LeetCode {frontMatter.id}: {frontMatter.title} Solution
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            Master LeetCode problem {frontMatter.id} ({frontMatter.title}), a {frontMatter.difficulty.toLowerCase()} challenge, with our optimized solutions in Java, C++, and Python. Explore detailed explanations, test your code in our interactive editor, and prepare for coding interviews.
          </p>
        </section>

        {/* Problem Header */}
        <header className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {frontMatter.id}. {frontMatter.title}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor.bg}`}
                >
                  {frontMatter.difficulty}
                </span>
                <div className="flex flex-wrap gap-2">
                  {frontMatter.tags?.map((tag) => (
                    <Link
                      key={tag}
                      href={`/leetcode?tag=${encodeURIComponent(tag)}`}
                      className="text-sm bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                      aria-label={`Filter by ${tag} tag`}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <button
                onClick={handleToggleSolved}
                disabled={isSolving}
                className={`flex items-center px-4 py-2 rounded-lg shadow-md text-white transition-transform duration-200 ${
                  isSolved
                    ? "bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900"
                    : "bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-800 dark:to-gray-900"
                } disabled:opacity-50`}
                aria-label={isSolved ? "Unmark as solved" : "Mark as solved"}
              >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                {isSolved ? "Solved" : "Mark Solved"}
              </button>
              <button
                onClick={handleToggleTagged}
                disabled={isTagging}
                className={`flex items-center px-4 py-2 rounded-lg shadow-md text-white transition-transform duration-200 ${
                  isTagged
                    ? "bg-gradient-to-r from-pink-600 to-pink-700 dark:from-pink-800 dark:to-pink-900"
                    : "bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-800 dark:to-gray-900"
                } disabled:opacity-50`}
                aria-label={isTagged ? "Untag problem" : "Tag problem"}
              >
                <HeartIcon className="w-5 h-5 mr-2" />
                {isTagged ? "Tagged" : "Tag"}
              </button>
              <motion.button
                onClick={handleContributeClick}
                disabled={csrfError}
                className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-transform duration-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white disabled:opacity-50`}
                whileHover={{ scale: csrfError ? 1 : 1.05 }}
                whileTap={{ scale: csrfError ? 1 : 0.95 }}
                aria-label="Contribute to this problem"
              >
                <PencilSquareIcon className="w-5 h-5 mr-2" />
                Contribute
              </motion.button>
            </div>
          </div>
        </header>

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
                  Contribute to LeetCode {frontMatter.id}: {frontMatter.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Suggest edits to the problem explanation below using Markdown. Your changes will be sent for review.
                </p>
                <textarea
                  value={contributionContent}
                  onChange={(e) => setContributionContent(e.target.value)}
                  className="w-full h-64 p-4 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  placeholder="Edit the problem explanation in Markdown..."
                  aria-label="Edit problem explanation"
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

        {/* Explanation Section */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Problem Explanation
          </h2>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedContentHtml }}
          />
        </section>

        {/* Solution Code Section */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Solution Code
          </h2>
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
            {["java", "cpp", "python"].map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={`px-4 py-2 text-sm font-medium capitalize ${
                  activeTab === lang
                    ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
                aria-label={`View ${lang} solution`}
              >
                {lang}
              </button>
            ))}
          </div>
          <ErrorBoundary>
            <div className="relative">
              <pre className="rounded-lg overflow-auto max-h-96">
                <code ref={codeRef} className={`language-${activeTab}`}>
                  {codeBlocks[activeTab] || "// No solution available"}
                </code>
              </pre>
              <button
                onClick={() => copyToClipboard(codeBlocks[activeTab])}
                className="absolute top-2 right-2 p-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                aria-label="Copy code to clipboard"
              >
                {copyIcon === "copy" ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012-2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            </div>
          </ErrorBoundary>
        </section>

        {/* Code Editor Section */}
        <section
          id={`editor-panel-${activeTab}`}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Try It Yourself
          </h2>
          <MonacoEditor
            height={`${editorHeight}px`}
            language={activeTab}
            value={editorCode}
            onChange={(value) => setEditorCode(value || "")}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: false,
              contextmenu: false,
              cursorStyle: "line",
              automaticLayout: true,
            }}
            className="border border-gray-200 dark:border-gray-700 rounded-lg"
            aria-label="Interactive code editor"
          />
          <div
            className="h-2 bg-gray-200 dark:bg-slate-700 cursor-ns-resize mt-2 rounded"
            onMouseDown={handleMouseDown}
            aria-label="Resize code editor"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleRunCode}
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition disabled:opacity-50"
              aria-label="Run code"
            >
              {isSubmitting ? "Running..." : "Run Code"}
            </button>
            <button
              onClick={() => setEditorCode(codeBlocks[activeTab] || "")}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition"
              aria-label="Reset code"
            >
              Reset
            </button>
          </div>
          {executionResult && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-slate-900 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Execution Result
              </h3>
              <p
                className={`mt-2 ${
                  executionResult.status === "Success"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                Status: {executionResult.status}
              </p>
              {executionResult.stdout && (
                <pre className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  Output: {executionResult.stdout}
                </pre>
              )}
              {executionResult.stderr && (
                <pre className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Error: {executionResult.stderr}
                  {executionResult.line && ` (Line ${executionResult.line})`}
                </pre>
              )}
            </div>
          )}
        </section>

        {/* Navigation */}
        <nav className="flex justify-between mb-8">
          {prevProblem && (
            <Link
              href={`/leetcode/${prevProblem.id}-${prevProblem.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition"
              aria-label={`Previous problem: LeetCode ${prevProblem.id}`}
            >
              Previous
            </Link>
          )}
          <div />
          {nextProblem && (
            <Link
              href={`/leetcode/${nextProblem.id}-${nextProblem.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition"
              aria-label={`Next problem: LeetCode ${nextProblem.id}`}
            >
              Next
            </Link>
          )}
        </nav>

        {/* Related Problems */}
        {relatedProblems.length > 0 && (
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Related LeetCode Problems
            </h2>
            <ul className="space-y-2">
              {relatedProblems.map((problem) => (
                <li key={problem.id}>
                  <Link
                    href={`/leetcode/${problem.id}-${problem.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    aria-label={`View LeetCode ${problem.id}: ${problem.title}`}
                  >
                    {problem.id}. {problem.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                How to solve LeetCode {frontMatter.id} ({frontMatter.title})?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                This page provides optimized solutions for LeetCode problem {frontMatter.id} (
                {frontMatter.title}) in Java, C++, and Python, along with a detailed explanation
                and an interactive code editor to test your code.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                What is the time complexity of LeetCode {frontMatter.id} ({frontMatter.title})?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                The time complexity for LeetCode {frontMatter.id} ({frontMatter.title}) varies by
                solution. Check the detailed explanation section for specific complexities in Java,
                C++, and Python implementations.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Can I run code for LeetCode {frontMatter.id} on DevExCode?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes, DevExCode provides an interactive code editor where you can write, test, and
                run your code for LeetCode {frontMatter.id} in Java, C++, or Python.
              </p>
            </div>
          </div>
        </section>

        {/* Back to LeetCode Hub */}
        <section className="text-center">
          <Link
            href="/leetcode"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition"
            aria-label="Back to LeetCode solutions hub"
          >
            Back to LeetCode Solutions
          </Link>
        </section>
      </main>
    </Layout>
  );
});

export default ProblemPage;