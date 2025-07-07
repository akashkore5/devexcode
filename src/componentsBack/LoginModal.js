import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function LoginModal({ isOpen, onClose, initialMode = "signin", onLoginSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (mode === "register") {
      if (!name || !/^[a-zA-Z\s]{2,50}$/.test(name)) {
        newErrors.name = "Name must be 2–50 alphabetic characters";
      }
    }
    if (mode !== "forgot") {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Invalid email address";
      }
    }
    if (mode === "register" && mobile && !/^\+?[\d-]{7,15}$/.test(mobile)) {
      newErrors.mobile = "Invalid mobile number (e.g., +1234567890 or 123-456-7890)";
    }
    if (mode !== "forgot" && (!password || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password))) {
      newErrors.password = "Password must be 8+ characters with uppercase, lowercase, number, and special character";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }
    setIsLoading(true);

    try {
      if (mode === "register") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, mobile, password }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }
      } else if (mode === "forgot") {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to send reset email");
        }
        toast.success("Password reset email sent. Please check your inbox.");
        setMode("signin");
        setEmail("");
        setIsLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success(mode === "signin" ? "Signed in successfully" : "Registered and signed in successfully");
      setName("");
      setEmail("");
      setMobile("");
      setPassword("");
      setErrors({});
      onLoginSuccess();
    } catch (error) {
      console.error("Auth error:", error.message);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google sign-in error:", error.message);
      toast.error("Google sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  const toggleMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setName("");
    setEmail("");
    setMobile("");
    setPassword("");
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-md relative shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          aria-label="Close modal"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          {mode === "signin" ? "Sign In" : mode === "register" ? "Create Account" : "Reset Password"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "register" && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-1 px-4 py-2 w-full rounded-md border ${
                  errors.name ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                } dark:bg-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
                placeholder="John Doe"
                required
                aria-label="Full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 px-4 py-2 w-full rounded-md border ${
                errors.email ? "border-red-500" : "border-gray-300 dark:border-slate-600"
              } dark:bg-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
              placeholder="you@example.com"
              required
              aria-label="Email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          {mode === "register" && (
            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Mobile Number (Optional)
              </label>
              <input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className={`mt-1 px-4 py-2 w-full rounded-md border ${
                  errors.mobile ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                } dark:bg-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
                placeholder="+1234567890 or 123-456-7890"
                aria-label="Mobile number"
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>
              )}
            </div>
          )}
          {mode !== "forgot" && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 px-4 py-2 w-full rounded-md border ${
                  errors.password ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                } dark:bg-slate-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
                placeholder="••••••••"
                required
                aria-label="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={mode === "signin" ? "Sign in" : mode === "register" ? "Register" : "Send Reset Email"}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            ) : mode === "signin" ? (
              "Sign In"
            ) : mode === "register" ? (
              "Register"
            ) : (
              "Send Reset Email"
            )}
          </button>
        </form>
        {mode === "signin" && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center">
            <button
              onClick={() => toggleMode("forgot")}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              aria-label="Forgot password"
            >
              Forgot Password?
            </button>
          </p>
        )}
        {mode !== "forgot" && (
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full mt-4 px-4 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            aria-label="Sign in with Google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.01.68-2.3 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.52 7.77 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.77 1 4.01 3.48 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>{isLoading ? "Processing..." : "Sign in with Google"}</span>
          </button>
        )}
        <p className="mt-6 text-sm text-gray-600 dark:text-gray-300 text-center">
          {mode === "signin" ? "Don't have an account?" : mode === "register" ? "Already have an account?" : "Back to sign in?"}
          <button
            onClick={() => toggleMode(mode === "signin" ? "register" : "signin")}
            className="ml-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            aria-label={mode === "signin" ? "Switch to register" : "Switch to sign in"}
          >
            {mode === "signin" ? "Register" : "Sign In"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}