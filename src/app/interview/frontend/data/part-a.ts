import type { FrontendTopic } from "../types";

export const partA: FrontendTopic[] = [
  {
    id: "browser-rendering-pipeline",
    num: 1,
    title: "Browser Rendering Pipeline",
    part: "Web Foundations",
    partId: "a",
    difficulty: "Foundational",
    summary: "How a URL becomes pixels: DNS, DOM/CSSOM, render tree, layout, and paint.",
    readingTime: 6,
    explanation: [
      "When a user opens a URL, a precise pipeline runs. DNS resolves the domain to an IP address; a TCP+TLS handshake opens a secure connection; an HTTP request fetches the HTML. The browser then parses HTML into the **DOM** (Document Object Model) and CSS into the **CSSOM** (CSS Object Model).",
      "It combines the DOM and CSSOM into a **render tree**, computes **layout** (where everything goes on the page), and **paints** pixels to the screen. JavaScript can then mutate the DOM, potentially triggering expensive re-layout (reflow) and re-paint cycles.",
      "The three languages of the web each have a distinct role. **HTML** is structure and content (like your data model / schema). **CSS** is presentation and layout (a view/formatting layer). **JavaScript** is behaviour and interactivity (your business logic / controller layer).",
    ],
    backendAnalogy:
      "Think of the DOM as a live data structure (a mutable tree in memory) and the render pipeline as a continuous build–deploy loop. Every DOM change is like recompiling and redeploying — expensive. React's Virtual DOM is a diff engine that batches changes to minimize these costly cycles, just like you'd batch DB writes instead of committing after every row.",
    keyInsights: [
      "Layout (reflow) and paint are the expensive stages — minimize the number of times you trigger them.",
      "Reading layout properties (offsetHeight, getBoundingClientRect) right after writing them forces a synchronous reflow ('layout thrashing'). Batch reads and writes.",
      "The Virtual DOM exists to batch and minimize real DOM mutations, not because the real DOM is 'slow' by itself.",
    ],
    codeSamples: [
      {
        label: "Layout thrashing vs. batched reads/writes",
        language: "js",
        code: `// BAD: read then write in a loop forces reflow every iteration
for (const el of items) {
  const w = el.offsetWidth;      // READ (forces layout)
  el.style.width = w + 10 + "px"; // WRITE (invalidates layout)
}

// GOOD: batch all reads, then all writes
const widths = items.map((el) => el.offsetWidth); // all READs
items.forEach((el, i) => {
  el.style.width = widths[i] + 10 + "px";          // all WRITEs
});`,
      },
    ],
    interviewQA: [
      {
        question: "Walk me through what happens between typing a URL and seeing the page.",
        answer:
          "DNS resolves the domain to an IP, a TCP+TLS handshake establishes a secure connection, an HTTP request fetches the HTML. The browser parses HTML into the DOM and CSS into the CSSOM, combines them into the render tree, runs layout to compute geometry, and paints pixels. Scripts may then mutate the DOM, causing reflow/repaint.",
      },
      {
        question: "What is the difference between reflow and repaint?",
        answer:
          "Reflow (layout) recomputes element geometry and positions — triggered by changes to size, position, or DOM structure, and it cascades to children. Repaint redraws pixels for visual-only changes like color or visibility. Reflow is more expensive because repaint usually follows it.",
      },
      {
        question: "Why is the Virtual DOM considered fast?",
        answer:
          "It isn't intrinsically faster than the real DOM; its value is batching. React diffs a lightweight in-memory tree and applies the minimal set of real DOM mutations in one pass, avoiding many separate synchronous layout/paint cycles.",
      },
    ],
    thingsToRemember: [
      "Pipeline order: DNS → TCP/TLS → HTTP → DOM + CSSOM → Render Tree → Layout → Paint.",
      "CSS is render-blocking; the browser won't paint until the CSSOM is ready.",
      "Avoid layout thrashing: group DOM reads together, then group writes.",
    ],
    references: [
      { label: "MDN Web Docs", url: "https://developer.mozilla.org" },
      { label: "web.dev — How browsers work", url: "https://web.dev/articles/howbrowserswork" },
      { label: "web.dev — Critical rendering path", url: "https://web.dev/articles/critical-rendering-path" },
    ],
    tags: ["browser", "rendering", "performance", "dom"],
  },
  {
    id: "html-semantic-structure-forms",
    num: 2,
    title: "HTML (Semantic Structure & Forms)",
    part: "Web Foundations",
    partId: "a",
    difficulty: "Foundational",
    summary: "Semantic tags and accessible forms give you SEO and accessibility for free.",
    readingTime: 5,
    explanation: [
      "Every web page starts from a fixed skeleton. The `<head>` holds metadata (charset, viewport, title), and `<body>` holds visible content.",
      "Semantic HTML means using tags that describe meaning — `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` — instead of generic `<div>` elements everywhere. You get accessibility and SEO benefits for free, because assistive tech and crawlers understand the document's structure.",
    ],
    keyInsights: [
      "Always pair `<label>` with its input via for/id so screen readers announce the field and clicks focus the input.",
      "Use specific input types (email, number, date) for built-in validation and the right mobile keyboard.",
      "Never skip heading levels (h1 → h3) for styling — use CSS instead. Heading order is a document outline.",
    ],
    codeSamples: [
      {
        label: "Semantic skeleton with an accessible form",
        language: "html",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Expense Dashboard</title>
</head>
<body>
  <header><nav><!-- navigation --></nav></header>
  <main>
    <section>
      <h1>My Expenses</h1>
      <form>
        <label for="amount">Amount</label>
        <input id="amount" name="amount" type="number" min="0" step="0.01" required />
        <button type="submit">Submit</button>
      </form>
    </section>
  </main>
  <footer><!-- footer content --></footer>
</body>
</html>`,
      },
    ],
    runnable: {
      title: "Accessible form with native validation",
      html: `<main>
  <h1>My Expenses</h1>
  <form id="f">
    <label for="amount">Amount</label>
    <input id="amount" name="amount" type="number" min="0" step="0.01" required />
    <button type="submit">Submit</button>
  </form>
</main>`,
      css: `body { font-family: system-ui; padding: 16px; }
label { display:block; font-weight:600; margin-bottom:4px; }
input { padding:8px; border:1px solid #ccc; border-radius:8px; }
button { margin-top:12px; padding:8px 16px; border-radius:8px; border:0; background:#4f46e5; color:#fff; }`,
      js: `document.getElementById('f').addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = e.target.amount.value;
  console.log('Submitted amount:', amount);
});`,
    },
    interviewQA: [
      {
        question: "Why use semantic HTML over div soup?",
        answer:
          "Semantic elements describe the role of content, which improves accessibility (screen readers can navigate by landmarks like main and nav), SEO (crawlers understand structure), and maintainability. A page of nested divs conveys no meaning to machines.",
      },
      {
        question: "How do you make a form accessible?",
        answer:
          "Associate every input with a <label> via matching for/id, use correct input types, mark required fields, group related controls with <fieldset>/<legend>, and surface validation errors with aria-describedby. Native elements give you keyboard and screen-reader support for free.",
      },
    ],
    thingsToRemember: [
      "Landmarks: header, nav, main (one per page), section, article, footer.",
      "label[for] must match input[id]; clicking the label then focuses the input.",
      "Prefer native form validation (required, type, min/max, pattern) before reaching for JS.",
    ],
    references: [
      { label: "MDN — HTML elements reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element" },
      { label: "MDN — Forms guide", url: "https://developer.mozilla.org/en-US/docs/Learn/Forms" },
      { label: "W3C WAI — Accessibility fundamentals", url: "https://www.w3.org/WAI/fundamentals/" },
    ],
    tags: ["html", "semantics", "forms", "accessibility"],
  },
  {
    id: "css-fundamentals",
    num: 3,
    title: "CSS Fundamentals (Selectors, Specificity, Box Model)",
    part: "Web Foundations",
    partId: "a",
    difficulty: "Foundational",
    summary: "Selectors, the specificity cascade, and a sane global box model.",
    readingTime: 5,
    explanation: [
      "CSS rules select HTML elements and apply style declarations. When rules conflict, the more specific selector wins: element (`p`) < class (`.card`) < id (`#main`) < inline style < `!important`.",
      "Set `box-sizing: border-box` globally so an element's declared width includes its padding and border — this avoids constant mental math when sizing components.",
    ],
    backendAnalogy:
      "Specificity is like Java's method overload resolution — the most specific match wins. The fix for 'my style is ignored' is almost always the right selector, not !important.",
    keyInsights: [
      "Specificity is counted as (inline, ids, classes/attributes/pseudo-classes, elements). Higher tuple wins.",
      "Reaching for !important is usually a symptom of a specificity problem — fix the selector instead.",
      "box-sizing: border-box on *, *::before, *::after makes layouts predictable.",
    ],
    codeSamples: [
      {
        label: "Box model & specificity",
        language: "css",
        code: `/* Global box-sizing reset */
*, *::before, *::after { box-sizing: border-box; }

/* A card component */
.card {
  width: 320px;
  padding: 16px;
  border: 1px solid #ddd;
  margin: 12px;
  border-radius: 8px;
}

/* Specificity: class beats element */
p { color: gray; }          /* specificity: 0-0-1 */
.highlight { color: red; }  /* specificity: 0-1-0 — wins */`,
      },
    ],
    interviewQA: [
      {
        question: "How is CSS specificity calculated?",
        answer:
          "As a tuple (inline styles, IDs, classes/attributes/pseudo-classes, type/elements). Compare left to right; the higher value wins. Inline beats IDs, IDs beat classes, classes beat element selectors. !important overrides all of these, and ties are broken by source order (last wins).",
      },
      {
        question: "What does box-sizing: border-box do?",
        answer:
          "It makes an element's width and height include its padding and border, rather than adding them on top of the content box. This makes sizing predictable, which is why most resets apply it globally.",
      },
    ],
    thingsToRemember: [
      "Specificity order: element < class < id < inline < !important.",
      "Set box-sizing: border-box globally.",
      "Source order breaks specificity ties — later rules win.",
    ],
    references: [
      { label: "MDN — Specificity", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity" },
      { label: "MDN — The box model", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model" },
    ],
    tags: ["css", "specificity", "box-model", "selectors"],
  },
  {
    id: "flexbox-and-grid",
    num: 4,
    title: "Flexbox & Grid Layout",
    part: "Web Foundations",
    partId: "a",
    difficulty: "Foundational",
    summary: "Flexbox for one dimension, Grid for two — no floats or positioning hacks.",
    readingTime: 5,
    explanation: [
      "**Flexbox** is for one-dimensional layout — a row OR a column of items (a navbar, a button group). **Grid** is for two-dimensional layout — rows AND columns simultaneously (page shells, dashboards).",
      "Together they handle virtually every layout need without floats or absolute-positioning hacks. They also nest cleanly: Grid for the page shell, Flexbox inside each section.",
    ],
    keyInsights: [
      "Use Flexbox when items flow in a single direction; use Grid when you need control over both axes at once.",
      "`repeat(auto-fill, minmax(280px, 1fr))` gives a responsive card grid with no media queries.",
      "`gap` works in both Flexbox and Grid — prefer it over margins for spacing between items.",
    ],
    codeSamples: [
      {
        label: "Flexbox for rows, Grid for page structure",
        language: "css",
        code: `/* Flexbox: a horizontal toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

/* Grid: sidebar + content app shell */
.app-shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 16px;
  height: 100vh;
}

/* Grid: responsive card grid (no media queries) */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}`,
      },
    ],
    runnable: {
      title: "Responsive card grid with auto-fill",
      html: `<div class="grid">
  <div class="card">One</div>
  <div class="card">Two</div>
  <div class="card">Three</div>
  <div class="card">Four</div>
</div>`,
      css: `body { font-family: system-ui; padding: 16px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; }
.card { background:#4f46e5; color:#fff; padding:24px; border-radius:12px; text-align:center; font-weight:700; }`,
    },
    interviewQA: [
      {
        question: "When do you choose Flexbox vs Grid?",
        answer:
          "Flexbox for one-dimensional layouts where content drives sizing (toolbars, button rows). Grid for two-dimensional layouts where you define the structure up front (page shells, dashboards). They compose — Grid for the outer shell, Flexbox within cells.",
      },
      {
        question: "How do you build a responsive grid without media queries?",
        answer:
          "Use grid-template-columns: repeat(auto-fill, minmax(MINPX, 1fr)). Columns automatically wrap and resize to fit the container, fitting as many MINPX-wide tracks as possible and distributing leftover space.",
      },
    ],
    thingsToRemember: [
      "Flexbox = 1D (row or column). Grid = 2D (rows and columns).",
      "Use gap, not margins, for inter-item spacing.",
      "auto-fill + minmax = responsive grids without breakpoints.",
    ],
    references: [
      { label: "CSS-Tricks — A Complete Guide to Flexbox", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" },
      { label: "CSS-Tricks — A Complete Guide to Grid", url: "https://css-tricks.com/snippets/css/complete-guide-grid/" },
    ],
    tags: ["css", "flexbox", "grid", "layout"],
  },
  {
    id: "responsive-design",
    num: 5,
    title: "Responsive Design (Media Queries)",
    part: "Web Foundations",
    partId: "a",
    difficulty: "Foundational",
    summary: "Mobile-first layouts that adapt with relative units and min-width breakpoints.",
    readingTime: 5,
    explanation: [
      "Responsive design means your UI adapts to different screen sizes. Use relative units (%, rem, vw/vh), fluid layouts (Flexbox/Grid with auto-fill), and media queries to change rules at specific breakpoints.",
      "Take a **mobile-first** approach: write base styles for small screens, then layer in complexity with `min-width` queries as the viewport grows. This keeps the default experience lightweight.",
    ],
    keyInsights: [
      "Mobile-first (min-width queries) progressively enhances; desktop-first (max-width) progressively degrades — mobile-first is usually simpler.",
      "Prefer rem for typography and spacing so the layout respects the user's font-size preference.",
      "Many layouts need zero media queries if you lean on Flexbox/Grid intrinsic sizing.",
    ],
    codeSamples: [
      {
        label: "Mobile-first responsive design",
        language: "css",
        code: `/* Mobile-first: base styles for small screens */
.app-shell {
  display: grid;
  grid-template-columns: 1fr; /* single column */
}

/* Tablet and up */
@media (min-width: 768px) {
  .app-shell {
    grid-template-columns: 240px 1fr; /* sidebar appears */
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { max-width: 1200px; margin: 0 auto; }
}`,
      },
    ],
    interviewQA: [
      {
        question: "What is mobile-first design and why prefer it?",
        answer:
          "You write base CSS for the smallest screen, then add complexity with min-width media queries for larger screens. It's preferred because the default path is the lightest, it forces prioritizing core content, and min-width queries tend to be simpler to reason about than overriding desktop styles down.",
      },
      {
        question: "Why use rem instead of px for spacing and type?",
        answer:
          "rem is relative to the root font-size, so the whole layout scales when a user changes their browser's base font size — better for accessibility. px is fixed and ignores that preference.",
      },
    ],
    thingsToRemember: [
      "Mobile-first = base styles + min-width breakpoints.",
      "Relative units: rem (type/spacing), %, vw/vh (viewport).",
      "Common breakpoints: ~768px (tablet), ~1024px (desktop).",
    ],
    references: [
      { label: "MDN — CSS reference & layout guides", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
      { label: "web.dev — Responsive design basics", url: "https://web.dev/articles/responsive-web-design-basics" },
    ],
    tags: ["css", "responsive", "media-queries", "mobile-first"],
  },
];
