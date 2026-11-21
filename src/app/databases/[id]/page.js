import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import databaseTopics from "@/data/database_topics.json";
import DatabaseDetailClient from "./DatabaseDetailClient";
import { constructMetadata } from "@/lib/seo";

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

  return constructMetadata({
    title: `${title} - Database Architecture Guide | DevExCode`,
    description: `Learn ${title} in our comprehensive database engineering and query optimization guide on DevExCode.`,
    canonicalPath: `/databases/${id}`,
    keywords: [title, 'database architecture', 'SQL', 'NoSQL', 'query optimization', 'devexcode'],
    ogType: 'article',
  });
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
      // No markdown for this id. This used to serve ~15 words of "coming soon"
      // at HTTP 200 with a self-canonical and an indexable title built from the
      // raw id, so any arbitrary URL minted a thin indexable page.
      notFound();
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
    // notFound() signals via a thrown error, so a bare catch here swallowed it
    // and served the page anyway. Rethrow: Next turns control-flow errors into
    // the right status, and a genuine failure becomes a 500 rather than a
    // 200 that says "Error loading topic".
    console.error(`Error loading database topic ${id}:`, error);
    throw error;
  }
}
