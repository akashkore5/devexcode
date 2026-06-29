import type { FrontendTopic } from "../types";

export const partF: FrontendTopic[] = [
  {
    id: "context-api-usecontext",
    num: 22,
    title: "Context API (useContext)",
    part: "State & Patterns",
    partId: "f",
    difficulty: "Core",
    summary: "Pass data through the tree without prop-drilling — ideal for low-frequency global state like auth, theme, and locale.",
    readingTime: 6,
    explanation: [
      "Context lets you pass data through the component tree without **prop-drilling** (passing props through every intermediate level). Use it for global concerns: auth state, theme, locale. Real-world codebases use `createContext`/`useContext` extensively for exactly these cross-cutting needs.",
      "The idiomatic pattern follows five steps. (1) **Define the context type** — an interface describing the value the context exposes. (2) **Create the context** with a sensible default (often `undefined` so consumers can detect misuse). (3) Build a **Provider** component that owns the state and wraps the app. (4) Expose a **custom hook** (e.g. `useAuth`) that calls `useContext` and throws if used outside the provider, giving clean, type-safe consumption. (5) **Use** the hook in any descendant component — no prop-drilling required.",
      "The key trade-off: Context re-renders **all** consumers whenever its value changes. That makes it perfect for low-frequency state (auth, theme, locale) but a poor fit for high-frequency updates (form inputs, fast-updating lists), where local state or a dedicated store performs better.",
    ],
    keyInsights: [
      "Context is for low-frequency state (auth, theme, locale). For high-frequency state (form inputs, lists that update often), use local state or Redux.",
      "Context re-renders ALL consumers on every value change — split into multiple contexts to limit the blast radius.",
      "Wrap consumption in a custom hook that throws when used outside its provider; this catches misuse early and keeps call sites clean.",
    ],
    codeSamples: [
      {
        label: "Context API: Auth provider pattern (5 steps)",
        language: "tsx",
        code: `import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Define the context type
interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

// 2. Create context with default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provider component (wraps the app)
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string) => {
    const decoded = decodeJWT(token);
    localStorage.setItem('token', token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. Custom hook for clean consumption
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be inside AuthProvider');
  return context;
}

// 5. Usage in any component (no prop-drilling!)
function Navbar() {
  const { user, logout } = useAuth();
  return <button onClick={logout}>Logout {user?.name}</button>;
}`,
      },
    ],
    interviewQA: [
      {
        question: "What problem does Context solve, and how is it better than prop-drilling?",
        answer:
          "Prop-drilling means threading a prop through every intermediate component just to reach a deep descendant, even though those middle components do not use it — it is noisy and brittle. Context lets a Provider expose a value that any descendant reads directly via useContext, so intermediate components stay clean. It is best for global, low-frequency state like auth, theme, and locale.",
      },
      {
        question: "What is the main performance pitfall with Context?",
        answer:
          "Every consumer of a context re-renders whenever the context value changes — even if it only reads a slice that did not change. Mitigations: split state into multiple focused contexts, memoize the value object so its reference is stable, and keep high-frequency state out of context entirely. This is why context suits low-frequency state and local state or Redux suits frequently-updating state.",
      },
      {
        question: "Why wrap useContext in a custom hook?",
        answer:
          "A custom hook like useAuth calls useContext, throws a clear error if the value is undefined (used outside the provider), and returns a typed value. This gives every call site a single, type-safe entry point, removes repeated null checks, and turns a silent bug into a loud, early failure.",
      },
    ],
    thingsToRemember: [
      "Use Context for low-frequency global state: auth, theme, locale, config.",
      "Every consumer re-renders on any value change — split contexts to limit it.",
      "Expose a custom hook that throws outside its provider for safe consumption.",
    ],
    references: [
      { label: "React — Scaling Up with Context + Reducer", url: "https://react.dev/learn/scaling-up-with-reducer-and-context" },
      { label: "React — Passing Data Deeply with Context", url: "https://react.dev/learn/passing-data-deeply-with-context" },
    ],
    tags: ["react", "context", "useContext", "state", "prop-drilling"],
  },
  {
    id: "state-management-overview",
    num: 23,
    title: "State Management Overview",
    part: "State & Patterns",
    partId: "f",
    difficulty: "Core",
    summary: "Choosing the right state layer: local, lifted, context, global store, or server state.",
    readingTime: 4,
    explanation: [
      "React state management has several layers. The skill is knowing **when to use which** rather than reaching for a global store by default. Most state is local; escalate only when sharing demands it.",
      "The layers, from simplest to heaviest:",
      "| Layer | Tool | When to Use |\n| --- | --- | --- |\n| Local state | `useState` | Form inputs, toggles, UI-only state within a single component |\n| Lifted state | `useState` in parent | State shared between 2–3 sibling components |\n| Context | `useContext` | Global low-frequency state: auth, theme, locale, config |\n| Global store | Redux Toolkit | Complex cross-cutting state with many updaters; time-travel debugging needed |\n| Server state | TanStack Query / SWR | Data from APIs with caching, refetch, and background sync |",
      "A common mistake is treating server data as client state. Server state (API data) has different needs — caching, revalidation, background sync — which is why dedicated tools like TanStack Query or SWR exist instead of stuffing fetched data into Redux or context by hand.",
    ],
    keyInsights: [
      "Start with local state; lift it only when siblings must share, and reach for context or a store only when many distant components need it.",
      "Context is for low-frequency global state; Redux Toolkit is for complex state with many updaters or when you need time-travel debugging.",
      "Server state (API data with caching/refetch) is a distinct category — use TanStack Query or SWR rather than hand-rolling it in a client store.",
    ],
    codeSamples: [],
    interviewQA: [
      {
        question: "How do you decide where a piece of state should live?",
        answer:
          "Default to local useState inside the component that owns it. If two or three siblings need it, lift it to their common parent. If many distant components need low-frequency global data (auth, theme), use Context. If you have complex cross-cutting state with many updaters or need time-travel debugging, use a global store like Redux Toolkit. If the data comes from an API, treat it as server state and use TanStack Query or SWR.",
      },
      {
        question: "Why is server state treated differently from client state?",
        answer:
          "Server state is a cache of data that actually lives on the backend, so it needs caching, deduping, background refetch, staleness, and revalidation — concerns that do not apply to UI state like a toggle. Libraries like TanStack Query and SWR handle that lifecycle, whereas putting fetched data into Redux means reimplementing all of it by hand.",
      },
      {
        question: "When should you NOT introduce Redux?",
        answer:
          "When the state is local UI state, when only a couple of siblings share it (lift it instead), or when the global need is just low-frequency config like theme or auth (Context is enough). Redux earns its boilerplate only with complex, frequently-updated, cross-cutting state shared by many components, or when you want time-travel debugging.",
      },
    ],
    thingsToRemember: [
      "Escalation ladder: local → lifted → context → global store.",
      "Context = low-frequency global; Redux Toolkit = complex many-updater global.",
      "Server data (API + caching/refetch) is its own layer: TanStack Query / SWR.",
    ],
    references: [
      { label: "React — Sharing State Between Components", url: "https://react.dev/learn/sharing-state-between-components" },
      { label: "React — Managing State", url: "https://react.dev/learn/managing-state" },
    ],
    tags: ["react", "state-management", "context", "redux", "server-state"],
  },
  {
    id: "redux-redux-toolkit",
    num: 24,
    title: "Redux (Redux Toolkit)",
    part: "State & Patterns",
    partId: "f",
    difficulty: "Core",
    summary: "A single global store via Redux Toolkit slices — the modern, low-boilerplate way to write Redux.",
    readingTime: 6,
    explanation: [
      "Redux provides a single global store for application state. **Redux Toolkit (RTK)** is the modern, opinionated way to write Redux — it eliminates the classic boilerplate of action types, action creators, and hand-written reducers. Think of it as a centralized event-sourced state machine.",
      "A **slice** bundles the state shape, its initial value, and the reducers that update it. `createSlice` auto-generates the matching action creators. Crucially, RTK uses **Immer** under the hood, so you can write what looks like direct mutation (`state.items.push(...)`) inside a reducer and RTK produces an immutable update for you.",
      "`configureStore` wires the slice reducers into the store and gives you the `RootState` and `AppDispatch` types for fully-typed usage. Components read with `useSelector` and dispatch actions with `useDispatch` from `react-redux`.",
    ],
    backendAnalogy:
      "Redux is event sourcing for the frontend. Actions are events, reducers are event handlers, the store is the aggregate. RTK's createSlice generates action creators and reducers from a single definition — like a Spring @EventHandler that auto-generates the command.",
    keyInsights: [
      "createSlice generates action creators and reducers from one definition, removing the action-type/creator/switch boilerplate.",
      "RTK uses Immer, so mutating syntax inside a reducer (state.items.push(...)) is safe and produces an immutable update.",
      "configureStore exposes RootState and AppDispatch types so useSelector and useDispatch are fully typed.",
    ],
    codeSamples: [
      {
        label: "Redux Toolkit: slice definition",
        language: "ts",
        code: `// store/expenseSlice.ts — define a "slice" of state
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExpenseState {
  items: Expense[];
  filter: string;
}

const initialState: ExpenseState = { items: [], filter: 'all' };

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense(state, action: PayloadAction<Expense>) {
      state.items.push(action.payload); // RTK uses Immer — mutation is OK here!
    },
    removeExpense(state, action: PayloadAction<number>) {
      state.items = state.items.filter(e => e.id !== action.payload);
    },
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
  },
});

export const { addExpense, removeExpense, setFilter } = expenseSlice.actions;
export default expenseSlice.reducer;`,
      },
      {
        label: "Redux Toolkit: configure the store",
        language: "ts",
        code: `// store/index.ts — configure the store
import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from './expenseSlice';

export const store = configureStore({
  reducer: { expenses: expenseReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`,
      },
      {
        label: "Redux Toolkit: usage in a component",
        language: "tsx",
        code: `// Usage in component
import { useSelector, useDispatch } from 'react-redux';

function ExpenseList() {
  const items = useSelector((state: RootState) => state.expenses.items);
  const dispatch = useDispatch();

  return (
    <div>
      {items.map(e => (
        <div key={e.id}>
          {e.category}: ₹{e.amount}
          <button onClick={() => dispatch(removeExpense(e.id))}>Delete</button>
        </div>
      ))}
    </div>
  );
}`,
      },
    ],
    interviewQA: [
      {
        question: "What does Redux Toolkit improve over classic Redux?",
        answer:
          "Classic Redux required hand-writing action type constants, action creators, and switch-based reducers, plus immutable update logic. RTK's createSlice generates the action creators and reducers from a single definition, configureStore sets up the store with good defaults (thunk, devtools, immutability checks), and Immer lets you write mutating syntax in reducers. The result is far less boilerplate with the same predictable, debuggable data flow.",
      },
      {
        question: "Why is it safe to write state.items.push() inside an RTK reducer?",
        answer:
          "Because createSlice runs reducers through Immer. Immer gives you a draft proxy of the state; your mutations are recorded against the draft, and Immer produces a new immutable state from them. So the mutating syntax is ergonomic, but the actual store update is still immutable — you must never mutate state outside of an RTK reducer's draft.",
      },
      {
        question: "When would you choose Redux over Context?",
        answer:
          "Choose Redux Toolkit for complex, frequently-updated, cross-cutting state with many updaters, when you want a single auditable data flow, middleware, or time-travel debugging. Choose Context for low-frequency global state like auth, theme, and locale, where the re-render-all-consumers behavior is acceptable and the extra store machinery would be overkill.",
      },
      {
        question: "How do useSelector and useDispatch work?",
        answer:
          "useSelector subscribes a component to the store and returns the slice of state its selector function picks; the component re-renders only when that selected value changes (by reference, using strict equality by default). useDispatch returns the store's dispatch function so the component can send actions — typically the auto-generated action creators from a slice — to trigger reducer updates.",
      },
    ],
    thingsToRemember: [
      "createSlice = state + initialState + reducers, and auto-generates action creators.",
      "RTK uses Immer: mutation-looking code in reducers is converted to immutable updates.",
      "Read with useSelector, write with useDispatch; type via RootState and AppDispatch.",
    ],
    references: [
      { label: "Redux Toolkit — Official docs", url: "https://redux-toolkit.js.org" },
      { label: "React — Scaling Up with Context + Reducer", url: "https://react.dev/learn/scaling-up-with-reducer-and-context" },
    ],
    tags: ["redux", "redux-toolkit", "state-management", "immer", "store"],
  },
  {
    id: "hoc-higher-order-components",
    num: 25,
    title: "HOC (Higher Order Components)",
    part: "State & Patterns",
    partId: "f",
    difficulty: "Core",
    summary: "A function that wraps a component to add behavior — the pre-hooks pattern for reusing logic.",
    readingTime: 5,
    explanation: [
      "A **Higher Order Component** is a function that takes a component and returns a new component with added behavior. It is the pre-hooks pattern for reusing cross-cutting logic such as auth checks, loading states, or data injection.",
      "Common HOCs include `withAuth` (redirect unauthenticated users away from a wrapped page) and `withLoading` (render a spinner until data is ready, then render the wrapped component). The HOC owns the shared logic once; you apply it to any component by composing: `const ProtectedDashboard = withAuth(Dashboard)`.",
      "For new code, prefer **custom hooks** over HOCs — they are easier to type, test, and compose, and they avoid the wrapper-component nesting (\"wrapper hell\") that HOCs can create. But legacy codebases use HOCs extensively, so understanding the pattern remains essential.",
    ],
    keyInsights: [
      "An HOC is just a function: component in, enhanced component out — it adds behavior without modifying the original.",
      "For new code, prefer custom hooks over HOCs: hooks are easier to type, test, and compose.",
      "You still need to understand HOCs because legacy codebases use them extensively (auth guards, loading wrappers, injected props).",
    ],
    codeSamples: [
      {
        label: "HOC: Higher Order Components pattern",
        language: "tsx",
        code: `// HOC: adds authentication check to any component
function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <WrappedComponent {...props} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
// <ProtectedDashboard /> — automatically redirects if not logged in

// HOC: adds loading state
function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P & { data: any }>
) {
  return function WithLoadingComponent(props: P & { loading: boolean; data: any }) {
    if (props.loading) return <Spinner />;
    return <WrappedComponent {...props} />;
  };
}`,
      },
    ],
    interviewQA: [
      {
        question: "What is a Higher Order Component?",
        answer:
          "An HOC is a function that takes a component and returns a new component with extra behavior wrapped around it — for example withAuth(Dashboard) returns a component that checks the user and redirects if unauthenticated before rendering Dashboard. It is a composition pattern for reusing cross-cutting logic without editing the wrapped component itself.",
      },
      {
        question: "HOCs vs custom hooks — which should you use today and why?",
        answer:
          "Prefer custom hooks for new code. Hooks share logic without adding wrapper components, are easier to type and test, and compose by simply calling several hooks in one component. HOCs add nesting (wrapper hell), make prop sources harder to trace, and complicate typing. HOCs still matter because legacy code relies on them, and a few cases (wrapping a component you do not control) still fit them.",
      },
      {
        question: "What are common pitfalls when writing HOCs?",
        answer:
          "Passing props through correctly with spread so the wrapped component still receives them, avoiding name collisions between injected and incoming props, preserving the wrapped component's displayName for debugging, and not creating the HOC inside render (which remounts the subtree every render). Typing the generic prop shape (P extends object) is also needed so injected props compose with the originals.",
      },
    ],
    thingsToRemember: [
      "HOC = function that takes a component and returns an enhanced component.",
      "Prefer custom hooks for new code; they are easier to type, test, and compose.",
      "Know HOCs anyway — legacy codebases use withAuth/withLoading-style wrappers heavily.",
    ],
    references: [
      { label: "React (legacy) — Higher-Order Components", url: "https://legacy.reactjs.org/docs/higher-order-components.html" },
      { label: "React — Reusing Logic with Custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks" },
    ],
    tags: ["react", "hoc", "patterns", "hooks", "composition"],
  },
];
