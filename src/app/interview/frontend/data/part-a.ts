import type { FrontendTopic } from "../types";

export const partA: FrontendTopic[] = [
  {
    id: "frontend-basics-html-and-the-dom",
    num: 0,
    title: "Frontend Basics: HTML & the DOM",
    part: "Web Foundations",
    partId: "a",
    difficulty: "Foundational",
    summary:
      "Start here: what the frontend is, how a page loads, HTML tags & attributes, and the DOM — the live tree the browser builds from your HTML.",
    readingTime: 8,
    explanation: [
      "**What is the frontend?** The frontend is everything a person sees and touches in the browser — text, buttons, images, motion. Your code runs in the *user's* browser (the part you can see); the **backend** runs on a server you can't see (databases, logic, APIs). The frontend is built from three layers, each with exactly one job.",
      "**The three layers.** **HTML** = *structure* — the content and its meaning, the skeleton of the page. **CSS** = *style* — how it looks: color, spacing, layout, type (the skin). **JavaScript** = *behaviour* — what happens when you interact (the muscles and brain). Keep them separate and pages stay maintainable.",
      "**How a page loads (5 steps).** (1) **Request** — you enter a URL and the browser asks a server for the page. (2) **Response** — the server sends back files: HTML, CSS, JS. (3) **Parse** — the browser reads the HTML top to bottom and builds the **DOM**, a tree of objects for every element. (4) **Render** — using the DOM + CSS it paints actual pixels on screen. (5) **Run & react** — JavaScript runs, changes the DOM in response to clicks and typing, and the page updates live.",
      "**HTML basics.** HTML (HyperText Markup Language) describes structure using **tags** (also called elements). A page is just nested tags inside a fixed skeleton: `<!DOCTYPE html>`, then `<html>` containing a `<head>` (metadata like `<title>`) and a `<body>` (everything visible).",
      "**Anatomy of an element.** Almost every element has the same shape: an **opening tag**, some **content**, and a **closing tag** — e.g. `<a href=\"/home\">Go home</a>`. **Attributes** (`name=\"value\"`) sit in the opening tag and configure the element. A few elements are **self-closing** / void with no content: `<img>`, `<br>`, `<input>`.",
      "**Attributes you'll use most.** `id` is a *unique* name for one element; `class` is a *shared* name for styling/JS. Others: `src` (file an image/script loads), `alt` (fallback text), `href` (where a link goes), `type` (kind of input/button), `placeholder`, `value`, boolean ones like `disabled`/`checked`, and `data-*` for your own custom data. **`id` and `class` matter most** — they're the handles JavaScript uses to find an element.",
      "**Semantic HTML.** Prefer tags that describe their *meaning* over generic `<div>`s: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`. Semantic markup is easier to read, better for accessibility, and friendlier to search engines.",
      "**The DOM — your page as a live tree.** DOM = **Document Object Model**. When the browser parses your HTML, it builds a *tree of objects* — one **node** per tag and per piece of text. That live tree is the DOM. Useful image: **HTML is the blueprint; the DOM is the building** the browser constructs from it. You renovate the building, not the blueprint.",
      "**HTML vs DOM.** HTML is the *text you write* in a `.html` file on disk — always there, unchanging, and JS cannot change it. The DOM is a *tree of live objects* in the browser's memory, built when the page loads, and JavaScript **can** change it instantly.",
      "**Family-tree vocabulary.** Nodes relate exactly like a family tree, and these are the words you use in code: **parent / child** (a `<body>` is the parent of the `<h1>` and `<p>` inside it), **siblings** (two tags sharing a parent), **ancestor / descendant** (an `<a>` deep inside `<body>`), and the **root** (the `document` node at the very top). Note: words become their own **text nodes** (`\"Hi \"` and `\"link\"` are separate children), and attributes hang off their element.",
      "**Making it interactive.** JavaScript reaches into the DOM to find elements, change them, and listen for what the user does. Three lines cover most of it: find a node (`document.querySelector(\"#like\")`), listen for an event (`btn.addEventListener(\"click\", ...)`), and change the DOM inside the handler (`btn.textContent = \"Liked!\"`).",
      "**Events — reacting to the user.** An event is something that happens: a `click`, `input` (value changes as you type), `change` (value committed), `submit` (a form is submitted), `keydown`, `mouseover`, `load`, `DOMContentLoaded`. You attach a function with `addEventListener` and the browser runs it every time the event fires.",
      "**The mental model (memorise this).** HTML → structure (what's on the page). CSS → style (how it looks). JS → behaviour (what it does). DOM → the live tree the browser builds from HTML, and the thing JavaScript changes to make the page come alive.",
    ],
    backendAnalogy:
      "Think of HTML as your schema/DTO definition (the static shape), and the DOM as the deserialized object graph loaded into memory at runtime — the live tree your code actually mutates. The .html file is like a JSON payload on disk; the DOM is the parsed in-memory object you call getters/setters on. `addEventListener` is your event listener / message handler, and updating `textContent` is like mutating a field on a managed entity — the framework (browser) flushes the change on the next cycle.",
    keyInsights: [
      "Three layers, one job each: HTML = structure, CSS = style, JavaScript = behaviour.",
      "Page-load pipeline: Request → Response → Parse (build DOM) → Render (paint pixels) → Run & react (JS mutates DOM).",
      "HTML is the text on disk (unchanging, JS can't touch it); the DOM is the live in-memory tree (JS changes it instantly).",
      "Every tag becomes an element node; every piece of text becomes its own text node; attributes hang off their element.",
      "`id` (unique) and `class` (shared) are the handles JS uses to find elements in the DOM.",
      "Interactivity is three steps: find an element → listen for an event → change the DOM.",
      "Prefer semantic tags (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`) over generic `<div>`s for accessibility and SEO.",
    ],
    codeSamples: [
      {
        label: "The page skeleton + anatomy of an element",
        language: "html",
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My first page</title>
  </head>
  <body>
    <h1>Hello world</h1>
    <p>This is my first web page.</p>

    <!-- anatomy: opening tag + attribute + content + closing tag -->
    <a href="/home">Go home</a>

    <!-- self-closing (void) elements have no content -->
    <img src="cat.jpg" alt="A sleeping cat">
    <input type="email" placeholder="you@mail.com" required>
  </body>
</html>`,
      },
      {
        label: "How HTML becomes a DOM tree (nodes & relationships)",
        language: "html",
        code: `<html>          <!-- root element -->
  <body>        <!-- parent of <h1> and <p> -->
    <h1>Hello</h1>              <!-- element node -> text node "Hello" -->
    <p>Hi <a href="/">link</a></p>
    <!-- "Hi " is a text node; <a> is a sibling-less child;        -->
    <!-- href="/" is an attribute hanging off <a>; "link" is text  -->
  </body>
</html>`,
      },
      {
        label: "The DOM verbs you'll actually use",
        language: "js",
        code: `// 1. FIND an element in the DOM
const btn = document.querySelector("#like");   // first match
const all = document.querySelectorAll(".item"); // every match

// 2. LISTEN for an event
btn.addEventListener("click", () => {
  // 3. CHANGE the DOM
  btn.textContent = "Liked!";       // read / set text
  btn.style.color = "tomato";       // change one style
  btn.classList.toggle("active");   // add / remove a class
});

// build a new node and add it to the tree
const li = document.createElement("li");
li.textContent = "New item";
document.querySelector("ul").appendChild(li);

// read what a user typed
const name = document.querySelector("#name").value;`,
      },
    ],
    runnable: {
      title: "Event → change the DOM: a live counter and input",
      html: `<button id="like">Liked 0 times</button>
<hr />
<label for="name">Type your name</label>
<input id="name" placeholder="your name" />
<h2 id="greet">Hello there 👋</h2>`,
      css: `body { font-family: system-ui, sans-serif; padding: 12px; }
button { font-size: 16px; padding: 8px 14px; cursor: pointer; }
input { font-size: 16px; padding: 6px; margin-top: 6px; }
h2 { color: tomato; }`,
      js: `// find -> listen -> change the DOM
let count = 0;
const btn = document.querySelector("#like");
btn.addEventListener("click", () => {
  count++;
  btn.textContent = "Liked " + count + " times";
  console.log("click -> rewrote textContent, count =", count);
});

const input = document.querySelector("#name");
const greet = document.querySelector("#greet");
input.addEventListener("input", () => {
  greet.textContent = input.value ? "Hello " + input.value + " 👋" : "Hello there 👋";
  console.log("input event -> updated heading");
});`,
    },
    interviewQA: [
      {
        question: "What is the difference between HTML and the DOM?",
        answer:
          "HTML is the static text you write in a .html file on disk — it never changes on its own and JavaScript can't modify it. The DOM (Document Object Model) is the live tree of objects the browser builds in memory when it parses that HTML. JavaScript reads and mutates the DOM, not the HTML. Analogy: HTML is the blueprint, the DOM is the building.",
      },
      {
        question: "What happens between entering a URL and seeing an interactive page?",
        answer:
          "Five steps: Request (browser asks the server for the page), Response (server returns HTML/CSS/JS), Parse (browser reads HTML top-to-bottom and builds the DOM tree), Render (DOM + CSS are painted to pixels), and Run & react (JavaScript executes, attaches event listeners, and mutates the DOM as the user interacts).",
      },
      {
        question: "How does JavaScript make a page interactive?",
        answer:
          "In three steps: find an element in the DOM (e.g. document.querySelector), listen for an event with addEventListener (click, input, submit…), and inside the handler change the DOM — set textContent, toggle a class, update a style, or create/append/remove nodes.",
      },
      {
        question: "What is the difference between id and class?",
        answer:
          "An id is a unique identifier for a single element on the page; a class is a shared name that can apply to many elements. id is typically used to grab one specific element (getElementById / #id), while class is used for styling groups of elements and selecting collections. Both are the main handles JS uses to find elements.",
      },
      {
        question: "Why use semantic HTML instead of div everywhere?",
        answer:
          "Semantic tags (header, nav, main, article, section, footer) describe the meaning of each region. That makes the document easier to read, gives screen readers and assistive tech real structure to navigate, and helps search engines understand the page — all for free, versus a soup of generic divs.",
      },
    ],
    thingsToRemember: [
      "HTML = structure, CSS = style, JS = behaviour — one job each.",
      "Page load: Request → Response → Parse (DOM) → Render (paint) → Run & react.",
      "The DOM is a live tree of nodes; tags become element nodes, text becomes text nodes, attributes hang off elements.",
      "JS changes the DOM (the building), never the HTML file (the blueprint).",
      "Interactivity = find an element → addEventListener → change the DOM.",
      "Common events: click, input, change, submit, keydown, load, DOMContentLoaded.",
    ],
    references: [
      { label: "MDN — Introduction to the DOM", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction" },
      { label: "MDN — HTML basics", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics" },
      { label: "web.dev — How browsers work", url: "https://web.dev/articles/howbrowserswork" },
    ],
    tags: ["html", "dom", "basics", "events", "fundamentals"],
  },
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
      "**The big picture (read this first).** A browser's only real job is to turn text files (HTML, CSS, JS) into colored pixels on your screen, and to keep those pixels updated as things change. Everything below is just the step-by-step recipe it follows to do that. Think of it like a kitchen: ingredients arrive (download), get prepped into structured bowls (DOM/CSSOM), combined into a dish plan (render tree), arranged on the plate (layout), and finally colored/plated (paint).",
      "**Step 1 — Get the files (network).** When you type a URL: **DNS** translates the human name (`google.com`) into a numeric IP address (like looking up a contact's phone number). A **TCP + TLS handshake** opens a secure phone line to that server. An **HTTP request** asks for the page, and the server sends back the HTML text. At this point the browser has just a wall of text — no boxes, no colors yet.",
      "**Step 2 — Build the DOM (structure).** The browser reads the HTML top to bottom and builds the **DOM** (Document Object Model) — a tree of objects, one node per tag. `<body>` is a node, the `<h1>` inside it is a child node, and so on. The DOM is the browser's *live, in-memory model* of your page that JavaScript can later read and change.",
      "**Step 3 — Build the CSSOM (styling).** In parallel it reads all the CSS and builds the **CSSOM** (CSS Object Model) — a tree of *which style rules apply to which elements*. This is why CSS is called **render-blocking**: the browser refuses to paint anything until the CSSOM is complete, otherwise you'd see an ugly unstyled flash.",
      "**Step 4 — Render tree (what's actually visible).** It merges DOM + CSSOM into the **render tree**: only the things that will actually be drawn. Elements with `display: none` are *skipped* (they're in the DOM but not the render tree). Each render-tree node knows its content **and** its computed styles.",
      "**Step 5 — Layout / reflow (where & how big).** Now the browser does the math: for every node it calculates exact position and size in pixels — x, y, width, height — given the screen size. This is called **layout** (or **reflow**). Example: `width: 50%` only becomes `640px` here, once the browser knows the window is 1280px wide.",
      "**Step 6 — Paint (the actual coloring).** This is the 'how painting happens' part. The browser walks the render tree and produces a list of **draw commands** — 'fill this rectangle blue', 'draw this text here', 'round this corner', 'drop this shadow'. These commands fill in pixels onto layers (think transparent sheets stacked on top of each other).",
      "**Step 7 — Compositing (gluing layers together).** Heavy/animated elements get their own layer. The **compositor** stacks all the layers in the right order and hands the final image to the GPU to show on screen. This is the secret behind smooth animations: moving a layer (with `transform`/`opacity`) only re-glues layers — it skips layout and paint entirely, so it stays at 60fps.",
      "**The full order, in one line:** DNS → TCP/TLS → HTTP → DOM + CSSOM → Render Tree → Layout → Paint → Composite.",
      "**Then JavaScript can change things.** Once the page is shown, JS can mutate the DOM (add a row, change a color). Depending on *what* changed, the browser re-runs part of the pipeline: change geometry → re-do Layout + Paint + Composite (expensive); change only color → skip Layout, just Paint + Composite (cheaper); change only `transform`/`opacity` → skip both, just Composite (cheapest).",
      "**The three languages, each with one job.** **HTML** = structure and content (like your data model / schema). **CSS** = presentation and layout (a view / formatting layer). **JavaScript** = behaviour and interactivity (your business logic / controller layer). Keeping them separated is what makes pages maintainable.",
    ],
    backendAnalogy:
      "Think of the DOM as a live data structure (a mutable tree in memory) and the render pipeline as a continuous build–deploy loop. Every DOM change is like recompiling and redeploying — expensive. React's Virtual DOM is a diff engine that batches changes to minimize these costly cycles, just like you'd batch DB writes instead of committing after every row.",
    keyInsights: [
      "Pipeline in 8 words: download → DOM → CSSOM → render tree → layout → paint → composite.",
      "Cost ladder (cheapest → most expensive): Composite-only (transform/opacity) < Paint-only (color, visibility) < Layout/reflow (size, position, DOM structure).",
      "Animate with `transform` and `opacity`, NOT `top`/`left`/`width` — the former skips layout & paint and runs on the GPU at 60fps.",
      "Layout (reflow) and paint are the expensive stages — minimize the number of times you trigger them.",
      "Reflow cascades: changing one element's size can force the browser to recompute its parents, siblings, and children.",
      "Reading layout properties (offsetHeight, getBoundingClientRect) right after writing them forces a synchronous reflow ('layout thrashing'). Batch reads, then batch writes.",
      "CSS is render-blocking (no paint until CSSOM is ready); a `<script>` without `defer`/`async` blocks DOM parsing too.",
      "`display: none` elements are in the DOM but excluded from the render tree, so they cost nothing to lay out or paint.",
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
      "Pipeline order: DNS → TCP/TLS → HTTP → DOM + CSSOM → Render Tree → Layout → Paint → Composite.",
      "Layout = where/how big (geometry). Paint = filling pixels/colors. Composite = stacking layers onto the screen.",
      "CSS is render-blocking; the browser won't paint until the CSSOM is ready.",
      "Prefer animating `transform`/`opacity` to keep changes on the composite-only (cheapest) path.",
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
