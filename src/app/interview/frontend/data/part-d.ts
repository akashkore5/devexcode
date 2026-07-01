import type { FrontendTopic } from "../types";

export const partD: FrontendTopic[] = [
  {
    id: "reactjs-overview",
    num: 11,
    title: "ReactJS Overview",
    part: "React Core",
    partId: "d",
    difficulty: "Foundational",
    summary:
      "The complete mental model of React: what it is and isn't, the declarative UI = f(state) idea, elements vs components, the Virtual DOM and reconciliation, render vs commit, one-way data flow, and where React fits in the modern ecosystem — beginner to advanced in one page.",
    readingTime: 16,
    explanation: [
      "**What React actually is.** React is a JavaScript *library* (not a full framework) for building user interfaces out of **components**. It does one job extremely well: keep the screen in sync with your data. It deliberately leaves routing, data fetching, and global state to other libraries — which is why you compose React with tools like React Router, TanStack Query, or Next.js. Understanding this scope keeps you from expecting React to do things it was never meant to do.",
      "**The one idea that matters: UI = f(state).** React's core insight is that the UI should be a *pure function* of state. You describe what the screen should look like for a given set of data; you never write step-by-step instructions to mutate the DOM. Change the data, and React recomputes the UI and updates the screen. This is **declarative** programming — you declare the destination, not the route.",
      "**Declarative vs imperative — feel the difference.** Imperative (vanilla DOM): find the node, read its current text, decide what changed, set `innerHTML`, toggle a class, remove a child. You manage every transition by hand and bugs hide in the transitions. Declarative (React): return `<p>{count}</p>` and let React figure out the difference between the old and new output. You stop describing *how* and only describe *what* — the entire class of 'I forgot to update the DOM in one place' bugs disappears.",
      "**Elements vs components (a distinction interviewers love).** A **component** is a function you write that returns markup. An **element** is the lightweight plain-object *description* that calling that component (or writing JSX) produces — `{ type: 'h1', props: { children: 'Hi' } }`. Elements are cheap, immutable snapshots; React creates thousands per render and throws them away. Components are the reusable factories; elements are their per-render output.",
      "**The Virtual DOM — what it is.** The Virtual DOM is a lightweight in-memory tree of those element objects representing what the UI *should* be. It is not a faster DOM; it is a *description* of the DOM. Its value is that comparing two plain-object trees in memory is cheap, whereas touching the real DOM (which can trigger layout and paint) is expensive. So React does the expensive work rarely and the cheap work often.",
      "**Reconciliation — how updates happen.** When state changes, React re-runs the component to produce a new Virtual DOM tree, then **diffs** it against the previous tree. This diffing process is called **reconciliation**. React uses heuristics: same element type → reuse and update the DOM node; different type → tear down and rebuild; lists → use **keys** to match items. The result is the *minimal* set of real DOM operations, applied in one batch.",
      "**Render phase vs commit phase.** A React update has two phases. The **render phase** calls your components to compute the new tree and diff it — this must be pure and can be paused or restarted by React. The **commit phase** applies the computed changes to the real DOM and runs effects — this happens synchronously and only once per update. Knowing these two phases explains why render must have no side effects: React may run it more than once.",
      "**One-way data flow.** Data in React flows in one direction: down the component tree, from parent to child via props. A child never reaches up to mutate a parent. To change something upward, a child calls a callback the parent passed down. This unidirectional flow is what makes a large React app tractable — you can always trace where a value came from by walking *up* the tree.",
      "**The Fiber architecture (advanced context).** Since React 16, the reconciler is called **Fiber**. It breaks rendering into small units of work that can be interrupted, prioritized, and resumed, enabling features like concurrent rendering, `useTransition`, and Suspense. You rarely touch Fiber directly, but it's why modern React can keep the UI responsive during heavy updates — it can pause low-priority rendering to handle a click.",
      "**Common gotchas.** React re-renders a component when its state or props change, and by default re-renders its children too — a re-render is not automatically a DOM update (reconciliation may find nothing changed), so 'React re-rendered' does not mean 'the DOM changed.' Mutating state directly bypasses React's change detection and leaves the UI stale. And the Virtual DOM is not magic performance — a poorly-structured tree can still be slow; correctness first, then optimize.",
      "**The mental model (memorise this).** You write components (functions) → calling them produces elements (a Virtual DOM description) → on every state change React re-renders that description, diffs it against the last one (reconciliation) → and commits only the minimal real-DOM changes. UI = f(state), data flows down, events flow up. Get those five sentences and the rest of React is just API.",
    ],
    backendAnalogy:
      "Think of a React component tree as a rendering/templating layer re-evaluated whenever your domain model changes — like a Vert.x/Spring handler that returns a fresh view for the current model rather than patching a shared mutable page. The Virtual DOM diff is a change-detection engine, much like comparing two JPA entity snapshots and issuing UPDATEs only for the dirty columns instead of rewriting every row. One-way data flow mirrors passing an immutable request/DTO down through service methods: callees read it, they don't mutate the caller's state. Render-phase purity is like a function that must be free of side effects so the framework can retry it safely — the commit phase is where the transaction actually flushes.",
    keyInsights: [
      "React is a UI library, not a framework: it syncs the screen to your data and leaves routing, fetching, and global state to other tools.",
      "The whole model is UI = f(state): you declare what the screen should be for the current data; React computes how to get there.",
      "A component is the function you write; an element is the cheap immutable object it returns describing the UI.",
      "The Virtual DOM is a description of the DOM, not a faster DOM; its value is that in-memory diffing is cheaper than touching the real DOM.",
      "Reconciliation diffs the new element tree against the old one and applies the minimal batched set of real DOM changes.",
      "Rendering has two phases: render (pure, interruptible, computes the diff) and commit (synchronous, applies changes and runs effects).",
      "Data flows down via props; events flow up via callbacks — this one-way flow makes large apps traceable.",
      "A re-render is not the same as a DOM update: React may re-run a component and find nothing changed to commit.",
      "The Fiber reconciler splits work into interruptible units, enabling concurrent features like useTransition and Suspense.",
      "Correctness first: the Virtual DOM does not make a badly structured component tree fast on its own.",
    ],
    codeSamples: [
      {
        label: "Declarative React vs imperative vanilla DOM (same feature)",
        language: "jsx",
        code: `// IMPERATIVE (vanilla): you manage every transition by hand.
const btn = document.querySelector('#like');
let liked = false;
btn.addEventListener('click', () => {
  liked = !liked;                       // mutate state
  btn.textContent = liked ? 'Liked' : 'Like'; // manually sync the DOM
  btn.classList.toggle('active', liked);       // and again, everywhere
});

// DECLARATIVE (React): describe the UI for the current state; React syncs.
import { useState } from 'react';

function LikeButton() {
  const [liked, setLiked] = useState(false);
  return (
    <button
      className={liked ? 'active' : ''}
      onClick={() => setLiked(prev => !prev)} // just change the data
    >
      {liked ? 'Liked' : 'Like'}             {/* UI = f(state) */}
    </button>
  );
}`,
      },
      {
        label: "Component vs element: what JSX really produces",
        language: "jsx",
        code: `// A COMPONENT is a function you write.
function Greeting() {
  return <h1 className="title">Hello</h1>;
}

// The JSX above compiles to a call that returns an ELEMENT —
// a plain, immutable object DESCRIBING the UI (not real DOM):
const element = {
  type: 'h1',
  props: { className: 'title', children: 'Hello' },
};
// React creates thousands of these per render, diffs them, and
// throws them away. They are cheap descriptions, not DOM nodes.`,
      },
      {
        label: "Mounting a root — where React takes over the DOM",
        language: "tsx",
        code: `import { createRoot } from 'react-dom/client';
import App from './App';

// React controls ONE DOM subtree from here down. Everything inside
// <App /> is described declaratively; React reconciles it into #root.
const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

// From now on you never call container.innerHTML = ... again.
// You change state inside App, and React updates #root for you.`,
      },
      {
        label: "Re-render is not the same as a DOM mutation",
        language: "tsx",
        code: `import { useState } from 'react';

function Clock() {
  const [now, setNow] = useState(Date.now());
  // Even if this component RE-RENDERS every tick, React only
  // COMMITS the text nodes that actually changed. Re-render (render
  // phase) recomputes the description; commit phase touches the DOM.
  return (
    <div>
      <span>Static label</span>            {/* unchanged -> no DOM write */}
      <time>{new Date(now).toLocaleTimeString()}</time> {/* changes */}
    </div>
  );
}`,
      },
    ],
    runnable: {
      title: "See a Virtual-DOM-style diff: only the changed node is touched",
      html: `<h3>Mini reconciliation demo (plain JS — React can't run in the sandbox)</h3>
<ul id="list"></ul>
<button id="update">Update data &amp; diff</button>`,
      css: `body { font-family: system-ui, sans-serif; padding: 16px; }
li { padding: 6px 10px; border-radius: 6px; transition: background .4s; }
li.changed { background: #fef08a; } /* flashes only nodes that changed */
button { margin-top: 12px; padding: 8px 14px; cursor: pointer; }`,
      js: `// Emulate React's idea: keep a "virtual" description, diff it against
// the previous one, and touch the real DOM ONLY where it changed.
const listEl = document.getElementById('list');
let prev = [];

function render(next) {
  next.forEach((text, i) => {
    let li = listEl.children[i];
    if (!li) { li = document.createElement('li'); listEl.appendChild(li); }
    // DIFF: only write to the DOM if this item's text actually changed.
    if (prev[i] !== text) {
      li.textContent = text;
      li.classList.add('changed');
      console.log('DOM updated at index', i, '->', text);
      setTimeout(() => li.classList.remove('changed'), 400);
    }
  });
  prev = next;
}

let version = 1;
render(['Alpha', 'Beta', 'Gamma']);
document.getElementById('update').addEventListener('click', () => {
  version++;
  // Only "Beta" changes each click -> only that <li> is touched.
  render(['Alpha', 'Beta v' + version, 'Gamma']);
});`,
    },
    interviewQA: [
      {
        question: "What problem does the Virtual DOM actually solve?",
        answer:
          "Directly mutating the real DOM can trigger synchronous layout and paint, and doing many imperative mutations is hard to reason about. React keeps an in-memory tree of element objects describing the desired UI, re-renders it on state change, diffs it against the previous tree (reconciliation), and applies the minimal set of real DOM changes in one batch. The win is a declarative model plus batching and minimal updates — not that the DOM is intrinsically slow.",
      },
      {
        question: "What is the difference between a React element and a component?",
        answer:
          "A component is the function (or class) you write that returns markup — a reusable factory. An element is the lightweight, immutable plain object that calling that component or writing JSX produces, describing what to render (its type and props). React creates and diffs many elements per render; components are the source of those elements.",
      },
      {
        question: "What does 'declarative UI' mean and why does it help?",
        answer:
          "You declare what the UI should look like for a given state instead of writing imperative steps to mutate the DOM. React reconciles the DOM to match your declaration. This makes UI a pure function of state, which eliminates whole classes of 'I forgot to update the DOM here' bugs and makes components easier to test and reason about.",
      },
      {
        question: "What are the render and commit phases?",
        answer:
          "The render phase calls your components to build the new element tree and diffs it against the previous one; it must be pure because React may pause, restart, or discard it. The commit phase applies the computed changes to the real DOM and runs effects; it happens once per update and synchronously. This is why side effects belong in effects, not in the render body.",
      },
      {
        question: "Does a re-render always update the DOM?",
        answer:
          "No. A re-render means React re-ran the component to produce a new element tree. During reconciliation it may find that nothing actually changed, so it commits no DOM mutations. Re-rendering is about recomputing the description; committing is about touching the DOM. They are separate steps.",
      },
      {
        question: "Is React a framework or a library, and why does that matter?",
        answer:
          "React is a library focused on rendering UI from state. It intentionally omits routing, data fetching, and global state management, expecting you to add libraries like React Router, TanStack Query, or a meta-framework like Next.js. Knowing this scope explains why real apps are a composition of React plus other tools rather than React alone.",
      },
      {
        question: "What is Fiber and why was it introduced?",
        answer:
          "Fiber is React's reconciler since v16. It represents rendering work as small, interruptible units so React can prioritize, pause, resume, and abort work. This enables concurrent features such as useTransition, automatic batching, and Suspense, keeping the UI responsive by deferring low-priority renders behind urgent ones like user input.",
      },
    ],
    thingsToRemember: [
      "UI = f(state): describe the result for current data; React figures out the DOM changes.",
      "React is a library, not a framework — compose it with routing/data/state tools.",
      "Component = function you write; element = cheap immutable object it returns.",
      "The Virtual DOM is a description of the DOM; in-memory diffing is what's cheap.",
      "Reconciliation diffs new vs old element tree and batches minimal real DOM writes.",
      "Two phases: render (pure, interruptible) then commit (DOM writes + effects).",
      "Data flows down via props; events flow up via callbacks (one-way data flow).",
      "A re-render is not automatically a DOM update.",
      "Never mutate state in place — it bypasses change detection and leaves the UI stale.",
      "Fiber makes rendering interruptible, enabling concurrent React features.",
    ],
    references: [
      { label: "React — Learn (start here)", url: "https://react.dev/learn" },
      { label: "React — Thinking in React", url: "https://react.dev/learn/thinking-in-react" },
      { label: "React — Render and commit", url: "https://react.dev/learn/render-and-commit" },
      { label: "React — Preserving and resetting state (reconciliation)", url: "https://react.dev/learn/preserving-and-resetting-state" },
      { label: "React — createRoot API", url: "https://react.dev/reference/react-dom/client/createRoot" },
      { label: "MDN — Introduction to the DOM", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction" },
    ],
    tags: ["react", "virtual-dom", "declarative", "components", "reconciliation", "fiber", "render-commit", "data-flow"],
  },
  {
    id: "jsx",
    num: 12,
    title: "JSX",
    part: "React Core",
    partId: "d",
    difficulty: "Foundational",
    summary:
      "JSX end to end: what it compiles to, why it's expressions-only, the full rule set (className, htmlFor, camelCase, closing tags, single root/Fragments), embedding values and expressions, spreading props, conditional and list rendering, dangerous HTML, and the gotchas interviewers probe.",
    readingTime: 15,
    explanation: [
      "**What JSX is.** JSX is an HTML-like syntax extension that lives *inside* JavaScript. It is not HTML and it is not a string template — it is **syntactic sugar** for function calls. A build step (Babel or SWC) transforms every tag into a call that produces a React element object. Because the output is JavaScript, JSX inherits all of JavaScript's rules, and most 'JSX quirks' are really just 'this is JavaScript' consequences.",
      "**What it compiles to.** `<h1 className=\"t\">Hi</h1>` used to compile to `React.createElement('h1', { className: 't' }, 'Hi')`. Since React 17 the default is the **automatic JSX runtime**, which compiles to `_jsx('h1', { className: 't', children: 'Hi' })` imported from `react/jsx-runtime` — that's why you no longer need `import React` just to use JSX. Either way, the result is a plain element object describing the UI.",
      "**Curly braces embed expressions.** Inside JSX, `{ }` opens a window back into JavaScript where you can drop any **expression**: a variable, arithmetic, a function call, a ternary, a `.map()`. Crucially it must be an *expression* (something that evaluates to a value), never a *statement* like `if`, `for`, or `switch`. That single rule explains why React conditionals use ternaries and `&&` instead of `if` blocks inside the markup.",
      "**Attributes are JavaScript property names.** Because JSX props map to JS object keys and DOM properties, you write `className` (not `class`, a reserved word), `htmlFor` (not `for`), and camelCase everywhere: `onClick`, `tabIndex`, `readOnly`, `maxLength`. Values that are strings use quotes (`type=\"text\"`); everything else uses braces (`count={5}`, `style={{ color: 'red' }}` — the outer braces are the expression, the inner ones are the object literal).",
      "**Tags must close, and there's exactly one root.** Every element must be explicitly closed: `<img />`, `<br />`, `<input />` are self-closed. A component must return a **single root node**. When you don't want an extra wrapper `<div>`, use a **Fragment** — `<>...</>` (shorthand) or `<React.Fragment>` (needed when you must attach a `key`, e.g. in a list).",
      "**Rendering values — what shows and what doesn't.** Strings and numbers render as text. `true`, `false`, `null`, and `undefined` render **nothing** — this is why `{isLoggedIn && <Menu />}` works. But watch out: `0` is falsy yet *does* render as the text '0', so `{items.length && <List />}` prints '0' on an empty array. Objects cannot be rendered directly (`Objects are not valid as a React child`) — map arrays to elements instead.",
      "**Conditional rendering patterns.** For if/else use a **ternary**: `{ok ? <A /> : <B />}`. For render-if-only use **`&&`**: `{ok && <A />}` (but guard numeric conditions: `{count > 0 && ...}`). For anything more complex, compute the JSX into a variable *before* the `return`, or extract a helper — you are not limited to inline expressions, only to keeping the JSX itself expression-based.",
      "**Lists.** Render collections by mapping an array to elements: `{items.map(i => <li key={i.id}>{i.name}</li>)}`. Each mapped element needs a stable, unique **key** so React can track it across renders (covered in depth in the Rendering Patterns topic). A bare array of elements is valid JSX children.",
      "**Spreading and children.** You can forward a whole props object with the spread: `<Button {...props} />`. Content placed *between* a component's tags arrives as the special `children` prop — `<Card>hello</Card>` gives `Card` `props.children === 'hello'` — which is the backbone of composition.",
      "**Escaping and dangerous HTML.** JSX automatically **escapes** interpolated values, so `{userInput}` renders as literal text and cannot inject markup — this is built-in XSS protection. To intentionally render an HTML string you must opt in with `dangerouslySetInnerHTML={{ __html: str }}`; the alarming name is deliberate — sanitize first or you reopen the XSS hole.",
      "**Comments and whitespace.** Comments inside JSX use `{/* like this */}` (a JS comment inside braces), not `<!-- -->`. JSX collapses and trims whitespace between elements much like HTML, so intentional spaces sometimes need `{' '}`. Adjacent string literals and expressions concatenate naturally.",
      "**The mental model (memorise this).** JSX is JavaScript wearing an HTML costume: it compiles to element-creating function calls, so only *expressions* live in `{ }`, attributes are camelCased JS property names (`className`, `htmlFor`), tags self-close, and a component returns one root (use a Fragment to avoid a wrapper). Think 'what value does this evaluate to?' and JSX stops surprising you.",
    ],
    backendAnalogy:
      "JSX is like a server-side template DSL (Thymeleaf, JSP, Vert.x templating) — but instead of producing an HTML string, it produces typed builder calls that return element objects. The `{ }` expression window is the template's `${...}`, except it's real JavaScript with real scope, not a sandboxed mini-language. Automatic escaping is exactly what a good template engine does by default to prevent injection — and `dangerouslySetInnerHTML` is the equivalent of the 'unescaped/raw' output directive you only reach for after sanitizing. Compiling JSX to `_jsx(...)` calls is like a template being pre-compiled to Java bytecode at build time rather than interpreted per request.",
    keyInsights: [
      "JSX is not HTML or a string template — it compiles to element-creating function calls (React.createElement or the automatic _jsx runtime).",
      "Only expressions go inside { } — never statements like if/for/switch; that's why conditionals use ternaries and &&.",
      "Attributes are JS property names: className not class, htmlFor not for, camelCase for the rest.",
      "Every tag must close; a component returns exactly one root node — use a Fragment (<>...</>) to avoid an extra wrapper div.",
      "true, false, null, and undefined render nothing; but 0 renders as '0', so guard numeric && conditions.",
      "Objects can't be rendered as children — map arrays to elements and give each a stable key.",
      "Content between a component's tags becomes the children prop; {...props} spreads a props object.",
      "JSX auto-escapes interpolated values (XSS protection); dangerouslySetInnerHTML is the deliberate, sanitize-first escape hatch.",
      "Comments inside JSX are {/* ... */}, and whitespace is collapsed like HTML (use {' '} for intentional spaces).",
      "Since React 17 the automatic runtime means you no longer need to import React just to write JSX.",
    ],
    codeSamples: [
      {
        label: "JSX and what it compiles to",
        language: "jsx",
        code: `// You write this JSX:
const el = (
  <h1 className="title" tabIndex={0}>
    Hello, {user.name}!
  </h1>
);

// Classic runtime compiles it to:
const elClassic = React.createElement(
  'h1',
  { className: 'title', tabIndex: 0 },
  'Hello, ', user.name, '!'
);

// Automatic runtime (React 17+) compiles it to:
import { jsx as _jsx } from 'react/jsx-runtime';
const elAuto = _jsx('h1', {
  className: 'title',
  tabIndex: 0,
  children: ['Hello, ', user.name, '!'],
});
// All three produce the SAME element object.`,
      },
      {
        label: "The rules: expressions, attributes, Fragments, children",
        language: "jsx",
        code: `function Profile({ user, onEdit, children }) {
  return (
    <> {/* Fragment: one root, no extra <div> in the DOM */}
      {/* Expression in braces — evaluates to a value */}
      <h2>Hello, {user.name.toUpperCase()}</h2>

      {/* Ternary for if/else (statements aren't allowed here) */}
      {user.isAdmin ? <span>Admin</span> : <span>Member</span>}

      {/* && for render-if-only; guard numbers so 0 doesn't leak */}
      {user.messages.length > 0 && <p>{user.messages.length} new</p>}

      {/* className not class, htmlFor not for, camelCase events */}
      <label htmlFor="bio">Bio</label>
      <textarea id="bio" className="field" readOnly maxLength={200} />

      {/* Inline style is an object: outer {} = expression, inner {} = object */}
      <button style={{ color: 'white', background: 'navy' }} onClick={onEdit}>
        Edit
      </button>

      {children} {/* content passed between this component's tags */}
    </>
  );
}`,
      },
      {
        label: "Rendering values, lists, and spreading props",
        language: "tsx",
        code: `type Item = { id: number; name: string };

function Menu({ items, ...rest }: { items: Item[] } & Record<string, unknown>) {
  return (
    <ul {...rest}> {/* spread forwards remaining props onto the <ul> */}
      {items.length === 0
        ? <li>No items</li>
        : items.map(item => (
            // key lets React track each item across renders
            <li key={item.id}>{item.name}</li>
          ))}

      {/* These render NOTHING (safe to leave in): */}
      {null}
      {undefined}
      {false}
      {/* But {0} would render the text "0" — beware numeric && */}
    </ul>
  );
}`,
      },
      {
        label: "Escaping vs dangerouslySetInnerHTML (XSS awareness)",
        language: "tsx",
        code: `function Comment({ text, trustedHtml }: { text: string; trustedHtml: string }) {
  return (
    <div>
      {/* SAFE: JSX escapes text, so tags in \`text\` render as literal
          characters — a <script> string cannot execute. */}
      <p>{text}</p>

      {/* DANGEROUS: bypasses escaping and injects raw HTML.
          Only use with content you have sanitized yourself. */}
      <div dangerouslySetInnerHTML={{ __html: trustedHtml }} />
    </div>
  );
}`,
      },
    ],
    interviewQA: [
      {
        question: "What does JSX compile to, and why does that matter?",
        answer:
          "JSX compiles to element-creating function calls: React.createElement(type, props, ...children) with the classic runtime, or _jsx(type, props) from react/jsx-runtime with the automatic runtime (React 17+). It matters because JSX is therefore just JavaScript: only expressions may appear in braces, attributes are JS property names (className, htmlFor), and the output is plain element objects, not HTML strings.",
      },
      {
        question: "Why is it className instead of class, and htmlFor instead of for?",
        answer:
          "JSX attributes map to JavaScript object keys and DOM properties, and both class and for are reserved words in JavaScript. React uses className and htmlFor to avoid the conflict, and camelCases the rest (onClick, tabIndex, readOnly) to match the DOM property naming.",
      },
      {
        question: "Can you use an if statement or a for loop inside JSX?",
        answer:
          "Not directly inside the braces — only expressions are allowed. Use a ternary for if/else and && for if-only, and use array .map() instead of a for loop. For more complex logic, compute the JSX into a variable or call a helper function before the return statement, then embed that variable.",
      },
      {
        question: "Why does {items.length && <List />} sometimes render a stray 0?",
        answer:
          "Because true/false/null/undefined render nothing, but the number 0 renders as the text '0'. When items.length is 0, the && short-circuits to 0 and React renders it. Fix it by coercing to a boolean condition, e.g. {items.length > 0 && <List />}, or by using a ternary.",
      },
      {
        question: "What is a Fragment and when do you need one?",
        answer:
          "A Fragment lets a component return multiple children without adding an extra DOM wrapper. Use the shorthand <>...</> normally; use the explicit <React.Fragment key={...}>...</React.Fragment> when you need to attach a key, such as when mapping to grouped siblings in a list.",
      },
      {
        question: "How does JSX protect against XSS, and how can you defeat that protection?",
        answer:
          "JSX automatically escapes any value you interpolate with braces, so user input renders as literal text and cannot inject executable markup. You bypass this deliberately with dangerouslySetInnerHTML={{ __html: str }}, which injects raw HTML — its scary name signals you must sanitize the string yourself first or you reintroduce an XSS vulnerability.",
      },
      {
        question: "Since React 17, why don't you need to import React to use JSX?",
        answer:
          "The automatic JSX runtime compiles JSX to calls imported from react/jsx-runtime rather than to React.createElement, so the compiler injects the needed import for you. You only import React explicitly when you use its APIs directly (e.g. React.Fragment with a key or legacy patterns).",
      },
    ],
    thingsToRemember: [
      "JSX is sugar for element-creating calls — it's JavaScript, not HTML or a template string.",
      "Only expressions in { }; use ternary and && for conditionals, .map() for lists.",
      "className not class, htmlFor not for, camelCase attributes, self-closing tags required.",
      "Return one root; use <>...</> Fragment to avoid an extra wrapper div.",
      "true/false/null/undefined render nothing; 0 renders '0' — guard numeric &&.",
      "Objects can't be children; children prop carries content between a component's tags.",
      "{...props} spreads a props object onto an element.",
      "JSX auto-escapes values (XSS safe); dangerouslySetInnerHTML is the sanitize-first escape hatch.",
      "Comments are {/* ... */}; use {' '} for intentional whitespace.",
      "React 17+ automatic runtime means no mandatory import React for JSX.",
    ],
    references: [
      { label: "React — Writing markup with JSX", url: "https://react.dev/learn/writing-markup-with-jsx" },
      { label: "React — JavaScript in JSX with curly braces", url: "https://react.dev/learn/javascript-in-jsx-with-curly-braces" },
      { label: "React — Conditional rendering", url: "https://react.dev/learn/conditional-rendering" },
      { label: "React — dangerouslySetInnerHTML", url: "https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html" },
      { label: "React — Introducing the new JSX transform", url: "https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html" },
      { label: "MDN — Cross-site scripting (XSS)", url: "https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks#cross-site_scripting_xss" },
    ],
    tags: ["react", "jsx", "syntax", "components", "fragments", "xss", "expressions", "jsx-runtime"],
  },
  {
    id: "components",
    num: 13,
    title: "Components",
    part: "React Core",
    partId: "d",
    difficulty: "Foundational",
    summary:
      "Components from first principles: function vs class components, purity and idempotent rendering, composition over inheritance, the children prop and slot patterns, container/presentational split, higher-order and render-prop patterns, and the rules that keep components predictable.",
    readingTime: 15,
    explanation: [
      "**What a component is.** A component is a reusable, self-contained piece of UI. In modern React it is simply a **JavaScript function** that accepts a single props object and returns markup (JSX). You build an entire screen by **composing** components — small focused ones (a button, an avatar) nested inside larger ones (a card, a page). This nesting *is* the app.",
      "**Function vs class components.** React originally used **class components** (extending `React.Component`, with `render()` and lifecycle methods like `componentDidMount`). Modern React uses **function components** plus **Hooks**, which are simpler, less verbose, and now the default in the docs. You'll still read class components in older codebases, but write function components going forward.",
      "**Capitalization is load-bearing.** Component names *must* start with a capital letter. JSX uses the first letter to decide: a lowercase tag (`<button>`) is treated as a built-in DOM element (a string type), while a capitalized tag (`<Button>`) is resolved to a variable in scope — your component. Lowercasing a component makes React look for a nonexistent HTML tag and render nothing useful.",
      "**Components must be pure (during render).** A component's render logic should be a **pure function** of its props and state: given the same inputs it returns the same output, and it must not mutate anything outside its scope or perform side effects (no fetching, no DOM writes, no subscriptions) while rendering. Purity is what lets React call your component multiple times, skip it, or run it in the background safely. Side effects belong in event handlers or `useEffect`.",
      "**Composition over inheritance.** React's reuse strategy is **composition**, not class inheritance. You don't extend a `BaseCard` to make a `WarningCard`; instead you build a generic `Card` and pass it different content and props. Combining small components covers every case inheritance would, without fragile hierarchies — this is an explicit recommendation in the React docs.",
      "**The children prop — the primary composition tool.** Whatever you place between a component's opening and closing tags arrives as `props.children`. This lets you build **generic containers** (a `Card`, a `Modal`, a `Layout`) that wrap arbitrary content without knowing what it is. It's React's version of a 'slot': the container owns the frame, the caller owns the contents.",
      "**Multiple slots via props.** When you need more than one insertion point, pass JSX through *named props* instead of children: `<Page header={<Nav />} sidebar={<Menu />}>{main}</Page>`. Because JSX is just a value, any prop can hold an element tree — this is how design-system layout components expose several regions.",
      "**Container vs presentational split.** A useful convention: **presentational** components are pure and take everything via props (they just render), while **container** components hold state, fetch data, and pass results down. This separation makes the presentational pieces trivially reusable and testable. Hooks have blurred the hard line, but the mental split — 'who owns data' vs 'who draws pixels' — is still valuable.",
      "**Advanced reuse patterns.** Before Hooks, cross-cutting logic was shared via **higher-order components** (a function that takes a component and returns an enhanced one, `withAuth(Profile)`) and **render props** (a component that calls a function child to share state, `<Mouse>{pos => ...}</Mouse>`). You should recognize both — they appear in libraries — but **custom Hooks** are now the idiomatic way to share stateful logic.",
      "**Keep components small and single-responsibility.** A component that fetches, transforms, lays out, and handles five events is a refactor waiting to happen. Split by responsibility; a good heuristic is that you should be able to name the component after the one thing it does. Small components compose better, re-render more narrowly, and are easier to test.",
      "**Gotchas.** Never define a component *inside* another component's body — it gets a brand-new identity on every render, so React unmounts and remounts it, discarding its state and DOM. Don't call your rendering function like a plain function (`Component()`); render it as an element (`<Component />`) so React manages its lifecycle. And a component must return something renderable (JSX, a string/number, an array, or `null`) — returning `undefined` is an error.",
      "**The mental model (memorise this).** A component is a pure function `props -> UI`. You compose small components into big ones, pass content through `children` (and extra slots through named props), keep side effects out of render, and reuse logic with custom Hooks rather than inheritance. Capitalize the name, render it as `<Component />`, and never declare it inside another component.",
    ],
    backendAnalogy:
      "A React component is like a stateless request handler or a pure service method: it takes an input object (props) and returns a description of output, without secretly mutating global state. Composition over inheritance is the same guidance you follow on the backend — prefer small collaborating services and dependency injection over deep class hierarchies (favor composition, à la 'prefer composition to inheritance' from Effective Java). The children prop is a template-method / slot: the container defines the skeleton and the caller supplies the body, much like passing a lambda into a higher-order method. Container-vs-presentational mirrors the controller/service split (orchestration and data) versus the view (pure rendering). Custom Hooks replacing HOCs/render props is like extracting shared behavior into a reusable helper function instead of wrapping everything in decorators.",
    keyInsights: [
      "A modern component is a JavaScript function that takes props and returns JSX; you compose small ones into larger ones.",
      "Function components + Hooks are today's default; class components with lifecycle methods are legacy but still readable.",
      "Component names must be capitalized so JSX treats them as components, not built-in DOM tags.",
      "Render logic must be pure — same inputs give same output, with no side effects during rendering.",
      "React reuses via composition, not inheritance: build generic components and pass different props/content.",
      "props.children carries whatever sits between a component's tags — the primary slot for generic containers.",
      "For multiple insertion points, pass JSX through named props (header, sidebar) since JSX is just a value.",
      "Container components own state/data; presentational components are pure and render from props.",
      "HOCs and render props are legacy logic-sharing patterns; custom Hooks are the modern replacement.",
      "Never define a component inside another component's render — it remounts every render and loses state.",
    ],
    codeSamples: [
      {
        label: "Function component vs legacy class component",
        language: "tsx",
        code: `// MODERN: function component (write these)
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>;
}

// LEGACY: class component (you'll still read these in old code)
import React from 'react';
class GreetingClass extends React.Component<{ name: string }> {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
// Same output; the function version has no 'this', less boilerplate,
// and uses Hooks instead of lifecycle methods for state/effects.`,
      },
      {
        label: "Composition with the children prop (a generic container)",
        language: "tsx",
        code: `// A generic, reusable frame that doesn't care what's inside it.
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded border p-4 shadow-sm">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-2">{children}</div> {/* the slot */}
    </section>
  );
}

// Callers supply arbitrary content between the tags:
function Dashboard() {
  return (
    <Card title="Expenses">
      <p>Total this month: ₹12,400</p>   {/* becomes props.children */}
      <button>View report</button>
    </Card>
  );
}`,
      },
      {
        label: "Multiple slots via named props (JSX is just a value)",
        language: "tsx",
        code: `type PageProps = {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode; // main content
};

// A layout component with three insertion points.
function Page({ header, sidebar, children }: PageProps) {
  return (
    <div className="grid grid-cols-[240px_1fr]">
      <header className="col-span-2">{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}

// Usage: pass element trees through props.
// <Page header={<Nav />} sidebar={<Menu />}>{<Report />}</Page>`,
      },
      {
        label: "Container vs presentational split",
        language: "tsx",
        code: `// PRESENTATIONAL: pure, gets everything via props, trivially testable.
function ExpenseList({ items }: { items: { id: number; label: string }[] }) {
  return (
    <ul>
      {items.map(i => <li key={i.id}>{i.label}</li>)}
    </ul>
  );
}

// CONTAINER: owns state/data, then delegates rendering downward.
import { useState, useEffect } from 'react';
function ExpenseListContainer() {
  const [items, setItems] = useState<{ id: number; label: string }[]>([]);
  useEffect(() => {
    // side effects live here, NOT in render
    fetch('/api/expenses').then(r => r.json()).then(setItems);
  }, []);
  return <ExpenseList items={items} />; // pass data down
}`,
      },
      {
        label: "The classic gotcha: never declare a component inside render",
        language: "tsx",
        code: `// ❌ BAD: Row is redefined every render -> new identity ->
//    React remounts it each time, losing its state and DOM.
function TableBad({ rows }: { rows: string[] }) {
  function Row({ text }: { text: string }) { return <li>{text}</li>; }
  return <ul>{rows.map((t, i) => <Row key={i} text={t} />)}</ul>;
}

// ✅ GOOD: define components at module scope so their identity is stable.
function Row({ text }: { text: string }) { return <li>{text}</li>; }
function TableGood({ rows }: { rows: string[] }) {
  return <ul>{rows.map(t => <Row key={t} text={t} />)}</ul>;
}`,
      },
    ],
    interviewQA: [
      {
        question: "What is a React component and how do components form an app?",
        answer:
          "A component is a reusable, self-contained piece of UI. In modern React it is a function that takes a props object and returns JSX describing what to render. You build an app by composing components — nesting small, focused ones inside larger ones — so the whole UI is a tree of components rendering other components.",
      },
      {
        question: "What is the difference between function and class components?",
        answer:
          "Class components extend React.Component, implement render(), and use lifecycle methods like componentDidMount for side effects and this.state for state. Function components are plain functions that use Hooks (useState, useEffect) instead. Function components are the modern default: less boilerplate, no this binding, and easier logic reuse via custom Hooks.",
      },
      {
        question: "Why must component render logic be pure?",
        answer:
          "Because React may call a component multiple times, skip it, or render it in the background (concurrent features). If rendering mutates external state or performs side effects, those extra calls cause bugs. A pure render — same props/state give the same JSX with no side effects — lets React optimize safely. Side effects go in event handlers or useEffect.",
      },
      {
        question: "Why does React favor composition over inheritance?",
        answer:
          "UI reuse is more naturally expressed by combining components — nesting them, passing data via props, and passing content via children — than by extending base classes. Composition keeps components decoupled, avoids fragile inheritance hierarchies, covers every case inheritance would, and matches React's function-based model. The React docs explicitly recommend it.",
      },
      {
        question: "What is the children prop and why is it useful?",
        answer:
          "children is a special prop holding whatever JSX sits between a component's opening and closing tags. It lets you build generic containers — Card, Modal, Layout — that wrap arbitrary content without knowing what it is. It is React's slot mechanism: the container defines the frame, the caller supplies the contents.",
      },
      {
        question: "What are higher-order components and render props, and what replaced them?",
        answer:
          "A higher-order component is a function that takes a component and returns an enhanced one (e.g. withAuth(Profile)) to share logic. A render prop is a component that shares state by calling a function child (e.g. <Mouse>{pos => ...}</Mouse>). Both share stateful logic across components; custom Hooks are the modern, cleaner replacement, avoiding wrapper nesting and prop collisions.",
      },
      {
        question: "Why shouldn't you define a component inside another component?",
        answer:
          "A component defined inside another's body is recreated on every render, so it gets a new function identity each time. React sees a different component type and unmounts the old instance and mounts a new one, throwing away its state and DOM and hurting performance. Define components at module scope so their identity is stable.",
      },
    ],
    thingsToRemember: [
      "A component is a function that takes props and returns JSX; compose small ones into big ones.",
      "Write function components with Hooks; recognize legacy class components with lifecycle methods.",
      "Capitalize component names so JSX treats them as components, not DOM tags.",
      "Keep render pure: no side effects, same inputs -> same output.",
      "Reuse via composition (children, named-prop slots), not inheritance.",
      "children is the primary slot; use named props for multiple insertion points.",
      "Split container (owns data/state) from presentational (pure, renders props).",
      "Prefer custom Hooks over HOCs and render props for sharing logic.",
      "Never declare a component inside another component's body.",
      "Render as <Component />, not Component(), and always return something renderable (or null).",
    ],
    references: [
      { label: "React — Your first component", url: "https://react.dev/learn/your-first-component" },
      { label: "React — Passing props to a component", url: "https://react.dev/learn/passing-props-to-a-component" },
      { label: "React — Keeping components pure", url: "https://react.dev/learn/keeping-components-pure" },
      { label: "React — Passing JSX as children", url: "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children" },
      { label: "React — Reusing logic with custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks" },
      { label: "MDN — Components (JS overview)", url: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_components" },
    ],
    tags: ["react", "components", "composition", "children", "purity", "hoc", "render-props", "function-components"],
  },
  {
    id: "props",
    num: 14,
    title: "Props",
    part: "React Core",
    partId: "d",
    difficulty: "Foundational",
    summary:
      "Props in full: a component's read-only inputs, one-way data flow, callbacks for events-up, default values and destructuring, the children prop, spreading and forwarding, typing props with TypeScript, the props-vs-state distinction, and prop-drilling with its remedies.",
    readingTime: 14,
    explanation: [
      "**What props are.** Props (short for *properties*) are the inputs to a component. A parent passes data down to a child as props; the child reads them to decide what to render. The clearest way to think about it: a component is a function and props are its single parameter object. `<ExpenseCard title=\"Lunch\" amount={1200} />` is essentially calling `ExpenseCard({ title: 'Lunch', amount: 1200 })`.",
      "**Any value can be a prop.** Props aren't limited to strings and numbers. You can pass objects, arrays, functions, other React elements, even components themselves. String props use quotes (`title=\"Lunch\"`); everything else uses braces (`amount={1200}`, `tags={['a','b']}`, `onApprove={handleApprove}`). This flexibility is what makes components configurable and reusable.",
      "**Props are read-only.** A child must **never** modify the props it receives — they belong to the parent. React relies on this: components must behave like pure functions with respect to their props. Mutating a prop (e.g. pushing into a prop array) breaks change detection and produces stale, unpredictable renders. If a value needs to change over time and be owned locally, that's *state*, not props.",
      "**One-way data flow.** Data flows in a single direction: **parent → child**. To change what a child displays, you don't reach into the child — you change the *parent's* state and re-render, which passes new props down. This top-down flow is the backbone of React's predictability: any value on screen can be traced by walking *up* the tree to whoever owns it.",
      "**Events flow up via callbacks.** If data only flows down, how does a child affect its parent? The parent passes a **function** as a prop (a callback like `onApprove`), and the child *invokes* it when something happens, optionally passing data back. The parent's handler then updates state, and new props flow back down. The slogan: **data flows down, events flow up.**",
      "**Destructuring and defaults.** Idiomatic React destructures props in the parameter list: `function Card({ title, amount, category = 'other' }) { ... }`. Default values in the destructuring give a prop a fallback when the parent omits it — the modern replacement for the old `Component.defaultProps` (which is deprecated for function components).",
      "**The children prop.** `children` is a special prop containing whatever JSX a parent nests between the component's tags. It enables generic wrappers (`<Card>...</Card>`). Because it's an ordinary prop, you render it with `{children}` wherever you want the nested content to appear.",
      "**Spreading and forwarding props.** The spread operator forwards a whole props object: `<Button {...rest} />`. This is common for wrapper components that add a little and pass the rest through to a DOM element or inner component. Be intentional — blindly spreading unknown props onto DOM nodes can leak invalid attributes, so many components destructure the props they care about and `...rest` the remainder onto the element.",
      "**Typing props with TypeScript.** In TS you declare a props type/interface and annotate the parameter: `function Card({ title }: { title: string }) {}` or a named `interface CardProps`. Optional props use `?`, callbacks are typed as functions (`onApprove?: (id: number) => void`), and `children` is typed `React.ReactNode`. Typed props are self-documenting and catch mismatched usage at compile time.",
      "**Props vs state (the classic question).** Props are inputs *passed in* from the parent and are read-only from the child's view; **state** is data a component *owns* internally and mutates via a setter, which triggers a re-render. Rule of thumb: if the parent controls it, it's a prop; if the component controls it over time, it's state. A common pattern is a parent holding state and passing slices of it down as props (lifting state up).",
      "**Prop drilling and its remedies.** Passing a prop through many intermediate components that don't use it — only to reach a deep descendant — is **prop drilling**. It's noisy and fragile. Remedies: restructure with composition (pass elements via children so intermediate layers don't touch the data), use the **Context API** for widely-shared values (theme, current user), or a state library for complex global state.",
      "**The mental model (memorise this).** Props are a component's read-only parameters, passed one-way from parent to child. To change a child you change the parent's state; to notify a parent a child calls a callback prop. Data flows down, events flow up. Destructure with defaults, type them, and when a prop is drilled too far, reach for composition or Context.",
    ],
    backendAnalogy:
      "Props are the immutable parameter object / DTO passed into a method: the callee reads them but must not mutate the caller's arguments, and they flow one way (caller → callee). A callback prop is a handler/listener you inject — like passing a Consumer or a functional-interface lambda so the callee can call you back (an Observer or the strategy pattern), which is exactly how events flow up. Typing props with TypeScript is your method signature: the compiler rejects a bad call site. Props-vs-state maps to method arguments (external, per-call) versus instance fields (owned, mutable over the object's lifetime). Prop drilling is threading the same dependency through many constructors by hand — and Context is the DI container that injects a shared dependency wherever it's needed instead.",
    keyInsights: [
      "Props are a component's inputs, passed by the parent — think function parameters bundled into one object.",
      "Any value can be a prop: strings, numbers, objects, arrays, functions, elements, even components.",
      "Props are read-only; a child must never mutate them — mutation breaks change detection.",
      "Data flows one way, parent → child; to change a child, change the parent's state and re-render.",
      "Events flow up via callback props: the child invokes a function the parent passed down.",
      "Destructure props with default values instead of the deprecated defaultProps for function components.",
      "children is a normal prop holding nested JSX; render it with {children}.",
      "Spread ({...rest}) forwards props, but avoid leaking unknown attributes onto DOM nodes.",
      "Type props with TypeScript (interface/type, ? for optional, React.ReactNode for children).",
      "Props are external and read-only; state is owned and mutable — and deep prop drilling is a signal to use composition or Context.",
    ],
    codeSamples: [
      {
        label: "Passing and receiving props (data down, events up)",
        language: "tsx",
        code: `interface CardProps {
  title: string;
  amount: number;
  category?: 'meals' | 'travel' | 'other'; // optional
  onApprove?: (id: number) => void;         // callback prop
  id: number;
}

// Destructure props with a default value for category.
function ExpenseCard({ title, amount, category = 'other', onApprove, id }: CardProps) {
  return (
    <div className="rounded border p-4">
      <h3>{title}</h3>
      <p>₹{amount.toFixed(2)}</p>
      <span>{category}</span>
      {/* child invokes the callback -> event flows UP to the parent */}
      {onApprove && <button onClick={() => onApprove(id)}>Approve</button>}
    </div>
  );
}

// Parent passes data DOWN and a callback for events UP.
function List() {
  const approve = (id: number) => console.log('approved', id);
  return (
    <ExpenseCard id={1} title="Client Lunch" amount={1200}
      category="meals" onApprove={approve} />
  );
}`,
      },
      {
        label: "children and spreading/forwarding props",
        language: "tsx",
        code: `// children: a generic wrapper renders whatever is nested inside it.
function Panel({ children }: { children: React.ReactNode }) {
  return <div className="panel">{children}</div>;
}

// Forwarding: take the props you care about, spread the rest onto <button>.
type ButtonProps = { variant?: 'primary' | 'ghost' } &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ variant = 'primary', ...rest }: ButtonProps) {
  // ...rest = onClick, disabled, type, etc. — forwarded intact.
  return <button className={\`btn btn-\${variant}\`} {...rest} />;
}

// Usage: <Button variant="ghost" disabled onClick={fn}>Save</Button>`,
      },
      {
        label: "Props vs state — where a value lives",
        language: "tsx",
        code: `import { useState } from 'react';

// PARENT owns the state (data that changes over time).
function Counter() {
  const [count, setCount] = useState(0);
  // It passes a SLICE of state down as a prop, plus a callback up.
  return <Display value={count} onIncrement={() => setCount(c => c + 1)} />;
}

// CHILD receives count as a read-only PROP; it doesn't own it.
function Display({ value, onIncrement }: { value: number; onIncrement: () => void }) {
  // value is a prop -> read-only. To change it, notify the parent.
  return <button onClick={onIncrement}>Count: {value}</button>;
}`,
      },
      {
        label: "Prop drilling vs Context (the remedy)",
        language: "tsx",
        code: `import { createContext, useContext } from 'react';

// PROBLEM: theme drilled through Layout and Toolbar just to reach Button.
// <App theme> -> <Layout theme> -> <Toolbar theme> -> <Button theme />

// REMEDY: Context provides the value to any depth without drilling.
const ThemeContext = createContext<'light' | 'dark'>('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar /> {/* no theme prop threaded through anymore */}
    </ThemeContext.Provider>
  );
}
function Toolbar() { return <ThemedButton />; }
function ThemedButton() {
  const theme = useContext(ThemeContext); // read directly from context
  return <button className={theme}>Themed</button>;
}`,
      },
    ],
    interviewQA: [
      {
        question: "What is the difference between props and state?",
        answer:
          "Props are inputs passed into a component from its parent and are read-only from the child's perspective. State is data a component owns and manages internally; changing it via its setter triggers a re-render. Props flow down from parent to child; state is local. A common pattern is a parent holding state and passing slices of it down as props (lifting state up).",
      },
      {
        question: "Why are props read-only, and how does a child change something?",
        answer:
          "Props belong to the parent, and React requires components to be pure with respect to props; mutating them breaks one-way data flow and change detection, making renders unpredictable. To change what a child shows, the child calls a callback prop to notify the parent, the parent updates its state, and new props flow back down on the next render — data flows down, events flow up.",
      },
      {
        question: "How does a child communicate back to its parent?",
        answer:
          "The parent passes a function as a prop (e.g. onApprove). The child invokes that callback when an event occurs, optionally passing data up. The parent's handler then updates state or performs a side effect. This keeps state ownership with the parent while letting children trigger changes — the callback-prop / observer pattern.",
      },
      {
        question: "How do you set default values for props in modern React?",
        answer:
          "Use default values in the destructuring of the props parameter: function Card({ category = 'other' }) {}. For function components this replaces the deprecated Component.defaultProps. Defaults apply when the parent omits the prop or passes undefined.",
      },
      {
        question: "What does spreading props ({...rest}) do, and what's the risk?",
        answer:
          "The spread forwards a whole props object onto a component or DOM element, useful for wrapper components that add a little and pass the rest through. The risk is leaking unknown or invalid attributes onto DOM nodes (React warns about unrecognized attributes). Best practice is to destructure the props you handle and spread only the remaining, valid props onto the element.",
      },
      {
        question: "What is prop drilling and how do you avoid it?",
        answer:
          "Prop drilling is passing a prop through many intermediate components that don't use it, just to reach a deep descendant. It makes code noisy and fragile. Remedies include restructuring with composition (pass elements via children so middle layers don't touch the data), using the Context API for widely shared values like theme or current user, or a state-management library for complex global state.",
      },
      {
        question: "How do you type props with TypeScript?",
        answer:
          "Declare a type or interface for the props and annotate the parameter, e.g. function Card({ title, onSave }: { title: string; onSave?: (id: number) => void }). Mark optional props with ?, type callbacks as function signatures, and type children as React.ReactNode. This makes the component self-documenting and catches incorrect usage at compile time.",
      },
    ],
    thingsToRemember: [
      "Props are a component's read-only inputs — like a function's parameter object.",
      "Any value can be a prop: strings, numbers, objects, arrays, functions, elements.",
      "Never mutate props; if a value changes over time and is owned locally, it's state.",
      "Data flows down (props), events flow up (callback props).",
      "To change a child, change the parent's state and re-render.",
      "Destructure props with default values (defaultProps is deprecated for function components).",
      "children is a normal prop; render it with {children}.",
      "Spread props deliberately; don't leak unknown attributes onto DOM nodes.",
      "Type props with TypeScript: ? for optional, function types for callbacks, React.ReactNode for children.",
      "Deep prop drilling means reach for composition or the Context API.",
    ],
    references: [
      { label: "React — Passing props to a component", url: "https://react.dev/learn/passing-props-to-a-component" },
      { label: "React — Sharing state between components", url: "https://react.dev/learn/sharing-state-between-components" },
      { label: "React — Passing data deeply with context", url: "https://react.dev/learn/passing-data-deeply-with-context" },
      { label: "React — State: a component's memory", url: "https://react.dev/learn/state-a-components-memory" },
      { label: "React TypeScript Cheatsheet — Props", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example" },
      { label: "MDN — Passing data (React components)", url: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_components" },
    ],
    tags: ["react", "props", "data-flow", "components", "children", "context", "typescript", "callbacks"],
  },
  {
    id: "state",
    num: 15,
    title: "State (useState)",
    part: "React Core",
    partId: "d",
    difficulty: "Core",
    summary:
      "State from first principles: what useState is and how it works, the render snapshot model, immutable updates for arrays and objects, functional updaters and batching, lazy initialization, why state persists across renders, lifting state up, and the pitfalls that produce stale UI.",
    readingTime: 16,
    explanation: [
      "**What state is.** State is data that (a) a component *owns*, (b) can *change over time*, and (c) *triggers a re-render* when it changes. Unlike props (passed in, read-only), state is local memory that survives between renders. If a value is derived purely from props or other state, it usually shouldn't be state at all — compute it during render instead.",
      "**Declaring state with useState.** You create a state variable with the `useState` **Hook**, which returns a pair: the current value and a setter function — `const [amount, setAmount] = useState(0)`. The argument is the *initial* value, used only on the first render. Calling the setter (`setAmount(5)`) schedules a re-render in which `amount` will be the new value.",
      "**State as a per-render snapshot (the key insight).** Within a single render, a state variable is a **constant snapshot** — it does not change mid-function even after you call the setter. `setAmount(amount + 1)` doesn't mutate `amount`; it *requests a new render* where `amount` is the next value. This is why logging `amount` right after `setAmount` shows the *old* value: you're still in the render that captured the old snapshot.",
      "**Never mutate state directly.** The first golden rule: always update through the setter with a *new* value; never assign to or mutate the existing state (`items.push(...)`, `user.name = 'x'`). React detects changes by comparing references, so mutating in place leaves the reference unchanged, React skips the re-render, and the UI goes stale. Treat state as immutable.",
      "**Immutable updates for objects and arrays.** To 'change' an object or array in state, build a *new* one. Objects: spread and override — `setUser(u => ({ ...u, name: 'Ada' }))`. Arrays: add with `[...prev, item]`, remove with `prev.filter(...)`, update with `prev.map(...)`. Never use in-place mutators like `push`, `splice`, `sort`, or direct index assignment on state arrays.",
      "**Functional updaters.** The second golden rule: when the next value depends on the previous, pass a **function** to the setter — `setCount(prev => prev + 1)` — instead of `setCount(count + 1)`. The updater receives the latest queued value, so it's correct even when React batches multiple updates or the closed-over variable is stale. It's essential when several updates happen in one event.",
      "**Batching.** React **batches** multiple state updates that occur in the same event (and, since React 18, in promises, timeouts, and native handlers too) and re-renders once with all of them applied. So three `setX` calls in one click produce one render, not three. This is why `setCount(count+1)` called twice only increments by one — both read the same stale snapshot — while two functional updaters increment by two.",
      "**Lazy initialization.** If computing the initial state is expensive, pass a *function* instead of a value: `useState(() => expensiveInit())`. React calls it only on the first render, skipping the cost on every subsequent render. Passing `useState(expensiveInit())` (calling it) would run the computation every render even though the result is ignored after the first.",
      "**State persists because of stable position.** React keeps state associated with a component by its **position in the tree**, not by variable name. As long as the same component renders in the same spot, its state survives across re-renders. Remove it from the tree (or change its type/key) and the state is discarded. This is also why keys matter for lists and why conditionally rendering different components at the same position resets state.",
      "**When to reach for useReducer.** `useState` is ideal for simple, independent values. When state is complex — multiple sub-values that change together, or updates that follow clear 'actions' — `useReducer` centralizes the transition logic into one pure reducer function, making updates predictable and testable. It's the same immutability rules, just organized differently.",
      "**Lifting state up.** When two sibling components need to share or stay in sync with the same data, move that state to their closest common parent and pass it down as props (with callbacks to update it). This 'single source of truth' pattern is the standard React answer to 'how do two components share state' — you lift it up rather than duplicating it.",
      "**The mental model (memorise this).** State is owned, changeable, render-triggering memory declared with `const [x, setX] = useState(init)`. Within a render, `x` is a frozen snapshot; calling `setX` requests a new render, it doesn't mutate `x`. Never mutate — always set a new value (spread objects/arrays). Use `prev => ...` when the next value depends on the previous, remember updates are batched, and lift shared state to the nearest common parent.",
    ],
    backendAnalogy:
      "State is like a request-scoped or session-scoped field the framework manages for you across invocations — but with a strict rule: you never mutate it in place, you replace it, much like working with immutable value objects and returning a new instance instead of setter-mutating. The functional updater setX(prev => next) is a compare-and-set / atomic accumulate: it reads the freshest value under the hood, so concurrent-ish batched updates compose correctly (contrast setX(x+1) twice, which is a lost update because both read a stale snapshot). Batching is transactional write coalescing — several changes flushed together in one commit rather than one render per write. The render snapshot is like each handler invocation seeing an immutable copy of the model; you don't see your own write until the next 'request' (render). Lifting state up is hoisting shared mutable state into a single owner to avoid two caches drifting out of sync.",
    keyInsights: [
      "State is owned, changes over time, and triggers a re-render; derived values should be computed in render, not stored as state.",
      "useState(initial) returns [value, setter]; initial is used only on the first render.",
      "Within one render a state variable is a frozen snapshot — calling the setter schedules a new render, it doesn't mutate the current value.",
      "Never mutate state in place; React compares references, so mutation leaves the UI stale.",
      "Update objects/arrays immutably: spread objects, and use map/filter/[...prev] for arrays (never push/splice/sort in place).",
      "Use the functional updater setX(prev => ...) when the next value depends on the previous.",
      "React batches multiple updates in an event into one re-render (extended to async in React 18).",
      "Use lazy init useState(() => compute()) to run an expensive initializer only once.",
      "State is tied to a component's position in the tree; removing it or changing key/type discards the state.",
      "For complex/related state use useReducer, and lift shared state to the nearest common parent (single source of truth).",
    ],
    codeSamples: [
      {
        label: "Declaring state and immutable array/object updates",
        language: "tsx",
        code: `import { useState } from 'react';

type Expense = { id: number; amount: number; approved: boolean };

function ExpenseForm() {
  const [amount, setAmount] = useState<number>(0);        // primitive
  const [items, setItems] = useState<Expense[]>([]);      // array
  const [user, setUser] = useState({ name: '', vip: false }); // object

  const add = () => {
    const next: Expense = { id: Date.now(), amount, approved: false };
    // ✅ arrays: build a NEW array
    setItems(prev => [...prev, next]);
    setAmount(0);
  };

  const approve = (id: number) =>
    // ✅ update one item immutably with map
    setItems(prev => prev.map(e => e.id === id ? { ...e, approved: true } : e));

  const remove = (id: number) =>
    // ✅ remove with filter
    setItems(prev => prev.filter(e => e.id !== id));

  const rename = (name: string) =>
    // ✅ objects: spread then override
    setUser(prev => ({ ...prev, name }));

  return null; // (UI omitted)
}`,
      },
      {
        label: "The snapshot trap: stale value and functional updaters",
        language: "tsx",
        code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const brokenDoubleIncrement = () => {
    // ❌ both read the SAME stale snapshot (count = 0) -> ends at 1, not 2
    setCount(count + 1);
    setCount(count + 1);
    console.log(count); // logs the OLD value (0) — still this render's snapshot
  };

  const correctDoubleIncrement = () => {
    // ✅ functional updater reads the latest queued value each time -> +2
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  };

  return <button onClick={correctDoubleIncrement}>{count}</button>;
}`,
      },
      {
        label: "Lazy initialization (run the initializer only once)",
        language: "tsx",
        code: `import { useState } from 'react';

function readInitialTodos() {
  // pretend this is expensive: parse localStorage, decode, etc.
  return JSON.parse(localStorage.getItem('todos') ?? '[]');
}

function TodoApp() {
  // ✅ pass a FUNCTION: React calls it only on the first render.
  const [todos, setTodos] = useState(() => readInitialTodos());

  // ❌ useState(readInitialTodos()) would run it on EVERY render
  //    (result ignored after the first) — wasteful.
  return <p>{todos.length} todos</p>;
}`,
      },
      {
        label: "Lifting state up so siblings share one source of truth",
        language: "tsx",
        code: `import { useState } from 'react';

// Parent OWNS the shared state and passes it to both children.
function Filters() {
  const [query, setQuery] = useState('');
  return (
    <>
      <SearchBox query={query} onChange={setQuery} />
      <Results query={query} /> {/* stays in sync automatically */}
    </>
  );
}

function SearchBox({ query, onChange }: { query: string; onChange: (v: string) => void }) {
  return <input value={query} onChange={e => onChange(e.target.value)} />;
}
function Results({ query }: { query: string }) {
  return <p>Searching for: {query}</p>;
}`,
      },
    ],
    runnable: {
      title: "Immutable vs mutating updates — why the setter needs a NEW reference",
      html: `<h3>Why mutating state fails (plain JS analogy of React's ref check)</h3>
<button id="mutate">Mutate in place (React would SKIP re-render)</button>
<button id="immutable">Immutable update (React re-renders)</button>
<pre id="out"></pre>`,
      css: `body { font-family: system-ui, sans-serif; padding: 16px; }
button { display:block; margin: 6px 0; padding: 8px 12px; cursor: pointer; }
pre { background:#0f172a; color:#e2e8f0; padding:12px; border-radius:8px; }`,
      js: `// React decides "did state change?" by comparing the OLD and NEW
// reference with Object.is. Same reference -> no re-render.
let state = [1, 2, 3];
const out = document.getElementById('out');
function log(label, oldRef, newRef) {
  out.textContent =
    label + '\\n' +
    'same reference? ' + Object.is(oldRef, newRef) +
    '\\n=> React would ' + (Object.is(oldRef, newRef) ? 'SKIP' : 'DO') +
    ' a re-render\\nvalue: ' + JSON.stringify(newRef);
}

document.getElementById('mutate').onclick = () => {
  const before = state;
  state.push(state.length + 1);   // ❌ mutating: reference unchanged
  log('Mutated in place:', before, state);
};

document.getElementById('immutable').onclick = () => {
  const before = state;
  state = [...state, state.length + 1]; // ✅ new array: new reference
  log('Immutable update:', before, state);
};`,
    },
    interviewQA: [
      {
        question: "Why can't you mutate state directly in React?",
        answer:
          "React detects changes by comparing references with Object.is. If you mutate the existing array or object in place (items.push(...)), the reference is unchanged, so React may skip the re-render and the UI goes stale. You must call the setter with a new value (a new array/object), which both triggers a re-render and keeps updates predictable. Treat state as immutable.",
      },
      {
        question: "What does it mean that state is a snapshot?",
        answer:
          "Within a single render, a state variable holds a fixed value that doesn't change even after you call the setter. Calling the setter schedules a future render with the new value; it does not mutate the current variable. That's why logging state immediately after setState shows the old value — you're still executing the render that captured the previous snapshot.",
      },
      {
        question: "When should you use the functional updater form of a setter?",
        answer:
          "Whenever the next state depends on the previous state — appending to a list, incrementing a counter, toggling. setCount(prev => prev + 1) reads the latest queued value, so it's correct even when React batches multiple updates or the closed-over variable is stale. Two calls to setCount(count + 1) only increment once because both read the same snapshot; two functional updaters increment twice.",
      },
      {
        question: "What is state batching?",
        answer:
          "React groups multiple state updates that occur together and applies them in a single re-render instead of one render per setter call. In React 18 batching was extended to asynchronous contexts like promises, timeouts, and native event handlers (automatic batching). It's a performance optimization and another reason to use functional updaters when an update depends on the previous value.",
      },
      {
        question: "What is lazy initialization and when do you use it?",
        answer:
          "Passing a function to useState — useState(() => compute()) — makes React call the initializer only on the first render instead of every render. Use it when computing the initial state is expensive (e.g. reading and parsing localStorage). Passing useState(compute()) would run the computation on every render even though the result is ignored after the first.",
      },
      {
        question: "Why do two components sometimes need state lifted up?",
        answer:
          "When two components must share the same data or stay in sync, keeping separate copies causes them to drift. Lifting state up moves it to their closest common parent, which becomes the single source of truth and passes the value down as props (with callbacks to update it). This keeps the components consistent and matches React's one-way data flow.",
      },
      {
        question: "When would you choose useReducer over useState?",
        answer:
          "Use useReducer when state is complex — several related sub-values that change together, or updates that map cleanly to named actions. It centralizes transition logic in one pure reducer function, making updates predictable, testable, and easier to reason about than scattering many setState calls. The immutability rules are the same; the organization is different.",
      },
    ],
    thingsToRemember: [
      "State is owned, changeable, render-triggering memory: const [x, setX] = useState(initial).",
      "Within a render, state is a frozen snapshot; setX schedules a new render, it doesn't mutate x.",
      "Never mutate state in place — React compares references and will skip the update.",
      "Update objects with spread, arrays with map/filter/[...prev] (never push/splice/sort).",
      "Use setX(prev => ...) when the next value depends on the previous.",
      "Updates are batched into one re-render (async too, in React 18).",
      "Use lazy init useState(() => compute()) for expensive initial values.",
      "State is tied to the component's position/key in the tree; remove or re-key it and it resets.",
      "Prefer useReducer for complex or action-driven state.",
      "Lift shared state to the nearest common parent as the single source of truth.",
    ],
    references: [
      { label: "React — State: a component's memory", url: "https://react.dev/learn/state-a-components-memory" },
      { label: "React — State as a snapshot", url: "https://react.dev/learn/state-as-a-snapshot" },
      { label: "React — Queueing a series of state updates", url: "https://react.dev/learn/queueing-a-series-of-state-updates" },
      { label: "React — Updating arrays in state", url: "https://react.dev/learn/updating-arrays-in-state" },
      { label: "React — Updating objects in state", url: "https://react.dev/learn/updating-objects-in-state" },
      { label: "React — useState reference", url: "https://react.dev/reference/react/useState" },
    ],
    tags: ["react", "state", "usestate", "immutability", "batching", "functional-updater", "lifting-state", "snapshot"],
  },
  {
    id: "events",
    num: 16,
    title: "Events",
    part: "React Core",
    partId: "d",
    difficulty: "Core",
    summary:
      "React events in depth: attaching handlers, passing vs calling functions, the SyntheticEvent wrapper and event delegation, preventDefault and stopPropagation, controlled inputs and forms, passing arguments to handlers, and how React's system differs from native DOM listeners.",
    readingTime: 15,
    explanation: [
      "**What events are for.** Events let components respond to user interaction — clicks, typing, submitting, hovering, key presses. In React you attach handlers declaratively with camelCase props like `onClick`, `onChange`, `onSubmit`, `onKeyDown`, passing a **function reference**: `<button onClick={handleClick}>`. You describe *which* function handles the event; React wires up the actual listening for you.",
      "**Pass the function, don't call it (the #1 bug).** `onClick={handleClick}` passes the function so React calls it on click. `onClick={handleClick()}` *calls it immediately during render* and uses the return value as the handler — usually a bug that fires on every render. To pass arguments, wrap it in an arrow: `onClick={() => handleClick(id)}` — now you're passing a *new function* that calls yours with the argument when clicked.",
      "**SyntheticEvent — a cross-browser wrapper.** React doesn't hand you the raw browser event; it wraps it in a **SyntheticEvent** that normalizes differences across browsers and exposes a consistent API (`e.target`, `e.preventDefault()`, `e.stopPropagation()`, `e.currentTarget`). This gives uniform behavior everywhere. If you ever need the underlying browser event, it's available as `e.nativeEvent`.",
      "**Event delegation under the hood.** React does not attach a listener to every DOM node. Instead it uses **event delegation**: it attaches listeners at the root container and lets events **bubble** up, then dispatches them to the right handler. In React 17+ these root listeners are attached to the app's root container (not `document`), which improves interoperability when embedding React in other apps. You get per-element handlers in your code, but far fewer real DOM listeners.",
      "**preventDefault — stop the browser's default action.** Some events have built-in browser behavior: submitting a form reloads/navigates the page, clicking a link navigates, checkboxes toggle. Call `e.preventDefault()` to cancel that default so you can handle it in JavaScript instead — the classic case is a form's `onSubmit` in a single-page app, where you `preventDefault()` then update state or fetch.",
      "**stopPropagation — stop the bubble.** Events bubble from the target up through ancestors, so a click on a button inside a card triggers both the button's and the card's `onClick`. Call `e.stopPropagation()` in the inner handler to prevent the event from reaching outer handlers. `preventDefault` and `stopPropagation` are independent: one cancels the default action, the other stops propagation.",
      "**Controlled inputs — React owns the value.** A **controlled** input has its `value` driven by state and an `onChange` that updates that state: `<input value={x} onChange={e => setX(e.target.value)} />`. React is the single source of truth, which enables validation, formatting, conditional disabling, and always-consistent UI. This loop — state → value → onChange → setState → re-render — is the foundation of React forms.",
      "**Uncontrolled inputs — the DOM owns the value.** An **uncontrolled** input keeps its own value in the DOM; you read it via a `ref` (or from the form on submit) rather than binding it to state. It's simpler for basic forms and integrates with non-React code, but you lose React's live control. Rule of thumb: prefer controlled for anything with validation or dynamic behavior; uncontrolled is fine for simple, fire-and-forget inputs.",
      "**Forms and onSubmit.** Handle submission on the `<form>`'s `onSubmit`, not the button's `onClick`, so keyboard Enter also works. Call `e.preventDefault()` first, then read values (from state for controlled inputs, or from `e.target`/refs otherwise) and do the work — update state, validate, or make a request. Give the submit button `type=\"submit\"`.",
      "**Handler definition styles.** Handlers are just functions. Inline arrows (`onClick={() => approve(id)}`) are convenient for passing arguments and for tiny logic. Named handlers defined in the component body keep complex logic readable and are easier to test. A minor performance note: inline arrows create a new function each render, which usually doesn't matter unless you're passing them to heavily memoized children (then reach for `useCallback`).",
      "**Differences from native DOM events.** Beyond delegation and SyntheticEvent: React uses camelCase (`onClick`, not lowercase `onclick`), you pass functions not strings, and returning `false` from a handler does *not* prevent default (you must call `e.preventDefault()`). Since React 17, SyntheticEvents are no longer pooled, so you can safely access the event asynchronously without calling `e.persist()`.",
      "**The mental model (memorise this).** Attach camelCase handlers by passing a function reference (wrap in an arrow to pass args). React gives you a normalized SyntheticEvent and uses root-level delegation. Call `preventDefault()` to cancel the browser's default (e.g. form reload) and `stopPropagation()` to stop bubbling. Bind input `value` to state with `onChange` for controlled inputs, and handle forms on `onSubmit`.",
    ],
    backendAnalogy:
      "React's event system is a dispatcher/front-controller: instead of registering a listener on every widget, it registers once at the root and routes bubbling events to the right handler — like a single Vert.x router or a Spring DispatcherServlet fanning requests out to the correct controller method rather than one server socket per endpoint. The SyntheticEvent is an adapter/normalized request object shielding you from browser (transport) quirks, and e.nativeEvent is the raw underlying request if you need it. preventDefault() is short-circuiting the framework's default handling (like returning early before the default view renders), and stopPropagation() is halting a filter/middleware chain so upstream interceptors don't also run. A controlled input is a two-way-bound field where your model is the single source of truth and every keystroke is a state transition — much like validating and echoing form fields through the server model rather than trusting the client's own copy.",
    keyInsights: [
      "Attach handlers with camelCase props (onClick, onChange, onSubmit) and pass a function reference, not a call.",
      "onClick={fn} passes the function; onClick={fn()} calls it during render (a bug) — use onClick={() => fn(arg)} to pass arguments.",
      "Handlers receive a SyntheticEvent: a cross-browser wrapper with e.target, e.preventDefault, e.stopPropagation; raw event is e.nativeEvent.",
      "React uses event delegation at the root container (since v17), not one listener per node.",
      "e.preventDefault() cancels the browser default (form reload, link navigation, etc.).",
      "e.stopPropagation() stops the event bubbling to ancestor handlers; it's independent of preventDefault.",
      "Controlled input: value bound to state + onChange updating it — React is the single source of truth.",
      "Uncontrolled input: DOM holds the value, read via ref; simpler but less control — prefer controlled for validation.",
      "Handle form submission on <form> onSubmit (so Enter works), calling preventDefault first.",
      "React events are camelCase functions (not string onclick), returning false doesn't prevent default, and events aren't pooled since v17.",
    ],
    codeSamples: [
      {
        label: "Passing vs calling handlers, and passing arguments",
        language: "tsx",
        code: `function Toolbar({ id }: { id: number }) {
  const handleClick = () => console.log('clicked');
  const approve = (itemId: number) => console.log('approve', itemId);

  return (
    <>
      {/* ✅ pass the function reference */}
      <button onClick={handleClick}>OK</button>

      {/* ❌ calls immediately during render, sets return value as handler */}
      {/* <button onClick={handleClick()}>Bug</button> */}

      {/* ✅ arrow wrapper to pass an argument on click */}
      <button onClick={() => approve(id)}>Approve</button>
    </>
  );
}`,
      },
      {
        label: "Controlled form: onSubmit, onChange, preventDefault",
        language: "tsx",
        code: `import { useState } from 'react';

function ExpenseForm() {
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();          // stop the browser's full-page reload
    console.log({ amount, note }); // use the controlled state values
    setAmount(0); setNote('');   // reset the form via state
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* controlled: value from state, onChange writes back to state */}
      <input type="number" value={amount}
        onChange={e => setAmount(Number(e.target.value))} />
      <input type="text" value={note}
        onChange={e => setNote(e.target.value)} />
      <button type="submit">Add Expense</button>
    </form>
  );
}`,
      },
      {
        label: "stopPropagation vs preventDefault (bubbling)",
        language: "tsx",
        code: `function Card() {
  const openCard = () => console.log('card clicked');
  const deleteItem = (e: React.MouseEvent) => {
    e.stopPropagation(); // don't let the click bubble to the card's onClick
    console.log('deleted (card did NOT open)');
  };

  return (
    <div onClick={openCard} className="card">
      <p>Click the card to open it.</p>
      {/* Without stopPropagation, clicking Delete would ALSO open the card */}
      <button onClick={deleteItem}>Delete</button>

      {/* preventDefault example: cancel link navigation */}
      <a href="/somewhere" onClick={e => e.preventDefault()}>Won't navigate</a>
    </div>
  );
}`,
      },
      {
        label: "Controlled vs uncontrolled input",
        language: "tsx",
        code: `import { useState, useRef } from 'react';

// CONTROLLED: React state is the source of truth (validate/format live).
function Controlled() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}

// UNCONTROLLED: the DOM keeps the value; read it via a ref when needed.
function Uncontrolled() {
  const ref = useRef<HTMLInputElement>(null);
  const read = () => console.log(ref.current?.value); // read on demand
  return (
    <>
      <input ref={ref} defaultValue="" /> {/* defaultValue, not value */}
      <button onClick={read}>Read</button>
    </>
  );
}`,
      },
    ],
    runnable: {
      title: "Event bubbling & stopPropagation — watch the event travel",
      html: `<div id="outer" style="padding:24px;background:#e2e8f0;border-radius:10px">
  outer
  <div id="inner" style="padding:24px;background:#c7d2fe;border-radius:10px">
    inner
    <button id="btn">click me</button>
  </div>
</div>
<label><input type="checkbox" id="stop"> call stopPropagation() on the button</label>
<pre id="out"></pre>`,
      css: `body { font-family: system-ui, sans-serif; padding:16px; }
pre { background:#0f172a; color:#e2e8f0; padding:12px; border-radius:8px; min-height:60px; }
button { margin-top:8px; padding:6px 12px; cursor:pointer; }
label { display:block; margin-top:12px; }`,
      js: `// React uses delegation + bubbling under the hood. This plain-JS demo
// shows the same bubbling that React's SyntheticEvent system relies on.
const out = document.getElementById('out');
const log = (m) => { out.textContent += m + '\\n'; };

['outer','inner','btn'].forEach(id => {
  document.getElementById(id).addEventListener('click', (e) => {
    log('handler on #' + id + ' fired');
    // Mimic React's e.stopPropagation() to halt the bubble.
    if (id === 'btn' && document.getElementById('stop').checked) {
      e.stopPropagation();
      log('  -> stopPropagation(): outer/inner will NOT fire');
    }
  });
});

document.getElementById('btn').addEventListener('click', () => {}, false);
log('Click the button. Toggle the checkbox to stop bubbling.');`,
    },
    interviewQA: [
      {
        question: "What is the difference between onClick={fn} and onClick={fn()}?",
        answer:
          "onClick={fn} passes the function reference so React invokes it on click. onClick={fn()} calls fn immediately during render and assigns its return value as the handler — usually a bug that also fires every render. To pass arguments, wrap it: onClick={() => fn(id)}, which creates a function that calls fn with the argument when the click occurs.",
      },
      {
        question: "What is a SyntheticEvent?",
        answer:
          "It is React's cross-browser wrapper around the native DOM event. It normalizes browser differences and gives handlers a consistent interface (e.target, e.currentTarget, e.preventDefault, e.stopPropagation). React dispatches it via event delegation at the root container. The underlying browser event is available as e.nativeEvent, and since React 17 SyntheticEvents are no longer pooled.",
      },
      {
        question: "How does React's event system use delegation?",
        answer:
          "Rather than attaching a listener to every DOM node, React attaches listeners at the root container (since React 17; previously document) and relies on native event bubbling. When an event bubbles up, React dispatches it to the appropriate component handlers. This reduces the number of real DOM listeners and centralizes event management.",
      },
      {
        question: "Why call e.preventDefault() in a form's onSubmit handler?",
        answer:
          "By default, submitting a form causes the browser to reload or navigate the page. In a single-page React app you handle submission in JavaScript, so you call e.preventDefault() to cancel that default navigation and instead update state, validate, or make a fetch request.",
      },
      {
        question: "What is the difference between preventDefault and stopPropagation?",
        answer:
          "preventDefault cancels the browser's default action for the event (form reload, link navigation, checkbox toggle) but lets the event continue bubbling. stopPropagation stops the event from bubbling to ancestor handlers but does not cancel the default action. They are independent; you can call either, both, or neither.",
      },
      {
        question: "What is a controlled vs uncontrolled input?",
        answer:
          "A controlled input's value is driven by React state (value={x} with an onChange that updates state), making React the single source of truth — ideal for validation and dynamic behavior. An uncontrolled input keeps its own value in the DOM, and you read it via a ref or on submit (using defaultValue for the initial value). Controlled is generally preferred; uncontrolled is simpler for basic forms.",
      },
      {
        question: "Should you handle form submission on the button's onClick or the form's onSubmit?",
        answer:
          "Use the form's onSubmit. It fires for clicks on the submit button and for pressing Enter in a field, so keyboard users work correctly, and it's the semantic place to preventDefault and gather values. Handling it on the button's onClick misses the Enter-key submission path.",
      },
    ],
    thingsToRemember: [
      "Attach handlers with camelCase props: onClick, onChange, onSubmit, onKeyDown.",
      "Pass the function reference; wrap in an arrow to pass arguments — never call it in JSX.",
      "Handlers get a SyntheticEvent (cross-browser); raw event is e.nativeEvent.",
      "React delegates events at the root container (since v17) rather than per-node listeners.",
      "preventDefault() cancels the default action (e.g. form reload); stopPropagation() stops bubbling.",
      "Controlled input: value bound to state + onChange — React is the source of truth.",
      "Uncontrolled input: DOM owns the value, read via ref, initialize with defaultValue.",
      "Handle submission on <form> onSubmit so Enter works; give the button type=\"submit\".",
      "Returning false from a handler does NOT prevent default — call e.preventDefault().",
      "Inline arrows are fine; reach for useCallback only when passing to memoized children.",
    ],
    references: [
      { label: "React — Responding to events", url: "https://react.dev/learn/responding-to-events" },
      { label: "React — Reacting to input with state", url: "https://react.dev/learn/reacting-to-input-with-state" },
      { label: "React — SyntheticEvent reference", url: "https://react.dev/reference/react-dom/components/common#react-event-object" },
      { label: "React — <input> (controlled components)", url: "https://react.dev/reference/react-dom/components/input" },
      { label: "MDN — Event bubbling and capture", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_bubbling" },
      { label: "MDN — preventDefault", url: "https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault" },
    ],
    tags: ["react", "events", "onchange", "forms", "synthetic-event", "controlled-inputs", "delegation", "preventdefault"],
  },
  {
    id: "rendering-patterns-lists-keys-conditionals",
    num: 17,
    title: "Rendering Patterns (Lists, Keys, Conditionals)",
    part: "React Core",
    partId: "d",
    difficulty: "Core",
    summary:
      "The patterns you use on every screen: rendering lists with .map(), why keys exist and why the index is dangerous, conditional rendering with ternary/&&/early-return and the 0 pitfall, empty and loading states, Fragments in lists, and how keys drive reconciliation and preserve state.",
    readingTime: 16,
    explanation: [
      "**Rendering a list.** You render a collection by mapping an array to an array of elements: `items.map(item => <li key={item.id}>{item.label}</li>)`. JSX accepts an array of elements as children, so the map result drops straight into your markup. This transform-then-render pattern is how every table, feed, and menu is built in React.",
      "**Why keys exist.** Every element in a list needs a **key** — a string or number that is *stable and unique among siblings*. Keys are React's way of giving each list item an **identity** so that, during reconciliation, it can match items between the old and new render: which stayed, which were added, which were removed, which moved. Without stable identity, React can only match by position.",
      "**Keys preserve state and DOM (the real reason).** Because keys establish identity, React reuses the same component instance and DOM node for an item that keeps its key across renders — preserving its state (input text, focus, scroll, animation) and avoiding needless DOM churn. Change an item's key and React throws away the old instance and mounts a fresh one. So keys aren't just a warning-silencer; they control component lifecycle within lists.",
      "**Never use the array index as a key for dynamic lists.** The index is *positional*, not *identity*. If items are inserted, removed, reordered, or filtered, the same index now points to a *different* item — so React reuses the wrong instance and DOM node, causing subtle bugs: a checkbox stays checked on the wrong row, an input holds another item's text, animations glitch. Use a real domain id (`item.id`). Index keys are only acceptable for a static list that never changes order or length.",
      "**Where the key goes.** Put the key on the *outermost element returned by the map callback*, not on inner elements. When each item needs multiple sibling elements without a wrapper, use `<React.Fragment key={id}>...</React.Fragment>` — the shorthand `<>` can't take a key, so this is the one place you need the explicit Fragment.",
      "**Conditional rendering — the toolkit.** JSX only allows expressions, so conditionals are expressed as expressions. **Ternary** for if/else: `{isAdmin ? <Admin /> : <Guest />}`. **`&&`** for render-if-only (no else): `{error && <Alert msg={error} />}`. **Early return** for whole-component branches (loading, error, empty) before the main JSX. **Assign to a variable** before `return` when the logic is too gnarly for inline. All four are common and idiomatic.",
      "**The `&&` falsy-number pitfall.** `{count && <Badge n={count} />}` renders the literal `0` when `count` is `0`, because `0` is falsy and short-circuits to `0` — which React renders as text. Always guard with a boolean condition: `{count > 0 && <Badge n={count} />}`, or use a ternary `{count ? <Badge n={count} /> : null}`. The same trap applies to empty strings.",
      "**Empty, loading, and error states — render them deliberately.** Real lists are rarely just 'the data.' Handle the states explicitly, usually with early returns: `if (loading) return <Spinner />;` then `if (error) return <Error />;` then `if (items.length === 0) return <Empty />;` and finally the mapped list. Forgetting the empty state (rendering a blank `<ul>`) is a classic UX bug.",
      "**Composition of the patterns.** A typical list component layers them: guard the loading/error/empty states first, then `.map()` the data into keyed elements, and inside each item use ternaries and `&&` to vary its display (a badge if approved, a button if actionable). Keeping keys stable is the single most important rule because it preserves item state through all this.",
      "**Keys are for React, not for you.** Keys never appear in the DOM and you can't read them back inside the component (`props.key` is undefined) — if you need the id inside, pass it as a separate prop too. Also, keys only need to be unique *among siblings*, not globally, so two different lists can both use `key={item.id}` even if ids overlap across lists.",
      "**Performance note.** Rendering huge lists (thousands of rows) even with correct keys can be slow because React still builds and diffs every element. For very large lists, use **windowing/virtualization** (e.g. react-window) to render only the visible rows. Stable keys remain essential — they let the virtualized library recycle rows correctly.",
      "**The mental model (memorise this).** Map arrays to elements and give each a *stable, unique* key (a real id, never the index for dynamic lists) — keys give items identity so reconciliation preserves their state and DOM. Do conditionals with ternary (if/else), `&&` (if-only, but guard `0`), and early returns for loading/error/empty. Layer them: guard states, then map to keyed elements, then vary each item internally.",
    ],
    backendAnalogy:
      "A key is a stable primary key / entity id, and reconciliation is a diff/merge against the previous result set: with a real id, React (like an upsert keyed on the PK) knows exactly which rows to update, insert, delete, or leave alone, so per-row state survives. Keying by array index is like keying a cache or a database join on row-ordinal instead of the primary key — reorder the result set and every downstream association silently points at the wrong record, the classic source of 'the data looks shuffled' bugs. Conditional rendering (ternary/&&/early return) is the same guard-clause discipline you use in a handler: validate and short-circuit the loading/error/empty cases before the happy path. Virtualizing a huge list is pagination/streaming — you never materialize the whole result set in the viewport, you render the visible window and recycle rows keyed by id.",
    keyInsights: [
      "Render lists by mapping an array to elements; JSX accepts an array of elements as children.",
      "Every list item needs a key that is stable and unique among its siblings.",
      "Keys give items identity so reconciliation can match them across renders, preserving their state and DOM.",
      "Never use the array index as a key for dynamic lists — reorder/insert/remove makes the index point at a different item, causing state to attach to the wrong row.",
      "Put the key on the outermost mapped element; use <React.Fragment key=...> when an item needs multiple siblings (the <> shorthand can't take a key).",
      "Conditionals: ternary for if/else, && for if-only, early return for whole-component branches, or a variable before return for complex logic.",
      "Guard the && number pitfall: {count > 0 && ...} — a bare {count && ...} renders a stray 0 when count is 0.",
      "Handle loading, error, and especially empty states explicitly — a blank list is a common UX bug.",
      "Keys are for React only: they don't appear in the DOM and can't be read via props.key; they need only be unique per sibling list.",
      "For very large lists, use windowing/virtualization; stable keys still matter so rows recycle correctly.",
    ],
    codeSamples: [
      {
        label: "List with keys plus loading/error/empty guards",
        language: "tsx",
        code: `type Expense = { id: number; amount: number; category: string; approved: boolean };

function ExpenseList({ items, loading, error }:
  { items: Expense[]; loading: boolean; error?: string }) {

  // Guard states first, with early returns.
  if (loading) return <p>Loading…</p>;
  if (error)   return <p role="alert">{error}</p>;
  if (items.length === 0) return <p className="muted">No expenses yet.</p>;

  return (
    <ul>
      {items.map(expense => (
        // key: stable & unique among siblings — use the id, NEVER the index
        <li key={expense.id}>
          ₹{expense.amount} · {expense.category}
          {/* && for if-only; ternary inside the item to vary display */}
          {expense.approved
            ? <span> ✅ approved</span>
            : <button> Approve</button>}
        </li>
      ))}
    </ul>
  );
}`,
      },
      {
        label: "Why index keys break: state attaches to the wrong row",
        language: "tsx",
        code: `import { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState(['Buy milk', 'Walk dog', 'Pay bills']);

  const removeFirst = () => setTodos(prev => prev.slice(1));

  return (
    <>
      <button onClick={removeFirst}>Remove first</button>
      <ul>
        {todos.map((todo, index) => (
          // ❌ key={index}: after removing the first item, every remaining
          //    item shifts index, so the <input>'s typed text (its state)
          //    stays with the OLD position and appears on the WRONG todo.
          // ✅ Fix: give each todo a real stable id and key by that.
          <li key={index}>
            <input defaultValue={todo} /> {/* uncontrolled state = the bug */}
          </li>
        ))}
      </ul>
    </>
  );
}`,
      },
      {
        label: "Conditional rendering patterns and the 0 pitfall",
        language: "tsx",
        code: `function StatusBar({ count, isAdmin, error }:
  { count: number; isAdmin: boolean; error?: string }) {

  // Compute complex JSX into a variable before return.
  const role = isAdmin ? <b>Admin</b> : <span>Member</span>;

  return (
    <div>
      {/* ternary for if/else */}
      {role}

      {/* && for if-only (no else) */}
      {error && <p role="alert">{error}</p>}

      {/* ❌ {count && ...} renders "0" when count === 0 */}
      {/* ✅ guard with a boolean so nothing renders at 0 */}
      {count > 0 && <span>{count} new items</span>}

      {/* ternary returning null is another clean if-only */}
      {count > 0 ? <span> (has items)</span> : null}
    </div>
  );
}`,
      },
      {
        label: "Fragments in a list (multiple siblings per item, keyed)",
        language: "tsx",
        code: `import React from 'react';

type Row = { id: number; term: string; definition: string };

function Glossary({ rows }: { rows: Row[] }) {
  return (
    <dl>
      {rows.map(row => (
        // Each item needs TWO siblings (<dt>+<dd>) with no wrapper element.
        // The <> shorthand can't take a key, so use the explicit Fragment.
        <React.Fragment key={row.id}>
          <dt>{row.term}</dt>
          <dd>{row.definition}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}`,
      },
    ],
    runnable: {
      title: "Index keys vs id keys — see state stick to the wrong row",
      html: `<h3>Type in a box, then remove the first row. Watch where the text goes.</h3>
<div class="cols">
  <div><h4>Keyed by INDEX (buggy)</h4><ul id="byIndex"></ul></div>
  <div><h4>Keyed by ID (correct)</h4><ul id="byId"></ul></div>
</div>
<button id="remove">Remove first row from both</button>`,
      css: `body { font-family: system-ui, sans-serif; padding:16px; }
.cols { display:flex; gap:24px; }
ul { list-style:none; padding:0; }
li { margin:4px 0; }
input { padding:4px 6px; }
button { margin-top:12px; padding:8px 12px; cursor:pointer; }`,
      js: `// Emulate React's reconciliation by reusing DOM nodes keyed either by
// index (positional) or by id (identity). Inputs hold their own DOM state.
let data = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
  { id: 'c', label: 'Gamma' },
];

const byIndex = document.getElementById('byIndex');
const byId = document.getElementById('byId');
const nodeCache = {}; // id -> reused <li> (identity-based, like a good key)

function renderByIndex() {
  // Positional reuse: node at position i is kept regardless of which item.
  data.forEach((item, i) => {
    let li = byIndex.children[i];
    if (!li) { li = mkRow(); byIndex.appendChild(li); }
    li.querySelector('.lbl').textContent = item.label;
    // NOTE: we do NOT reset the input -> typed text stays by POSITION.
  });
  while (byIndex.children.length > data.length) byIndex.lastChild.remove();
}

function renderById() {
  byId.innerHTML = '';
  data.forEach(item => {
    // Identity reuse: same id -> same <li> node (and its input) reused.
    let li = nodeCache[item.id];
    if (!li) { li = mkRow(); nodeCache[item.id] = li; }
    li.querySelector('.lbl').textContent = item.label;
    byId.appendChild(li);
  });
}

function mkRow() {
  const li = document.createElement('li');
  li.innerHTML = '<span class="lbl"></span> <input placeholder="type here">';
  return li;
}

document.getElementById('remove').onclick = () => {
  data = data.slice(1);            // remove the first item
  renderByIndex(); renderById();
  console.log('Removed first row. Index list: text stuck to the wrong row. ' +
              'Id list: text followed its item.');
};

renderByIndex(); renderById();`,
    },
    interviewQA: [
      {
        question: "Why does React need a key on list items, and why not use the array index?",
        answer:
          "Keys give each list item a stable identity so React can match elements between renders during reconciliation, preserving their state and DOM nodes when the list changes. The array index is positional, not identity: if items are inserted, removed, reordered, or filtered, the same index points to a different item, so React reuses the wrong instance and DOM/state — causing bugs like inputs or checkboxes showing on the wrong row. Use a real domain id; index keys are acceptable only for a static, never-reordered list.",
      },
      {
        question: "How do keys actually affect reconciliation?",
        answer:
          "During reconciliation React compares the new and old children of a list. It matches items by key: same key means reuse the existing component instance and DOM node (preserving its state); a new key means mount a fresh instance; a missing key means unmount. So keys drive whether item state and DOM survive across renders, not just whether a warning appears.",
      },
      {
        question: "What are the main conditional rendering patterns in React?",
        answer:
          "A ternary {cond ? <A /> : <B />} for if/else; the && operator {cond && <A />} for render-if-only; an early return for whole-component branches like loading, error, or empty states; and assigning JSX to a variable before the return for complex logic. All are expressions, which is what JSX allows inside braces.",
      },
      {
        question: "What's the pitfall of using && for conditional rendering?",
        answer:
          "If the left side is a falsy number like 0 (or an empty string), React renders it instead of nothing — {count && <List />} shows '0' when count is 0. Coerce to a boolean (count > 0 && ...) or use a ternary returning null to avoid leaking falsy values into the output.",
      },
      {
        question: "Where do you put the key, and what if an item needs multiple sibling elements?",
        answer:
          "Put the key on the outermost element returned by the map callback. If an item needs multiple siblings without a wrapper element, wrap them in <React.Fragment key={id}>...</React.Fragment>. The shorthand <> cannot take a key, so the explicit Fragment is required in that case.",
      },
      {
        question: "Can you read a component's key inside the component?",
        answer:
          "No. key is consumed by React and is not passed to the component as a prop, so props.key is undefined and it never appears in the DOM. If you need the id inside the component, pass it as a separate prop in addition to the key. Keys also only need to be unique among siblings, not globally.",
      },
      {
        question: "How do you render a very large list efficiently?",
        answer:
          "Even with correct keys, React builds and diffs every element, so thousands of rows can be slow. Use windowing/virtualization (e.g. react-window or react-virtualized) to render only the rows visible in the viewport and recycle them as you scroll. Stable keys are still required so the virtualization library can recycle rows correctly.",
      },
    ],
    thingsToRemember: [
      "Render lists with .map(); every item needs a stable, unique-among-siblings key.",
      "Use a real id for keys — NEVER the array index for lists that reorder, insert, or remove.",
      "Keys give identity: they preserve item state and DOM across renders via reconciliation.",
      "Put the key on the outermost mapped element; use <React.Fragment key=...> for multi-sibling items.",
      "Ternary for if/else, && for if-only, early return for loading/error/empty branches.",
      "Guard the && zero pitfall: {count > 0 && ...}, not {count && ...}.",
      "Always handle the empty state explicitly — a blank list is a UX bug.",
      "Compute complex JSX into a variable before return when inline gets unreadable.",
      "Keys aren't readable in the component (props.key is undefined) and are only unique per sibling list.",
      "For huge lists use virtualization; stable keys still matter for row recycling.",
    ],
    references: [
      { label: "React — Rendering lists", url: "https://react.dev/learn/rendering-lists" },
      { label: "React — Conditional rendering", url: "https://react.dev/learn/conditional-rendering" },
      { label: "React — Preserving and resetting state", url: "https://react.dev/learn/preserving-and-resetting-state" },
      { label: "React — Rendering lists: keeping list items in order with key", url: "https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key" },
      { label: "MDN — Array.prototype.map()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map" },
      { label: "react-window — list virtualization", url: "https://github.com/bvaughn/react-window" },
    ],
    tags: ["react", "lists", "keys", "conditional-rendering", "reconciliation", "fragments", "virtualization", "empty-state"],
  },
];
