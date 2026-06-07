import { headers } from "next/headers";
import TechBattlesClient from "./TechBattlesClient";

export const metadata = {
  title: "Tech Battles - Technology Comparisons | DevExCode",
  description: "Compare technologies head-to-head on DevExCode (DevEx Code). In-depth comparisons of frameworks, databases, languages, and tools to help you make the right tech decisions.",
  keywords: "tech battles, devexcode, devex code, technology comparison, software comparison, technology stack, framework comparison",
  alternates: { canonical: "https://devexcode.com/tech-battles" },
  openGraph: {
    title: "Tech Battles - Technology Comparisons | DevExCode",
    description: "Head-to-head technology comparisons on DevExCode. Make informed tech decisions.",
    url: "https://devexcode.com/tech-battles",
    type: "website",
  },
};

export default async function TechBattlesPage() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent);
  const initialViewMode = isMobile ? "list" : "table";

  return <TechBattlesClient initialViewMode={initialViewMode} />;
}
