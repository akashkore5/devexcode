import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import PracticeClient from './PracticeClient';

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const filePath = path.join(process.cwd(), 'src/content/practice/java', category, `${slug}.md`);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    return {
      title: `${data.title || 'Code Practice'} | DevExCode`,
    };
  } catch (e) {
    return { title: 'Code Practice | DevExCode' };
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
