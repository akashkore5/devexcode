import top100liked from "../../../data/top100liked.json";
import Top100LikedClient from "./Top100LikedClient";

import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Top 100 Liked LeetCode Questions - Interview Prep | DevExCode",
  description: "Master the Top 100 Liked LeetCode questions with optimal solutions in Java, Python, and C++. The highest-yield coding interview problems on DevExCode.",
  canonicalPath: "/leetcode/top100liked",
  keywords: ["top 100 liked", "leetcode top 100", "coding interview", "faang prep", "devexcode"],
});

export default async function Top100LikedPage() {
  const totalQuestions = top100liked.reduce(
    (sum, section) => sum + section.questions.length,
    0
  );

  return <Top100LikedClient top100liked={{ sections: top100liked }} totalQuestions={totalQuestions} />;
}