import React from 'react';
import { constructMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumb";

export const metadata = constructMetadata({
  title: "Terms of Service | DevExCode",
  description: "DevExCode terms of service, platform usage guidelines, intellectual property policies, and developer community standards.",
  canonicalPath: "/terms",
  keywords: ["terms of service", "user agreement", "devexcode policies"],
});

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ name: 'Terms of Service', path: '/terms' }]}
          className="mb-6"
        />

        <div className="mb-10 border-b border-border pb-6">
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-3">
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-sm">
            Last updated: October 2026
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using DevExCode (devexcode.com), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">2. Educational & Platform Use</h2>
            <p>
              DevExCode provides technical interview preparation materials, LeetCode algorithmic solutions, system design guides, and interactive developer tools for educational and professional preparation purposes. You may access our materials for your own personal, non-commercial educational use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">3. User Accounts & Security</h2>
            <p>
              When creating an account on DevExCode, you must provide accurate and complete information. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">4. Intellectual Property</h2>
            <p>
              All original content, tutorials, architectural blueprints, diagrams, and site designs produced by DevExCode are the proprietary intellectual property of DevExCode Inc. Third-party trademarks and problem references (such as LeetCode or GeeksforGeeks) are the property of their respective trademark holders.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">5. Disclaimer of Warranties</h2>
            <p>
              The materials on DevExCode are provided on an &apos;as is&apos; basis. While we strive for accuracy and high educational quality, DevExCode makes no warranties, expressed or implied, regarding hiring guarantees or technical completeness.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">6. Contact Information</h2>
            <p>
              For questions regarding these terms, please contact us at support@devexcode.com or through our contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
