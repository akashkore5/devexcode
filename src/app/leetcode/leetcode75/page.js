import leetcode75 from "../../../data/leetcode75.json";
import LeetCode75Client from "./LeetCode75Client";

import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "LeetCode 75 Study Plan - Essential Interview Prep | DevExCode",
  description: "Master the LeetCode 75 Study Plan with 75 essential coding problems in Java, Python, and C++. Organized by Array, Two Pointers, Trees, and Dynamic Programming.",
  canonicalPath: "/leetcode/leetcode75",
  keywords: ["leetcode 75", "study plan", "coding interview", "faang prep", "devexcode"],
});

export default async function LeetCode75Page() {
  const totalQuestions = leetcode75.sections.reduce(
    (sum, section) => sum + section.questions.length,
    0
  );

  return <LeetCode75Client leetcode75={leetcode75} totalQuestions={totalQuestions} />;
}