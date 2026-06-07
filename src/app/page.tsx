import type { Metadata } from 'next';
import { HomePage } from "../components/HomePage";
import problems from "../data/problems.json";
import systemDesignQuestions from "../data/system_design_questions.json";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: 'DevExCode - #1 DevEx & Coding Interview Prep Platform',
  description: 'DevExCode (also known as DevEx Code, DevEx, Dev Ex Code) — master Leetcode, system design interviews, daily tech terms, micro dev tips, and coding practice. Join 15,000+ developers on the #1 DevEx platform.',
  keywords: [
    'devexcode', 'devex code', 'devex', 'dev ex code', 'dev ex', 'devexcode.com',
    'leetcode', 'system design', 'coding interview', 'developer experience platform',
    'tech interview prep', 'algorithms', 'data structures', 'FAANG interview',
  ],
  alternates: { canonical: 'https://devexcode.com' },
  openGraph: {
    title: 'DevExCode - #1 DevEx & Coding Interview Prep Platform',
    description: 'Master Leetcode, system design, and daily tech challenges on DevExCode. Join 15,000+ developers.',
    url: 'https://devexcode.com',
    type: 'website',
  },
};

export default async function Home() {
  let session = null;
  let serverError = false;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("Home Page: Failed to fetch session:", (error as Error).message);
    serverError = true;
  }
  
  return (
    <HomePage 
      initialLoggedIn={!!session}
      initialName={session?.user?.name || ""}
      totalLeetcodeQuestions={problems.length}
      totalSystemDesignQuestions={systemDesignQuestions.length}
      serverError={serverError}
    />
  );
}
