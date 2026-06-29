import type { FrontendTopic } from "../types";

export const partG: FrontendTopic[] = [
  {
    id: "react-router",
    num: 26,
    title: "React Router",
    part: "Routing & Forms",
    partId: "g",
    difficulty: "Core",
    summary: "Client-side navigation with nested routes, dynamic params, and protected routes — no full page reload.",
    readingTime: 6,
    explanation: [
      "React Router handles client-side navigation. The URL changes, a different component renders, but no full page reload happens. The browser stays on the same document; only the React tree swaps out the matched components.",
      "It supports **nested routes** (a parent layout renders shared chrome and an `<Outlet />` where child routes appear), **dynamic parameters** (a `:id` segment read via `useParams`), and **protected routes** (a wrapper that redirects unauthenticated users with `<Navigate />`).",
      "Programmatic navigation is available through `useNavigate`, and a catch-all `path=\"*\"` route renders a 404 page. Declarative `<Link>` elements replace `<a>` tags so clicks are intercepted and routed on the client.",
    ],
    keyInsights: [
      "Nested routes share layout via a parent element plus an `<Outlet />`; the `index` route is what renders at the parent's exact path.",
      "Dynamic segments like `:id` are read with `useParams`, and `useNavigate` gives you imperative redirects (e.g. after a save).",
      "Protected routes are just components that conditionally render children or a `<Navigate to=\"/login\" replace />`.",
    ],
    codeSamples: [
      {
        label: "React Router: Nested, dynamic, and protected routes",
        language: "tsx",
        code: `import { BrowserRouter, Routes, Route, Link, Navigate, useParams, useNavigate, Outlet } from 'react-router-dom';

// App-level routing
function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/expenses">Expenses</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* Nested routes with Outlet */}
        <Route path="/expenses" element={<ExpenseLayout />}>
          <Route index element={<ExpenseList />} />
          <Route path=":id" element={<ExpenseDetail />} />
          <Route path="new" element={<ExpenseForm />} />
        </Route>
        {/* Protected route */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Layout with nested rendering
function ExpenseLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main><Outlet /></main> {/* child routes render here */}
    </div>
  );
}

// Dynamic route params
function ExpenseDetail() {
  const { id } = useParams(); // read :id from URL
  const navigate = useNavigate(); // programmatic navigation
  // fetch expense by id...
  return <button onClick={() => navigate('/expenses')}>Back</button>;
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}`,
      },
    ],
    interviewQA: [
      {
        question: "What is the difference between client-side and server-side routing?",
        answer:
          "With server-side routing, every navigation requests a fresh HTML document from the server and the browser reloads the whole page. With client-side routing (React Router), the router intercepts navigation, updates the URL via the History API, and swaps the rendered component tree in place — no full reload, so app state and the loaded JS bundle persist. The trade-off is that the initial bundle must ship the routing logic, and you need a server fallback so deep links resolve to the SPA entry point.",
      },
      {
        question: "How do nested and protected routes work in React Router?",
        answer:
          "Nested routes are declared as child `<Route>` elements inside a parent. The parent renders shared layout plus an `<Outlet />`, and the matched child renders into that outlet; an `index` route fills the parent's exact path. A protected route is a wrapper component that checks auth state and either renders its children or returns `<Navigate to=\"/login\" replace />` to redirect, using `replace` so the protected URL isn't left in history.",
      },
      {
        question: "How do you read dynamic route parameters and navigate programmatically?",
        answer:
          "Declare a dynamic segment in the path (e.g. `path=\":id\"`) and read it inside the component with `const { id } = useParams()`. For imperative navigation — for example redirecting after a successful save — call `const navigate = useNavigate()` and then `navigate('/expenses')`.",
      },
    ],
    thingsToRemember: [
      "Client-side routing changes the URL and swaps components without a full page reload.",
      "Parent layout + `<Outlet />` enables nested routes; `index` renders the parent's exact path.",
      "`useParams` reads dynamic segments; `useNavigate` does programmatic redirects; `path=\"*\"` is the 404 catch-all.",
    ],
    references: [
      { label: "React Router — Official docs", url: "https://reactrouter.com" },
    ],
    tags: ["react-router", "routing", "spa", "navigation"],
  },
  {
    id: "form-handling-validation",
    num: 27,
    title: "Form Handling & Validation",
    part: "Routing & Forms",
    partId: "g",
    difficulty: "Core",
    summary: "React Hook Form for low-re-render forms plus Zod schemas that double as your TypeScript type.",
    readingTime: 7,
    explanation: [
      "For real-world forms, **React Hook Form** handles registration and submission with minimal re-renders. It tracks field state via refs rather than re-rendering on every keystroke, so large forms stay fast.",
      "**Zod** provides schema validation that doubles as your TypeScript type — define once, validate and type-check with the same schema. You declare the shape and rules in a single `z.object`, then derive the form's static type with `z.infer`.",
      "The two compose through `@hookform/resolvers/zod`: pass `zodResolver(schema)` to `useForm`, and validation errors surface in `formState.errors`. The typical flow is two steps — first define the schema, then build the form that wires `register`, `handleSubmit`, and the error state into the JSX.",
    ],
    backendAnalogy:
      "Zod schemas are like Java Bean Validation annotations (@NotNull, @Min, @Pattern) but defined as a standalone schema object that also generates the TypeScript type. React Hook Form is like a lightweight form framework that tracks dirty/touched/error state without heavy re-renders.",
    keyInsights: [
      "React Hook Form minimizes re-renders by tracking inputs through refs and `register`, not controlled state on every keystroke.",
      "A single Zod schema is both the runtime validator and the source of the static type via `type T = z.infer<typeof schema>` — no duplicated type definitions.",
      "`zodResolver` bridges the two: validation failures populate `formState.errors`, which you render next to each field.",
    ],
    codeSamples: [
      {
        label: "Step 1 — Define schema (= validation + TypeScript type)",
        language: "ts",
        code: `import { z } from 'zod';

// 1. Define schema (= validation + TypeScript type)
const expenseSchema = z.object({
  amount: z.number({ required_error: 'Amount is required' })
    .positive('Must be positive'),
  category: z.enum(['meals', 'travel', 'other']),
  description: z.string().min(3, 'At least 3 characters'),
  date: z.string().min(1, 'Date is required'),
  receipt: z.instanceof(File).optional(),
});

// Infer the TS type from the schema!
type ExpenseFormData = z.infer<typeof expenseSchema>;`,
      },
      {
        label: "Step 2 — Build the form (React Hook Form + Zod)",
        language: "tsx",
        code: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// 2. Build the form
function ExpenseForm({ onAdd }: { onAdd: (data: ExpenseFormData) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { category: 'meals' },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    await onAdd(data);
    reset(); // clear form after success
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Amount</label>
      <input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
      {errors.amount && <span className="text-red-500">{errors.amount.message}</span>}

      <label>Category</label>
      <select {...register('category')}>
        <option value="meals">Meals</option>
        <option value="travel">Travel</option>
        <option value="other">Other</option>
      </select>

      <label>Description</label>
      <input {...register('description')} />
      {errors.description && <span>{errors.description.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Add Expense'}
      </button>
    </form>
  );
}`,
      },
    ],
    interviewQA: [
      {
        question: "What is the difference between controlled and uncontrolled form inputs?",
        answer:
          "A controlled input stores its value in React state and updates on every keystroke via `onChange`, so React is the single source of truth — but it re-renders on each change. An uncontrolled input keeps its value in the DOM and you read it via a ref. React Hook Form leans on the uncontrolled approach (registering inputs by ref) to avoid re-rendering the whole form on every keystroke, which is why it scales well to large forms.",
      },
      {
        question: "Why combine React Hook Form with Zod instead of validating manually?",
        answer:
          "React Hook Form manages registration, submission, and dirty/touched/error state with minimal re-renders, while Zod gives you a single schema that both validates at runtime and generates the static TypeScript type via `z.infer`. The `zodResolver` wires the schema into the form so errors land in `formState.errors`. You define your rules and types once instead of duplicating a type definition and a separate validation function.",
      },
      {
        question: "How does a single Zod schema produce both validation and types?",
        answer:
          "You write the schema with `z.object({ ... })` describing each field and its rules. At runtime the schema validates incoming data; at compile time `type ExpenseFormData = z.infer<typeof expenseSchema>` extracts the exact static type from that same schema. Because there's one source of truth, the runtime rules and the TypeScript type can never drift apart.",
      },
      {
        question: "What is a sensible validation strategy for forms?",
        answer:
          "Start with native HTML validation (required, type, min/max) for cheap baseline checks, then use a schema validator like Zod for richer rules and cross-field logic. Validate on submit (and optionally on blur or change for immediate feedback), surface each field's error next to it from `formState.errors`, disable the submit button while `isSubmitting`, and always re-validate the same data on the server since client validation is only a UX convenience, never a security boundary.",
      },
    ],
    thingsToRemember: [
      "React Hook Form uses refs/`register` to keep re-renders minimal versus controlled state on every keystroke.",
      "One Zod schema = runtime validation + static type via `z.infer` — define once.",
      "`zodResolver(schema)` feeds validation errors into `formState.errors`; always re-validate on the server too.",
    ],
    references: [
      { label: "React Hook Form — docs", url: "https://react-hook-form.com" },
      { label: "Zod — docs", url: "https://zod.dev" },
    ],
    tags: ["forms", "react-hook-form", "zod", "validation", "typescript"],
  },
];
