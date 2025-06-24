import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PostData as PostDataType } from '@/types';

const postsDirectory = path.join(process.cwd(), 'posts');

export type PostData = PostDataType;

export function getSortedPostsData(): Omit<PostData, 'content'>[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      slug,
      ...(matterResult.data as {
        title: string;
        date: string;
        author: string;
        tags: string[];
        image: string;
        imageHint: string;
        summary: string;
      }),
    };
  });

  return allPostsData.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    content,
    ...(data as {
      title: string;
      date: string;
      author: string;
      tags: string[];
      image: string;
      imageHint: string;
      summary: string;
    }),
  };
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      slug: fileName.replace(/\.md$/, ''),
    };
  });
}
