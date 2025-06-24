import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PostData } from '@/types';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

type Post = Omit<PostData, 'content'>;

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block" aria-label={`Read more about ${post.title}`}>
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50 bg-card">
        <CardHeader className="p-0">
          <div className="relative aspect-video w-full">
            <Image
              src={post.image}
              alt=""
              fill
              className="rounded-t-md object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={post.imageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-6 space-y-3">
          <CardTitle className="font-headline text-xl leading-snug group-hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
          <p className="text-muted-foreground text-sm line-clamp-3">{post.summary}</p>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4 p-6 pt-0">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
            ))}
          </div>
          <div className="flex justify-between w-full items-center text-sm text-muted-foreground pt-4 border-t w-full">
             <time dateTime={post.date}>{format(new Date(post.date), "MMM d, yyyy")}</time>
             <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Read more <ArrowRight className="h-4 w-4" />
             </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
