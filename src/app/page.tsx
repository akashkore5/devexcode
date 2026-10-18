import type { Metadata } from 'next';
import { HomePage } from "../components/HomePage";
import problems from "../data/problems.json";
import systemDesignQuestions from "../data/system_design_questions.json";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import { constructMetadata, constructWebSiteSchema, constructOrganizationSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: 'DevExCode - #1 DevEx & Coding Interview Prep Platform',
  description: 'Master LeetCode solutions in Java, Python, and C++, system design architecture blueprints, daily technical terms, and FAANG interview preparation on DevExCode.',
  canonicalPath: '',
  keywords: [
    'devexcode', 'devex code', 'devex', 'dev ex code', 'leetcode solutions',
    'system design interview', 'coding interview prep', 'developer experience platform',
    'algorithms', 'data structures', 'FAANG interview preparation'
  ],
});

export default async function Home() {
  let session = null;
  let serverError = false;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("Home Page: Failed to fetch session:", (error as Error).message);
    serverError = true;
  }

  const websiteSchema = constructWebSiteSchema();
  const organizationSchema = constructOrganizationSchema();
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <HomePage 
        initialLoggedIn={!!session}
        initialName={session?.user?.name || ""}
        totalLeetcodeQuestions={problems.length}
        totalSystemDesignQuestions={systemDesignQuestions.length}
        serverError={serverError}
      />
    </>
  );
}
