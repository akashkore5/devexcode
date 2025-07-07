import { useState, useEffect, useCallback, useMemo, useTransition } from "react";
import { useSession, getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { UserIcon, CodeBracketIcon, RocketLaunchIcon, ArrowPathIcon, BookOpenIcon, LightBulbIcon, ScaleIcon, CodeBracketSquareIcon } from "@heroicons/react/24/solid";
import DOMPurify from "isomorphic-dompurify";
import Layout from "../components/Layout";
import dynamic from "next/dynamic";
import problems from "../data/problems.json";
import systemDesignQuestions from "../data/system_design_questions.json";
import learn10Questions from "../data/10min_topics.json";
import devTipsData from "../data/micro_dev_tips.json";
import techBattlesData from "../data/tech_battles.json";
import gfgProblems from "../data/gfgproblems.json"; // Assumed data file
import debounce from "lodash/debounce";

// Lazy-load Chart.js components
const Pie = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), { ssr: false });
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

// Constants
const MAX_TITLE_LENGTH = 50;
const CHART_HEIGHT = "72";
const API_ENDPOINTS = {
  PROGRESS_CHECK: process.env.NEXT_PUBLIC_API_BASE_URL
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/progress/check`
    : "/api/user/progress/check",
};
const COLORS = {
  solved: "#4f46e5",
  viewed: "#2563eb",
  tagged: "#db2777",
  remaining: "#e5e7eb",
  border: "#ffffff",
};
const TYPES = [
  { key: "leetcode", label: "Leetcode", Icon: CodeBracketIcon },
  { key: "systemdesign", label: "System Design", Icon: RocketLaunchIcon },
  { key: "learn10", label: "10-Minute Learn", Icon: BookOpenIcon },
  { key: "devtips", label: "Micro Dev Tips", Icon: LightBulbIcon },
  { key: "techbattles", label: "Tech Battles", Icon: ScaleIcon },
  { key: "gfg", label: "GFG", Icon: CodeBracketSquareIcon },
];

// Utility to trim titles
const trimTitle = (title, maxLength = MAX_TITLE_LENGTH) => {
  if (!title) return "Unknown";
  return title.length > maxLength ? `${title.slice(0, maxLength - 3)}...` : title;
};

// Skeleton loader component
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
    </div>
    <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded"></div>
  </div>
);

// Reusable Progress Card Component
const ProgressCard = ({ title, Icon, stats, total, pieData, isLoading }) => {
  const [legendColor, setLegendColor] = useState("#1f2937");

  useEffect(() => {
    const updateLegendColor = () => {
      setLegendColor(document.documentElement.classList.contains("dark") ? "#ffffff" : "#1f2937");
    };
    updateLegendColor();
    const observer = new MutationObserver(updateLegendColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const pieOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: legendColor,
            font: { size: 14, weight: "bold" },
            padding: 20,
            boxWidth: 10,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          titleFont: { size: 16, weight: "bold" },
          bodyFont: { size: 14 },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context) => `${context.label}: ${context.raw}`,
          },
        },
      },
    }),
    [legendColor]
  );

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
      }}
      initial="hidden"
      animate="visible"
      className="flex-none w-80 sm:w-96 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700"
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        {Icon && <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-2" aria-hidden="true" />}
        {title}
      </h3>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="space-y-4">
          {["solved", "viewed", "tagged"].map((key) => (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 dark:text-gray-300 font-medium capitalize">{key}</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {stats[key]}/{total}
                </span>
              </div>
              <motion.div
                className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2"
                initial={{ width: 0 }}
                animate={{ width: `${(stats[key] / total) * 100}%` }}
                transition={{ duration: 0.7 }}
              >
                <div className="h-2 rounded-full" style={{ backgroundColor: COLORS[key] }} />
              </motion.div>
            </div>
          ))}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600 dark:text-gray-300 font-medium">Remaining</span>
              <span className="font-semibold text-gray-600 dark:text-gray-400">{stats.remaining}</span>
            </div>
          </div>
          <div className={`h-${CHART_HEIGHT} overflow-hidden`}>
            <Pie
              data={pieData}
              options={pieOptions}
              aria-label={`${title} progress chart: Solved ${stats.solved}, Viewed ${stats.viewed}, Tagged ${stats.tagged}, Remaining ${stats.remaining}`}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Reusable Achievement Section Component
const AchievementSection = ({ title, Icon, items, type, emptyMessage }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    }}
    initial="hidden"
    animate="visible"
    className="p-8 bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-3xl shadow-xl"
  >
    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
      {Icon && <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" aria-hidden="true" />}
      {title}
    </h3>
    <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
      {["solved", "tagged", "viewed"].map((status) => (
        <div key={status} className="flex-1">
          <h4 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-4 capitalize">
            {status} {type === "learn10" ? "Topics" : type === "leetcode" ? "Problems" : type === "devtips" ? "Tips" : type === "techbattles" ? "Battles" : type === "gfg" ? "Problems" : "Items"}
          </h4>
          {items[status].length > 0 ? (
            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto pr-2">
              {items[status].map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm hover:shadow-lg transition-shadow flex items-center justify-between border border-gray-100 dark:border-slate-700"
                >
                  <Link
                    href={`/${type}/${item.id}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium truncate"
                    aria-label={`View ${item.title}`}
                  >
                    {item.title}
                  </Link>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      status === "solved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : status === "tagged"
                        ? "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              {emptyMessage[status]}{" "}
              <Link
                href={`/${type}`}
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
                aria-label={`Explore ${type} ${status}`}
              >
                Explore now
              </Link>
            </p>
          )}
        </div>
      ))}
    </div>
  </motion.div>
);

export default function Profile({ totalLeetcodeQuestions, totalSystemDesignQuestions, totalLearn10Questions, totalDevTips, totalTechBattles, totalGfgProblems }) {
  const { data: session, status } = useSession();
  const [userName, setUserName] = useState("");
  const [progress, setProgress] = useState({
    leetcode: { viewed: [], solved: [], tagged: [] },
    systemdesign: { viewed: [], solved: [], tagged: [] },
    learn10: { viewed: [], solved: [], tagged: [] },
    devtips: { viewed: [], solved: [], tagged: [] },
    techbattles: { viewed: [], solved: [], tagged: [] },
    gfg: { viewed: [], solved: [], tagged: [] },
  });
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Memoized totals with validation
  const totals = useMemo(
    () => ({
      leetcode: Math.max(totalLeetcodeQuestions || problems.length, 0),
      systemdesign: Math.max(totalSystemDesignQuestions || systemDesignQuestions.length, 0),
      learn10: Math.max(totalLearn10Questions || learn10Questions.length, 0),
      devtips: Math.max(totalDevTips || devTipsData.length, 0),
      techbattles: Math.max(totalTechBattles || techBattlesData.length, 0),
      gfg: Math.max(totalGfgProblems || gfgProblems.length, 0),
    }),
    [totalLeetcodeQuestions, totalSystemDesignQuestions, totalLearn10Questions, totalDevTips, totalTechBattles, totalGfgProblems]
  );

  // Memoized stats
  const stats = useMemo(
    () => ({
      leetcode: {
        viewed: progress.leetcode.viewed.length,
        solved: progress.leetcode.solved.length,
        tagged: progress.leetcode.tagged.length,
        remaining: Math.max(totals.leetcode - progress.leetcode.solved.length, 0),
      },
      systemdesign: {
        viewed: progress.systemdesign.viewed.length,
        solved: progress.systemdesign.solved.length,
        tagged: progress.systemdesign.tagged.length,
        remaining: Math.max(totals.systemdesign - progress.systemdesign.solved.length, 0),
      },
      learn10: {
        viewed: progress.learn10.viewed.length,
        solved: progress.learn10.solved.length,
        tagged: progress.learn10.tagged.length,
        remaining: Math.max(totals.learn10 - progress.learn10.solved.length, 0),
      },
      devtips: {
        viewed: progress.devtips.viewed.length,
        solved: progress.devtips.solved.length,
        tagged: progress.devtips.tagged.length,
        remaining: Math.max(totals.devtips - progress.devtips.solved.length, 0),
      },
      techbattles: {
        viewed: progress.techbattles.viewed.length,
        solved: progress.techbattles.solved.length,
        tagged: progress.techbattles.tagged.length,
        remaining: Math.max(totals.techbattles - progress.techbattles.solved.length, 0),
      },
      gfg: {
        viewed: progress.gfg.viewed.length,
        solved: progress.gfg.solved.length,
        tagged: progress.gfg.tagged.length,
        remaining: Math.max(totals.gfg - progress.gfg.solved.length, 0),
      },
    }),
    [progress, totals]
  );

  // Memoized mapped items
  const items = useMemo(
    () => ({
      leetcode: {
        viewed: progress.leetcode.viewed.map((id) => {
          const problem = problems.find((p) => p.id === id || p.id === String(id));
          return {
            id,
            title: trimTitle(problem?.title || "Unknown"),
          };
        }),
        solved: progress.leetcode.solved.map((id) => {
          const problem = problems.find((p) => p.id === id || p.id === String(id));
          return {
            id,
            title: trimTitle(problem?.title || "Unknown"),
          };
        }),
        tagged: progress.leetcode.tagged.map((id) => {
          const problem = problems.find((p) => p.id === id || p.id === String(id));
          return {
            id,
            title: trimTitle(problem?.title || "Unknown"),
          };
        }),
      },
      systemdesign: {
        viewed: progress.systemdesign.viewed.map((id) => {
          const question = systemDesignQuestions.find((q) => q.id === id || q.id === String(id));
          return {
            id,
            title: trimTitle(question?.title || "Unknown"),
          };
        }),
        solved: progress.systemdesign.solved.map((id) => {
          const question = systemDesignQuestions.find((q) => q.id === id || q.id === String(id));
          return {
            id,
            title: trimTitle(question?.title || "Unknown"),
          };
        }),
        tagged: progress.systemdesign.tagged.map((id) => {
          const question = systemDesignQuestions.find((q) => q.id === id || q.id === String(id));
          return {
            id,
            title: trimTitle(question?.title || "Unknown"),
          };
        }),
      },
      learn10: {
        viewed: progress.learn10.viewed.map((id) => ({
          id,
          title: trimTitle(learn10Questions.find((q) => q.id === id)?.question || "Unknown"),
        })),
        solved: progress.learn10.solved.map((id) => ({
          id,
          title: trimTitle(learn10Questions.find((q) => q.id === id)?.question || "Unknown"),
        })),
        tagged: progress.learn10.tagged.map((id) => ({
          id,
          title: trimTitle(learn10Questions.find((q) => q.id === id)?.question || "Unknown"),
        })),
      },
      devtips: {
        viewed: progress.devtips.viewed.map((id) => {
          const tip = devTipsData.find((t) => t.id === id || t.id === String(id));
          return {
            id,
            title: trimTitle(tip?.title || "Unknown Tip"),
          };
        }),
        solved: progress.devtips.solved.map((id) => {
          const tip = devTipsData.find((t) => t.id === id || t.id === String(id));
          return {
            id,
            title: trimTitle(tip?.title || "Unknown Tip"),
          };
        }),
        tagged: progress.devtips.tagged.map((id) => {
          const tip = devTipsData.find((t) => t.id === id || t.id === String(id));
          return {
            id,
            title: trimTitle(tip?.title || "Unknown Tip"),
          };
        }),
      },
      techbattles: {
        viewed: progress.techbattles.viewed.map((id) => {
          const battle = techBattlesData.find((b) => b.id === id || b.id === String(id));
          return {
            id,
            title: trimTitle(battle?.title || "Unknown Battle"),
          };
        }),
        solved: progress.techbattles.solved.map((id) => {
          const battle = techBattlesData.find((b) => b.id === id || b.id === String(id));
          return {
            id,
            title: trimTitle(battle?.title || "Unknown Battle"),
          };
        }),
        tagged: progress.techbattles.tagged.map((id) => {
          const battle = techBattlesData.find((b) => b.id === id || b.id === String(id));
          return {
            id,
            title: trimTitle(battle?.title || "Unknown Battle"),
          };
        }),
      },
      gfg: {
        viewed: progress.gfg.viewed.map((id) => {
          const problem = gfgProblems.find((p) => p.id === id || p.id === String(id));
          return {
            id,
            title: trimTitle(problem?.title || "Unknown"),
          };
        }),
        solved: progress.gfg.solved.map((id) => {
          const problem = gfgProblems.find((p) => p.id === id || p.id === String(id));
          return {
            id,
            title: trimTitle(problem?.title || "Unknown"),
          };
        }),
        tagged: progress.gfg.tagged.map((id) => {
          const problem = gfgProblems.find((p) => p.id === id || p.id === String(id));
          return {
            id,
            title: trimTitle(problem?.title || "Unknown"),
          };
        }),
      },
    }),
    [progress]
  );

  // Memoized pie chart data
  const pieData = useMemo(
    () => ({
      leetcode: {
        labels: ["Viewed", "Solved", "Tagged", "Remaining"],
        datasets: [
          {
            data: [
              stats.leetcode.viewed,
              stats.leetcode.solved,
              stats.leetcode.tagged,
              stats.leetcode.remaining,
            ],
            backgroundColor: [COLORS.viewed, COLORS.solved, COLORS.tagged, COLORS.remaining],
            borderColor: [COLORS.border, COLORS.border, COLORS.border, COLORS.border],
            borderWidth: 2,
          },
        ],
      },
      systemdesign: {
        labels: ["Solved", "Viewed", "Tagged", "Remaining"],
        datasets: [
          {
            data: [
              stats.systemdesign.solved,
              stats.systemdesign.viewed,
              stats.systemdesign.tagged,
              stats.systemdesign.remaining,
            ],
            backgroundColor: [COLORS.solved, COLORS.viewed, COLORS.tagged, COLORS.remaining],
            borderColor: [COLORS.border, COLORS.border, COLORS.border, COLORS.border],
            borderWidth: 2,
          },
        ],
      },
      learn10: {
        labels: ["Solved", "Viewed", "Tagged", "Remaining"],
        datasets: [
          {
            data: [
              stats.learn10.solved,
              stats.learn10.viewed,
              stats.learn10.tagged,
              stats.learn10.remaining,
            ],
            backgroundColor: [COLORS.solved, COLORS.viewed, COLORS.tagged, COLORS.remaining],
            borderColor: [COLORS.border, COLORS.border, COLORS.border, COLORS.border],
            borderWidth: 2,
          },
        ],
      },
      devtips: {
        labels: ["Solved", "Viewed", "Tagged", "Remaining"],
        datasets: [
          {
            data: [
              stats.devtips.solved,
              stats.devtips.viewed,
              stats.devtips.tagged,
              stats.devtips.remaining,
            ],
            backgroundColor: [COLORS.solved, COLORS.viewed, COLORS.tagged, COLORS.remaining],
            borderColor: [COLORS.border, COLORS.border, COLORS.border, COLORS.border],
            borderWidth: 2,
          },
        ],
      },
      techbattles: {
        labels: ["Solved", "Viewed", "Tagged", "Remaining"],
        datasets: [
          {
            data: [
              stats.techbattles.solved,
              stats.techbattles.viewed,
              stats.techbattles.tagged,
              stats.techbattles.remaining,
            ],
            backgroundColor: [COLORS.solved, COLORS.viewed, COLORS.tagged, COLORS.remaining],
            borderColor: [COLORS.border, COLORS.border, COLORS.border, COLORS.border],
            borderWidth: 2,
          },
        ],
      },
      gfg: {
        labels: ["Solved", "Viewed", "Tagged", "Remaining"],
        datasets: [
          {
            data: [
              stats.gfg.solved,
              stats.gfg.viewed,
              stats.gfg.tagged,
              stats.gfg.remaining,
            ],
            backgroundColor: [COLORS.solved, COLORS.viewed, COLORS.tagged, COLORS.remaining],
            borderColor: [COLORS.border, COLORS.border, COLORS.border, COLORS.border],
            borderWidth: 2,
          },
        ],
      },
    }),
    [stats]
  );

  // Debounced fetch progress with useTransition
  const fetchProgress = useCallback(
    debounce(() => {
      startTransition(() => {
        setIsLoadingProgress(true);
        setIsRefreshing(true);
        fetch(API_ENDPOINTS.PROGRESS_CHECK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "all", action: "all" }),
        })
          .then(async (response) => {
            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || `HTTP error: ${response.status}`);
            }
            const data = await response.json();
            if (!data || typeof data !== "object") throw new Error("Invalid API response");
            setProgress({
              leetcode: {
                viewed: (data.leetcode?.viewed || []).map(Number),
                solved: (data.leetcode?.solved || []).map(Number),
                tagged: (data.leetcode?.tagged || []).map(Number),
              },
              systemdesign: {
                viewed: (data.systemdesign?.viewed || []).map(Number),
                solved: (data.systemdesign?.solved || []).map(Number),
                tagged: (data.systemdesign?.tagged || []).map(Number),
              },
              learn10: {
                viewed: (data.learn10?.viewed || []).map(Number),
                solved: (data.learn10?.solved || []).map(Number),
                tagged: (data.learn10?.tagged || []).map(Number),
              },
              devtips: {
                viewed: (data.devtips?.viewed || []).map(Number),
                solved: (data.devtips?.solved || []).map(Number),
                tagged: (data.devtips?.tagged || []).map(Number),
              },
              techbattles: {
                viewed: (data.techbattles?.viewed || []).map(Number),
                solved: (data.techbattles?.solved || []).map(Number),
                tagged: (data.techbattles?.tagged || []).map(Number),
              },
              gfg: {
                viewed: (data.gfg?.viewed || []).map(Number),
                solved: (data.gfg?.solved || []).map(Number),
                tagged: (data.gfg?.tagged || []).map(Number),
              },
            });
          })
          .catch((error) => {
            console.error("Fetch progress error:", error.message);
            toast.error("Error loading progress");
          })
          .finally(() => {
            setIsLoadingProgress(false);
            setIsRefreshing(false);
          });
      });
    }, 300),
    []
  );

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUserName(session.user.name || session.user.email?.split("@")[0] || "User");
      fetchProgress();
    } else {
      setUserName("");
      setProgress({
        leetcode: { viewed: [], solved: [], tagged: [] },
        systemdesign: { viewed: [], solved: [], tagged: [] },
        learn10: { viewed: [], solved: [], tagged: [] },
        devtips: { viewed: [], solved: [], tagged: [] },
        techbattles: { viewed: [], solved: [], tagged: [] },
        gfg: { viewed: [], solved: [], tagged: [] },
      });
    }
  }, [status, session, fetchProgress]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-slate-900">
        <svg
          className="animate-spin h-10 w-10 text-indigo-600 dark:text-indigo-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading profile"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://devexcode.com";
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToCard = (index) => {
    const container = document.querySelector(".progress-container");
    if (container) {
      const cardWidth = 384; // Approximate width of a card (w-96) + padding
      container.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  return (
    <Layout isLoggedIn={status === "authenticated"} userName={userName}>
      <Head>
        <title>DevExCode - Your Profile</title>
        <meta
          name="description"
          content="Track your progress on Leetcode problems, system design articles, 10-minute learn topics, Micro Dev Tips, Tech Battles, and GFG problems with a beautifully designed profile page."
        />
        <meta
          name="keywords"
          content="Leetcode progress, system design progress, 10-minute learn progress, Micro Dev Tips, Tech Battles, GeeksforGeeks progress, coding profile, interview prep, progress tracking"
        />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="DevExCode - Your Profile" />
        <meta
          property="og:description"
          content="Track your coding, system design, 10-minute learn, Micro Dev Tips, Tech Battles, and GFG progress with DevExCode's personalized profile page."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}/profile`} />
        <meta property="og:image" content={`${baseUrl}/og-image.jpg`} />
        <meta property="og:image:alt" content="DevExCode user profile preview" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DevExCode - Your Profile" />
        <meta
          name="twitter:description"
          content="Visualize your Leetcode, system design, 10-minute learn, Micro Dev Tips, Tech Battles, and GFG progress with charts and detailed lists."
        />
        <meta name="twitter:image" content={`${baseUrl}/twitter-image.jpg`} />
        <meta name="twitter:image:alt" content="DevExCode user profile preview" />
        <link rel="canonical" href={`${baseUrl}/profile`} />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="theme-color" content="#4f46e5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ProfilePage",
                name: "DevExCode User Profile",
                url: `${baseUrl}/profile`,
                description:
                  "View your progress on Leetcode problems, system design articles, 10-minute learn topics, Micro Dev Tips, Tech Battles, and GFG problems, including solved, tagged, and viewed items.",
                publisher: { "@type": "Organization", name: "DevExCode Team" },
              })
            ),
          }}
        />
      </Head>

      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6"
          >
            Welcome, <span className="text-indigo-600 dark:text-indigo-400">{userName}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Monitor your learning journey across coding, system design, 10-minute topics, Micro Dev Tips, Tech Battles, and GFG with DevExCode.
          </motion.p>
        </div>
      </section>

      {/* User Details */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
            }}
            initial="hidden"
            animate="visible"
            className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 rounded-3xl shadow-xl p-8"
          >
            <div className="flex items-center space-x-6">
              <UserIcon className="w-16 h-16 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{userName}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {session?.user?.email || "No email provided"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Progress Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-gray-900 dark:text-white"
            >
              Your Progress
            </motion.h2>
            <motion.button
              onClick={fetchProgress}
              disabled={isRefreshing || isPending}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Refresh progress data"
            >
              <ArrowPathIcon
                className={`w-5 h-5 mr-2 ${isRefreshing || isPending ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              Refresh Progress
            </motion.button>
          </div>
          <div className="progress-container relative overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            <div className="flex space-x-6 pb-4">
              {TYPES.map(({ key, label, Icon }) => (
                <ProgressCard
                  key={key}
                  title={`${label} Progress`}
                  Icon={Icon}
                  stats={stats[key]}
                  total={totals[key]}
                  pieData={pieData[key]}
                  isLoading={isLoadingProgress || isPending}
                />
              ))}
            </div>
          </div>
          {/* Navigation Dots (Moved outside scrollable container) */}
          <div className="flex justify-center mt-4 space-x-2">
            {TYPES.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToCard(index)}
                className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"} transition-colors`}
                aria-label={`Go to ${TYPES[index].label} progress`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-12"
          >
            Your Achievements
          </motion.h2>
          <div className="space-y-8">
            {TYPES.map(({ key, label, Icon }) => (
              <AchievementSection
                key={key}
                title={`${label} Achievements`}
                Icon={Icon}
                items={items[key]}
                type={key === "systemdesign" ? "system-design" : key}
                emptyMessage={{
                  solved: `No ${key === "learn10" ? "topics" : key === "leetcode" ? "problems" : key === "devtips" ? "tips" : key === "techbattles" ? "battles" : key === "gfg" ? "problems" : "items"} solved yet.`,
                  tagged: `No ${key === "learn10" ? "topics" : key === "leetcode" ? "problems" : key === "devtips" ? "tips" : key === "techbattles" ? "battles" : key === "gfg" ? "problems" : "items"} tagged yet.`,
                  viewed: `No ${key === "learn10" ? "topics" : key === "leetcode" ? "problems" : key === "devtips" ? "tips" : key === "techbattles" ? "battles" : key === "gfg" ? "problems" : "items"} viewed yet.`,
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Validate and calculate totals
  const validateTotal = (data) => {
    return Array.isArray(data) && data.every(item => item && typeof item.id === "number") ? data.length : 0;
  };

  return {
    props: {
      totalLeetcodeQuestions: validateTotal(problems),
      totalSystemDesignQuestions: validateTotal(systemDesignQuestions),
      totalLearn10Questions: validateTotal(learn10Questions),
      totalDevTips: validateTotal(devTipsData),
      totalTechBattles: validateTotal(techBattlesData),
      totalGfgProblems: validateTotal(gfgProblems),
    },
  };
}