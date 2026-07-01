import type { FrontendTopic } from "../types";

export const partF: FrontendTopic[] = [
  {
    id: "context-api-usecontext",
    num: 22,
    title: "Context API (useContext)",
    part: "State & Patterns",
    partId: "f",
    difficulty: "Core",
    summary:
      "The full Context story: what problem prop-drilling causes, how createContext/Provider/useContext work, the idiomatic provider pattern, the re-render-all-consumers pitfall and every mitigation (context splitting, value memoisation, state/dispatch separation), and exactly when Context is the wrong tool.",
    readingTime: 16,
    explanation: [
      "**Why Context exists — the prop-drilling problem.** In React, data flows *down* through props. When a deeply nested component needs a value (the logged-in user, the theme, the locale), the natural approach is to pass it as a prop — but that value has to be threaded through *every* intermediate component in between, even the ones that never use it. This is **prop-drilling**: layers of `<Layout user={user}>` → `<Sidebar user={user}>` → `<Menu user={user}>` where only the leaf actually reads `user`. It is noisy, brittle (rename the prop and touch ten files), and couples middle components to data they do not care about. Context solves exactly this: it lets a value be published once at the top and read directly by any descendant, skipping the middle entirely.",
      "**What Context actually is.** `React.createContext(defaultValue)` returns an object with two things: a `Provider` component and (historically) a `Consumer`. The Provider takes a `value` prop and makes it available to *every* component beneath it in the tree, no matter how deep. A descendant subscribes to that value by calling `useContext(TheContext)`. Conceptually Context is a **typed, tree-scoped dependency-injection channel**: the Provider registers a value for a subtree, and consumers pull it by identity rather than by having it handed down prop by prop.",
      "**The default value and why it is often a sentinel.** The argument to `createContext` is used only when a component calls `useContext` *without* a matching Provider above it. Many teams pass `undefined` (or `null`) as the default deliberately, so that consuming outside the intended Provider produces a detectable state instead of a silently-wrong value. That sentinel becomes the basis for the throwing custom hook described below. If you pass a real default (e.g. a light theme), consumers outside a Provider quietly get that default — sometimes fine, sometimes a hidden bug.",
      "**The idiomatic five-step provider pattern.** Production code almost always follows the same shape. (1) **Define the value type** — an interface describing exactly what the context exposes (state plus the functions that change it). (2) **Create the context** with `createContext<Type | undefined>(undefined)` so misuse is detectable. (3) **Write a Provider component** that owns the real state with `useState`/`useReducer`, defines the mutation functions, and renders `<Ctx.Provider value={...}>{children}</Ctx.Provider>`. (4) **Expose a custom hook** (e.g. `useAuth`) that calls `useContext`, throws a clear error if the value is `undefined`, and returns the typed value. (5) **Consume** the hook anywhere in the subtree. This packages the whole feature behind one import and one hook.",
      "**The central pitfall: every consumer re-renders on every value change.** This is the single most important thing to understand about Context. When the Provider's `value` changes *by reference*, React re-renders *every* component that calls `useContext` on that context — even components that only read a field which did not change. Context has no selector mechanism; it is all-or-nothing per context object. For low-frequency data (auth, theme, locale) that is completely fine. For high-frequency data (the text in an input on every keystroke, a fast-ticking timer, a large frequently-mutated list) it causes wide, wasteful re-render storms.",
      "**Pitfall amplifier: a fresh object literal as `value`.** A subtle trap: `value={{ user, login, logout }}` creates a *new object every render of the Provider*. Even if `user` did not change, the object reference did, so all consumers re-render whenever the Provider re-renders for any reason. The fix is to memoise the value with `useMemo(() => ({ user, login, logout }), [user])` and wrap the functions in `useCallback`, so the reference is stable when the underlying data is stable. Forgetting this is the most common Context performance bug in real code.",
      "**Mitigation one: split into multiple focused contexts.** If a context bundles many unrelated concerns, any change to one re-renders consumers of all. Splitting into separate contexts (a `ThemeContext`, an `AuthContext`, a `LocaleContext`) means a theme toggle only re-renders theme consumers. Narrow contexts have a smaller *blast radius*. This is the primary architectural lever for Context performance.",
      "**Mitigation two: separate state from dispatch.** A powerful pattern with `useReducer` is to expose the *state* through one context and the *dispatch* function through another. Components that only dispatch actions (a button that fires `addTodo`) subscribe to the dispatch context, whose value (the dispatch function) is stable forever, so they never re-render when the state changes. Only components that actually read state subscribe to the state context. This cleanly divides readers from writers.",
      "**Context is not a state manager.** Context is a *transport* mechanism — it moves a value down the tree. It does not store state, batch updates, provide selectors, offer devtools, or optimise re-renders. The state itself always lives in some `useState`/`useReducer` inside a Provider. So 'use Context vs use Redux' is slightly the wrong framing: Context is how you *distribute* state, while Redux/Zustand/Jotai are how you *manage and optimise* it. They frequently combine — react-redux uses Context under the hood to pass the store down, then layers selector-based subscriptions on top.",
      "**Server Components and Context (modern Next.js).** In the React Server Components world, Context only works inside Client Components — a Provider must live in a file marked `'use client'`, and only Client Components can call `useContext`. Server Components cannot read Context; they pass data down as props or through server-side mechanisms instead. This is a common gotcha when adding a ThemeProvider to a Next.js App Router layout: the provider file needs `'use client'`.",
      "**Testing and composition.** Because a Provider is just a component, tests wrap the component under test in the real (or a mock) Provider to inject known values — no globals to reset between tests. Multiple providers compose by nesting, which produces the familiar 'provider pyramid' at the app root; a small `<AppProviders>` component that nests them keeps the root readable.",
      "**When Context is the right tool — and when it is not.** Reach for Context when many components across the tree need the *same, relatively stable* value: current user, theme, locale, feature flags, a design-system config. Do *not* reach for Context for high-frequency updates (lift local state, or use a store with selectors), for server data (use TanStack Query/SWR), or as a lazy global-variable dumping ground. If you find yourself memoising heroically to stop re-render storms, you have probably outgrown Context and want a store.",
      "**The mental model (memorise this).** Context is tree-scoped dependency injection: a Provider publishes one value to a subtree, and any descendant reads it directly via a hook — killing prop-drilling. The price is that every consumer re-renders whenever the value's reference changes, so you keep the value stable (memoise it), split contexts by concern, and separate state from dispatch. Use it for low-frequency global values; it distributes state, it does not manage it.",
    ],
    backendAnalogy:
      "Context is Spring's dependency-injection container scoped to a subtree instead of the whole app. `createContext` declares a bean type, the Provider is the `@Configuration` that binds a concrete instance for everything below it, and `useContext` is `@Autowired` — a component asks for the dependency by type and the framework supplies the nearest registered instance, no constructor threading (prop-drilling) required. The re-render-all-consumers pitfall maps to a coarse-grained bean whose change invalidates every collaborator that injected it: the fix (splitting contexts, separating state from dispatch) is the same as splitting a fat god-bean into focused, single-responsibility beans so a change ripples only to the collaborators that truly depend on it. Memoising the value object is like making the injected bean effectively immutable so downstream caches stay valid.",
    keyInsights: [
      "Context kills prop-drilling: a Provider publishes one value to a whole subtree and any descendant reads it directly, so intermediate components stop forwarding props they do not use.",
      "The core cost: when the Provider value changes BY REFERENCE, every component that calls useContext on it re-renders, even ones reading an unchanged field. There is no built-in selector.",
      "value={{ ... }} creates a new object every render, forcing all consumers to re-render; memoise it with useMemo and wrap callbacks in useCallback to keep the reference stable.",
      "Split one fat context into several focused ones (theme, auth, locale) to shrink the re-render blast radius.",
      "Separate state and dispatch into two contexts; dispatch is stable, so write-only components never re-render on state changes.",
      "Create the context with a sentinel default (undefined) and wrap consumption in a custom hook that throws when used outside its Provider.",
      "Context transports state; it does not manage it. The real state lives in useState/useReducer inside the Provider.",
      "Use Context for low-frequency global values (auth, theme, locale, config); avoid it for high-frequency updates and for server data.",
      "In Next.js App Router, Providers must be Client Components ('use client'); Server Components cannot call useContext.",
      "Providers compose by nesting; a single AppProviders wrapper keeps the root tidy and makes tests trivial by injecting mock values.",
    ],
    codeSamples: [
      {
        label: "The idiomatic five-step provider pattern (typed AuthContext)",
        language: "tsx",
        code: `import {
  createContext, useContext, useState, useCallback, useMemo, ReactNode,
} from 'react';

interface User { id: string; name: string; }

// 1. Define exactly what the context exposes
interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

// 2. Create with a sentinel default so misuse is detectable
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provider owns the state and the mutation functions
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // useCallback keeps these references stable across renders
  const login = useCallback((token: string) => {
    localStorage.setItem('token', token);
    setUser(decodeJWT(token));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  // useMemo keeps the VALUE object stable unless user changes — this is
  // the fix for the "new object every render forces all consumers to
  // re-render" pitfall.
  const value = useMemo(
    () => ({ user, login, logout }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 4. Custom hook: typed, throws outside the Provider
function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

// 5. Consume anywhere in the subtree — no prop-drilling
function Navbar() {
  const { user, logout } = useAuth();
  return <button onClick={logout}>Logout {user?.name}</button>;
}

declare function decodeJWT(t: string): User;`,
      },
      {
        label: "The re-render pitfall — and why memoising the value fixes it",
        language: "tsx",
        code: `// BAD: a fresh object literal every render.
// Every consumer re-renders whenever <ThemeProvider> re-renders for ANY
// reason, even if 'theme' did not actually change.
function ThemeProviderBad({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState('light');
  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

// GOOD: memoise the value so its reference is stable when theme is stable.
function ThemeProviderGood({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState('light');
  const value = React.useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

const ThemeCtx = React.createContext<{ theme: string; setTheme: (t: string) => void } | undefined>(undefined);`,
      },
      {
        label: "Separate state and dispatch contexts (write-only components never re-render)",
        language: "tsx",
        code: `import { createContext, useContext, useReducer, useMemo, ReactNode, Dispatch } from 'react';

type Todo = { id: number; text: string; done: boolean };
type Action =
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: number };

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'add':    return [...state, { id: Date.now(), text: action.text, done: false }];
    case 'toggle': return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
  }
}

// Two separate contexts: one for reading, one for writing.
const TodosStateCtx = createContext<Todo[] | undefined>(undefined);
const TodosDispatchCtx = createContext<Dispatch<Action> | undefined>(undefined);

function TodosProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, []);
  // 'state' changes often; 'dispatch' is stable forever.
  return (
    <TodosStateCtx.Provider value={state}>
      <TodosDispatchCtx.Provider value={dispatch}>
        {children}
      </TodosDispatchCtx.Provider>
    </TodosStateCtx.Provider>
  );
}

// A button that only dispatches subscribes ONLY to dispatch, so it never
// re-renders when the todo list changes.
function useTodosDispatch() {
  const d = useContext(TodosDispatchCtx);
  if (!d) throw new Error('useTodosDispatch outside provider');
  return d;
}`,
      },
      {
        label: "Composing providers + Next.js App Router 'use client' gotcha",
        language: "tsx",
        code: `'use client'; // REQUIRED: Providers/useContext only work in Client Components

import { ReactNode } from 'react';

// Nesting many providers gets noisy at the app root, so wrap them once.
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// app/layout.tsx (a Server Component) can render <AppProviders> as a child;
// the 'use client' boundary lives inside AppProviders, keeping the layout
// itself a Server Component.
declare function AuthProvider(p: { children: ReactNode }): JSX.Element;
declare function ThemeProvider(p: { children: ReactNode }): JSX.Element;
declare function LocaleProvider(p: { children: ReactNode }): JSX.Element;`,
      },
    ],
    runnable: {
      title: "See how a shared value re-renders every subscriber (vanilla mini-Context)",
      html: `<div id="app">
  <button id="toggle">Toggle theme</button>
  <div class="consumers">
    <span class="consumer" data-name="Navbar">Navbar</span>
    <span class="consumer" data-name="Sidebar">Sidebar</span>
    <span class="consumer" data-name="Footer">Footer</span>
  </div>
</div>
<pre id="log"></pre>`,
      css: `body { font-family: system-ui, sans-serif; padding: 16px; }
button { padding: 8px 14px; border: 0; border-radius: 8px; background:#4f46e5; color:#fff; cursor:pointer; }
.consumers { display: flex; gap: 10px; margin-top: 14px; }
.consumer { padding: 10px 14px; border-radius: 10px; font-weight: 700; }
.light { background:#e2e8f0; color:#0f172a; }
.dark  { background:#0f172a; color:#e2e8f0; }
#log { background:#0b1020; color:#8ce99a; padding:10px; border-radius:8px; margin-top:14px; min-height:60px; }`,
      js: `// A tiny stand-in for Context: one shared value + a list of subscribers.
// The point of the demo: changing the ONE value re-renders EVERY subscriber,
// which is exactly how React Context behaves.
const state = { theme: 'light' };
const subscribers = [...document.querySelectorAll('.consumer')];
const log = document.getElementById('log');

function render(name) {
  return () => {
    const el = subscribers.find(s => s.dataset.name === name);
    el.className = 'consumer ' + state.theme;
    log.textContent += 'render: ' + name + ' (theme=' + state.theme + ')\\n';
  };
}
const renderers = subscribers.map(s => render(s.dataset.name));

function setTheme(next) {
  state.theme = next;
  log.textContent += '--- value changed -> ALL consumers re-render ---\\n';
  renderers.forEach(fn => fn()); // every consumer re-renders, not just one
}

renderers.forEach(fn => fn()); // initial paint
document.getElementById('toggle').addEventListener('click', () => {
  setTheme(state.theme === 'light' ? 'dark' : 'light');
});`,
    },
    interviewQA: [
      {
        question: "What problem does Context solve, and how is it better than prop-drilling?",
        answer:
          "Prop-drilling means threading a prop through every intermediate component just to reach a deep descendant, even though the middle components never use it — that is noisy and brittle. Context lets a Provider publish a value to an entire subtree, and any descendant reads it directly with useContext, so the intermediate components stay clean. It is a tree-scoped dependency-injection channel, best for stable global values like auth, theme, and locale.",
      },
      {
        question: "What is the main performance pitfall with Context and how do you mitigate it?",
        answer:
          "When the Provider's value changes by reference, every component that calls useContext on that context re-renders — even ones reading a field that did not change, because Context has no selector. Mitigations: memoise the value object with useMemo (and wrap functions in useCallback) so the reference stays stable, split one fat context into several focused ones to shrink the blast radius, separate state and dispatch into two contexts so write-only components never re-render, and keep high-frequency state out of Context entirely.",
      },
      {
        question: "Why does value={{ ... }} on a Provider hurt performance?",
        answer:
          "An object literal creates a brand-new object on every render of the Provider, so its reference differs each time even when the underlying data is identical. Because consumers re-render whenever the value reference changes, all of them re-render on every Provider render for any reason. Wrapping the value in useMemo keyed on its real dependencies makes the reference stable, so consumers only re-render when the data actually changes.",
      },
      {
        question: "Why wrap useContext in a custom hook that throws?",
        answer:
          "Creating the context with an undefined default and then having a hook like useAuth throw when the value is undefined turns 'used outside the Provider' from a silent, hard-to-trace bug into a loud, immediate error. The hook also returns a fully typed value and centralises consumption behind one import, so call sites are clean and there are no repeated null checks scattered around.",
      },
      {
        question: "Is Context a replacement for Redux?",
        answer:
          "Not exactly — they solve different halves of the problem. Context is a transport mechanism: it distributes a value down the tree but does not store state, batch updates, offer selectors, or provide devtools. Redux (and Zustand/Jotai) manage and optimise state with selector-based subscriptions and tooling. In fact react-redux uses Context internally to pass the store down. Use Context for low-frequency global values; reach for a store when you need selectors, many updaters, or fine-grained subscriptions.",
      },
      {
        question: "How does Context behave with React Server Components / Next.js App Router?",
        answer:
          "Context only works in Client Components. A Provider must live in a file marked 'use client', and only Client Components can call useContext. Server Components cannot read Context — they pass data down as props instead. A common mistake is adding a ThemeProvider directly in a Server Component layout; you fix it by putting the providers inside a 'use client' AppProviders component that the layout renders.",
      },
      {
        question: "How do you test a component that consumes Context?",
        answer:
          "Because a Provider is just a component, you wrap the component under test in the real or a mock Provider and pass a known value. There are no module-level globals to reset between tests, so isolation is clean. Nesting multiple providers works the same way, and a shared test-utils render function that wraps children in the app's providers keeps individual tests concise.",
      },
    ],
    thingsToRemember: [
      "Context = tree-scoped dependency injection: Provider publishes a value, descendants read it via useContext, no prop-drilling.",
      "Every consumer re-renders when the value's reference changes — there is no built-in selector.",
      "Never pass a raw object literal as value; memoise it with useMemo and stabilise functions with useCallback.",
      "Split fat contexts into focused ones (theme/auth/locale) to reduce the re-render blast radius.",
      "Separate state and dispatch contexts so write-only components never re-render on state changes.",
      "Create with an undefined default and consume through a custom hook that throws outside the Provider.",
      "Context distributes state; useState/useReducer inside the Provider manages it.",
      "Use it for low-frequency global data; keep high-frequency and server data out.",
      "In Next.js App Router, Providers need 'use client'; Server Components cannot use Context.",
      "Compose providers by nesting; a single AppProviders wrapper keeps the root clean and tests easy.",
    ],
    references: [
      { label: "React — Passing Data Deeply with Context", url: "https://react.dev/learn/passing-data-deeply-with-context" },
      { label: "React — Scaling Up with Reducer and Context", url: "https://react.dev/learn/scaling-up-with-reducer-and-context" },
      { label: "React — useContext reference", url: "https://react.dev/reference/react/useContext" },
      { label: "React — createContext reference", url: "https://react.dev/reference/react/createContext" },
      { label: "MDN — React Context (concepts overview)", url: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started" },
      { label: "Kent C. Dodds — How to use React Context effectively", url: "https://kentcdodds.com/blog/how-to-use-react-context-effectively" },
    ],
    tags: ["react", "context", "useContext", "state", "prop-drilling", "provider", "re-render", "dependency-injection"],
  },
  {
    id: "state-management-overview",
    num: 23,
    title: "State Management Overview",
    part: "State & Patterns",
    partId: "f",
    difficulty: "Core",
    summary:
      "A decision framework for where state should live: local vs lifted vs derived vs Context vs global store vs server state — plus the categories of client-state libraries (Redux Toolkit, Zustand, Jotai, Recoil) and why server state is a separate discipline handled by TanStack Query / SWR.",
    readingTime: 15,
    explanation: [
      "**State management is really a placement problem.** The hard part of state is rarely which library you pick — it is deciding *where each piece of state should live* and *how far it should be shared*. Put state too low and siblings cannot see it; put it too high and unrelated components re-render and the app becomes hard to reason about. The skill is matching each piece of state to the smallest scope that satisfies its consumers, and only escalating when a real requirement forces you to.",
      "**The escalation ladder.** There is a natural order to reach for: (1) **local state** with `useState`/`useReducer` inside the one component that owns it; (2) **lifted state** moved up to the closest common parent when two or three siblings must share it; (3) **derived state** computed from existing state during render (do not store what you can calculate); (4) **Context** to distribute a low-frequency value across a distant subtree; (5) a **global client store** (Redux Toolkit, Zustand, Jotai) when many components across the app read and write complex, frequently-changing state; and (6) **server state** for anything that actually lives on the backend. Start at the top and move down only under pressure.",
      "**Local state is the default and it is underrated.** The vast majority of state — input values, toggles, hover/open flags, the active tab — belongs to a single component and should stay in `useState` there. Local state is the simplest to reason about, has no shared blast radius, and is trivially removed when the component unmounts. A frequent mistake is promoting local state to global 'just in case,' which adds coupling and re-renders for no benefit.",
      "**Lifting state up — and knowing when to stop.** When siblings must stay in sync (a filter input and the list it filters), move the state to their nearest common parent and pass it down. This is the canonical React pattern. But lifting has a cost: the parent re-renders and props thread down. If you find yourself lifting the same state through many levels, that is the signal to switch to Context (for distribution) or a store (for management), not to keep drilling.",
      "**Derived state: compute, do not duplicate.** A large class of 'state bugs' come from storing something that could be derived. If you have `items` and a `filter`, the filtered list is *derived* — compute it during render (memoised with `useMemo` if expensive) rather than storing a second `filteredItems` array you must keep in sync. The rule: store the minimal source of truth; derive everything else. Duplicated state that can drift is a bug waiting to happen.",
      "**Context is distribution, not management.** Context solves prop-drilling for low-frequency global values (auth, theme, locale) but re-renders every consumer when its value changes and has no selectors. It is the right choice when the value is stable and read widely. It is the wrong choice for high-frequency updates or large state graphs with many independent slices — that is where a real store with selector-based subscriptions earns its keep.",
      "**Global client-state libraries — the landscape.** When you genuinely need app-wide client state, the main options differ in philosophy. **Redux Toolkit** is a single centralised store with actions/reducers, excellent devtools and time-travel, and a predictable one-way data flow — great for large teams and complex, auditable state. **Zustand** is a tiny hook-based store with minimal boilerplate and built-in selector subscriptions. **Jotai/Recoil** are atom-based: state is split into small independent atoms and components subscribe only to the atoms they use, which minimises re-renders. All three (unlike raw Context) offer fine-grained subscriptions so a component re-renders only when the specific data it reads changes.",
      "**Fine-grained subscriptions are the real advantage of a store over Context.** The reason a store beats 'Context + useReducer' at scale is the *selector*: `useSelector(state => state.cart.total)` subscribes the component to just `cart.total`, so it re-renders only when that number changes — not when any unrelated slice updates. Context cannot do this; it re-renders all consumers on any value change. When re-render performance across a large shared state graph matters, that selector capability is decisive.",
      "**Server state is a different discipline.** Data that originates on a backend — a list of users fetched from an API — is not really *your* state; it is a *cache* of state that lives on the server. It needs concerns UI state never does: caching, deduping identical requests, background refetching, staleness/expiry, retry, pagination, and revalidation after mutations. Hand-rolling all of that inside Redux or Context means reimplementing a cache poorly. This is why **TanStack Query** and **SWR** exist: they own the server-cache lifecycle so your client store only holds true client state.",
      "**The classic anti-pattern: server data dumped into Redux.** A very common mistake is fetching in a thunk and storing the response in Redux, then manually handling loading flags, refetch, and invalidation everywhere. It works, but you end up rebuilding TanStack Query by hand and the store fills with data that is really just a cache. The modern split is: **server state → TanStack Query/SWR; client state → Redux Toolkit/Zustand/Context/local**. RTK even ships **RTK Query** specifically to handle server state within the Redux ecosystem.",
      "**A practical decision checklist.** Ask, in order: Does only one component use it? → local. Do a couple of siblings share it? → lift. Can it be computed from other state? → derive, do not store. Is it a stable global value read widely? → Context. Is it complex client state with many updaters or needing devtools/time-travel? → Redux Toolkit (or Zustand/Jotai). Does it come from a server and need caching/refetch? → TanStack Query/SWR. Most answers land in the first three rungs.",
      "**The mental model (memorise this).** State management is choosing the smallest scope that works and escalating only under pressure: local → lifted → derived → Context → global store → server state. Context distributes low-frequency values but re-renders all consumers; stores add selector-based subscriptions for fine-grained updates; and server data is a separate cache handled by TanStack Query or SWR, never hand-rolled in a client store.",
    ],
    backendAnalogy:
      "Think of state placement like choosing the scope of a variable or bean in a Spring service. Local useState is a method-local variable — private, short-lived, no shared contention. Lifted state is a field on the enclosing class shared by a couple of methods. Context is a request- or session-scoped bean injected wherever it is needed. A global store (Redux/Zustand) is a singleton application-scoped bean with well-defined mutators and an audit log (devtools/time-travel). And server state via TanStack Query is your caching layer — the second-level Hibernate cache or a Caffeine/Redis cache in front of the database: it dedupes reads, expires stale entries, and revalidates, so you never confuse the cache with the source of truth. Dumping API data into Redux is like caching rows in a plain HashMap and reinventing eviction and refresh yourself instead of using the cache abstraction built for it.",
    keyInsights: [
      "State management is mostly a placement problem: put each piece of state in the smallest scope that satisfies its consumers, and escalate only when a real need forces it.",
      "Escalation ladder: local (useState) → lifted to a common parent → derived (compute, do not store) → Context → global store → server state.",
      "Local state is the correct default for most UI state; do not promote it to global 'just in case.'",
      "Derive anything you can compute from existing state instead of storing a duplicate that can drift out of sync.",
      "Context distributes low-frequency values but re-renders all consumers and has no selectors; it is distribution, not management.",
      "A store's decisive edge over Context at scale is selector-based subscriptions: components re-render only when the specific slice they read changes.",
      "Client-store options differ in philosophy: Redux Toolkit (centralised, devtools/time-travel), Zustand (tiny hook store), Jotai/Recoil (atoms with fine-grained subscriptions).",
      "Server state (API data) needs caching, deduping, refetch, staleness, and revalidation — a separate discipline from UI state.",
      "Use TanStack Query or SWR for server state; do not hand-roll a cache inside Redux or Context. RTK Query fills this role inside the Redux ecosystem.",
      "Quick checklist: one component → local; a few siblings → lift; computable → derive; stable global → Context; complex client → store; from a server → TanStack Query/SWR.",
    ],
    codeSamples: [
      {
        label: "The escalation ladder as a comparison table",
        language: "ts",
        code: `/*
| Layer        | Tool                      | Use it when                                            |
| ------------ | ------------------------- | ------------------------------------------------------ |
| Local state  | useState / useReducer     | Inputs, toggles, tabs — owned by one component         |
| Lifted state | useState in parent        | 2–3 siblings must stay in sync                         |
| Derived      | compute in render/useMemo | The value is calculable from existing state            |
| Context      | createContext/useContext  | Stable global value read widely (auth, theme, locale)  |
| Global store | Redux Toolkit / Zustand   | Complex client state, many updaters, devtools needed   |
| Server state | TanStack Query / SWR      | Data from an API needing caching, refetch, revalidate  |
*/
export {};`,
      },
      {
        label: "Derived state: compute, do not duplicate",
        language: "tsx",
        code: `import { useState, useMemo } from 'react';

type Item = { id: number; name: string; price: number };

function Cart({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('');

  // BAD would be: const [filtered, setFiltered] = useState(items);
  // then trying to keep 'filtered' in sync on every change — it WILL drift.

  // GOOD: derive it during render. 'items' + 'query' are the source of truth.
  const filtered = useMemo(
    () => items.filter(i => i.name.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );

  // total is also derived — never store it.
  const total = filtered.reduce((sum, i) => sum + i.price, 0);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <p>{filtered.length} items, total \${total}</p>
    </div>
  );
}`,
      },
      {
        label: "Server state with TanStack Query — no hand-rolled cache",
        language: "tsx",
        code: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// The library owns caching, deduping, background refetch, and staleness —
// you do NOT store this in Redux or Context.
function Users() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
    staleTime: 60_000, // treat data as fresh for 60s before refetching
  });

  if (isLoading) return <p>Loading…</p>;
  if (isError)   return <p>Failed to load</p>;
  return <ul>{data.map((u: any) => <li key={u.id}>{u.name}</li>)}</ul>;
}

function AddUser() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (name: string) =>
      fetch('/api/users', { method: 'POST', body: JSON.stringify({ name }) }),
    // After a write, invalidate the cache so the list revalidates.
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
  return <button onClick={() => mutation.mutate('Ada')}>Add</button>;
}`,
      },
      {
        label: "Zustand — a tiny client store with selector subscriptions",
        language: "ts",
        code: `import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  reset: () => void;
}

// A store is just a hook. No Provider, no boilerplate.
const useCounter = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}));

// Selector subscription: this component re-renders ONLY when count changes,
// not when unrelated store fields change — the key advantage over Context.
function useCount() {
  return useCounter((s) => s.count);
}
export { useCounter, useCount };`,
      },
    ],
    interviewQA: [
      {
        question: "How do you decide where a piece of state should live?",
        answer:
          "Default to local useState in the component that owns it. If two or three siblings need it, lift it to their nearest common parent. If it can be computed from existing state, derive it during render instead of storing a duplicate. If many distant components need a stable global value like auth or theme, use Context. If you have complex client state with many updaters or need devtools/time-travel, use a store like Redux Toolkit or Zustand. If the data comes from an API, treat it as server state and use TanStack Query or SWR. Start at the top of that ladder and escalate only under real pressure.",
      },
      {
        question: "Why is server state treated as a separate category from client state?",
        answer:
          "Server state is a cache of data that actually lives on the backend, so it needs concerns UI state never has: caching, deduping identical requests, background refetch, staleness and expiry, retry, and revalidation after mutations. UI state like a toggle needs none of that. Libraries like TanStack Query and SWR own that lifecycle, whereas putting fetched data in Redux means reimplementing a cache — loading flags, invalidation, refetch — by hand and poorly.",
      },
      {
        question: "What is derived state and why should you avoid storing it?",
        answer:
          "Derived state is any value computable from existing state — a filtered list from items plus a query, or a total from line items. Storing it as separate state means you must keep two things in sync on every change, and they inevitably drift, producing bugs. The rule is to keep the minimal source of truth in state and compute everything else during render, memoising with useMemo only if the computation is expensive.",
      },
      {
        question: "What advantage does a store like Redux or Zustand have over Context?",
        answer:
          "Selector-based subscriptions. A store lets a component subscribe to just the slice it reads — useSelector(s => s.cart.total) re-renders only when that number changes. Context has no selectors: any change to the Provider value re-renders every consumer. So for large, frequently-updated shared state, a store gives fine-grained re-renders that Context cannot, plus devtools, middleware, and a predictable data flow.",
      },
      {
        question: "When should you NOT introduce Redux?",
        answer:
          "When the state is local UI state, when only a couple of siblings share it (lift it instead), when the value can be derived, or when the global need is just a stable low-frequency value like theme or auth (Context is enough). And when the data is server data, reach for TanStack Query, not Redux. Redux earns its boilerplate only with complex, frequently-updated, cross-cutting client state shared by many components, or when you specifically want time-travel debugging and middleware.",
      },
      {
        question: "How do the main client-state libraries differ?",
        answer:
          "Redux Toolkit is a single centralised store with actions and reducers, strong devtools and time-travel, and a strict one-way flow — good for large teams and auditable state. Zustand is a minimal hook-based store with almost no boilerplate and built-in selector subscriptions. Jotai and Recoil are atom-based: state is split into small independent atoms and components subscribe only to the atoms they use, minimising re-renders. They mainly differ in centralised-vs-atomic philosophy and how much ceremony they require.",
      },
      {
        question: "What is the classic server-state-in-Redux anti-pattern?",
        answer:
          "Fetching in a thunk, storing the raw response in Redux, and then hand-managing loading flags, refetch, and cache invalidation everywhere. It effectively rebuilds TanStack Query by hand and fills the store with what is really just a cache. The fix is to route server state through TanStack Query, SWR, or RTK Query, and keep the client store for true client state only.",
      },
    ],
    thingsToRemember: [
      "State placement is the real skill: smallest scope that works, escalate only under pressure.",
      "Ladder: local → lifted → derived → Context → global store → server state.",
      "Local useState is the correct default for most UI state.",
      "Derive computable values in render; never store a duplicate that can drift.",
      "Context distributes low-frequency global values but re-renders all consumers and has no selectors.",
      "Stores (Redux Toolkit, Zustand, Jotai) add selector subscriptions for fine-grained re-renders.",
      "Redux Toolkit = centralised + devtools; Zustand = tiny hook store; Jotai/Recoil = atoms.",
      "Server state (API data) needs caching/refetch/staleness — a distinct discipline.",
      "Use TanStack Query / SWR (or RTK Query) for server state; do not hand-roll it in a store.",
      "Checklist: one component → local; few siblings → lift; computable → derive; stable global → Context; complex client → store; from a server → Query.",
    ],
    references: [
      { label: "React — Managing State", url: "https://react.dev/learn/managing-state" },
      { label: "React — Sharing State Between Components", url: "https://react.dev/learn/sharing-state-between-components" },
      { label: "React — Choosing the State Structure", url: "https://react.dev/learn/choosing-the-state-structure" },
      { label: "Redux Toolkit — When (and when not) to use Redux", url: "https://redux-toolkit.js.org/usage/nextjs" },
      { label: "TanStack Query — Overview", url: "https://tanstack.com/query/latest/docs/framework/react/overview" },
      { label: "MDN — Client-side frameworks: state management", url: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks" },
    ],
    tags: ["react", "state-management", "context", "redux", "zustand", "server-state", "tanstack-query", "derived-state"],
  },
  {
    id: "redux-redux-toolkit",
    num: 24,
    title: "Redux (Redux Toolkit)",
    part: "State & Patterns",
    partId: "f",
    difficulty: "Core",
    summary:
      "Redux end to end via Redux Toolkit: the store/action/reducer flow, why unidirectional data flow matters, createSlice with Immer, configureStore and typed hooks, async thunks (createAsyncThunk), memoised selectors (createSelector), and RTK Query — plus when Redux is worth its cost.",
    readingTime: 18,
    explanation: [
      "**The Redux core idea: one predictable state machine.** Redux keeps all shared application state in a single **store** (one big JavaScript object). You never mutate it directly. Instead you **dispatch actions** — plain objects describing *what happened* (`{ type: 'cart/itemAdded', payload }`) — and pure functions called **reducers** compute the *next* state from the current state and the action. Because the only way state changes is 'dispatch an action → reducer returns new state,' the data flow is strictly one-directional and every change is traceable. That predictability is Redux's whole reason for existing.",
      "**Why unidirectional flow and immutability matter.** Reducers must be **pure** (no side effects, no mutation) and must return a *new* state object rather than editing the old one. This immutability is what powers Redux's superpowers: React can cheaply detect changes by reference comparison, the devtools can record every past state and 'time-travel' between them, and bugs are reproducible because state is a deterministic function of the action log. The cost, in classic Redux, was verbose immutable-update code and lots of boilerplate — which is exactly what Redux Toolkit fixes.",
      "**Redux Toolkit (RTK) is the official, batteries-included way.** Modern Redux is written with RTK; hand-writing action-type constants, action creators, and switch-statement reducers is obsolete. RTK gives you `createSlice` (generates actions + reducer together), `configureStore` (sets up the store with good defaults — the thunk middleware, devtools, and dev-time immutability/serializability checks), `createAsyncThunk` (async flows), `createSelector` (memoised selectors, re-exported from Reselect), and `createApi`/RTK Query (full server-state caching). The React docs and Redux docs both recommend RTK as the default.",
      "**createSlice: state + reducers + auto-generated actions in one place.** A **slice** owns one region of the store. You give `createSlice` a `name`, an `initialState`, and a `reducers` object; it returns a reducer plus a matching **action creator for every reducer key**. So writing an `addExpense(state, action)` reducer automatically gives you an `addExpense(payload)` action creator — no separate action-type constant, no boilerplate creator. This colocation (state shape, its transitions, and its actions in one file) is the single biggest ergonomics win over classic Redux.",
      "**Immer: write 'mutating' code that is actually immutable.** The reducers inside `createSlice` run through **Immer**. Immer hands your reducer a *draft* proxy of the state; you write natural mutations like `state.items.push(item)` or `state.filter = 'all'`, Immer records those operations against the draft, and then produces a brand-new immutable state from them. So the syntax is ergonomic and mutable-looking, but the store update is fully immutable. The one rule: this only applies *inside* RTK reducers — never mutate state anywhere else, and do not both mutate the draft *and* return a value from the same reducer.",
      "**configureStore and full TypeScript typing.** `configureStore({ reducer: { expenses: expenseReducer, cart: cartReducer } })` combines slice reducers into the root store and wires the sensible middleware defaults automatically. From it you derive two types that make everything type-safe: `RootState = ReturnType<typeof store.getState>` and `AppDispatch = typeof store.dispatch`. Best practice is to export **pre-typed hooks** — `useAppSelector` and `useAppDispatch` — so every call site is typed without repeating generics, and thunks are dispatchable with correct types.",
      "**Reading and writing from components.** Components connect via react-redux hooks. `useSelector(selectorFn)` subscribes the component to a slice of state and re-renders it **only when that selected value changes** (by reference, using strict equality by default) — this is the fine-grained subscription Context lacks. `useDispatch()` returns the store's `dispatch`, which you call with an action creator: `dispatch(addExpense(newExpense))`. The Provider from react-redux (`<Provider store={store}>`) wraps the app so the hooks can reach the store — internally that Provider uses React Context.",
      "**Async with createAsyncThunk.** Reducers are synchronous and pure, so side effects (API calls) live in **thunks**. `createAsyncThunk('users/fetch', async () => …)` returns a thunk you dispatch; it automatically dispatches three lifecycle actions — `pending`, `fulfilled`, and `rejected` — which you handle in the slice's `extraReducers` (via the `builder` callback) to set loading, data, and error state. This gives async data a clean, standard three-state shape without hand-writing action types for each phase.",
      "**Selectors and memoisation with createSelector.** A **selector** is a function that reads a value out of state (`state => state.cart.items`). Inline selectors are fine for simple reads, but for *derived* data (a filtered list, a computed total) you want `createSelector`, which **memoises**: it recomputes only when its input selectors' results change, and returns the *same reference* otherwise. That stable reference prevents needless re-renders and avoids recomputing expensive transforms on every dispatch. Colocating selectors in the slice file (`selectCartTotal`) keeps state access encapsulated so components do not reach into the state shape directly.",
      "**RTK Query — server state inside the Redux ecosystem.** Rather than hand-writing thunks to fetch and cache API data, **RTK Query** (`createApi`) generates fully-typed hooks (`useGetUsersQuery`, `useAddUserMutation`) that handle caching, deduping, background refetch, loading/error state, and cache invalidation via **tags** — the same job TanStack Query does, but integrated into the Redux store and devtools. If you are already on Redux, RTK Query is the recommended way to handle server state so you do not confuse it with client state.",
      "**When Redux is worth its cost — and when it is not.** Redux shines for large apps with complex, frequently-updated, cross-cutting client state shared by many components, big teams that benefit from a strict, auditable, one-way data flow, and cases where the devtools' time-travel and action log are genuinely useful. It is overkill for small apps, for local UI state (use `useState`), for a couple of siblings (lift state), or for a stable global value (Context). And server data belongs in RTK Query/TanStack Query, not in hand-managed slices. Reach for Redux when the *predictability and tooling* pay for the ceremony — RTK has made that ceremony small, but it is not zero.",
      "**The mental model (memorise this).** Redux is a single immutable state machine: components dispatch actions (facts about what happened), pure reducers compute the next state, and components subscribe to slices via selectors that re-render only on change. Redux Toolkit makes this ergonomic — createSlice colocates state and auto-generates actions, Immer lets you write mutating-looking reducers that stay immutable, configureStore wires it up and types it, thunks handle async, createSelector memoises derived data, and RTK Query owns server state.",
    ],
    backendAnalogy:
      "Redux is event sourcing for the frontend. Dispatched actions are immutable domain events appended to a log, reducers are the event handlers that fold each event into the aggregate's next state, and the store is the current materialised aggregate — pure, deterministic, and replayable, which is literally what the devtools' time-travel does (replay the event log). createSlice is like a CQRS command handler generated from a single definition: declaring the reducer gives you the matching command (action creator) for free, the way a Spring @CommandHandler binds a command to its state transition. Immer is a persistent-data-structure trick: you appear to mutate a draft, but it emits a new immutable version, like a copy-on-write value object. createAsyncThunk's pending/fulfilled/rejected trio mirrors a saga's lifecycle events, createSelector is a memoised read-model projection (a cached query view), and RTK Query is your caching repository layer with tag-based cache eviction — the frontend equivalent of a second-level cache with fine-grained invalidation.",
    keyInsights: [
      "Redux = one immutable store changed only by dispatching actions into pure reducers; the strictly one-way flow makes every state change traceable.",
      "Reducers must be pure and return new state; immutability is what enables reference-based change detection and devtools time-travel.",
      "Redux Toolkit is the official default — hand-writing action-type constants, creators, and switch reducers is obsolete.",
      "createSlice colocates state + reducers and auto-generates a matching action creator for every reducer key.",
      "RTK reducers run through Immer, so mutating-looking code (state.items.push(...)) produces an immutable update — but only inside those reducers.",
      "configureStore wires middleware defaults and lets you derive RootState and AppDispatch; export pre-typed useAppSelector/useAppDispatch hooks.",
      "useSelector subscribes to a slice and re-renders only when that value changes — the fine-grained subscription Context lacks; useDispatch sends actions.",
      "createAsyncThunk handles side effects by dispatching pending/fulfilled/rejected, handled in extraReducers for a standard loading/data/error shape.",
      "createSelector memoises derived data, returning a stable reference so components do not re-render or recompute needlessly.",
      "RTK Query handles server state (caching, refetch, tag-based invalidation) inside the Redux store; keep server state out of hand-written slices.",
    ],
    codeSamples: [
      {
        label: "createSlice — state, reducers, and auto-generated actions (Immer-powered)",
        language: "ts",
        code: `// store/expenseSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Expense { id: number; category: string; amount: number; }
interface ExpenseState { items: Expense[]; filter: string; }

const initialState: ExpenseState = { items: [], filter: 'all' };

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    // Each key becomes BOTH a case reducer AND an action creator.
    addExpense(state, action: PayloadAction<Expense>) {
      state.items.push(action.payload); // Immer: mutation-looking, still immutable
    },
    removeExpense(state, action: PayloadAction<number>) {
      state.items = state.items.filter((e) => e.id !== action.payload);
    },
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
  },
});

// Action creators are generated for you — no action-type constants.
export const { addExpense, removeExpense, setFilter } = expenseSlice.actions;
export default expenseSlice.reducer;`,
      },
      {
        label: "configureStore + typed hooks + memoised selector",
        language: "ts",
        code: `// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import expenseReducer from './expenseSlice';

export const store = configureStore({
  reducer: { expenses: expenseReducer },
  // configureStore already adds thunk middleware, devtools, and dev checks.
});

// Derive types from the store, then export PRE-TYPED hooks.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Memoised, colocated selector for DERIVED data. Recomputes only when
// items or filter change, and returns a stable reference otherwise.
export const selectVisibleExpenses = createSelector(
  [(s: RootState) => s.expenses.items, (s: RootState) => s.expenses.filter],
  (items, filter) =>
    filter === 'all' ? items : items.filter((e) => e.category === filter),
);`,
      },
      {
        label: "createAsyncThunk — async side effects with pending/fulfilled/rejected",
        language: "ts",
        code: `import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User { id: number; name: string; }
interface UsersState { list: User[]; status: 'idle' | 'loading' | 'failed'; }

const initialState: UsersState = { list: [], status: 'idle' };

// Reducers are pure/sync, so the API call lives in a thunk.
export const fetchUsers = createAsyncThunk('users/fetch', async () => {
  const res = await fetch('/api/users');
  return (await res.json()) as User[];
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  // Handle the three auto-dispatched lifecycle actions.
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = 'idle';
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => { state.status = 'failed'; });
  },
});

export default usersSlice.reducer;`,
      },
      {
        label: "Wiring the Provider and consuming in a component",
        language: "tsx",
        code: `import { Provider } from 'react-redux';
import { store, useAppSelector, useAppDispatch, selectVisibleExpenses } from './store';
import { addExpense, removeExpense } from './store/expenseSlice';

// react-redux's <Provider> makes the store reachable by the hooks
// (internally it uses React Context to pass the store down).
export function App() {
  return (
    <Provider store={store}>
      <ExpenseList />
    </Provider>
  );
}

function ExpenseList() {
  // useSelector re-renders this component ONLY when the selected value changes.
  const items = useAppSelector(selectVisibleExpenses);
  const dispatch = useAppDispatch();

  return (
    <div>
      <button onClick={() => dispatch(addExpense({ id: Date.now(), category: 'food', amount: 12 }))}>
        Add
      </button>
      {items.map((e) => (
        <div key={e.id}>
          {e.category}: \${e.amount}
          <button onClick={() => dispatch(removeExpense(e.id))}>Delete</button>
        </div>
      ))}
    </div>
  );
}`,
      },
      {
        label: "RTK Query — server state with tag-based cache invalidation",
        language: "ts",
        code: `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface User { id: number; name: string; }

// createApi generates fully-typed hooks and manages the cache for you.
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: ['User'], // this cache entry is tagged 'User'
    }),
    addUser: builder.mutation<User, string>({
      query: (name) => ({ url: 'users', method: 'POST', body: { name } }),
      invalidatesTags: ['User'], // after adding, refetch anything tagged 'User'
    }),
  }),
});

// Auto-generated hooks: loading/error/caching handled for you.
export const { useGetUsersQuery, useAddUserMutation } = api;`,
      },
    ],
    interviewQA: [
      {
        question: "Describe the Redux data flow.",
        answer:
          "All shared state lives in one store. A component dispatches an action — a plain object describing what happened, like { type: 'cart/itemAdded', payload }. A pure reducer receives the current state and that action and returns a new state object, never mutating the old one. The store notifies subscribers, and components reading the changed slice via useSelector re-render. Because the only way to change state is dispatch → reducer → new state, the flow is strictly one-directional and every change is traceable, which is what enables devtools time-travel.",
      },
      {
        question: "What does Redux Toolkit improve over classic Redux?",
        answer:
          "Classic Redux required hand-writing action-type constants, action creators, switch-based reducers, and manual immutable updates. RTK's createSlice generates the action creators and reducer from a single definition, configureStore sets up the store with sensible middleware defaults (thunk, devtools, dev-time immutability and serializability checks), Immer lets reducers use mutating syntax while staying immutable, createAsyncThunk standardises async, createSelector memoises derived data, and RTK Query handles server state. Same predictable flow, far less boilerplate — which is why it is the official recommended approach.",
      },
      {
        question: "Why is it safe to write state.items.push() inside an RTK reducer?",
        answer:
          "Because createSlice runs reducers through Immer. Immer gives your reducer a draft proxy of the state; your mutations are recorded against the draft, and Immer produces a new immutable state from them. So the mutating syntax is ergonomic, but the actual store update is still immutable. The caveats: this only applies inside RTK reducers — never mutate state elsewhere — and you must not both mutate the draft and return a new value from the same reducer.",
      },
      {
        question: "How do useSelector and useDispatch work, and how does re-rendering compare to Context?",
        answer:
          "useSelector subscribes a component to the store and runs your selector; the component re-renders only when the selected value changes, by reference using strict equality by default. useDispatch returns the store's dispatch function so you can send actions, typically the auto-generated action creators. This is a fine-grained, selector-based subscription — a component reads exactly the slice it needs — whereas Context re-renders every consumer on any value change. That selector capability is the main scaling advantage of Redux over Context.",
      },
      {
        question: "How do you handle async logic in Redux Toolkit?",
        answer:
          "Reducers must be pure and synchronous, so side effects live in thunks. createAsyncThunk wraps an async function and automatically dispatches three lifecycle actions — pending, fulfilled, and rejected — which you handle in the slice's extraReducers using the builder callback to set loading, data, and error state. For server data specifically, RTK Query is preferred because it also handles caching, deduping, refetch, and cache invalidation rather than just fetching.",
      },
      {
        question: "What is a memoised selector and why use createSelector?",
        answer:
          "A selector reads a value out of state. createSelector builds a memoised selector from input selectors plus a compute function: it recomputes only when the inputs' results change and otherwise returns the exact same reference. That stable reference prevents unnecessary re-renders (useSelector sees an unchanged value) and avoids recomputing expensive derivations — like filtering or totalling a list — on every unrelated dispatch. Colocating selectors in the slice also keeps components from depending on the raw state shape.",
      },
      {
        question: "When would you choose Redux over Context, and when is Redux overkill?",
        answer:
          "Choose Redux Toolkit for complex, frequently-updated, cross-cutting client state with many updaters, when a big team benefits from a strict auditable one-way flow, or when devtools time-travel and middleware are genuinely useful. It is overkill for local UI state (useState), a couple of siblings (lift state), or a stable global value like theme or auth (Context). And server data belongs in RTK Query or TanStack Query, not hand-managed slices. RTK keeps the ceremony small, but it is not zero, so reach for it when the predictability and tooling pay for themselves.",
      },
      {
        question: "What is RTK Query and when do you use it?",
        answer:
          "RTK Query is a data-fetching and caching layer built into Redux Toolkit via createApi. You declare endpoints and it generates fully-typed hooks like useGetUsersQuery and useAddUserMutation that handle loading and error state, caching, request deduping, background refetch, and tag-based cache invalidation. Use it when you are already in the Redux ecosystem and need to manage server state, so you avoid hand-writing thunks and conflating server cache with client state — it plays the same role as TanStack Query.",
      },
    ],
    thingsToRemember: [
      "One store, changed only by dispatching actions into pure reducers; strictly one-way, fully traceable flow.",
      "Reducers stay pure and return new state; immutability powers change detection and time-travel.",
      "Redux Toolkit is the default; classic action-type/creator/switch boilerplate is obsolete.",
      "createSlice = name + initialState + reducers, and auto-generates a matching action creator per reducer.",
      "Immer lets reducers use mutating syntax while producing immutable updates — only inside RTK reducers.",
      "configureStore wires middleware and types; export pre-typed useAppSelector and useAppDispatch.",
      "useSelector gives fine-grained, per-slice subscriptions (unlike Context); useDispatch sends actions.",
      "createAsyncThunk = async side effects via pending/fulfilled/rejected handled in extraReducers.",
      "createSelector memoises derived data and returns a stable reference to avoid needless recompute/re-render.",
      "RTK Query owns server state (caching, refetch, tag invalidation); keep it out of hand-written slices.",
    ],
    references: [
      { label: "Redux Toolkit — Official docs", url: "https://redux-toolkit.js.org" },
      { label: "Redux Toolkit — Quick Start", url: "https://redux-toolkit.js.org/tutorials/quick-start" },
      { label: "Redux Toolkit — createAsyncThunk", url: "https://redux-toolkit.js.org/api/createAsyncThunk" },
      { label: "Redux Toolkit — RTK Query overview", url: "https://redux-toolkit.js.org/rtk-query/overview" },
      { label: "Redux — Redux Essentials tutorial", url: "https://redux.js.org/tutorials/essentials/part-1-overview-concepts" },
      { label: "React — Scaling Up with Reducer and Context", url: "https://react.dev/learn/scaling-up-with-reducer-and-context" },
    ],
    tags: ["redux", "redux-toolkit", "state-management", "immer", "store", "createSlice", "thunk", "selectors", "rtk-query"],
  },
  {
    id: "hoc-higher-order-components",
    num: 25,
    title: "HOC (Higher Order Components)",
    part: "State & Patterns",
    partId: "f",
    difficulty: "Core",
    summary:
      "Logic-reuse patterns in React compared head to head: Higher Order Components (what they are, how to write them correctly, the pitfalls), render props, and custom hooks — why hooks are the modern default, and where HOCs still legitimately appear.",
    readingTime: 14,
    explanation: [
      "**The underlying problem: reusing behaviour, not markup.** React makes reusing *UI* easy — you extract a component. The harder problem is reusing *behaviour*: an auth check that redirects, a loading spinner while data arrives, subscribing to a data source, logging, injecting props. Over React's history three patterns emerged to share this cross-cutting logic without copy-pasting it into every component: **Higher Order Components (HOCs)**, **render props**, and — since React 16.8 — **custom hooks**. Understanding all three, and why hooks won, is a classic interview theme.",
      "**What a Higher Order Component is.** An HOC is *a function that takes a component and returns a new component* with extra behaviour wrapped around it. The name mirrors 'higher-order function' (a function that takes/returns a function). The canonical shape is `const Enhanced = withSomething(Component)`. The HOC owns the shared logic once (auth, loading, data injection) and produces an augmented component; you never edit the wrapped component itself. Historic examples include Redux's `connect(mapState, mapDispatch)(Component)` and React Router's `withRouter`.",
      "**How an HOC works internally.** Inside, the HOC defines a new function component that runs the shared logic, then renders the wrapped component — usually forwarding the incoming props with the spread operator (`<Wrapped {...props} />`) and often *injecting* extra props. So `withAuth(Dashboard)` returns a component that reads the current user, redirects if there is none, and otherwise renders `<Dashboard {...props} />`. The wrapped component stays oblivious to the auth logic; it just receives props.",
      "**Writing HOCs correctly — the pitfalls that break them.** HOCs have well-known footguns. (1) **Always spread incoming props** through to the wrapped component, or you silently swallow props it needs. (2) **Do not create the HOC inside render** — `render() { return withAuth(Dashboard) }` produces a brand-new component type every render, which unmounts and remounts the whole subtree, destroying its state; create it once at module scope. (3) **Copy static methods** — the returned component does not automatically carry the wrapped component's statics (use `hoist-non-react-statics`). (4) **Set a meaningful `displayName`** (e.g. `withAuth(Dashboard)`) so React DevTools is readable. (5) **Forward refs** if callers need to reach the underlying DOM node/component (`React.forwardRef`).",
      "**Render props — the other classic pattern.** A render prop is a component that takes a *function* as a prop (often `children`) and calls it with the data it manages: `<Mouse>{({ x, y }) => <p>{x},{y}</p>}</Mouse>`. The `Mouse` component owns the behaviour (tracking the cursor) and hands the values to whatever the caller wants to render. It is more flexible than an HOC because the caller controls the output inline, but it produces deeply nested 'callback pyramids' when several are combined, and it litters the tree with wrapper components.",
      "**Custom hooks — the modern default.** A custom hook is just a function whose name starts with `use` and which calls other hooks. It extracts stateful logic into a reusable function *without adding any component to the tree*: `const { user } = useAuth();` or `const { data, loading } = useFetch(url);`. This is the key advantage — hooks share *logic*, whereas HOCs and render props share logic by wrapping *components*. Since React 16.8, custom hooks are the recommended way to reuse stateful behaviour, and most HOC/render-prop use cases are cleaner as hooks.",
      "**Why hooks beat HOCs and render props for new code.** Hooks add no wrapper components, so there is no 'wrapper hell' — the nesting of `<A><B><C>` providers/HOCs that makes the tree and DevTools unreadable. Prop sources are explicit: with an HOC you must trace which of several HOCs injected a given prop, whereas a hook's return value is right there at the call site. Hooks compose trivially — call several in one component — and they are far easier to type in TypeScript and to test in isolation. Render props avoid wrapper *types* but reintroduce nesting through callbacks; hooks avoid both problems.",
      "**Where HOCs and render props still legitimately appear.** HOCs are not dead. They remain the natural fit when you must wrap a component you do not control or need to alter what it *renders* (not just supply data) — cross-cutting concerns like error boundaries, feature flags, analytics wrappers, or third-party libraries whose public API is an HOC. Some libraries still ship `connect`-style HOCs. Render props survive in component libraries where the caller must control rendering (e.g. virtualised lists, headless UI components). But the default for your own reusable *logic* is a custom hook.",
      "**A note on composition philosophy.** All three patterns are expressions of React's core idea: composition over inheritance. React deliberately avoids class-inheritance-based reuse (mixins were removed for good reasons — name clashes, unclear dependencies). HOCs compose by wrapping, render props compose by delegating rendering, and hooks compose by calling. Hooks are the most direct form of composition because they operate on *logic* itself rather than on the component boundary.",
      "**The mental model (memorise this).** All three patterns exist to reuse cross-cutting *behaviour*, not markup. An HOC is a function that takes a component and returns an enhanced one (wrapping); a render prop passes a render function so the caller controls output (delegation); a custom hook is a `use`-prefixed function that shares logic with no wrapper at all (composition of logic). Prefer custom hooks for new code — no wrapper hell, explicit prop sources, trivial typing and testing — and reserve HOCs for wrapping components you do not own or altering what they render.",
    ],
    backendAnalogy:
      "HOCs are the frontend's decorator/proxy pattern: `withAuth(Dashboard)` wraps a target with a proxy that runs a cross-cutting concern (an auth check) before delegating to the wrapped implementation — exactly like a Spring AOP `@Around` advice or a servlet filter that intercepts a request, does its work, then passes control down the chain. Render props are the strategy/template-method pattern — the component runs the invariant algorithm and calls back into a caller-supplied strategy for the variable rendering step. Custom hooks are composition via dependency-free helper functions or injected collaborators: instead of subclassing or wrapping, a class simply calls the shared service it needs. The move from HOCs to hooks mirrors the move from inheritance/AOP-wrapping toward plain composition — the same reason 'favour composition over inheritance' is a bedrock Java design principle: wrappers stack into unreadable proxy chains (wrapper hell), while calling a collaborator keeps dependencies explicit at the call site.",
    keyInsights: [
      "HOCs, render props, and custom hooks all exist to reuse cross-cutting behaviour (auth, loading, data), not UI markup.",
      "An HOC is a function that takes a component and returns an enhanced component; it wraps logic around the original without editing it.",
      "HOCs work by rendering the wrapped component with props spread through and often extra props injected.",
      "HOC pitfalls: always spread props, never create the HOC inside render (it remounts and loses state), copy static methods, set displayName, and forward refs.",
      "A render prop passes a function (often children) that the component calls with its managed data, letting the caller control rendering.",
      "A custom hook is a use-prefixed function that shares logic WITHOUT adding a component to the tree — the key difference from HOCs and render props.",
      "Prefer custom hooks for new code: no wrapper hell, explicit prop sources, trivial composition, easier typing and testing.",
      "Render props avoid wrapper types but reintroduce nesting via callback pyramids; hooks avoid both.",
      "HOCs still fit when wrapping a component you do not control or altering what it renders (error boundaries, analytics, feature flags, some libraries).",
      "All three express composition over inheritance; hooks compose logic most directly, which is why mixins were abandoned.",
    ],
    codeSamples: [
      {
        label: "HOC done right — withAuth with spread props, displayName, and forwardRef",
        language: "tsx",
        code: `import React from 'react';

// An HOC: takes a component, returns an enhanced component.
function withAuth<P extends object>(Wrapped: React.ComponentType<P>) {
  // Define the new component ONCE at module scope — never inside render.
  const WithAuth = React.forwardRef<unknown, P>((props, ref) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    // Always spread incoming props through to the wrapped component.
    return <Wrapped {...(props as P)} ref={ref} />;
  });

  // Readable name in React DevTools: "withAuth(Dashboard)".
  WithAuth.displayName = \`withAuth(\${Wrapped.displayName || Wrapped.name || 'Component'})\`;
  return WithAuth;
}

// Usage: create the enhanced component once, then render it anywhere.
const ProtectedDashboard = withAuth(Dashboard);
// <ProtectedDashboard /> redirects to /login if there is no user.

declare function useAuth(): { user: unknown };
declare function Navigate(p: { to: string }): JSX.Element;
declare function Dashboard(p: object): JSX.Element;`,
      },
      {
        label: "The same behaviour as a render prop",
        language: "tsx",
        code: `import { useState, useEffect, ReactNode } from 'react';

// Render prop: the component owns the behaviour and calls children(data).
function MousePosition({ children }: { children: (pos: { x: number; y: number }) => ReactNode }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return <>{children(pos)}</>; // caller controls the rendering
}

// Usage — flexible, but note the nesting/callback pyramid when combined.
function App() {
  return (
    <MousePosition>
      {({ x, y }) => <p>Mouse at {x}, {y}</p>}
    </MousePosition>
  );
}`,
      },
      {
        label: "The modern default — the same logic as a custom hook (no wrapper)",
        language: "tsx",
        code: `import { useState, useEffect } from 'react';

// A custom hook: a use-prefixed function that shares LOGIC, adding no
// component to the tree. Prop sources are explicit at the call site.
function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return pos;
}

// Usage: no wrapper hell, trivially composable with other hooks.
function App() {
  const { x, y } = useMousePosition();
  return <p>Mouse at {x}, {y}</p>;
}`,
      },
      {
        label: "A withLoading HOC — a case that still fits HOCs (altering what renders)",
        language: "tsx",
        code: `import React from 'react';

// HOCs shine when you alter WHAT is rendered, not just inject data —
// here: short-circuit to a spinner while loading.
function withLoading<P extends object>(
  Wrapped: React.ComponentType<P>,
) {
  function WithLoading({ loading, ...rest }: P & { loading: boolean }) {
    if (loading) return <Spinner />;
    return <Wrapped {...(rest as P)} />;
  }
  WithLoading.displayName = \`withLoading(\${Wrapped.displayName || Wrapped.name || 'Component'})\`;
  return WithLoading;
}

const UserListWithLoading = withLoading(UserList);
// <UserListWithLoading loading={isLoading} users={users} />

declare function Spinner(): JSX.Element;
declare function UserList(p: { users: unknown[] }): JSX.Element;`,
      },
    ],
    interviewQA: [
      {
        question: "What is a Higher Order Component?",
        answer:
          "An HOC is a function that takes a component and returns a new component with extra behaviour wrapped around it — for example withAuth(Dashboard) returns a component that checks the user and redirects if unauthenticated before rendering Dashboard. It mirrors the idea of a higher-order function and lets you reuse cross-cutting logic without editing the wrapped component itself. Classic examples are Redux's connect and React Router's withRouter.",
      },
      {
        question: "HOCs vs render props vs custom hooks — which should you use today and why?",
        answer:
          "Prefer custom hooks for new code. A hook shares logic without adding any component to the tree, so there is no wrapper hell, prop sources are explicit at the call site, and hooks compose by simply being called and are easier to type and test. HOCs share logic by wrapping components, which adds nesting and hides where injected props come from. Render props avoid wrapper types but reintroduce nesting through callback pyramids. HOCs still matter for wrapping components you do not control or altering what they render, and render props still fit headless component libraries.",
      },
      {
        question: "What are the common pitfalls when writing HOCs?",
        answer:
          "Always spread incoming props to the wrapped component so it still receives them; never create the HOC inside render, because that produces a new component type each render and remounts the subtree, losing its state; copy static methods since the wrapper does not inherit them (hoist-non-react-statics); set a meaningful displayName like withAuth(Dashboard) for readable DevTools; forward refs with React.forwardRef if callers need the underlying node; and type the generic prop shape (P extends object) so injected props compose with the originals.",
      },
      {
        question: "How does a render prop work and what is its downside?",
        answer:
          "A render prop is a component that takes a function as a prop — often children — and calls it with the data it manages, letting the caller decide what to render: <Mouse>{({x,y}) => <p>{x},{y}</p>}</Mouse>. It is very flexible because rendering is controlled inline by the consumer. The downside is that combining several render-prop components produces deeply nested callback pyramids and clutters the tree with wrapper components, which is why custom hooks generally replaced it.",
      },
      {
        question: "What key advantage do custom hooks have over both HOCs and render props?",
        answer:
          "Custom hooks share stateful logic without adding a component to the render tree at all. HOCs and render props both reuse logic by wrapping or nesting components, which creates wrapper hell and obscures where props originate. A hook is just a function you call, so its return values are explicit at the call site, multiple hooks compose by being called together in one component, and there is no extra layer in the tree. That makes hooks easier to read, type, test, and combine.",
      },
      {
        question: "Are HOCs obsolete? When would you still reach for one?",
        answer:
          "They are no longer the default, but they are not obsolete. HOCs remain the right tool when you must wrap a component you do not control, or when you need to change what a component renders rather than just inject data — cross-cutting concerns like error boundaries, feature-flag gates, analytics wrappers, or libraries whose public API is an HOC such as connect. For sharing your own stateful logic, though, a custom hook is preferred.",
      },
      {
        question: "How do these patterns relate to composition over inheritance?",
        answer:
          "All three are React's answer to reuse without class inheritance, which React deliberately avoids — mixins were removed because they caused name clashes and unclear dependencies. HOCs compose by wrapping a component, render props compose by delegating the render step to a caller-supplied function, and hooks compose by calling shared logic directly. Hooks are the most direct form because they operate on logic itself rather than on the component boundary, which is why they became the recommended approach.",
      },
    ],
    thingsToRemember: [
      "HOCs, render props, and hooks all reuse cross-cutting behaviour, not markup.",
      "HOC = function that takes a component and returns an enhanced component (wrapping).",
      "HOCs render the wrapped component with props spread through, often injecting extra props.",
      "HOC footguns: spread props, never build the HOC in render, copy statics, set displayName, forward refs.",
      "Render prop = pass a function (often children) the component calls with its data; caller controls rendering.",
      "Custom hook = use-prefixed function sharing logic with NO wrapper component — the decisive advantage.",
      "Prefer hooks for new code: no wrapper hell, explicit prop sources, easy composition, typing, and testing.",
      "Render props avoid wrapper types but cause callback-pyramid nesting; hooks avoid both.",
      "Keep HOCs for wrapping components you do not own or altering what they render (error boundaries, analytics).",
      "All three favour composition over inheritance; hooks compose logic most directly (why mixins were dropped).",
    ],
    references: [
      { label: "React (legacy) — Higher-Order Components", url: "https://legacy.reactjs.org/docs/higher-order-components.html" },
      { label: "React (legacy) — Render Props", url: "https://legacy.reactjs.org/docs/render-props.html" },
      { label: "React — Reusing Logic with Custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks" },
      { label: "React — Rules of Hooks", url: "https://react.dev/reference/rules/rules-of-hooks" },
      { label: "MDN — React interactivity and events", url: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_interactivity_events_state" },
      { label: "Kent C. Dodds — When to NOT use render props", url: "https://kentcdodds.com/blog/when-to-not-use-render-props" },
    ],
    tags: ["react", "hoc", "patterns", "hooks", "render-props", "composition", "custom-hooks", "wrapper-hell"],
  },
];
