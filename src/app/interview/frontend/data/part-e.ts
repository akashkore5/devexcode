import type { FrontendTopic } from "../types";

export const partE: FrontendTopic[] = [
  {
    id: "hooks-overview",
    num: 18,
    title: "Hooks Overview",
    part: "Hooks",
    partId: "e",
    difficulty: "Core",
    summary: "Hooks add state and lifecycle to function components — governed by two strict rules.",
    readingTime: 4,
    explanation: [
      "Hooks add state and lifecycle capabilities to function components. Before hooks, only class components could hold state or respond to lifecycle events; hooks let plain functions own state (`useState`), run side effects (`useEffect`), and reuse stateful logic via custom hooks.",
      "Two critical rules govern every hook. First, **call hooks only at the top level** — never inside loops, conditions, or nested functions. React relies on a stable call order across renders to associate each hook with its state slot; conditional calls break that association.",
      "Second, **call hooks only from React function components or from other custom hooks** — not from regular JavaScript functions. The `eslint-plugin-react-hooks` package enforces both rules automatically, and you should treat its warnings as errors.",
    ],
    keyInsights: [
      "Rule of Hooks #1: call hooks only at the top level — never in loops, conditions, or nested functions, so React can match each call to its state by order.",
      "Rule of Hooks #2: call hooks only from React components or custom hooks, never from plain functions.",
      "Hooks unlocked state and lifecycle for function components, retiring most class-component patterns.",
      "Enable eslint-plugin-react-hooks (rules-of-hooks + exhaustive-deps) and treat its warnings as build errors.",
    ],
    codeSamples: [
      {
        label: "The two Rules of Hooks (conceptual)",
        language: "jsx",
        code: `// CORRECT: hooks at the top level, in a component
function Profile() {
  const [name, setName] = useState("");
  useEffect(() => { /* ... */ }, []);
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}

// WRONG: hook called conditionally — breaks call order
function Broken({ loggedIn }) {
  if (loggedIn) {
    const [name, setName] = useState(""); // never do this
  }
}`,
      },
    ],
    interviewQA: [
      {
        question: "What are the Rules of Hooks and why do they exist?",
        answer:
          "Two rules: (1) call hooks only at the top level — never in loops, conditions, or nested functions; (2) call hooks only from React function components or custom hooks. They exist because React tracks hook state by call order across renders. If a hook is skipped or reordered conditionally, React associates the wrong state with the wrong hook. The exhaustive-deps and rules-of-hooks ESLint rules enforce them.",
      },
      {
        question: "Why did hooks replace most class components?",
        answer:
          "Classes required spreading related logic across lifecycle methods (componentDidMount, componentDidUpdate, componentWillUnmount) and made stateful logic hard to reuse without HOCs or render props. Hooks let function components own state and effects, colocate related logic in a single effect with its cleanup, and extract reusable logic into custom hooks — with less boilerplate and no this binding.",
      },
      {
        question: "Can you call a hook inside a regular helper function?",
        answer:
          "No. Hooks may only be called from React function components or from other custom hooks (functions named use...). Calling a hook from a plain utility function violates Rule #2 and breaks React's ability to track hook state.",
      },
    ],
    thingsToRemember: [
      "Top level only: no hooks in loops, conditions, or nested functions.",
      "Only call hooks from components or custom hooks.",
      "Let eslint-plugin-react-hooks catch violations for you.",
    ],
    references: [
      { label: "React — Built-in hooks reference", url: "https://react.dev/reference/react/hooks" },
      { label: "React — Rules of Hooks", url: "https://react.dev/reference/rules/rules-of-hooks" },
    ],
    tags: ["react", "hooks", "rules-of-hooks", "state", "lifecycle"],
  },
  {
    id: "useeffect-and-dependency-arrays",
    num: 19,
    title: "useEffect & Dependency Arrays",
    part: "Hooks",
    partId: "e",
    difficulty: "Core",
    summary: "useEffect runs side effects after render; the dependency array controls when it re-runs.",
    readingTime: 6,
    explanation: [
      "`useEffect` runs side effects — data fetching, subscriptions, DOM manipulation — after the component renders. It is the most important hook to master after `useState`. The dependency array passed as the second argument controls **when** the effect re-runs.",
      "The canonical data-fetching pattern handles all three states (loading, error, success) and guards against stale updates with a `cancelled` flag. The cleanup function returned from the effect runs on unmount (and before each re-run), which is where you cancel in-flight work, unsubscribe, or tear down timers.",
      "The dependency array is the whole game. With `[]` the effect runs once on mount. With `[userId]` it runs on mount and whenever `userId` changes — ideal for refetching when a filter or parameter changes. Omitting the array entirely makes the effect run after every render, which is almost always a bug.",
      "Include every value the effect reads from component scope in the dependency array. The `react-hooks/exhaustive-deps` ESLint rule catches missing dependencies — never disable it, because missing deps cause stale closures where the effect captures outdated values.",
    ],
    keyInsights: [
      "The dependency array is the whole game: include every value the effect reads from component scope.",
      "[] runs once on mount; [dep] runs on mount and when dep changes; omitting the array runs every render (usually a bug).",
      "Return a cleanup function to cancel in-flight requests, unsubscribe, or clear timers — it runs on unmount and before each re-run.",
      "Never disable react-hooks/exhaustive-deps; missing deps cause stale closures with outdated captured values.",
    ],
    codeSamples: [
      {
        label: "useEffect: Data fetching with loading/error/success",
        language: "tsx",
        code: `import { useState, useEffect } from 'react';

function Expenses() {
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect — the canonical data fetching pattern
  useEffect(() => {
    let cancelled = false; // prevent stale updates
    async function fetchData() {
      try {
        const res = await fetch('/api/expenses');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!cancelled) setItems(data);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; }; // cleanup on unmount
  }, []); // [] = run once on mount

  // Always handle all 3 states
  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;
  return <ExpenseList items={items} />;
}`,
      },
      {
        label: "Dependency array: when the effect runs",
        language: "jsx",
        code: `// []          -> Once on mount        (initial data fetch, setup subscriptions)
// [userId]    -> Mount + when userId changes (refetch when a filter/param changes)
// (omitted)   -> Every render          (almost always a bug — avoid this)`,
      },
    ],
    interviewQA: [
      {
        question: "What does the useEffect dependency array control, and what do the three forms mean?",
        answer:
          "It controls when the effect re-runs by comparing each dependency to its previous value. An empty array [] runs the effect once on mount (good for initial fetch or subscription setup). An array like [userId] runs on mount and again whenever userId changes (good for refetching when a parameter changes). Omitting the array runs the effect after every render, which is almost always a bug.",
      },
      {
        question: "Why and when should useEffect return a cleanup function?",
        answer:
          "The cleanup function runs on unmount and before every re-run of the effect. Use it to unsubscribe from events, clear timers/intervals, close sockets, or set a cancelled flag so a resolving fetch does not call setState on an unmounted or stale component. Without cleanup you get memory leaks, duplicate subscriptions, and 'setState on unmounted component' warnings.",
      },
      {
        question: "What is a stale closure and how does the dependency array relate to it?",
        answer:
          "An effect (or callback) captures the variables that were in scope when it was created. If a value the effect reads is missing from the dependency array, the effect keeps running with the old captured value — a stale closure. Including every value the effect reads (as react-hooks/exhaustive-deps enforces) ensures the effect re-runs with fresh values.",
      },
      {
        question: "Why should you not disable react-hooks/exhaustive-deps?",
        answer:
          "Disabling it hides missing dependencies, which is the leading cause of stale-closure bugs and effects that silently use outdated state or props. If an effect genuinely should not re-run on a dependency, the correct fixes are restructuring (functional state updates, useReducer, refs, or moving logic out of the effect) — not suppressing the lint rule.",
      },
    ],
    thingsToRemember: [
      "Include every value the effect reads from scope in the deps array.",
      "Handle loading, error, and success; guard async updates with a cancelled flag.",
      "Return a cleanup function; never disable exhaustive-deps.",
    ],
    references: [
      { label: "React — Synchronizing with Effects", url: "https://react.dev/learn/synchronizing-with-effects" },
      { label: "React — Escape Hatches (effects, refs)", url: "https://react.dev/learn/escape-hatches" },
    ],
    tags: ["react", "hooks", "useeffect", "dependency-array", "data-fetching"],
  },
  {
    id: "useref-and-usememo",
    num: 20,
    title: "useRef & useMemo",
    part: "Hooks",
    partId: "e",
    difficulty: "Core",
    summary: "useRef persists values without re-rendering; useMemo caches expensive computations.",
    readingTime: 5,
    explanation: [
      "`useRef` persists a mutable value across renders **without** causing a re-render when it changes. Its most common use is holding a reference to a DOM node (for example to imperatively call `.focus()`), but it can also stash any mutable value you need to survive between renders.",
      "`useMemo` caches the result of an expensive computation and only recalculates when one of its dependencies changes. In the example, `total` and `approved` are recomputed only when `items` changes, avoiding repeating reduce/filter work on every render.",
      "Reach for `useMemo` when a computation is genuinely expensive or when you need a stable referential identity (for example a value passed to a memoized child or another hook's dependency array). For trivial calculations, the memoization overhead is not worth it.",
    ],
    backendAnalogy:
      "useRef is like a class field in Java — it persists across method calls (renders) without triggering re-execution. useMemo is like @Cacheable — it caches a computation and only recomputes when dependencies change.",
    keyInsights: [
      "useRef holds a mutable value across renders without triggering a re-render — ideal for DOM access (ref.current.focus()).",
      "useMemo caches an expensive computation and only recalculates when its dependencies change.",
      "Use useMemo for genuinely expensive work or stable referential identity, not for trivial calculations.",
    ],
    codeSamples: [
      {
        label: "useRef (DOM access) + useMemo (memoization)",
        language: "tsx",
        code: `import { useRef, useMemo } from 'react';

function ExpenseDashboard({ items }: { items: Expense[] }) {
  // useRef — persist a value across renders WITHOUT causing re-render
  const inputRef = useRef<HTMLInputElement>(null);
  const focusInput = () => inputRef.current?.focus();

  // useMemo — cache expensive computations
  // Only recalculates when 'items' changes
  const total = useMemo(
    () => items.reduce((sum, e) => sum + e.amount, 0),
    [items]
  );
  const approved = useMemo(
    () => items.filter(e => e.approved),
    [items]
  );

  return (
    <div>
      <input ref={inputRef} placeholder="Search..." />
      <button onClick={focusInput}>Focus Search</button>
      <p>Total: ₹{total.toFixed(2)}</p>
      <p>Approved: {approved.length} items</p>
    </div>
  );
}`,
      },
    ],
    interviewQA: [
      {
        question: "What is the difference between useRef and useState?",
        answer:
          "Both persist a value across renders, but updating a ref via ref.current = x does NOT trigger a re-render, whereas setState does. Use state for values that should be reflected in the UI; use refs for values that should survive renders without causing one — DOM node references, timer IDs, previous values, or any mutable instance variable.",
      },
      {
        question: "What problem does useMemo solve and when should you use it?",
        answer:
          "useMemo caches the result of a computation and only recomputes it when its dependencies change, avoiding repeated expensive work on every render. Use it for genuinely expensive computations (large reduces/filters/sorts) or to give a value a stable referential identity so memoized children or hook dependency arrays don't see a 'new' object every render. For cheap calculations the overhead isn't worth it.",
      },
      {
        question: "How do you imperatively focus an input with useRef?",
        answer:
          "Create a ref with useRef<HTMLInputElement>(null), attach it to the element via the ref prop, then call inputRef.current?.focus(). The optional chaining guards against the ref being null before the element mounts. This is the standard escape hatch for imperative DOM operations React doesn't model declaratively.",
      },
    ],
    thingsToRemember: [
      "Mutating ref.current does not re-render; setState does.",
      "useRef for DOM nodes and mutable instance values; useMemo for expensive computations.",
      "Memoize only when it pays off — expensive work or stable identity.",
    ],
    references: [
      { label: "React — useRef", url: "https://react.dev/reference/react/useRef" },
      { label: "React — useMemo", url: "https://react.dev/reference/react/useMemo" },
    ],
    tags: ["react", "hooks", "useref", "usememo", "memoization"],
  },
  {
    id: "custom-hooks",
    num: 21,
    title: "Custom Hooks",
    part: "Hooks",
    partId: "e",
    difficulty: "Core",
    summary: "Extract reusable stateful logic into use___ functions that can call other hooks.",
    readingTime: 5,
    explanation: [
      "Custom hooks extract reusable stateful logic into a function. By convention they are named `use___` so the linter can apply the Rules of Hooks to them, and they can call other hooks (`useState`, `useEffect`, even other custom hooks) internally. This is the React equivalent of extracting a utility class in Java.",
      "A custom hook lets you share **behaviour**, not state — each component that calls it gets its own independent copy of any state inside. For example `useExpenses(category)` encapsulates the fetch-with-loading/error pattern, and `useToggle()` packages a boolean and its toggler so any component can reuse them with a single line.",
      "Custom hooks return whatever shape is convenient — an object for named values (`{ items, loading, error }`) or a tuple for positional pairs (`[value, toggle] as const`, mirroring `useState`). The `as const` makes the tuple's element types precise so destructuring stays correctly typed.",
    ],
    backendAnalogy:
      "A custom hook is the React equivalent of extracting a utility class or a reusable service in Java — you pull shared, stateful logic out of components into a named, composable unit that the components depend on.",
    keyInsights: [
      "Custom hooks share stateful logic, not state — each caller gets its own independent state.",
      "Name them use___ so the Rules of Hooks apply, and call other hooks freely inside them.",
      "Return an object for named values or a tuple (as const) for positional pairs like useState.",
      "Extract a custom hook once a stateful pattern (fetch, toggle, subscription) is duplicated across components.",
    ],
    codeSamples: [
      {
        label: "Custom Hooks: Extracting reusable logic",
        language: "tsx",
        code: `// Custom hook: reusable data-fetching logic
function useExpenses(category?: string) {
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = category
      ? \`/api/expenses?category=\${category}\`
      : '/api/expenses';
    fetch(url)
      .then(r => r.json())
      .then(setItems)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [category]); // refetch when category changes

  return { items, loading, error };
}

// Custom hook: toggle state
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue(v => !v);
  return [value, toggle] as const;
}

// Usage — clean, reusable
function Dashboard() {
  const { items, loading, error } = useExpenses('meals');
  const [showFilters, toggleFilters] = useToggle();
  if (loading) return <Spinner />;
  // ...
}`,
      },
    ],
    interviewQA: [
      {
        question: "What is a custom hook and when should you create one?",
        answer:
          "A custom hook is a function named use... that encapsulates reusable stateful logic by calling other hooks internally. Create one when the same stateful pattern — data fetching, a toggle, a subscription, a form field, debouncing — appears in more than one component, or when a single component's logic is large enough that extracting it improves readability and testability.",
      },
      {
        question: "Do two components calling the same custom hook share state?",
        answer:
          "No. A custom hook shares logic, not state. Each component that calls it gets its own independent instances of any useState/useReducer/useRef inside. If you need components to share the same state value, you need a shared store or React Context, not a custom hook alone.",
      },
      {
        question: "Why must a custom hook's name start with 'use'?",
        answer:
          "The use prefix is how React's tooling identifies a function as a hook so the Rules of Hooks (and the exhaustive-deps lint rule) apply to it. Without the prefix, ESLint can't verify that hooks inside are called at the top level and only from valid call sites.",
      },
      {
        question: "When would you choose useMemo/useCallback inside a custom hook versus returning a tuple or object?",
        answer:
          "Return shape (object vs tuple) is about ergonomics — tuples mirror useState for positional destructuring, objects are clearer for many named values. useMemo/useCallback are about referential stability: wrap returned functions or derived objects in useCallback/useMemo when consumers pass them to dependency arrays or memoized children, so they don't see a new reference every render.",
      },
    ],
    thingsToRemember: [
      "Custom hooks reuse logic, not state — each caller gets its own.",
      "Name them use___ and freely compose other hooks inside.",
      "Return an object for named values or a tuple (as const) like useState.",
    ],
    references: [
      { label: "React — Reusing Logic with Custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks" },
      { label: "React — Built-in hooks reference", url: "https://react.dev/reference/react/hooks" },
    ],
    tags: ["react", "hooks", "custom-hooks", "reusability", "composition"],
  },
];
