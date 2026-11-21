import fs from 'fs';
import path from 'path';

/**
 * Which ids actually have renderable content on disk.
 *
 * The catalogues in src/data are aspirational: gfgproblems.json lists 3,466
 * problems but only ~1,147 have a markdown file, and 87 of those are failed
 * generations whose body is a "not available due to generation error" stub.
 * Submitting the rest to the sitemap produced thousands of soft 404s, so both
 * the sitemap and the routes resolve through here.
 *
 * Results are memoised — these run per-request on dynamic routes.
 */
const GENERATION_ERROR_MARKER = 'not available due to generation error';

let gfgIds = null;

export function getGfgContentIds() {
  if (gfgIds) return gfgIds;

  const dir = path.join(process.cwd(), 'gfgblogs');
  const ids = new Set();

  try {
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      const full = path.join(dir, file);
      try {
        if (fs.readFileSync(full, 'utf8').includes(GENERATION_ERROR_MARKER)) continue;
      } catch {
        continue;
      }
      ids.add(file.replace(/\.md$/, ''));
    }
  } catch {
    // Directory missing in some build contexts; fall back to "nothing verified"
    // rather than throwing during sitemap generation.
  }

  gfgIds = ids;
  return gfgIds;
}

export function hasGfgContent(id) {
  return getGfgContentIds().has(String(id));
}
