import fs from "fs";
import path from "path";
import matter from "gray-matter";
import techBattles from "../../../data/tech_battles.json";
import TechBattleDetailClient from "./TechBattleDetailClient";

export async function generateStaticParams() {
  return techBattles.map((battle) => ({
    id: battle.id.toString(),
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const battle = techBattles.find((b) => b.id.toString() === id);
  
  return {
    title: `${battle?.title || "Tech Battle"} | DevExCode`,
    description: `Compare ${battle?.title || "technology"} with a detailed analysis of features, performance, and use cases.`,
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  
  try {
    const filePath = path.join(process.cwd(), "tech_battles_blogs", `battle_${id}_blog.md`);
    let frontmatter, content;
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content: markdownContent } = matter(fileContent);
      frontmatter = data;
      content = markdownContent;
    } else {
      const currentBattle = techBattles.find((battle) => battle.id.toString() === id);
      if (!currentBattle) {
        return <div>Battle Not Found</div>;
      }
      frontmatter = {
        title: currentBattle.title || "Untitled",
        difficulty: currentBattle.difficulty || "Unknown",
        tags: currentBattle.tags || [],
        date: currentBattle.date || null,
      };
      content = `## Placeholder Content\n\nThis tech battle comparison is under construction. Please check back later.`;
    }

    const currentBattle = techBattles.find((battle) => battle.id.toString() === id) || {};
    const relatedBattles = techBattles
      .filter(
        (battle) =>
          battle.id.toString() !== id &&
          battle.tags.some((tag) => currentBattle?.tags?.includes(tag))
      )
      .slice(0, 5)
      .map((battle) => ({ id: battle.id, title: battle.title }));

    return (
      <TechBattleDetailClient 
        id={id}
        frontmatter={{
          title: frontmatter.title || currentBattle.title || "Untitled",
          difficulty: frontmatter.difficulty || currentBattle.difficulty || "Unknown",
          tags: frontmatter.tags || currentBattle.tags || [],
          date: frontmatter.date || currentBattle.date || null,
        }}
        content={content}
        relatedBattles={relatedBattles}
      />
    );
  } catch (error) {
    console.error(`Error loading tech battle ${id}:`, error);
    return <div>Error loading tech battle.</div>;
  }
}
