import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Layout from "../../components/Layout";
import gfgPotdData from "../../data/gfg_potd.json";
import leetcodePotdData from "../../data/leetcode_potd.json";
import DOMPurify from "isomorphic-dompurify";
import fs from "fs/promises";
import path from "path";

// Helper to format date as YYYY-MM-DD in local timezone
const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

// Helper to get months for dropdown
const getMonths = () => [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

// Helper to get years for dropdown dynamically based on available data
const getYears = (gfgData, leetcodeData) => {
    const allDates = [
        ...gfgData.map((potd) => potd.date),
        ...leetcodeData.map((potd) => potd.date),
    ];
    const years = new Set(allDates.map((date) => date.split("-")[0]));
    return Array.from(years).sort();
};

// Helper to generate URL-friendly slug from title
const generateSlug = (title) => {
    return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};

// Helper to generate random data for GFG and LeetCode problems (when missing)
const difficulties = ["Easy", "Medium", "Hard"];
const companiesList = ["Google", "Amazon", "Microsoft", "Facebook", "Apple", "Uber", "Adobe", "Netflix"];

const getRandomDifficulty = () => difficulties[Math.floor(Math.random() * difficulties.length)];

const getRandomCompanies = () => {
    const numCompanies = Math.floor(Math.random() * 3) + 1; // 1 to 3 companies
    const shuffled = companiesList.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numCompanies);
};

const getRandomAcceptanceRate = () => `${(Math.random() * 60 + 20).toFixed(2)}%`; // 20% to 80%

// Helper to calculate remaining time until end of day
const getRemainingTime = () => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999); // End of the current day
    const diffMs = endOfDay - now;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return {
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
        formatted: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    };
};

// Animation variants
const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.02, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)", transition: { duration: 0.3 } },
};

export default function PotdIndex({ initialGfgPotd, initialLeetcodePotd, error }) {
    const { data: session, status } = useSession();
    const today = formatLocalDate(new Date());
    const [gfgPotd, setGfgPotd] = useState(initialGfgPotd);
    const [leetcodePotd, setLeetcodePotd] = useState(initialLeetcodePotd);
    const [previousPotds, setPreviousPotds] = useState([]);
    const [selectedYear, setSelectedYear] = useState(today.split("-")[0]);
    const [selectedMonth, setSelectedMonth] = useState(getMonths()[new Date().getMonth()]);
    const [isLoading, setIsLoading] = useState(true);
    const [remainingTime, setRemainingTime] = useState(getRemainingTime());

    // Update remaining time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime(getRemainingTime());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Dynamically calculate available years
    const years = useMemo(() => getYears(gfgPotdData, leetcodePotdData), []);
    const months = getMonths();

    // Fetch POTD for today and previous days
    useEffect(() => {
        setIsLoading(true);

        // Today's POTD
        let gfgToday = gfgPotdData.find((potd) => potd.date === today);
        let leetcodeToday = leetcodePotdData.find((potd) => potd.date === today);

        // Add random data to GFG POTD if missing
        if (gfgToday) {
            gfgToday = {
                ...gfgToday,
                difficulty: gfgToday.difficulty || getRandomDifficulty(),
                companies: gfgToday.companies && gfgToday.companies.length > 0 ? gfgToday.companies : getRandomCompanies(),
                acceptance_rate: gfgToday.acceptance_rate || getRandomAcceptanceRate(),
            };
        } else {
            gfgToday = initialGfgPotd;
        }

        // Add random data to LeetCode POTD
        if (leetcodeToday) {
            leetcodeToday = {
                ...leetcodeToday,
                difficulty: leetcodeToday.difficulty || getRandomDifficulty(),
                companies: leetcodeToday.companies && leetcodeToday.companies.length > 0 ? leetcodeToday.companies : getRandomCompanies(),
                acceptance_rate: leetcodeToday.acceptance_rate || getRandomAcceptanceRate(),
            };
        } else {
            leetcodeToday = initialLeetcodePotd;
        }

        setGfgPotd(gfgToday || null);
        setLeetcodePotd(leetcodeToday || null);

        // All POTDs for selected year and month (with random data for GFG and LeetCode)
        const selectedMonthIndex = getMonths().indexOf(selectedMonth) + 1;
        const monthString = String(selectedMonthIndex).padStart(2, "0");
        const filteredGfg = gfgPotdData
            .filter((potd) => {
                const [year, month] = potd.date.split("-");
                return year === selectedYear && month === monthString;
            })
            .map((potd) => ({
                ...potd,
                difficulty: potd.difficulty || getRandomDifficulty(),
                companies: potd.companies && potd.companies.length > 0 ? potd.companies : getRandomCompanies(),
                acceptance_rate: potd.acceptance_rate || getRandomAcceptanceRate(),
            }));

        const filteredLeetcode = leetcodePotdData
            .filter((potd) => {
                const [year, month] = potd.date.split("-");
                return year === selectedYear && month === monthString;
            })
            .map((potd) => ({
                ...potd,
                difficulty: potd.difficulty || getRandomDifficulty(),
                companies: potd.companies || getRandomCompanies(),
                acceptance_rate: potd.acceptance_rate || getRandomAcceptanceRate(),
            }));

        // Combine and sort by date (descending)
        const combinedPrevious = [...filteredGfg, ...filteredLeetcode]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setPreviousPotds(combinedPrevious);
        setIsLoading(false);
    }, [selectedYear, selectedMonth, initialGfgPotd, initialLeetcodePotd]);

    // Handle year and month change
    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    // Structured data for SEO (WebPage + POTD items + FAQ)
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Problem of the Day - DevExCode",
        description: `Tackle daily coding challenges from GeeksforGeeks and LeetCode with DevExCode. Today's POTD: ${gfgPotd ? `GFG - ${gfgPotd.title} (ID: ${gfgPotd.problem_id}, ${gfgPotd.difficulty})` : "No GFG POTD available"}${leetcodePotd ? `, LeetCode - ${leetcodePotd.title} (ID: ${leetcodePotd.problem_id}, ${leetcodePotd.difficulty})` : ", No LeetCode POTD available"}. Explore solutions, difficulty levels, and company tags.`,
        keywords: `problem of the day, POTD, GFG POTD, LeetCode POTD, GeeksforGeeks, LeetCode, coding challenges, programming, DevExCode, interview preparation, algorithms, data structures${gfgPotd ? `, ${gfgPotd.title}, ${gfgPotd.problem_id}, ${gfgPotd.difficulty}` : ""}${leetcodePotd ? `, ${leetcodePotd.title}, ${leetcodePotd.problem_id}, ${leetcodePotd.difficulty}` : ""}${gfgPotd && gfgPotd.companies ? `, ${gfgPotd.companies.join(", ")}` : ""}${leetcodePotd && leetcodePotd.companies ? `, ${leetcodePotd.companies.join(", ")}` : ""}`,
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
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://devexcode.com/potd",
        },
        image: [
            gfgPotd ? `https://devexcode.com/potd-gfg-${gfgPotd.problem_id}.png` : "https://devexcode.com/potd-og-image.jpg",
            leetcodePotd ? `https://devexcode.com/potd-leetcode-${leetcodePotd.problem_id}.png` : "https://devexcode.com/potd-og-image.jpg",
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
                    name: "Problem of the Day",
                    item: "https://devexcode.com/potd",
                },
            ],
        },
        hasPart: [
            ...(gfgPotd
                ? [
                    {
                        "@type": "CreativeWork",
                        name: `GFG POTD: ${gfgPotd.title}`,
                        description: `GeeksforGeeks Problem of the Day: ${gfgPotd.title} (ID: ${gfgPotd.problem_id}) on ${gfgPotd.date}. Difficulty: ${gfgPotd.difficulty}, Acceptance Rate: ${gfgPotd.acceptance_rate}.`,
                        url: `https://devexcode.com/gfg/${gfgPotd.problem_id}`,
                        keywords: `GFG POTD, GeeksforGeeks, ${gfgPotd.title}, ${gfgPotd.problem_id}, ${gfgPotd.difficulty}${gfgPotd.companies ? `, ${gfgPotd.companies.join(", ")}` : ""}`,
                    },
                ]
                : []),
            ...(leetcodePotd
                ? [
                    {
                        "@type": "CreativeWork",
                        name: `LeetCode POTD: ${leetcodePotd.title}`,
                        description: `LeetCode Problem of the Day: ${leetcodePotd.title} (ID: ${leetcodePotd.problem_id}) on ${leetcodePotd.date}. Difficulty: ${leetcodePotd.difficulty}, Acceptance Rate: ${leetcodePotd.acceptance_rate}.`,
                        url: `https://devexcode.com/leetcode/${leetcodePotd.problem_id}-${generateSlug(leetcodePotd.title)}`,
                        keywords: `LeetCode POTD, LeetCode, ${leetcodePotd.title}, ${leetcodePotd.problem_id}, ${leetcodePotd.difficulty}${leetcodePotd.companies ? `, ${leetcodePotd.companies.join(", ")}` : ""}`,
                    },
                ]
                : []),
        ],
        mainEntity: {
            "@type": "FAQPage",
            mainEntity: [
                {
                    "@type": "Question",
                    name: "What is the Problem of the Day (POTD) on DevExCode?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "The Problem of the Day (POTD) on DevExCode features daily coding challenges from GeeksforGeeks and LeetCode, designed to enhance your programming skills and prepare you for technical interviews.",
                    },
                },
                {
                    "@type": "Question",
                    name: "How can I access previous POTDs on DevExCode?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "You can browse previous POTDs by selecting a specific month and year using the dropdown menus on the POTD page. All available problems for the selected period will be displayed.",
                    },
                },
                {
                    "@type": "Question",
                    name: "What information is provided for each POTD?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Each POTD includes the problem title, difficulty level, acceptance rate, and associated company tags (where available). You can click 'Solve Problem' to access detailed solutions and code editors.",
                    },
                },
            ],
        },
    };

    // Loading skeleton component for big cards
    const BigCardSkeleton = () => (
        <div className="animate-pulse space-y-4 h-full flex flex-col">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
                <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
                <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="flex-grow"></div>
            <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-full mt-auto"></div>
        </div>
    );

    // Loading skeleton component for small cards
    const SmallCardSkeleton = () => (
        <div className="animate-pulse space-y-3 h-full flex flex-col">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="flex-grow"></div>
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-full mt-auto"></div>
        </div>
    );

    // Error component
    const ErrorMessage = ({ message }) => (
        <div className="p-6 bg-red-50 dark:bg-red-900/30 rounded-2xl shadow-lg text-center">
            <p className="text-red-600 dark:text-red-400 text-lg">{message}</p>
        </div>
    );

    if (error) {
        return (
            <Layout isLoggedIn={status === "authenticated"} userName={session?.user?.name || ""}>
                <Head>
                    <title>Problem of the Day - DevExCode</title>
                    <meta name="description" content="Explore daily coding problems from GeeksforGeeks and LeetCode to boost your coding skills with DevExCode." />
                    <meta name="keywords" content="problem of the day, POTD, GeeksforGeeks, LeetCode, coding, programming, DevExCode, interview preparation, algorithms, data structures" />
                    <meta name="author" content="DevExCode Team" />
                    <meta name="robots" content="index, follow" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta property="og:title" content="Problem of the Day - DevExCode" />
                    <meta property="og:description" content="Explore daily coding problems from GeeksforGeeks and LeetCode to boost your coding skills with DevExCode." />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://devexcode.com/potd" />
                    <meta property="og:image" content="https://devexcode.com/potd-og-image.jpg" />
                    <meta property="og:image:alt" content="Problem of the Day - DevExCode" />
                    <meta property="og:site_name" content="DevExCode" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="Problem of the Day - DevExCode" />
                    <meta name="twitter:description" content="Explore daily coding problems from GeeksforGeeks and LeetCode to boost your coding skills with DevExCode." />
                    <meta name="twitter:image" content="https://devexcode.com/potd-og-image.jpg" />
                    <meta name="twitter:image:alt" content="Problem of the Day - DevExCode" />
                    <meta name="twitter:creator" content="@DevExCode" />
                    <link rel="canonical" href="https://devexcode.com/potd" />
                    <link rel="sitemap" href="/sitemap.xml" />
                    <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
                    <meta name="theme-color" content="#4f46e5" />
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(JSON.stringify(structuredData)),
                        }}
                    />
                </Head>
                <section className="py-12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ErrorMessage message={error} />
                    </div>
                </section>
            </Layout>
        );
    }

    return (
        <Layout isLoggedIn={status === "authenticated"} userName={session?.user?.name || ""}>
            <Head>
                <title>
                    Problem of the Day - DevExCode | {gfgPotd ? `GFG: ${gfgPotd.title}` : "No GFG POTD"}{gfgPotd && leetcodePotd ? " | " : ""}{leetcodePotd ? `LeetCode: ${leetcodePotd.title}` : "No LeetCode POTD"}
                </title>
                <meta
                    name="description"
                    content={`Tackle daily coding challenges from GeeksforGeeks and LeetCode with DevExCode. Today's POTD: ${gfgPotd ? `GFG - ${gfgPotd.title} (ID: ${gfgPotd.problem_id}, ${gfgPotd.difficulty})` : "No GFG POTD available"}${leetcodePotd ? `, LeetCode - ${leetcodePotd.title} (ID: ${leetcodePotd.problem_id}, ${leetcodePotd.difficulty})` : ", No LeetCode POTD available"}. Explore solutions, difficulty levels, and company tags.`}
                />
                <meta
                    name="keywords"
                    content={`problem of the day, POTD, GFG POTD, LeetCode POTD, GeeksforGeeks, LeetCode, coding challenges, programming, DevExCode, interview preparation, algorithms, data structures${gfgPotd ? `, ${gfgPotd.title}, ${gfgPotd.problem_id}, ${gfgPotd.difficulty}` : ""}${leetcodePotd ? `, ${leetcodePotd.title}, ${leetcodePotd.problem_id}, ${leetcodePotd.difficulty}` : ""}${gfgPotd && gfgPotd.companies ? `, ${gfgPotd.companies.join(", ")}` : ""}${leetcodePotd && leetcodePotd.companies ? `, ${leetcodePotd.companies.join(", ")}` : ""}`}
                />
                <meta name="author" content="DevExCode Team" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta
                    property="og:title"
                    content={`Problem of the Day - DevExCode | ${gfgPotd ? `GFG: ${gfgPotd.title}` : "No GFG POTD"}${gfgPotd && leetcodePotd ? " | " : ""}${leetcodePotd ? `LeetCode: ${leetcodePotd.title}` : "No LeetCode POTD"}`}
                />
                <meta
                    property="og:description"
                    content={`Tackle daily coding challenges from GeeksforGeeks and LeetCode with DevExCode. Today's POTD: ${gfgPotd ? `GFG - ${gfgPotd.title} (ID: ${gfgPotd.problem_id}, ${gfgPotd.difficulty})` : "No GFG POTD available"}${leetcodePotd ? `, LeetCode - ${leetcodePotd.title} (ID: ${leetcodePotd.problem_id}, ${leetcodePotd.difficulty})` : ", No LeetCode POTD available"}. Explore solutions, difficulty levels, and company tags.`}
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://devexcode.com/potd" />
                <meta property="og:image" content={gfgPotd ? `https://devexcode.com/potd-gfg-${gfgPotd.problem_id}.png` : leetcodePotd ? `https://devexcode.com/potd-leetcode-${leetcodePotd.problem_id}.png` : "https://devexcode.com/potd-og-image.jpg"} />
                <meta property="og:image:alt" content="Problem of the Day - DevExCode" />
                <meta property="og:site_name" content="DevExCode" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content={`Problem of the Day - DevExCode | ${gfgPotd ? `GFG: ${gfgPotd.title}` : "No GFG POTD"}${gfgPotd && leetcodePotd ? " | " : ""}${leetcodePotd ? `LeetCode: ${leetcodePotd.title}` : "No LeetCode POTD"}`}
                />
                <meta
                    name="twitter:description"
                    content={`Tackle daily coding challenges from GeeksforGeeks and LeetCode with DevExCode. Today's POTD: ${gfgPotd ? `GFG - ${gfgPotd.title} (ID: ${gfgPotd.problem_id}, ${gfgPotd.difficulty})` : "No GFG POTD available"}${leetcodePotd ? `, LeetCode - ${leetcodePotd.title} (ID: ${leetcodePotd.problem_id}, ${leetcodePotd.difficulty})` : ", No LeetCode POTD available"}. Explore solutions, difficulty levels, and company tags.`}
                />
                <meta name="twitter:image" content={gfgPotd ? `https://devexcode.com/potd-gfg-${gfgPotd.problem_id}.png` : leetcodePotd ? `https://devexcode.com/potd-leetcode-${leetcodePotd.problem_id}.png` : "https://devexcode.com/potd-og-image.jpg"} />
                <meta name="twitter:image:alt" content="Problem of the Day - DevExCode" />
                <meta name="twitter:creator" content="@DevExCode" />
                <link rel="canonical" href="https://devexcode.com/potd" />
                <link rel="sitemap" href="/sitemap.xml" />
                <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
                <meta name="theme-color" content="#4f46e5" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(JSON.stringify(structuredData)),
                    }}
                />
            </Head>

            <section className="py-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-8" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                            </svg>
                            Home
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-800 dark:text-gray-100 font-medium">Problem of the Day</span>
                    </nav>

                    {/* Header */}
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center text-gray-900 dark:text-white mb-10 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                    >
                        Problem of the Day
                    </motion.h1>

                    <div className="space-y-16">
                        {/* GFG POTD Section (Big Card, Stacked) */}
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center"
                            >
                                <svg className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01"></path>
                                </svg>
                                GeeksforGeeks POTD
                            </motion.h2>
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div
                                        key="loading-gfg"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <BigCardSkeleton />
                                    </motion.div>
                                ) : gfgPotd ? (
                                    <motion.div
                                        key={gfgPotd.date}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        className="p-6 bg-gradient-to-br from-indigo-700 to-purple-700 text-white rounded-2xl shadow-xl h-full flex flex-col"
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                            <h3 className="text-lg font-semibold text-yellow-300">
                                                {new Date(gfgPotd.date).toLocaleDateString("en-US", {
                                                    day: "numeric",
                                                    month: "short",
                                                })}
                                            </h3>
                                            <div className="mt-2 sm:mt-0">
                                                <span className="px-3 py-1 bg-gray-800/80 rounded-md text-sm font-medium animate-pulse">
                                                    {remainingTime.formatted}
                                                </span>
                                            </div>
                                        </div>
                                        <h4 className="text-2xl font-bold mb-4 text-white">{gfgPotd.title}</h4>
                                        {gfgPotd.companies && gfgPotd.companies.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {gfgPotd.companies.map((company, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-indigo-500/50 text-white rounded-full text-sm font-medium hover:bg-indigo-500 transition"
                                                    >
                                                        {company}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex space-x-4 mb-4">
                                            {gfgPotd.difficulty && (
                                                <span className={`text-sm font-medium px-3 py-1 rounded-full ${gfgPotd.difficulty === "Easy" ? "bg-green-500/30 text-green-200" :
                                                    gfgPotd.difficulty === "Medium" ? "bg-yellow-500/30 text-yellow-200" :
                                                        "bg-red-500/30 text-red-200"
                                                    }`}>
                                                    {gfgPotd.difficulty}
                                                </span>
                                            )}
                                            {gfgPotd.acceptance_rate && (
                                                <span className="text-sm font-medium px-3 py-1 bg-gray-200/20 text-gray-200 rounded-full">
                                                    {gfgPotd.acceptance_rate}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-auto">
                                            <Link href={`/gfg/${gfgPotd.problem_id}`}>
                                                <button
                                                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                                                    aria-label={`Solve ${gfgPotd.title} on GeeksforGeeks`}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    Solve Problem
                                                </button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="not-found-gfg"
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg text-center h-full flex flex-col justify-center"
                                    >
                                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                                            No GFG POTD found for today.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* LeetCode POTD Section (Big Card, Stacked) */}
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center"
                            >
                                <svg className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                                </svg>
                                LeetCode POTD
                            </motion.h2>
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div
                                        key="loading-leetcode"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <BigCardSkeleton />
                                    </motion.div>
                                ) : leetcodePotd ? (
                                    <motion.div
                                        key={leetcodePotd.date}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        className="p-6 bg-gradient-to-br from-indigo-700 to-purple-700 text-white rounded-2xl shadow-xl h-full flex flex-col"
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                            <h3 className="text-lg font-semibold text-yellow-300">
                                                {new Date(leetcodePotd.date).toLocaleDateString("en-US", {
                                                    day: "numeric",
                                                    month: "short",
                                                })}
                                            </h3>
                                            <div className="mt-2 sm:mt-0">
                                                <span className="px-3 py-1 bg-gray-800/80 rounded-md text-sm font-medium animate-pulse">
                                                    {remainingTime.formatted}
                                                </span>
                                            </div>
                                        </div>
                                        <h4 className="text-2xl font-bold mb-4 text-white">{leetcodePotd.title}</h4>
                                        {leetcodePotd.companies && leetcodePotd.companies.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {leetcodePotd.companies.map((company, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-indigo-500/50 text-white rounded-full text-sm font-medium hover:bg-indigo-500 transition"
                                                    >
                                                        {company}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex space-x-4 mb-4">
                                            {leetcodePotd.difficulty && (
                                                <span className={`text-sm font-medium px-3 py-1 rounded-full ${leetcodePotd.difficulty === "Easy" ? "bg-green-500/30 text-green-200" :
                                                    leetcodePotd.difficulty === "Medium" ? "bg-yellow-500/30 text-yellow-200" :
                                                        "bg-red-500/30 text-red-200"
                                                    }`}>
                                                    {leetcodePotd.difficulty}
                                                </span>
                                            )}
                                            {leetcodePotd.acceptance_rate && (
                                                <span className="text-sm font-medium px-3 py-1 bg-gray-200/20 text-gray-200 rounded-full">
                                                    {leetcodePotd.acceptance_rate}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-auto">
                                            <Link href={`/leetcode/${leetcodePotd.problem_id}-${generateSlug(leetcodePotd.title)}`}>
                                                <button
                                                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                                                    aria-label={`Solve ${leetcodePotd.title} on LeetCode`}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    Solve Problem
                                                </button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="not-found-leetcode"
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg text-center h-full flex flex-col justify-center"
                                    >
                                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                                            No LeetCode POTD found for today.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Banner */}
                        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md text-center transform hover:scale-105 transition-transform">
                            <p className="text-sm font-medium">
                                Boost your tech vocab with our Daily Tech Term TechBit!{" "}
                                <Link href={`/daily-term/${today}`} className="underline hover:text-yellow-300 transition flex items-center justify-center gap-1">
                                    Explore Now
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </Link>
                            </p>
                        </div>

                        {/* All Problems for Selected Month (Small Cards, Side by Side) */}
                        <div className="mt-8">
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6 flex items-center"
                            >
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Problems for {selectedMonth} {selectedYear}
                            </motion.h2>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                                <select
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    className="px-4 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                                    aria-label="Select year"
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                    className="px-4 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                                    aria-label="Select month"
                                >
                                    {months.map((month) => (
                                        <option key={month} value={month}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div
                                        key="loading-previous"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
                                    >
                                        {[...Array(3)].map((_, index) => (
                                            <SmallCardSkeleton key={index} />
                                        ))}
                                    </motion.div>
                                ) : previousPotds.length > 0 ? (
                                    <motion.div
                                        key="previous-potds"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
                                    >
                                        {previousPotds.map((potd, index) => {
                                            const isGfg = gfgPotdData.some((p) => p.date === potd.date && p.problem_id === potd.problem_id);
                                            return (
                                                <motion.div
                                                    key={`${potd.date}-${potd.problem_id}-${index}`}
                                                    variants={cardVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    whileHover="hover"
                                                    className="p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-md h-full flex flex-col border border-gray-200 dark:border-slate-700"
                                                >
                                                    <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                                                        {new Date(potd.date).toLocaleDateString("en-US", {
                                                            day: "numeric",
                                                            month: "short",
                                                        })}
                                                    </h3>
                                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{potd.title}</h4>
                                                    {potd.companies && potd.companies.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mb-3">
                                                            {potd.companies.map((company, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 rounded-full text-xs font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800 transition"
                                                                >
                                                                    {company}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className="flex space-x-3 mb-4">
                                                        {potd.difficulty && (
                                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${potd.difficulty === "Easy" ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" :
                                                                potd.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300" :
                                                                    "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                                                                }`}>
                                                                {potd.difficulty}
                                                            </span>
                                                        )}
                                                        {potd.acceptance_rate && (
                                                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                                                                {potd.acceptance_rate}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-auto">
                                                        <Link href={isGfg ? `/gfg/${potd.problem_id}` : `/leetcode/${potd.problem_id}-${generateSlug(potd.title)}`}>
                                                            <button
                                                                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                                                                aria-label={`Solve ${potd.title} on ${isGfg ? "GeeksforGeeks" : "LeetCode"}`}
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                                </svg>
                                                                Solve Problem
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="no-previous"
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg text-center col-span-full"
                                    >
                                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                                            No problems found for {selectedMonth} {selectedYear}.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export async function getServerSideProps() {
    try {
        const today = formatLocalDate(new Date());
        let gfgPotd = null;
        let leetcodePotd = null;

        // Resolve paths to JSON files
        const gfgJsonPath = path.resolve(process.cwd(), 'data', 'gfg_potd.json');
        const leetcodeJsonPath = path.resolve(process.cwd(), 'data', 'leetcode_potd.json');

        // Read existing JSON data
        let gfgJsonData = gfgPotdData;
        let leetcodeJsonData = leetcodePotdData;

        // Check if today's POTD already exists in JSON
        const gfgExists = gfgJsonData.some((potd) => potd.date === today);
        const leetcodeExists = leetcodeJsonData.some((potd) => potd.date === today);

        // Fetch GFG POTD if not in JSON
        if (!gfgExists) {
            const gfgResponse = await fetch('https://practiceapi.geeksforgeeks.org/api/vr/problems-of-day/problem/today/', {
                method: 'GET',
                headers: {
                    'accept': '*/*',
                    'accept-language': 'en-US,en;q=0.9',
                    'origin': 'https://www.geeksforgeeks.org',
                    'priority': 'u=1, i',
                    'referer': 'https://www.geeksforgeeks.org/',
                    'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
                },
            });

            if (gfgResponse.ok) {
                const gfgData = await gfgResponse.json();
                gfgPotd = {
                    date: gfgData.date.split(" ")[0], // Convert "2025-05-07 00:00:00" to "2025-05-07"
                    problem_id: gfgData.problem_id.toString(),
                    title: gfgData.problem_name,
                    difficulty: gfgData.difficulty,
                    companies: gfgData.tags.company_tags,
                    acceptance_rate: `${gfgData.accuracy}%`,
                };

                // Append to gfg_potd.json
                gfgJsonData.push(gfgPotd);
                await fs.writeFile(gfgJsonPath, JSON.stringify(gfgJsonData, null, 2));
            }
        } else {
            gfgPotd = gfgJsonData.find((potd) => potd.date === today);
        }

        // Fetch LeetCode POTD if not in JSON
        if (!leetcodeExists) {
            const leetcodeResponse = await fetch('https://leetcode.com/graphql/', {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'accept-language': 'en-US,en;q=0.9',
                    'content-type': 'application/json',
                    'origin': 'https://leetcode.com',
                    'priority': 'u=1, i',
                    'referer': 'https://leetcode.com/problemset/',
                    'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
                    'sec-ch-ua-arch': '"arm"',
                    'sec-ch-ua-bitness': '"64"',
                    'sec-ch-ua-full-version': '"135.0.7049.115"',
                    'sec-ch-ua-full-version-list': '"Google Chrome";v="135.0.7049.115", "Not-A.Brand";v="8.0.0.0", "Chromium";v="135.0.7049.115"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-model': '""',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-ch-ua-platform-version': '"14.4.0"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
                },
                body: JSON.stringify({
                    query: `
                        query questionOfTodayV2 {
                            activeDailyCodingChallengeQuestion {
                                date
                                userStatus
                                link
                                question {
                                    id: questionId
                                    titleSlug
                                    title
                                    translatedTitle
                                    questionFrontendId
                                    paidOnly: isPaidOnly
                                    difficulty
                                    topicTags {
                                        name
                                        slug
                                        nameTranslated: translatedName
                                    }
                                    status
                                    isInMyFavorites: isFavor
                                    acRate
                                    frequency: freqBar
                                }
                            }
                        }
                    `,
                    variables: {},
                    operationName: "questionOfTodayV2",
                }),
            });

            if (leetcodeResponse.ok) {
                const leetcodeData = await leetcodeResponse.json();
                const question = leetcodeData.data.activeDailyCodingChallengeQuestion;
                leetcodePotd = {
                    date: question.date,
                    problem_id: question.question.questionFrontendId.toString(),
                    title: question.question.title,
                    difficulty: question.question.difficulty,
                    companies: [], // LeetCode API doesn't provide company tags
                    acceptance_rate: `${question.question.acRate.toFixed(2)}%`,
                };

                // Append to leetcode_potd.json
                leetcodeJsonData.push(leetcodePotd);
                await fs.writeFile(leetcodeJsonPath, JSON.stringify(leetcodeJsonData, null, 2));
            }
        } else {
            leetcodePotd = leetcodeJsonData.find((potd) => potd.date === today);
        }

        // Filter valid POTDs (up to today)
        const validGfgPotds = gfgJsonData.filter((potd) => potd.date <= today);
        const validLeetcodePotds = leetcodeJsonData.filter((potd) => potd.date <= today);

        return {
            props: {
                initialGfgPotd: gfgPotd || null,
                initialLeetcodePotd: leetcodePotd || null,
            },
        };
    } catch (error) {
        console.error('Error in getServerSideProps:', error);
        return {
            props: {
                error: "Failed to load POTD data. Please try again later.",
            },
        };
    }
}