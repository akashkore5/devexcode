import leetcode150 from "../../../data/leetcode150.json";
import LeetCode150Client from "./LeetCode150Client";

import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Top Interview 150 Study Plan - LeetCode Mastery | DevExCode",
  description: "Master the Top Interview 150 Study Plan with curated coding problems in Java, Python, and C++ to ace FAANG and top-tier technical interviews on DevExCode.",
  canonicalPath: "/leetcode/leetcode150",
  keywords: ["leetcode 150", "top interview 150", "study plan", "coding interview", "faang prep", "devexcode"],
});

export default async function LeetCode150Page() {
  const totalQuestions = leetcode150.reduce(
    (sum, section) => sum + section.questions.length,
    0
  );

  return <LeetCode150Client leetcode150={leetcode150} totalQuestions={totalQuestions} />;
}