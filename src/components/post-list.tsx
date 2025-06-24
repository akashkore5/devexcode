'use client';

import { useState, useMemo } from 'react';
import type { PostData } from '@/types';
import { Input } from '@/components/ui/input';
import { PostCard } from '@/components/post-card';
import { Search } from 'lucide-react';

type Post = Omit<PostData, 'content'>;

export function PostList({ posts }: { posts: Post[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    if (!lowercasedQuery) {
      return posts;
    }
    return posts.filter(post =>
      post.title.toLowerCase().includes(lowercasedQuery) ||
      post.summary.toLowerCase().includes(lowercasedQuery) ||
      post.tags.join(' ').toLowerCase().includes(lowercasedQuery)
    );
  }, [posts, searchQuery]);

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          aria-label="Search posts"
          placeholder="Search posts by title, summary, or tag..."
          className="w-full pl-10 md:w-1/2 lg:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredPosts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-2xl font-headline">No posts found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search query.</p>
        </div>
      )}
    </div>
  );
}
