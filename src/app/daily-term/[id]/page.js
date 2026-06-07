import { notFound } from "next/navigation";
import Script from "next/script";
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

  let term = dailyTerms.find((t) => t.date === date);
  if (!term && dailyTerms.length > 0) {
    let hash = 0;
    for (let i = 0; i < date.length; i++) {
      hash = date.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % dailyTerms.length;
    term = {
      ...dailyTerms[index],
      date: date,
    };
  }

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
    alternates: { canonical: `https://devexcode.com/daily-term/${date}` },
    openGraph: {
      title: `${term.term} - Daily Tech Term | DevExCode`,
      description,
      url: `https://devexcode.com/daily-term/${date}`,
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
  let term = validTerms.find((t) => t.date === date);

  if (!term && dailyTerms.length > 0) {
    let hash = 0;
    for (let i = 0; i < date.length; i++) {
      hash = date.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % dailyTerms.length;
    term = {
      ...dailyTerms[index],
      date: date,
    };
  }

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
      let prevTerm = validTerms.find((t) => t.date === prevDateString);
      if (!prevTerm && dailyTerms.length > 0) {
        let hash = 0;
        for (let j = 0; j < prevDateString.length; j++) {
          hash = prevDateString.charCodeAt(j) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % dailyTerms.length;
        prevTerm = {
          ...dailyTerms[index],
          date: prevDateString,
        };
      }
      if (prevTerm) {
        previousTerms.push(prevTerm);
      }
    }
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${term.term} - Daily Tech Term`,
    description: term.shortExplanation,
    datePublished: date,
    dateModified: date,
    author: { "@type": "Organization", name: "DevExCode" },
    publisher: {
      "@type": "Organization",
      name: "DevExCode",
      logo: { "@type": "ImageObject", url: "https://devexcode.com/favicon.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://devexcode.com/daily-term/${date}` },
  };

  return (
    <>
      <Script
        id={`article-schema-${date}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <DailyTermClient initialTerm={term} previousTerms={previousTerms} />
    </>
  );
}
