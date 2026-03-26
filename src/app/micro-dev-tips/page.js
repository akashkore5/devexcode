import { headers } from "next/headers";
import MicroDevTipsClient from "./MicroDevTipsClient";

export const metadata = {
  title: "Micro Dev Tips | DevCodeEx",
  description: "Explore development tips with in-depth technical insights. Master software engineering with bite-sized tips.",
  keywords: "development tips, technical insights, software engineering, coding tips",
};

export default async function MicroDevTipsPage() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent);
  const initialViewMode = isMobile ? "list" : "table";

  return <MicroDevTipsClient initialViewMode={initialViewMode} />;
}
