import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { redirect } from "next/navigation";
import ProblemPageClient from "./ProblemPageClient";

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "src", "posts");
  let files;
  try {
    files = fs.readdirSync(postsDir);
  } catch (error) {
    console.error("Error reading posts directory:", error);
    files = [];
  }

  return files
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const filePath = path.join(postsDir, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);
      return {
        id: `${data.id}-${data.title.toLowerCase().replace(/\s+/g, "-")}`,
      };
    });
}

export async function generateMetadata({ params }) {
  const { id: slug } = await params;
  const id = slug.split("-")[0];
  const filePath = path.join(process.cwd(), "src", "posts", `${id}.md`);
  
  if (!fs.existsSync(filePath)) {
    return { title: "Problem Not Found - DevExCode" };
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(fileContent);

  return {
    title: `LeetCode ${data.id}: ${data.title} Solution - DevExCode`,
    description: `Master LeetCode problem ${data.id} (${data.title}) with specialized Java, C++, and Python solutions.`,
    keywords: `LeetCode ${data.id}, ${data.title}, algorithm, coding interview`,
  };
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
    const filePath = path.join(process.cwd(), "src", "posts", `${id}.md`);
    if (!fs.existsSync(filePath)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Problem Not Found</h1>
            <p>The problem you are looking for does not exist.</p>
          </div>
        </div>
      );
    }
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

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