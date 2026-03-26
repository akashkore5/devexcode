import { headers } from "next/headers";
import TechBattlesClient from "./TechBattlesClient";

export const metadata = {
  title: "Tech Battles | DevCodeEx",
  description: "Explore tech battles with detailed comparisons, features, and use cases. Master technology comparisons with DevCodeEx.",
  keywords: "tech battles, technology comparison, software comparison, technology stack",
};

export default async function TechBattlesPage() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent);
  const initialViewMode = isMobile ? "list" : "table";

  return <TechBattlesClient initialViewMode={initialViewMode} />;
}
