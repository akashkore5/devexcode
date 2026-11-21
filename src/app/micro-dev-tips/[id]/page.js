import { notFound } from "next/navigation";
import Script from "next/script";
import MicroDevTipsDetailClient from "./MicroDevTipsDetailClient";
import devTips from "../../../data/micro_dev_tips.json";

import { constructMetadata } from "@/lib/seo";
import { readTip } from "@/lib/dev-tips";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const tip = readTip(id);
  const listed = devTips.find((t) => String(t.id) === String(id));

  // Prefer the markdown H1, fall back to the catalogue entry. Only reach the
  // generic "Micro Dev Tip" title when neither source knows this id.
  const title = tip?.title || listed?.title;
  if (!title) {
    return constructMetadata({
      title: "Micro Dev Tip | DevExCode",
      description: "Actionable engineering tip on DevExCode.",
      canonicalPath: `/micro-dev-tips/${id}`,
    });
  }

  const tags = Array.isArray(tip?.data?.tags)
    ? tip.data.tags
    : Array.isArray(listed?.tags)
    ? listed.tags
    : [];

  return constructMetadata({
    title: `${title} | DevExCode`,
    description:
      tip?.description ||
      listed?.description ||
      `Learn ${title} with actionable examples and code on DevExCode.`,
    canonicalPath: `/micro-dev-tips/${id}`,
    keywords: ['devexcode', 'dev tips', ...tags],
    ogType: 'article',
  });
}

export default async function MicroDevTipsDetailPage({ params }) {
  const { id } = await params;
  const tip = readTip(id);
  const listed = devTips.find((t) => String(t.id) === String(id));

  if (!tip && !listed) {
    notFound();
  }

  const frontmatter = {
    title: tip?.title || listed?.title || "Untitled",
    description:
      tip?.description || listed?.description || "Micro development tip for developers.",
    difficulty: tip?.data?.difficulty || listed?.difficulty || "Unknown",
    tags: tip?.data?.tags || listed?.tags || [],
    date: tip?.data?.date || listed?.date || new Date().toISOString(),
    author: tip?.data?.author || "DevExCode Team",
    category: tip?.data?.category || "DevTips",
  };

  const content =
    tip?.content ||
    `## Placeholder Content\n\nThis development tip is under construction. Please check back later.`;

  const relatedTips = devTips
    .filter((t) => String(t.id) !== String(id) && t.tags.some((tag) => frontmatter.tags.includes(tag)))
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
      logo: { "@type": "ImageObject", url: "https://www.devexcode.com/favicon.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.devexcode.com/micro-dev-tips/${id}` },
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
