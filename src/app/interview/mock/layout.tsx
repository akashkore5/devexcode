import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Mock Technical Interviews & Practice Sessions | DevExCode",
  description: "Practice real-time technical mock interviews with peer feedback, live algorithmic problem solving, and behavioral questions on DevExCode.",
  canonicalPath: "/interview/mock",
  keywords: ["mock interview", "tech interview practice", "peer mock", "faang mock interview", "devexcode"],
});

export default function MockLayout({ children }: { children: React.ReactNode }) {
  return children;
}
