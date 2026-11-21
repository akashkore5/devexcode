import { notFound } from "next/navigation";
import DailyTermClient from "./DailyTermClient";
import dailyTerms from "../../../data/daily_terms.json";

// Helper to format date as YYYY-MM-DD
const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export async function generateMetadata({ params }) {
  const { id: date } = await params;
  const today = formatLocalDate(new Date());
  
  if (date > today) return { title: "Daily Term | DevExCode" };

  // No synthetic fallback: a date with no real term must 404, not recycle
  // another term's body under a new self-canonical URL.
  const term = dailyTerms.find((t) => t.date === date);
  if (!term) return { title: "Daily Term | DevExCode" };

  const description = `${term.shortExplanation} Learn the definition, usage, and examples of ${term.term} on DevExCode.`;

  return {
    title: `${term.term} - Daily Tech Term | DevExCode`,
    description,
    keywords: [
      term.term, 'devexcode', 'devex code', 'daily tech term', 'technical term',
      'coding vocabulary', 'software development', 'programming concepts',
      term.category || 'tech education',
    ].filter(Boolean).join(', '),
    alternates: { canonical: `https://www.devexcode.com/daily-term/${date}` },
    openGraph: {
      title: `${term.term} - Daily Tech Term | DevExCode`,
      description,
      url: `https://www.devexcode.com/daily-term/${date}`,
      type: 'article',
      images: [`/api/generate-term-image?date=${date}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${term.term} | DevExCode Daily Term`,
      description,
      images: [`/api/generate-term-image?date=${date}`],
    },
  };
}

export default async function DailyTermPage({ params }) {
  const { id: date } = await params;
  const today = formatLocalDate(new Date());

  if (date > today) {
    notFound();
  }

  const validTerms = dailyTerms.filter((t) => t.date <= today);
  const term = validTerms.find((t) => t.date === date);

  // Previously an unknown date hashed into an existing term and rendered it at
  // a new indexable URL. Combined with the prev-date links below that produced
  // an unbounded crawl of near-duplicates. Unknown dates now 404.
  if (!term) {
    notFound();
  }

  const currentDate = new Date(date);
  const previousTerms = [];
  for (let i = 1; i <= 2; i++) {
    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - i);
    const prevDateString = formatLocalDate(prevDate);
    if (prevDateString <= today) {
      const prevTerm = validTerms.find((t) => t.date === prevDateString);
      if (prevTerm) {
        previousTerms.push(prevTerm);
      }
    }
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${term.term} - Daily Tech Term`,
    image: "https://www.devexcode.com/og-image.jpg",
    description: term.shortExplanation,
    datePublished: date,
    dateModified: date,
    author: { "@type": "Organization", name: "DevExCode" },
    publisher: {
      "@type": "Organization",
      name: "DevExCode",
      logo: { "@type": "ImageObject", url: "https://www.devexcode.com/favicon.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.devexcode.com/daily-term/${date}` },
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
      <DailyTermClient initialTerm={term} previousTerms={previousTerms} />
    </>
  );
}
