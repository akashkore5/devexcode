import { redirect } from "next/navigation";
import problems from "../../../../data/problems.json";

export default async function TagPage({ params }) {
  const { tag } = await params;
  
  const validTags = new Set();
  problems.forEach((problem) => {
    if (problem.tags && Array.isArray(problem.tags)) {
      problem.tags.forEach((t) => validTags.add(t));
    }
  });

  if (!validTags.has(tag)) {
    redirect("/leetcode");
  }

  redirect(`/leetcode?tag=${encodeURIComponent(tag)}`);
}
