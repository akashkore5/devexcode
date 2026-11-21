import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { redirect } from "next/navigation";
import ProblemPageClient from "./ProblemPageClient";
import { DataService } from "../../../lib/data-service";

// One definition of the slug shape, shared by generateStaticParams, the
// canonical URL and the sitemap.
const canonicalSlug = (title) =>
  String(title).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "src", "posts", "leetcode");
  let files;
  try {
    if (fs.existsSync(postsDir)) {
      files = fs.readdirSync(postsDir);
    } else {
      files = [];
    }
  } catch (error) {
    console.error("Error reading posts directory:", error);
    files = [];
  }

  // Combine MD files and problems from JSON for potential static params
  const mdParams = files
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const filePath = path.join(postsDir, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);
      return {
        // Must match the sitemap/canonical slug exactly. Without the
        // [^a-z0-9-] strip, 38 problems prerendered under a second URL
        // ("118-pascal's-triangle" vs "118-pascals-triangle"), and one
        // ("1393-capital-gain/loss") contained a slash, which can never
        // match a single dynamic segment.
        id: `${data.id}-${canonicalSlug(data.title)}`,
      };
    });

  const problems = await DataService.getProblems();
  const jsonParams = problems.map(p => ({
    id: `${p.id}-${canonicalSlug(p.title)}`
  }));

  // Merge unique IDs
  const allParams = [...mdParams, ...jsonParams];
  const uniqueParams = Array.from(new Set(allParams.map(p => p.id)))
    .map(id => allParams.find(p => p.id === id));

  return uniqueParams;
}

import { constructMetadata, constructTechArticleSchema } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { id: slug } = await params;
  const id = slug.split("-")[0];
  const filePath = path.join(process.cwd(), "src", "posts", "leetcode", `${id}.md`);
  
  let title = `LeetCode ${id} Solution | DevExCode`;
  let description = `Master LeetCode problem ${id} with optimized Java, C++, and Python solutions, complexity analysis, and interview takeaways on DevExCode.`;
  let tags = ['leetcode', 'algorithms', 'coding interview'];
  let canonicalId = null;

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    canonicalId = `${data.id}-${canonicalSlug(data.title)}`;
    title = `LeetCode ${data.id}: ${data.title} Solution | DevExCode`;
    description = `Master LeetCode problem ${data.id} (${data.title}) with specialized Java, C++, and Python solutions, time & space complexity, and interview patterns.`;
    if (data.tags) tags = [...tags, ...data.tags];
  } else {
    const problem = await DataService.getProblemById(id);
    if (problem) {
      canonicalId = `${problem.id}-${canonicalSlug(problem.title)}`;
      title = `LeetCode ${problem.id}: ${problem.title} Solution | DevExCode`;
      description = `Practice and solve LeetCode ${problem.id} (${problem.title}) in Java, Python, and C++. Optimized algorithm walkthrough and interview prep on DevExCode.`;
      if (problem.tags) tags = [...tags, ...problem.tags];
    }
  }

  return constructMetadata({
    title,
    description,
    // Canonical is derived from the problem record, never echoed back from the
    // request: /leetcode/1-anything used to 200 and self-canonicalise, which
    // opened an unbounded duplicate URL space.
    canonicalPath: `/leetcode/${canonicalId || slug}`,
    keywords: tags,
    ogType: 'article',
  });
}

export default async function Page({ params }) {
  const { id: slug } = await params;
  if (slug === "75") {
    redirect("/leetcode/leetcode75");
  }
  if (slug === "150") {
    redirect("/leetcode/leetcode150");
  }

  try {
    const id = slug.split("-")[0];
    const filePath = path.join(process.cwd(), "src", "posts", "leetcode", `${id}.md`);
    
    let data, content;

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const result = matter(fileContent);
      data = result.data;
      content = result.content;
    } else {
      // Fallback to JSON data
      const problem = await DataService.getProblemById(id);
      if (!problem) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Problem Not Found</h1>
              <p>The problem with ID {id} does not exist in our database.</p>
            </div>
          </div>
        );
      }
      data = {
        id: problem.id.toString(),
        title: problem.title,
        difficulty: problem.difficulty,
        tags: problem.tags || []
      };
      content = "Detailed solution explanation coming soon! You can still try solving it in the editor below.";
    }

    const langs = ["java", "cpp", "python"];
    const codeBlocks = {};

    langs.forEach((lang) => {
      const regex = new RegExp(`\`\`\`${lang}\n([\\s\\S]*?)\n\`\`\``, "i");
      const match = content.match(regex);
      codeBlocks[lang] = match ? match[1].trim() : "";
    });

    const explanationContent = content.split(/```[a-z]+/i)[0].trim();
    const processedContent = await remark().use(html).process(explanationContent);
    const contentHtml = processedContent.toString();

    const techArticleJsonLd = constructTechArticleSchema({
      title: `LeetCode ${data.id}: ${data.title} Solution`,
      description: `Master LeetCode problem ${data.id} (${data.title}) with optimized Java, C++, and Python solutions.`,
      url: `https://www.devexcode.com/leetcode/${slug}`,
      proficiencyLevel: data.difficulty === 'Easy' ? 'Beginner' : data.difficulty === 'Medium' ? 'Intermediate' : 'Advanced',
    });

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleJsonLd) }}
        />
        <ProblemPageClient 
          frontMatter={data} 
          contentHtml={contentHtml} 
          codeBlocks={codeBlocks}
          slug={slug}
        />
      </>
    );
  } catch (error) {
    console.error("Error in Page:", error);
    // Rethrow so notFound() still works and real failures return 500, not 200.
    throw error;
  }
}