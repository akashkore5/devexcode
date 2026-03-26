import leetcode150 from "../../../data/leetcode150.json";
import LeetCode150Client from "./LeetCode150Client";

export const metadata = {
  title: "LeetCode 150 Study Plan - DevExCode",
  description: "Master the LeetCode 150 Study Plan with 150 essential coding problems to ace technical interviews. Organized by topics like Array, Two Pointers, and Dynamic Programming.",
};

export default async function LeetCode150Page() {
  const totalQuestions = leetcode150.reduce(
    (sum, section) => sum + section.questions.length,
    0
  );

  return <LeetCode150Client leetcode150={leetcode150} totalQuestions={totalQuestions} />;
}