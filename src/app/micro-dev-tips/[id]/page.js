import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import MicroDevTipsDetailClient from "./MicroDevTipsDetailClient";
import devTips from "../../../data/micro_dev_tips.json";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const filePath = path.join(process.cwd(), "dailyblogtips", `${id}.md`);
  
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);
    return {
      title: `${data.title || "Dev Tip"} | DevExCode`,
      description: data.description || "Learn actionable development tips with DevExCode.",
    };
  } catch (e) {
    const currentTip = devTips.find((t) => String(t.id) === id);
    if (currentTip) {
      return {
        title: `${currentTip.title} | DevExCode`,
        description: currentTip.description || "Learn actionable development tips with DevExCode.",
      };
    }
    return { title: "Micro Dev Tip | DevExCode" };
  }
}

export default async function MicroDevTipsDetailPage({ params }) {
  const { id } = await params;
  const filePath = path.join(process.cwd(), "dailyblogtips", `${id}.md`);
  
  let frontmatter, content;
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content: markdownContent } = matter(fileContent);
    frontmatter = {
      title: data.title || "Untitled",
      description: data.description || "Micro development tip for developers.",
      difficulty: data.difficulty || "Unknown",
      tags: data.tags || [],
      date: data.date || new Date().toISOString(),
      author: data.author || "DevExCode Team",
      category: data.category || "DevTips",
    };
    content = markdownContent;
  } catch (error) {
    const currentTip = devTips.find((t) => String(t.id) === id);
    if (!currentTip) {
      notFound();
    }
    frontmatter = {
      title: currentTip.title || "Untitled",
      description: currentTip.description || "Micro development tip for developers.",
      difficulty: currentTip.difficulty || "Unknown",
      tags: currentTip.tags || [],
      date: new Date().toISOString(),
      author: "DevExCode Team",
      category: "DevTips",
    };
    content = `## Placeholder Content\n\nThis development tip is under construction. Please check back later.`;
  }

  const relatedTips = devTips
    .filter((t) => String(t.id) !== id && t.tags.some((tag) => frontmatter.tags.includes(tag)))
    .slice(0, 5)
    .map((t) => ({ id: t.id, title: t.title }));

  return <MicroDevTipsDetailClient frontmatter={frontmatter} content={content} relatedTips={relatedTips} />;
}
