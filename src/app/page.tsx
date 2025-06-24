import { PostList } from "@/components/post-list";
import { getSortedPostsData } from "@/lib/posts";

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-headline tracking-tight lg:text-6xl text-primary">
          ContentHub
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore articles on modern development, AI, and more. A space for ideas and innovation, with AI-powered summaries to get you started.
        </p>
      </div>
      <PostList posts={allPostsData} />
    </div>
  );
}
