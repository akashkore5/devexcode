import { notFound } from "next/navigation";
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
  const title = tip ? tip.title || listed?.title : null;
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

  // 9 catalogue ids (324, 326, 330, 339, 342, 355, 376, 392, 399) have no
  // markdown. They used to render a "under construction" placeholder at HTTP
  // 200 under a real title — thin content with a promising title is the worst
  // combination. Without a body there is no page.
  if (!tip) {
    notFound();
  }

  const frontmatter = {
    title: tip?.title || listed?.title || "Untitled",
    description:
      tip?.description || listed?.description || "Micro development tip for developers.",
    difficulty: tip?.data?.difficulty || listed?.difficulty || "Unknown",
    tags: tip?.data?.tags || listed?.tags || [],
    // No build-time fallback: `new Date()` here re-dated every undated tip on
    // each deploy, so datePublished churned without the content changing.
    date: tip?.data?.date || listed?.date || null,
    author: tip?.data?.author || "DevExCode Team",
    category: tip?.data?.category || "DevTips",
  };

  const content = tip.content;

  const relatedTips = devTips
    .filter((t) => String(t.id) !== String(id) && t.tags.some((tag) => frontmatter.tags.includes(tag)))
    .slice(0, 5)
    .map((t) => ({ id: t.id, title: t.title }));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    image: "https://www.devexcode.com/og-image.jpg",
    description: frontmatter.description,
    ...(frontmatter.date
      ? { datePublished: frontmatter.date, dateModified: frontmatter.date }
      : {}),
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
      {/* Plain <script>, not next/script: for inline JSON-LD next/script
          returns null during SSR and injects the tag from an effect, so the
          schema was absent from the server HTML entirely. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />
      <MicroDevTipsDetailClient frontmatter={frontmatter} content={content} relatedTips={relatedTips} />
    </>
  );
}
