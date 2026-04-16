import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function POST(request: Request) {
  // Security check: Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Editing is only allowed in development mode.' }, { status: 403 });
  }

  try {
    const { category, slug, content, frontmatter } = await request.json();

    if (!category || !slug || (!content && content !== '')) {
      return NextResponse.json({ error: 'Missing required fields: category, slug, or content.' }, { status: 400 });
    }

    // Sanitize slug and category
    const safeCategory = category.replace(/[^a-zA-Z0-9-]/g, '');
    const safeSlug = slug.replace(/[^a-zA-Z0-9-]/g, '');

    const filePath = path.join(process.cwd(), 'src/content/interview-prep/java', safeCategory, `${safeSlug}.md`);

    // Reconstruct file with frontmatter
    const fileContent = matter.stringify(content, frontmatter || {});

    // Ensure directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write file
    fs.writeFileSync(filePath, fileContent, 'utf8');

    return NextResponse.json({ success: true, path: filePath });
  } catch (error) {
    console.error('Error saving interview content:', error);
    return NextResponse.json({ error: 'Failed to save content.', details: error.message }, { status: 500 });
  }
}
