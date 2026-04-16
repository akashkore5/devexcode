import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import InterviewPrepClient from './InterviewPrepClient';

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const filePath = path.join(process.cwd(), 'src/content/interview-prep/java', category, `${slug}.md`);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    return {
      title: `${data.title || 'Interview Prep'} | DevExCode`,
    };
  } catch (e) {
    return { title: 'Interview Prep | DevExCode' };
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

  return (
    <InterviewPrepClient 
      content={content} 
      frontmatter={frontmatter} 
      slug={slug} 
      category={category}
      isDev={isDev}
    />
  );
}
