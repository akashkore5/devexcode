'use client';

import { useState, useEffect, useCallback, ReactNode } from "react";
import Link from "next/link";
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
  BriefcaseIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CommandLineIcon
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
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [internalIsLoginModalOpen, setInternalIsLoginModalOpen] = useState(false);
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
      setInternalIsLoginModalOpen(true);
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
      { href: "/system-design/flows", label: "System Flows", icon: CommandLineIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background selection:bg-primary/20 selection:text-primary">
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="mx-1 sm:mx-4 my-2 sm:my-4">
            <div className="glass dark:glass-dark rounded-2xl sm:rounded-3xl px-3 sm:px-6 py-2.5 sm:py-4 flex justify-between items-center border border-white/10 shadow-2xl">
              <Link href="/" className="flex items-center space-x-2 group" aria-label="DevExCode Home">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:rotate-6 transition-transform">
                  <span className="text-white font-black text-xl">D</span>
                </div>
                <span className="text-2xl font-black gradient-text tracking-tighter">DevExCode</span>
              </Link>
              
              <nav role="navigation" aria-label="Main navigation" className="hidden lg:flex items-center space-x-1">
                {navLinks.slice(0, 4).map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                      pathname === item.href 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-foreground/70 hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="relative">
                  <button 
                    onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                    onMouseEnter={() => setIsMoreDropdownOpen(true)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center space-x-1 ${
                      navLinks.slice(4).some(link => pathname === link.href)
                        ? "bg-primary/10 text-primary" 
                        : "text-foreground/70 hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <span>More</span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isMoreDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isMoreDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsMoreDropdownOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          onMouseLeave={() => setIsMoreDropdownOpen(false)}
                          className="absolute top-full right-0 mt-2 w-56 glass dark:glass-dark rounded-2xl p-2 border border-white/10 shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="grid gap-1">
                            {navLinks.slice(4).map((item) => (
                              <Link 
                                key={item.href} 
                                href={item.href} 
                                onClick={() => setIsMoreDropdownOpen(false)}
                                className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                                  pathname === item.href 
                                    ? "bg-primary text-white" 
                                    : "text-foreground/70 hover:bg-primary/10 hover:text-primary"
                                }`}
                              >
                                <item.icon className="w-5 h-5 opacity-70" />
                                <span>{item.label}</span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="w-px h-6 bg-border mx-2" />
                
                <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-primary/10 transition-colors text-foreground/70" aria-label="Toggle theme">
                  {theme === "light" ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                </button>

                {status === "authenticated" ? (
                  <div className="relative ml-2">
                    <button onClick={toggleProfileDropdown} className="flex items-center space-x-2 p-1 pr-3 rounded-full bg-secondary/20 hover:bg-secondary/30 transition-all border border-secondary/10">
                      {session.user?.image ? (
                        <img src={session.user.image} alt="profile" className="w-8 h-8 rounded-full border-2 border-primary/20" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                          {session.user?.name?.[0] || "U"}
                        </div>
                      )}
                      <span className="text-xs font-bold text-foreground truncate max-w-[80px]">{session?.user?.name || "Member"}</span>
                    </button>
                    <ProfileModal isOpen={isProfileDropdownOpen} onClose={() => setIsProfileDropdownOpen(false)} isMobile={false} />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 ml-2">
                    <button onClick={() => openModal("signin")} className="px-4 py-2 text-sm font-bold text-foreground/70 hover:text-primary transition-colors">
                      Sign In
                    </button>
                    <button onClick={() => openModal("register")} className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/30 transition-all">
                      Get Started
                    </button>
                  </div>
                )}
              </nav>

              <div className="lg:hidden flex items-center space-x-2">
                <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-primary/10 transition-colors">
                  {theme === "light" ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                </button>
                <button className="p-2 rounded-xl bg-primary/10 text-primary" onClick={toggleMenu} aria-label="Toggle menu">
                  {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="lg:hidden absolute top-full left-2 right-2 sm:left-4 sm:right-4 mt-2"
            >
              <div className="glass dark:glass-dark rounded-3xl p-6 border border-white/10 shadow-2xl max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {navLinks.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                        pathname === item.href ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-card border-border hover:border-primary/50 text-foreground/80"
                      }`}
                      onClick={toggleMenu}
                    >
                      <item.icon className="w-6 h-6 mb-2" />
                      <span className="text-xs font-bold text-center">{item.label}</span>
                    </Link>
                  ))}
                </div>
                
                <div className="border-t border-border mt-6 pt-6 flex flex-col space-y-4">
                  {status === "authenticated" ? (
                    <button onClick={() => { setIsProfileDropdownOpen(true); toggleMenu(); }} className="flex items-center space-x-3 px-4 py-3 bg-secondary/20 rounded-2xl text-foreground font-bold">
                      <UserIcon className="w-5 h-5 text-primary" />
                      <span>My Profile</span>
                    </button>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <button onClick={() => { openModal("signin"); toggleMenu(); }} className="w-full py-3 text-center font-bold text-foreground/70">
                        Sign In
                      </button>
                      <button onClick={() => { openModal("register"); toggleMenu(); }} className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20">
                        Join DevExCode
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow pt-8">{children}</main>

      <footer className="relative bg-card dark:bg-card/20 border-t border-border pt-24 pb-12 overflow-hidden">
        {/* Subtle glow effect behind the footer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col items-start">
              <Link href="/" className="flex items-center space-x-3 mb-6 group">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                  <span className="text-white font-black text-xl">D</span>
                </div>
                <span className="text-2xl font-black gradient-text tracking-tight">DevExCode</span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xs">
                The ultimate platform for modern engineers to master technical interviews and system design at scale. Built by developers, for developers.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: "GitHub", href: "#", color: "hover:bg-[#333] hover:border-[#333]" },
                  { icon: "Twitter", href: "#", color: "hover:bg-[#1DA1F2] hover:border-[#1DA1F2]" },
                  { icon: "LinkedIn", href: "#", color: "hover:bg-[#0077B5] hover:border-[#0077B5]" }
                ].map((social) => (
                  <a 
                    key={social.icon} 
                    href={social.href} 
                    className={`w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-white transition-all duration-300 ${social.color}`}
                    aria-label={social.icon}
                  >
                    <i className={`fab fa-${social.icon.toLowerCase()}`} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Column 1 */}
            <div className="col-span-1 lg:col-span-2 lg:ml-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-6">Learning Paths</h3>
              <ul className="space-y-4">
                {navLinks.slice(0, 4).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group">
                      <ChevronRightIcon className="w-3.5 h-3.5 mr-2 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links Column 2 */}
            <div className="col-span-1 lg:col-span-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-6">Quick Links</h3>
              <ul className="space-y-4">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Contact Support", href: "/contact" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Privacy Policy", href: "/privacy" }
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center group">
                      <ChevronRightIcon className="w-3.5 h-3.5 mr-2 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4">
              <div className="p-6 sm:p-8 rounded-3xl glass dark:glass-dark border border-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />
                <h3 className="text-sm font-black text-foreground mb-3 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  Weekly Insights
                </h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed relative z-10">
                  Join 15,000+ developers receiving the best system design and interview tips every Tuesday. No spam, ever.
                </p>
                <div className="relative z-10 flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm flex-grow focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow" 
                  />
                  <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-sm text-muted-foreground font-medium mb-1">
                © {new Date().getFullYear()} DevExCode Inc. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground/60 flex items-center gap-1.5">
                Made with <span className="text-red-500 animate-pulse">❤️</span> for developers
              </p>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-full shadow-sm">
              <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="absolute w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {internalIsLoginModalOpen && (
            <LoginModal isOpen={internalIsLoginModalOpen} onClose={() => setInternalIsLoginModalOpen(false)} initialMode={initialModalMode} onLoginSuccess={() => { setInternalIsLoginModalOpen(false); toast.success("Logged in successfully"); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
