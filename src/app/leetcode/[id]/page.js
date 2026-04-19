import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { redirect } from "next/navigation";
import ProblemPageClient from "./ProblemPageClient";
import { DataService } from "../../../lib/data-service";

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
        id: `${data.id}-${data.title.toLowerCase().replace(/\s+/g, "-")}`,
      };
    });

  const problems = await DataService.getProblems();
  const jsonParams = problems.map(p => ({
    id: `${p.id}-${p.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`
  }));

  // Merge unique IDs
  const allParams = [...mdParams, ...jsonParams];
  const uniqueParams = Array.from(new Set(allParams.map(p => p.id)))
    .map(id => allParams.find(p => p.id === id));

  return uniqueParams;
}

export async function generateMetadata({ params }) {
  const { id: slug } = await params;
  const id = slug.split("-")[0];
  const filePath = path.join(process.cwd(), "src", "posts", "leetcode", `${id}.md`);
  
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    return {
      title: `LeetCode ${data.id}: ${data.title} Solution - DevExCode`,
      description: `Master LeetCode problem ${data.id} (${data.title}) with specialized Java, C++, and Python solutions.`,
      keywords: `LeetCode ${data.id}, ${data.title}, algorithm, coding interview`,
    };
  }

  // Fallback to JSON data
  const problem = await DataService.getProblemById(id);
  if (problem) {
    return {
      title: `LeetCode ${problem.id}: ${problem.title} - DevExCode`,
      description: `Practice LeetCode problem ${problem.id} (${problem.title}). Prepare for coding interviews with DevExCode.`,
      keywords: `LeetCode ${problem.id}, ${problem.title}, practice, coding interview`,
    };
  }

  return { title: "Problem Not Found - DevExCode" };
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

    return (
      <ProblemPageClient 
        frontMatter={data} 
        contentHtml={contentHtml} 
        codeBlocks={codeBlocks} 
      />
    );
  } catch (error) {
    console.error("Error in Page:", error);
    return <div>Error loading problem. Please try again later.</div>;
  }
}