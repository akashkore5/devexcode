import top100liked from "../../../data/top100liked.json";
import Top100LikedClient from "./Top100LikedClient";

export const metadata = {
  title: "Top 100 Liked Questions - DevExCode",
  description: "Master the Top 100 Liked questions to ace technical interviews. Organized by topics like Array, Linked List, and Dynamic Programming.",
};

export default async function Top100LikedPage() {
  const totalQuestions = top100liked.reduce(
    (sum, section) => sum + section.questions.length,
    0
  );

  return <Top100LikedClient top100liked={{ sections: top100liked }} totalQuestions={totalQuestions} />;
}