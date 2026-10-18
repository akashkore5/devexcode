import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { DataService } from "../../../lib/data-service";
import SystemDesignDetailClient from "./SystemDesignDetailClient";
import { notFound } from "next/navigation";

import { constructMetadata, constructTechArticleSchema } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericIdMatch = id.match(/^(\d+)/);
  if (!numericIdMatch) return { title: 'System Design Guide | DevExCode' };
  
  const numericId = numericIdMatch[1];
  const question = await DataService.getSystemDesignQuestionById(numericId);
  if (!question) return { title: 'System Design Guide | DevExCode' };

  const title = `${question.title} System Design: Architecture & Trade-offs | DevExCode`;
  const description = question.description
    ? `Master ${question.title} system design. Complete architecture blueprint, scalability trade-offs, database choices, and interview takeaways on DevExCode.`
    : `Learn how to design ${question.title} at scale. High-availability architecture, caching, microservices, and failure scenarios on DevExCode.`;

  return constructMetadata({
    title,
    description,
    canonicalPath: `/system-design/${id}`,
    keywords: [
      question.title,
      'system design',
      'architecture blueprint',
      'scalability',
      'distributed systems',
      'tech interview',
      'devexcode'
    ],
    ogType: 'article',
  });
}

export default async function SystemDesignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericIdMatch = id.match(/^(\d+)/);
  if (!numericIdMatch) notFound();
  
  const numericId = numericIdMatch[1];
  const question = await DataService.getSystemDesignQuestionById(numericId);
  
  if (!question) notFound();

  let content = "";
  let frontmatter = {};

  try {
    const postsDirectory = path.join(process.cwd(), "src/posts/system-design"); // Try src/posts/system-design
    const filePath = path.join(postsDirectory, `design_${numericId}_blog.md`);
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const matterResult = matter(fileContent);
      frontmatter = matterResult.data;
      content = matterResult.content;
    } else {
      // Fallback: try regular posts dir
      const fallbackPath = path.join(process.cwd(), "src/posts", `design_${numericId}_blog.md`);
      if (fs.existsSync(fallbackPath)) {
        const fileContent = fs.readFileSync(fallbackPath, "utf8");
        const matterResult = matter(fileContent);
        frontmatter = matterResult.data;
        content = matterResult.content;
      } else {
        content = `# ${question.title}\n\n${question.description || "The URL Preview Service is designed to provide a preview of the content contained within a given URL, allowing users to quickly understand the topic and relevance of the page without having to visit it."}\n\nExcellent system design content for this topic is currently being crafted. \n\n### What to expect:\n- Architectural blueprints\n- Scalability trade-offs\n- Real-world case studies\n- Interactive diagrams\n\nStay tuned!`;
      }
    }
  } catch (error) {
    console.warn(`Error reading markdown for system design ${numericId}:`, error);
    content = `# ${question.title}\n\n${question.description || ""}\n\nContent not available yet.`;
  }

  const techArticleJsonLd = constructTechArticleSchema({
    title: `${question.title} System Design: Architecture & Trade-offs`,
    description: question.description || `In-depth architecture and design for ${question.title}.`,
    url: `https://devexcode.com/system-design/${id}`,
    proficiencyLevel: question.difficulty === 'Easy' ? 'Beginner' : question.difficulty === 'Medium' ? 'Intermediate' : 'Advanced',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleJsonLd) }}
      />
      <SystemDesignDetailClient 
        question={question}
        content={content}
        frontmatter={frontmatter}
        slug={id}
      />
    </>
  );
}
