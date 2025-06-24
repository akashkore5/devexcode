import { getPostData, getAllPostSlugs } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AiSummary } from '@/components/ai-summary';
import { Calendar, User, Tag } from 'lucide-react';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPostData(params.slug);
    if (!post) {
      return { title: 'Post Not Found' };
    }
    return {
      title: `${post.title} | ContentHub`,
      description: post.summary,
      openGraph: {
        title: post.title,
        description: post.summary,
        images: [
          {
            url: post.image,
            width: 1200,
            height: 600,
            alt: post.title,
          },
        ],
      },
    };
  } catch (error) {
    return { title: 'Post Not Found' };
  }
}

export default async function PostPage({ params }: Props) {
  const post = await getPostData(params.slug).catch(() => null);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight md:text-5xl lg:text-6xl mb-4 text-foreground">
          {post.title}
        </h1>
        <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>{format(new Date(post.date), "MMMM d, yyyy")}</time>
            </div>
        </div>
      </header>

      <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden shadow-lg">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          data-ai-hint={post.imageHint}
        />
      </div>
      
      <AiSummary post={post} />

      <div className="prose prose-lg dark:prose-invert max-w-none mt-8 prose-headings:font-headline prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-primary hover:prose-a:text-accent prose-strong:text-foreground prose-blockquote:border-accent prose-blockquote:text-muted-foreground">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
        </ReactMarkdown>
      </div>

       <footer className="mt-12 pt-8 border-t">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-5 w-5 text-muted-foreground" />
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline" className="font-normal">{tag}</Badge>
            ))}
          </div>
       </footer>
    </article>
  );
}
