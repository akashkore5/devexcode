// pages/interview/mock/index.js
import Link from "next/link";
import Head from "next/head";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Layout from "../../../components/Layout";
import { toast, Toaster } from "react-hot-toast";
import {
  CodeBracketIcon,
  RocketLaunchIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/solid";
import DOMPurify from "isomorphic-dompurify";
import { useSession } from "next-auth/react";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "DevExCode Mock Interviews",
  url: "https://devexcode.com/interview/mock",
  description: "Practice coding, system design, and behavioral mock interviews to prepare for technical interviews with real-time feedback.",
  publisher: {
    "@type": "Organization",
    name: "DevExCode Team",
  },
};

export default function MockInterviewsPage() {
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(!!session);
  const [userName, setUserName] = useState(session?.user?.name || "");
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    interviewType: "coding",
    preferredDate: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { ref: mockSectionRef, inView: mockSectionInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/interview/mock-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Mock interview request sent successfully!");
        setFormData({
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          interviewType: "coding",
          preferredDate: "",
          message: "",
        });
      } else {
        toast.error(result.message || "Failed to send request. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout isLoggedIn={isLoggedIn} userName={userName}>
      <Head>
        <title>DevExCode - Mock Interviews</title>
        <meta
          name="description"
          content="Practice coding, system design, and behavioral mock interviews to prepare for technical interviews with real-time feedback."
        />
        <meta name="keywords" content="mock interviews, coding interviews, system design interviews, behavioral interviews, interview preparation" />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="DevExCode - Mock Interviews" />
        <meta property="og:description" content="Simulate real interview scenarios with our coding, system design, and behavioral mock interviews." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devexcode.com/interview/mock" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(JSON.stringify(structuredData)),
          }}
        />
      </Head>

      <Toaster position="top-right" toastOptions={{ duration: 4000, className: "mt-4" }} />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Mock Interviews
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Simulate real interview scenarios with our coding, system design, and behavioral mock interviews, complete with expert feedback.
          </motion.p>
        </div>
      </section>

      {/* Mock Interview Types */}
      <section ref={mockSectionRef} className="py-16 bg-white dark:bg-slate-800">
        {mockSectionInView && (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <motion.h2
              variants={cardVariants}
              className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
            >
              Choose Your Mock Interview
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Coding Interview",
                  description: "Practice solving algorithmic problems under time constraints with real-time feedback.",
                  icon: <CodeBracketIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/interview/mock/coding",
                },
                {
                  title: "System Design Interview",
                  description: "Design scalable systems and discuss architecture with expert guidance.",
                  icon: <RocketLaunchIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/interview/mock/system-design",
                },
                {
                  title: "Behavioral Interview",
                  description: "Prepare for behavioral questions with mock scenarios and feedback.",
                  icon: <PuzzlePieceIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
                  link: "/interview/mock/behavioral",
                },
              ].map((mock, index) => (
                <Link key={`mock-${index}`} href={mock.link} prefetch={true}>
                  <motion.div
                    variants={cardVariants}
                    className="p-6 bg-gray-50 dark:bg-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {mock.icon}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{mock.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{mock.description}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </section>

      {/* Schedule Mock Interview Form */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.h2
            variants={cardVariants}
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
          >
            Schedule a Mock Interview
          </motion.h2>
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="interviewType" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Interview Type
              </label>
              <select
                id="interviewType"
                name="interviewType"
                value={formData.interviewType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="coding">Coding Interview</option>
                <option value="system-design">System Design Interview</option>
                <option value="behavioral">Behavioral Interview</option>
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="preferredDate" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Additional Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white"
                rows="4"
              />
            </div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? "Sending..." : "Send Request"}
            </motion.button>
          </form>
        </motion.div>
      </section>
    </Layout>
  );
}