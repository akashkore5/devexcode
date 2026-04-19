import fs from "fs";
import path from "path";
import matter from "gray-matter";
import databaseTopics from "../../../data/database_topics.json";
import DatabaseDetailClient from "./DatabaseDetailClient";

export async function generateStaticParams() {
  const paths = [];
  databaseTopics.topics.forEach((topic) => {
    paths.push({ id: topic.id });
    topic.subtopics.forEach((subtopic) => {
      paths.push({ id: subtopic.id });
    });
  });
  return paths;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  let title = "Database Topic";
  
  for (const topic of databaseTopics.topics) {
    if (topic.id === id) {
      title = topic.title;
      break;
    }
    const sub = topic.subtopics.find((s) => s.id === id);
    if (sub) {
      title = sub.title;
      break;
    }
  }

  return {
    title: `${title} | DevExCode`,
    description: `Learn about ${title} in our comprehensive database learning path.`,
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  
  try {
    const filePath = path.join(process.cwd(), "dailyblogsdb", `${id}.md`);
    let frontmatter, content;
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content: markdownContent } = matter(fileContent);
      frontmatter = data;
      content = markdownContent;
    } else {
      content = `## Content Coming Soon\n\nWe are working on the content for this topic. Please stay tuned!`;
      frontmatter = { title: id, difficulty: "Beginner", tags: [] };
    }

    const relatedTopics = [];
    databaseTopics.topics.forEach((topic) => {
      if (topic.id !== id) relatedTopics.push({ id: topic.id, title: topic.title });
      topic.subtopics.forEach((sub) => {
        if (sub.id !== id) relatedTopics.push({ id: sub.id, title: sub.title });
      });
    });

    return (
      <DatabaseDetailClient 
        id={id}
        frontmatter={{
          title: frontmatter.title || id,
          difficulty: frontmatter.difficulty || "Beginner",
          tags: frontmatter.tags || [],
          description: frontmatter.description || "",
          date: frontmatter.date || null
        }}
        content={content}
        relatedTopics={relatedTopics.slice(0, 10)}
      />
    );
  } catch (error) {
    console.error(`Error loading database topic ${id}:`, error);
    return <div>Error loading topic.</div>;
  }
}
