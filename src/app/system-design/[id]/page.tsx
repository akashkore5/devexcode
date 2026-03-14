import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { DataService } from "@/lib/data-service";
import SystemDesignDetailClient from "./SystemDesignDetailClient";
import { notFound } from "next/navigation";

export default async function SystemDesignDetailPage({ params }: { params: { id: string } }) {
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
        content = `# ${question.title}\n\nExcellent system design content for this topic is currently being crafted. \n\n### What to expect:\n- Architectural blueprints\n- Scalability trade-offs\n- Real-world case studies\n- Interactive diagrams\n\nStay tuned!`;
      }
    }
  } catch (error) {
    console.warn(`Error reading markdown for system design ${numericId}:`, error);
    content = `# ${question.title}\n\nContent not available yet.`;
  }

  return (
    <SystemDesignDetailClient 
      question={question}
      content={content}
      frontmatter={frontmatter}
    />
  );
}
