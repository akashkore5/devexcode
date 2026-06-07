import { headers } from "next/headers";
import MicroDevTipsClient from "./MicroDevTipsClient";

export const metadata = {
  title: "Micro Dev Tips - Daily Developer Tips | DevExCode",
  description: "Explore 500+ micro dev tips on DevExCode — bite-sized coding tips, software engineering best practices, algorithms, and daily technical insights for developers.",
  keywords: "micro dev tips, devexcode, devex code, daily dev tips, developer tips, coding tips, software engineering tips, programming best practices",
  alternates: { canonical: "https://devexcode.com/micro-dev-tips" },
  openGraph: {
    title: "Micro Dev Tips - Daily Developer Tips | DevExCode",
    description: "500+ actionable dev tips on DevExCode. Master software engineering one tip at a time.",
    url: "https://devexcode.com/micro-dev-tips",
    type: "website",
  },
};

export default async function MicroDevTipsPage() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent);
  const initialViewMode = isMobile ? "list" : "table";

  return <MicroDevTipsClient initialViewMode={initialViewMode} />;
}
