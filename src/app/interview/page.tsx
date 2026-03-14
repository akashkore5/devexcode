import { DataService } from "@/lib/data-service";
import InterviewClient from "./InterviewClient";
import fs from "fs";
import path from "path";

export const metadata = {
  title: "Interview Prep Hub | DevExCode",
  description: "Master tech interviews with curated Leetcode sets, system design blueprints, and specialized technology deep-dives.",
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

  return <InterviewClient stats={stats} />;
}
