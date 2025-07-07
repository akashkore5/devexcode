'use client';
import { motion, useInView } from "framer-motion";
import {
  CodeBracketIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  StarIcon,
  BellIcon,
  BookOpenIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRef } from "react";


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function About() {
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const statsRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const isMissionInView = useInView(missionRef, { once: true, amount: 0.3 });
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });

  return (
    <main className="bg-gray-50 dark:bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-indigo-600 to-teal-500 text-white py-16 md:py-24"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Building the Future of Coding with DevExCode
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Join 15,000+ developers mastering coding interviews with our expert Leetcode solutions, system design guides, daily tech terms, and vibrant community, crafted by developers Akash Kore, Vipul Sukhdeve, and Yogesh Pandav.
          </p>
          <Link
            href="/community"
            className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          >
            Join Our Community
          </Link>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {/* Mission & Vision */}
          <motion.section
            ref={missionRef}
            variants={itemVariants}
            className="bg-indigo-50 dark:bg-slate-800 rounded-2xl p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isMissionInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5 }}
                className="md:w-1/3 flex justify-center"
              >
                <CodeBracketIcon className="w-24 h-24 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              </motion.div>
              <div className="md:w-2/3 text-gray-700 dark:text-gray-200 max-w-none">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-3">
                  <span>Our Mission & Vision</span>
                </h2>
                <p className="text-lg mb-4">
                  At <strong>DevExCode</strong>, our mission is to transform coding interview preparation by delivering unparalleled resources and community support. With over 7500 Leetcode solutions, 75 system design guides, daily technical terms, and 10-minute learn topics, we empower 15,000+ developers to conquer technical interviews and build scalable systems.
                </p>
                <p className="text-lg mb-4">
                  Our vision is to create a global hub for coders, where learning is accessible, collaborative, and innovative. Led by developers Akash Kore, Vipul Sukhdeve, and Yogesh Pandav, we aim to support millions of learners with curated learning paths, tech battles, and a vibrant community of 1000+ members.
                </p>
                <Link
                  href="/paths"
                  className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Start Your Journey
                </Link>
              </div>
            </div>
          </motion.section>

          {/* What We Offer */}
          <motion.section variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3 mb-6">
              <RocketLaunchIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <span>What We Offer</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <BellIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Daily Technical Terms</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Learn a new tech term daily with concise explanations and push notifications, perfect for staying sharp.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <BookOpenIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">10-Minute Learn Topics</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Master concepts like Kafka, Docker, and REST APIs in quick, focused lessons designed for busy coders.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <AcademicCapIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Curated Learning Paths</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Follow beginner, advanced, or FAANG prep paths to build skills systematically with curated resources.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <CodeBracketIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Leetcode Solutions</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Access 7500+ solved problems in Python, C++, and Java, with detailed explanations for FAANG interviews.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <RocketLaunchIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">System Design Guides</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Learn to design scalable systems like Netflix or Twitter with 75+ in-depth guides for senior roles.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <UserGroupIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Vibrant Community</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Collaborate with 1000+ coders in forums, share solutions, and grow through tech battles and discussions.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Our Team */}
          <motion.section variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3 mb-6">
              <UserGroupIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <span>Meet Our Team</span>
            </h2>
            <div className="prose dark:prose-invert prose-lg text-gray-700 dark:text-gray-300 mb-6">
              <p>
                DevExCode is powered by a passionate team of developers and analysts dedicated to revolutionizing coding education. Meet the minds behind our platform:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Akash Kore</h3>
                <p className="text-indigo-600 dark:text-indigo-400 mb-3">Developer & Analyst</p>
                <p className="text-gray-600 dark:text-gray-300">
                  Akash is a skilled software developer with expertise in algorithms and system design. He architects DevExCode’s Leetcode solutions and ensures our content is top-notch for interview prep.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Vipul Sukhdeve</h3>
                <p className="text-indigo-600 dark:text-indigo-400 mb-3">Developer & Analyst</p>
                <p className="text-gray-600 dark:text-gray-300">
                  Vipul brings deep knowledge of data structures and distributed systems. He crafts system design guides and drives our platform’s technical innovation.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Yogesh Pandav</h3>
                <p className="text-indigo-600 dark:text-indigo-400 mb-3">Developer & Analyst</p>
                <p className="text-gray-600 dark:text-gray-300">
                  Yogesh is a coding enthusiast who develops our daily tech terms and learning paths, making complex concepts accessible to coders worldwide.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Stats Section */}
          <motion.section ref={statsRef} variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3 mb-6">
              <StarIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <span>Our Impact</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 bg-indigo-50 dark:bg-slate-800 p-8 rounded-2xl">
              {[
                { label: "Problems Solved", value: 7500 },
                { label: "Design Guides", value: 75 },
                { label: "Code Submissions", value: 25000 },
                { label: "Happy Learners", value: 15000 },
                { label: "Community Members", value: 1000 },
              ].map((stat, index) => (
                <motion.div
                  key={`stat-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    {stat.value.toLocaleString()}+
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Testimonials */}
          <motion.section variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3 mb-6">
              <StarIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <span>What Our Community Says</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                  “DevExCode’s Leetcode solutions and daily terms helped me land a role at Google. The community support is unmatched!”
                </p>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold">— Priya S., Software Engineer</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
                <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                  “The system design guides and learning paths gave me confidence to ace my Amazon interview. Highly recommend DevEx!”
                </p>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold">— Rahul M., Senior SWE</p>
              </div>
            </div>
          </motion.section>

          {/* Get in Touch */}
          <motion.section variants={itemVariants}>
            <div className="bg-gradient-to-r from-indigo-600 to-teal-500 rounded-2xl p-8 md:p-12 text-white">
              <h2 className="text-3xl font-bold mb-6 text-center">Get in Touch</h2>
              <p className="text-lg text-center max-w-3xl mx-auto mb-8">
                Have questions about Leetcode solutions, system design guides, or our community? Reach out to our team, collaborate on tech battles, or join 1000+ coders in our forums. We’re here to help you succeed!
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
                <a
                  href="mailto:support@devexcode.com"
                  className="flex items-center space-x-2 text-white hover:text-gray-100 transition-colors"
                  aria-label="Email support"
                >
                  <EnvelopeIcon className="w-6 h-6" />
                  <span>support@devexcode.com</span>
                </a>
                <div className="flex space-x-4">
                  <a
                    href="https://twitter.com/devexcode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-100 transition-colors"
                    aria-label="Follow on Twitter"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/company/devexcode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-100 transition-colors"
                    aria-label="Follow on LinkedIn"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-block bg-white text-indigo-600 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/community"
                  className="inline-block bg-teal-500 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-teal-600 transition-colors"
                >
                  Join Our Forums
                </Link>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "DevExCode",
            url: "https://devexcode.com",
            description: "DevExCode empowers 15,000+ coders with Leetcode solutions, system design guides, daily technical terms, and a vibrant community, led by developers Akash Kore, Vipul Sukhdeve, and Yogesh Pandav.",
            sameAs: [
              "https://twitter.com/devexcode",
              "https://linkedin.com/company/devexcode",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              email: "support@devexcode.com",
              contactType: "Customer Support",
            },
            member: [
              {
                "@type": "Person",
                name: "Akash Kore",
                jobTitle: "Developer & Analyst",
                worksFor: { "@type": "Organization", name: "DevExCode" },
              },
              {
                "@type": "Person",
                name: "Vipul Sukhdeve",
                jobTitle: "Developer & Analyst",
                worksFor: { "@type": "Organization", name: "DevExCode" },
              },
              {
                "@type": "Person",
                name: "Yogesh Pandav",
                jobTitle: "Developer & Analyst",
                worksFor: { "@type": "Organization", name: "DevExCode" },
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://devexcode.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "About",
                item: "https://devexcode.com/about",
              },
            ],
          }),
        }}
      />
    </main>
  );
}
