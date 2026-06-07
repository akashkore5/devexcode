import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Script from "next/script";
import { DataService } from "../../../lib/data-service";
import Learn10DetailClient from "./Learn10DetailClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const topic = await DataService.getLearn10TopicById(id);
  if (!topic) return { title: 'Engineering Brief | DevExCode' };

  return {
    title: `${topic.title} - 10-Minute Engineering Brief | DevExCode`,
    description: `Master ${topic.title} in 10 minutes on DevExCode. High-density engineering brief covering core mechanisms, trade-offs, implementation strategies, and key interview takeaways.`,
    keywords: [
      topic.title, 'devexcode', 'devex code', '10 minute brief', 'engineering concepts',
      'tech interview', 'system design', topic.category || 'software engineering',
    ].filter(Boolean),
    alternates: { canonical: `https://devexcode.com/learn10/${id}` },
    openGraph: {
      title: `${topic.title} | DevExCode`,
      description: `Learn ${topic.title} in 10 minutes. High-density engineering brief on DevExCode.`,
      url: `https://devexcode.com/learn10/${id}`,
      type: 'article',
    },
  };
}

export default async function Learn10DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = await DataService.getLearn10TopicById(id);
  
  if (!topic) notFound();

  let content = "";
  let frontmatter = {};

  try {
    const sanitizeFilename = (filename: string) => {
      return filename.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "_");
    };

    // The legacy code looks for files like: learn10/001_what_is_kafka.md
    const paddedId = id.padStart(3, "0");
    const filename = `${paddedId}_${sanitizeFilename(topic.title)}.md`;
    
    // Check various possible locations
    const possiblePaths = [
      path.join(process.cwd(), "learn10", filename),
      path.join(process.cwd(), "src/posts/learn10", filename),
      path.join(process.cwd(), "src/posts", filename)
    ];

    let found = false;
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const matterResult = matter(fileContent);
        frontmatter = matterResult.data;
        content = matterResult.content;
        found = true;
        break;
      }
    }

    if (!found) {
      // Fallback content if file doesn't exist
      content = `
# ${topic.title}

This 10-minute engineering brief is currently being optimized for high-density learning.

### In this brief:
- **Core Mechanism**: Understanding the "how" and "why" behind ${topic.title}.
- **Trade-offs**: Exploring performance, scalability, and complexity.
- **Implementation Strategy**: Best practices for real-world integration.
- **Key Takeaways**: The non-negotiable facts you need for your next interview.

> [!NOTE]
> Our engineering team is currently updating this module with the latest architectural blueprints and performance benchmarks. Check back soon for the full deep-dive.
`;
    }
  } catch (error) {
    console.warn(`Error reading markdown for learn10 topic ${id}:`, error);
    content = `# ${topic.title}\n\nTechnical brief not available yet. Our high-density learning modules are updated weekly.`;
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${topic.title} - 10-Minute Engineering Brief`,
    description: `Master ${topic.title} in 10 minutes. High-density engineering brief on DevExCode.`,
    author: { "@type": "Organization", name: "DevExCode" },
    publisher: {
      "@type": "Organization",
      name: "DevExCode",
      logo: { "@type": "ImageObject", url: "https://devexcode.com/favicon.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://devexcode.com/learn10/${id}` },
  };

  return (
    <>
      <Script
        id={`learn10-schema-${id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Learn10DetailClient
        topic={topic}
        content={content}
        frontmatter={frontmatter}
      />
    </>
  );
}
