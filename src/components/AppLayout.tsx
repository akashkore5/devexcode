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
};

export function AppLayout({ children }: AppLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [initialModalMode, setInitialModalMode] = useState<"signin" | "register">("signin");
  const [theme, setTheme] = useState('light');
  const [isThemeLoading, setIsThemeLoading] = useState(true);

  // Register service worker on client-side only
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js", { scope: "/" })
        .then((registration) => {
          console.log("Service worker registered successfully:", registration);
        })
        .catch((error) => {
          console.error("Service worker registration failed:", error);
        });
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    setIsThemeLoading(false);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsThemeLoading(true);
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    setTimeout(() => setIsThemeLoading(false), 300);
  }, [theme]);
  
  const openModal = useCallback(
    (mode: 'signin' | 'register') => {
      setInitialModalMode(mode);
      setIsLoginModalOpen(true);
      setIsMenuOpen(false);
      setIsProfileDropdownOpen(false);
    },
    []
  );

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const toggleProfileDropdown = useCallback(() => setIsProfileDropdownOpen((prev) => !prev), []);

  const navLinks = [
      { href: "/leetcode", label: "LeetCode", icon: CodeBracketIcon },
      { href: "/system-design", label: "System Design", icon: RocketLaunchIcon },
      { href: "/interview", label: "Interview", icon: CodeBracketSquareIcon },
      { href: "/services", label: "Services", icon: BriefcaseIcon },
      { href: "/learn10", label: "QuickLearn", icon: BookOpenIcon },
      { href: "/daily-term", label: "TechBit", icon: PuzzlePieceIcon },
      { href: "/micro-dev-tips", label: "DevTips", icon: LightBulbIcon },
      { href: "/tech-battles", label: "Tech Battles", icon: ScaleIcon },
      { href: "/potd", label: "POTD", icon: StarIcon },
      { href: "/community", label: "Community", icon: UsersIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <header className="bg-card/80 dark:bg-card/80 shadow-sm p-4 sticky top-0 z-50 backdrop-blur-sm border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl sm:text-3xl font-extrabold text-primary hover:scale-105 transition-transform duration-200" aria-label="DevExCode Home">
            DevExCode
          </Link>
          <SpeedInsights />
          <nav role="navigation" aria-label="Main navigation" className="hidden md:flex items-center space-x-6">
             {navLinks.filter(item => item.auth).map((item) => (
              <Link key={item.href} href={item.href} className={`text-sm font-bold transition-colors duration-200 ${pathname === item.href ? "text-primary border-b-2 border-primary" : "text-foreground/70 hover:text-primary"}`} aria-current={pathname === item.href ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
            {status === "authenticated" ? (
                <div className="relative">
                    <button onClick={toggleProfileDropdown} className="flex items-center space-x-2 text-sm font-bold text-foreground/70 hover:text-primary transition-colors duration-200" aria-label={`Open profile for ${session?.user?.name || session?.user?.email}`}>
                        {session.user?.image ? <img src={session.user.image} alt="profile" className="w-8 h-8 rounded-full" /> : <UserIcon className="w-6 h-6 text-primary" />}
                        <span className="truncate max-w-[100px]">{session?.user?.name || "User"}</span>
                    </button>
                    <ProfileModal isOpen={isProfileDropdownOpen} onClose={() => setIsProfileDropdownOpen(false)} isMobile={false} />
                </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button onClick={() => openModal("signin")} className="text-sm font-bold text-foreground/70 hover:text-primary transition-colors" aria-label="Sign in">
                  Sign In
                </button>
                <button onClick={() => openModal("register")} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-bold hover:bg-primary/90 transition-colors" aria-label="Register">
                  Register
                </button>
              </div>
            )}
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring transition-colors" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
              {theme === "light" ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
          </nav>
          <div className="md:hidden flex items-center space-x-2">
             <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring transition-colors" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
                {theme === "light" ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
            <button className="p-1.5" onClick={toggleMenu} aria-label="Toggle menu" aria-expanded={isMenuOpen}>
              {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav variants={menuVariants} initial="hidden" animate="visible" exit="exit" className="md:hidden mt-3 mx-2 bg-card p-4 rounded-lg shadow-lg border" role="navigation" aria-label="Mobile navigation">
              {navLinks.map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center space-x-3 text-foreground/80 hover:text-primary py-2 text-base" onClick={toggleMenu} aria-current={pathname === item.href ? "page" : undefined}>
                  <item.icon className="w-5 h-5" /><span>{item.label}</span>
                </Link>
              ))}
               <div className="border-t my-4"></div>
               {status === "authenticated" ? (
                 <button onClick={() => { setIsProfileDropdownOpen(true); toggleMenu(); }} className="flex items-center space-x-3 text-foreground/80 hover:text-primary py-2 text-base w-full" aria-label={`Open profile for ${session?.user?.name || session?.user?.email}`}>
                    <UserIcon className="w-5 h-5" />
                    <span>Profile</span>
                 </button>
               ) : (
                <>
                  <button onClick={() => { openModal("signin"); toggleMenu(); }} className="flex items-center space-x-3 text-foreground/80 hover:text-primary py-2 text-base w-full" aria-label="Sign in">
                    <UserIcon className="w-5 h-5" /><span>Sign In</span>
                  </button>
                  <button onClick={() => { openModal("register"); toggleMenu(); }} className="flex items-center space-x-3 text-foreground/80 hover:text-primary py-2 text-base w-full" aria-label="Register">
                    <UserPlusIcon className="w-5 h-5" /><span>Register</span>
                  </button>
                </>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow container mx-auto px-4 py-10">{children}</main>

      <footer className="bg-card/50 border-t py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">DevExCode</h3>
              <p className="text-sm">Your partner in acing technical interviews and building a solid developer career.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Quick Links</h3>
              <ul className="space-y-2">
                {["About", "Contact", "Privacy", "Terms"].map((item) => (
                  <li key={item}><Link href={`/${item.toLowerCase()}`} className="hover:text-primary transition-colors duration-200 text-sm">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Connect</h3>
              <ul className="space-y-2">
                {[{ name: "GitHub", href: "https://github.com/devexcode" },{ name: "Twitter", href: "https://twitter.com/devexcode" },{ name: "LinkedIn", href: "https://linkedin.com/company/devexcode" }].map((item) => (
                  <li key={item.name}><a href={item.href} className="hover:text-primary transition-colors duration-200 text-sm" target="_blank" rel="noopener noreferrer" aria-label={item.name}>{item.name}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-8 pt-8 border-t text-center text-sm">© {new Date().getFullYear()} DevExCode. All rights reserved.</p>
        </div>
      </footer>
      
      <AnimatePresence>
        {isLoginModalOpen && (
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} initialMode={initialModalMode} onLoginSuccess={() => { setIsLoginModalOpen(false); toast.success("Logged in successfully"); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
