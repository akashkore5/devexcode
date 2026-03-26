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

  const term = dailyTerms.find((t) => t.date === date);
  if (!term) return { title: "Daily Term | DevExCode" };

  return {
    title: `Daily Term: ${term.term} | DevExCode`,
    description: `${term.shortExplanation} Learn more about ${term.term} on DevExCode.`,
    openGraph: {
      title: `Daily Term: ${term.term}`,
      description: term.shortExplanation,
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

  return <DailyTermClient initialTerm={term} previousTerms={previousTerms} />;
}
