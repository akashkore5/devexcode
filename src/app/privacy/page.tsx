import React from 'react';
import { constructMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumb";

export const metadata = constructMetadata({
  title: "Privacy Policy | DevExCode",
  description: "DevExCode privacy policy explaining how we collect, handle, protect, and respect your personal data and developer progress.",
  canonicalPath: "/privacy",
  keywords: ["privacy policy", "data protection", "devexcode privacy"],
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: 'Privacy Policy', path: '/privacy' }]}
          className="mb-6"
        />

        <div className="mb-10 border-b border-border pb-6">
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-3">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm">
            Last updated: October 2026
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">1. Overview</h2>
            <p>
              Your privacy is paramount to DevExCode. This Privacy Policy describes how DevExCode (&apos;we&apos;, &apos;our&apos;, or &apos;us&apos;) collects, uses, and safeguards information when you visit devexcode.com or use our coding interview preparation tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">2. Information We Collect</h2>
            <p>
              We collect minimal information necessary to deliver our developer tools:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Account Information:</strong> Name, email address, and authentication provider details when you register or sign in.</li>
              <li><strong>Progress Telemetry:</strong> Problems solved, bookmarks, tags, and quiz responses to track your interview prep progress.</li>
              <li><strong>Technical Data:</strong> Browser type, operating system, and anonymized performance metrics through Vercel Speed Insights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">3. How We Use Your Data</h2>
            <p>
              Your information is used strictly to provide, maintain, and improve our services, track your learning progress, and send optional technical newsletters or security alerts. We do not sell your personal information to third parties or advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">4. Cookies & Local Storage</h2>
            <p>
              We use secure session cookies for authentication (NextAuth.js) and local storage to save your editor preferences, dark/light theme choices, and code drafts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">5. Data Retention & Deletion</h2>
            <p>
              You may request account deletion or data export at any time by contacting our support team at support@devexcode.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
