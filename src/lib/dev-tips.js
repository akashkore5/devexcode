import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { extractLeadingH1 } from './markdown';

const TIPS_DIR = path.join(process.cwd(), 'dailyblogtips');

/**
 * Markdown files on disk are named `dev_<n>.md`, but the sitemap and the UI link
 * to the numeric id (`/micro-dev-tips/441`). Accept both spellings so the numeric
 * URLs — the ones that are actually indexed — resolve to real content instead of
 * silently falling back to the placeholder body.
 */
export function resolveTipFile(id) {
  const raw = String(id);
  const numeric = raw.match(/^dev[_-]?(\d+)$/i)?.[1] ?? raw;

  const candidates = [`dev_${numeric}.md`, `${numeric}.md`, `${raw}.md`];
  for (const name of candidates) {
    const filePath = path.join(TIPS_DIR, name);
    if (fs.existsSync(filePath)) return filePath;
  }
  return null;
}

/**
 * These files carry no YAML frontmatter — the title is the leading `# H1`.
 * The detail client renders its own <h1> from the title, so the leading heading
 * is stripped from the body to avoid emitting two <h1>s on the page.
 */
export function readTip(id) {
  const filePath = resolveTipFile(id);
  if (!filePath) return null;

  const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));

  let body = content;
  let title = data.title;

  const heading = extractLeadingH1(body);
  if (heading.title) {
    if (!title) title = heading.title;
    body = heading.content;
  }

  // ~1/3 of these files follow the H1 with plain-text "Tags:/Difficulty:/Date:"
  // lines instead of YAML. Lift them into metadata and drop them from the body,
  // where they would otherwise render as a stray paragraph under the heading.
  const inline = {};
  const inlineMatch = body.match(/^(?:(?:Tags|Difficulty|Date|Category|Author):.*(?:\r?\n|$))+/i);
  if (inlineMatch) {
    for (const line of inlineMatch[0].split(/\r?\n/)) {
      const kv = line.match(/^(Tags|Difficulty|Date|Category|Author):\s*(.+?)\s*$/i);
      if (kv) inline[kv[1].toLowerCase()] = kv[2];
    }
    body = body.slice(inlineMatch[0].length).trimStart();
  }

  const merged = {
    ...data,
    ...(inline.tags && !data.tags
      ? { tags: inline.tags.split(',').map((t) => t.trim()).filter(Boolean) }
      : {}),
    ...(inline.difficulty && !data.difficulty ? { difficulty: inline.difficulty } : {}),
    ...(inline.date && !data.date ? { date: inline.date } : {}),
    ...(inline.category && !data.category ? { category: inline.category } : {}),
    ...(inline.author && !data.author ? { author: inline.author } : {}),
  };

  return {
    title: title || null,
    description: data.description || null,
    data: merged,
    content: body,
  };
}
