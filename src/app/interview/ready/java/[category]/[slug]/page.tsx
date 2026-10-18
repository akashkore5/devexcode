import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import InterviewPrepClient from './InterviewPrepClient';

import { constructMetadata, constructTechArticleSchema } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const filePath = path.join(process.cwd(), 'src/content/interview-prep/java', category, `${slug}.md`);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    const title = `${data.title || slug} - Java Interview Guide | DevExCode`;
    const description = data.description || `In-depth Java interview guide for ${data.title || slug}. Core concepts, code walkthrough, and common technical interview questions on DevExCode.`;
    return constructMetadata({
      title,
      description,
      canonicalPath: `/interview/ready/java/${category}/${slug}`,
      keywords: [data.title || slug, category, 'java interview', 'backend interview', 'devexcode'],
      ogType: 'article',
    });
  } catch (e) {
    return constructMetadata({
      title: 'Java Interview Guide | DevExCode',
      description: 'Comprehensive Java technical interview guide on DevExCode.',
      canonicalPath: `/interview/ready/java/${category}/${slug}`,
    });
  }
}

export default async function InterviewDetailPage({ params }) {
  const { category, slug } = await params;
  const filePath = path.join(process.cwd(), 'src/content/interview-prep/java', category, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  const frontmatter = {
    title: data.title || 'Untitled',
    category: data.category || category,
    order: data.order || 99,
    status: data.status || 'not-started',
    tags: data.tags || [],
  };

  const isDev = process.env.NODE_ENV === 'development';

  const techArticleJsonLd = constructTechArticleSchema({
    title: `${frontmatter.title} - Java Interview Guide`,
    description: `Master Java interview preparation for ${frontmatter.title} on DevExCode.`,
    url: `https://devexcode.com/interview/ready/java/${category}/${slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleJsonLd) }}
      />
      <InterviewPrepClient 
        content={content} 
        frontmatter={frontmatter} 
        slug={slug} 
        category={category}
        isDev={isDev}
      />
    </>
  );
}
