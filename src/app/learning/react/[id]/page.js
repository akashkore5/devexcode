import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import ReactArticleClient from "./ReactArticleClient";
import reactTopics from "@/data/react_topics.json";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const filePath = path.join(process.cwd(), "dailyblogsreact", `${id}.md`);
  
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);
    return {
      title: `${data.title || "React Guide"} | DevExCode`,
      description: data.description || "Learn React with DevExCode.",
    };
  } catch (e) {
    const allTopics = reactTopics.topics.flatMap((t) => [t, ...t.subtopics]);
    const currentTopic = allTopics.find((t) => t.id === id);
    if (currentTopic) {
      return {
        title: `${currentTopic.title} | DevExCode`,
        description: currentTopic.description || "Learn React with DevExCode.",
      };
    }
    return { title: "React Learning | DevExCode" };
  }
}

export default async function ReactArticlePage({ params }) {
  const { id } = await params;
  const filePath = path.join(process.cwd(), "dailyblogsreact", `${id}.md`);
  
  let frontmatter, content;
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content: markdownContent } = matter(fileContent);
    frontmatter = {
      title: data.title || "Untitled",
      description: data.description || "Comprehensive guide for React developers.",
      difficulty: data.difficulty || "Unknown",
      tags: data.tags || [],
      date: data.date || new Date().toISOString(),
      author: data.author || "DevExCode Team",
      category: data.category || "React",
    };
    content = markdownContent;
  } catch (error) {
    const allTopics = reactTopics.topics.flatMap((t) => [t, ...t.subtopics]);
    const currentTopic = allTopics.find((t) => t.id === id);
    if (!currentTopic) {
      notFound();
    }
    frontmatter = {
      title: currentTopic.title || "Untitled",
      description: currentTopic.description || "Comprehensive guide for React developers.",
      difficulty: currentTopic.difficulty || "Unknown",
      tags: currentTopic.tags || [],
      date: new Date().toISOString(),
      author: "DevExCode Team",
      category: "React",
    };
    content = `## Placeholder Content\n\nThis React topic blog is under construction. Please check back later.`;
  }

  const allTopics = reactTopics.topics.flatMap((t) => [t, ...t.subtopics]);
  const currentTopic = allTopics.find((t) => t.id === id) || {};
  let relatedTopics = [];

  const parentTopic = reactTopics.topics.find((t) =>
    t.subtopics.some((sub) => sub.id === id)
  );

  if (parentTopic) {
    relatedTopics = [
      { id: parentTopic.id, title: parentTopic.title },
      ...parentTopic.subtopics
        .filter((sub) => sub.id !== id)
        .map((sub) => ({ id: sub.id, title: sub.title })),
    ];
  } else {
    const topic = reactTopics.topics.find((t) => t.id === id);
    if (topic && topic.subtopics.length > 0) {
      relatedTopics = topic.subtopics.map((sub) => ({
        id: sub.id,
        title: sub.title,
      }));
    } else {
      relatedTopics = allTopics
        .filter(
          (t) =>
            t.id !== id &&
            t.tags.some((tag) => currentTopic?.tags?.includes(tag))
        )
        .slice(0, 5)
        .map((t) => ({ id: t.id, title: t.title }));
    }
  }

  return <ReactArticleClient frontmatter={frontmatter} content={content} relatedTopics={relatedTopics} />;
}
