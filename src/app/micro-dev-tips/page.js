import { headers } from "next/headers";
import MicroDevTipsClient from "./MicroDevTipsClient";

import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Micro Dev Tips - Bite-Sized Software Engineering Insights | DevExCode",
  description: "Explore 500+ micro dev tips on DevExCode. Actionable programming tips, performance patterns, debugging tricks, and daily technical insights for engineers.",
  canonicalPath: "/micro-dev-tips",
  keywords: ["micro dev tips", "developer tips", "coding tips", "engineering best practices", "devexcode"],
});

export default async function MicroDevTipsPage() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent);
  const initialViewMode = isMobile ? "list" : "table";

  return <MicroDevTipsClient initialViewMode={initialViewMode} />;
}
