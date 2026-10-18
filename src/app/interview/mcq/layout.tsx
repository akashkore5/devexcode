import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Technical MCQ Tests & Quizzes - Interview Practice | DevExCode",
  description: "Test your engineering knowledge with interactive multiple-choice quizzes on Java, React, SQL, System Design, and Algorithms on DevExCode.",
  canonicalPath: "/interview/mcq",
  keywords: ["technical mcq", "coding quizzes", "java mcq", "react quiz", "sql test", "interview prep", "devexcode"],
});

export default function MCQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
