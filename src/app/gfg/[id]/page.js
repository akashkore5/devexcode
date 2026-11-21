import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfgProblems from "../../../data/gfgproblems.json";
import GfgDetailClient from "./GfgDetailClient";
import { notFound } from "next/navigation";
import { getGfgContentIds, hasGfgContent } from "@/lib/content-index";

export async function generateStaticParams() {
  // Only ids with a real body — excludes the 87 failed-generation stubs.
  return [...getGfgContentIds()].map((id) => ({ id }));
}

// Anything outside that set is a 404, not an on-demand render.
export const dynamicParams = false;

import { constructMetadata, constructTechArticleSchema } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { id } = await params;
  if (!hasGfgContent(id)) return { title: "Problem Not Found | DevExCode" };
  const problem = gfgProblems.find((p) => p.id === id);
  const title = `${id}. ${problem?.title || "Problem Solution"} - GeeksforGeeks Solution | DevExCode`;
  const description = `Optimized solution, complexity analysis, and approach for GeeksforGeeks problem ${id} (${problem?.title || "Problem"}) in Java, Python, and C++ on DevExCode.`;
  return constructMetadata({
    title,
    description,
    canonicalPath: `/gfg/${id}`,
    keywords: [problem?.title || '', `GFG ${id}`, 'geeksforgeeks solution', 'coding interview', 'devexcode'],
    ogType: 'article',
  });
}

export default async function Page({ params }) {
  const { id } = await params;
  
  // 2,319 catalogue ids have no markdown at all and 87 more are generation
  // stubs. These used to render a bare div with HTTP 200, a self-canonical and
  // full TechArticle JSON-LD — soft 404s submitted to the sitemap.
  if (!hasGfgContent(id)) {
    notFound();
  }

  try {
    const filePath = path.join(process.cwd(), "gfgblogs", `${id}.md`);
    
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

    const techArticleJsonLd = constructTechArticleSchema({
      title: `${id}. ${problem?.title || "Problem Solution"} - GeeksforGeeks Solution`,
      description: `Optimized solution and explanation for GeeksforGeeks problem ${id} on DevExCode.`,
      url: `https://www.devexcode.com/gfg/${id}`,
    });

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleJsonLd) }}
        />
        <GfgDetailClient 
          id={id}
          frontMatter={{ ...data, gfgUrl, id }}
          contentHtml={contentHtml}
          codeBlocks={codeBlocks}
        />
      </>
    );
  } catch (error) {
    console.error(`Error loading GFG problem ${id}:`, error);
    // Rethrow so notFound() still works and real failures return 500, not 200.
    throw error;
  }
}
