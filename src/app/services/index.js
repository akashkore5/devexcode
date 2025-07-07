import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Layout from "../../components/Layout";
import ContactForm from "../../components/ContactForm";
import { toast, Toaster } from "react-hot-toast";
import {
  DocumentTextIcon,
  GlobeAltIcon,
  UserCircleIcon,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
  AcademicCapIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/solid";
import DOMPurify from "isomorphic-dompurify";
import { useSession } from "next-auth/react";

const COLORS = {
  primary: "#4f46e5",
  secondary: "#ec4899",
  accent: "#3b82f6",
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "DevExCode Career Services",
  url: "https://devexcode.com/services",
  description: "Elevate your career with DevExCode's professional services: resume creation, LinkedIn profile optimization, career guidance, one-on-one classes, and interview preparation.",
  publisher: {
    "@type": "Organization",
    name: "DevExCode Team",
  },
  mainEntity: [
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What services does DevExCode offer for career growth?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "DevExCode provides professional resume creation, LinkedIn optimization, resume review, career guidance, one-on-one classes, and interview preparation tailored for tech professionals.",
          },
        },
        {
          "@type": "Question",
          name: "How can I request a service?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sign in and use our contact form to request a service. Select your desired service, provide details, and our team will get back to you promptly.",
          },
        },
      ],
    },
    {
      "@type": "Service",
      name: "Career Services",
      description: "Comprehensive career services including resume creation, LinkedIn optimization, career guidance, one-on-one classes, and interview prep.",
      provider: {
        "@type": "Organization",
        name: "DevExCode",
        sameAs: "https://devexcode.com/",
      },
    },
  ],
};

const servicesData = [
  {
    title: "Professional Resume Creation",
    slug: "resume-creation",
    description: "Craft ATS-optimized resumes tailored for tech roles to stand out in job applications.",
    details: "Our experts create a professional, ATS-friendly resume highlighting your technical skills and experience. Includes custom formatting and keyword optimization.",
    timePeriod: "3-5 business days",
    pricingRange: "$50-$150", // Not displayed, for reference
    icon: <DocumentTextIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
  },
  {
    title: "Resume for Abroad Jobs",
    slug: "resume-abroad",
    description: "Design resumes optimized for international tech markets and global hiring standards.",
    details: "Tailored resumes for global job markets, adhering to international standards with region-specific formatting and cultural nuances.",
    timePeriod: "4-7 business days",
    pricingRange: "$75-$200", // Not displayed, for reference
    icon: <GlobeAltIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
  },
  {
    title: "LinkedIn Profile Optimization",
    slug: "linkedin-optimization",
    description: "Enhance your LinkedIn profile to attract recruiters and showcase your skills.",
    details: "Optimize your LinkedIn profile with a professional headline, summary, and keyword-rich content to boost visibility and recruiter engagement.",
    timePeriod: "2-4 business days",
    pricingRange: "$40-$120", // Not displayed, for reference
    icon: <UserCircleIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
  },
  {
    title: "Resume Review & Enhancement",
    slug: "resume-review",
    description: "Get expert feedback and improvements to make your resume shine.",
    details: "Detailed review with actionable feedback to improve structure, content, and impact, plus enhancements to align with industry standards.",
    timePeriod: "2-3 business days",
    pricingRange: "$30-$100", // Not displayed, for reference
    icon: <ClipboardDocumentCheckIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
  },
  {
    title: "Career Guidance",
    slug: "career-guidance",
    description: "Personalized advice on career planning, job search, and professional growth.",
    details: "One-on-one sessions to develop a career roadmap, job search strategies, and tips for long-term professional success in tech.",
    timePeriod: "1-2 sessions (1 hour each)",
    pricingRange: "$60-$150", // Not displayed, for reference
    icon: <LightBulbIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
  },
  {
    title: "One-on-One Classes",
    slug: "one-on-one",
    description: "Customized coaching on coding, system design, and technical topics for all levels.",
    details: "Personalized coaching sessions covering coding, system design, or specific technical topics, tailored to your skill level and goals.",
    timePeriod: "Customizable (1-10 sessions)",
    pricingRange: "$80-$250 per session", // Not displayed, for reference
    icon: <AcademicCapIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
  },
  {
    title: "Interview Preparation",
    slug: "interview-prep",
    description: "Comprehensive prep with mock interviews and tailored strategies for tech roles.",
    details: "Mock interviews, feedback, and strategies to excel in coding, system design, and behavioral interviews for top tech companies.",
    timePeriod: "2-5 sessions (1 hour each)",
    pricingRange: "$100-$300", // Not displayed, for reference
    icon: <CodeBracketIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />,
  },
];

export default function ServicesPage() {
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(!!session);
  const [userName, setUserName] = useState(session?.user?.name || "");
  const [selectedService, setSelectedService] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    service: "",
    message: "",
  });

  // Lazy load section
  const { ref: servicesRef, inView: servicesInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Update session state
  useEffect(() => {
    if (status === "authenticated") {
      setIsLoggedIn(true);
      setUserName(session.user.name || "User");
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
      }));
    } else {
      setIsLoggedIn(false);
      setUserName("");
      setFormData({ name: "", email: "", service: "", message: "" });
    }
  }, [status, session]);

  const openModal = (service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  const openContactForm = (service = null) => {
    if (!isLoggedIn) {
      toast.error("Please sign in to request a service.");
      return;
    }
    if (service) {
      setFormData((prev) => ({ ...prev, service: service.slug, message: `Interested in ${service.title}` }));
    }
    setShowContactForm(true);
    setSelectedService(null);
  };

  // Handle loading state
  if (status === "loading") {
    return (
      <Layout isLoggedIn={false} userName="">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
          <div className="text-center">
            <svg
              className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto"
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
            <p className="text-gray-600 dark:text-gray-300 mt-4">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isLoggedIn={isLoggedIn} userName={userName}>
      <Head>
        <title>DevExCode - Career Services</title>
        <meta
          name="description"
          content="Boost your career with professional resume creation, LinkedIn optimization, career guidance, one-on-one classes, and interview preparation services."
        />
        <meta
          name="keywords"
          content="resume creation, LinkedIn optimization, career guidance, one-on-one classes, interview preparation, resume review, abroad jobs"
        />
        <meta name="author" content="DevExCode Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="DevExCode - Career Services" />
        <meta
          property="og:description"
          content="Elevate your tech career with expert resume creation, LinkedIn optimization, personalized coaching, and interview prep."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devexcode.com/services" />
        <meta property="og:image" content="https://devexcode.com/og-image-services.jpg" />
        <meta property="og:image:alt" content="DevExCode career services" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DevExCode - Career Services" />
        <meta
          property="twitter:description"
          content="Professional resume creation, LinkedIn optimization, career guidance, and personalized coaching for tech professionals."
        />
        <meta name="twitter:image" content="https://devexcode.com/twitter-image-services.jpg" />
        <link rel="canonical" href="https://devexcode.com/services" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="theme-color" content="#4f46e5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(JSON.stringify(structuredData)),
          }}
        />
      </Head>

      <Toaster position="top-right" toastOptions={{ duration: 4000, className: "mt-16" }} />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Transform Your Tech Career
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Unlock your potential with our expert-led services: resume creation, LinkedIn optimization, career guidance, personalized coaching, and interview preparation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-x-4"
          >
            <Link href="#services" prefetch={true}>
              <motion.button
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Explore our services"
              >
                Explore Services
              </motion.button>
            </Link>
            <motion.button
              onClick={() => openContactForm()}
              className="px-8 py-4 bg-gray-200 dark:bg-slate-600 text-gray-900 dark:text-white rounded-lg text-lg font-semibold hover:bg-gray-300 dark:hover:bg-slate-500 transition shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isLoggedIn ? "Contact us" : "Sign in to contact us"}
            >
              {isLoggedIn ? "Contact Us" : "Sign In to Contact"}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Career Services Section */}
      <section id="services" ref={servicesRef} className="py-16 bg-white dark:bg-slate-800">
        {servicesInView && (
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
              Our Career Services
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesData.map((service, index) => (
                <motion.div
                  key={`service-${index}`}
                  variants={cardVariants}
                  className="p-6 bg-gray-50 dark:bg-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-indigo-200 dark:border-indigo-800 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openModal(service)}
                >
                  {service.icon}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                  <button
                    className="mt-4 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    aria-label={`Learn more about ${service.title}`}
                  >
                    Learn More
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </section>

      {/* Service Details Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-lg w-full shadow-xl"
              role="dialog"
              aria-labelledby="modal-title"
              aria-modal="true"
            >
              <h3 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedService.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedService.details}</p>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mb-4">
                Estimated Time: {selectedService.timePeriod}
              </p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-slate-500 transition"
                  onClick={closeModal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close modal"
                >
                  Close
                </motion.button>
                <motion.button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                  onClick={() => openContactForm(selectedService)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Request ${selectedService.title}`}
                >
                  Ask Enquiry
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <ContactForm
            formData={formData}
            setFormData={setFormData}
            showForm={showContactForm}
            setShowForm={setShowContactForm}
            servicesData={servicesData}
          />
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Ready to Transform Your Career?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Connect with our experts to get personalized career services and land your dream tech job.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.button
              onClick={() => openContactForm()}
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isLoggedIn ? "Contact us now" : "Sign in to contact us"}
            >
              {isLoggedIn ? "Contact Us Now" : "Sign In to Get Started"}
            </motion.button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}