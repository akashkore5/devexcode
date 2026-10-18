import { headers } from "next/headers";
import TechBattlesClient from "./TechBattlesClient";

import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Tech Battles - Head-to-Head Technology Comparisons | DevExCode",
  description: "Compare frameworks, databases, languages, and architectures head-to-head on DevExCode. Benchmarks, feature breakdowns, trade-offs, and production recommendations.",
  canonicalPath: "/tech-battles",
  keywords: ["tech battles", "devexcode", "technology comparison", "framework benchmarks", "architecture comparison"],
});

export default async function TechBattlesPage() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent);
  const initialViewMode = isMobile ? "list" : "table";

  return <TechBattlesClient initialViewMode={initialViewMode} />;
}
