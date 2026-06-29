import type { FrontendTopic } from "../types";

export const partL: FrontendTopic[] = [
  {
    id: "performance-optimization",
    num: 42,
    title: "Performance Optimization",
    part: "Optimization & DevTools",
    partId: "l",
    difficulty: "Core",
    summary:
      "Lazy-load routes, memoize components and callbacks, and virtualize long lists to keep React apps fast.",
    readingTime: 7,
    explanation: [
      "Frontend performance comes down to shipping less JavaScript, doing less work on render, and rendering fewer DOM nodes. The four highest-leverage React techniques are **code splitting** (lazy-loading routes), **`React.memo`** (skipping re-renders when props are unchanged), **`useCallback`** (stabilizing function identity so memoized children don't re-render), and **list virtualization** (only rendering the rows currently on screen).",
      "**Lazy loading routes** uses `React.lazy` + dynamic `import()` so each route becomes its own bundle chunk, loaded on demand and wrapped in a `<Suspense>` boundary with a fallback. This shrinks the initial bundle and speeds up first paint.",
      "**`React.memo`** wraps a component so it re-renders only when its props change by shallow comparison. It pairs with **`useCallback`**, which memoizes a function so its identity stays stable across renders — without it, a freshly created handler passed as a prop would defeat `React.memo` on the child.",
      "**Virtualized lists** (e.g. `react-window`) render only the visible window of a large list instead of thousands of DOM nodes. For 1000+ rows this is the difference between a janky and a smooth scroll. Reach for these tools when you measure a problem — premature memoization adds complexity without payoff.",
    ],
    backendAnalogy:
      "Code splitting is lazy class loading / on-demand module initialization — you don't load every JAR into memory at boot, you load what a request actually needs. React.memo and useCallback are like a memoization cache or @Cacheable: skip recomputation when inputs are unchanged. List virtualization is pagination/streaming a result set instead of loading a million-row table into a List at once.",
    keyInsights: [
      "Code splitting with React.lazy + Suspense turns each route into its own chunk, cutting the initial bundle.",
      "React.memo only helps if props are referentially stable — combine it with useCallback/useMemo for function and object props.",
      "Virtualize lists past a few hundred rows; rendering only the visible window keeps the DOM node count flat regardless of data size.",
      "Optimize what you measure: profile first, then memoize, because needless memoization adds memory and complexity for no gain.",
    ],
    codeSamples: [
      {
        label: "1. Lazy loading routes (code splitting)",
        language: "tsx",
        code: `// 1. Lazy loading routes (code splitting)
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}`,
      },
      {
        label: "2. React.memo — skip re-render if props unchanged",
        language: "tsx",
        code: `// 2. React.memo — skip re-render if props unchanged
const ExpenseCard = React.memo(function ExpenseCard({ expense }: Props) {
  return <div>{expense.category}: ₹{expense.amount}</div>;
});`,
      },
      {
        label: "3. useCallback — memoize functions passed as props",
        language: "tsx",
        code: `// 3. useCallback — memoize functions passed as props
function Parent() {
  const handleApprove = useCallback((id: number) => {
    dispatch(approveExpense(id));
  }, [dispatch]);

  return <ExpenseList onApprove={handleApprove} />;
}`,
      },
      {
        label: "4. Virtualized lists (for 1000+ items)",
        language: "tsx",
        code: `// 4. Virtualized lists (for 1000+ items)
import { FixedSizeList } from 'react-window';

function VirtualizedExpenses({ items }: { items: Expense[] }) {
  return (
    <FixedSizeList height={600} itemCount={items.length} itemSize={60} width="100%">
      {({ index, style }) => (
        <div style={style}>
          {items[index].category}: ₹{items[index].amount}
        </div>
      )}
    </FixedSizeList>
  );
}`,
      },
    ],
    interviewQA: [
      {
        question: "How does code splitting improve performance, and how do you implement it in React?",
        answer:
          "Code splitting breaks the bundle into chunks loaded on demand, so the initial download and parse cost is smaller and first paint is faster. In React you use React.lazy with a dynamic import() for route or heavy components and wrap them in a <Suspense> boundary with a fallback. Each lazy import becomes its own chunk that the bundler loads only when the component is rendered.",
      },
      {
        question: "What are the tradeoffs of React.memo and useCallback? When can they hurt?",
        answer:
          "React.memo skips a re-render when props are shallowly equal, and useCallback keeps a function's identity stable so it doesn't break that comparison. The tradeoff is overhead: every memoized component does a props comparison and every memoized callback holds a closure in memory. If a component is cheap to render or its props change every time anyway, memoization just adds cost and complexity. Profile first; memoize the proven hot paths, not everything.",
      },
      {
        question: "Why and how do you virtualize a long list?",
        answer:
          "A list of thousands of rows creates thousands of DOM nodes, which makes layout, paint, and scrolling slow. Virtualization (windowing) renders only the rows currently visible plus a small buffer, recycling them as you scroll, so the DOM node count stays roughly constant. Libraries like react-window provide FixedSizeList/VariableSizeList that take an item count, item size, and a render function for each visible index.",
      },
      {
        question: "How do debounce and throttle help performance, and how do they differ?",
        answer:
          "Both limit how often an expensive handler runs in response to rapid events like typing, scrolling, or resizing. Debounce waits until events stop for a set delay before firing once — good for search-as-you-type so you only query after the user pauses. Throttle fires at most once per interval regardless of how many events arrive — good for scroll or resize where you want periodic updates. Both reduce wasted renders, network calls, and main-thread work.",
      },
    ],
    thingsToRemember: [
      "Four levers: lazy-load routes, React.memo, useCallback/useMemo, virtualize lists.",
      "React.memo needs referentially stable props (useCallback/useMemo) to actually skip renders.",
      "Measure before optimizing — premature memoization costs memory and clarity with no benefit.",
    ],
    references: [
      { label: "react-window — docs", url: "https://react-window.vercel.app" },
      { label: "React — Code Splitting", url: "https://react.dev/reference/react/lazy" },
      { label: "web.dev — Performance", url: "https://web.dev/explore/fast" },
    ],
    tags: ["performance", "code-splitting", "memoization", "virtualization", "react"],
  },
  {
    id: "core-web-vitals",
    num: 43,
    title: "Core Web Vitals",
    part: "Optimization & DevTools",
    partId: "l",
    difficulty: "Core",
    summary:
      "LCP, INP, and CLS are Google's user-centric performance metrics — know the targets and the fixes.",
    readingTime: 6,
    explanation: [
      "**Core Web Vitals** are Google's standardized, user-centric metrics for real-world page experience. The three pillars are **LCP** (loading), **INP** (interactivity), and **CLS** (visual stability). They are measured on real users (field data) and feed into search ranking, so improving them is both a UX and an SEO win.",
      "Each metric maps to a perceptible problem: LCP asks 'when did the main content show up?', INP asks 'how snappy is the page when I tap or type?', and CLS asks 'does the layout jump around while loading?'. Each has a concrete target and a well-understood set of fixes.",
      "| Metric | What It Measures | Target | How to Fix |\n| --- | --- | --- | --- |\n| **LCP** (Largest Contentful Paint) | When main content is visible | ≤ 2.5s | Optimize images (WebP/AVIF); preload critical resources; reduce JS bundle |\n| **INP** (Interaction to Next Paint) | Responsiveness to user input | ≤ 200ms | Break long tasks; use requestIdleCallback; avoid blocking the main thread |\n| **CLS** (Cumulative Layout Shift) | Visual stability (things jumping around) | ≤ 0.1 | Set dimensions on images/ads; avoid inserting content above existing content |",
    ],
    backendAnalogy:
      "Core Web Vitals are the frontend equivalent of SLOs/SLIs with percentile latency targets. LCP and INP are like your p75 response-time SLOs (load and interaction latency), and CLS is a correctness/stability metric. Just as you'd watch p95 latency in production telemetry, these are measured on real users in the field, not only in a lab.",
    keyInsights: [
      "Three vitals: LCP (loading ≤ 2.5s), INP (interactivity ≤ 200ms), CLS (stability ≤ 0.1).",
      "INP replaced FID as the responsiveness metric — it measures the latency of all interactions, not just the first.",
      "CLS is fixed by reserving space: set width/height (or aspect-ratio) on images and ads so nothing reflows when they load.",
      "Field data (real users) is what counts for ranking; lab tools like Lighthouse are a proxy for debugging.",
    ],
    codeSamples: [
      {
        label: "Reserve space and preload to protect LCP and CLS",
        language: "html",
        code: `<!-- Preload the LCP image so it loads early (improves LCP) -->
<link rel="preload" as="image" href="/hero.avif" fetchpriority="high" />

<!-- Always set dimensions so the browser reserves space (avoids CLS) -->
<img src="/hero.avif" width="1200" height="600" alt="Dashboard hero" />`,
      },
      {
        label: "Break up long tasks to protect INP",
        language: "js",
        code: `// Long, blocking work hurts INP. Defer non-urgent work off the
// critical interaction path with requestIdleCallback.
button.addEventListener('click', () => {
  applyUrgentUiUpdate();           // keep the interaction snappy

  requestIdleCallback(() => {
    runExpensiveAnalytics();       // do heavy work when the main thread is idle
  });
});`,
      },
    ],
    interviewQA: [
      {
        question: "What are the three Core Web Vitals, their targets, and what each measures?",
        answer:
          "LCP (Largest Contentful Paint) measures when the main content becomes visible, target ≤ 2.5s. INP (Interaction to Next Paint) measures responsiveness to user input, target ≤ 200ms. CLS (Cumulative Layout Shift) measures visual stability — how much the layout jumps — target ≤ 0.1. They cover loading, interactivity, and stability respectively.",
      },
      {
        question: "A page has a poor LCP. How do you diagnose and fix it?",
        answer:
          "Identify the LCP element (usually the hero image or a large text block) in DevTools or Lighthouse. Common fixes: serve modern image formats (WebP/AVIF) and correctly sized images, preload the critical resource with <link rel=\"preload\" fetchpriority=\"high\">, reduce render-blocking CSS/JS and shrink the JS bundle, and use a CDN. The goal is to get the largest above-the-fold element painted quickly.",
      },
      {
        question: "What causes CLS, and how do you eliminate it?",
        answer:
          "CLS comes from elements that load late and push existing content around — images/iframes/ads without dimensions, web fonts that swap, and content injected above what the user is already viewing. Fix it by always setting width/height or aspect-ratio so the browser reserves space, reserving slots for ads/embeds, and never inserting content above existing content unless in response to a user action.",
      },
      {
        question: "How do you improve INP?",
        answer:
          "INP is hurt by long tasks blocking the main thread between an interaction and the next paint. Break long tasks into smaller chunks, defer non-urgent work with requestIdleCallback or by yielding, move heavy computation to a Web Worker, and keep event handlers light. Reducing the amount of JavaScript executing during interactions is the core strategy.",
      },
    ],
    thingsToRemember: [
      "LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 — memorize the three targets.",
      "INP replaced FID; it covers responsiveness across all interactions, not just the first.",
      "Set image/ad dimensions to reserve space — the single biggest CLS fix.",
    ],
    references: [
      { label: "web.dev — Core Web Vitals", url: "https://web.dev/articles/vitals" },
      { label: "web.dev — Optimize LCP", url: "https://web.dev/articles/optimize-lcp" },
    ],
    tags: ["core-web-vitals", "performance", "lcp", "cls", "inp"],
  },
  {
    id: "browser-devtools",
    num: 44,
    title: "Browser DevTools",
    part: "Optimization & DevTools",
    partId: "l",
    difficulty: "Core",
    summary:
      "Master the Network, Performance, Memory, Console, Application, and Lighthouse panels to debug real apps.",
    readingTime: 5,
    explanation: [
      "Chrome DevTools is the primary instrument for diagnosing frontend problems, and a strong engineer knows which panel answers which question. The panels worth mastering are **Network**, **Performance**, **Memory**, **Console**, **Application**, and **Lighthouse**.",
      "Use **Network** to trace requests, inspect timing waterfalls, and debug CORS and caching. Use **Performance** to record a session and read flame charts that reveal long tasks and layout/paint costs. Use **Memory** to take heap snapshots and hunt down leaks. Use **Console** for errors and logging, **Application** for storage, cookies, and service workers, and **Lighthouse** for automated audits of performance, accessibility, and SEO.",
      "Together these panels cover the full debugging loop: Lighthouse tells you *what* is slow at a high level, Performance and Network show you *why*, Memory finds leaks over time, and Application inspects client-side state.",
    ],
    backendAnalogy:
      "DevTools is your frontend observability stack. Network is request tracing / an APM waterfall (think distributed tracing spans). Performance is a CPU profiler/flame graph like async-profiler. Memory heap snapshots are your heap dump + leak analysis (like a Java heap dump in VisualVM). Console is application logs, and Lighthouse is an automated audit/health check.",
    keyInsights: [
      "Network: trace requests, timing waterfalls, CORS, and cache behavior.",
      "Performance: flame charts expose long tasks and expensive layout/paint work.",
      "Memory: heap snapshots and allocation timelines find and confirm leaks.",
      "Application inspects storage/cookies/service workers; Lighthouse runs automated perf/a11y/SEO audits.",
    ],
    codeSamples: [
      {
        label: "Console panel — useful logging tricks",
        language: "js",
        code: `// Time a block of work
console.time('render');
renderDashboard();
console.timeEnd('render');     // render: 12.3ms

// Tabular view of an array of objects
console.table(expenses);

// Group related logs
console.group('API call');
console.log('request', payload);
console.log('response', data);
console.groupEnd();

// Assert an invariant — only logs when it fails
console.assert(total >= 0, 'total should never be negative', total);`,
      },
      {
        label: "Performance panel — mark and measure with the User Timing API",
        language: "js",
        code: `// Custom marks show up in the Performance panel's timeline
performance.mark('fetch-start');
await fetchExpenses();
performance.mark('fetch-end');

performance.measure('fetch-expenses', 'fetch-start', 'fetch-end');
const [entry] = performance.getEntriesByName('fetch-expenses');
console.log('fetch took', entry.duration, 'ms');`,
      },
    ],
    interviewQA: [
      {
        question: "Which DevTools panel do you reach for to debug a slow page, and how?",
        answer:
          "Start with Lighthouse for a high-level audit and the suspected metric. Then use the Performance panel: record a load or interaction and read the flame chart to find long tasks, expensive layout/paint, and main-thread blocking. Cross-check with the Network panel's waterfall for slow or render-blocking requests. This narrows 'the page is slow' to a specific cause.",
      },
      {
        question: "How would you confirm and locate a memory leak?",
        answer:
          "Use the Memory panel. Take a heap snapshot, exercise the suspected flow (e.g. open and close a view repeatedly), then take another snapshot and compare — detached DOM nodes or growing object counts that never drop signal a leak. The allocation timeline shows what is being allocated over time, and retainer paths reveal what is keeping objects alive (often event listeners or closures that were never cleaned up).",
      },
      {
        question: "How do you debug a CORS or caching issue in the browser?",
        answer:
          "Open the Network panel, inspect the failing request's headers (request Origin, response Access-Control-Allow-* headers) and the preflight OPTIONS request for CORS, and check the Status and Size columns plus Cache-Control/ETag headers for caching. The timing breakdown and 'disable cache' toggle help confirm whether a response came from cache or the network.",
      },
    ],
    thingsToRemember: [
      "Match the panel to the question: Network=requests, Performance=CPU/render, Memory=leaks, Application=storage.",
      "Lighthouse is the starting audit; Performance and Network explain the why.",
      "console.time/table/group and performance.mark/measure are quick wins for ad-hoc profiling.",
    ],
    references: [
      { label: "Chrome DevTools docs", url: "https://developer.chrome.com/docs/devtools/" },
      { label: "MDN — Performance API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Performance" },
    ],
    tags: ["devtools", "debugging", "profiling", "performance", "chrome"],
  },
  {
    id: "internationalization-i18n",
    num: 45,
    title: "Internationalization (i18n)",
    part: "Optimization & DevTools",
    partId: "l",
    difficulty: "Core",
    summary:
      "Translate UI with i18next/react-i18next, interpolate values, and handle RTL languages like Arabic.",
    readingTime: 6,
    explanation: [
      "**Internationalization (i18n)** is structuring an app so its UI can be translated and localized without code changes. Instead of hard-coding strings, you reference translation keys (e.g. `expense.title`) that resolve to the active language's strings. The de-facto standard in React is **i18next** with the **react-i18next** bindings.",
      "You configure i18next once with a `resources` object holding a translation map per language, a default language (`lng`), and a `fallbackLng`. Components call the `useTranslation` hook to get a `t()` function for looking up keys, plus the `i18n` instance for reading and changing the current language. `t()` supports **interpolation** — `t('expense.total', { amount: '₹1,200' })` fills the `{{amount}}` placeholder.",
      "Beyond text, real i18n handles **directionality**. Right-to-left languages like Arabic require `dir=\"rtl\"`, which mirrors the layout. A common pattern is to set the `dir` attribute from the active language so the whole subtree flips automatically. Mature setups also handle pluralization, date/number/currency formatting (via the `Intl` API), and lazy-loading translation bundles per locale.",
    ],
    backendAnalogy:
      "Translation keys are exactly Java's ResourceBundle / messages.properties files keyed by locale — t('expense.title') is MessageSource.getMessage('expense.title', locale). Interpolation with {{amount}} is MessageFormat placeholders. The fallbackLng is your default bundle when a locale-specific key is missing.",
    keyInsights: [
      "Never hard-code user-facing strings; reference translation keys resolved per active language.",
      "react-i18next's useTranslation gives you t() for lookups and the i18n instance for changeLanguage.",
      "Interpolation ({{amount}}) injects dynamic values into translated strings without string concatenation.",
      "RTL support is more than translation: set dir=\"rtl\" for languages like Arabic to mirror the layout.",
    ],
    codeSamples: [
      {
        label: "Setup: i18next + react-i18next",
        language: "tsx",
        code: `// Setup: i18next + react-i18next
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: {
      'expense.title': 'My Expenses',
      'expense.add': 'Add Expense',
      'expense.amount': 'Amount',
      'expense.total': 'Total: {{amount}}',
    }},
    ar: { translation: {
      'expense.title': 'مصاريفي',
      'expense.add': 'إضافة مصروف',
      'expense.amount': 'المبلغ',
      'expense.total': 'المجموع: {{amount}}',
    }},
  },
  lng: 'en',
  fallbackLng: 'en',
});`,
      },
      {
        label: "Usage in components",
        language: "tsx",
        code: `// Usage in components
function Header() {
  const { t, i18n } = useTranslation();
  return (
    <header dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <h1>{t('expense.title')}</h1>
      <p>{t('expense.total', { amount: '₹1,200' })}</p>
      <button onClick={() => i18n.changeLanguage('ar')}>
        العربية
      </button>
    </header>
  );
}`,
      },
    ],
    interviewQA: [
      {
        question: "How would you add internationalization to a React app?",
        answer:
          "Adopt i18next with react-i18next. Extract all user-facing strings into per-language translation resource files keyed by stable identifiers (e.g. expense.title). Initialize i18next once with those resources, a default lng, and a fallbackLng. In components use the useTranslation hook's t() function to look up keys, and the i18n instance to switch languages. Add interpolation for dynamic values and the Intl API for date/number/currency formatting.",
      },
      {
        question: "How do you handle right-to-left languages like Arabic?",
        answer:
          "Translation alone isn't enough — RTL languages need the layout mirrored. Set the dir attribute to 'rtl' (commonly derived from the active language, e.g. dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}) on a wrapping element or <html>. Use CSS logical properties (margin-inline-start, padding-inline-end) instead of left/right so styles flip automatically with direction.",
      },
      {
        question: "What is interpolation in i18n and why not just concatenate strings?",
        answer:
          "Interpolation injects dynamic values into a translated template, e.g. 'Total: {{amount}}' resolved with t('expense.total', { amount: '₹1,200' }). You avoid concatenation because word order differs across languages — gluing 'Total: ' + amount breaks for languages where the value comes first. A single template per language lets translators place the placeholder correctly, and it also enables pluralization and gender rules.",
      },
    ],
    thingsToRemember: [
      "Use translation keys, not hard-coded strings; i18next + react-i18next is the React standard.",
      "useTranslation provides t() for lookups and i18n.changeLanguage to switch locale at runtime.",
      "RTL = dir=\"rtl\" plus logical CSS properties; interpolation handles dynamic values per language.",
    ],
    references: [
      { label: "react-i18next — docs", url: "https://react.i18next.com" },
      { label: "i18next — docs", url: "https://www.i18next.com" },
    ],
    tags: ["i18n", "internationalization", "i18next", "rtl", "localization"],
  },
];
