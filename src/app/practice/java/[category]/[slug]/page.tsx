import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import PracticeClient from './PracticeClient';

import { constructMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const filePath = path.join(process.cwd(), 'src/content/practice/java', category, `${slug}.md`);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    const title = `${data.title || slug} - Java Practice Exercise | DevExCode`;
    const description = `Practice ${data.title || slug} in Java on DevExCode. Hands-on coding exercise with test cases and solution walkthrough.`;
    return constructMetadata({
      title,
      description,
      canonicalPath: `/practice/java/${category}/${slug}`,
      keywords: [data.title || slug, category, 'java practice', 'coding exercise', 'devexcode'],
      ogType: 'article',
    });
  } catch (e) {
    return constructMetadata({
      title: 'Java Practice Exercise | DevExCode',
      description: 'Hands-on Java programming exercise on DevExCode.',
      canonicalPath: `/practice/java/${category}/${slug}`,
    });
  }
}

export default async function PracticeDetailPage({ params }) {
  const { category, slug } = await params;
  const filePath = path.join(process.cwd(), 'src/content/practice/java', category, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  const frontmatter = {
    title: data.title || 'Untitled Practice',
    category: data.category || category,
    order: data.order || 99,
  };

  return (
    <PracticeClient 
      content={content} 
      frontmatter={frontmatter} 
      slug={slug} 
      category={category}
    />
  );
}
