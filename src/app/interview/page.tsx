import { DataService } from "../../lib/data-service";
import InterviewClient from "./InterviewClient";
import { ALL_TOPICS, getTopicsByPart } from "./frontend/data";
import fs from "fs";
import path from "path";

export const metadata = {
  title: "Interview Prep Hub - FAANG & Tech Interview Preparation | DevExCode",
  description: "Master your tech interview on DevExCode (DevEx Code). Curated Leetcode problems, Java interview questions, system design blueprints, MCQ tests, and mock interviews for FAANG, MAANG, and top tech companies.",
  keywords: [
    'devexcode interview', 'devex code interview prep', 'FAANG interview preparation',
    'tech interview prep', 'Leetcode solutions', 'Java interview questions',
    'system design interview', 'MCQ test', 'mock interview', 'coding interview',
    'software engineer interview', 'MAANG interview',
  ],
  alternates: { canonical: 'https://devexcode.com/interview' },
  openGraph: {
    title: 'Interview Prep Hub | DevExCode',
    description: 'Everything you need to ace FAANG interviews — on DevExCode.',
    url: 'https://devexcode.com/interview',
    type: 'website',
  },
};

async function getCount(filename: string) {
  try {
    const filePath = path.join(process.cwd(), "src/data", filename);
    if (!fs.existsSync(filePath)) return 0;
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return data.topics?.length || data.questions?.length || data.length || 0;
  } catch {
    return 0;
  }
}

export default async function InterviewPage() {
  const [
    javaCount,
    dbCount,
    reactCount,
    systemDesignCount,
    leetcode75Count,
    leetcode150Count,
    mcqCount
  ] = await Promise.all([
    getCount("java_topics.json"),
    getCount("database_topics.json"),
    getCount("react_topics.json"),
    getCount("system_design_questions.json"),
    Promise.resolve(75),
    Promise.resolve(150),
    getCount("mcq_topics.json")
  ]);

  const stats = {
    java: javaCount,
    database: dbCount,
    react: reactCount,
    systemDesign: systemDesignCount,
    leetcode75: leetcode75Count,
    leetcode150: leetcode150Count,
    mcq: mcqCount
  };

  const frontendGroups = getTopicsByPart();
  const frontend = {
    topics: ALL_TOPICS.length,
    parts: frontendGroups.length,
    questions: ALL_TOPICS.reduce((n, t) => n + t.interviewQA.length, 0),
    liveDemos: ALL_TOPICS.filter((t) => t.runnable).length,
    partNames: frontendGroups.map((g) => g.name),
  };

  return <InterviewClient stats={stats} frontend={frontend} />;
}
