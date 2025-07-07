import Link from "next/link";
import Head from "next/head";
import { motion, useAnimation } from "framer-motion";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import Layout from "../components/Layout";
import DOMPurify from "isomorphic-dompurify";
import { useEffect, useState } from "react";

// Enhanced Particle component with variation
const CodeParticle = ({ delay, xStart, yStart, size, speed, color }) => {
  const controls = useAnimation();

  useEffect(() => {
    const animate = async () => {
      await controls.start({
        x: [xStart, xStart + (Math.random() * 120 - 60)],
        y: [yStart, yStart + 200],
        opacity: [0, 0.8, 0],
        rotate: Math.random() * 360,
        transition: {
          duration: speed,
          repeat: Infinity,
          repeatType: "loop",
          delay: delay,
          ease: "easeInOut",
        },
      });
    };
    animate();
  }, [controls, delay, xStart, yStart, speed]);

  const snippets = ["{...}", "if(err)", "404", "null", "=>", "console.log()", "try{}", "catch(e)", "fetch()", "useState()"];
  const snippet = snippets[Math.floor(Math.random() * snippets.length)];

  return (
    <motion.div
      animate={controls}
      className="absolute text-xs font-mono opacity-0"
      style={{
        color: color,
        fontSize: `${size}px`,
        filter: `drop-shadow(0 0 3px ${color})`,
      }}
    >
      {snippet}
    </motion.div>
  );
};

// Typing Effect Component for the Sentence
const TypingText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [index, text]);

  return <span>{displayedText}</span>;
};

export default function NotFound() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://devexcode.com";

  // Glitch animation for the "404" text
  const glitchVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 2,
      },
    },
    glitch: {
      x: [0, -5, 5, -2, 2, 0],
      y: [0, 2, -2, 1, -1, 0],
      textShadow: [
        "2px 2px 0px #ff0000, -2px -2px 0px #00ff00",
        "-2px 2px 0px #00ff00, 2px -2px 0px #ff0000",
        "2px 2px 0px #ff0000, -2px -2px 0px #00ff00",
      ],
      transition: {
        duration: 0.2,
        repeat: 3,
        repeatDelay: 2,
      },
    },
  };

  // Refined Glitch Effect for "Page Not Found" Subtitle (Readable)
  const subtitleGlitchVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.3, ease: "easeOut" },
    },
    glitch: {
      x: [0, -3, 3, 0],
      textShadow: [
        "1px 1px 0px #ff0000, -1px -1px 0px #00ff00",
        "-1px 1px 0px #00ff00, 1px -1px 0px #ff0000",
        "1px 1px 0px #ff0000, -1px -1px 0px #00ff00",
      ],
      transition: {
        duration: 0.15,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: "easeInOut",
      },
    },
  };

  // Animation for the description text (Typing Effect Wrapper)
  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.6, ease: "easeOut" },
    },
  };

  // Animation for the button
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 2.5, ease: "easeOut" },
    },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // Particle configurations with variations
  const particles = Array.from({ length: 15 }, (_, i) => ({
    delay: i * 0.3,
    xStart: Math.random() * 800 - 400,
    yStart: -150,
    size: Math.random() * 8 + 8, // Between 8px and 16px
    speed: Math.random() * 2 + 3, // Between 3s and 5s
    color: `hsl(${Math.random() * 60 + 220}, 70%, 60%)`, // Shades of indigo and purple
  }));

  return (
    <Layout
      title="Page Not Found - DevExCode"
      description="The page you are looking for does not exist. Return to the homepage to explore Leetcode solutions, system design guides, and 10-minute learn topics."
    >
      <Head>
        <meta name="robots" content="noindex" />
        <meta property="og:title" content="Page Not Found - DevExCode" />
        <meta
          property="og:description"
          content="The page you are looking for does not exist. Return to the homepage to explore Leetcode solutions, system design guides, and 10-minute learn topics."
        />
        <meta property="og:url" content={`${baseUrl}/404`} />
        <meta property="og:image" content={`${baseUrl}/og-image.jpg`} />
        <meta name="twitter:title" content="Page Not Found - DevExCode" />
        <meta
          name="twitter:description"
          content="The page you are looking for does not exist. Return to the homepage to explore Leetcode solutions, system design guides, and 10-minute learn topics."
        />
        <meta name="twitter:image" content={`${baseUrl}/twitter-image.jpg`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Page Not Found",
                "url": `${baseUrl}/404`,
                "description": "The page you are looking for does not exist on DevExCode.",
                "publisher": { "@type": "Organization", "name": "DevExCode Team" },
              })
            ),
          }}
        />
      </Head>

      <section className="py-8 bg-gray-50 dark:bg-slate-900 min-h-[calc(100vh-300px)] flex items-center justify-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div className="space-y-8">
            {/* Book Icon with subtle bounce */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 20 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <BookOpenIcon
                className="w-24 h-24 text-indigo-600 dark:text-indigo-400 mx-auto"
                aria-hidden="true"
              />
            </motion.div>

            {/* Glitchy 404 Text */}
            <motion.h1
              variants={glitchVariants}
              initial="hidden"
              animate={["visible", "glitch"]}
              className="text-6xl sm:text-8xl font-extrabold text-gray-900 dark:text-white relative"
            >
              404
            </motion.h1>

            {/* Subtitle with Refined Glitch Effect */}
            <motion.h2
              variants={subtitleGlitchVariants}
              initial="hidden"
              animate={["visible", "glitch"]}
              className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200"
            >
              Page Not Found
            </motion.h2>

            {/* Description with Typing Effect */}
            <motion.p
              variants={descriptionVariants}
              initial="hidden"
              animate="visible"
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              <TypingText text="Lost in the Code Void? Let's Navigate Back to Reality!" />
            </motion.p>

            {/* Back to Home Button */}
            <motion.div
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-lg font-semibold"
                aria-label="Return to homepage"
              >
                Back to Home
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Code Particles */}
        {particles.map((particle, i) => (
          <CodeParticle
            key={i}
            delay={particle.delay}
            xStart={particle.xStart}
            yStart={particle.yStart}
            size={particle.size}
            speed={particle.speed}
            color={particle.color}
          />
        ))}
      </section>
    </Layout>
  );
}