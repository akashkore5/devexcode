import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Technical Assessment Tests & Skill Evaluations | DevExCode",
  description: "Take timed technical assessment tests and skill evaluation challenges to measure coding interview readiness on DevExCode.",
  canonicalPath: "/interview/tests",
  keywords: ["technical assessment", "coding test", "interview readiness", "skill test", "devexcode"],
});

export default function TestsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
