import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfgProblems from "../../../data/gfgproblems.json";
import GfgDetailClient from "./GfgDetailClient";

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "gfgblogs");
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir);
  return files
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => ({
      id: filename.replace(".md", ""),
    }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const problem = gfgProblems.find((p) => p.id === id);
  return {
    title: `${id}. ${problem?.title || "GFG Solution"} | DevExCode`,
    description: `Optimized solution and explanation for GeeksforGeeks problem ${id}.`,
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  
  try {
    const filePath = path.join(process.cwd(), "gfgblogs", `${id}.md`);
    if (!fs.existsSync(filePath)) {
      return <div>Problem Not Found</div>;
    }
    
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    // Extract code blocks
    const langs = ["java", "cpp", "python"];
    const codeBlocks = {};
    langs.forEach((lang) => {
      const regex = new RegExp(`\`\`\`${lang}\n([\\s\\S]*?)\n\`\`\``, "i");
      const match = content.match(regex);
      codeBlocks[lang] = match ? match[1].trim() : "";
    });

    // Process explanation
    const explanationContent = content.split(/```[a-z]+/i)[0].trim();
    const processedContent = await remark().use(html).process(explanationContent);
    const contentHtml = processedContent.toString();

    const problem = gfgProblems.find((p) => p.id === id);
    const gfgUrl = problem?.url || `https://www.geeksforgeeks.org/problems/problem-${id}/1`;

    return (
      <GfgDetailClient 
        id={id}
        frontMatter={{ ...data, gfgUrl, id }}
        contentHtml={contentHtml}
        codeBlocks={codeBlocks}
      />
    );
  } catch (error) {
    console.error(`Error loading GFG problem ${id}:`, error);
    return <div>Error loading problem.</div>;
  }
}
