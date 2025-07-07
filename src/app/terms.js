import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import Layout from "../components/Layout";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Terms() {
  const tocRef = useRef(null);

  // Sections for Table of Contents
  const sections = [
    { id: "acceptance", title: "Acceptance of Terms" },
    { id: "use-of-service", title: "Use of the Service" },
    { id: "user-accounts", title: "User Accounts" },
    { id: "user-content", title: "User Content" },
    { id: "intellectual-property", title: "Intellectual Property" },
    { id: "payment-terms", title: "Payment Terms" },
    { id: "limitation-of-liability", title: "Limitation of Liability" },
    { id: "indemnification", title: "Indemnification" },
    { id: "termination", title: "Termination" },
    { id: "dispute-resolution", title: "Dispute Resolution" },
    { id: "governing-law", title: "Governing Law" },
    { id: "changes", title: "Changes to Terms" },
    { id: "contact", title: "Contact Us" },
  ];

  return (
    <Layout
      title="Terms of Service - DevExCode"
      description="Read DevExCode’s Terms of Service, detailing user responsibilities, acceptable use, payment terms, and legal disclaimers."
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
              Terms of Service
            </h1>
            <p className="text-lg italic text-gray-600 dark:text-gray-400 mb-10">
              Last Updated: May 9, 2025
            </p>

            {/* Acceptance of Terms */}
            <Section id="acceptance" title="Acceptance of Terms">
              <p>
                Welcome to DevExCode (the “Service”). By accessing or using the Service, you agree to be bound by these Terms of Service (“Terms”) and our <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link>. If you do not agree to these Terms, you must not use the Service.
              </p>
              <p>
                These Terms form a legally binding agreement between you and DevExCode. We may modify these Terms at any time, and your continued use of the Service after such changes constitutes acceptance of the updated Terms.
              </p>
            </Section>

            {/* Use of the Service */}
            <Section id="use-of-service" title="Use of the Service">
              <p>
                You agree to use the Service only for lawful purposes and in accordance with its intended purpose. You are responsible for complying with all applicable laws, regulations, and these Terms.
              </p>
              <p>Prohibited activities include, but are not limited to:</p>
              <ul>
                <li>Violating any local, state, national, or international law.</li>
                <li>Engaging in unauthorized access to or interference with the Service, including hacking or spreading malware.</li>
                <li>Copying, distributing, or modifying content without explicit permission.</li>
                <li>Posting or sharing content that is defamatory, obscene, harassing, or otherwise objectionable.</li>
                <li>Using automated tools (e.g., bots, scrapers) to extract data without permission.</li>
              </ul>
              <p>
                We reserve the right to investigate and take action against any violations, including suspending or terminating your access.
              </p>
            </Section>

            {/* User Accounts */}
            <Section id="user-accounts" title="User Accounts">
              <p>
                To access certain features, such as coding challenges or community forums, you must create an account. You agree to:
              </p>
              <ul>
                <li>Provide accurate, current, and complete information during registration.</li>
                <li>Maintain the confidentiality of your account credentials.</li>
                <li>Notify us immediately of any unauthorized use of your account at <a href="mailto:support@devexcode.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">support@devexcode.com</a>.</li>
              </ul>
              <p>
                You are responsible for all activities conducted under your account. We may suspend or terminate accounts that violate these Terms.
              </p>
            </Section>

            {/* User Content */}
            <Section id="user-content" title="User Content">
              <p>
                The Service may allow you to submit content, such as comments, forum posts, or solutions to coding challenges (“User Content”). By submitting User Content, you:
              </p>
              <ul>
                <li>Grant DevExCode a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display your User Content in connection with the Service.</li>
                <li>Represent that you own or have the necessary rights to your User Content and that it does not violate any laws or third-party rights.</li>
                <li>Agree not to submit content that is illegal, infringing, or harmful.</li>
              </ul>
              <p>
                We may review, moderate, or remove User Content at our discretion but are not obligated to do so. You retain ownership of your User Content, subject to the license granted.
              </p>
            </Section>

            {/* Intellectual Property */}
            <Section id="intellectual-property" title="Intellectual Property">
              <p>
                All content on the Service, including text, code, designs, logos, and multimedia (collectively, “Content”), is owned by DevExCode or its licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, or create derivative works of the Content without prior written consent, except as permitted by these Terms (e.g., sharing your own solutions with proper attribution).
              </p>
              <p>
                If you believe any Content infringes your intellectual property rights, please contact us at <a href="mailto:support@devexcode.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">support@devexcode.com</a> with details.
              </p>
            </Section>

            {/* Payment Terms */}
            <Section id="payment-terms" title="Payment Terms">
              <p>
                Certain features of the Service may require payment (e.g., premium subscriptions). By making a payment, you agree to:
              </p>
              <ul>
                <li>Provide accurate billing information and authorize charges for the selected services.</li>
                <li>Pay all applicable fees, including taxes, as described at the time of purchase.</li>
                <li>Comply with the terms of our third-party payment processor (e.g., Stripe).</li>
              </ul>
              <p>
                Payments are non-refundable except as required by law or explicitly stated in our refund policy. We may modify pricing or subscription terms with notice to you.
              </p>
            </Section>

            {/* Limitation of Liability */}
            <Section id="limitation-of-liability" title="Limitation of Liability">
              <p>
                The Service is provided on an “as is” and “as available” basis without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
              <p>
                To the fullest extent permitted by law, DevExCode, its affiliates, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, profits, or business opportunities, arising from your use of or inability to use the Service.
              </p>
              <p>
                Our total liability for any claim related to the Service shall not exceed the amount you paid us in the preceding 12 months, if any.
              </p>
            </Section>

            {/* Indemnification */}
            <Section id="indemnification" title="Indemnification">
              <p>
                You agree to indemnify, defend, and hold harmless DevExCode, its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, or expenses (including reasonable attorneys’ fees) arising from:
              </p>
              <ul>
                <li>Your use of the Service in violation of these Terms.</li>
                <li>Your User Content or its infringement of third-party rights.</li>
                <li>Your violation of any applicable law or regulation.</li>
              </ul>
              <p>
                We reserve the right to assume control of the defense of any claim for which we are entitled to indemnification, and you agree to cooperate with our defense.
              </p>
            </Section>

            {/* Termination */}
            <Section id="termination" title="Termination">
              <p>
                We may suspend or terminate your access to the Service, with or without notice, for any reason, including:
              </p>
              <ul>
                <li>Violation of these Terms or applicable laws.</li>
                <li>Engaging in activities that harm the Service or other users.</li>
                <li>Non-payment of applicable fees.</li>
              </ul>
              <p>
                Upon termination, your account and access to the Service will be deactivated, and you must cease using the Service. Provisions of these Terms that by their nature survive termination (e.g., intellectual property, limitation of liability) will remain in effect.
              </p>
            </Section>

            {/* Dispute Resolution */}
            <Section id="dispute-resolution" title="Dispute Resolution">
              <p>
                Any disputes arising from these Terms or your use of the Service shall be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration conducted by a neutral arbitrator in accordance with the rules of the American Arbitration Association (AAA).
              </p>
              <p>
                Arbitration shall take place in San Francisco, California, unless otherwise agreed. You waive any right to participate in a class action lawsuit or class-wide arbitration.
              </p>
              <p>
                Notwithstanding the above, either party may seek injunctive relief in a court of competent jurisdiction for matters involving intellectual property or confidentiality.
              </p>
            </Section>

            {/* Governing Law */}
            <Section id="governing-law" title="Governing Law">
              <p>
                These Terms and your use of the Service shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles.
              </p>
              <p>
                Any legal action arising from these Terms, other than arbitration, shall be brought exclusively in the state or federal courts located in San Francisco, California, and you consent to the jurisdiction of such courts.
              </p>
            </Section>

            {/* Changes to Terms */}
            <Section id="changes" title="Changes to Terms">
              <p>
                We may update these Terms at any time to reflect changes in our practices, legal requirements, or Service features. Updates will be posted on this page with an updated “Last Updated” date.
              </p>
              <p>
                For significant changes, we may notify you via email or a prominent notice on the Service. Your continued use of the Service after such changes constitutes acceptance of the updated Terms.
              </p>
            </Section>

            {/* Contact Us */}
            <Section id="contact" title="Contact Us">
              <p>
                If you have questions, concerns, or feedback regarding these Terms or the Service, please contact us at:
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
                <strong>Address:</strong> DevExCode, 123 Tech Lane, Suite 100, San Francisco, CA 94105, USA
              </p>
              <p>
                We are committed to addressing your inquiries promptly and working with you to resolve any issues.
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