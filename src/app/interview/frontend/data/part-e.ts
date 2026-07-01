import type { FrontendTopic } from "../types";

export const partE: FrontendTopic[] = [
  {
    id: "hooks-overview",
    num: 18,
    title: "Hooks Overview",
    part: "Hooks",
    partId: "e",
    difficulty: "Core",
    summary:
      "What hooks are, why they replaced classes, how React tracks them by call order, and the two Rules of Hooks that keep that tracking honest — the foundation every other hook builds on.",
    readingTime: 14,
    explanation: [
      "**What is a hook (start here).** A hook is a special function whose name starts with `use` that lets a plain function component *hook into* React features it otherwise couldn't touch — state that survives re-renders (`useState`), side effects tied to the render lifecycle (`useEffect`), memoized values (`useMemo`), refs (`useRef`), context (`useContext`), and more. Before hooks (React 16.8, early 2019), only class components could hold state or run lifecycle code. Hooks let a function — the simplest thing in JavaScript — own everything a class used to.",
      "**Why hooks replaced classes.** In class components, related logic was *scattered across lifecycle methods*: you'd set up a subscription in `componentDidMount`, update it in `componentDidUpdate`, and tear it down in `componentWillUnmount` — three methods for one concern, with unrelated concerns interleaved in each. Reusing stateful logic meant awkward Higher-Order Components or render props that produced 'wrapper hell'. And `this` binding was a perennial footgun. Hooks fix all three: related logic lives together in one effect (with its own cleanup), reusable logic extracts into a custom hook, and there is no `this`.",
      "**How React actually tracks hooks (the key mechanic).** React does not know the *names* of your hooks — it identifies each one purely by **call order**. On the first render of a component, React walks your hook calls top to bottom and allocates a slot for each: slot 0, slot 1, slot 2. On every subsequent render it walks them again *in the same order* and hands back the state stored in the matching slot. There is a per-component linked list of hook state, and the render pointer advances one node per hook call. This is why order must be identical every single render.",
      "**Rule #1 — call hooks only at the top level.** Never call a hook inside a loop, a condition, a nested function, or after an early `return`. If you wrap `useState` in an `if` that is true on render 1 and false on render 2, the slot indices shift: what was slot 1 becomes slot 0, and React hands the wrong state to the wrong hook — silently corrupting your component. Keeping every hook at the top level guarantees the call order is stable, so slot N always means the same hook.",
      "**Rule #2 — call hooks only from React functions.** Call hooks from React function components or from *other custom hooks* — never from plain utility functions, class methods, or event handlers. Only during React's render of a component is there an active 'current component' whose hook list can be advanced; outside that window there is no slot list to attach to, so the call is meaningless (and React throws 'Invalid hook call').",
      "**The naming convention is load-bearing.** The `use` prefix is not decoration — `eslint-plugin-react-hooks` uses it to decide *which functions to lint as hooks*. Name a hook `getUser` instead of `useUser` and the linter stops enforcing the Rules of Hooks inside it; name a normal function `useThing` and the linter will wrongly demand hook rules. Follow the convention exactly so tooling can protect you.",
      "**Enforce it with tooling, not discipline.** Install `eslint-plugin-react-hooks` and enable both rules: `rules-of-hooks` (catches conditional/looped/misplaced hook calls) and `exhaustive-deps` (catches missing dependency-array entries). Treat their warnings as build-breaking errors. Almost every subtle hook bug — stale closures, effects that never re-run, corrupted state — is something one of these two rules would have caught.",
      "**Hooks are just functions that compose.** Because a hook is an ordinary function that may call other hooks, you can build your own by combining the built-ins: a `useAuth` that reads context and subscribes to a store, a `useFetch` that pairs `useState` with `useEffect`. Composition is the whole point — the built-in hooks are Lego bricks, and custom hooks are the models you assemble from them (covered in depth in the Custom Hooks topic).",
      "**Common gotcha — conditional rendering is fine, conditional hooks are not.** You can absolutely render different UI based on a condition; you just cannot *call a hook* conditionally. If a hook only sometimes applies, always call it and put the condition *inside* the hook (e.g. pass `enabled` into the effect, or guard the effect body), rather than wrapping the `use...` call itself in an `if`.",
      "**The mental model (memorise this).** React tracks hooks by call order, not by name — think of a numbered row of lockers assigned on first render. Rule #1 (top level only) keeps the locker numbers stable across renders; Rule #2 (components/custom hooks only) guarantees there is a locker row to use at all. Keep the order identical every render, let ESLint police it, and every other hook behaves predictably.",
    ],
    backendAnalogy:
      "Hooks are like field injection in a Spring bean: the framework wires state and lifecycle into your component the way the container wires dependencies into a bean. The Rules of Hooks are like the contract that injection only works on container-managed beans — call `new MyService()` yourself (a plain function) and nothing is wired, exactly like calling a hook outside a component. React's call-order slot tracking is like an ordered @PostConstruct/@PreDestroy lifecycle registry: reorder or conditionally skip a step and the framework's bookkeeping desyncs. Custom hooks are the equivalent of extracting a reusable @Component/@Service that other beans depend on.",
    keyInsights: [
      "A hook is a use-prefixed function that lets a function component tap into React state and lifecycle; before hooks only classes could.",
      "React identifies each hook by call order (slot index), not by name, using a per-component linked list of state.",
      "Rule of Hooks #1: call hooks only at the top level - never in loops, conditions, nested functions, or after an early return.",
      "Rule of Hooks #2: call hooks only from React function components or from other custom hooks, never from plain functions.",
      "Conditional calls shift slot indices, so React hands the wrong state to the wrong hook and silently corrupts the component.",
      "The use prefix is how eslint-plugin-react-hooks decides what to lint as a hook - the naming convention is functional, not cosmetic.",
      "Hooks replaced classes because they colocate related logic, avoid this binding, and make stateful logic reusable without HOC wrapper hell.",
      "You can render conditionally, but never call a hook conditionally - move the condition inside the hook instead.",
      "Enable rules-of-hooks and exhaustive-deps and treat their warnings as errors; they catch nearly every subtle hook bug.",
      "Hooks compose: a custom hook is just a function that calls other hooks, so the built-ins are building blocks.",
    ],
    codeSamples: [
      {
        label: "The two Rules of Hooks (correct vs wrong)",
        language: "jsx",
        code: `// CORRECT: every hook at the top level of a component, same order each render
function Profile({ userId }) {
  const [name, setName] = useState("");      // slot 0
  const [age, setAge] = useState(0);         // slot 1
  useEffect(() => { /* ... */ }, [userId]);  // slot 2
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}

// WRONG #1: hook inside a condition - slot indices shift between renders
function Broken({ loggedIn }) {
  if (loggedIn) {
    const [name, setName] = useState(""); // NEVER: sometimes slot 0, sometimes skipped
  }
  const [count, setCount] = useState(0);  // its slot changes when loggedIn flips -> corrupt
}

// FIX: always call the hook, put the condition INSIDE
function Fixed({ loggedIn }) {
  const [name, setName] = useState("");           // always slot 0
  const displayName = loggedIn ? name : "guest";  // condition lives in normal code
  return <span>{displayName}</span>;
}`,
      },
      {
        label: "Rule #2: hooks only from components or custom hooks",
        language: "jsx",
        code: `// WRONG: calling a hook from a plain helper function
function formatUser() {
  const [x] = useState(0); // Invalid hook call - there is no current component
  return x;
}

// CORRECT: a custom hook (use-prefixed) may call other hooks
function useUser(id) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/users/" + id)
      .then((r) => r.json())
      .then((u) => { if (!cancelled) setUser(u); });
    return () => { cancelled = true; };
  }, [id]);
  return user; // components consume this like any built-in hook
}`,
      },
      {
        label: "Same pattern: class component vs hooks",
        language: "tsx",
        code: `// BEFORE: logic scattered across three lifecycle methods, plus 'this' binding
class Clock extends React.Component<{}, { now: Date }> {
  timer?: number;
  state = { now: new Date() };
  componentDidMount() { this.timer = window.setInterval(this.tick, 1000); }
  componentWillUnmount() { clearInterval(this.timer); } // teardown lives far away
  tick = () => this.setState({ now: new Date() });      // arrow to bind 'this'
  render() { return <span>{this.state.now.toLocaleTimeString()}</span>; }
}

// AFTER: one effect colocates setup + teardown, no 'this', no scatter
function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer); // cleanup sits next to setup
  }, []);
  return <span>{now.toLocaleTimeString()}</span>;
}`,
      },
      {
        label: "Recommended ESLint config for hooks",
        language: "json",
        code: `{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error"
  }
}`,
      },
    ],
    runnable: {
      title: "Why call order matters: simulating hook slot tracking in plain JS",
      js: `// A tiny model of how React associates state with hooks by CALL ORDER.
let slots = [];      // the per-component state list
let cursor = 0;      // advances one step per hook call, reset each render

function useState(initial) {
  const i = cursor++;                       // this hook's slot = its call index
  if (slots[i] === undefined) slots[i] = initial;
  const setState = (v) => { slots[i] = v; };
  return [slots[i], setState];
}

function render(conditional) {
  cursor = 0; // React resets the cursor before every render
  const [name, setName] = useState("Ada");
  // BUG: calling a hook conditionally shifts every later slot index
  if (conditional) { useState("only-sometimes"); }
  const [count, setCount] = useState(0);
  console.log("name =", name, "| count =", count);
  return { setName, setCount };
}

console.log("Render 1 (stable order):");
render(false); // name = Ada | count = 0  -> correct

console.log("Render 2 (conditional hook sneaks in):");
render(true);  // count now reads the WRONG slot -> corruption
// Lesson: keep hook call order identical every render.`,
    },
    interviewQA: [
      {
        question: "What are the Rules of Hooks and why do they exist?",
        answer:
          "Two rules: (1) call hooks only at the top level - never in loops, conditions, nested functions, or after an early return; (2) call hooks only from React function components or from other custom hooks. They exist because React tracks hook state purely by call order (slot index), not by name. If a hook is skipped or reordered conditionally, the slot indices shift and React hands the wrong state to the wrong hook. The rules-of-hooks and exhaustive-deps ESLint rules enforce them.",
      },
      {
        question: "How does React know which state belongs to which hook?",
        answer:
          "By call order. On first render React allocates a slot for each hook call in sequence (slot 0, 1, 2...) and stores them in a per-component linked list. On every later render it walks the same calls in the same order and returns the state from the matching slot. It never uses the hook's name or variable name - only its position. That is exactly why the call order must be identical on every render.",
      },
      {
        question: "Why did hooks replace most class components?",
        answer:
          "Classes scattered one concern across componentDidMount/componentDidUpdate/componentWillUnmount, made stateful logic hard to reuse without HOCs or render props (wrapper hell), and required this binding. Hooks colocate related logic in a single effect with its own cleanup, extract reusable logic into custom hooks, and eliminate this - with far less boilerplate.",
      },
      {
        question: "Can you call a hook inside a regular helper function or an event handler?",
        answer:
          "No. Hooks may only run during a component's render, called from the component body or from another custom hook (a use-prefixed function). A plain helper or an event handler runs outside render, where there is no current component whose hook slot list can be advanced, so React throws an 'Invalid hook call' error.",
      },
      {
        question: "Why must a hook's name start with 'use'?",
        answer:
          "The use prefix is how eslint-plugin-react-hooks identifies a function as a hook so it can enforce the Rules of Hooks and exhaustive-deps inside it. It is a functional convention, not cosmetic: rename a hook without the prefix and the linter stops protecting it; name a normal function useXyz and the linter wrongly applies hook rules.",
      },
      {
        question: "You need a hook only in some cases. How do you handle that within the rules?",
        answer:
          "Never wrap the hook call in a condition. Always call the hook and move the condition inside it - for example pass an 'enabled' flag into a custom hook or guard the effect body with an if. You can render conditionally; you just cannot call hooks conditionally.",
      },
      {
        question: "What does eslint-plugin-react-hooks give you and how should you treat it?",
        answer:
          "Two rules: rules-of-hooks flags hooks called in loops, conditions, nested functions, or from invalid sites; exhaustive-deps flags missing dependency-array entries that cause stale closures. Treat both as errors. Nearly every subtle hook bug is one these rules would have caught, so suppressing them almost always hides a real defect.",
      },
    ],
    thingsToRemember: [
      "React tracks hooks by call order (slot index), never by name.",
      "Rule #1: hooks only at the top level - no loops, conditions, nested functions, or after early return.",
      "Rule #2: call hooks only from components or other custom hooks.",
      "Conditional hook calls shift slots and silently corrupt state.",
      "Render conditionally if you like, but never call a hook conditionally.",
      "The use prefix is what makes the linter treat a function as a hook.",
      "Enable rules-of-hooks and exhaustive-deps and treat them as errors.",
      "Hooks colocate logic, drop this binding, and make stateful logic reusable.",
      "A custom hook is just a function that composes other hooks.",
      "Let ESLint enforce the rules for you instead of relying on discipline.",
    ],
    references: [
      { label: "React - Built-in hooks reference", url: "https://react.dev/reference/react/hooks" },
      { label: "React - Rules of Hooks", url: "https://react.dev/reference/rules/rules-of-hooks" },
      { label: "React - Reusing Logic with Custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks" },
      { label: "React - State: A Component's Memory", url: "https://react.dev/learn/state-a-components-memory" },
      { label: "MDN - Closures", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures" },
    ],
    tags: ["react", "hooks", "rules-of-hooks", "state", "lifecycle", "call-order", "eslint"],
  },
  {
    id: "useeffect-and-dependency-arrays",
    num: 19,
    title: "useEffect & Dependency Arrays",
    part: "Hooks",
    partId: "e",
    difficulty: "Core",
    summary:
      "How useEffect synchronizes a component with the outside world after render, exactly what the dependency array does, why cleanup functions exist, and how stale closures and missing deps produce the most common React bugs.",
    readingTime: 17,
    explanation: [
      "**What an effect is for (start here).** `useEffect` is React's escape hatch for **synchronizing your component with something outside React** — a network request, a browser API, a subscription, a timer, a non-React widget. Rendering must be pure (no side effects), so React defers your effect until *after* it has committed the render to the DOM and the browser has painted. The mental frame is not 'run this on mount' but 'keep this external thing in sync with my current props/state.'",
      "**The signature and the three ways it runs.** `useEffect(setup, deps?)` takes a setup function that may return a cleanup function, plus an optional dependency array. There are exactly three forms: with `[]` the effect runs once after the first render; with `[a, b]` it runs after the first render and again after any render where `a` or `b` changed; with *no array at all* it runs after **every** render — which is almost always a bug and a common cause of infinite loops when the effect also sets state.",
      "**How dependencies are compared.** After each render React compares every entry in the deps array to its value from the previous render using `Object.is` (reference equality for objects/functions, value equality for primitives). If any entry differs, React first runs the previous effect's cleanup, then runs setup again. This is why an inline object or function in the deps array — `{}` or `() => {}` recreated every render — makes the effect re-run every time: a fresh reference is never `Object.is`-equal to the old one.",
      "**Cleanup is the other half of an effect.** The function you return from setup is the **cleanup**: React runs it before re-running the effect (with new deps) and once more when the component unmounts. Its job is to undo what setup did — unsubscribe listeners, `clearInterval`/`clearTimeout`, close a WebSocket, abort an in-flight fetch, or flip a `cancelled` flag. Every subscription, timer, or listener you create in an effect must be torn down in cleanup, or you leak memory and stack up duplicate handlers.",
      "**The canonical data-fetching pattern.** Fetch inside the effect, track loading/error/success in state, and guard against **race conditions** with a `cancelled` flag (or an `AbortController`). Without the guard, a fast filter change can fire request B, then request A resolves last and overwrites B's fresh data with stale results — a classic out-of-order bug. The cleanup sets `cancelled = true` so a late-resolving response is ignored. Note: in real apps prefer a data library (React Query, SWR) that handles caching, dedup, and races for you; the manual pattern is what those libraries encapsulate.",
      "**Stale closures — the deepest gotcha.** An effect (like every function) is a **closure**: it captures the variables that were in scope *when it was created*. If a value the effect reads is missing from the deps array, the effect is not re-created when that value changes, so it keeps using the **stale** value it captured on an earlier render. A `setInterval` that reads `count` with `[]` deps will forever log the initial `count` of 0, because the interval callback closed over the first render's `count`. The fix is either to add the dependency or to use a functional state update that does not read the stale value.",
      "**Why exhaustive-deps exists and why you must not silence it.** The `react-hooks/exhaustive-deps` lint rule statically finds every reactive value the effect reads and demands it be in the deps array. Silencing it with a comment is the number-one source of stale-closure bugs. When an effect genuinely should not re-run on some value, the correct fixes are: use the functional updater `setX(prev => ...)`, move the value into a `useRef`, wrap a callback in `useCallback` / a value in `useMemo` so its identity is stable, extract a `useReducer`, or move the logic out of the effect entirely — never suppress the rule.",
      "**Effects run after paint; layout effects run before it.** `useEffect` fires asynchronously *after* the browser paints, so it never blocks visual updates — right for most work. When you must read layout (measure a DOM node) and synchronously re-render before the user sees a flicker, use `useLayoutEffect`, which runs *before* paint. Reach for it only when a visible flash would otherwise occur; overusing it blocks painting and hurts performance.",
      "**Effects double-run in development (Strict Mode).** In React 18+ Strict Mode, React intentionally mounts, unmounts, and remounts each component in development, so every effect runs setup → cleanup → setup once extra. This is a *feature*: it surfaces effects that are not idempotent or that forget cleanup. If your effect breaks under the double-invoke, it has a real bug (usually missing cleanup). Production runs the effect once.",
      "**Not everything belongs in an effect.** A frequent anti-pattern is using an effect to transform props/state into more state ('when items change, setFilteredItems'). That derived value should just be computed during render (optionally memoized) — no effect needed. Effects are for *external* synchronization, not for reacting to your own state. Event-specific logic (what to do on a click) belongs in the event handler, not an effect that watches a flag.",
      "**The mental model (memorise this).** An effect is a synchronization: 'given these dependencies, keep this external thing in sync, and here is how to clean it up.' The deps array is the list of values that, when changed, mean re-sync (cleanup then setup). Include every reactive value the effect reads (let exhaustive-deps enforce it), always clean up subscriptions/timers/requests, remember effects fire after paint and double-run in dev, and don't use an effect for data you could just compute during render.",
    ],
    backendAnalogy:
      "useEffect is like a Spring bean's lifecycle glue: setup is @PostConstruct / a Vert.x verticle's start() where you open connections and register consumers, and the returned cleanup is @PreDestroy / stop() where you close them - forget it and you leak connections and stack up duplicate listeners, exactly like a leaked event-bus consumer. The dependency array is like a cache key or the parameters of a @Scheduled/reactive subscription: change the key and the subscription is torn down and re-established with the new inputs. A stale closure is the classic bug of capturing an old config object in a lambda instead of re-reading it, and the cancelled flag / AbortController is the same defensive pattern as cancelling a stale Future so a slow response can't overwrite a newer one.",
    keyInsights: [
      "An effect synchronizes a component with the outside world (fetch, subscription, timer, DOM API) and runs after React commits and the browser paints.",
      "Three forms: [] runs once after mount; [deps] runs after mount and whenever a dep changes; no array runs after every render (usually a bug).",
      "React compares deps with Object.is, so inline objects/functions get a fresh reference each render and make the effect re-run every time.",
      "The returned cleanup runs before each re-run and on unmount - use it to unsubscribe, clear timers, abort requests, or flip a cancelled flag.",
      "A stale closure is an effect using values it captured on an earlier render because those values are missing from the deps array.",
      "Never disable exhaustive-deps; fix the root cause with functional updates, refs, useCallback/useMemo, useReducer, or restructuring.",
      "Guard async fetches against race conditions with a cancelled flag or AbortController so a late response can't overwrite fresher data.",
      "useEffect runs after paint; useLayoutEffect runs before paint - use the latter only to prevent a visible flicker when measuring layout.",
      "React 18 Strict Mode double-invokes effects in development to surface missing cleanup and non-idempotent setup; production runs once.",
      "Don't use effects to derive state from props/state - compute that during render; put click-specific logic in event handlers.",
    ],
    codeSamples: [
      {
        label: "Canonical data fetching with race-condition guard",
        language: "tsx",
        code: `import { useState, useEffect } from 'react';

function Expenses({ userId }: { userId: string }) {
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;                 // guards against out-of-order responses
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        const res = await fetch('/api/expenses?user=' + userId, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!cancelled) setItems(data);    // only the latest request wins
      } catch (err) {
        if (!cancelled && (err as Error).name !== 'AbortError') {
          setError((err as Error).message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();

    return () => {                         // cleanup: runs before re-run + on unmount
      cancelled = true;
      controller.abort();
    };
  }, [userId]);                            // re-fetch whenever userId changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <ExpenseList items={items} />;
}`,
      },
      {
        label: "Dependency array: the three forms",
        language: "jsx",
        code: `// []          -> runs ONCE after mount        (initial fetch, one-time setup)
useEffect(() => { setup(); }, []);

// [userId]    -> after mount + whenever userId changes (re-sync on param change)
useEffect(() => { refetch(userId); }, [userId]);

// (no array)  -> after EVERY render         (almost always a bug; can infinite-loop
//                                            if the effect also calls setState)
useEffect(() => { doThing(); });

// PITFALL: an inline object/function is a NEW reference every render, so this
// effect re-runs every render even though "options" looks constant:
const options = { limit: 10 };            // fresh object each render
useEffect(() => { load(options); }, [options]); // never Object.is-equal -> re-runs
// Fix: useMemo the object, hoist it out, or depend on primitive fields.`,
      },
      {
        label: "Stale closure bug and its two fixes",
        language: "tsx",
        code: `// BUG: interval captures count from the FIRST render (deps = []).
// It logs 0 forever because the callback closed over the initial count.
function BrokenCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => console.log(count), 1000); // stale 'count'
    return () => clearInterval(id);
  }, []); // exhaustive-deps warns: missing 'count'
  return <button onClick={() => setCount(c => c + 1)}>+</button>;
}

// FIX A: use a functional update so you never read the stale value.
function FixedWithUpdater() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount(c => c + 1), 1000); // always fresh
    return () => clearInterval(id);
  }, []); // no reactive value read -> honestly empty
  return <p>{count}</p>;
}

// FIX B: add the dependency so the effect re-subscribes with a fresh closure.
function FixedWithDep({ onTick }: { onTick: (n: number) => void }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => onTick(count), 1000);
    return () => clearInterval(id);
  }, [count, onTick]); // re-created whenever count/onTick change
  return <p>{count}</p>;
}`,
      },
      {
        label: "Subscription cleanup + anti-pattern (derived state)",
        language: "tsx",
        code: `// GOOD: subscribe in setup, unsubscribe in cleanup.
function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {                         // tear down BOTH listeners
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

// ANTI-PATTERN: an effect that only derives state from props -> just compute it.
function List({ items, query }: { items: Item[]; query: string }) {
  // DON'T: const [filtered, setFiltered] = useState([]);
  //        useEffect(() => setFiltered(items.filter(...)), [items, query]);
  // DO: derive during render (memoize only if the filter is expensive).
  const filtered = items.filter(i => i.name.includes(query));
  return <ul>{filtered.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}`,
      },
    ],
    runnable: {
      title: "Stale closure vs functional update (plain JS timers)",
      js: `// Demonstrates the SAME stale-closure trap useEffect hits, in vanilla JS.
// A closure captures the variable value at creation time.

let count = 0;

// BAD: this callback closed over 'count' and re-reads the SAME outer variable,
// but if we had captured a snapshot it would be stale. Here we log a stale copy.
const staleSnapshot = count;               // captured now = 0
setTimeout(() => {
  console.log("stale snapshot (captured at setup):", staleSnapshot); // 0
}, 50);

// GOOD: a functional update always works from the latest value, never a snapshot.
function increment(fn) { count = fn(count); }
increment(c => c + 1);
increment(c => c + 1);
increment(c => c + 1);

setTimeout(() => {
  console.log("latest count via functional updates:", count); // 3
  console.log("Lesson: read the freshest value, or add it to the deps array.");
}, 100);`,
    },
    interviewQA: [
      {
        question: "What does the useEffect dependency array control, and what do the three forms mean?",
        answer:
          "It controls when the effect re-runs by comparing each dependency to its previous value with Object.is. An empty array [] runs the effect once after mount. An array like [userId] runs after mount and again whenever userId changes. Omitting the array entirely runs the effect after every render, which is almost always a bug and can cause an infinite loop if the effect also sets state.",
      },
      {
        question: "Why and when should useEffect return a cleanup function?",
        answer:
          "The cleanup runs before every re-run of the effect and once on unmount. Use it to undo setup: unsubscribe from events, clear timers/intervals, close sockets, abort in-flight requests, or set a cancelled flag so a resolving fetch doesn't call setState with stale data. Without cleanup you leak memory, accumulate duplicate subscriptions, and hit out-of-order update bugs.",
      },
      {
        question: "What is a stale closure and how does the dependency array cause it?",
        answer:
          "An effect is a closure that captures the variables in scope when it was created. If a value the effect reads is missing from the deps array, the effect isn't recreated when that value changes, so it keeps using the old captured value. Classic example: a setInterval reading count with [] deps logs the initial count forever. Fix by adding the dependency or using a functional state update that doesn't read the stale value.",
      },
      {
        question: "Why should you never disable react-hooks/exhaustive-deps?",
        answer:
          "It hides missing dependencies, the leading cause of stale-closure bugs. If an effect genuinely shouldn't re-run on a value, the correct fixes are functional updates setX(prev => ...), moving the value into a ref, stabilizing identity with useCallback/useMemo, extracting a useReducer, or restructuring - not suppressing the rule, which just masks a real defect.",
      },
      {
        question: "How do you prevent a race condition when fetching in an effect?",
        answer:
          "Use a cancelled flag (or an AbortController) set to true in the cleanup, and check it before calling setState. If a fast prop change fires request B and request A resolves last, the guard ensures the stale response A is ignored and only the latest request updates state. AbortController additionally cancels the in-flight network request.",
      },
      {
        question: "What's the difference between useEffect and useLayoutEffect?",
        answer:
          "useEffect runs asynchronously after the browser paints, so it never blocks visual updates - the default for data fetching, subscriptions, and most side effects. useLayoutEffect runs synchronously after DOM mutations but before paint, letting you measure layout and re-render without a visible flicker. Use it only when you'd otherwise see a flash, since it blocks painting.",
      },
      {
        question: "Why do effects run twice in development and should you fix that?",
        answer:
          "React 18+ Strict Mode intentionally mounts, unmounts, and remounts components in development, so setup runs, cleanup runs, then setup runs again. It's a diagnostic to surface effects that lack cleanup or aren't idempotent. If your effect misbehaves under the double-invoke, it has a real bug - usually missing cleanup. Production runs the effect once.",
      },
      {
        question: "When should logic NOT go in an effect?",
        answer:
          "Don't use an effect to derive state from other props/state - compute that value during render (memoize only if expensive) instead of storing it and syncing with an effect. Don't put event-specific logic in an effect that watches a flag; put it in the event handler. Effects are for synchronizing with external systems, not for reacting to your own component's state.",
      },
    ],
    thingsToRemember: [
      "An effect keeps the component in sync with something external; it runs after paint.",
      "[] = once after mount; [deps] = after mount + when a dep changes; no array = every render (bug).",
      "React compares deps with Object.is, so inline objects/functions re-run the effect every render.",
      "Always return cleanup for subscriptions, timers, sockets, and in-flight requests.",
      "Missing deps cause stale closures; include every reactive value the effect reads.",
      "Never silence exhaustive-deps - fix with functional updates, refs, useCallback/useMemo, or useReducer.",
      "Guard async fetches with a cancelled flag or AbortController against races.",
      "useLayoutEffect runs before paint; use it only to avoid a visible flicker.",
      "Strict Mode double-invokes effects in dev to expose missing cleanup.",
      "Derive state during render; don't use an effect to copy props/state into state.",
    ],
    references: [
      { label: "React - Synchronizing with Effects", url: "https://react.dev/learn/synchronizing-with-effects" },
      { label: "React - You Might Not Need an Effect", url: "https://react.dev/learn/you-might-not-need-an-effect" },
      { label: "React - useEffect reference", url: "https://react.dev/reference/react/useEffect" },
      { label: "React - Removing Effect Dependencies", url: "https://react.dev/learn/removing-effect-dependencies" },
      { label: "MDN - AbortController", url: "https://developer.mozilla.org/en-US/docs/Web/API/AbortController" },
      { label: "MDN - Closures", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures" },
    ],
    tags: ["react", "hooks", "useeffect", "dependency-array", "cleanup", "stale-closure", "data-fetching", "race-condition"],
  },
  {
    id: "useref-and-usememo",
    num: 20,
    title: "useRef, useMemo & useCallback",
    part: "Hooks",
    partId: "e",
    difficulty: "Core",
    summary:
      "The three hooks that don't cause re-renders: useRef for mutable values and DOM access, useMemo for caching expensive values, and useCallback for stable function identity — plus when memoization actually pays off and when it's just noise.",
    readingTime: 15,
    explanation: [
      "**One family, three jobs (start here).** `useRef`, `useMemo`, and `useCallback` share a theme: they let a component *remember* something across renders **without** triggering a re-render themselves. `useRef` remembers a mutable box; `useMemo` remembers a computed value; `useCallback` remembers a function. Understanding when each pays off — and when it's pointless ceremony — is a common interview differentiator.",
      "**useRef is a mutable box that survives renders.** `useRef(initial)` returns an object `{ current: initial }` that persists for the component's whole life. Two properties make it special: mutating `ref.current` does **not** cause a re-render, and the same object identity is preserved across every render. Use it for values that must outlive a render but shouldn't drive the UI: a DOM node, a timer id, the previous value of a prop, a mutable instance flag, or a `cancelled` guard.",
      "**The most common ref use: reaching a DOM node.** Attach a ref to an element via the `ref` prop, and after commit `ref.current` points at the real DOM node so you can call imperative APIs React doesn't model declaratively — `.focus()`, `.scrollIntoView()`, `.play()`, measuring `getBoundingClientRect()`. Guard with optional chaining (`inputRef.current?.focus()`) because the ref is `null` before the element mounts and after it unmounts.",
      "**Ref vs state — the decision rule.** Both persist across renders, but state updates re-render and are shown in the UI; ref mutations are silent and are not. If changing the value should update what the user sees, use state. If the value is bookkeeping the render doesn't depend on (interval ids, the latest callback, a 'did we already run this' flag), use a ref. A useful tell: if you find yourself writing `ref.current` *and* reading it in JSX to display it, you probably wanted state.",
      "**useMemo caches a computed value.** `useMemo(() => compute(a, b), [a, b])` runs `compute` on the first render, caches the result, and returns the cached value on later renders until a dependency changes (compared with `Object.is`). It buys you two distinct things: (1) skipping genuinely expensive work (a large sort/filter/reduce) on every render, and (2) **referential stability** — returning the *same object/array reference* so a memoized child or an effect's deps array doesn't see a 'new' value every render.",
      "**useCallback caches a function's identity.** `useCallback(fn, deps)` is exactly `useMemo(() => fn, deps)` — it returns the same function reference until a dependency changes. Functions are recreated on every render, so passing an inline handler to a `React.memo` child, or listing it in an effect's deps, defeats memoization / re-runs the effect. `useCallback` stabilizes that identity so the optimization holds. On its own, wrapping a handler passed only to a plain DOM element does nothing useful.",
      "**Memoization is not free — the cost/benefit rule.** `useMemo`/`useCallback` add memory (storing the cached value and deps) and a comparison on every render. For a cheap computation like `a + b` or `items.length`, that overhead exceeds the savings — don't memoize it. Reach for them when the computation is measurably expensive, or when a value/function needs a stable identity to make a *downstream* optimization (`React.memo`, an effect dep) actually work. Memoizing 'just in case' clutters code and can even slow things slightly.",
      "**Referential identity is the real reason most memos exist.** In React, `{}` !== `{}` and `() => {}` !== `() => {}`. A parent that re-renders passes brand-new object and function props to its children every time; a `React.memo` child then re-renders anyway because its props changed by reference. Wrapping those props in `useMemo`/`useCallback` keeps their identity stable so `React.memo` can actually bail out. This identity concern is also why inline objects/functions in dependency arrays cause effects to re-run — the same root cause.",
      "**Refs for the latest value (advanced pattern).** A common way to avoid stale closures without re-subscribing an effect is a 'latest ref': keep `ref.current` updated to the newest callback/value in a tiny effect, and read `ref.current` inside a long-lived subscription. The subscription stays stable (empty deps) yet always calls the freshest function. This is the manual version of what `useEffectEvent` (experimental) aims to formalize.",
      "**Common gotchas.** Don't read or write `ref.current` *during* render — mutations belong in effects or event handlers, because render must be pure. Don't overuse `useMemo`/`useCallback` — measure first. Remember `useMemo` may still recompute: React can discard the cache under memory pressure, so never rely on it for correctness (side effects belong in effects, not memos). And `useRef`'s initial argument is only used on the first render — passing a fresh `new Foo()` each render still allocates it every render even though it's ignored (use lazy init if that matters).",
      "**The mental model (memorise this).** Three hooks, zero re-renders: `useRef` = a mutable box whose changes are invisible to rendering (DOM nodes, timer ids, latest-value stash); `useMemo` = cache this *value*, recompute only when deps change; `useCallback` = cache this *function's identity*. Use state, not a ref, when the UI depends on the value. Memoize only for expensive work or to preserve referential identity that a downstream `React.memo` or effect dep relies on — otherwise it's just noise.",
    ],
    backendAnalogy:
      "useRef is like a private mutable field on a singleton bean - it persists across method calls (renders) and mutating it doesn't trigger any framework lifecycle, unlike a state field that fires change events. useMemo is @Cacheable: cache the result of an expensive method keyed by its arguments (the deps) and recompute only on a key change; it's advisory, so like a cache that may be evicted, you never depend on it for correctness. useCallback is memoizing a lambda/functional interface so downstream consumers keep the same reference - the same reason you'd hoist a Comparator or Predicate to a static final instead of allocating a new one on every call, so equality-based caching downstream keeps working.",
    keyInsights: [
      "useRef, useMemo, and useCallback all persist a value across renders without triggering a re-render.",
      "useRef returns a stable { current } box; mutating current is silent and does not re-render, and its identity is preserved.",
      "Use a ref for DOM nodes, timer ids, previous values, and mutable flags - anything the render output doesn't depend on.",
      "Use state (not a ref) when changing the value should update the UI; use a ref when the change should be invisible to rendering.",
      "useMemo caches a computed value and recomputes only when a dependency changes (compared via Object.is).",
      "useCallback(fn, deps) equals useMemo(() => fn, deps): it stabilizes a function's identity across renders.",
      "Memoization's biggest use is referential stability so React.memo children and effect deps don't see a new object/function every render.",
      "Memoization has real cost (memory + comparison); skip it for cheap computations and handlers passed to plain DOM elements.",
      "In JS {} !== {} and () => {} !== () => {}, which is why unmemoized object/function props defeat React.memo and re-run effects.",
      "useMemo is advisory - React may discard the cache, so never rely on it for correctness and never put side effects in it.",
    ],
    codeSamples: [
      {
        label: "useRef: DOM access, timer id, and previous value",
        language: "tsx",
        code: `import { useRef, useEffect, useState } from 'react';

function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);   // DOM node
  const timerRef = useRef<number | null>(null);      // mutable id, survives renders

  const focusInput = () => inputRef.current?.focus(); // guard: null before mount

  const debouncedLog = (value: string) => {
    if (timerRef.current) clearTimeout(timerRef.current); // read + write, no re-render
    timerRef.current = window.setTimeout(() => console.log('search:', value), 300);
  };

  return (
    <div>
      <input ref={inputRef} onChange={(e) => debouncedLog(e.target.value)} />
      <button onClick={focusInput}>Focus search</button>
    </div>
  );
}

// "previous value" pattern: keep last render's value in a ref
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => { ref.current = value; }, [value]); // update AFTER render
  return ref.current;                                 // returns the previous value
}`,
      },
      {
        label: "useMemo: expensive compute vs stable identity",
        language: "tsx",
        code: `import { useMemo } from 'react';

function ExpenseDashboard({ items, taxRate }: { items: Expense[]; taxRate: number }) {
  // (1) Skip expensive work: only re-sort when items change, not when taxRate does.
  const sorted = useMemo(
    () => [...items].sort((a, b) => b.amount - a.amount), // O(n log n)
    [items]
  );

  // (2) Stable identity: this object is passed to a memoized child, so keep the
  //     SAME reference unless a dependency actually changes.
  const summary = useMemo(
    () => ({ total: items.reduce((s, e) => s + e.amount, 0), taxRate }),
    [items, taxRate]
  );

  // DON'T memoize trivial work - the overhead outweighs the saving:
  const count = items.length;              // just compute inline, no useMemo

  return <SummaryCard summary={summary} rows={sorted} count={count} />;
}`,
      },
      {
        label: "useCallback + React.memo: making memoization actually work",
        language: "tsx",
        code: `import { useCallback, useState, memo } from 'react';

// Child only re-renders when its props change BY REFERENCE.
const Row = memo(function Row({ id, onSelect }: { id: string; onSelect: (id: string) => void }) {
  console.log('render row', id);
  return <li onClick={() => onSelect(id)}>{id}</li>;
});

function List({ ids }: { ids: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  // Without useCallback, onSelect is a NEW function each render, so every memoized
  // Row re-renders even when only 'selected' changed. useCallback stabilizes it.
  const onSelect = useCallback((id: string) => setSelected(id), []); // stable identity

  return (
    <ul>
      {ids.map((id) => <Row key={id} id={id} onSelect={onSelect} />)}
      <p>Selected: {selected ?? 'none'}</p>
    </ul>
  );
}`,
      },
      {
        label: "Latest-ref pattern: avoid stale closures without re-subscribing",
        language: "tsx",
        code: `import { useRef, useEffect } from 'react';

// A subscription that stays stable (empty deps) yet always calls the FRESHEST cb.
function useInterval(callback: () => void, delayMs: number) {
  const savedCallback = useRef(callback);

  // Keep the ref pointing at the latest callback after every render.
  useEffect(() => { savedCallback.current = callback; }, [callback]);

  useEffect(() => {
    const id = setInterval(() => savedCallback.current(), delayMs); // reads latest
    return () => clearInterval(id);
  }, [delayMs]); // re-subscribe only when the delay changes, never for callback
}`,
      },
    ],
    runnable: {
      title: "Referential identity: why {} !== {} breaks memoization (plain JS)",
      js: `// React memoization hinges on reference equality. Demonstrate it in vanilla JS.

console.log("{} === {} ?", {} === {});                 // false - new object each time
console.log("(()=>{}) === (()=>{}) ?", (() => {}) === (() => {})); // false

// Simulate a "memoized child" that re-renders when its prop reference changes.
let lastProp;
function memoChild(prop) {
  if (prop === lastProp) { console.log("  bailed out (same reference)"); return; }
  lastProp = prop;
  console.log("  re-rendered (new reference)");
}

console.log("Unstable prop (new object each render):");
memoChild({ a: 1 }); // re-rendered
memoChild({ a: 1 }); // re-rendered again - defeats memoization

console.log("Stable prop (same reference, like useMemo/useCallback):");
const stable = { a: 1 };
memoChild(stable);   // re-rendered (first time)
memoChild(stable);   // bailed out - THIS is what useMemo/useCallback preserve`,
    },
    interviewQA: [
      {
        question: "What is the difference between useRef and useState?",
        answer:
          "Both persist a value across renders, but mutating ref.current does NOT trigger a re-render and isn't reflected in the UI, whereas setState re-renders and updates the UI. Use state for values the render output depends on; use a ref for bookkeeping the UI doesn't display - DOM node references, timer ids, previous values, or mutable instance flags.",
      },
      {
        question: "What does useMemo solve and when should you use it?",
        answer:
          "useMemo caches a computed value and recomputes only when a dependency changes (Object.is comparison), giving you two things: skipping genuinely expensive work each render, and referential stability so a memoized child or an effect deps array doesn't see a new object/array every render. Use it for expensive computations or required stable identity - not for cheap calculations, where the overhead outweighs the benefit.",
      },
      {
        question: "How is useCallback related to useMemo?",
        answer:
          "useCallback(fn, deps) is exactly useMemo(() => fn, deps). useMemo memoizes a value; useCallback memoizes a function's identity. You use useCallback so a function prop keeps a stable reference across renders, which matters when passing it to a React.memo child or listing it in an effect's dependency array.",
      },
      {
        question: "Why does useCallback often do nothing useful on its own?",
        answer:
          "Stabilizing a function's identity only helps if something downstream depends on that identity - a React.memo child that bails out on unchanged props, or an effect deps array. If the callback is just passed to a plain DOM element like <button onClick>, the stable identity is never used, so useCallback adds cost (memory + comparison) with no benefit.",
      },
      {
        question: "How do you imperatively focus an input with useRef?",
        answer:
          "Create a ref with useRef<HTMLInputElement>(null), attach it via the ref prop, then call inputRef.current?.focus(). The optional chaining guards against the ref being null before the element mounts or after it unmounts. This is the standard escape hatch for imperative DOM APIs React doesn't model declaratively, like focus, scroll, or media playback.",
      },
      {
        question: "Why do unmemoized objects and functions defeat React.memo?",
        answer:
          "In JavaScript {} !== {} and () => {} !== () => {}. When a parent re-renders it creates brand-new object/function props, so a React.memo child sees props that differ by reference and re-renders anyway. Wrapping those props in useMemo/useCallback preserves their identity so React.memo can actually bail out. It's the same reason inline objects/functions in a deps array re-run effects.",
      },
      {
        question: "Can you rely on useMemo caching for correctness?",
        answer:
          "No. useMemo is a performance hint, not a guarantee - React may discard the cache (for example under memory pressure) and recompute. So the memoized function must be pure and side-effect free, and your code must stay correct if it re-runs. Put actual side effects in useEffect, never in a useMemo callback.",
      },
      {
        question: "When should you NOT reach for useMemo or useCallback?",
        answer:
          "When the computation is cheap (a + b, array.length, small maps) or when the memoized value/function isn't consumed by anything that depends on referential identity. Memoization costs memory and a comparison every render, so 'just in case' memoization clutters code and can be marginally slower. Measure first, then memoize the hot path.",
      },
    ],
    thingsToRemember: [
      "useRef, useMemo, useCallback: persist across renders without re-rendering.",
      "Mutating ref.current is silent and never re-renders; setState does both.",
      "Use state when the UI depends on the value; use a ref when it shouldn't.",
      "useRef is the escape hatch for DOM APIs: focus, scroll, measure, media.",
      "useMemo caches a value; useCallback caches a function's identity.",
      "useCallback(fn, deps) === useMemo(() => fn, deps).",
      "Memoization mainly buys referential stability for React.memo and effect deps.",
      "Don't memoize cheap work or handlers passed only to plain DOM elements.",
      "{} !== {} and () => {} !== () => {} - the root of most re-render surprises.",
      "useMemo is advisory: keep it pure, never rely on it for correctness.",
    ],
    references: [
      { label: "React - useRef", url: "https://react.dev/reference/react/useRef" },
      { label: "React - useMemo", url: "https://react.dev/reference/react/useMemo" },
      { label: "React - useCallback", url: "https://react.dev/reference/react/useCallback" },
      { label: "React - Manipulating the DOM with Refs", url: "https://react.dev/learn/manipulating-the-dom-with-refs" },
      { label: "React - memo", url: "https://react.dev/reference/react/memo" },
      { label: "MDN - Equality comparisons (Object.is)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is" },
    ],
    tags: ["react", "hooks", "useref", "usememo", "usecallback", "memoization", "referential-identity", "dom"],
  },
  {
    id: "custom-hooks",
    num: 21,
    title: "Custom Hooks",
    part: "Hooks",
    partId: "e",
    difficulty: "Core",
    summary:
      "How to extract reusable stateful logic into use-prefixed functions that compose the built-in hooks — what a custom hook shares (logic, not state), how to shape its return value, and the patterns for building fetch, toggle, debounce, and subscription hooks.",
    readingTime: 15,
    explanation: [
      "**What a custom hook is (start here).** A custom hook is just a JavaScript function whose name starts with `use` and which calls one or more other hooks inside it. That's the entire definition — there is no special API. It packages up stateful logic (`useState` + `useEffect` + refs, etc.) so multiple components can reuse it with a single call. It's the React equivalent of extracting a reusable service or utility in Java: pull shared behaviour out of the components and give it a name.",
      "**It shares logic, not state (the crucial distinction).** Two components that call the same custom hook do **not** share a state value — each call creates its own independent copy of every `useState`/`useReducer`/`useRef` inside. `useToggle()` in component A and `useToggle()` in component B are two separate booleans. If you need components to share *the same* value, you need a shared store or React Context — a custom hook alone only reuses the *shape* of the logic, not its data.",
      "**Why the `use` prefix is mandatory.** The prefix is how React's linter recognizes a function as a hook and applies the Rules of Hooks (top-level only) and `exhaustive-deps` to its body. Without it, ESLint won't verify that the hooks inside are called correctly, and readers won't know the function is stateful. Because a custom hook calls hooks, it inherits both Rules of Hooks: call it at the top level of a component or another hook, never conditionally.",
      "**Choosing the return shape.** Return whatever is ergonomic. A **tuple** `[value, setValue] as const` mirrors `useState` and reads well when there are one or two positional values the caller will rename freely (`const [open, toggle] = useToggle()`). An **object** `{ items, loading, error }` is clearer when there are several values, because callers destructure by name and order doesn't matter. Use `as const` on tuples so TypeScript infers a fixed-length tuple with precise element types instead of a loose array.",
      "**Stabilize what you return when identity matters.** If your hook returns functions or objects that consumers will pass to `React.memo` children or list in dependency arrays, wrap them in `useCallback`/`useMemo` so they keep a stable reference across renders. A `toggle` recreated every render would defeat a memoized child or re-run a consumer's effect. For a trivial local `useToggle` it rarely matters, but for a widely-reused hook it's good hygiene.",
      "**The canonical data-fetching hook.** `useFetch(url)` pairs `useState` (data/loading/error) with `useEffect` (the request + cleanup), including the `cancelled` / `AbortController` race guard and re-fetching when the URL changes. Every component that needs that URL's data calls one line and gets back `{ data, loading, error }`. This is exactly the logic that libraries like React Query and SWR generalize with caching and dedup — a custom hook is how you'd hand-roll the same encapsulation.",
      "**Composition — hooks calling hooks.** Because a custom hook is an ordinary function, it can call other custom hooks. `useUserExpenses(userId)` might call `useFetch` internally; `useAuthedFetch` might call `useAuth` (context) then `useFetch`. This composition is the payoff: you build small, focused hooks and assemble them, the same way you compose functions or services on the backend.",
      "**When to extract one.** Extract a custom hook when the *same* stateful pattern — fetching, a toggle, a subscription, a form field, debouncing, media queries, local-storage sync — appears in more than one component, or when a single component's inline hook logic has grown large enough that naming and isolating it improves readability and testability. Don't extract prematurely; wait until you see the duplication or the complexity.",
      "**Testing and gotchas.** Custom hooks are testable with React Testing Library's `renderHook`, so extracting logic also makes it unit-testable in isolation. Gotchas: a hook must obey the Rules of Hooks like any component (no conditional calls); returning a new object/array literal each render can cause consumers' effects to re-run (memoize if needed); and remember a hook shares behaviour, not a singleton — reaching for a hook when you actually need shared global state is a common mistake.",
      "**The mental model (memorise this).** A custom hook is a named, composable bundle of hook calls: it reuses *logic*, and every caller gets its own private *state*. Prefix it `use`, obey the Rules of Hooks inside it, return a tuple (like `useState`) for a value or two and an object for several, stabilize returned functions/objects with `useCallback`/`useMemo` when identity matters, and reach for it only once a stateful pattern is duplicated or a component's logic is worth isolating.",
    ],
    backendAnalogy:
      "A custom hook is the React equivalent of extracting a reusable @Service or utility class in Spring: you lift shared, stateful behaviour out of many components (controllers) into one named unit they depend on. Crucially it shares behaviour, not a shared instance - each component that calls the hook gets its own private state, like injecting a prototype-scoped bean rather than a singleton. Composing custom hooks that call other hooks is like a service that autowires and orchestrates other services. When you truly need one shared value across components, that's a singleton-scoped bean - React Context or a store - not a plain custom hook.",
    keyInsights: [
      "A custom hook is any use-prefixed function that calls other hooks; there's no special API beyond the naming convention.",
      "Custom hooks reuse logic, not state - each caller gets its own independent copy of the state inside.",
      "For shared state across components you need Context or a store; a custom hook alone won't do it.",
      "The use prefix makes the linter apply the Rules of Hooks and exhaustive-deps to the hook's body.",
      "A custom hook obeys the Rules of Hooks: call it at the top level of a component or another hook, never conditionally.",
      "Return a tuple (as const) like useState for one or two values; return an object for several named values.",
      "Wrap returned functions/objects in useCallback/useMemo when consumers rely on stable referential identity.",
      "Custom hooks compose - one hook can call other custom hooks, letting you build small focused pieces.",
      "Extract a hook once a stateful pattern is duplicated or a component's inline logic is worth isolating - not prematurely.",
      "Custom hooks are unit-testable in isolation with React Testing Library's renderHook.",
    ],
    codeSamples: [
      {
        label: "useFetch: the canonical reusable data-fetching hook",
        language: "tsx",
        code: `import { useState, useEffect } from 'react';

interface FetchState<T> { data: T | null; loading: boolean; error: string | null; }

function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;                     // race guard
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then((json) => { if (!cancelled) setData(json as T); })
      .catch((e) => {
        if (!cancelled && e.name !== 'AbortError') setError(e.message);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; controller.abort(); }; // cleanup
  }, [url]);                                   // re-fetch when the url changes

  return { data, loading, error };
}

// Usage - one line, fully reusable, each caller gets its own state:
function Profile({ id }: { id: string }) {
  const { data, loading, error } = useFetch<User>('/api/users/' + id);
  if (loading) return <Spinner />;
  if (error) return <p>Error: {error}</p>;
  return <h1>{data?.name}</h1>;
}`,
      },
      {
        label: "Return shapes: tuple (like useState) vs object",
        language: "tsx",
        code: `import { useState, useCallback } from 'react';

// TUPLE: mirrors useState; caller renames freely. 'as const' -> precise types.
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []); // stable identity
  return [value, toggle] as const;             // type: readonly [boolean, () => void]
}

// OBJECT: clearer when returning several named values (order-independent).
function useCounter(start = 0) {
  const [count, setCount] = useState(start);
  const increment = useCallback(() => setCount((c) => c + 1), []);
  const decrement = useCallback(() => setCount((c) => c - 1), []);
  const reset = useCallback(() => setCount(start), [start]);
  return { count, increment, decrement, reset };
}

function Demo() {
  const [open, toggle] = useToggle();          // tuple destructure
  const { count, increment, reset } = useCounter(10); // object destructure
  return (
    <div>
      <button onClick={toggle}>{open ? 'Hide' : 'Show'}</button>
      <button onClick={increment}>{count}</button>
      <button onClick={reset}>reset</button>
    </div>
  );
}`,
      },
      {
        label: "useDebounce + composition (a hook calling a hook)",
        language: "tsx",
        code: `import { useState, useEffect } from 'react';

// A focused hook: returns the value only after it stops changing for 'delay' ms.
function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);             // cancel the pending update
  }, [value, delayMs]);
  return debounced;
}

// COMPOSITION: a hook built from other hooks (useDebounce + useFetch).
function useSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300);            // wait for typing to settle
  return useFetch<Result[]>('/api/search?q=' + encodeURIComponent(debouncedQuery));
}`,
      },
      {
        label: "useLocalStorage: a stateful subscription-style hook",
        language: "tsx",
        code: `import { useState, useCallback } from 'react';

// State synced to localStorage; each caller keeps its own independent value.
function useLocalStorage<T>(key: string, initial: T) {
  const [stored, setStored] = useState<T>(() => {           // lazy init: read once
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  const setValue = useCallback((value: T) => {
    setStored(value);
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private-mode error - ignore */
    }
  }, [key]);

  return [stored, setValue] as const;
}`,
      },
    ],
    runnable: {
      title: "Custom hooks share logic, not state (plain-JS simulation)",
      js: `// Simulate two components each calling the SAME custom hook.
// Key point: each call creates its OWN independent state.

function makeToggle(initial) {          // stands in for useToggle()
  let value = initial;                  // private state per call
  return {
    get: () => value,
    toggle: () => { value = !value; },
  };
}

const componentA = makeToggle(false);   // A's own boolean
const componentB = makeToggle(false);   // B's own boolean - separate!

componentA.toggle();
componentA.toggle();
componentB.toggle();

console.log("A value:", componentA.get()); // false (toggled twice)
console.log("B value:", componentB.get()); // true  (toggled once)
console.log("Same logic, independent state - that's a custom hook.");
console.log("For SHARED state across components you'd need Context or a store.");`,
    },
    interviewQA: [
      {
        question: "What is a custom hook and when should you create one?",
        answer:
          "A custom hook is a use-prefixed function that encapsulates reusable stateful logic by calling other hooks internally. Create one when the same stateful pattern - data fetching, a toggle, a subscription, a form field, debouncing - appears in more than one component, or when a single component's inline hook logic is large enough that extracting it improves readability and testability. Avoid extracting prematurely.",
      },
      {
        question: "Do two components calling the same custom hook share state?",
        answer:
          "No. A custom hook shares logic, not state. Each component that calls it gets its own independent instances of every useState/useReducer/useRef inside. If you need components to share the same value, you need React Context or a shared store - a custom hook alone only reuses the shape of the logic.",
      },
      {
        question: "Why must a custom hook's name start with 'use'?",
        answer:
          "The use prefix is how React's tooling identifies the function as a hook so the Rules of Hooks and the exhaustive-deps rule apply to its body. Without the prefix ESLint can't verify the hooks inside are called at the top level from valid sites, and readers won't know the function is stateful.",
      },
      {
        question: "When should a custom hook return a tuple versus an object?",
        answer:
          "Return a tuple ([value, setValue] as const) for one or two positional values the caller will rename freely, mirroring useState. Return an object ({ data, loading, error }) when there are several values, so callers destructure by name and order doesn't matter. Use as const on tuples so TypeScript infers precise fixed-length types.",
      },
      {
        question: "When would you wrap a custom hook's return value in useCallback or useMemo?",
        answer:
          "When consumers rely on referential identity - passing a returned function to a React.memo child or listing a returned object/function in a dependency array. Without stabilization the value is recreated every render, defeating memoized children or re-running consumers' effects. For trivial local hooks it often doesn't matter, but for widely-reused hooks it's good hygiene.",
      },
      {
        question: "Can a custom hook call another custom hook?",
        answer:
          "Yes - that's composition, the main payoff of custom hooks. Because a hook is an ordinary function, it can call other hooks including your own. For example useSearch can call useDebounce then useFetch, and useAuthedFetch can call useAuth then useFetch. You build small focused hooks and assemble them like composing services.",
      },
      {
        question: "How do you test a custom hook?",
        answer:
          "Custom hooks can be tested in isolation with React Testing Library's renderHook, which renders the hook inside a test component and returns its result plus helpers to trigger updates (act). Extracting logic into a hook therefore makes it independently unit-testable, without mounting a full consuming component.",
      },
      {
        question: "What are common mistakes with custom hooks?",
        answer:
          "Calling the hook conditionally (it must obey the Rules of Hooks like any component), returning fresh object/array literals each render and causing consumers' effects to re-run, forgetting cleanup inside effects the hook owns, and reaching for a custom hook when you actually need shared global state (which requires Context or a store, since hooks share logic not data).",
      },
    ],
    thingsToRemember: [
      "A custom hook is any use-prefixed function that calls other hooks.",
      "It reuses logic, not state - each caller gets its own independent state.",
      "For shared state across components use Context or a store, not just a hook.",
      "The use prefix makes the linter enforce the Rules of Hooks inside it.",
      "Obey the Rules of Hooks: call it at the top level, never conditionally.",
      "Tuple (as const) for one or two values, object for several named values.",
      "Stabilize returned functions/objects with useCallback/useMemo when identity matters.",
      "Hooks compose: one custom hook can call other custom hooks.",
      "Extract once a pattern is duplicated - don't abstract prematurely.",
      "Custom hooks are unit-testable in isolation via renderHook.",
    ],
    references: [
      { label: "React - Reusing Logic with Custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks" },
      { label: "React - Built-in hooks reference", url: "https://react.dev/reference/react/hooks" },
      { label: "React - Rules of Hooks", url: "https://react.dev/reference/rules/rules-of-hooks" },
      { label: "React Testing Library - renderHook", url: "https://testing-library.com/docs/react-testing-library/api/#renderhook" },
      { label: "MDN - Window.localStorage", url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" },
      { label: "MDN - AbortController", url: "https://developer.mozilla.org/en-US/docs/Web/API/AbortController" },
    ],
    tags: ["react", "hooks", "custom-hooks", "reusability", "composition", "usefetch", "debounce", "testing"],
  },
];
