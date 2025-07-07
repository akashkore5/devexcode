import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Head from "next/head";
import Calendar from "react-calendar";
import { toast } from "react-hot-toast";
import Layout from "../../components/Layout";
import dailyTerms from "../../data/daily_terms.json";
import DOMPurify from "isomorphic-dompurify";
import { ChevronLeftIcon, CalendarIcon } from "@heroicons/react/24/solid";
import { FaTwitter, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import "react-calendar/dist/Calendar.css";
import { useSession } from "next-auth/react";

// Helper to format date as YYYY-MM-DD in local timezone
const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function DailyTermDetail({ initialTerm, previousTerms }) {
  const router = useRouter();
  const { date } = router.query;
  const [term, setTerm] = useState(initialTerm);
  const [isLoading, setIsLoading] = useState(!initialTerm);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = formatLocalDate(new Date());
  const { data: session, status } = useSession();
  const [viewedDates, setViewedDates] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Fetch term when date changes
  useEffect(() => {
    if (date) {
      const fetchTerm = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/daily-term?date=${date}`);
          const data = await response.json();
          if (response.ok) {
            setTerm(data);
            setSelectedDate(new Date(`${date}T00:00:00`));
          } else {
            toast.error(data.message || "Failed to fetch term");
            setTerm(null);
          }
        } catch (error) {
          console.error("Fetch term error:", error);
          toast.error("Error loading term");
          setTerm(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTerm();
    }
  }, [date]);

  // Fetch viewed dates and streak for authenticated users
  useEffect(() => {
    if (status !== "authenticated") {
      setViewedDates([]);
      setCurrentStreak(0);
      return;
    }

    const fetchProgress = async () => {
      try {
        const response = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "dailyTerm", action: "all" }),
        });
        const data = await response.json();
        if (response.ok) {
          const dailyTermProgress = data || { viewed: [], streak: 0 };
          const formattedViewedDates = dailyTermProgress.viewed.map((timestamp) =>
            formatLocalDate(new Date(timestamp))
          );
          setViewedDates(formattedViewedDates);
          setCurrentStreak(dailyTermProgress.streak || 0);
        } else {
          console.error("Failed to fetch progress:", data.message);
          setViewedDates([]);
          setCurrentStreak(0);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
        setViewedDates([]);
        setCurrentStreak(0);
      }
    };

    fetchProgress();
  }, [status, date]);

  // Handle calendar date change
  const handleDateChange = (value) => {
    const formattedDate = formatLocalDate(value);
    if (formattedDate <= today) {
      setSelectedDate(value);
      router.push(`/daily-term/${formattedDate}`, undefined, { shallow: true });
    } else {
      toast.error("Cannot select future dates");
    }
  };

  // Share functionality with image download
  const shareTerm = async (platform) => {
    if (!term) return;

    try {
      const response = await fetch(`/api/generate-term-image?date=${term.date}`);
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `DevExCode_DailyTerm_${term.date}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      const pageUrl = `https://devexcode.com/daily-term/${term.date}`;
      const text = `Check out today's Daily Term: ${term.term} - ${term.shortExplanation} on DevExCode!`;
      let shareUrl = "";
      let toastMessage = "";

      if (platform === "twitter") {
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(pageUrl)}`;
        toastMessage = "Image downloaded! Share on Twitter.";
      } else if (platform === "linkedin") {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          pageUrl
        )}`;
        toastMessage = "Image downloaded! Share on LinkedIn.";
      } else if (platform === "instagram") {
        toastMessage = "Image downloaded! Share on Instagram.";
      } else if (platform === "whatsapp") {
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          `${text} ${pageUrl}`
        )}`;
        toastMessage = "Image downloaded! Share on WhatsApp.";
      }

      if (shareUrl) {
        window.open(shareUrl, "_blank");
      }

      toast.success(toastMessage);
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image");
    }
  };

  // Mark term as viewed and update streak
  useEffect(() => {
    // This effect needs to be triggered by watched changes such as date and session status
    // Make sure to check if term exists before marking it as viewed 
    if (status !== "authenticated" || !date || !term) return;

    const checkAndMarkViewed = async () => {
      try {
        const numericDate = new Date(date).getTime();
        const checkResponse = await fetch("/api/user/progress/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "dailyTerm", action: "viewed", date: numericDate }),
        });
        const checkData = await checkResponse.json();
        
        if (!checkData.isPresent) {
          const markResponse = await fetch("/api/user/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "dailyTerm", action: "viewed", date: numericDate }),
          });
          
          if (markResponse.ok) {
            toast.success("Term marked as viewed!");
          } else {
            console.error("Failed to mark term as viewed");
            return;
          }

          const progressResponse = await fetch("/api/user/progress/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "dailyTerm", action: "all" }),
          });
          const progressData = await progressResponse.json();
          
          if (progressResponse.ok) {
            const dailyTermProgress = progressData || { viewed: [], streak: 0 };
            const formattedViewedDates = dailyTermProgress.viewed.map((timestamp) =>
              formatLocalDate(new Date(timestamp))
            );
            setViewedDates((prev) => [...new Set([...prev, formatLocalDate(new Date(numericDate))])]);
            setCurrentStreak(dailyTermProgress.streak || 0);
          } else {
            console.error("Failed to update viewed dates and streak");
          }
        }
      } catch (error) {
        console.error("Error checking/marking viewed or streak:", error);
        toast.error("An error occurred while tracking progress");
      }
    };

    checkAndMarkViewed();
  }, [date, status, term]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const minDate = new Date("2025-04-15");
  const maxDate = new Date();

  const structuredData = term
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `Daily Term: ${term.term}`,
        description: term.shortExplanation,
        datePublished: term.date,
        author: {
          "@type": "Organization",
          name: "DevExCode Team",
        },
        publisher: {
          "@type": "Organization",
          name: "DevExCode",
          logo: {
            "@type": "ImageObject",
            url: "https://devexcode.com/logo.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://devexcode.com/daily-term/${term.date}`,
        },
        image: {
          "@type": "ImageObject",
          url: `/api/generate-term-image?date=${term.date}`,
          width: 1200,
          height: 627,
        },
      }
    : {};

  return (
    <Layout isLoggedIn={status === "authenticated"} userName={session?.user?.name || ""}>
      <Head>
        <title>
          {term ? `Daily Term: ${term.term} - DevExCode` : "Daily Term - DevExCode"}
        </title>
        <meta
          name="description"
          content={
            term
              ? `${term.shortExplanation} Learn more about ${term.term} on DevExCode.`
              : "Explore daily technical terms to boost your coding knowledge with DevExCode."
          }
        />
        <meta
          name="keywords"
          content="daily term, technical term, coding, programming, DevExCode, software development, tech education"
        />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content={term ? `Daily Term: ${term.term}` : "Daily Term - DevExCode"}
        />
        <meta
          property="og:description"
          content={
            term
              ? term.shortExplanation
              : "Discover a new technical term every day with DevExCode."
          }
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://devexcode.com/daily-term/${date || "today"}`}
        />
        <meta
          property="og:image"
          content={`/api/generate-term-image?date=${date || "today"}`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="627" />
        <meta property="og:image:alt" content="DevExCode daily term card" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={term ? `Daily Term: ${term.term}` : "Daily Term - DevExCode"}
        />
        <meta
          name="twitter:description"
          content={
            term
              ? term.shortExplanation
              : "Discover a new technical term every day with DevExCode."
          }
        />
        <meta
          name="twitter:image"
          content={`/api/generate-term-image?date=${date || "today"}`}
        />
        <meta name="twitter:image:alt" content="DevExCode daily term card" />
        <link
          rel="canonical"
          href={`https://devexcode.com/daily-term/${date || "today"}`}
        />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(JSON.stringify(structuredData)),
          }}
        />
      </Head>

      <section className="py-0 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/daily-term"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Daily Terms
            </Link>
            <span className="mx-2">/</span>
            <span>{term?.term || date}</span>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 dark:text-white mb-6 drop-shadow-sm"
          >
            Daily Term: {term?.term || "Loading..."}
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="inline-block"
                    >
                      <svg
                        className="h-10 w-10 text-indigo-600 dark:text-indigo-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 12a8 8 0 0116 0 8 8 0 01-16 0zm8-8v4m0 8v4m-4-4h8"
                        />
                      </svg>
                    </motion.div>
                    <p className="text-gray-600 dark:text-gray-300 mt-3 font-medium">
                      Loading term...
                    </p>
                  </motion.div>
                ) : term ? (
                  <motion.div
                    key={term.date}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="p-8 bg-gradient-to-br from-white to-indigo-100 dark:from-slate-800 dark:to-indigo-950 rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 hover:shadow-2xl transition-all duration-300"
                  >
                    <h2 className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4 drop-shadow-sm">
                      {term.term}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">
                      {term.fullExplanation}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                      Date: {term.date}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <motion.button
                        onClick={() => shareTerm("twitter")}
                        className="p-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a91da] transition flex items-center justify-center w-10 h-10"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Share on Twitter"
                      >
                        <FaTwitter className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={() => shareTerm("linkedin")}
                        className="p-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#095bb5] transition flex items-center justify-center w-10 h-10"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Share on LinkedIn"
                      >
                        <FaLinkedin className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={() => shareTerm("instagram")}
                        className="p-2 bg-[#E4405F] text-white rounded-lg hover:bg-[#d83957] transition flex items-center justify-center w-10 h-10"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Share on Instagram"
                      >
                        <FaInstagram className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={() => shareTerm("whatsapp")}
                        className="p-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20c35a] transition flex items-center justify-center w-10 h-10"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Share on WhatsApp"
                      >
                        <FaWhatsapp className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="not-found"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg text-center"
                  >
                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                      No term found for this date.
                    </p>
                    <motion.button
                      onClick={() => router.push("/daily-term")}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md flex items-center mx-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Back to Daily Terms"
                    >
                      <ChevronLeftIcon className="w-5 h-5 mr-2" />
                      Back to Daily Terms
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg lg:sticky lg:top-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <CalendarIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                    Select Date
                  </h3>
                  {status === "authenticated" && (
                    <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                      Streak: {currentStreak || 0} day(s)
                    </span>
                  )}
                </div>
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  minDate={minDate}
                  maxDate={maxDate}
                  className="border-none bg-transparent text-gray-900 dark:text-white w-full"
                  tileClassName={({ date }) => {
                    const formattedDate = formatLocalDate(date);
                    return viewedDates.includes(formattedDate)
                      ? "bg-green-100 dark:bg-green-700 viewed-tile"
                      : formattedDate === term?.date
                      ? "bg-indigo-600 text-white rounded-full"
                      : formattedDate === today
                      ? "border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 rounded-full"
                      : "";
                  }}
                  aria-label="Select a date to view the daily term"
                />
              </motion.div>
            </div>
          </div>

          {previousTerms.length > 0 && (
            <div className="mt-6 mb-4">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight drop-shadow-md"
              >
                Previous Terms
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {previousTerms.map((prevTerm) => (
                  <Link
                    key={prevTerm.date}
                    href={`/daily-term/${prevTerm.date}`}
                    prefetch={true}
                    aria-label={`View daily term for ${prevTerm.date}`}
                  >
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">
                        {prevTerm.term}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-200 text-sm line-clamp-3 font-medium">
                        {prevTerm.shortExplanation}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Date: {prevTerm.date}
                      </p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const { date } = params;
  const today = formatLocalDate(new Date());

  if (date > today) {
    return { notFound: true };
  }

  const validTerms = dailyTerms.filter((t) => t.date <= today);
  const term = validTerms.find((t) => t.date === date);

  if (!term) {
    return { notFound: true };
  }

  const currentDate = new Date(date);
  const previousTerms = [];
  for (let i = 1; i <= 2; i++) {
    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - i);
    const prevDateString = formatLocalDate(prevDate);
    if (prevDateString <= today) {
      const prevTerm = validTerms.find((t) => t.date === prevDateString);
      if (prevTerm) {
        previousTerms.push(prevTerm);
      }
    }
  }

  return {
    props: {
      initialTerm: term || null,
      previousTerms,
    },
  };
}