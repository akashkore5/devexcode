import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import TechBattlesDetailClient from "./TechBattlesDetailClient";
import techBattles from "../../../data/tech_battles.json";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const filePath = path.join(process.cwd(), "dailybattlearticles", `${id}.md`);
  
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);
    return {
      title: `${data.title || "Tech Battle"} | DevExCode`,
      description: data.description || "In-depth technical comparison and analysis with DevExCode.",
    };
  } catch (e) {
    const currentBattle = techBattles.find((t) => String(t.id) === id);
    if (currentBattle) {
      return {
        title: `${currentBattle.title} | DevExCode`,
        description: currentBattle.description || "In-depth technical comparison and analysis with DevExCode.",
      };
    }
    return { title: "Tech Battle | DevExCode" };
  }
}

export default async function TechBattlesDetailPage({ params }) {
  const { id } = await params;
  const filePath = path.join(process.cwd(), "dailybattlearticles", `${id}.md`);
  
  let frontmatter, content;
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content: markdownContent } = matter(fileContent);
    frontmatter = {
      title: data.title || "Untitled",
      description: data.description || "Technical comparison and battle analysis.",
      difficulty: data.difficulty || "Unknown",
      tags: data.tags || [],
      date: data.date || new Date().toISOString(),
      author: data.author || "DevExCode Team",
      category: "TechBattles",
    };
    content = markdownContent;
  } catch (error) {
    const currentBattle = techBattles.find((t) => String(t.id) === id);
    if (!currentBattle) {
      notFound();
    }
    frontmatter = {
      title: currentBattle.title || "Untitled",
      description: currentBattle.description || "Technical comparison and battle analysis.",
      difficulty: currentBattle.difficulty || "Unknown",
      tags: currentBattle.tags || [],
      date: new Date().toISOString(),
      author: "DevExCode Team",
      category: "TechBattles",
    };
    content = `## Placeholder Content\n\nThis tech battle article is under construction. Please check back later.`;
  }

  const relatedBattles = techBattles
    .filter((t) => String(t.id) !== id && t.tags.some((tag) => frontmatter.tags.includes(tag)))
    .slice(0, 5)
    .map((t) => ({ id: t.id, title: t.title }));

  return <TechBattlesDetailClient frontmatter={frontmatter} content={content} relatedBattles={relatedBattles} />;
}
