import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Problem of the Day (POTD) - LeetCode & GFG Daily Challenges | DevExCode",
  description: "Solve daily coding challenges from LeetCode and GeeksforGeeks POTD. Daily problem archives, hints, and optimal solutions on DevExCode.",
  canonicalPath: "/potd",
  keywords: ["POTD", "Problem of the day", "leetcode POTD", "GFG POTD", "daily coding challenge", "devexcode"],
});

export default function POTDLayout({ children }: { children: React.ReactNode }) {
  return children;
}
