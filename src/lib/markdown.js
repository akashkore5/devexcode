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

/**
 * Some generated files kept the authoring prompt's scaffold in the body, so
 * lines like `**Title:** …`, `**SEO Keywords:** …` and `**Main Blog Content:**`
 * render as visible text on the live page. Only this explicit label set is
 * removed — `**Note:**`, `**Benefits:**` and the like are real content.
 *
 * Returns the `**Title:**` value when present, plus the cleaned body.
 */
const SCAFFOLD_LABELS = /^\*\*(SEO Keywords|SEO keywords|Keywords|Intro|Main Blog Content|Blog Body|Optional ASCII Diagram)\*{0,2}:?\*{0,2}\s*(.*)$/i;

export function stripGenerationScaffold(markdown) {
  const lines = String(markdown ?? '').split(/\r?\n/);
  const out = [];
  let title = null;

  for (const line of lines) {
    const titleMatch = line.match(/^\*\*Title:\*\*\s*(.+?)\s*$/i);
    if (titleMatch) {
      if (!title) title = titleMatch[1].replace(/\*\*/g, '').trim();
      continue;
    }
    if (SCAFFOLD_LABELS.test(line)) continue;
    out.push(line);
  }

  return { title, content: out.join('\n').replace(/^\s+/, '').replace(/\n{3,}/g, '\n\n') };
}
