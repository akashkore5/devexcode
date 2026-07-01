import type { FrontendTopic } from "../types";

export const partG: FrontendTopic[] = [
  {
    id: "react-router",
    num: 26,
    title: "React Router",
    part: "Routing & Forms",
    partId: "g",
    difficulty: "Core",
    summary:
      "Client-side routing end to end: how a SPA fakes navigation without reloads, routes and dynamic params, nested/layout routes with Outlet, programmatic navigation, query strings, route loaders and data APIs, and auth guards — beginner to advanced in one page.",
    readingTime: 18,
    explanation: [
      "**What is client-side routing?** In a traditional multi-page app, every link click asks the server for a brand-new HTML document and the browser throws away the current page and paints a fresh one — a full reload. A single-page application (SPA) loads one HTML shell plus a JavaScript bundle once, and from then on *simulates* navigation entirely in the browser: it intercepts link clicks, updates the address bar with the History API, and swaps which React components are on screen. No round-trip, no white flash, no lost in-memory state. React Router is the library that wires all of this together for React.",
      "**Why not just use `<a href>`?** A plain `<a>` triggers a real browser navigation — a full document load — which defeats the whole point of a SPA. React Router gives you `<Link to=\"/about\">` and `<NavLink>`, which render an `<a>` for accessibility and SEO but call `preventDefault()` on click and route on the client instead. `NavLink` additionally exposes an `isActive` flag so you can highlight the current tab. Rule of thumb: internal navigation uses `<Link>`/`<NavLink>`; external links stay plain `<a>`.",
      "**The core pieces.** You wrap your app in a router (`<BrowserRouter>` for real URLs backed by the History API, or `createBrowserRouter` in the modern data-router API). Inside, `<Routes>` holds a set of `<Route path=... element=... />` declarations. React Router matches the current URL against these paths top-down, picks the best match, and renders that route's element. Everything below is elaboration on this one matching step.",
      "**Dynamic segments and params.** A path segment prefixed with a colon is a *URL parameter*: `path=\"/users/:userId\"` matches `/users/42` and `/users/abc`. Inside the matched component you read it with `const { userId } = useParams()`. Params are always strings, so coerce when you need a number. This is how detail pages work — one route definition serves an unbounded set of records, and the param tells the component which record to fetch.",
      "**Query strings vs params.** Path params identify *which resource* (`/products/99`); query strings carry *optional modifiers* like filters, sorting, and pagination (`/products?sort=price&page=2`). Read and write the query string with `const [searchParams, setSearchParams] = useSearchParams()`. Keeping filter state in the URL (rather than component state) makes the view shareable, bookmarkable, and survivable across refreshes — a URL is the cheapest global state you have.",
      "**Nested and layout routes — the Outlet mental model.** Real apps share chrome: a sidebar, a header, a tab bar that stays put while the inner content changes. You express this by nesting `<Route>` elements. The parent route renders shared layout plus an `<Outlet />` — a placeholder where whichever child route matched gets rendered. Navigating between siblings only re-renders the outlet, not the surrounding layout. The special `index` route (`<Route index element={...} />`) is what shows at the parent's *exact* path when no child segment is present.",
      "**Relative paths and links.** Inside a nested route, paths and `<Link to>` values are resolved *relative* to the parent by default, so a child route with `path=\"edit\"` under `/expenses/:id` matches `/expenses/:id/edit`. A leading slash (`to=\"/login\"`) is absolute. Understanding relative resolution is what lets you move a whole route subtree without rewriting every link inside it.",
      "**Programmatic navigation.** Sometimes you navigate in response to logic, not a click — after a successful save, on a failed auth check, or via a wizard's Next button. `const navigate = useNavigate()` gives you an imperative function: `navigate('/expenses')` pushes a new history entry, `navigate('/login', { replace: true })` replaces the current entry (so Back doesn't return to a dead page), and `navigate(-1)` goes back. Passing `{ state: {...} }` ships data to the destination, readable there via `useLocation().state`.",
      "**404 and catch-all routes.** A route with `path=\"*\"` matches anything no other route caught, so it's your Not Found page. Because matching is best-match rather than strictly first-match in the modern API, the catch-all only fires when nothing more specific applies. Every routed app should ship one so unknown URLs render a friendly page instead of a blank screen.",
      "**Data routers, loaders, and actions.** The modern `createBrowserRouter` API introduces *loaders* and *actions* that move data-fetching into the routing layer. A `loader` runs *before* the route's component renders and its returned data is read with `useLoaderData()` — this fetches data as soon as the URL is known, eliminating the classic render-then-fetch-then-spinner waterfall. An `action` handles form submissions to that route. `useNavigation()` exposes pending state so you can show a global loading bar. This is the same idea Next.js and Remix generalise: co-locate data requirements with the route that needs them.",
      "**Route guards / protected routes.** There's no dedicated 'guard' primitive — a protected route is just a component that checks auth state and either renders its children or redirects. The declarative form returns `<Navigate to=\"/login\" replace />`; the loader form throws a `redirect('/login')` before the page ever renders, which is stronger because the protected component's code never runs. Always use `replace` on the redirect so the protected URL isn't left in history for the Back button to stumble into.",
      "**Lazy loading routes (code splitting).** Shipping every route's code in the initial bundle is wasteful. Pair `React.lazy(() => import('./Admin'))` with a `<Suspense fallback={...}>` boundary (or the data router's `route.lazy`) so a route's JavaScript downloads only when the user actually navigates there. This is one of the highest-leverage performance wins in a SPA: route-based code splitting keeps the first load small.",
      "**The server fallback gotcha.** Because the client owns routing, deep links like `/expenses/42` don't correspond to a file on the server. If the user refreshes or shares that URL, the server must be configured to return the SPA's `index.html` for *all* unmatched paths (a rewrite rule), letting the client router take over. Forgetting this is the classic 'works on click, 404 on refresh' bug.",
      "**The mental model (memorise this).** One HTML shell loads once; the router intercepts navigation and swaps components instead of reloading. `<Routes>`/`<Route>` match the URL → dynamic `:params` (via useParams) identify the resource, query strings (via useSearchParams) carry filters → nested routes render shared layout with an `<Outlet />`, and `index` fills the parent's exact path → `useNavigate` does imperative redirects, `path=\"*\"` catches 404s → loaders fetch before render, guards redirect with `<Navigate replace />`, and lazy routes split the bundle. The URL is your source of truth.",
    ],
    backendAnalogy:
      "React Router's route table is your Spring `@RequestMapping` / Vert.x `Router` — path patterns matched against an incoming request, with `:id` playing the role of `@PathVariable` and query strings playing `@RequestParam`. Nested routes with `<Outlet />` are like a layout template with a content region, the way a servlet filter or a Vert.x sub-router wraps handlers with shared behaviour and delegates the inner work. Loaders that run before the component renders are the front-end equivalent of a controller method fetching its data before returning the view — data-then-render, not render-then-fetch. A protected route throwing `redirect('/login')` is exactly an auth interceptor / `HandlerInterceptor.preHandle` returning false and issuing a 302 before your controller code ever executes. The one difference: all of this runs in the browser against the History API instead of on the server against HTTP.",
    keyInsights: [
      "Client-side routing swaps components and updates the URL via the History API without a full page reload, so JS bundle and in-memory state persist.",
      "Use Link and NavLink for internal navigation (they render an accessible anchor but route on the client); keep plain a tags for external links.",
      "Dynamic segments like :id are read with useParams and are always strings; query strings for filters and pagination are read/written with useSearchParams.",
      "Nested routes render shared layout plus an Outlet placeholder; the index route renders at the parent's exact path when no child segment matches.",
      "useNavigate gives imperative navigation: navigate(path) pushes, navigate(path, replace:true) replaces, navigate(-1) goes back; pass state to ship data.",
      "A path='*' catch-all route is your 404 page and every routed app should include one.",
      "Loaders in the data-router API fetch data before the component renders, avoiding the render-fetch-spinner waterfall; actions handle form submissions.",
      "A protected route is just a component that redirects with Navigate replace, or a loader that throws redirect('/login') before the page renders.",
      "Route-based code splitting with React.lazy plus Suspense downloads a route's JS only when visited, keeping the initial bundle small.",
      "Configure the server to return index.html for all unmatched paths, or deep links 404 on refresh even though they work on click.",
    ],
    codeSamples: [
      {
        label: "Routes, params, nested layout, protected route, and 404",
        language: "tsx",
        code: `import {
  BrowserRouter, Routes, Route, Link, NavLink,
  Navigate, Outlet, useParams, useNavigate,
} from 'react-router-dom';
import type { ReactNode } from 'react';

function App() {
  return (
    <BrowserRouter>
      <nav>
        {/* Link renders an <a> but routes on the client (no reload) */}
        <Link to="/">Home</Link>
        {/* NavLink adds an isActive flag for highlighting the current tab */}
        <NavLink to="/expenses" className={({ isActive }) => isActive ? 'active' : ''}>
          Expenses
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />

        {/* Nested/layout route: ExpenseLayout renders shared chrome + <Outlet/> */}
        <Route path="/expenses" element={<ExpenseLayout />}>
          <Route index element={<ExpenseList />} />        {/* /expenses exactly */}
          <Route path=":id" element={<ExpenseDetail />} />  {/* /expenses/42 */}
          <Route path=":id/edit" element={<ExpenseForm />} />{/* relative to parent */}
          <Route path="new" element={<ExpenseForm />} />
        </Route>

        {/* Protected route: renders children only when authenticated */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminPanel />
            </RequireAuth>
          }
        />

        {/* Catch-all 404 — matches anything no other route caught */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Shared layout: the surrounding chrome stays put; only <Outlet/> re-renders.
function ExpenseLayout() {
  return (
    <div className="shell">
      <Sidebar />
      <main><Outlet /></main>
    </div>
  );
}

// Dynamic params + programmatic navigation.
function ExpenseDetail() {
  const { id } = useParams();          // always a string: "/expenses/42" -> "42"
  const navigate = useNavigate();
  // fetch the expense by id here...
  return (
    <>
      <h1>Expense #{id}</h1>
      {/* imperative redirect, e.g. after an action */}
      <button onClick={() => navigate('/expenses')}>Back to list</button>
    </>
  );
}

// A "guard" is just a component: render children or redirect.
function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  // replace: true so the Back button never returns to the protected URL
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}`,
      },
      {
        label: "Query strings for filters & pagination (useSearchParams)",
        language: "tsx",
        code: `import { useSearchParams } from 'react-router-dom';

// URL like /products?category=meals&page=2 — the URL is your state store.
function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') ?? 'all';
  const page = Number(searchParams.get('page') ?? '1'); // params are strings

  function changeCategory(next: string) {
    // merge into existing params so we don't clobber page, sort, etc.
    setSearchParams((prev) => {
      prev.set('category', next);
      prev.set('page', '1'); // reset pagination on a new filter
      return prev;
    });
  }

  return (
    <>
      <select value={category} onChange={(e) => changeCategory(e.target.value)}>
        <option value="all">All</option>
        <option value="meals">Meals</option>
        <option value="travel">Travel</option>
      </select>
      <p>Showing {category}, page {page}</p>
      {/* State lives in the URL -> shareable, bookmarkable, survives refresh */}
    </>
  );
}`,
      },
      {
        label: "Data router: loaders, actions & pending UI",
        language: "tsx",
        code: `import {
  createBrowserRouter, RouterProvider, redirect,
  useLoaderData, useNavigation, Form,
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/expenses/:id',
    // loader runs BEFORE the component renders -> no render-fetch-spinner waterfall
    loader: async ({ params, request }) => {
      const token = getToken();
      if (!token) throw redirect('/login'); // guard: page code never runs
      const res = await fetch(\`/api/expenses/\${params.id}\`, {
        signal: request.signal, // aborts if the user navigates away
      });
      if (!res.ok) throw new Response('Not Found', { status: 404 });
      return res.json();
    },
    // action handles <Form method="post"> submissions to this route
    action: async ({ request, params }) => {
      const form = await request.formData();
      await fetch(\`/api/expenses/\${params.id}\`, {
        method: 'PUT',
        body: JSON.stringify(Object.fromEntries(form)),
      });
      return redirect(\`/expenses/\${params.id}\`);
    },
    element: <ExpenseDetail />,
  },
]);

function ExpenseDetail() {
  const expense = useLoaderData() as { title: string };
  const navigation = useNavigation();      // 'idle' | 'loading' | 'submitting'
  const busy = navigation.state !== 'idle';
  return (
    <Form method="post">
      <h1>{expense.title}</h1>
      <button disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
    </Form>
  );
}

export default function App() {
  return <RouterProvider router={router} />;
}`,
      },
      {
        label: "Lazy-loaded (code-split) routes with Suspense",
        language: "tsx",
        code: `import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// The Admin bundle downloads only when the user navigates to /admin.
const AdminPanel = lazy(() => import('./AdminPanel'));
const Reports = lazy(() => import('./Reports'));

function App() {
  return (
    <BrowserRouter>
      {/* Suspense shows a fallback while the chunk is fetched */}
      <Suspense fallback={<div>Loading…</div>}>
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}`,
      },
    ],
    runnable: {
      title: "A tiny hash-router in vanilla JS — see client-side routing with no reload",
      html: `<nav id="nav">
  <a href="#/">Home</a>
  <a href="#/expenses">Expenses</a>
  <a href="#/expenses/42">Expense 42</a>
  <a href="#/nope">Broken link</a>
</nav>
<main id="view">Loading…</main>`,
      css: `body { font-family: system-ui, sans-serif; padding: 16px; }
#nav { display: flex; gap: 12px; margin-bottom: 16px; }
#nav a { text-decoration: none; color: #4f46e5; font-weight: 600; }
#nav a.active { text-decoration: underline; }
#view { padding: 16px; border: 1px solid #cbd5e1; border-radius: 12px; }`,
      js: `// A minimal client-side router. The page never reloads: we listen for
// hashchange, match the "path" to a component, and swap innerHTML.
const view = document.getElementById('view');

// Route table: static paths + one dynamic :id pattern + a catch-all.
const routes = [
  { pattern: /^\\/$/,               render: () => 'Home dashboard' },
  { pattern: /^\\/expenses$/,       render: () => 'Expense LIST (index route)' },
  { pattern: /^\\/expenses\\/(\\w+)$/, render: (m) => 'Expense DETAIL, id = ' + m[1] },
];

function router() {
  const path = location.hash.slice(1) || '/';       // read the "URL"
  const match = routes.map(r => ({ r, m: path.match(r.pattern) })).find(x => x.m);
  view.textContent = match ? match.r.render(match.m) : '404 — no route matched';

  // highlight the active link (like NavLink's isActive)
  document.querySelectorAll('#nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + path);
  });
  console.log('navigated to', path, '— no page reload happened');
}

window.addEventListener('hashchange', router);
router(); // initial render`,
    },
    interviewQA: [
      {
        question: "What is the difference between client-side and server-side routing?",
        answer:
          "With server-side routing, every navigation requests a fresh HTML document and the browser reloads the whole page. With client-side routing (React Router), the router intercepts navigation, updates the URL via the History API, and swaps the rendered component tree in place — no full reload, so app state and the loaded JS bundle persist and there's no white flash. The trade-offs: the initial bundle must ship the routing logic, you need a server rewrite so deep links resolve to the SPA entry point, and you must manage focus/scroll and document titles yourself since the browser no longer does it per page.",
      },
      {
        question: "How do nested (layout) routes and the Outlet work?",
        answer:
          "Nested routes are child <Route> elements inside a parent. The parent renders shared layout — sidebar, header, tabs — plus an <Outlet />, which is a placeholder where the matched child route renders. Navigating between siblings re-renders only the outlet, keeping the surrounding chrome mounted. The special index route fills the parent's exact path when no child segment is present. This models the common 'shell that stays, content that changes' pattern without repeating layout in every page.",
      },
      {
        question: "How do you read dynamic params and query strings, and when do you use each?",
        answer:
          "Declare a dynamic segment with a colon (path=\":id\") and read it with const { id } = useParams() — params are always strings. Query strings are read and written with const [searchParams, setSearchParams] = useSearchParams(). Use path params to identify which resource (/users/42) and query strings for optional modifiers like filters, sorting, and pagination (/users?sort=name&page=2). Keeping filter state in the URL makes the view shareable, bookmarkable, and refresh-safe.",
      },
      {
        question: "How do you navigate programmatically and why use replace?",
        answer:
          "Call const navigate = useNavigate(); then navigate('/expenses') to push a new history entry, navigate('/login', { replace: true }) to replace the current one, or navigate(-1) to go back. You use replace when the current URL should not remain in history — for example after a redirect from a protected page or after a successful submit — so the Back button doesn't return the user to a dead or duplicate page. You can also pass { state } to hand data to the destination, read there via useLocation().state.",
      },
      {
        question: "How do you implement a protected route, and what's the strongest way?",
        answer:
          "The declarative approach is a wrapper component that checks auth and either renders its children or returns <Navigate to=\"/login\" replace />. The stronger approach in the data-router API is a loader that throws redirect('/login') before the route's component ever renders, so protected code and data fetches never execute for unauthenticated users. Either way, use replace so the protected URL isn't left in history, and remember client guards are UX only — the server must still authorise every request.",
      },
      {
        question: "What are loaders and actions in the data-router API, and what problem do they solve?",
        answer:
          "A loader is a function attached to a route that runs before the route's component renders; its return value is read with useLoaderData(). This fetches data as soon as the URL is known, eliminating the render-then-useEffect-then-spinner waterfall of the classic pattern and enabling parallel data loading across matched routes. An action handles form submissions (<Form method=\"post\">) for that route. useNavigation() exposes pending state for global loading UI. It's the same co-locate-data-with-route idea that Remix and Next.js build on.",
      },
      {
        question: "Why does a deep link 404 on refresh but work on click, and how do you fix it?",
        answer:
          "On click, the client router handles /expenses/42 in-memory — no server request. On refresh or when the link is shared, the browser asks the server for /expenses/42, which doesn't map to any file, so the server returns 404. The fix is a server rewrite that returns the SPA's index.html for all unmatched paths, letting the client router take over once the shell loads. Static hosts express this as a catch-all rewrite to /index.html.",
      },
      {
        question: "How does route-based code splitting improve performance?",
        answer:
          "By wrapping route components in React.lazy(() => import('./Page')) behind a Suspense boundary (or using the data router's route.lazy), each route's JavaScript is emitted as a separate chunk that downloads only when the user navigates there. This shrinks the initial bundle so the first paint and time-to-interactive are faster, at the cost of a small fetch on first visit to each route — usually masked by the Suspense fallback or a loader's pending state.",
      },
    ],
    thingsToRemember: [
      "Client-side routing changes the URL and swaps components without a full page reload; state and bundle persist.",
      "Use Link/NavLink for internal navigation; keep plain a for external links.",
      "useParams reads dynamic :segments (always strings); useSearchParams reads/writes query strings for filters and pagination.",
      "Parent layout + <Outlet /> gives nested routes; index renders the parent's exact path.",
      "useNavigate for imperative redirects; use replace: true so Back doesn't return to a dead page; navigate(-1) goes back.",
      "path='*' is the 404 catch-all — always include one.",
      "Loaders fetch before render (useLoaderData) and avoid the render-fetch-spinner waterfall; actions handle form posts.",
      "A protected route redirects with <Navigate replace /> or a loader that throws redirect('/login'); guards are UX only, authorise on the server.",
      "React.lazy + Suspense splits route bundles so JS loads only when visited.",
      "Configure a server rewrite to index.html for unmatched paths, or deep links 404 on refresh.",
    ],
    references: [
      { label: "React Router — Official docs", url: "https://reactrouter.com" },
      { label: "React Router — Route, loaders & actions", url: "https://reactrouter.com/en/main/route/loader" },
      { label: "React Router — useNavigate", url: "https://reactrouter.com/en/main/hooks/use-navigate" },
      { label: "MDN — History API", url: "https://developer.mozilla.org/en-US/docs/Web/API/History_API" },
      { label: "MDN — URLSearchParams", url: "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams" },
      { label: "web.dev — Code splitting with React.lazy", url: "https://web.dev/articles/code-splitting-suspense" },
    ],
    tags: ["react-router", "routing", "spa", "navigation", "nested-routes", "params", "loaders", "code-splitting", "auth-guard"],
  },
  {
    id: "form-handling-validation",
    num: 27,
    title: "Form Handling & Validation",
    part: "Routing & Forms",
    partId: "g",
    difficulty: "Core",
    summary:
      "Forms from first principles: controlled vs uncontrolled inputs, native HTML5 validation, why React Hook Form minimises re-renders, schema validation with Zod that doubles as your TypeScript type, error display, and accessibility — beginner to advanced in one page.",
    readingTime: 17,
    explanation: [
      "**Why forms are the hard part of UIs.** A form is where a user's intent becomes your application's data, so it's where correctness, validation, error messaging, accessibility, and performance all collide. Get it wrong and users hit confusing errors, screen-reader users are lost, or a giant form janks on every keystroke. The good news: a few clear concepts — controlled vs uncontrolled, native then schema validation, and accessible error wiring — cover the vast majority of real forms.",
      "**Controlled inputs.** A controlled input stores its value in React state and pushes it back into the input via `value`, updating on every keystroke through `onChange`. React is the single source of truth: `const [email, setEmail] = useState(''); <input value={email} onChange={e => setEmail(e.target.value)} />`. This makes the value trivially available for validation, conditional rendering, and derived UI — but it re-renders the component on every character, which can matter for very large forms.",
      "**Uncontrolled inputs.** An uncontrolled input keeps its value in the DOM itself; React doesn't track it on each keystroke. You read the value only when you need it — typically on submit — via a ref: `const ref = useRef(); ... ref.current.value`. Set an initial value with `defaultValue` (not `value`). Uncontrolled inputs are lighter (no re-render per keystroke) and are exactly how React Hook Form scales, but the live value isn't in React state, so instant cross-field logic is harder.",
      "**Which to choose.** Reach for controlled when you need the value *live* — inline validation as they type, a character counter, enabling a button, or one field reacting to another. Reach for uncontrolled (or a library that uses it) for large forms where per-keystroke re-renders would be wasteful, or when you only care about the final values at submit. In practice, teams standardise on React Hook Form, which gives the ergonomics of controlled forms with the performance of uncontrolled ones.",
      "**Native HTML5 validation — the free baseline.** The browser already validates a lot for free: `required`, `type=\"email\"`/`type=\"url\"`, `min`/`max`/`step` for numbers, `minlength`/`maxlength`, and `pattern` with a regex. These give you built-in error bubbles, block submission, and expose the Constraint Validation API (`input.validity`, `setCustomValidity`) plus the `:invalid`/`:valid` CSS pseudo-classes for styling. Always start here — it's zero JS, accessible by default, and works before your bundle even loads.",
      "**Why native alone isn't enough.** Native validation can't easily express cross-field rules ('password confirmation must match password'), server-driven errors ('email already taken'), or richly styled inline messages, and its default bubbles are inconsistent across browsers. So the pattern is layered: native attributes for the cheap baseline, then a JS/schema layer for the rich rules and custom UI. Crucially, both are only UX — the server must re-validate everything because anyone can bypass the client with a raw HTTP request.",
      "**React Hook Form — performance through refs.** React Hook Form (RHF) registers each input by ref via `{...register('email')}` instead of binding it to controlled state, so typing in a field doesn't re-render the whole form — only the fields that need to (like the one showing an error) update. `handleSubmit(onSubmit)` runs validation and, only if it passes, calls your handler with a typed values object. `formState` exposes `errors`, `isSubmitting`, `isDirty`, `touchedFields`, and more. For third-party controlled components (a custom Select, a date picker), you bridge them with the `<Controller>` component.",
      "**Schema validation with Zod — one source of truth.** Rather than scattering `if` checks, you declare the shape and rules of your data once as a Zod schema: `z.object({ email: z.string().email(), age: z.number().min(18) })`. At runtime the schema validates and even coerces/parses input; at compile time `type FormData = z.infer<typeof schema>` extracts the exact TypeScript type from that same schema. Because there's a single source of truth, your validation rules and your static types can never drift apart — a duplication bug that plagues hand-written validation.",
      "**Wiring Zod into RHF.** The `@hookform/resolvers/zod` package provides `zodResolver(schema)`, which you pass as `useForm({ resolver: zodResolver(schema) })`. Now RHF runs your Zod schema on submit (or on blur/change if configured via `mode`), and any failures land in `formState.errors` keyed by field, with the message you supplied in the schema. Cross-field rules use `.refine()` / `.superRefine()` — e.g. confirm-password matching — and attach the error to the relevant field.",
      "**Displaying errors accessibly.** Showing a red message isn't enough — assistive tech must announce it and associate it with its field. Give the input `aria-invalid={!!errors.email}` and `aria-describedby=\"email-error\"`, and render the message in an element with that `id` and `role=\"alert\"` (or inside an `aria-live` region) so it's announced when it appears. Also point focus at the first invalid field on a failed submit. Every input needs a real, associated `<label>` (via `htmlFor`/`id` or wrapping) — a placeholder is not a label.",
      "**Validation timing and UX.** Validating on every keystroke from the first character is hostile — the user sees 'invalid email' before they've finished typing. The friendly pattern: validate on submit first, then switch a field to on-change validation *after* it's first been touched or has errored (RHF's `mode: 'onTouched'` or `reValidateMode`). Disable the submit button while `isSubmitting`, show a spinner, and surface server errors by mapping the response back onto fields with `setError`.",
      "**Multi-step forms and drafts.** For wizards, keep all step values in one form/state object and only validate the current step's fields on Next; validate the whole schema on final submit. Persisting a draft (to `localStorage` or the server) protects against accidental navigation. Reset the form after a successful submit with `reset()` so stale values don't linger, and clear any server errors.",
      "**The mental model (memorise this).** Controlled = value in React state, re-renders per keystroke, use when you need the value live; uncontrolled = value in the DOM read via ref, cheaper, how RHF scales. Layer validation: native HTML attributes for the free baseline → a Zod schema for rich, cross-field rules and the derived TypeScript type → `zodResolver` feeds failures into `formState.errors`. Display errors accessibly (label + aria-invalid + aria-describedby + role=alert), validate on submit then progressively, and always re-validate on the server — the client is convenience, never a security boundary.",
    ],
    backendAnalogy:
      "A Zod schema is your Java Bean Validation (`@NotNull`, `@Email`, `@Min(18)`, `@Pattern`) — declarative constraints on a data shape — except the *same* object also generates the TypeScript type, the way a record/DTO class defines both the fields and their validation in one place. `zodResolver` plugging the schema into the form is like a `@Valid` parameter triggering the validator before your controller method body runs, with the failures collected into a `BindingResult` (that's `formState.errors`). React Hook Form managing dirty/touched/submitting state without re-rendering is analogous to a form-binding framework tracking field metadata cheaply. And the non-negotiable rule mirrors the backend exactly: client validation is UX, server validation is the trust boundary — never trust input that crossed the wire, because a `curl` request skips every browser check just like it skips your JavaScript.",
    keyInsights: [
      "Controlled inputs store the value in React state and re-render per keystroke; uncontrolled inputs keep it in the DOM and you read it via a ref, typically on submit.",
      "Use controlled when you need the value live (inline validation, counters, cross-field logic); use uncontrolled or React Hook Form for large forms to avoid per-keystroke re-renders.",
      "Start with native HTML5 validation (required, type, min/max, pattern) — it's free, accessible, and works before your JS loads.",
      "React Hook Form registers inputs by ref so typing doesn't re-render the whole form; handleSubmit validates then calls your handler with typed values.",
      "One Zod schema is both the runtime validator and the static type via z.infer, so rules and types can never drift apart.",
      "zodResolver(schema) bridges Zod and React Hook Form; failures populate formState.errors keyed by field with your messages.",
      "Cross-field rules (password confirmation) use Zod .refine()/.superRefine(); native validation can't express them.",
      "Display errors accessibly: label + aria-invalid + aria-describedby + role='alert', and move focus to the first invalid field.",
      "Validate on submit first, then progressively on touched/change; disable the submit button while isSubmitting and reset() after success.",
      "Client validation is UX only — always re-validate on the server, because a raw HTTP request bypasses every browser and JS check.",
    ],
    codeSamples: [
      {
        label: "Controlled vs uncontrolled inputs (the core distinction)",
        language: "tsx",
        code: `import { useState, useRef } from 'react';

// CONTROLLED: value lives in React state; re-renders on every keystroke.
function ControlledField() {
  const [email, setEmail] = useState('');
  const valid = /.+@.+\\..+/.test(email);
  return (
    <>
      <label htmlFor="c-email">Email</label>
      <input
        id="c-email"
        value={email}                               // React is source of truth
        onChange={(e) => setEmail(e.target.value)}  // update state each keystroke
      />
      {/* value is available live -> instant feedback */}
      {email && !valid && <span role="alert">Enter a valid email</span>}
    </>
  );
}

// UNCONTROLLED: value lives in the DOM; read it via a ref, only when needed.
function UncontrolledField() {
  const emailRef = useRef<HTMLInputElement>(null);
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('submitted value:', emailRef.current?.value); // read on submit
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="u-email">Email</label>
      {/* defaultValue (NOT value) seeds an uncontrolled input */}
      <input id="u-email" ref={emailRef} defaultValue="" />
      <button type="submit">Save</button>
    </form>
  );
}`,
      },
      {
        label: "Step 1 — Zod schema = validation + TypeScript type",
        language: "ts",
        code: `import { z } from 'zod';

// A single source of truth: runtime validation AND the static type.
export const signupSchema = z
  .object({
    email: z.string().email('Enter a valid email'),
    age: z.coerce.number().min(18, 'Must be 18 or older'), // coerce "18" -> 18
    password: z.string().min(8, 'At least 8 characters'),
    confirm: z.string(),
    role: z.enum(['user', 'admin']),
  })
  // Cross-field rule: something native validation cannot express.
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'], // attach the error to the confirm field
  });

// Derive the form's TypeScript type from the SAME schema — no duplication.
export type SignupForm = z.infer<typeof signupSchema>;`,
      },
      {
        label: "Step 2 — React Hook Form + zodResolver + accessible errors",
        language: "tsx",
        code: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupForm } from './schema';

function SignupForm({ onDone }: { onDone: (d: SignupForm) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    mode: 'onTouched',                 // validate after a field is touched, then on change
    defaultValues: { role: 'user' },
  });

  async function onSubmit(data: SignupForm) {
    try {
      await onDone(data);              // handleSubmit only calls this if VALID
      reset();                          // clear the form after success
    } catch (err) {
      // Map a server error back onto a field (e.g. "email already taken")
      setError('email', { message: 'That email is already registered' });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        {...register('email')}
        aria-invalid={!!errors.email}                 // announce invalid state
        aria-describedby={errors.email ? 'email-err' : undefined}
      />
      {errors.email && (
        <span id="email-err" role="alert">{errors.email.message}</span>
      )}

      <label htmlFor="age">Age</label>
      <input id="age" type="number" {...register('age')} />
      {errors.age && <span role="alert">{errors.age.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Create account'}
      </button>
    </form>
  );
}`,
      },
      {
        label: "Native HTML5 validation + Constraint Validation API",
        language: "html",
        code: `<!-- The free, accessible baseline — works before any JS loads. -->
<form id="signup">
  <label for="email">Email</label>
  <!-- required + type=email + pattern block submission and show native bubbles -->
  <input id="email" name="email" type="email" required
         placeholder="you@example.com" />

  <label for="pw">Password</label>
  <input id="pw" name="pw" type="password" required minlength="8" />

  <label for="qty">Quantity</label>
  <input id="qty" name="qty" type="number" min="1" max="10" step="1" required />

  <button type="submit">Sign up</button>
</form>

<style>
  /* Style validity states with CSS pseudo-classes — no JS needed */
  input:invalid { border-color: #dc2626; }
  input:valid   { border-color: #16a34a; }
</style>`,
      },
      {
        label: "Cross-field rule + custom message via the Constraint Validation API",
        language: "js",
        code: `// Enhance native validation with a JS cross-field rule (confirm password).
const form = document.getElementById('signup');
const pw = form.elements['pw'];
const confirm = form.elements['confirm'];

function checkMatch() {
  // setCustomValidity('') clears the error; a non-empty string marks invalid.
  confirm.setCustomValidity(
    confirm.value === pw.value ? '' : 'Passwords do not match'
  );
}
pw.addEventListener('input', checkMatch);
confirm.addEventListener('input', checkMatch);

form.addEventListener('submit', (e) => {
  // reportValidity() runs all native + custom rules and shows messages.
  if (!form.checkValidity()) {
    e.preventDefault();
    form.reportValidity();
    // Move focus to the first invalid field for accessibility.
    form.querySelector(':invalid')?.focus();
  }
});`,
      },
    ],
    runnable: {
      title: "Native + custom form validation, live (no libraries)",
      html: `<form id="signup" novalidate>
  <div class="row">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required aria-describedby="email-err" />
    <span class="err" id="email-err" role="alert"></span>
  </div>
  <div class="row">
    <label for="pw">Password (min 8)</label>
    <input id="pw" name="pw" type="password" required minlength="8" aria-describedby="pw-err" />
    <span class="err" id="pw-err" role="alert"></span>
  </div>
  <div class="row">
    <label for="confirm">Confirm password</label>
    <input id="confirm" name="confirm" type="password" required aria-describedby="confirm-err" />
    <span class="err" id="confirm-err" role="alert"></span>
  </div>
  <button type="submit">Create account</button>
</form>`,
      css: `body { font-family: system-ui, sans-serif; padding: 16px; }
.row { display: flex; flex-direction: column; margin-bottom: 12px; max-width: 320px; }
label { font-weight: 600; margin-bottom: 4px; }
input { padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; }
input[aria-invalid="true"] { border-color: #dc2626; }
.err { color: #dc2626; font-size: 13px; min-height: 16px; margin-top: 4px; }
button { padding: 9px 16px; border: 0; border-radius: 8px; background: #4f46e5; color: #fff; cursor: pointer; }`,
      js: `// A hand-rolled validator: native constraints + a cross-field rule,
// with accessible error wiring (aria-invalid + role=alert messages).
const form = document.getElementById('signup');
const pw = form.elements['pw'];
const confirm = form.elements['confirm'];

function setError(input, message) {
  const box = document.getElementById(input.id + '-err');
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  box.textContent = message;
}

// Cross-field rule the browser can't express on its own.
function checkMatch() {
  confirm.setCustomValidity(confirm.value === pw.value ? '' : 'Passwords do not match');
}
pw.addEventListener('input', checkMatch);
confirm.addEventListener('input', checkMatch);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let firstInvalid = null;
  [...form.elements].forEach((el) => {
    if (el.tagName !== 'INPUT') return;
    // validationMessage combines native rules + our setCustomValidity text.
    const msg = el.validity.valid ? '' : (el.validationMessage || 'Invalid');
    setError(el, msg);
    if (msg && !firstInvalid) firstInvalid = el;
  });
  if (firstInvalid) {
    firstInvalid.focus();       // move focus to the first error (a11y)
    console.log('Blocked — fix errors. Server would re-validate anyway.');
  } else {
    console.log('Valid! Submitting… (server MUST re-validate too)');
  }
});`,
    },
    interviewQA: [
      {
        question: "What is the difference between controlled and uncontrolled form inputs?",
        answer:
          "A controlled input stores its value in React state and updates on every keystroke via onChange, so React is the single source of truth — the value is available live for validation and derived UI, but the component re-renders on each change. An uncontrolled input keeps its value in the DOM and you read it via a ref (usually on submit), seeded with defaultValue instead of value; it's cheaper because there's no per-keystroke re-render. React Hook Form leans on the uncontrolled approach (registering inputs by ref) to keep large forms fast.",
      },
      {
        question: "When would you choose controlled over uncontrolled, or vice versa?",
        answer:
          "Choose controlled when you need the value live — inline validation as the user types, a character counter, enabling a submit button, or one field reacting to another. Choose uncontrolled (or a ref-based library) for large forms where per-keystroke re-renders would be wasteful, or when you only care about the final values at submit. In practice teams standardise on React Hook Form, which gives controlled-like ergonomics with uncontrolled performance, escaping the trade-off for most cases.",
      },
      {
        question: "How does native HTML5 validation fit into a modern validation strategy?",
        answer:
          "Native attributes — required, type=email/url, min/max/step, minlength/maxlength, pattern — are the free, accessible baseline that works before any JS loads, block submission, and expose the Constraint Validation API and :invalid/:valid CSS states. You layer on top: use native for cheap baseline checks, then a schema validator like Zod for rich rules, cross-field logic, and custom-styled inline messages. Native alone can't easily express cross-field rules or server-driven errors and has inconsistent default bubbles, which is why it's a baseline, not the whole story.",
      },
      {
        question: "Why combine React Hook Form with Zod instead of validating manually?",
        answer:
          "React Hook Form manages registration, submission, and dirty/touched/error/submitting state with minimal re-renders, while Zod gives you a single schema that both validates at runtime and generates the static TypeScript type via z.infer. zodResolver(schema) wires the schema into the form so failures land in formState.errors keyed by field. You define rules and types once instead of duplicating a type definition and a separate validation function that can drift apart, and you get cross-field rules via .refine() for free.",
      },
      {
        question: "How does a single Zod schema produce both validation and types?",
        answer:
          "You write the schema with z.object({ ... }) describing each field and its rules (and optionally .refine for cross-field logic). At runtime the schema's parse/safeParse validates and can coerce incoming data; at compile time type FormData = z.infer<typeof schema> extracts the exact static type from that same schema. Because there's one source of truth, the runtime rules and the TypeScript type can never drift apart — the duplication bug that plagues hand-written validate-plus-interface pairs.",
      },
      {
        question: "How do you display validation errors accessibly?",
        answer:
          "Every input needs a real associated <label> (via htmlFor/id or wrapping) — a placeholder is not a label. On the invalid input set aria-invalid={true} and aria-describedby pointing at the error element's id, and render the message in that element with role='alert' (or an aria-live region) so screen readers announce it when it appears. On a failed submit, move focus to the first invalid field. This ensures the error is perceivable, programmatically associated with its control, and announced.",
      },
      {
        question: "What is a sensible validation timing and UX strategy?",
        answer:
          "Don't validate aggressively from the first keystroke — it shows 'invalid email' before the user finishes. Validate on submit first, then switch a field to on-change validation after it's been touched or has errored (RHF's mode: 'onTouched'). Show each field's error next to it, disable the submit button while isSubmitting with a spinner, map server errors back onto fields with setError, and reset() after a successful submit so stale values don't linger.",
      },
      {
        question: "Why must you validate on the server even with client validation in place?",
        answer:
          "Client validation — native or Zod — is purely a UX convenience that gives fast feedback and reduces bad requests, but anyone can bypass it entirely by sending a raw HTTP request with curl, Postman, or a script, skipping the browser and your JavaScript. So the server is the only real trust boundary and must re-validate every field and every business rule. A common clean approach is to share the same Zod schema on both client and server so the rules are defined once and enforced authoritatively where it counts.",
      },
    ],
    thingsToRemember: [
      "Controlled = value in React state, re-renders per keystroke, use when you need the value live; uncontrolled = value in DOM via ref, read on submit.",
      "React Hook Form registers inputs by ref so typing doesn't re-render the whole form; handleSubmit runs validation then calls your handler.",
      "Start with native HTML5 validation (required, type, min/max, pattern) — free, accessible, works before JS loads.",
      "One Zod schema = runtime validation + static type via z.infer; define rules and types once.",
      "zodResolver(schema) feeds failures into formState.errors keyed by field; cross-field rules use .refine()/.superRefine().",
      "Accessible errors: real label + aria-invalid + aria-describedby + role='alert', and focus the first invalid field.",
      "Validate on submit first, then progressively (mode:'onTouched'); disable submit while isSubmitting; reset() after success.",
      "Use setError to surface server errors on the matching field.",
      "For multi-step forms keep one values object, validate the current step on Next and the whole schema on final submit.",
      "Client validation is UX only — always re-validate on the server; a raw HTTP request bypasses every browser and JS check.",
    ],
    references: [
      { label: "React Hook Form — docs", url: "https://react-hook-form.com" },
      { label: "React Hook Form — useForm & formState", url: "https://react-hook-form.com/docs/useform" },
      { label: "Zod — docs", url: "https://zod.dev" },
      { label: "MDN — Client-side form validation", url: "https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation" },
      { label: "MDN — Constraint Validation API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation" },
      { label: "MDN — Controls & the label element (a11y)", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label" },
    ],
    tags: ["forms", "react-hook-form", "zod", "validation", "typescript", "controlled-components", "uncontrolled", "accessibility", "html5-validation"],
  },
];
