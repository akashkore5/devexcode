'use client';

import { useState, useEffect, useCallback, ReactNode } from "react";
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
import { LoginModal } from "./LoginModal";
import { ProfileModal } from "./ProfileModal";
import { signIn, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
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

type AppLayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  isLoginModalOpen?: boolean;
  setIsLoginModalOpen?: (isOpen: boolean) => void;
};

export function AppLayout({
  children,
  title = "DevExCode - Coding & System Design Prep",
  description = "Master coding interviews with expertly crafted Leetcode solutions, system design guides, TechBit daily terms, QuickLearn lessons, Micro Dev Tips, and Tech Battles.",
  isLoginModalOpen: externalIsLoginModalOpen,
  setIsLoginModalOpen: externalSetIsLoginModalOpen,
}: AppLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [internalIsLoginModalOpen, setInternalIsLoginModalOpen] = useState(false);
  const [initialModalMode, setInitialModalMode] = useState("signin");
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstallPromptOpen, setIsInstallPromptOpen] = useState(false);
  const [isGoogleSignInPopupOpen, setIsGoogleSignInPopupOpen] = useState(true);
  const [dailyTerm, setDailyTerm] = useState<{term: string, shortExplanation: string, date: string} | null>(null);
  const [isLoadingTerm, setIsLoadingTerm] = useState(false);
  const [showDailyTermPopup, setShowDailyTermPopup] = useState(false);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  const isLoginModalOpen = externalIsLoginModalOpen !== undefined ? externalIsLoginModalOpen : internalIsLoginModalOpen;
  const setIsLoginModalOpen = externalSetIsLoginModalOpen || setInternalIsLoginModalOpen;
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme") || "light";
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const getPopupOffset = useCallback((index: number) => {
    return index * 100; // Vertical offset for stacking
  }, []);

  useEffect(() => {
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
    
    if (status !== "loading") {
      setIsSessionLoaded(true);
    }
  }, [status]);

  useEffect(() => {
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
    const hasShownInSession = sessionStorage.getItem("installPromptShown");

    const handleBeforeInstallPrompt = (e: Event) => {
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

  useEffect(() => {
    if (status === "authenticated") {
      const fetchDailyTerm = async () => {
        setIsLoadingTerm(true);
        try {
          const response = await fetch("/api/daily-term");
          if (!response.ok) {
            throw new Error('Failed to fetch');
          }
          const data = await response.json();
          setDailyTerm(data);
        } catch (error) {
          console.error("[Layout] fetchDailyTerm Error:", (error as Error).message);
          toast.error("Error loading daily term");
        } finally {
          setIsLoadingTerm(false);
        }
      };
      fetchDailyTerm();
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated" && dailyTerm && showDailyTermPopup) {
      const timer = setTimeout(() => setShowDailyTermPopup(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [status, dailyTerm, showDailyTermPopup]);

  const handleInstallClick = useCallback(() => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      (deferredPrompt as any).userChoice.then((choiceResult: { outcome: string }) => {
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

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }, [currentTheme, setTheme]);

  const openModal = useCallback(
    (mode: 'signin' | 'register') => {
      setInitialModalMode(mode);
      setIsLoginModalOpen(true);
      setIsMenuOpen(false);
      setIsProfileDropdownOpen(false);
    },
    [setIsLoginModalOpen]
  );

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const toggleProfileDropdown = useCallback(() => setIsProfileDropdownOpen((prev) => !prev), []);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      await signIn("google", { callbackUrl: pathname || "/", prompt: "select_account" });
      setIsGoogleSignInPopupOpen(false);
    } catch (error) {
      console.error("[Layout] Google sign-in error:", (error as Error).message);
      toast.error("Google sign-in failed. Please try again.");
    }
  }, [pathname]);

  const handleCloseGoogleSignInPopup = useCallback(() => {
    setIsGoogleSignInPopupOpen(false);
    sessionStorage.setItem("googleSignInPopupDismissed", "true");
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="leetcode, system design, TechBit, QuickLearn, Micro Dev Tips, Tech Battles, POTD, coding, algorithms, interview prep, programming, daily terms, community, career services" />
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#4f46e5" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "DevExCode",
                url: "https://devexcode.com",
                description: description,
              })
            ),
          }} />
      </Head>

      <header className="bg-white/90 dark:bg-slate-900/90 shadow-md p-4 sticky top-0 z-50 backdrop-blur-sm border-b border-gray-200/50 dark:border-slate-700/50">
        <div className="mx-auto w-full px-0 sm:px-4 lg:px-6 flex justify-between items-center">
          <Link href="/" className="text-2xl sm:text-3xl font-extrabold text-primary hover:scale-105 transition-transform duration-200" aria-label="DevExCode Home">
            DevExCode
          </Link>
          <SpeedInsights />
          <nav role="navigation" aria-label="Main navigation" className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {[
              { href: "/leetcode", label: "Leetcode", icon: CodeBracketIcon },
              { href: "/system-design", label: "System Design", icon: RocketLaunchIcon },
              { href: "/interview", label: "Interview", icon: CodeBracketSquareIcon },
            ].map((item) => (
              <Link key={item.href} href={item.href} className={`text-sm font-bold transition-colors duration-200 ${pathname === item.href ? "text-primary dark:text-indigo-400 border-b-2 border-primary dark:border-indigo-400" : "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-indigo-400"}`} aria-current={pathname === item.href ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
            {status === "authenticated" ? (
              <button onClick={toggleProfileDropdown} className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-indigo-400 transition-colors duration-200" aria-label={`Open profile for ${session?.user?.name || session?.user?.email}`}>
                <UserIcon className="w-5 h-5 text-primary dark:text-indigo-400" />
                <span className="truncate max-w-[100px] sm:max-w-[120px]">{session?.user?.name || session?.user?.email?.split("@")[0] || "User"}</span>
              </button>
            ) : (
              <>
                <button onClick={() => openModal("signin")} className="flex items-center space-x-1 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-indigo-400 transition-colors duration-200" aria-label="Sign in">
                  <UserIcon className="w-4 h-4" /><span>Sign In</span>
                </button>
                <button onClick={() => openModal("register")} className="flex items-center space-x-1 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-indigo-400 transition-colors duration-200" aria-label="Register">
                  <UserPlusIcon className="w-4 h-4" /><span>Register</span>
                </button>
              </>
            )}
            <button onClick={toggleTheme} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200" aria-label={`Switch to ${currentTheme === "light" ? "dark" : "light"} mode`}>
              {currentTheme === "light" ? <MoonIcon className="w-5 h-5 text-gray-800 dark:text-gray-200" /> : <SunIcon className="w-5 h-5 text-yellow-400" />}
            </button>
          </nav>
          <div className="md:hidden flex items-center space-x-2">
            <button onClick={toggleTheme} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200" aria-label={`Switch to ${currentTheme === "light" ? "dark" : "light"} mode`}>
                {currentTheme === "light" ? <MoonIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" /> : <SunIcon className="w-6 h-6 text-yellow-400" />}
            </button>
            <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200" onClick={toggleMenu} aria-label="Toggle menu" aria-expanded={isMenuOpen}>
              {isMenuOpen ? <XMarkIcon className="w-6 h-6 text-gray-800 dark:text-gray-100" /> : <Bars3Icon className="w-6 h-6 text-gray-800 dark:text-gray-100" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav variants={menuVariants} initial="hidden" animate="visible" exit="exit" className="md:hidden mt-3 mx-2 bg-white/95 dark:bg-slate-900/95 p-4 rounded-lg shadow-md border border-gray-200/30 dark:border-slate-700/30" role="navigation" aria-label="Mobile navigation">
              {[
                  { href: "/", label: "Home", icon: HomeIcon },
                  { href: "/leetcode", label: "Leetcode", icon: CodeBracketIcon },
                  { href: "/system-design", label: "System Design", icon: RocketLaunchIcon },
                  { href: "/interview", label: "Interview", icon: CodeBracketSquareIcon },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-indigo-400 py-2" onClick={toggleMenu} aria-current={pathname === item.href ? "page" : undefined}>
                  <item.icon className="w-5 h-5" /><span>{item.label}</span>
                </Link>
              ))}
              {status === "authenticated" ? (
                <button onClick={toggleProfileDropdown} className="flex items-center space-x-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-indigo-400 py-2" aria-label={`Toggle profile options for ${session?.user?.name || session?.user?.email}`} aria-expanded={isProfileDropdownOpen}>
                  <UserIcon className="w-5 h-5 text-primary dark:text-indigo-400" />
                  <span className="truncate max-w-[150px]">{session?.user?.name || session?.user?.email?.split("@")[0] || "User"}</span>
                </button>
              ) : (
                <>
                  <button onClick={() => { openModal("signin"); toggleMenu(); }} className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-indigo-400 py-2" aria-label="Sign in">
                    <UserIcon className="w-5 h-5" /><span>Sign In</span>
                  </button>
                  <button onClick={() => { openModal("register"); toggleMenu(); }} className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-indigo-400 py-2" aria-label="Register">
                    <UserPlusIcon className="w-5 h-5" /><span>Register</span>
                  </button>
                </>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow w-screen !px-0 !mx-0 max-w-none py-10">{children}</main>

      <footer className="bg-white/80 dark:bg-slate-900/80 border-t border-gray-200/50 dark:border-slate-700/50 py-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">DevExCode</h3>
              <p className="text-sm">Master coding interviews with Leetcode, system design, and more.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">Quick Links</h3>
              <ul className="space-y-2">
                {["About", "Contact", "Privacy", "Terms"].map((item) => (
                  <li key={item}><Link href={`/${item.toLowerCase()}`} className="hover:text-primary dark:hover:text-indigo-400 transition-colors duration-200 text-sm">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">Connect</h3>
              <ul className="space-y-2">
                {[{ name: "GitHub", href: "https://github.com/devexcode" },{ name: "Twitter", href: "https://twitter.com/devexcode" },{ name: "LinkedIn", href: "https://linkedin.com/company/devexcode" }].map((item) => (
                  <li key={item.name}><a href={item.href} className="hover:text-primary dark:hover:text-indigo-400 transition-colors duration-200 text-sm" target="_blank" rel="noopener noreferrer" aria-label={item.name}>{item.name}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm font-medium">© {new Date().getFullYear()} DevExCode. All rights reserved.</p>
        </div>
      </footer>
      <AnimatePresence>
        {isLoginModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black/50 z-50">
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} initialMode={initialModalMode} onLoginSuccess={() => { setIsLoginModalOpen(false); toast.success("Logged in successfully"); }} />
          </motion.div>
        )}
        {status === "authenticated" && !isMenuOpen && (<ProfileModal isOpen={isProfileDropdownOpen} onClose={() => setIsProfileDropdownOpen(false)} isMobile={false} />)}
      </AnimatePresence>
    </div>
  );
}

// Dummy useTheme hook to satisfy AppLayout dependencies until next-themes is fully integrated
const useTheme = () => {
    const [theme, setThemeState] = useState('light');
    const setTheme = (newTheme: string) => {
        setThemeState(newTheme);
        if (typeof window !== 'undefined') {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(newTheme);
            localStorage.setItem('theme', newTheme);
        }
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setThemeState(savedTheme);
        document.documentElement.classList.add(savedTheme);
    }, []);

    return { theme, setTheme, systemTheme: 'light' };
};
