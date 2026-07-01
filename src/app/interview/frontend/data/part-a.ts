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
    summary:
      "How a URL becomes pixels and stays 60fps: DNS/TCP/TLS/HTTP, DOM & CSSOM construction, the render tree, layout (reflow), paint, and GPU compositing — plus the cost ladder that tells you which changes are cheap and which trigger expensive reflows.",
    readingTime: 16,
    explanation: [
      "**The big picture (read this first).** A browser's only real job is to turn text files (HTML, CSS, JS) into colored pixels on your screen, and to keep those pixels updated as things change — ideally 60 times per second, i.e. a new frame every ~16.7ms. Everything below is just the step-by-step recipe it follows. Think of it like a kitchen: ingredients arrive (download), get prepped into structured bowls (DOM/CSSOM), combined into a dish plan (render tree), arranged on the plate (layout), colored/plated (paint), and finally the plates are stacked and carried out (composite). This whole path from bytes to first pixels is called the **critical rendering path**, and shortening it is what page-speed optimization is really about.",
      "**Step 1 — Get the files (network).** When you type a URL: **DNS** translates the human name (`google.com`) into a numeric IP address (like looking up a contact's phone number). A **TCP handshake** (SYN / SYN-ACK / ACK) opens a reliable connection, and a **TLS handshake** layers encryption on top for `https`. An **HTTP request** then asks for the document, and the server streams back the HTML text. At this point the browser has just a wall of bytes — no boxes, no colors yet. Note the browser starts parsing as bytes *arrive*; it does not wait for the whole file.",
      "**Step 2 — Build the DOM (structure).** The browser tokenizes the HTML and builds the **DOM** (Document Object Model) incrementally, top to bottom — a tree of objects, one node per tag. `<body>` is a node, the `<h1>` inside it is a child node, text becomes text nodes, and attributes hang off their element. The DOM is the browser's *live, in-memory model* of your page that JavaScript can later read and mutate. Because parsing is incremental, a slow `<script>` in the middle of the `<head>` can stall construction of everything below it.",
      "**Step 3 — Build the CSSOM (styling).** In parallel the browser downloads and parses all CSS into the **CSSOM** (CSS Object Model) — a tree of *which computed style rules apply to which elements*, with the cascade already resolved. This is why CSS is called **render-blocking**: the browser refuses to paint anything until the CSSOM is complete, otherwise you'd see a flash of unstyled content (FOUC). Keep critical CSS small and inline it, and defer non-critical styles, to unblock the first paint sooner.",
      "**Step 4 — Scripts interrupt parsing (why `defer`/`async` matter).** A plain `<script>` is **parser-blocking**: the browser stops building the DOM, downloads and executes the script, *then* resumes — and because scripts can read styles, it may also wait for pending CSS first. `defer` downloads the script in parallel and runs it after the DOM is fully parsed (order preserved) — the right default for app code. `async` runs it as soon as it downloads, in no guaranteed order — good for independent third-party tags. Put scripts at the end of `<body>` or mark them `defer` so they never block rendering.",
      "**Step 5 — Render tree (what's actually visible).** The browser merges DOM + CSSOM into the **render tree**: only the nodes that will actually be drawn, each carrying its content **and** its computed styles. Elements with `display: none` are *excluded entirely* (they're in the DOM but produce no box). Contrast that with `visibility: hidden`, which *is* in the render tree — it takes up space and still costs layout, it's just not painted.",
      "**Step 6 — Layout / reflow (where & how big).** Now the browser does the geometry math: for every render-tree node it computes exact position and size in the viewport — x, y, width, height — as a box. This is **layout** (also called **reflow**). Example: `width: 50%` only resolves to `640px` here, once the browser knows the viewport is 1280px wide. Layout is expensive and **cascades**: changing one element's size can force recalculation of its ancestors, siblings, and descendants, potentially the whole subtree.",
      "**Step 7 — Paint (filling in pixels).** The browser walks the render tree and produces a list of **draw commands** — 'fill this rectangle blue', 'draw this text here', 'round this corner', 'drop this shadow'. Painting rasterizes those commands into pixels on one or more layers (think transparent sheets stacked on top of each other). Purely visual changes — `color`, `background`, `box-shadow`, `visibility` — trigger a **repaint** without a reflow, which is cheaper because no geometry has to be recomputed.",
      "**Step 8 — Compositing (gluing layers together).** Certain elements get promoted to their own **layer** (their own bitmap the GPU can move independently). The **compositor** stacks these layers in the correct order and hands the final image to the GPU for display. This is the secret behind smooth animation: moving or fading a layer with `transform`/`opacity` only re-composites — it skips layout *and* paint entirely — so it can run on the GPU/compositor thread at a steady 60fps even while the main thread is busy.",
      "**The cost ladder (the one thing to internalize).** Not all changes are equal. From cheapest to most expensive: **composite-only** (`transform`, `opacity`) — no layout, no paint, GPU-driven; **paint-only** (`color`, `background`, `visibility`, `box-shadow`) — repaint but no reflow; **layout/reflow** (`width`, `height`, `top`/`left`, `margin`, `padding`, `font-size`, adding/removing DOM nodes) — recompute geometry, then repaint, then composite. That's why the golden rule of web animation is *animate `transform` and `opacity`, never `top`/`left`/`width`*.",
      "**Layout thrashing (the classic performance bug).** The browser is smart: it batches DOM writes and flushes layout once before the next paint. But if you **write** a geometry property and then **read** a layout value (`offsetHeight`, `offsetWidth`, `getBoundingClientRect()`, `scrollTop`, `getComputedStyle`) in the same tick, the browser is forced to flush layout *synchronously right now* to give you an accurate answer. Do that inside a loop — read, write, read, write — and you trigger a forced synchronous reflow every iteration. The fix: **batch all reads first, then all writes**, and use `requestAnimationFrame` to schedule visual updates.",
      "**Then JavaScript keeps changing things.** After first paint, JS mutates the DOM and the browser re-runs only the necessary part of the pipeline based on *what* changed: change geometry or structure → Layout + Paint + Composite (expensive); change only color → Paint + Composite (cheaper); change only `transform`/`opacity` → Composite only (cheapest). Understanding this decides whether your UI feels janky or buttery.",
      "**Why the Virtual DOM exists.** The real DOM is not intrinsically 'slow' — a single property set is fast. What's slow is triggering *many* separate synchronous layout/paint cycles. React's Virtual DOM is a diffing layer: it computes the minimal set of real mutations in memory and applies them in one batched pass, so the browser reflows once instead of N times. It's an optimization for *how often* you touch the DOM, not a faster DOM.",
      "**The three languages, each with one job.** **HTML** = structure and content (like your data model / schema). **CSS** = presentation and layout (a view / formatting layer). **JavaScript** = behaviour and interactivity (your business logic / controller layer). Keeping them separated is what keeps pages maintainable and lets each stage of the pipeline stay fast.",
      "**The mental model (memorise this).** Bytes → DOM (structure) + CSSOM (style) → Render Tree (visible + styled) → Layout (geometry) → Paint (pixels) → Composite (layers to screen). CSS blocks rendering; plain scripts block parsing. After load, the browser re-runs only the stages your change dirtied — so prefer composite-only changes, batch your DOM reads and writes, and let the pipeline breathe.",
    ],
    backendAnalogy:
      "Think of the DOM as a live, mutable tree in memory and the render pipeline as a continuous build → deploy loop that must finish inside a 16ms frame budget. A reflow is like a full rebuild-and-redeploy (recompile the world), a repaint is like a hot-swap of a single class, and a composite-only change is like flipping a feature flag — no rebuild at all. Layout thrashing is the equivalent of calling a blocking `.get()` on a future inside a tight loop in Vert.x: each read forces the event loop to stall and resolve work you should have batched. React's Virtual DOM plays the role you'd give a write-behind cache — accumulate changes and flush them to the expensive backing store (the DOM) in one transaction instead of committing after every field.",
    keyInsights: [
      "Pipeline in order: bytes -> DOM + CSSOM -> render tree -> layout -> paint -> composite; the whole path is the critical rendering path.",
      "Cost ladder cheapest to most expensive: composite-only (transform/opacity) < paint-only (color, background, visibility) < layout/reflow (size, position, margin, DOM structure).",
      "Animate transform and opacity, never top/left/width - the former skip layout and paint and run on the GPU compositor at 60fps.",
      "Layout (reflow) cascades: changing one element's geometry can force recomputation of its ancestors, siblings, and descendants.",
      "Reading a layout value (offsetHeight, getBoundingClientRect, scrollTop) after writing one forces a synchronous reflow - this is layout thrashing. Batch all reads, then all writes.",
      "CSS is render-blocking (no paint until the CSSOM is ready); a plain script is parser-blocking - use defer for app code, async for independent third-party tags.",
      "display:none is excluded from the render tree (no box, zero cost); visibility:hidden stays in it (takes space, still costs layout, just isn't painted).",
      "The Virtual DOM batches and minimizes real DOM mutations so the browser reflows once instead of many times - it is not a faster DOM.",
      "A frame budget is ~16.7ms at 60fps; long main-thread work (heavy JS, forced reflows) blows the budget and causes jank.",
      "width:50% resolves to real pixels only during layout, once the browser knows the viewport size.",
    ],
    codeSamples: [
      {
        label: "Layout thrashing vs. batched reads then writes",
        language: "js",
        code: `// BAD: interleaving reads and writes forces a synchronous reflow
// on EVERY iteration -> O(n) forced layouts.
for (const el of items) {
  const w = el.offsetWidth;         // READ  (flushes pending layout NOW)
  el.style.width = w + 10 + "px";   // WRITE (invalidates layout again)
}

// GOOD: batch all READs, then all WRITEs -> the browser lays out ONCE.
const widths = items.map((el) => el.offsetWidth); // all READs first
items.forEach((el, i) => {
  el.style.width = widths[i] + 10 + "px";          // then all WRITEs
});

// BEST: schedule the visual write inside requestAnimationFrame so it
// lands right before the next paint, aligned to the frame budget.
const measured = items.map((el) => el.offsetWidth);
requestAnimationFrame(() => {
  items.forEach((el, i) => (el.style.width = measured[i] + 10 + "px"));
});`,
      },
      {
        label: "Cheap vs. expensive changes — pick the composite path",
        language: "js",
        code: `const box = document.querySelector(".box");

// EXPENSIVE: animating 'left' changes geometry -> Layout + Paint + Composite
// every frame. This is the classic janky animation.
// box.style.left = x + "px";

// CHEAP: 'transform' is composite-only -> the GPU moves the existing
// layer, skipping layout AND paint. Same visual result, 60fps.
box.style.transform = "translateX(" + x + "px)";

// Hint the browser to promote an element to its own layer BEFORE
// animating (add it, animate, then remove it to free GPU memory).
box.style.willChange = "transform";

// color-only change -> Paint + Composite (no reflow) = mid-cost.
box.style.color = "tomato";`,
      },
      {
        label: "Unblocking the critical rendering path in the <head>",
        language: "html",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- Inline the tiny bit of CSS needed for above-the-fold content so
       the first paint isn't blocked waiting on a stylesheet download. -->
  <style>body{font-family:system-ui;margin:0}.hero{min-height:60vh}</style>

  <!-- Non-critical CSS: load without blocking render, then apply. -->
  <link rel="preload" href="/styles.css" as="style"
        onload="this.rel='stylesheet'" />

  <!-- defer: download in parallel, run AFTER the DOM is parsed, in order.
       The right default so scripts never block DOM construction. -->
  <script src="/app.js" defer></script>

  <!-- async: runs the moment it downloads, order NOT guaranteed.
       Good for independent third-party tags (analytics, etc.). -->
  <script src="https://cdn.example.com/analytics.js" async></script>
</head>
<body>
  <div class="hero">Above the fold</div>
</body>
</html>`,
      },
      {
        label: "Reading layout properties that force a synchronous reflow",
        language: "ts",
        code: `// These reads all FLUSH pending layout so they can return an accurate
// value. Calling them right after a style write causes a forced reflow.
function forcesReflow(el: HTMLElement): void {
  void el.offsetTop;
  void el.offsetWidth;
  void el.offsetHeight;
  void el.getBoundingClientRect(); // position + size
  void el.scrollTop;               // scroll offsets
  void window.getComputedStyle(el).height; // resolved computed style
}

// Rule: measure everything you need up front, cache it, THEN mutate.
// Never read a geometry property in the same loop where you write one.`,
      },
    ],
    runnable: {
      title: "See layout thrashing vs. batched reads/writes (watch the timings)",
      html: `<button id="thrash">Thrash (read+write interleaved)</button>
<button id="batch">Batched (read all, then write all)</button>
<div id="list"></div>`,
      css: `body { font-family: system-ui, sans-serif; padding: 12px; }
button { font-size: 14px; padding: 8px 12px; margin: 4px; cursor: pointer; }
#list { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 10px; }
.bar { height: 18px; background: #4f46e5; border-radius: 4px; }`,
      js: `// build 200 bars
const list = document.getElementById("list");
const bars = [];
for (let i = 0; i < 200; i++) {
  const b = document.createElement("div");
  b.className = "bar";
  b.style.width = (20 + (i % 40)) + "px";
  list.appendChild(b);
  bars.push(b);
}

// BAD: read offsetWidth then write width in the SAME loop -> forced
// synchronous reflow every iteration.
document.getElementById("thrash").addEventListener("click", () => {
  const t0 = performance.now();
  for (const b of bars) {
    const w = b.offsetWidth;              // READ (forces layout)
    b.style.width = (w + 1) + "px";       // WRITE (invalidates it)
  }
  console.log("thrash: " + (performance.now() - t0).toFixed(2) + "ms (many forced reflows)");
});

// GOOD: batch all reads, then all writes -> layout flushed once.
document.getElementById("batch").addEventListener("click", () => {
  const t0 = performance.now();
  const widths = bars.map((b) => b.offsetWidth);  // all READs
  bars.forEach((b, i) => (b.style.width = (widths[i] + 1) + "px")); // all WRITEs
  console.log("batch:  " + (performance.now() - t0).toFixed(2) + "ms (one layout pass)");
});

console.log("Click each button a few times and compare the ms in the console.");`,
    },
    interviewQA: [
      {
        question: "Walk me through what happens between typing a URL and seeing the page.",
        answer:
          "DNS resolves the domain to an IP, a TCP handshake plus a TLS handshake (for https) establishes a secure connection, and an HTTP request fetches the HTML. The browser parses HTML into the DOM incrementally and CSS into the CSSOM, combines the two into the render tree (visible nodes with their computed styles), runs layout to compute each box's geometry, paints pixels, and composites the layers to the screen. Plain scripts block parsing along the way; after load, JS mutations re-run whichever pipeline stages the change dirtied.",
      },
      {
        question: "What is the difference between reflow (layout) and repaint?",
        answer:
          "Reflow recomputes element geometry — position and size — and is triggered by changes to width/height, position, margin/padding, font-size, or DOM structure; it cascades to ancestors, siblings, and descendants. Repaint just redraws pixels for visual-only changes like color, background, or visibility, with no geometry recalculation. Reflow is more expensive because a repaint almost always follows it, whereas a repaint can happen alone.",
      },
      {
        question: "Which CSS properties are cheapest to animate and why?",
        answer:
          "transform and opacity are cheapest because they're composite-only: the element is promoted to its own GPU layer, and animating them just re-composites existing layers, skipping both layout and paint. Animating top/left/width/height triggers a full layout + paint + composite every frame on the main thread, which causes jank. Rule of thumb: animate transform and opacity, never geometry properties.",
      },
      {
        question: "What is layout thrashing and how do you avoid it?",
        answer:
          "Layout thrashing is forcing repeated synchronous reflows by interleaving DOM reads and writes. When you read a layout value like offsetHeight or getBoundingClientRect after writing a style, the browser must flush layout immediately to return an accurate answer; doing that in a loop reflows every iteration. Avoid it by batching all reads first, then all writes, and by scheduling visual updates inside requestAnimationFrame.",
      },
      {
        question: "Why is CSS render-blocking, and how do defer and async differ for scripts?",
        answer:
          "CSS is render-blocking because the browser needs the complete CSSOM before it can build the render tree and paint — otherwise you'd get a flash of unstyled content. For scripts: a plain <script> is parser-blocking (DOM construction stops until it downloads and runs); defer downloads in parallel and executes after parsing finishes, preserving order (best for app code); async executes as soon as it downloads with no order guarantee (good for independent third-party tags).",
      },
      {
        question: "Is the Virtual DOM faster than the real DOM?",
        answer:
          "Not intrinsically — a single real DOM operation is fast. The Virtual DOM's value is batching: React diffs a lightweight in-memory tree and applies the minimal set of real mutations in one pass, so the browser reflows and repaints once instead of many times. It optimizes how often you touch the DOM, not the speed of the DOM itself.",
      },
      {
        question: "What's the difference between display:none and visibility:hidden for the pipeline?",
        answer:
          "display:none removes the element from the render tree entirely — it produces no box, occupies no space, and costs nothing to lay out or paint. visibility:hidden keeps the element in the render tree — it still takes up space and still incurs layout cost — it's simply not painted. So toggling display:none changes layout, while toggling visibility only changes paint.",
      },
    ],
    thingsToRemember: [
      "Pipeline order: DNS -> TCP/TLS -> HTTP -> DOM + CSSOM -> Render Tree -> Layout -> Paint -> Composite.",
      "Layout = where/how big (geometry). Paint = filling pixels/colors. Composite = stacking layers onto the screen.",
      "Cost ladder: composite-only (transform/opacity) < paint-only (color/background) < layout/reflow (size/position/structure).",
      "Animate transform and opacity to stay on the cheapest, GPU-driven path; never animate top/left/width.",
      "CSS is render-blocking; a plain script is parser-blocking. Use defer for app code, async for third-party tags.",
      "Avoid layout thrashing: batch all DOM reads, then all writes; schedule visual updates with requestAnimationFrame.",
      "Reading offsetHeight/getBoundingClientRect/scrollTop after a write forces a synchronous reflow.",
      "display:none leaves the render tree (zero cost); visibility:hidden stays (still costs layout).",
      "The Virtual DOM batches mutations so the browser reflows once; it isn't a faster DOM.",
      "Frame budget is ~16.7ms at 60fps - long main-thread work causes jank.",
    ],
    references: [
      { label: "MDN — Critical rendering path", url: "https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path" },
      { label: "MDN — How browsers work (populating the page)", url: "https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work" },
      { label: "web.dev — Critical rendering path", url: "https://web.dev/articles/critical-rendering-path" },
      { label: "web.dev — Avoid large, complex layouts and layout thrashing", url: "https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing" },
      { label: "web.dev — Stick to compositor-only properties", url: "https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count" },
      { label: "W3C — CSS painting order & stacking contexts", url: "https://www.w3.org/TR/CSS22/zindex.html" },
    ],
    tags: ["browser", "rendering", "critical-rendering-path", "reflow", "repaint", "compositing", "layout-thrashing", "performance", "dom", "cssom"],
  },
  {
    id: "html-semantic-structure-forms",
    num: 2,
    title: "HTML (Semantic Structure & Forms)",
    part: "Web Foundations",
    partId: "a",
    difficulty: "Foundational",
    summary:
      "Semantic markup and accessible forms end to end: the document skeleton, landmark & sectioning elements, the heading outline, then native form controls, label association, input types, native validation, fieldset/legend grouping, and ARIA error messaging — meaning that machines and assistive tech get for free.",
    readingTime: 15,
    explanation: [
      "**Why 'semantic' matters at all.** HTML has two kinds of elements: **semantic** ones that describe *what the content is* (`<nav>`, `<article>`, `<button>`, `<label>`) and **generic** ones that mean nothing (`<div>`, `<span>`). The browser, search engines, and — most importantly — assistive technology like screen readers all build their understanding of your page from those meanings. Choose a `<div>` where a `<button>` belongs and you throw away keyboard support, focus behavior, and the announcement 'button' — then spend a day reimplementing it badly with JavaScript and ARIA. Semantics is the cheapest accessibility and SEO you will ever get.",
      "**The document skeleton.** Every page starts from a fixed frame: `<!DOCTYPE html>` (opts into standards mode), `<html lang=\"en\">` (the `lang` attribute drives screen-reader pronunciation and translation), a `<head>` for metadata the user never sees, and a `<body>` for everything they do. In the `<head>` the non-negotiables are `<meta charset=\"UTF-8\">` (so text decodes correctly), `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">` (so mobile browsers don't zoom out), and a descriptive `<title>` (the tab label and the primary SEO/social signal).",
      "**Landmarks — the page's regions.** Landmark elements let assistive tech jump straight to a region: `<header>` (intro/branding), `<nav>` (major navigation blocks), `<main>` (the primary content — **exactly one per page**), `<aside>` (tangential content like a sidebar), and `<footer>` (metadata, links, copyright). Screen-reader users navigate *by landmark* the way sighted users scan the page, so getting these right replaces the old 'skip to content' hacks. A `<div class=\"main\">` gives them none of this.",
      "**Sectioning & headings — the document outline.** `<section>` groups related content that usually has a heading; `<article>` is a self-contained, independently-distributable unit (a blog post, a product card, a comment). Inside them, headings `<h1>`–`<h6>` form a strict **outline**: one `<h1>` describing the page, then `<h2>` for major sections, `<h3>` nested under those, and so on. The cardinal rule: **never skip levels for visual size** (don't jump `<h1>` → `<h3>` because it 'looks right') — that breaks the outline screen readers rely on. Size with CSS; choose the level by *meaning*.",
      "**Text-level semantics.** Prefer meaning over appearance: `<strong>` (importance) and `<em>` (emphasis) over `<b>`/`<i>`; `<time datetime=\"2026-07-01\">` for machine-readable dates; `<abbr>`, `<code>`, `<blockquote>`/`<cite>` where they fit. `<figure>` + `<figcaption>` ties an image to its caption. And every content image needs an `alt` attribute: descriptive when it conveys information, or empty (`alt=\"\"`) when it's purely decorative so screen readers skip it.",
      "**Forms: use native controls first.** The single biggest accessibility win is reaching for real form elements — `<form>`, `<input>`, `<select>`, `<textarea>`, `<button>` — before building custom widgets. Native controls come with keyboard support, focus management, form submission, and screen-reader roles *built in and for free*. A `<div>` styled to look like a checkbox is invisible to assistive tech and un-tabbable; the native `<input type=\"checkbox\">` just works.",
      "**Labels — associate every input.** Every input needs a programmatic label, not just visible text nearby. The explicit form is `<label for=\"email\">Email</label>` paired with `<input id=\"email\">` — the `for` **must** match the input's `id`. This does two things: screen readers announce the label when the field is focused, and clicking the label focuses/activates the control (a bigger hit target, great on mobile). You can also wrap the input inside the `<label>` (implicit association). When a visible label isn't possible, use `aria-label` or `aria-labelledby` — but a real `<label>` is always preferred.",
      "**Input types do real work.** The `type` attribute is not just cosmetic: `email`, `url`, `tel`, `number`, `date`, `search`, `password`, `color`, `range` each bring built-in validation *and* the correct on-screen keyboard on mobile (an `@` key for email, a numeric pad for `number`). Pick the most specific type and the platform hands you validation and UX you'd otherwise script. Add `inputmode` and `autocomplete` (e.g. `autocomplete=\"email\"`) so browsers can autofill correctly — another accessibility and conversion win.",
      "**Native validation before JavaScript.** HTML gives you a validation layer with zero script: `required`, `min`/`max`/`step` (numbers, dates), `minlength`/`maxlength`, `pattern` (a regex), and type-based checks. The browser blocks submission and shows a message automatically. You can style validity with the `:valid`, `:invalid`, `:required`, and `:user-invalid` pseudo-classes. Only reach for the **Constraint Validation API** (`checkValidity()`, `setCustomValidity()`, the `ValidityState` object) when you need custom rules or custom messaging — build on top of native, don't replace it.",
      "**Grouping with fieldset & legend.** Related controls — especially radio buttons and checkboxes — belong in a `<fieldset>` with a `<legend>` describing the group. A screen reader then announces 'Shipping speed, Standard, radio button 1 of 3', giving the individual option its group context. Without it, users hear 'Standard, radio button' with no idea what question they're answering. This is the correct structure for any set of choices.",
      "**Accessible error messaging.** When validation fails, three things make it accessible: put the error text in an element referenced by the input's `aria-describedby` (so it's announced with the field), set `aria-invalid=\"true\"` on the failing input, and move focus to the first invalid field on submit. For errors that appear after the fact, an `aria-live=\"polite\"` (or `role=\"alert\"`) region announces them without the user hunting. Never signal an error with color alone — pair it with text and an icon for colorblind users.",
      "**The `<button>` vs `<div onclick>` trap.** A `<button>` is focusable, fires on Enter/Space, and is announced as 'button' — all automatic. A clickable `<div>` gets none of that; you'd have to add `tabindex=\"0\"`, `role=\"button\"`, and keydown handlers just to limp toward parity. Inside a form, remember `<button>` defaults to `type=\"submit\"` — set `type=\"button\"` explicitly for buttons that shouldn't submit, and always call `event.preventDefault()` in a JS-handled submit to stop the full-page reload.",
      "**SEO falls out of good structure.** Search crawlers read the same semantics assistive tech does. A single meaningful `<h1>`, a logical heading outline, landmark regions, descriptive `alt` text, and clean `<a href>` links let crawlers understand and rank your content. Semantic HTML plus fast rendering *is* technical SEO — no extra tags required.",
      "**The mental model (memorise this).** Pick the element that means what the content *is*, never what it *looks like* — CSS handles looks. Landmarks (`header`/`nav`/`main`/`footer`) frame the page, one `<h1>` and an unbroken heading outline structure it, native form controls with matched `<label for>`/`id`, correct `type`, and native validation handle input, and `<fieldset>`/`<legend>` + `aria-describedby`/`aria-invalid`/`aria-live` handle grouping and errors. Do this and accessibility, keyboard support, and SEO come essentially for free.",
    ],
    backendAnalogy:
      "Semantic HTML is like using a strongly-typed domain model instead of passing everything around as a `Map<String, Object>`. A `<button>` or `<input type=\"email\">` is a typed field with built-in validation and behavior, the way a `LocalDate` or a `@Email`-annotated field carries meaning and constraints; a `<div>` is the untyped blob you have to validate and interpret by hand. Native form validation (`required`, `pattern`, `min`) is your Bean Validation / JSR-380 annotations enforced at the edge before anything reaches your logic, and the Constraint Validation API is the programmatic validator you drop to only for custom rules. `<label for>`/`id` and `aria-*` are the metadata/contract (like OpenAPI annotations) that let other consumers — screen readers, crawlers — understand your fields without reading the implementation.",
    keyInsights: [
      "Choose elements by meaning, not appearance - CSS controls looks. A <button> beats a clickable <div> because focus, keyboard, and the 'button' role come for free.",
      "Landmarks (header, nav, main, aside, footer) let screen-reader users jump between regions; use exactly one <main> per page.",
      "Headings h1-h6 form a document outline - never skip a level for visual size, style with CSS instead.",
      "Every input needs a programmatic label: <label for=\"x\"> matched to <input id=\"x\">, or an implicit wrapping label; aria-label only when no visible label is possible.",
      "The input type attribute drives built-in validation and the correct mobile keyboard - always pick the most specific type.",
      "Prefer native validation (required, type, min/max, pattern, minlength) before JavaScript; drop to the Constraint Validation API only for custom rules.",
      "Group related radios/checkboxes in a <fieldset> with a <legend> so the group's question is announced.",
      "Accessible errors: aria-describedby links the message, aria-invalid marks the field, aria-live/role=alert announces it, and focus moves to the first error.",
      "Set the html lang attribute, meta charset UTF-8, and the responsive viewport meta - the baseline every page needs.",
      "Never convey errors or state with color alone; pair color with text and icons for colorblind users.",
    ],
    codeSamples: [
      {
        label: "Semantic page skeleton with landmarks & heading outline",
        language: "html",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Expense Dashboard — Acme</title>
</head>
<body>
  <header>
    <nav aria-label="Primary">
      <a href="/">Home</a> <a href="/reports">Reports</a>
    </nav>
  </header>

  <main>                     <!-- exactly ONE main per page -->
    <h1>My Expenses</h1>     <!-- the single page-level heading -->
    <section aria-labelledby="recent-h">
      <h2 id="recent-h">Recent</h2>   <!-- h2 under the h1 -->
      <article>
        <h3>Team lunch</h3>            <!-- h3 under the h2, no skipping -->
        <p><time datetime="2026-06-30">Jun 30</time> — $84.20</p>
      </article>
    </section>
  </main>

  <aside aria-label="Tips"><p>Log receipts within 48h.</p></aside>
  <footer><small>&copy; 2026 Acme Inc.</small></footer>
</body>
</html>`,
      },
      {
        label: "Accessible form: labels, input types, grouping & native validation",
        language: "html",
        code: `<form novalidate>            <!-- novalidate to control messaging in JS; still validate! -->
  <!-- explicit label: for MUST match the input id -->
  <label for="email">Work email</label>
  <input id="email" name="email" type="email"
         autocomplete="email" required
         aria-describedby="email-err" />
  <span id="email-err" role="alert"></span>

  <label for="amount">Amount (USD)</label>
  <input id="amount" name="amount" type="number"
         min="0" step="0.01" inputmode="decimal" required />

  <!-- group related radios so the legend is announced as the question -->
  <fieldset>
    <legend>Reimbursement speed</legend>
    <label><input type="radio" name="speed" value="standard" checked /> Standard</label>
    <label><input type="radio" name="speed" value="express" /> Express</label>
  </fieldset>

  <!-- type=submit is the default inside a form; be explicit for clarity -->
  <button type="submit">Submit expense</button>
</form>`,
      },
      {
        label: "Progressive enhancement with the Constraint Validation API",
        language: "ts",
        code: `const form = document.querySelector<HTMLFormElement>("form")!;
const email = document.querySelector<HTMLInputElement>("#email")!;
const emailErr = document.querySelector<HTMLElement>("#email-err")!;

// Custom rule layered ON TOP of native validation.
email.addEventListener("input", () => {
  // clear any custom error so the field can pass again
  email.setCustomValidity("");
  if (email.value.endsWith("@example.com")) {
    email.setCustomValidity("Personal example.com addresses aren't allowed.");
  }
});

form.addEventListener("submit", (e) => {
  // checkValidity() runs BOTH native constraints and our custom one
  if (!form.checkValidity()) {
    e.preventDefault();                 // stop the full-page reload
    const firstInvalid = form.querySelector<HTMLInputElement>(":invalid");
    if (firstInvalid) {
      firstInvalid.setAttribute("aria-invalid", "true");
      emailErr.textContent = firstInvalid.validationMessage; // announced via role=alert
      firstInvalid.focus();             // move focus to the first error
    }
    return;
  }
  e.preventDefault();
  console.log("valid -> would submit", new FormData(form).get("email"));
});`,
      },
      {
        label: "Styling validity states with pseudo-classes",
        language: "css",
        code: `/* Native validity pseudo-classes — no JS needed for the visuals */
input:required        { border-left: 3px solid #6366f1; } /* mark required */
input:focus-visible   { outline: 2px solid #4f46e5; outline-offset: 2px; }

/* :user-invalid only styles AFTER the user has interacted — avoids
   yelling 'invalid' at an empty field the moment the page loads. */
input:user-invalid    { border-color: #dc2626; }
input:user-invalid + [role="alert"] { color: #dc2626; }

/* Never rely on color alone: pair it with an icon/marker for colorblind users */
input:user-invalid { background-image: url("data:image/svg+xml,%3Csvg/%3E"); }`,
      },
    ],
    runnable: {
      title: "Accessible form with native + custom validation and announced errors",
      html: `<main>
  <h1>Submit an expense</h1>
  <form id="f" novalidate>
    <label for="email">Work email</label>
    <input id="email" name="email" type="email" required aria-describedby="err" />
    <span id="err" role="alert"></span>
    <fieldset>
      <legend>Speed</legend>
      <label><input type="radio" name="speed" value="std" checked /> Standard</label>
      <label><input type="radio" name="speed" value="exp" /> Express</label>
    </fieldset>
    <button type="submit">Submit</button>
  </form>
</main>`,
      css: `body { font-family: system-ui, sans-serif; padding: 16px; }
label { display:block; font-weight:600; margin:10px 0 4px; }
input[type=email] { padding:8px; border:1px solid #ccc; border-radius:8px; width:260px; }
input:user-invalid { border-color:#dc2626; }
fieldset { margin-top:12px; border:1px solid #ddd; border-radius:8px; }
[role=alert] { color:#dc2626; display:block; min-height:1.2em; }
button { margin-top:12px; padding:8px 16px; border:0; border-radius:8px; background:#4f46e5; color:#fff; cursor:pointer; }`,
      js: `var form = document.getElementById("f");
var email = document.getElementById("email");
var err = document.getElementById("err");

email.addEventListener("input", function () {
  email.setCustomValidity("");
  if (email.value.indexOf("@example.com") !== -1) {
    email.setCustomValidity("example.com addresses aren't allowed.");
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!form.checkValidity()) {
    email.setAttribute("aria-invalid", "true");
    err.textContent = email.validationMessage; // announced via role=alert
    email.focus();
    console.log("blocked ->", email.validationMessage);
    return;
  }
  email.setAttribute("aria-invalid", "false");
  err.textContent = "";
  var data = new FormData(form);
  console.log("valid submit -> email:", data.get("email"), "speed:", data.get("speed"));
});

console.log("Try submitting empty, then an @example.com address, then a valid one.");`,
    },
    interviewQA: [
      {
        question: "Why use semantic HTML instead of div soup?",
        answer:
          "Semantic elements describe the role of content, so browsers, assistive tech, and crawlers understand the page for free. Screen-reader users navigate by landmarks like main and nav; a logical heading outline gives them structure; search engines rank content they can understand. A page of nested divs conveys no meaning, so you'd have to reimplement focus, keyboard, and roles by hand with ARIA — badly. Semantics is the cheapest accessibility and SEO you can get.",
      },
      {
        question: "How do you make a form accessible?",
        answer:
          "Associate every input with a <label> via matching for/id (or wrap it), use the most specific input type, mark required fields, group related radios/checkboxes with <fieldset>/<legend>, and surface errors by linking the message with aria-describedby, marking the field aria-invalid, announcing via aria-live or role=alert, and moving focus to the first invalid control. Lean on native controls and native validation first — they bring keyboard and screen-reader support built in.",
      },
      {
        question: "What's the difference between a <label> for/id association and aria-label?",
        answer:
          "<label for=\"x\"> tied to <input id=\"x\"> is the preferred, most robust association: it's announced by screen readers AND makes clicking the label focus the control (a bigger touch target). aria-label puts an accessible name directly on the element as an attribute but provides no clickable target and no visible text; use it only when a visible label isn't feasible. aria-labelledby references another visible element's text as the name.",
      },
      {
        question: "Why prefer native form validation over writing your own in JavaScript?",
        answer:
          "Attributes like required, type=email, min/max/step, minlength, and pattern give you validation, blocked submission, and a built-in error message with zero script, plus the correct mobile keyboard from the type. You get :valid/:invalid/:user-invalid pseudo-classes for styling. You only drop to the Constraint Validation API (checkValidity, setCustomValidity) for custom rules or custom messaging — building on top of native rather than replacing it.",
      },
      {
        question: "Why use a <button> instead of a clickable <div>?",
        answer:
          "A <button> is focusable, activates on Enter and Space, is announced as 'button', and participates in form submission — all automatically. A clickable <div> has none of that; you'd need tabindex=0, role=button, and keydown handlers to approximate it, and still likely get it wrong. Inside a form, note <button> defaults to type=submit, so set type=button for non-submitting buttons.",
      },
      {
        question: "What does the fieldset/legend pair do for accessibility?",
        answer:
          "It groups related controls — especially radio buttons and checkboxes — and gives the group a name via the legend. A screen reader then announces the legend as context for each option, e.g. 'Shipping speed, Standard, radio 1 of 3', so the user knows which question the options answer. Without it, individual radios are announced with no group context.",
      },
      {
        question: "How should validation errors be communicated accessibly?",
        answer:
          "Reference the error text from the input via aria-describedby so it's read out with the field, set aria-invalid=\"true\" on the failing control, and move keyboard focus to the first invalid field on submit. For errors appearing dynamically, put them in an aria-live=\"polite\" region or one with role=\"alert\" so they're announced. Crucially, never signal an error with color alone — include text and an icon for colorblind users.",
      },
      {
        question: "Why must you not skip heading levels?",
        answer:
          "Headings h1–h6 form the document outline that screen-reader users navigate with (jumping heading to heading). Skipping from h1 to h3 because it looks the right size breaks that outline and confuses the structure. Choose the heading level by meaning and hierarchy, and control the visual size with CSS instead.",
      },
    ],
    thingsToRemember: [
      "Pick elements by meaning, not looks; CSS controls appearance. <button> beats a clickable <div>.",
      "Landmarks: header, nav, main (exactly one per page), aside, footer - screen readers navigate by them.",
      "Headings h1-h6 are an outline; never skip levels for visual size, style with CSS.",
      "label[for] must match input[id]; clicking the label then focuses the input.",
      "input type drives native validation AND the right mobile keyboard - pick the most specific.",
      "Prefer native validation (required, type, min/max, pattern) before JS; use the Constraint Validation API only for custom rules.",
      "Group related radios/checkboxes in <fieldset> with a <legend>.",
      "Accessible errors: aria-describedby + aria-invalid + aria-live/role=alert + focus the first error.",
      "Baseline head: lang on <html>, <meta charset=\"UTF-8\">, responsive viewport meta, descriptive <title>.",
      "Never convey state with color alone; every content <img> needs alt (empty alt=\"\" if decorative).",
    ],
    references: [
      { label: "MDN — HTML elements reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element" },
      { label: "MDN — Web forms (learn)", url: "https://developer.mozilla.org/en-US/docs/Learn/Forms" },
      { label: "MDN — Client-side form validation", url: "https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation" },
      { label: "web.dev — Learn Forms", url: "https://web.dev/learn/forms" },
      { label: "W3C WAI — Forms tutorial", url: "https://www.w3.org/WAI/tutorials/forms/" },
      { label: "W3C WAI — Accessibility fundamentals", url: "https://www.w3.org/WAI/fundamentals/" },
    ],
    tags: ["html", "semantics", "forms", "accessibility", "a11y", "landmarks", "aria", "validation", "seo"],
  },
  {
    id: "css-fundamentals",
    num: 3,
    title: "CSS Fundamentals (Selectors, Specificity, Box Model)",
    part: "Web Foundations",
    partId: "a",
    difficulty: "Foundational",
    summary:
      "The complete CSS foundation: how styling works, every selector type, the cascade & specificity, inheritance, units, colors, the box model, display & positioning, and modern layout — beginner to advanced in one page.",
    readingTime: 22,
    explanation: [
      "**What is CSS?** CSS (Cascading Style Sheets) is the language that controls how HTML *looks* — color, spacing, size, position, typography, and motion. HTML gives a page structure and meaning; CSS gives it presentation. The word **Cascading** is the important one: many rules can target the same element, and CSS has a precise, deterministic set of rules for deciding which one wins. Master the cascade and CSS stops feeling random.",
      "**Anatomy of a rule.** Every CSS rule has two parts: a **selector** (which elements to style) and a **declaration block** (what to do to them). Inside the block are **declarations**, each a `property: value;` pair. Example: `p { color: navy; font-size: 16px; }` — the selector is `p`, and there are two declarations. Whitespace doesn't matter; the semicolons and braces do.",
      "**Three ways to apply CSS.** (1) **Inline** — a `style` attribute on one element: `<p style=\"color:red\">`. Highest priority, hardest to maintain, avoid it. (2) **Internal** — a `<style>` block in the `<head>`. Fine for a single page. (3) **External** — a `.css` file linked with `<link rel=\"stylesheet\" href=\"styles.css\">`. This is the standard: one stylesheet shared across many pages, cached by the browser.",
      "**Selectors — how you target elements.** This is the vocabulary you use constantly. **Type/element** (`p`, `h1`) matches every element of that tag. **Class** (`.card`) matches every element with `class=\"card\"` — reusable, your everyday workhorse. **ID** (`#header`) matches the single element with that `id` — unique per page. **Universal** (`*`) matches everything. **Attribute** (`[type=\"email\"]`, `[disabled]`) matches by attribute. You combine them: `input.primary[required]` means an `<input>` that has class `primary` AND the `required` attribute.",
      "**Combinators — selecting by relationship.** **Descendant** (`.card p`) — any `<p>` anywhere inside `.card`. **Child** (`.card > p`) — only *direct* children. **Adjacent sibling** (`h2 + p`) — the `<p>` immediately after an `<h2>`. **General sibling** (`h2 ~ p`) — all `<p>` siblings after an `<h2>`. **Grouping** (`h1, h2, h3`) — apply the same rule to several selectors at once (the comma means OR).",
      "**Pseudo-classes — state and position.** A pseudo-class (`:`) styles an element in a particular *state* or *position* without needing extra classes. State: `:hover`, `:focus`, `:active`, `:visited`, `:checked`, `:disabled`. Structural: `:first-child`, `:last-child`, `:nth-child(2n)` (even rows), `:not(.disabled)` (negation). These are dynamic — `:hover` applies only while the mouse is over the element.",
      "**Pseudo-elements — styling a *part* of an element.** A pseudo-element (`::`, double colon) styles a sub-part: `::before` and `::after` inject generated content (great for icons/decoration, need a `content` value), `::first-line`, `::first-letter`, `::placeholder`, `::selection`. Rule of thumb: pseudo-*class* = a state; pseudo-*element* = a piece.",
      "**The cascade (how conflicts resolve).** When several rules set the same property on the same element, CSS decides the winner in this order: (1) **Origin & importance** — an author `!important` beats normal author rules, which beat the browser defaults. (2) **Specificity** — the more specific selector wins. (3) **Source order** — if specificity ties, the rule that comes *later* wins. That's the whole algorithm. 'My style is ignored' is almost always a specificity problem, not a bug.",
      "**Specificity, precisely.** Specificity is a tuple **(a, b, c)** you can literally count: **a** = number of IDs, **b** = number of classes + attributes + pseudo-classes, **c** = number of element types + pseudo-elements. Compare left to right, like version numbers. Examples: `p` → (0,0,1); `.card` → (0,1,0); `#main` → (1,0,0); `nav ul li a` → (0,0,4); `.nav a:hover` → (0,2,1). Inline `style=\"\"` sits above all selectors, and `!important` sits above everything. `(0,1,0)` beats `(0,0,4)` — one class outranks any number of element selectors.",
      "**Inheritance — some properties flow down.** Many *text-related* properties (`color`, `font-family`, `font-size`, `line-height`, `text-align`, `visibility`) are **inherited**: set them on a parent and children get them automatically. Most *box/layout* properties (`width`, `padding`, `margin`, `border`, `background`) are **not** inherited — that would be chaos. You can force it with the keyword `inherit`, reset with `initial`, or use `unset` (inherit if the property normally inherits, else initial).",
      "**Units — absolute vs relative.** **Absolute:** `px` (one CSS pixel; predictable, most common). **Relative:** `%` (of the parent), `em` (relative to the element's own font-size — compounds when nested), `rem` (relative to the *root* font-size — predictable, best for type & spacing), `vw`/`vh` (1% of viewport width/height), `ch` (width of a `0`), `fr` (a fraction of free space, Grid only). Prefer `rem` for typography and spacing so the layout respects the user's font-size preference; use `px` for hairline borders.",
      "**Colors.** Several notations, all interchangeable: named (`red`), hex (`#4f46e5`, or `#4f46e580` with alpha), `rgb(79 70 229)` / `rgba(...)` for opacity, and `hsl(240 84% 59%)` — Hue-Saturation-Lightness, the most human-friendly (nudge lightness to make tints/shades of the same hue). Modern CSS also has `oklch()` for perceptually uniform colors.",
      "**The box model — every element is a box.** From the inside out: **content** (text/image) → **padding** (space *inside* the border, shares the background) → **border** → **margin** (transparent space *outside*, separates this box from others). Two gotchas: **margins collapse** — vertical margins between stacked block elements merge into the larger of the two, they don't add up. And by default `width` sets only the *content* width, so padding and border are *added on top* — a `width:320px` box with `padding:16px` and a `1px` border is actually 354px wide.",
      "**box-sizing: border-box — the one fix everyone applies.** Set `box-sizing: border-box` and `width`/`height` now *include* padding and border, so `width:320px` really renders 320px wide no matter the padding. Apply it globally (`*, *::before, *::after { box-sizing: border-box; }`) at the top of every project — it eliminates the constant arithmetic and is the single most useful CSS reset.",
      "**display — the box's fundamental behavior.** `block` (starts on a new line, fills available width — `<div>`, `<p>`). `inline` (flows within text, ignores width/height & top/bottom margin — `<span>`, `<a>`). `inline-block` (flows inline but respects width/height/padding). `none` (removed entirely — no box, no space, excluded from layout). `flex` and `grid` turn an element into a layout container for its children (covered in depth in the next topic).",
      "**position — taking a box out of normal flow.** `static` (default, normal flow). `relative` (nudged from its normal spot with `top/left`, but its original space is preserved — and it becomes a positioning context). `absolute` (removed from flow, positioned relative to the nearest *positioned* ancestor). `fixed` (positioned relative to the viewport — stays put on scroll, e.g. a sticky header). `sticky` (acts relative until you scroll past a threshold, then sticks). Stacking is controlled by `z-index`, which only works on positioned elements.",
      "**The mental model (memorise this).** Selector picks the elements → the cascade + specificity decides which conflicting rule wins → inherited properties flow down the tree → the box model sizes each element → `display` and `position` place it. Everything else in CSS is a property you look up; these five ideas are the engine.",
    ],
    backendAnalogy:
      "Specificity is like method overload resolution in Java — when several candidates match, the most specific signature wins, deterministically. The cascade is a priority queue: importance, then specificity, then declaration order break every tie, so nothing is ever ambiguous. Reaching for `!important` is like casting to bypass the type system — it works, but it's a code smell signalling your selectors (your 'types') are wrong. Inheritance is your DI container passing shared config down the object graph; `box-sizing: border-box` is choosing a saner default so you stop doing the same arithmetic in every constructor.",
    keyInsights: [
      "A rule = selector + declaration block; a declaration = property: value. Prefer external stylesheets over internal, and never inline for anything reusable.",
      "Specificity is a countable tuple (IDs, classes/attrs/pseudo-classes, elements) compared left-to-right. (0,1,0) beats (0,0,99) — one class outranks any number of element selectors.",
      "The full cascade: importance/origin → specificity → source order (later wins). That resolves every conflict deterministically.",
      "Reaching for !important is almost always a symptom of a specificity problem — fix the selector instead.",
      "Text properties (color, font, line-height) inherit; box properties (width, margin, padding, border) do not. Use inherit / initial / unset to control it explicitly.",
      "Use rem for type & spacing (respects user font-size), px for hairline borders, % / vw / vh for fluid sizing, fr for Grid tracks.",
      "Box model outside-in: content → padding → border → margin. Vertical margins between block elements COLLAPSE to the larger value; they don't add.",
      "box-sizing: border-box on *, *::before, *::after makes width include padding + border — apply it globally, it's the most useful reset.",
      "display sets a box's nature (block/inline/inline-block/none/flex/grid); position (relative/absolute/fixed/sticky) takes it out of normal flow; z-index only affects positioned elements.",
      "Pseudo-CLASS (:hover, :nth-child) = a state or position; pseudo-ELEMENT (::before, ::first-line) = styling a part of the element.",
    ],
    codeSamples: [
      {
        label: "Selectors, combinators, pseudo-classes & pseudo-elements",
        language: "css",
        code: `/* Type / class / id / universal */
p            { line-height: 1.6; }   /* every <p>            (0,0,1) */
.card        { padding: 16px; }      /* class="card"         (0,1,0) */
#main        { max-width: 1100px; }  /* id="main" (unique)   (1,0,0) */
*            { margin: 0; }          /* everything           (0,0,0) */

/* Attribute selectors */
input[type="email"] { border-color: teal; }
a[href^="https"]    { color: green; }   /* starts with https */

/* Combinators */
.card p       { color: #333; }   /* descendant: any p inside .card */
.card > p     { font-weight: 600; } /* child: direct children only */
h2 + p        { margin-top: 0; } /* adjacent sibling right after h2 */
h1, h2, h3    { font-family: Georgia; } /* grouping (comma = OR) */

/* Pseudo-classes: state & structure */
a:hover              { text-decoration: underline; }
input:focus          { outline: 2px solid dodgerblue; }
li:nth-child(2n)     { background: #f5f5f5; }  /* even rows */
button:not(:disabled){ cursor: pointer; }

/* Pseudo-elements: style a PART of the element */
.quote::before  { content: "\\201C"; }     /* injected open-quote */
p::first-line   { font-weight: 700; }
::selection     { background: gold; }`,
      },
      {
        label: "The cascade & specificity — who wins?",
        language: "css",
        code: `/* Same element <p id="lead" class="intro">, four rules target it. */
p              { color: gray;  }  /* (0,0,1) */
.intro         { color: blue;  }  /* (0,1,0) */
#lead          { color: green; }  /* (1,0,0)  <-- WINS on specificity */
p.intro        { color: teal;  }  /* (0,1,1)  loses to the id above  */

/* Source order breaks a TIE (same specificity) */
.btn { background: navy; }
.btn { background: crimson; }     /* later wins -> crimson */

/* !important overrides specificity (use sparingly) */
.alert { color: red !important; } /* beats even an inline style */`,
      },
      {
        label: "Box model + global border-box reset",
        language: "css",
        code: `/* The reset every project should start with */
*, *::before, *::after { box-sizing: border-box; margin: 0; }

.card {
  width: 320px;        /* WITH border-box this is the true rendered width */
  padding: 16px;       /* space inside the border */
  border: 1px solid #ddd;
  margin: 12px;        /* space outside; collapses vertically with neighbours */
  border-radius: 8px;
}

/* Without border-box the same box would render 320 + 32 + 2 = 354px wide.
   With border-box it renders exactly 320px. That predictability is the point. */`,
      },
      {
        label: "Inheritance, units & positioning",
        language: "css",
        code: `:root { font-size: 16px; }        /* 1rem = 16px everywhere */

body {
  color: #222;                    /* inherited by all descendants */
  font-family: system-ui, sans-serif;  /* inherited */
  line-height: 1.6;               /* inherited */
}

.spacer { margin-block: 1.5rem; } /* rem: scales with root font-size */
.hero   { min-height: 60vh; }     /* vh: 60% of viewport height    */

/* position: fixed header that stays on scroll, above other content */
.header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;                   /* z-index needs a positioned element */
}

/* position: absolute badge, anchored to its relatively-positioned card */
.card       { position: relative; }
.card .badge{ position: absolute; top: 8px; right: 8px; }`,
      },
    ],
    runnable: {
      title: "Play with the box model, specificity & pseudo-classes live",
      html: `<div id="card" class="card special">
  <span class="badge">NEW</span>
  <h3>Hover me & watch specificity</h3>
  <p>This paragraph inherits its color from the card.</p>
  <button>Interactive button</button>
</div>`,
      css: `/* GLOBAL RESET — try commenting this out to see width jump */
*, *::before, *::after { box-sizing: border-box; }

body { font-family: system-ui, sans-serif; padding: 20px; background:#f1f5f9; }

/* SPECIFICITY DEMO: three rules set color on .card's text.
   .special (0,1,0) and #card (1,0,0) both win over p — id wins overall. */
p          { color: gray;  }   /* (0,0,1) */
.special   { color: teal;  }   /* (0,1,0) */
#card      { color: #0f172a; } /* (1,0,0) -> this one wins */

.card {
  position: relative;          /* positioning context for the badge */
  width: 320px;                /* true width thanks to border-box */
  max-width: 100%;
  padding: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 14px;
  background: #fff;
  transition: transform .15s, box-shadow .15s;
}
.card:hover {                  /* pseudo-CLASS: a state */
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,.12);
}

.badge {                       /* absolutely positioned inside the card */
  position: absolute;
  top: 10px; right: 10px;
  background: #4f46e5; color: #fff;
  font-size: 11px; font-weight: 800;
  padding: 3px 8px; border-radius: 999px;
}

button {
  margin-top: 12px; padding: 8px 16px;
  border: 0; border-radius: 8px;
  background: #4f46e5; color: #fff; cursor: pointer;
}
button:hover     { background: #4338ca; }   /* state */
button:active    { transform: scale(.97); }`,
      js: `// Toggle a class to SEE the cascade change specificity live.
const card = document.querySelector('#card');
card.querySelector('button').addEventListener('click', () => {
  card.classList.toggle('special');
  console.log('.special toggled ->', card.classList.contains('special')
    ? 'class rule active (but #card id still wins the color)'
    : 'class rule removed');
});`,
    },
    interviewQA: [
      {
        question: "How is CSS specificity calculated, and how do you resolve a conflict?",
        answer:
          "Specificity is a tuple (IDs, classes/attributes/pseudo-classes, type/pseudo-elements) — count each and compare left to right like version numbers. Inline styles sit above all selectors, and !important sits above everything. If two rules have equal specificity, source order decides — the later rule wins. So the full resolution order is: importance/origin → specificity → source order.",
      },
      {
        question: "What does box-sizing: border-box do and why apply it globally?",
        answer:
          "By default (content-box) width sets only the content width, so padding and border are added on top — a 320px box with 16px padding and a 1px border actually renders 354px wide. border-box makes width/height include padding and border, so the declared size is the rendered size. Applying it globally via *, *::before, *::after removes constant arithmetic and makes layouts predictable.",
      },
      {
        question: "Which CSS properties are inherited, and which aren't?",
        answer:
          "Text-related properties inherit — color, font-family, font-size, line-height, text-align, visibility. Box/layout properties do not — width, height, margin, padding, border, background. You can override the default with the keywords inherit (force inheritance), initial (reset to default), or unset (inherit if the property normally inherits, otherwise initial).",
      },
      {
        question: "What's the difference between a pseudo-class and a pseudo-element?",
        answer:
          "A pseudo-class (single colon, e.g. :hover, :focus, :nth-child) targets an element in a particular state or structural position. A pseudo-element (double colon, e.g. ::before, ::first-line, ::placeholder) styles a specific part of an element or injects generated content. Mnemonic: pseudo-class = a state, pseudo-element = a piece.",
      },
      {
        question: "Explain the difference between relative, absolute, fixed, and sticky positioning.",
        answer:
          "static is the default (normal flow). relative nudges an element from its normal position while keeping its original space, and creates a positioning context. absolute removes the element from flow and positions it relative to the nearest positioned ancestor. fixed positions relative to the viewport and stays put on scroll. sticky behaves like relative until a scroll threshold, then sticks like fixed within its container.",
      },
      {
        question: "What are margin collapsing and the difference between margin and padding?",
        answer:
          "Padding is space inside the border (shares the element's background); margin is transparent space outside the border that separates elements. Margin collapsing means adjacent vertical margins between block elements merge into the single larger value rather than summing — so a 20px bottom margin next to a 30px top margin yields 30px of gap, not 50px. Horizontal margins and padding never collapse.",
      },
      {
        question: "When would you use rem vs em vs px?",
        answer:
          "px is a fixed absolute unit — good for hairline borders. em is relative to the element's own font-size and compounds when nested, which can get unpredictable. rem is relative to the root font-size, so it's predictable and scales with the user's browser font-size preference — the best default for typography and spacing (accessibility win).",
      },
    ],
    thingsToRemember: [
      "Rule = selector + { property: value; }. Prefer external stylesheets; avoid inline styles.",
      "Cascade order: importance/origin → specificity → source order (later wins).",
      "Specificity tuple: (IDs, classes/attrs/pseudo-classes, elements). One class (0,1,0) beats any number of elements.",
      "!important is a red flag — fix the selector instead of escalating.",
      "Text props inherit (color, font, line-height); box props don't (width, margin, padding).",
      "Box model outside-in: content → padding → border → margin. Vertical margins collapse.",
      "Always set box-sizing: border-box globally.",
      "Units: rem for type/spacing, px for borders, % / vw / vh for fluid sizing, fr for Grid.",
      "position: relative (context, keeps space) / absolute (nearest positioned ancestor) / fixed (viewport) / sticky (relative→fixed). z-index needs positioning.",
      "Pseudo-class (:hover) = state; pseudo-element (::before) = a part.",
    ],
    references: [
      { label: "MDN — CSS first steps", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps" },
      { label: "MDN — Specificity", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity" },
      { label: "MDN — The box model", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model" },
      { label: "MDN — CSS selectors reference", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors" },
      { label: "MDN — Cascade, specificity & inheritance", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade" },
      { label: "web.dev — Learn CSS", url: "https://web.dev/learn/css" },
    ],
    tags: ["css", "specificity", "box-model", "selectors", "cascade", "inheritance", "positioning", "units", "fundamentals"],
  },
  {
    id: "flexbox-and-grid",
    num: 4,
    title: "Flexbox & Grid Layout",
    part: "Web Foundations",
    partId: "a",
    difficulty: "Foundational",
    summary:
      "Modern CSS layout end to end: the flex container & item model, main/cross axis, every flex property, then CSS Grid's tracks, lines, areas, auto-fill/minmax, and exactly when to reach for each.",
    readingTime: 20,
    explanation: [
      "**Why layout modules exist.** Before Flexbox and Grid, developers centered boxes and built columns with `float`, `display: inline-block`, `table` hacks, and absolute positioning — fragile techniques that fought the browser. Flexbox (2015) and Grid (2017) are purpose-built layout engines. The rule of thumb: **Flexbox for one dimension** (a row *or* a column), **Grid for two dimensions** (rows *and* columns at once). They aren't rivals — you nest them constantly: Grid for the page shell, Flexbox inside each region.",
      "**Flexbox: the container/item model.** You turn an element into a **flex container** with `display: flex`. Its *direct children* automatically become **flex items** and lay out along a single axis. Nothing else needs `display` — the magic is on the parent. Everything in Flexbox is described in terms of two axes, so get those straight first.",
      "**The two axes (the key mental model).** The **main axis** is the direction items flow, set by `flex-direction` (default `row` = left→right). The **cross axis** is perpendicular to it. `justify-content` aligns items **along the main axis**; `align-items` aligns them **along the cross axis**. Flip `flex-direction` to `column` and the axes swap — main becomes vertical — which trips up beginners constantly. When alignment 'goes the wrong way,' check which axis is which.",
      "**Container properties (set on the parent).** `flex-direction` (row | row-reverse | column | column-reverse) — the main axis. `flex-wrap` (nowrap | wrap) — whether items overflow or wrap to new lines; `flex-flow` is shorthand for both. `justify-content` (flex-start | center | flex-end | space-between | space-around | space-evenly) — main-axis distribution. `align-items` (stretch | flex-start | center | flex-end | baseline) — cross-axis alignment of each line. `align-content` — spacing *between* wrapped lines (only matters with multiple lines). `gap` — space between items (use this, not margins).",
      "**Item properties (set on the children).** `flex-grow` (how much a spare space an item soaks up; default 0 = don't grow). `flex-shrink` (how readily it shrinks below its base size; default 1). `flex-basis` (the item's starting size before grow/shrink — `auto` uses its content/width). The shorthand **`flex: <grow> <shrink> <basis>`** bundles all three: `flex: 1` means `1 1 0` (grow equally from zero — equal-width columns); `flex: 0 0 240px` means a fixed 240px sidebar that never grows or shrinks. `align-self` overrides `align-items` for one item; `order` reorders items visually without touching the HTML.",
      "**Centering — the thing everyone Googles.** Perfectly centering a box is now three lines: `display: flex; justify-content: center; align-items: center;`. That centers on both axes regardless of the child's size. This single pattern replaced a decade of `margin: auto` / `transform: translate(-50%,-50%)` tricks.",
      "**CSS Grid: two dimensions at once.** `display: grid` makes a **grid container**; you then define **tracks** (columns and rows) with `grid-template-columns` and `grid-template-rows`. Between tracks are **grid lines** (numbered from 1). Items are placed into **cells**, or span multiple cells to form an **area**. Unlike Flexbox (content-driven, one axis), Grid is **layout-driven**: you define the structure up front and drop content into it.",
      "**Defining tracks & the `fr` unit.** `grid-template-columns: 200px 1fr 1fr` makes a fixed 200px column then two flexible columns. **`fr`** means 'one fraction of the leftover space' — `1fr 1fr` splits remaining space evenly; `2fr 1fr` gives the first twice as much. **`repeat(3, 1fr)`** is shorthand for three equal columns. `minmax(min, max)` bounds a track: `minmax(200px, 1fr)` never shrinks below 200px but grows to fill. Use `gap` (or `row-gap`/`column-gap`) for gutters.",
      "**The responsive grid with no media queries.** The famous one-liner: `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))`. The browser fits **as many 240px-min tracks as the container allows**, then stretches them to fill — cards reflow from 4 columns to 1 as the screen narrows, with zero breakpoints. **`auto-fit`** is the sibling: identical, except it *collapses* empty tracks so the existing items stretch to fill the whole row. Use `auto-fill` to keep the grid slots, `auto-fit` to stretch content edge-to-edge.",
      "**Placing items: lines, span, and areas.** Place an item by line number: `grid-column: 1 / 3` (from line 1 to line 3 = spans 2 columns), or `grid-column: span 2`. For readable layouts, name regions with **`grid-template-areas`**: draw the layout as ASCII strings on the container, then assign each child a `grid-area` name. This makes a header/sidebar/main/footer shell self-documenting and trivial to rearrange at breakpoints.",
      "**Alignment in Grid.** Grid has the same alignment vocabulary as Flexbox, doubled for two axes: `justify-items`/`align-items` align content *within* each cell (inline / block axis), and `justify-content`/`align-content` align the *whole grid* within the container when tracks don't fill it. `place-items: center` is the shorthand to center content in every cell.",
      "**Flexbox vs Grid — how to choose.** Ask: *do I control one axis or two?* One row/column where item sizes flow from content (toolbar, tag list, button group, nav) → **Flexbox**. A defined 2D structure (page shell, dashboard, image gallery, form grid) → **Grid**. When in doubt: if you're writing `flex-direction` and thinking about a single line of items, it's Flex; if you're drawing rows *and* columns, it's Grid. Real apps use both — Grid outside, Flex inside cells.",
      "**Common gotchas.** (1) Flex/Grid properties only affect **direct children** — a wrapper `<div>` breaks the relationship. (2) `justify-content` vs `align-items` confusion comes from forgetting the axis flips with `flex-direction`. (3) `flex: 1` on items includes `flex-basis: 0`, so items size purely by grow ratio, ignoring content width — use `flex: 1 1 auto` to respect content. (4) A flex item with long content can overflow because its default `min-width` is `auto`; fix with `min-width: 0`. (5) `gap` in Flexbox is well-supported now — stop using margin hacks.",
      "**The mental model (memorise this).** Flexbox = one axis, content-first, container sets direction + distribution, items grow/shrink/basis. Grid = two axes, layout-first, container defines tracks/areas, items placed onto lines. `justify-*` = main/inline axis, `align-*` = cross/block axis. `gap` for spacing everywhere. Reach for Grid to structure the page, Flexbox to arrange things within it.",
    ],
    backendAnalogy:
      "Think of Flexbox like a single-column processing pipeline where each stage (item) can be weighted to take a share of throughput — `flex-grow` is the weight in a weighted round-robin, `flex-basis` the reserved baseline capacity. Grid is more like defining a fixed schema / table layout up front (columns and rows declared, cells addressed by coordinate) and then binding records into it — `grid-template-areas` is the declarative mapping, like a layout config file, versus Flexbox's imperative 'flow them in order.'",
    keyInsights: [
      "Flexbox = one dimension (a row OR a column); Grid = two dimensions (rows AND columns). They nest: Grid for the shell, Flexbox inside.",
      "Flex properties split into container props (flex-direction, justify-content, align-items, flex-wrap, gap) and item props (flex-grow/shrink/basis, align-self, order).",
      "justify-content aligns along the MAIN axis; align-items aligns along the CROSS axis. The axes swap when flex-direction is column.",
      "flex: 1 means 1 1 0 (grow equally from zero → equal columns); flex: 0 0 240px is a fixed non-flexing track.",
      "Center anything: display:flex; justify-content:center; align-items:center. Three lines, both axes.",
      "The fr unit is a fraction of leftover space; repeat() and minmax() build flexible tracks.",
      "repeat(auto-fill, minmax(240px, 1fr)) = responsive card grid with zero media queries. auto-fit collapses empty tracks to stretch content.",
      "Place grid items by line number (grid-column: 1 / 3) or name regions with grid-template-areas for self-documenting layouts.",
      "Flex/Grid properties only affect DIRECT children — an extra wrapper div breaks them.",
      "gap works in both Flexbox and Grid — prefer it over margins for inter-item spacing.",
    ],
    codeSamples: [
      {
        label: "Flexbox: container + item properties explained",
        language: "css",
        code: `/* CONTAINER — turns children into flex items along the main axis */
.toolbar {
  display: flex;
  flex-direction: row;          /* main axis = horizontal (default) */
  justify-content: space-between; /* main-axis distribution */
  align-items: center;          /* cross-axis alignment */
  flex-wrap: wrap;              /* allow items to wrap to new lines */
  gap: 12px;                    /* space between items (not margins) */
}

/* ITEMS — control how each child flexes */
.logo    { flex: 0 0 auto; }    /* don't grow/shrink: natural size */
.search  { flex: 1 1 auto; }    /* grow to fill leftover space */
.avatar  { align-self: flex-end; order: 99; } /* override + reorder */

/* Equal-width columns: every item grows equally from a 0 basis */
.cols > * { flex: 1; }          /* == flex: 1 1 0 */`,
      },
      {
        label: "Perfect centering (both axes)",
        language: "css",
        code: `/* The pattern that replaced a decade of hacks */
.center {
  display: flex;
  justify-content: center;  /* main axis  */
  align-items: center;      /* cross axis */
  min-height: 100vh;
}

/* Grid can do it in two lines with place-items */
.center-grid {
  display: grid;
  place-items: center;      /* = justify-items + align-items */
  min-height: 100vh;
}`,
      },
      {
        label: "Grid: tracks, fr, minmax & responsive auto-fill",
        language: "css",
        code: `/* App shell: fixed sidebar + fluid content, full height */
.app-shell {
  display: grid;
  grid-template-columns: 240px 1fr;  /* fixed | flexible */
  grid-template-rows: auto 1fr auto;  /* header | body | footer */
  gap: 16px;
  min-height: 100vh;
}

/* Responsive card grid — NO media queries needed */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
/* auto-fit instead of auto-fill stretches items to fill empty tracks */

/* Explicit placement by grid lines */
.feature { grid-column: 1 / 3; }   /* span from line 1 to 3 */
.tall    { grid-row: span 2; }     /* span two rows */`,
      },
      {
        label: "Grid template areas — a self-documenting page layout",
        language: "css",
        code: `.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  min-height: 100vh;
  gap: 12px;
}
.page > header  { grid-area: header;  }
.page > nav     { grid-area: sidebar; }
.page > main    { grid-area: main;    }
.page > footer  { grid-area: footer;  }

/* Rearrange for mobile by redrawing the map — no markup change */
@media (max-width: 640px) {
  .page {
    grid-template-columns: 1fr;
    grid-template-areas: "header" "main" "sidebar" "footer";
  }
}`,
      },
    ],
    runnable: {
      title: "Flexbox alignment + a responsive auto-fill grid, live",
      html: `<h3>Flexbox toolbar (main axis: space-between)</h3>
<div class="toolbar">
  <span class="logo">Logo</span>
  <button>A</button>
  <button>B</button>
  <button class="push">Sign in</button>
</div>

<h3>Grid: resize the preview to watch columns reflow</h3>
<div class="grid">
  <div class="card">1</div>
  <div class="card">2</div>
  <div class="card">3</div>
  <div class="card">4</div>
  <div class="card">5</div>
  <div class="card">6</div>
</div>`,
      css: `body { font-family: system-ui, sans-serif; padding: 16px; }
h3 { margin: 18px 0 8px; font-size: 14px; color:#475569; }

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background:#f1f5f9;
  border-radius: 12px;
}
.toolbar .logo { font-weight: 800; color:#4f46e5; }
.toolbar .push { margin-left: auto; } /* auto-margin pushes it to the end */
.toolbar button { border:0; padding:8px 12px; border-radius:8px; background:#e2e8f0; cursor:pointer; }
.toolbar .push { background:#4f46e5; color:#fff; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 10px;
}
.card {
  background:#4f46e5; color:#fff; font-weight:700;
  padding:24px; border-radius:12px; text-align:center;
}`,
      js: `// Read back the computed layout so learners connect CSS to reality
const grid = document.querySelector('.grid');
const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
console.log('Auto-fill produced', cols, 'columns at this width.');
console.log('Narrow the preview and re-run to see the count drop.');`,
    },
    interviewQA: [
      {
        question: "When do you choose Flexbox vs Grid?",
        answer:
          "Flexbox for one-dimensional layouts where content drives sizing — toolbars, button rows, tag lists, navs. Grid for two-dimensional layouts where you define structure up front — page shells, dashboards, galleries. They compose: Grid for the outer shell, Flexbox within cells. Quick test: one axis → Flex, rows and columns together → Grid.",
      },
      {
        question: "What's the difference between the main axis and the cross axis?",
        answer:
          "The main axis is the direction flex items flow, set by flex-direction (row = horizontal by default). The cross axis is perpendicular. justify-content aligns items along the main axis; align-items aligns them along the cross axis. Switching flex-direction to column swaps the axes, which is why alignment can appear to go 'the wrong way.'",
      },
      {
        question: "Explain the flex shorthand — what does flex: 1 mean?",
        answer:
          "flex is shorthand for flex-grow flex-shrink flex-basis. flex: 1 expands to 1 1 0 — grow to absorb spare space, shrink if needed, starting from a 0 basis — so several items with flex:1 become equal-width columns ignoring content width. flex: 0 0 240px is a fixed 240px item that neither grows nor shrinks. Use flex: 1 1 auto to grow but respect content size.",
      },
      {
        question: "How do you build a responsive grid without media queries?",
        answer:
          "grid-template-columns: repeat(auto-fill, minmax(MIN, 1fr)). The browser fits as many MIN-wide tracks as the container allows, then stretches them with 1fr. Columns reflow automatically as width changes. auto-fit is the variant that collapses empty tracks so existing items stretch edge-to-edge.",
      },
      {
        question: "What's the difference between auto-fill and auto-fit?",
        answer:
          "Both fit as many tracks as possible. auto-fill keeps empty tracks in the grid (reserving the slots), so items stay their min size and you get trailing empty space. auto-fit collapses empty tracks to zero, letting the present items grow to fill the entire row. Use auto-fill to preserve a consistent column rhythm, auto-fit to stretch content.",
      },
      {
        question: "What is the fr unit and how does it differ from percentages?",
        answer:
          "fr represents a fraction of the leftover free space in a grid container after fixed-size tracks and gaps are subtracted. 1fr 1fr splits the remainder evenly. Percentages are computed against the container size and don't account for gaps, so they can overflow; fr divides only what's actually left, so it never overflows from gaps.",
      },
      {
        question: "Why might a flex item overflow its container, and how do you fix it?",
        answer:
          "A flex item's default min-width is auto, meaning it refuses to shrink below its content's intrinsic size — long text or a wide child can then blow out the layout. The fix is min-width: 0 (or overflow: hidden) on the item so it can shrink and its content can truncate or wrap.",
      },
    ],
    thingsToRemember: [
      "Flexbox = 1D (row or column). Grid = 2D (rows and columns). They nest.",
      "Container props vs item props — the layout magic lives on the parent.",
      "justify-content = main axis, align-items = cross axis; axes swap with flex-direction: column.",
      "flex: 1 → 1 1 0 (equal columns); flex: 0 0 Npx → fixed track.",
      "Center anything: display:flex; justify-content:center; align-items:center (or Grid place-items:center).",
      "fr = a fraction of leftover space; repeat() + minmax() build flexible tracks.",
      "repeat(auto-fill, minmax(MIN,1fr)) = responsive grid, no breakpoints. auto-fit stretches; auto-fill keeps slots.",
      "Name regions with grid-template-areas for readable, easily-rearranged layouts.",
      "Only DIRECT children are flex/grid items — watch for stray wrappers.",
      "Use gap for spacing in both; fix overflow with min-width: 0 on flex items.",
    ],
    references: [
      { label: "CSS-Tricks — A Complete Guide to Flexbox", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" },
      { label: "CSS-Tricks — A Complete Guide to Grid", url: "https://css-tricks.com/snippets/css/complete-guide-grid/" },
      { label: "MDN — Basic concepts of Flexbox", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox" },
      { label: "MDN — Basic concepts of Grid Layout", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout" },
      { label: "web.dev — Learn CSS: Flexbox", url: "https://web.dev/learn/css/flexbox" },
      { label: "Flexbox Froggy & Grid Garden (games)", url: "https://flexboxfroggy.com/" },
    ],
    tags: ["css", "flexbox", "grid", "layout", "responsive", "alignment", "fundamentals"],
  },
  {
    id: "responsive-design",
    num: 5,
    title: "Responsive Design (Media Queries)",
    part: "Web Foundations",
    partId: "a",
    difficulty: "Foundational",
    summary:
      "Build one UI that fits every screen: the viewport meta tag, mobile-first breakpoints, relative units, fluid type with clamp(), responsive images, container queries, and modern preference queries.",
    readingTime: 18,
    explanation: [
      "**What responsive design is.** One codebase, one URL, that adapts its layout to any screen — phone, tablet, laptop, ultrawide — instead of shipping a separate 'm.' mobile site. It rests on three pillars: **fluid layouts** (things sized in relative units and flexible layout modes), **flexible media** (images/video that scale), and **media queries** (rules that switch at size thresholds). Modern CSS adds a fourth: **container queries** (adapt to a parent's size, not the screen's).",
      "**Step 0 — the viewport meta tag.** Responsive CSS does nothing without `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">` in the `<head>`. Without it, mobile browsers pretend to be ~980px wide and zoom out, so your media queries never match. This one line tells the browser to use the device's real width. It's the single most forgotten prerequisite.",
      "**Media queries — the syntax.** A media query wraps rules that apply only when a condition holds: `@media (min-width: 768px) { ... }`. Conditions can test `min-width`/`max-width` (the workhorses), `orientation: landscape`, `prefers-color-scheme: dark`, `prefers-reduced-motion`, and more. Combine with `and`, list alternatives with commas (OR). Modern range syntax also allows `@media (width >= 768px)`.",
      "**Mobile-first (min-width) vs desktop-first (max-width).** **Mobile-first**: write base styles for the smallest screen, then *add* complexity with `min-width` queries as the viewport grows — progressive enhancement. **Desktop-first**: write for large screens, then *override* down with `max-width` queries. Mobile-first is preferred: the default path is the lightest (best for the weakest devices), it forces you to prioritise core content, and stacking `min-width` layers reads more predictably than a pile of overrides.",
      "**Breakpoints — choose by content, not devices.** Don't hardcode 'iPhone' widths — devices change. Add a breakpoint wherever the layout *starts to look bad*. That said, common anchors are ~640px (large phone), ~768px (tablet), ~1024px (laptop), ~1280px (desktop). Keep the *number* of breakpoints small; every one is layout you must maintain.",
      "**Relative units are the foundation.** Fixed `px` can't adapt. Use `rem` for type and spacing (relative to root font-size → respects the user's accessibility font setting), `%` for widths relative to the parent, `vw`/`vh` for viewport-relative sizing, and `ch` for text-measure widths. A layout built in relative units is already half-responsive before you write a single media query.",
      "**Fluid typography with clamp().** Instead of stepping font-size at each breakpoint, scale it *continuously*: `font-size: clamp(1rem, 0.5rem + 2vw, 1.5rem)`. `clamp(MIN, PREFERRED, MAX)` picks the preferred value but never goes below MIN or above MAX — smooth scaling with guardrails, no media queries. The same trick works for fluid spacing and gaps.",
      "**Responsive images.** A raw `<img>` should at least have `max-width: 100%; height: auto;` so it never overflows its container. For real optimisation, `srcset` + `sizes` lets the browser pick the right resolution for the device (saving mobile bandwidth), and `<picture>` swaps entirely different images or formats (e.g. a cropped portrait on mobile, WebP where supported). Add `loading=\"lazy\"` to defer offscreen images.",
      "**Let layout do the work — fewer queries.** Much responsiveness needs *zero* media queries if you lean on intrinsic sizing: `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))` reflows cards on its own; `flex-wrap: wrap` wraps a toolbar; `max-width` + `margin-inline: auto` centres a readable column. Media queries are for the *structural* jumps layout can't express (e.g. sidebar → top bar).",
      "**Container queries (modern).** Media queries ask 'how big is the *screen*?' — but a component doesn't know where it'll be placed. **Container queries** ask 'how big is my *parent*?': mark a container with `container-type: inline-size`, then `@container (min-width: 400px) { ... }`. Now a card component restyles based on the column it sits in, making it truly reusable across layouts. This is the biggest shift in responsive CSS since Grid.",
      "**Preference & capability queries.** Responsiveness isn't only about size. `@media (prefers-color-scheme: dark)` respects the OS theme; `@media (prefers-reduced-motion: reduce)` lets you disable animations for users who get motion-sick; `@media (hover: hover)` applies hover effects only on devices that actually have a pointer. Designing for these is part of modern responsive/accessible work.",
      "**Testing responsiveness.** Use browser DevTools device-emulation (responsive mode), drag the viewport to find where things break (that's your next breakpoint), and always test real text lengths and images — not lorem ipsum in a perfect box. Check both orientations and the largest OS font setting.",
      "**The mental model (memorise this).** Start mobile-first with fluid, relative units and flexible layout (Grid/Flex) so most of the design adapts for free. Add the viewport meta tag. Insert `min-width` breakpoints only where the layout genuinely breaks. Use `clamp()` for fluid type, `srcset`/`picture` for images, container queries for reusable components, and preference queries for theme/motion/pointer. The goal: one UI that feels native at every size.",
    ],
    backendAnalogy:
      "Mobile-first is progressive enhancement, like designing an API with sensible defaults and layering optional capabilities on top rather than shipping a maximal payload and stripping it down per client. Media queries are feature flags keyed on environment (screen width) that swap configuration at runtime. Container queries are dependency injection for layout — a component adapts to the context it's dropped into instead of hardcoding assumptions about the global environment, exactly like a service resolving behaviour from its injected scope rather than global state.",
    keyInsights: [
      "Nothing responsive works without <meta name=viewport content=\"width=device-width, initial-scale=1\"> in the head.",
      "Mobile-first (min-width) progressively enhances; desktop-first (max-width) progressively degrades — mobile-first is usually simpler and lighter.",
      "Choose breakpoints where the content breaks, not by device model. Keep the count small.",
      "Prefer rem for type/spacing (respects user font-size), % for parent-relative, vw/vh for viewport-relative.",
      "clamp(MIN, PREFERRED, MAX) gives fluid typography and spacing that scales smoothly without breakpoints.",
      "img { max-width: 100%; height: auto } stops overflow; srcset/sizes and <picture> serve the right image per device.",
      "Intrinsic layout (auto-fill + minmax, flex-wrap, max-width + margin auto) removes the need for many media queries.",
      "Container queries adapt a component to its PARENT's size (container-type: inline-size + @container), making components reusable anywhere.",
      "Preference queries matter too: prefers-color-scheme, prefers-reduced-motion, hover: hover.",
      "Test by dragging the viewport to find break points; verify real text and images, both orientations, large font settings.",
    ],
    codeSamples: [
      {
        label: "The viewport meta tag (required in <head>)",
        language: "html",
        code: `<!-- Without this, mobile browsers fake ~980px and your media queries never fire -->
<meta name="viewport" content="width=device-width, initial-scale=1" />`,
      },
      {
        label: "Mobile-first breakpoints (min-width, progressive enhancement)",
        language: "css",
        code: `/* BASE: styles for the smallest screen — single column */
.app-shell {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
.container { padding-inline: 16px; }

/* TABLET and up: add the sidebar */
@media (min-width: 768px) {
  .app-shell { grid-template-columns: 240px 1fr; }
}

/* DESKTOP: cap and center the reading width */
@media (min-width: 1024px) {
  .container { max-width: 1200px; margin-inline: auto; }
}`,
      },
      {
        label: "Fluid type & spacing with clamp() — no breakpoints",
        language: "css",
        code: `:root {
  /* scales smoothly between 1rem @ small and 1.5rem @ large viewports */
  --step-0: clamp(1rem, 0.85rem + 0.8vw, 1.5rem);
  --gap:    clamp(12px, 2vw, 32px);
}
h1   { font-size: clamp(1.75rem, 1rem + 4vw, 3.5rem); line-height: 1.1; }
body { font-size: var(--step-0); }
.stack { display: grid; gap: var(--gap); }`,
      },
      {
        label: "Responsive images + a container query",
        language: "css",
        code: `/* Every image scales down to its container, never overflows */
img { max-width: 100%; height: auto; display: block; }

/* Container query: the CARD adapts to its column, not the screen */
.card-wrap { container-type: inline-size; }

.card { display: grid; gap: 8px; }
@container (min-width: 400px) {
  .card { grid-template-columns: 120px 1fr; } /* side-by-side when wide */
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}`,
      },
    ],
    runnable: {
      title: "Resize the preview: fluid type + auto-reflowing grid",
      html: `<h1>I scale fluidly</h1>
<p class="lead">This paragraph and the heading use clamp(), so they grow and
shrink smoothly as you resize — no breakpoints. The cards below reflow with
auto-fill.</p>
<div class="grid">
  <div class="card">Home</div>
  <div class="card">Reports</div>
  <div class="card">Team</div>
  <div class="card">Settings</div>
</div>`,
      css: `body { font-family: system-ui, sans-serif; padding: 16px; }
h1 { font-size: clamp(1.5rem, 1rem + 4vw, 3rem); line-height: 1.1; margin: 0 0 8px; }
.lead { font-size: clamp(0.9rem, 0.8rem + 0.6vw, 1.15rem); color:#475569; max-width: 60ch; }
.grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}
.card { background:#0ea5e9; color:#fff; font-weight:700; padding:20px; border-radius:12px; text-align:center; }`,
      js: `const w = document.documentElement.clientWidth;
console.log('Preview width:', w + 'px');
console.log('Drag the divider to resize — type and columns adapt with no media queries.');`,
    },
    interviewQA: [
      {
        question: "What is mobile-first design and why prefer it?",
        answer:
          "You write base CSS for the smallest screen, then add complexity with min-width media queries as the viewport grows. It's preferred because the default path is the lightest (best for low-power devices and slow networks), it forces prioritising core content, and stacking min-width layers is easier to reason about than overriding desktop styles back down with max-width.",
      },
      {
        question: "Why is the viewport meta tag necessary?",
        answer:
          "Without <meta name=viewport content=\"width=device-width, initial-scale=1\">, mobile browsers render at a fake ~980px width and zoom the page out, so your min-width media queries never match and the layout looks like a shrunken desktop site. The tag maps the CSS viewport to the device's real width so responsive rules work.",
      },
      {
        question: "How do you decide where to put breakpoints?",
        answer:
          "By content, not device. Widen or narrow the viewport until the layout starts to look awkward — line lengths too long, elements too cramped — and add a breakpoint there. Hardcoding specific device widths is brittle because the device landscape constantly changes. Keep the number of breakpoints small to limit maintenance.",
      },
      {
        question: "What does clamp() do and when would you use it?",
        answer:
          "clamp(MIN, PREFERRED, MAX) returns the preferred value but clamps it between MIN and MAX. It's ideal for fluid typography and spacing: font-size: clamp(1rem, 0.5rem + 2vw, 2rem) scales smoothly with the viewport while never becoming too small or too large — replacing several breakpoint-based font-size steps with one line.",
      },
      {
        question: "What are container queries and how do they differ from media queries?",
        answer:
          "Media queries respond to the viewport/screen size; container queries respond to the size of a component's parent container (container-type: inline-size + @container rules). That lets a single component adapt based on the space it's actually given — a card in a narrow sidebar vs a wide main column — making components genuinely reusable regardless of where they're placed.",
      },
      {
        question: "How do you make images responsive and performant?",
        answer:
          "At minimum, max-width: 100%; height: auto so images never overflow their container. For performance, use srcset with sizes so the browser downloads an appropriately sized file per device, and <picture> to art-direct (different crops) or serve modern formats like WebP/AVIF. Add loading=\"lazy\" to defer offscreen images.",
      },
      {
        question: "Can you build responsive layouts without media queries?",
        answer:
          "Often yes. Intrinsic techniques handle a lot: grid-template-columns: repeat(auto-fill, minmax(MIN, 1fr)) reflows cards, flex-wrap: wrap wraps rows, max-width + margin-inline: auto centers content, and clamp() scales type. Media queries are then reserved for structural changes layout can't express on its own, like moving a sidebar to a top bar.",
      },
    ],
    thingsToRemember: [
      "Always include the viewport meta tag — responsive CSS is inert without it.",
      "Mobile-first: base styles + min-width breakpoints (progressive enhancement).",
      "Set breakpoints where content breaks, not at device widths; keep them few.",
      "Relative units: rem (type/spacing), % (parent), vw/vh (viewport), ch (measure).",
      "clamp(MIN, PREFERRED, MAX) = fluid type/spacing without breakpoints.",
      "Responsive images: max-width:100%; height:auto, plus srcset/sizes and <picture>.",
      "Intrinsic layout (auto-fill + minmax, flex-wrap) removes many media queries.",
      "Container queries adapt components to their parent's width — reusable anywhere.",
      "Honor prefers-color-scheme, prefers-reduced-motion, and hover: hover.",
      "Test by resizing to find break points; check real content, both orientations, large fonts.",
    ],
    references: [
      { label: "web.dev — Responsive design basics", url: "https://web.dev/articles/responsive-web-design-basics" },
      { label: "MDN — Responsive design", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design" },
      { label: "MDN — Using media queries", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries" },
      { label: "MDN — Container queries", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries" },
      { label: "MDN — Responsive images", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images" },
      { label: "web.dev — Learn CSS: Responsive", url: "https://web.dev/learn/design" },
    ],
    tags: ["css", "responsive", "media-queries", "mobile-first", "container-queries", "clamp", "images", "fundamentals"],
  },
];
