import leetcode75 from "../../../data/leetcode75.json";
import LeetCode75Client from "./LeetCode75Client";

export const metadata = {
  title: "LeetCode 75 Study Plan - DevExCode",
  description: "Master the LeetCode 75 Study Plan with 75 essential coding problems to ace technical interviews. Organized by topics like Array, Two Pointers, and Dynamic Programming.",
};

export default async function LeetCode75Page() {
  const totalQuestions = leetcode75.sections.reduce(
    (sum, section) => sum + section.questions.length,
    0
  );

  return <LeetCode75Client leetcode75={leetcode75} totalQuestions={totalQuestions} />;
}