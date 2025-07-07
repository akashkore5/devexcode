import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import Layout from "../components/Layout";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Privacy() {
  const tocRef = useRef(null);

  // Sections for Table of Contents
  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "information-collected", title: "Information We Collect" },
    { id: "information-use", title: "How We Use Your Information" },
    { id: "information-sharing", title: "Sharing Your Information" },
    { id: "data-security", title: "Data Security" },
    { id: "your-rights", title: "Your Rights" },
    { id: "cookies", title: "Cookies and Tracking Technologies" },
    { id: "data-retention", title: "Data Retention" },
    { id: "third-party-services", title: "Third-Party Services" },
    { id: "international-transfers", title: "International Data Transfers" },
    { id: "childrens-privacy", title: "Children’s Privacy" },
    { id: "changes", title: "Changes to This Policy" },
    { id: "contact", title: "Contact Us" },
  ];

  return (
    <Layout
      title="Privacy Policy - DevExCode"
      description="Learn how DevExCode collects, uses, protects, and shares your personal information in our comprehensive Privacy Policy."
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl p-6 md:p-10 max-w-5xl mx-auto my-0"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Table of Contents */}
          <nav
            ref={tocRef}
            className="md:w-1/4 md:sticky md:top-24 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto"
            aria-label="Table of Contents"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Table of Contents
            </h2>
            <ul className="space-y-2 text-sm">
              {sections.map((section) => (
                <li key={section.id}>
                  <Link
                    href={`#${section.id}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    {section.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Content */}
          <article className="md:w-3/4 prose dark:prose-invert prose-lg text-gray-700 dark:text-gray-200 max-w-none">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
              Privacy Policy
            </h1>
            <p className="text-lg italic text-gray-600 dark:text-gray-400 mb-10">
              Last Updated: May 9, 2025
            </p>

            {/* Introduction */}
            <Section id="introduction" title="Introduction">
              <p>
                At DevExCode, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal information when you use our website, services, and platform (collectively, the “Service”). By accessing or using the Service, you agree to the terms of this Privacy Policy.
              </p>
              <p>
                We aim to be transparent about our data practices and comply with applicable data protection laws, including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
              </p>
            </Section>

            {/* Information We Collect */}
            <Section id="information-collected" title="Information We Collect">
              <p>We collect information to provide and improve the Service. The types of information we may collect include:</p>
              <ul>
                <li>
                  <strong>Personal Information:</strong> Information you provide during account creation, such as your name, email address, and optional details like phone number or profile preferences.
                </li>
                <li>
                  <strong>Authentication Data:</strong> Credentials used for account access, including hashed passwords or OAuth tokens from third-party providers (e.g., Google).
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about your interactions with the Service, such as pages visited, features used, time spent, and IP address.
                </li>
                <li>
                  <strong>Cookies and Tracking Technologies:</strong> Data stored on your device to enhance functionality, such as remembering your theme preference (light/dark mode) or session state.
                </li>
                <li>
                  <strong>Communication Data:</strong> Information you provide when contacting us, such as inquiries sent to our support team or feedback forms.
                </li>
              </ul>
              <p>
                You may choose not to provide certain information, but this may limit your ability to use some features of the Service.
              </p>
            </Section>

            {/* How We Use Your Information */}
            <Section id="information-use" title="How We Use Your Information">
              <p>We use your information to:</p>
              <ul>
                <li>Deliver and maintain the Service, including user accounts and personalized content.</li>
                <li>Enhance your experience by tailoring features, such as recommending relevant coding challenges or system design resources.</li>
                <li>Communicate with you, including sending account-related notifications, responding to inquiries, and providing updates about the Service.</li>
                <li>Analyze usage patterns to improve performance, security, and user satisfaction.</li>
                <li>Comply with legal obligations, such as responding to lawful requests or protecting our rights.</li>
              </ul>
              <p>
                We process your data based on your consent, the necessity to perform our contract with you, or our legitimate interests (e.g., improving the Service).
              </p>
            </Section>

            {/* Sharing Your Information */}
            <Section id="information-sharing" title="Sharing Your Information">
              <p>
                We do not sell, trade, or rent your personal information. We may share your information in the following circumstances:
              </p>
              <ul>
                <li>
                  <strong>Service Providers:</strong> With trusted third parties who assist in operating the Service (e.g., hosting providers, analytics services, email delivery) under strict confidentiality agreements.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law, court order, or government authority, or to protect our rights, property, or safety.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, with notice to you and appropriate safeguards.
                </li>
              </ul>
              <p>
                Any third parties we share data with are contractually obligated to protect your information and use it only for the purposes we specify.
              </p>
            </Section>

            {/* Data Security */}
            <Section id="data-security" title="Data Security">
              <p>
                We implement industry-standard security measures to protect your data, including:
              </p>
              <ul>
                <li>Encryption of sensitive data (e.g., passwords, authentication tokens) in transit (TLS/SSL) and at rest.</li>
                <li>Access controls to limit data access to authorized personnel only.</li>
                <li>Regular security assessments and updates to address vulnerabilities.</li>
              </ul>
              <p>
                Despite our efforts, no system is entirely secure. In the event of a data breach, we will notify affected users promptly and take appropriate measures to mitigate harm.
              </p>
            </Section>

            {/* Your Rights */}
            <Section id="your-rights" title="Your Rights">
              <p>
                Depending on your location and applicable laws (e.g., GDPR, CCPA), you may have the following rights:
              </p>
              <ul>
                <li>
                  <strong>Access:</strong> Request a copy of the personal information we hold about you.
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate or incomplete data.
                </li>
                <li>
                  <strong>Deletion:</strong> Request the deletion of your personal information, subject to legal obligations.
                </li>
                <li>
                  <strong>Restriction:</strong> Limit how we process your data in certain circumstances.
                </li>
                <li>
                  <strong>Portability:</strong> Receive your data in a structured, machine-readable format.
                </li>
                <li>
                  <strong>Objection:</strong> Object to processing based on legitimate interests or for direct marketing.
                </li>
                <li>
                  <strong>Opt-Out:</strong> Opt out of non-essential data collection, such as cookies or analytics.
                </li>
              </ul>
              <p>
                To exercise these rights, contact us at{" "}
                <a
                  href="mailto:support@devexcode.com"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  support@devexcode.com
                </a>
                . We will respond within 30 days (or as required by law) and may verify your identity to protect your data.
              </p>
            </Section>

            {/* Cookies and Tracking Technologies */}
            <Section id="cookies" title="Cookies and Tracking Technologies">
              <p>
                We use cookies and similar technologies (e.g., local storage) to:
              </p>
              <ul>
                <li>Maintain user sessions and authentication.</li>
                <li>Store preferences, such as light/dark mode or language settings.</li>
                <li>Analyze usage through anonymized analytics (e.g., page views, click events).</li>
              </ul>
              <p>
                You can manage cookies via your browser settings or our cookie consent tool (if applicable). Disabling cookies may affect the functionality of the Service.
              </p>
            </Section>

            {/* Data Retention */}
            <Section id="data-retention" title="Data Retention">
              <p>
                We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, including:
              </p>
              <ul>
                <li>Maintaining active user accounts.</li>
                <li>Complying with legal obligations (e.g., tax or audit requirements).</li>
                <li>Resolving disputes or enforcing agreements.</li>
              </ul>
              <p>
                Inactive accounts may be deleted after 2 years of inactivity, and usage data may be anonymized for analytics. You may request deletion earlier, subject to legal requirements.
              </p>
            </Section>

            {/* Third-Party Services */}
            <Section id="third-party-services" title="Third-Party Services">
              <p>
                The Service may integrate with third-party services, such as:
              </p>
              <ul>
                <li>Authentication providers (e.g., Google OAuth).</li>
                <li>Analytics tools (e.g., Vercel Speed Insights).</li>
                <li>Communication platforms (e.g., Gmail for email delivery).</li>
              </ul>
              <p>
                These services have their own privacy policies, and we encourage you to review them. We ensure that third-party providers adhere to data protection standards.
              </p>
            </Section>

            {/* International Data Transfers */}
            <Section id="international-transfers" title="International Data Transfers">
              <p>
                Your information may be transferred to and processed in countries outside your jurisdiction, including the United States, where our servers or service providers are located.
              </p>
              <p>
                We use safeguards, such as Standard Contractual Clauses (SCCs), to ensure that international transfers comply with data protection laws like GDPR. By using the Service, you consent to such transfers where permitted by law.
              </p>
            </Section>

            {/* Children’s Privacy */}
            <Section id="childrens-privacy" title="Children’s Privacy">
              <p>
                The Service is not intended for individuals under the age of 13 (or 16 in certain jurisdictions, per GDPR). We do not knowingly collect personal information from children.
              </p>
              <p>
                If we learn that a child has provided personal information, we will delete it promptly. Parents or guardians can contact us at{" "}
                <a
                  href="mailto:support@devexcode.com"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  support@devexcode.com
                </a>{" "}
                to address any concerns.
              </p>
            </Section>

            {/* Changes to This Policy */}
            <Section id="changes" title="Changes to This Policy">
              <p>
                We may update this Privacy Policy to reflect changes in our practices, legal requirements, or Service features. Updates will be posted on this page with an updated “Last Updated” date.
              </p>
              <p>
                For significant changes, we may notify you via email or a prominent notice on the Service. We encourage you to review this policy periodically.
              </p>
            </Section>

            {/* Contact Us */}
            <Section id="contact" title="Contact Us">
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:support@devexcode.com"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  support@devexcode.com
                </a>
              </p>
              <p>
                <strong>Address:</strong> DevExCode, Pune Maharashtra, India.
              </p>
              <p>
                We are committed to addressing your inquiries promptly and working with you to resolve any privacy-related issues.
              </p>
            </Section>
          </article>
        </div>
      </motion.div>
    </Layout>
  );
}

// Reusable Section Component with Animation
function Section({ id, title, children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.section
      id={id}
      ref={ref}
      role="region"
      aria-labelledby={`${id}-heading`}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="mb-10"
    >
      <h2
        id={`${id}-heading`}
        className="text-2xl font-semibold text-gray-900 dark:text-white mb-4"
      >
        {title}
      </h2>
      {children}
    </motion.section>
  );
}