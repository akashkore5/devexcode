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
  ChevronDownIcon
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
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background selection:bg-primary/20 selection:text-primary">
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="mx-4 my-4">
          <div className="container mx-auto">
            <div className="glass dark:glass-dark rounded-3xl px-6 py-4 flex justify-between items-center border border-white/10 shadow-2xl">
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
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="lg:hidden absolute top-full left-4 right-4 mt-2"
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

      <footer className="bg-card dark:bg-card/30 border-t border-border pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 lg:col-span-1">
              <Link href="/" className="flex items-center space-x-2 mb-6 group">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-sm">D</span>
                </div>
                <span className="text-xl font-black gradient-text tracking-tighter">DevExCode</span>
              </Link>
              <p className="text-muted-foreground leading-relaxed mb-8">
                The ultimate platform for modern engineers to master technical interviews and system design at scale.
              </p>
              <div className="flex space-x-4">
                {[{ icon: "GitHub", href: "#" }, { icon: "Twitter", href: "#" }, { icon: "LinkedIn", href: "#" }].map((social) => (
                  <a key={social.icon} href={social.href} className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                    <span className="sr-only">{social.icon}</span>
                    <i className={`fab fa-${social.icon.toLowerCase()}`} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-6">Learning Paths</h3>
              <ul className="space-y-4">
                {navLinks.slice(0, 4).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors flex items-center group">
                      <ChevronRightIcon className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-6">Quick Links</h3>
              <ul className="space-y-4">
                {["About Us", "Contact Support", "Terms of Service", "Privacy Policy"].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase().replace(/ /g, "-")}`} className="text-muted-foreground hover:text-primary transition-colors flex items-center group">
                      <ChevronRightIcon className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4">Weekly Insights</h3>
                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                  Join 15,000+ developers receiving the best tech interview tips every Tuesday.
                </p>
                <div className="flex space-x-2">
                  <input type="email" placeholder="Email" className="bg-background border border-border rounded-xl px-4 py-2 text-xs flex-grow focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <button className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold">Join</button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-10 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} DevExCode Inc. Built for the future of engineering.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" /> All Systems Operational</span>
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
