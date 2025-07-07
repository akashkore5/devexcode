// pages/interview/tips/index.js
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Layout from "../../../components/Layout";
import { toast, Toaster } from "react-hot-toast";
import { DocumentTextIcon } from "@heroicons/react/24/solid";
import DOMPurify from "isomorphic-dompurify";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";

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
  name: "DevExCode Expert Interview Tips",
  url: "https://devexcode.com/interview/tips",
  description: "Learn expert tips to optimize solutions, communicate effectively, and handle edge cases in technical interviews.",
  publisher: {
    "@type": "Organization",
    name: "DevExCode Team",
  },
};

const tips = [
  {
    title: "Optimize Your Solutions",
    description:
      "Learn to analyze time and space complexity to impress interviewers. Focus on writing efficient code by understanding the problem constraints and choosing the right data structures and algorithms.",
    details: [
      "Always analyze the time and space complexity of your solution before coding. For example, if you're solving a problem like finding duplicates in an array, a hash set can reduce time complexity from O(n²) to O(n).",
      "Consider trade-offs between time and space complexity. For instance, using extra space (like a hash map) might be acceptable if it significantly reduces runtime.",
      "Test your solution with small inputs to verify correctness, then optimize for larger inputs. For example, in a sorting problem, quicksort may be faster than bubble sort for large datasets.",
      "Example: For the 'Two Sum' problem, instead of using nested loops (O(n²)), use a hash map to store complements, achieving O(n) time complexity.",
    ],
  },
  {
    title: "Communicate Effectively",
    description:
      "Master the art of explaining your thought process clearly to demonstrate problem-solving skills and build rapport with the interviewer.",
    details: [
      "Start by restating the problem to ensure you understand it. For example, 'So, we need to find two numbers in an array that add up to a target value and return their indices.'",
      "Walk through your approach step-by-step before coding. Use a whiteboard or verbal explanation to outline your algorithm, e.g., 'I'll use a hash map to store numbers and their indices.'",
      "Ask clarifying questions, such as 'Can the input array contain duplicates?' or 'Should I optimize for time or space?'",
      "Keep the interviewer engaged by narrating your thought process, even when stuck. For example, 'I'm considering a binary search, but the array isn't sorted, so let’s explore another approach.'",
    ],
  },
  {
    title: "Handle Edge Cases",
    description:
      "Discover strategies to identify and address edge cases in problems to ensure robust solutions.",
    details: [
      "Always consider edge cases like empty inputs, single-element inputs, or extreme values. For example, in a linked list problem, check for an empty list or a list with one node.",
      "Test your code mentally with edge cases before submitting. For instance, in a string reversal problem, handle empty strings or strings with spaces.",
      "Ask the interviewer about constraints, e.g., 'Can the input contain negative numbers?' or 'What happens if the array is null?'",
      "Example: In a binary tree traversal, account for cases where the tree is empty or has only one node to avoid null pointer errors.",
    ],
  },
];

export default function InterviewTipsPage() {
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(!!session);
  const [userName, setUserName] = useState(session?.user?.name || "");

  const { ref: tipsSectionRef, inView: tipsSectionInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Layout isLoggedIn={isLoggedIn} userName={userName}>
      <Head>
        <title>DevExCode - Expert Interview Tips</title>
        <meta
          name="description"
          content="Learn expert tips to optimize solutions, communicate effectively, and handle edge cases in technical interviews."
        />
        <meta name="keywords" content="interview tips, technical interviews, coding interviews, optimize solutions, communicate effectively, edge cases" />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="DevExCode - Expert Interview Tips" />
        <meta property="og:description" content="Master technical interviews with expert tips on optimization, communication, and edge cases." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devexcode.com/interview/tips" />
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
            Expert Interview Tips
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Master technical interviews with actionable tips on optimizing solutions, communicating effectively, and handling edge cases.
          </motion.p>
        </div>
      </section>

      {/* Tips Section */}
      <section ref={tipsSectionRef} className="py-16 bg-white dark:bg-slate-800">
        {tipsSectionInView && (
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
              Top Interview Tips
            </motion.h2>
            <div className="space-y-12">
              {tips.map((tip, index) => (
                <motion.div
                  key={`tip-${index}`}
                  variants={cardVariants}
                  className="p-6 bg-gray-50 dark:bg-slate-700 rounded-2xl shadow-lg"
                >
                  <DocumentTextIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{tip.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{tip.description}</p>
                  <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
                    {tip.details.map((detail, idx) => (
                      <li key={`detail-${idx}`} className="mb-2">{detail}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </section>
    </Layout>
  );
}