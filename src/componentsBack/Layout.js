import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  UserPlusIcon,
  HomeIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  BookOpenIcon,
  LightBulbIcon,
  ScaleIcon,
  PuzzlePieceIcon,
  StarIcon,
  CodeBracketSquareIcon,
  BellIcon,
  UsersIcon,
  BriefcaseIcon
} from "@heroicons/react/24/solid";
import DOMPurify from "isomorphic-dompurify";
import { toast } from "react-hot-toast";
import LoginModal from "./LoginModal";
import ProfileModal from "./ProfileModal";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Animation Variants
const menuVariants = {
  hidden: { opacity: 0, x: "100%" },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: "100%", transition: { duration: 0.3 } },
};

const popupVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export default function Layout({
  children,
  title = "DevExCode - Coding & System Design Prep",
  description = "Master coding interviews with expertly crafted Leetcode solutions, system design guides, TechBit daily terms, QuickLearn lessons, Micro Dev Tips, and Tech Battles.",
  isLoginModalOpen: externalIsLoginModalOpen,
  setIsLoginModalOpen: externalSetIsLoginModalOpen,
}) {
  const { data: session, status } = useSession({
    onUnauthenticated() {},
  });
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [internalIsLoginModalOpen, setInternalIsLoginModalOpen] = useState(false);
  const [initialModalMode, setInitialModalMode] = useState("signin");
  const [isThemeLoading, setIsThemeLoading] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallPromptOpen, setIsInstallPromptOpen] = useState(false);
  const [isGoogleSignInPopupOpen, setIsGoogleSignInPopupOpen] = useState(true);
  const [dailyTerm, setDailyTerm] = useState(null);
  const [isLoadingTerm, setIsLoadingTerm] = useState(false);
  const [showDailyTermPopup, setShowDailyTermPopup] = useState(false);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  // Use external modal state if provided, else internal
  const isLoginModalOpen = externalIsLoginModalOpen !== undefined ? externalIsLoginModalOpen : internalIsLoginModalOpen;
  const setIsLoginModalOpen = externalSetIsLoginModalOpen || setInternalIsLoginModalOpen;

  // Calculate popup offset based on active popups
  const getPopupOffset = useCallback((index) => {
    return index * 100; // Vertical offset for stacking
  }, []);

  // Initialize theme, check OAuth errors, manage popups, and track session status
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    const urlParams = new URLSearchParams(window.location.search);
    const oauthError = urlParams.get("error");
    if (oauthError) {
      console.error("[Layout] OAuth error:", oauthError);
      toast.error(`Authentication failed: ${oauthError}`, { duration: 5000 });
    }

    const googleDismissed = sessionStorage.getItem("googleSignInPopupDismissed");
    if (googleDismissed) {
      setIsGoogleSignInPopupOpen(false);
    }

    const lastTermDismissed = localStorage.getItem("dailyTermPopupDismissed");
    const today = new Date().toISOString().split("T")[0];
    if (!lastTermDismissed || lastTermDismissed !== today) {
      setShowDailyTermPopup(true);
    }

    // Set session loaded when status is resolved
    if (status !== "loading") {
      setIsSessionLoaded(true);
    }
  }, [status]);

  // Handle PWA install prompt
  useEffect(() => {
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
    const hasShownInSession = sessionStorage.getItem("installPromptShown");

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isInstalled && !hasShownInSession) {
        setIsInstallPromptOpen(true);
        sessionStorage.setItem("installPromptShown", "true");
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  // Fetch daily term for authenticated users
  useEffect(() => {
    if (status === "authenticated") {
      const fetchDailyTerm = async () => {
        setIsLoadingTerm(true);
        try {
          const response = await fetch("/api/daily-term", { credentials: "include" });
          const data = await response.json();
          if (response.ok) {
            setDailyTerm(data);
          } else {
            console.error("[Layout] fetchDailyTerm Failed:", data.message);
            toast.error(data.message || "Failed to fetch daily term");
          }
        } catch (error) {
          console.error("[Layout] fetchDailyTerm Error:", error.message);
          toast.error("Error loading daily term");
        } finally {
          setIsLoadingTerm(false);
        }
      };
      fetchDailyTerm();
    }
  }, [status]);

  // Show daily term popup after 2-second delay
  useEffect(() => {
    if (status === "authenticated" && dailyTerm && showDailyTermPopup) {
      const timer = setTimeout(() => setShowDailyTermPopup(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [status, dailyTerm, showDailyTermPopup]);

  // Handlers
  const handleInstallClick = useCallback(() => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          setIsInstallPromptOpen(false);
        }
        setDeferredPrompt(null);
      });
    }
  }, [deferredPrompt]);

  const handleCloseInstallPrompt = useCallback(() => {
    setIsInstallPromptOpen(false);
    sessionStorage.setItem("installPromptShown", "true");
  }, []);

  const handleCloseDailyTermPopup = useCallback(() => {
    setShowDailyTermPopup(false);
    localStorage.setItem("dailyTermPopupDismissed", new Date().toISOString().split("T")[0]);
  }, []);

  const handleLearnMoreClick = useCallback(() => {
    handleCloseDailyTermPopup();
  }, [handleCloseDailyTermPopup]);

  const toggleTheme = useCallback(() => {
    setIsThemeLoading(true);
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    setTimeout(() => setIsThemeLoading(false), 300);
  }, [theme]);

  const openModal = useCallback(
    (mode) => {
      setInitialModalMode(mode);
      setIsLoginModalOpen(true);
      setIsMenuOpen(false);
      setIsProfileDropdownOpen(false);
    },
    [setIsLoginModalOpen]
  );

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
    setIsProfileDropdownOpen(false);
  }, []);

  const toggleProfileDropdown = useCallback(() => {
    setIsProfileDropdownOpen((prev) => !prev);
    setIsMenuOpen(false);
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      await signIn("google", { callbackUrl: router.asPath || "/", prompt: "select_account" });
      setIsGoogleSignInPopupOpen(false);
    } catch (error) {
      console.error("[Layout] Google sign-in error:", error.message);
      toast.error("Google sign-in failed. Please try again.");
    }
  }, [router.asPath]);

  const handleCloseGoogleSignInPopup = useCallback(() => {
    setIsGoogleSignInPopupOpen(false);
    sessionStorage.setItem("googleSignInPopupDismissed", "true");
  }, []);

  // Calculate active popups for stacking
  const activePopups = [
    isSessionLoaded && status === "unauthenticated" && isGoogleSignInPopupOpen,
    status === "authenticated" && showDailyTermPopup && dailyTerm,
    isInstallPromptOpen,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col font-sans">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="leetcode, system design, TechBit, QuickLearn, Micro Dev Tips, Tech Battles, POTD, coding, algorithms, interview prep, programming, daily terms, community, career services"
        />
        <meta name="author" content="DevExCode Team" />
        <meta name="description" content={description} />
        <meta property="og:site_name" content="DevExCode" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devexcode.com" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://devexcode.com/og-image.jpg" />
        <meta property="og:image:alt" content="DevExCode Coding and System Design Prep" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://devexcode.com/twitter-image.jpg" />
        <meta name="twitter:creator" content="@devexcode" />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preload" href="/favicon.ico" as="image" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="sitemap" href="/sitemaps.xml" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "DevExCode",
                url: "https://devexcode.com",
                description: description,
                publisher: {
                  "@type": "Organization",
                  name: "DevExCode Team",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://devexcode.com/logo.png",
                    width: 150,
                    height: 50,
                  },
                },
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://devexcode.com/search?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              })
            ),
          }}
        />
      </Head>

      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 shadow-md p-4 sticky top-0 z-50 backdrop-blur-sm border-b border-gray-200/50 dark:border-slate-700/50">
        <div className="mx-auto w-full px-0 sm:px-4 lg:px-6 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-transform duration-200"
            aria-label="DevExCode Home"
          >
            DevExCode
          </Link>
          <SpeedInsights />
          <nav role="navigation" aria-label="Main navigation" className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {[
              { href: "/leetcode", label: "Leetcode", icon: CodeBracketIcon },
              { href: "/system-design", label: "System Design", icon: RocketLaunchIcon },
              { href: "/interview", label: "Interview", icon: CodeBracketSquareIcon },
              { href: "/services", label: "Services", icon: BriefcaseIcon },
              { href: "/learn10", label: "QuickLearn", icon: BookOpenIcon },
              { href: "/daily-term", label: "TechBit", icon: PuzzlePieceIcon },
              { href: "/micro-dev-tips", label: "DevTips", icon: LightBulbIcon },
              { href: "/tech-battles", label: "Tech Battles", icon: ScaleIcon },
              { href: "/potd", label: "POTD", icon: StarIcon },
              { href: "/community", label: "Community", icon: UsersIcon },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-bold transition-colors duration-200 ${
                  router.pathname === item.href
                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                    : "text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
                aria-current={router.pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            {status === "authenticated" ? (
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                aria-label={`Open profile for ${session?.user?.name || session?.user?.email}`}
              >
                <UserIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="truncate max-w-[100px] sm:max-w-[120px]">
                  {session?.user?.name || session?.user?.email?.split("@")[0] || "User"}
                </span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => openModal("signin")}
                  className="flex items-center space-x-1 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                  aria-label="Sign in"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => openModal("register")}
                  className="flex items-center space-x-1 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                  aria-label="Register"
                >
                  <UserPlusIcon className="w-4 h-4" />
                  <span>Register</span>
                </button>
              </>
            )}
            <button
              onClick={toggleTheme}
              disabled={isThemeLoading}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <MoonIcon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              ) : (
                <SunIcon className="w-5 h-5 text-yellow-400" />
              )}
            </button>
          </nav>
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              disabled={isThemeLoading}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <MoonIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              ) : (
                <SunIcon className="w-6 h-6 text-yellow-400" />
              )}
            </button>
            <button
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-gray-800 dark:text-gray-100" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-800 dark:text-gray-100" />
              )}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden mt-3 mx-2 bg-white/95 dark:bg-slate-900/95 p-4 rounded-lg shadow-md border border-gray-200/30 dark:border-slate-700/30"
              role="navigation"
              aria-label="Mobile navigation"
            >
              {[
                { href: "/", label: "Home", icon: HomeIcon },
                { href: "/leetcode", label: "Leetcode", icon: CodeBracketIcon },
                { href: "/system-design", label: "System Design", icon: RocketLaunchIcon },
                { href: "/interview", label: "Interview", icon: CodeBracketSquareIcon },
                { href: "/services", label: "Services", icon: BriefcaseIcon },
                { href: "/learn10", label: "QuickLearn", icon: BookOpenIcon },
                { href: "/daily-term", label: "TechBit", icon: PuzzlePieceIcon },
                { href: "/micro-dev-tips", label: "DevTips", icon: LightBulbIcon },
                { href: "/tech-battles", label: "Tech Battles", icon: ScaleIcon },
                { href: "/potd", label: "POTD", icon: StarIcon },
                { href: "/community", label: "Community", icon: UsersIcon },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 py-2"
                  onClick={toggleMenu}
                  aria-current={router.pathname === item.href ? "page" : undefined}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              {status === "authenticated" ? (
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 py-2"
                  aria-label={`Toggle profile options for ${session?.user?.name || session?.user?.email}`}
                  aria-expanded={isProfileDropdownOpen}
                >
                  <UserIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="truncate max-w-[150px]">
                    {session?.user?.name || session?.user?.email?.split("@")[0] || "User"}
                  </span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      openModal("signin");
                      toggleMenu();
                    }}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 py-2"
                    aria-label="Sign in"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => {
                      openModal("register");
                      toggleMenu();
                    }}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 py-2"
                    aria-label="Register"
                  >
                    <UserPlusIcon className="w-5 h-5" />
                    <span>Register</span>
                  </button>
                </>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Popups Container */}
      <div className="fixed top-16 right-4 z-[60] flex flex-col space-y-2 max-w-[90%] sm:max-w-xs w-full">
        <AnimatePresence>
          {/* Google Sign-In Popup */}
          {isSessionLoaded && status === "unauthenticated" && isGoogleSignInPopupOpen && (
            <motion.div
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ marginTop: `${getPopupOffset(0)}px` }}
            >
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.20-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.01.68-2.30 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.52 7.77 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.77 1 4.01 3.48 2.18 7.07l3.66 2.84c.87-2.60 3.30-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Sign in with Google</h3>
                  </div>
                  <button
                    onClick={handleCloseGoogleSignInPopup}
                    className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                    aria-label="Close Google sign-in popup"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center space-x-2 p-2 rounded-md border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-slate-600 flex items-center justify-center text-white text-sm">
                    ?
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Select a Google account</p>
                  </div>
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Google will share your name, email, and profile picture with DevExCode. See our{" "}
                  <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                    privacy policy
                  </Link>
                  .
                </p>
              </div>
            </motion.div>
          )}

          {/* Daily Term Popup */}
          {status === "authenticated" && showDailyTermPopup && dailyTerm && (
            <motion.div
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ marginTop: `${getPopupOffset(isGoogleSignInPopupOpen ? 1 : 0)}px` }}
            >
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <BellIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Daily Tech Term</h3>
                  </div>
                  <button
                    onClick={handleCloseDailyTermPopup}
                    className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                    aria-label="Close daily term popup"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
                {isLoadingTerm ? (
                  <div className="text-center">
                    <svg
                      className="animate-spin h-5 w-5 text-indigo-600 dark:text-indigo-400 mx-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                ) : (
                  <>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{dailyTerm?.term}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                      {dailyTerm?.shortExplanation || "Learn a new term today!"}
                    </p>
                    <Link href={`/daily-term/${dailyTerm?.date || new Date().toISOString().split("T")[0]}`} passHref>
                      <motion.button
                        onClick={handleLearnMoreClick}
                        className="w-full px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Learn more about ${dailyTerm?.term}`}
                      >
                        Learn More
                      </motion.button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Install Prompt Popup */}
          {isInstallPromptOpen && (
            <motion.div
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                marginTop: `${
                  getPopupOffset(
                    (isGoogleSignInPopupOpen ? 1 : 0) + (status === "authenticated" && showDailyTermPopup && dailyTerm ? 1 : 0)
                  )
                }px`,
              }}
            >
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">Install DevExCode App</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Add to your home screen for a better experience!</p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleInstallClick}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                    aria-label="Install app"
                  >
                    Install
                  </button>
                  <button
                    onClick={handleCloseInstallPrompt}
                    className="px-3 py-1.5 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm"
                    aria-label="Dismiss install prompt"
                  >
                    Not Now
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="flex-grow w-screen !px-0 !mx-0 max-w-none py-10">{children}</main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-900/80 border-t border-gray-200/50 dark:border-slate-700/50 py-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">DevExCode</h3>
              <p className="text-sm">
                Master coding interviews with Leetcode, system design, TechBit, QuickLearn, DevTips, Tech Battles, and career services.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">Quick Links</h3>
              <ul className="space-y-2">
                {["About", "Contact", "Privacy", "Terms"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">Connect</h3>
              <ul className="space-y-2">
                {[
                  { name: "GitHub", href: "https://github.com/devexcode" },
                  { name: "Twitter", href: "https://twitter.com/devexcode" },
                  { name: "LinkedIn", href: "https://linkedin.com/company/devexcode" },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.name}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm font-medium">© {new Date().getFullYear()} DevExCode. All rights reserved.</p>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-50"
          >
            <LoginModal
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
              initialMode={initialModalMode}
              onLoginSuccess={() => {
                setIsLoginModalOpen(false);
                toast.success("Logged in successfully");
              }}
            />
          </motion.div>
        )}
        {status === "authenticated" && !isMenuOpen && (
          <ProfileModal
            isOpen={isProfileDropdownOpen}
            onClose={() => setIsProfileDropdownOpen(false)}
            isMobile={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
}