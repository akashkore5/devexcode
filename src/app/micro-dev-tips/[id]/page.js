import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import Script from "next/script";
import MicroDevTipsDetailClient from "./MicroDevTipsDetailClient";
import devTips from "../../../data/micro_dev_tips.json";

import { constructMetadata } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const filePath = path.join(process.cwd(), "dailyblogtips", `${id}.md`);

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);
    const title = `${data.title || "Dev Tip"} | DevExCode`;
    const description = data.description || `Learn ${data.title || "this tip"} with actionable examples on DevExCode.`;
    const tags = Array.isArray(data.tags) ? data.tags : [];
    return constructMetadata({
      title,
      description,
      canonicalPath: `/micro-dev-tips/${id}`,
      keywords: ['devexcode', 'dev tips', ...tags],
      ogType: 'article',
    });
  } catch (e) {
    const currentTip = devTips.find((t) => String(t.id) === id);
    if (currentTip) {
      const description = currentTip.description || `Learn ${currentTip.title} with actionable tips and examples on DevExCode.`;
      const tags = Array.isArray(currentTip.tags) ? currentTip.tags : [];
      return constructMetadata({
        title: `${currentTip.title} | DevExCode`,
        description,
        canonicalPath: `/micro-dev-tips/${id}`,
        keywords: ['devexcode', 'dev tips', ...tags],
        ogType: 'article',
      });
    }
    return constructMetadata({
      title: "Micro Dev Tip | DevExCode",
      description: "Actionable engineering tip on DevExCode.",
      canonicalPath: `/micro-dev-tips/${id}`,
    });
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    keywords: Array.isArray(frontmatter.tags) ? frontmatter.tags.join(', ') : '',
    author: { "@type": "Organization", name: "DevExCode" },
    publisher: {
      "@type": "Organization",
      name: "DevExCode",
      logo: { "@type": "ImageObject", url: "https://devexcode.com/favicon.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://devexcode.com/micro-dev-tips/${id}` },
  };

  return (
    <>
      <Script
        id={`blog-schema-${id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <MicroDevTipsDetailClient frontmatter={frontmatter} content={content} relatedTips={relatedTips} />
    </>
  );
}
