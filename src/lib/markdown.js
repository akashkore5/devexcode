/**
 * Detail pages render their own <h1> from the topic/tip title, but many of the
 * markdown bodies also open with a top-level heading — in ATX form (`# Title`)
 * or Setext form (`**Title**` underlined with `===`). Left in place that emits
 * two <h1>s per page.
 *
 * Returns the heading text (useful when the file has no frontmatter title) and
 * the body with that leading heading removed.
 */
export function extractLeadingH1(markdown) {
  const body = String(markdown ?? '');

  const atx = body.match(/^\s*#\s+(.+?)\s*(?:\r?\n|$)/);
  if (atx) {
    return { title: atx[1].trim(), content: body.slice(atx[0].length).trimStart() };
  }

  const setext = body.match(/^\s*(\S.*?)\s*\r?\n=+[ \t]*(?:\r?\n|$)/);
  if (setext) {
    const title = setext[1].replace(/^\*\*(.*)\*\*$/, '$1').replace(/^#+\s*/, '').trim();
    return { title, content: body.slice(setext[0].length).trimStart() };
  }

  return { title: null, content: body };
}
