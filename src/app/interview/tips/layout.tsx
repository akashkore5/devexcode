import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "FAANG & Tech Interview Strategy Guide | DevExCode",
  description: "Actionable interview strategies, behavioral frameworks (STAR method), salary negotiation tactics, and system design approaches on DevExCode.",
  canonicalPath: "/interview/tips",
  keywords: ["interview tips", "faang interview strategy", "star method", "behavioral interview", "salary negotiation", "devexcode"],
});

export default function TipsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
