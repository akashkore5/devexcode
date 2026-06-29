import { notFound } from "next/navigation";
import TopicDetailClient from "./TopicDetailClient";
import { getTopic, getAllTopicIds, getAdjacentTopics } from "../data";

export function generateStaticParams() {
  return getAllTopicIds().map((topicId) => ({ topicId }));
}

export async function generateMetadata({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  const topic = getTopic(topicId);
  if (!topic) return { title: "Frontend Prep | DevExCode" };
  return {
    title: `${topic.title} — Frontend Handbook | DevExCode`,
    description: topic.summary,
    keywords: topic.tags,
    alternates: { canonical: `https://devexcode.com/interview/frontend/${topic.id}` },
    openGraph: {
      title: `${topic.title} | DevExCode Frontend Handbook`,
      description: topic.summary,
      url: `https://devexcode.com/interview/frontend/${topic.id}`,
      type: "article",
    },
  };
}

export default async function TopicDetailPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  const topic = getTopic(topicId);
  if (!topic) notFound();

  const { prev, next } = getAdjacentTopics(topicId);

  return (
    <TopicDetailClient
      topic={topic}
      prev={prev ? { id: prev.id, title: prev.title } : null}
      next={next ? { id: next.id, title: next.title } : null}
    />
  );
}
