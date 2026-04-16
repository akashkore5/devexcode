import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import JavaArticleClient from "./JavaArticleClient";
import javaTopics from "../../../../data/java_topics.json";

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  // Try dailyblogsjava first
  let filePath = path.join(process.cwd(), "dailyblogsjava", `${id}.md`);
  
  // If not there, search src/content/interview-prep/java recursively
  if (!fs.existsSync(filePath)) {
    const interviewBase = path.join(process.cwd(), "src/content/interview-prep/java");
    const categories = fs.readdirSync(interviewBase);
    
    for (const cat of categories) {
      const potentialPath = path.join(interviewBase, cat, `${id}.md`);
      if (fs.existsSync(potentialPath)) {
        filePath = potentialPath;
        break;
      }
    }
  }

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);
    return {
      title: `${data.title || "Java Guide"} | DevExCode`,
      description: data.description || "Learn Java with DevExCode.",
    };
  } catch (e) {
    const allTopics = javaTopics.topics.flatMap((t) => [t, ...t.subtopics]);
    const currentTopic = allTopics.find((t) => t.id === id);
    if (currentTopic) {
      return {
        title: `${currentTopic.title} | DevExCode`,
        description: currentTopic.description || "Learn Java with DevExCode.",
      };
    }
    return { title: "Java Learning | DevExCode" };
  }
}

export default async function JavaArticlePage({ params }) {
  const { id } = await params;
  
  // Try dailyblogsjava first
  let filePath = path.join(process.cwd(), "dailyblogsjava", `${id}.md`);
  
  // If not there, search src/content/interview-prep/java recursively
  if (!fs.existsSync(filePath)) {
    const interviewBase = path.join(process.cwd(), "src/content/interview-prep/java");
    try {
      const categories = fs.readdirSync(interviewBase);
      for (const cat of categories) {
        const potentialPath = path.join(interviewBase, cat, `${id}.md`);
        if (fs.existsSync(potentialPath)) {
          filePath = potentialPath;
          break;
        }
      }
    } catch (err) {
      console.error("Error reading interview base directory:", err);
    }
  }
  
  let frontmatter, content;
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content: markdownContent } = matter(fileContent);
    frontmatter = {
      title: data.title || "Untitled",
      description: data.description || "Comprehensive guide for Java developers.",
      difficulty: data.difficulty || "Unknown",
      tags: data.tags || [],
      date: data.date || new Date().toISOString(),
      author: data.author || "DevExCode Team",
      category: data.category || "Java",
    };
    content = markdownContent;
  } catch (error) {
    const allTopics = javaTopics.topics.flatMap((t) => [t, ...t.subtopics]);
    const currentTopic = allTopics.find((t) => t.id === id);
    if (!currentTopic) {
      notFound();
    }
    frontmatter = {
      title: currentTopic.title || "Untitled",
      description: currentTopic.description || "Comprehensive guide for Java developers.",
      difficulty: currentTopic.difficulty || "Unknown",
      tags: currentTopic.tags || [],
      date: new Date().toISOString(),
      author: "DevExCode Team",
      category: "Java",
    };
    content = `## Placeholder Content\n\nThis Java topic blog is under construction. Please check back later.`;
  }

  const allTopics = javaTopics.topics.flatMap((t) => [t, ...t.subtopics]);
  const currentTopic = allTopics.find((t) => t.id === id) || {};
  let relatedTopics = [];

  const parentTopic = javaTopics.topics.find((t) =>
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
    const topic = javaTopics.topics.find((t) => t.id === id);
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

  return <JavaArticleClient frontmatter={frontmatter} content={content} relatedTopics={relatedTopics} />;
}
