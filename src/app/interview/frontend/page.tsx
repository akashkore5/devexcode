import FrontendPrepClient from "./FrontendPrepClient";
import { ALL_TOPICS, getTopicsByPart } from "./data";

export const metadata = {
  title: "Frontend Engineering Handbook — Interview Prep | DevExCode",
  description:
    "A complete frontend engineering handbook and interview prep: 59 topics across web foundations, React, state, networking, security, performance, testing, and architecture — with worked code, live runnable demos, interview-ready Q&A, and things to remember.",
  keywords: [
    "frontend interview prep", "react interview questions", "javascript interview",
    "css interview", "typescript interview", "frontend engineering handbook",
    "web performance", "frontend system design", "devexcode frontend",
  ],
  alternates: { canonical: "https://devexcode.com/interview/frontend" },
  openGraph: {
    title: "Frontend Engineering Handbook | DevExCode",
    description: "59 topics, worked code, live runners, and interview-ready answers — learn frontend perfectly.",
    url: "https://devexcode.com/interview/frontend",
    type: "website",
  },
};

export default function FrontendPrepPage() {
  const groups = getTopicsByPart();
  const totalTopics = ALL_TOPICS.length;
  const totalQuestions = ALL_TOPICS.reduce((n, t) => n + t.interviewQA.length, 0);
  const totalRunnable = ALL_TOPICS.filter((t) => t.runnable).length;

  return (
    <FrontendPrepClient
      groups={groups}
      stats={{ totalTopics, totalParts: groups.length, totalQuestions, totalRunnable }}
    />
  );
}
