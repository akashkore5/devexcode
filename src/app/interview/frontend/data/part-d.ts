import type { FrontendTopic } from "../types";

export const partD: FrontendTopic[] = [
  {
    id: "reactjs-overview",
    num: 11,
    title: "ReactJS Overview",
    part: "React Core",
    partId: "d",
    difficulty: "Foundational",
    summary: "A library for building UIs where the screen is a pure function of state, kept fast by a Virtual DOM.",
    readingTime: 4,
    explanation: [
      "React is a JavaScript library for building user interfaces out of **components**. The core mental model is simple: the UI is a pure function of state. You describe what the screen should look like for a given set of data, and React figures out how to update the real DOM to match. You change the data; React updates the screen.",
      "To do this efficiently, React keeps a lightweight in-memory representation of the UI called the **Virtual DOM**. When state changes, React renders a new virtual tree, diffs it against the previous one (reconciliation), and applies only the minimal set of changes to the real DOM. This avoids many separate, expensive layout and paint cycles.",
      "This declarative model is what makes React scale: instead of imperatively wiring up `document.getElementById(...).innerHTML = ...` for every change, you write components that always return the correct UI for the current state, and let React handle the 'how'.",
    ],
    backendAnalogy:
      "Think of a React component tree like a templating/rendering layer that is re-evaluated whenever your data model changes. The Virtual DOM is a diff engine — much like comparing two object graphs and persisting only the changed fields, instead of rewriting every row on every request.",
    keyInsights: [
      "UI = f(state): describe the result for the current data, not the step-by-step mutations.",
      "The Virtual DOM's value is batching and minimal updates, not that the real DOM is inherently slow.",
      "Components are the unit of reuse and composition — you build screens by nesting them.",
    ],
    codeSamples: [],
    interviewQA: [
      {
        question: "What problem does the Virtual DOM actually solve?",
        answer:
          "Direct DOM mutations can each trigger synchronous layout and paint, and doing many of them imperatively is hard to reason about. React renders a virtual tree, diffs it against the previous render, and applies the minimal set of real DOM changes in one batch. The win is batching and a declarative model, not that the DOM is intrinsically slow.",
      },
      {
        question: "What does 'declarative UI' mean in React?",
        answer:
          "You declare what the UI should look like for a given state, and React reconciles the DOM to match. You don't write the imperative steps to get there (find node, set text, toggle class). This makes UI a pure function of state, which is easier to test and reason about.",
      },
      {
        question: "What is reconciliation?",
        answer:
          "Reconciliation is React's process of comparing the newly rendered Virtual DOM tree with the previous one to determine the minimal set of operations needed to update the real DOM. Keys and component identity guide how React matches old and new nodes during this diff.",
      },
    ],
    thingsToRemember: [
      "React is a library for component-based, declarative UIs.",
      "UI is a pure function of state: change data, React updates the DOM.",
      "Virtual DOM + reconciliation batch and minimize real DOM mutations.",
    ],
    references: [
      { label: "React — Official docs (Learn)", url: "https://react.dev/learn" },
      { label: "React — Thinking in React", url: "https://react.dev/learn/thinking-in-react" },
    ],
    tags: ["react", "virtual-dom", "declarative", "components"],
  },
  {
    id: "jsx",
    num: 12,
    title: "JSX",
    part: "React Core",
    partId: "d",
    difficulty: "Foundational",
    summary: "HTML-like syntax embedded in JavaScript that compiles to React.createElement() calls.",
    readingTime: 4,
    explanation: [
      "JSX is HTML-like syntax that lives inside JavaScript. It is syntactic sugar for `React.createElement()` calls — a build step (Babel/SWC) transforms `<h1>Hi</h1>` into the equivalent function call that produces a React element. Because it is JavaScript, you embed expressions with curly braces `{ }` rather than a separate templating language.",
      "A few rules follow from JSX being JavaScript rather than HTML. You write `className` instead of `class` (because `class` is a reserved word), `htmlFor` instead of `for`, and attributes use camelCase. Tags must be closed — self-closing tags like `<img />` are required — and a component must return a single root node (or a Fragment).",
      "Inside `{ }` you can place any JavaScript **expression**: variables, function calls, ternaries for conditional rendering, or `.map()` to render lists. Statements like `if`/`for` are not allowed directly inside JSX, which is why conditionals are expressed with ternaries and `&&`.",
    ],
    keyInsights: [
      "JSX compiles to React.createElement(); it is not HTML and not a string template.",
      "Use { } for expressions only — variables, ternaries, function calls — never statements like if/for.",
      "It is className (not class) and htmlFor (not for) because attributes are JS properties; self-closing tags are required.",
    ],
    codeSamples: [
      {
        label: "JSX: HTML-like syntax with JavaScript expressions",
        language: "jsx",
        code: `// JSX — looks like HTML, lives in JavaScript
function Welcome() {
  const name = 'Dice Engineer';
  const isLoggedIn = true;

  return (
    <div>
      {/* Expression in curly braces */}
      <h1>Hello, {name}!</h1>

      {/* Conditional rendering */}
      {isLoggedIn ? <p>Welcome back</p> : <p>Please log in</p>}

      {/* className, not class (it's JavaScript!) */}
      <button className="btn btn-primary">Click me</button>

      {/* Self-closing tags required */}
      <img src="/logo.png" alt="Logo" />
    </div>
  );
}`,
      },
    ],
    interviewQA: [
      {
        question: "What does JSX compile to, and why does that matter?",
        answer:
          "JSX compiles to React.createElement(type, props, ...children) calls (or the newer jsx runtime). It matters because JSX is just JavaScript: you can only embed expressions in { }, attributes are JS property names (className, htmlFor), and a component ultimately returns plain element objects, not HTML strings.",
      },
      {
        question: "Why is it className instead of class in JSX?",
        answer:
          "Because JSX attributes map to DOM/JS properties, and `class` is a reserved keyword in JavaScript. React uses className (and htmlFor for the for attribute) and camelCase for most other attributes like onClick or tabIndex.",
      },
      {
        question: "Can you put an if statement inside JSX?",
        answer:
          "Not directly — only expressions are allowed inside { }. For conditionals you use a ternary (cond ? a : b) or short-circuit (cond && a). For if/else logic you compute the value before the return, or extract it into a variable or helper function.",
      },
    ],
    thingsToRemember: [
      "JSX is sugar for React.createElement() — a build step transforms it.",
      "Only expressions go inside { }; use ternaries and && for conditionals.",
      "className not class, htmlFor not for, camelCase attributes, self-closing tags required.",
    ],
    references: [
      { label: "React — Writing markup with JSX", url: "https://react.dev/learn/writing-markup-with-jsx" },
      { label: "React — JavaScript in JSX with curly braces", url: "https://react.dev/learn/javascript-in-jsx-with-curly-braces" },
    ],
    tags: ["react", "jsx", "syntax", "components"],
  },
  {
    id: "components",
    num: 13,
    title: "Components",
    part: "React Core",
    partId: "d",
    difficulty: "Foundational",
    summary: "Reusable building blocks — functions that return JSX and compose into screens.",
    readingTime: 4,
    explanation: [
      "Components are the reusable building blocks of a React app. In modern React, a component is simply a function that returns JSX. You build a whole screen by composing components — small, focused ones (a button, a card) nested inside larger ones (a list, a page).",
      "Component names must start with a capital letter so React can distinguish them from regular HTML tags (`<ExpenseCard />` vs `<div />`). Each component should ideally do one thing well; when it grows too large or handles multiple responsibilities, you split it into smaller components.",
      "Composition — not inheritance — is React's reuse strategy. You share behavior by nesting components and passing data down, or by passing JSX through the special `children` prop, rather than by extending base classes.",
    ],
    backendAnalogy:
      "A React component is like a method that takes a parameter object and returns a UI description instead of data. Composing components is like composing functions or services — small units that call into each other — rather than building deep inheritance hierarchies.",
    keyInsights: [
      "A component is a function returning JSX; capitalize its name so React treats it as a component.",
      "Favor small, single-responsibility components and compose them into larger ones.",
      "React reuses through composition (nesting, children) rather than inheritance.",
    ],
    codeSamples: [
      {
        label: "A typed component receiving props",
        language: "tsx",
        code: `// A typed component receiving props
interface CardProps {
  title: string;
  amount: number;
  category: 'meals' | 'travel' | 'other';
  onApprove?: () => void; // optional callback
}

function ExpenseCard({ title, amount, category, onApprove }: CardProps) {
  return (
    <div className="rounded border p-4">
      <h3>{title}</h3>
      <p>₹{amount.toFixed(2)}</p>
      <span className="text-sm text-gray-500">{category}</span>
      {onApprove && (
        <button onClick={onApprove}>Approve</button>
      )}
    </div>
  );
}`,
      },
    ],
    interviewQA: [
      {
        question: "What is a React component?",
        answer:
          "A reusable, self-contained piece of UI. In modern React it is a JavaScript function that accepts props and returns JSX describing what to render. Components compose: you nest small components inside larger ones to build screens.",
      },
      {
        question: "Why must component names be capitalized?",
        answer:
          "JSX uses capitalization to distinguish components from HTML elements. A lowercase tag like <button> is treated as a DOM element, while a capitalized tag like <ExpenseCard> is resolved to the component variable in scope. Lowercasing a component name would make React look for an unknown HTML tag.",
      },
      {
        question: "Why does React favor composition over inheritance?",
        answer:
          "UI reuse is more naturally expressed by combining components — nesting them and passing data or JSX (via children) — than by extending base classes. Composition keeps components decoupled and flexible, avoids fragile inheritance hierarchies, and matches the function-based model of React.",
      },
    ],
    thingsToRemember: [
      "A component is a function that returns JSX.",
      "Capitalize component names so React doesn't treat them as HTML tags.",
      "Reuse via composition (nesting, children), not inheritance.",
    ],
    references: [
      { label: "React — Your first component", url: "https://react.dev/learn/your-first-component" },
      { label: "React — Describing the UI", url: "https://react.dev/learn/describing-the-ui" },
    ],
    tags: ["react", "components", "composition", "jsx"],
  },
  {
    id: "props",
    num: 14,
    title: "Props",
    part: "React Core",
    partId: "d",
    difficulty: "Foundational",
    summary: "Read-only inputs passed from parent to child — a component's parameters.",
    readingTime: 4,
    explanation: [
      "Props (short for properties) are the inputs to a component. A parent passes data down to a child as props, and the child reads them to decide what to render. Think of a component as a function and props as its parameters: `<ExpenseCard title=\"Lunch\" amount={1200} />` is like calling `ExpenseCard({ title: 'Lunch', amount: 1200 })`.",
      "Props are **read-only**. A child must never modify the props it receives — they belong to the parent. This one-way, top-down data flow (parent → child) makes the app predictable: to change what a child shows, you change the parent's state and re-render, which passes new props down.",
      "Props can be any value: strings, numbers, objects, arrays, and functions. Passing a function as a prop (a callback like `onApprove`) is how a child notifies its parent of an event — data flows down, events flow up.",
    ],
    backendAnalogy:
      "Props are like the parameter object passed into a method. They flow in one direction (parent → child, caller → callee) and are read-only — the callee uses them but doesn't mutate the caller's arguments. Callback props are like passing a handler/listener for the callee to invoke back.",
    keyInsights: [
      "Props flow one way: parent → child. To change a child, change the parent and re-render.",
      "Props are read-only — never mutate them inside the receiving component.",
      "Functions passed as props (callbacks) let children send events back up to parents.",
    ],
    codeSamples: [
      {
        label: "Parent passes props to a child component",
        language: "tsx",
        code: `// Usage — parent passes props
<ExpenseCard
  title="Client Lunch"
  amount={1200}
  category="meals"
  onApprove={() => handleApprove(expense.id)}
/>`,
      },
    ],
    interviewQA: [
      {
        question: "What is the difference between props and state?",
        answer:
          "Props are inputs passed into a component from its parent and are read-only from the child's perspective. State is data a component owns and manages internally, and changing it triggers a re-render. Props flow down from parent to child; state is local. A common pattern: a parent holds state and passes pieces of it down as props.",
      },
      {
        question: "Why are props read-only, and how does a child change something?",
        answer:
          "Props belong to the parent; mutating them would break React's one-way data flow and make renders unpredictable. To change what a child shows, the child calls a callback prop to notify the parent, the parent updates its state, and new props flow back down on the next render. Data flows down, events flow up.",
      },
      {
        question: "How does a child communicate back to its parent?",
        answer:
          "The parent passes a function as a prop (e.g. onApprove). The child invokes that callback when an event occurs, optionally passing data up. The parent's handler then updates state or performs the side effect. This keeps state ownership with the parent while letting children trigger changes.",
      },
    ],
    thingsToRemember: [
      "Props are a component's inputs — like function parameters.",
      "Props are read-only and flow parent → child (one-way data flow).",
      "Pass callbacks as props so children can report events back up.",
    ],
    references: [
      { label: "React — Passing props to a component", url: "https://react.dev/learn/passing-props-to-a-component" },
      { label: "React — Describing the UI", url: "https://react.dev/learn/describing-the-ui" },
    ],
    tags: ["react", "props", "data-flow", "components"],
  },
  {
    id: "state",
    num: 15,
    title: "State (useState)",
    part: "React Core",
    partId: "d",
    difficulty: "Core",
    summary: "Data that changes over time and triggers re-renders, declared with the useState hook.",
    readingTime: 5,
    explanation: [
      "State is data that changes over time and, when it changes, triggers a re-render of the component. You declare a state variable with the `useState` hook, which returns a pair: the current value and a setter function — `const [amount, setAmount] = useState(0)`.",
      "The two golden rules of state: **never mutate state directly** (always call the setter), and **use the functional updater** — `setItems(prev => [...prev, newItem])` — when the new value depends on the previous one. Mutating state in place (e.g. `items.push(...)`) won't trigger a re-render and corrupts React's ability to track changes.",
      "Because state updates are how the UI changes, you create new values immutably: spread into a new array or object rather than editing the existing one. React may also **batch** multiple state updates that happen in the same event for performance, applying them together before re-rendering once.",
    ],
    keyInsights: [
      "useState returns [value, setter]; calling the setter schedules a re-render.",
      "Never assign to state directly — always update through the setter with a new value.",
      "Use the functional updater (prev => ...) when the next value depends on the previous; React batches updates.",
    ],
    codeSamples: [
      {
        label: "useState with immutable updates",
        language: "tsx",
        code: `import { useState } from 'react';

function ExpenseForm() {
  // Declare state: [currentValue, setterFunction]
  const [amount, setAmount] = useState<number>(0);
  const [items, setItems] = useState<Expense[]>([]);

  // ... add an item immutably
  const add = () => {
    const newExpense: Expense = {
      id: Date.now(),
      amount,
      category: 'meals',
      approved: false,
    };
    // ✅ Immutable update — create new array
    setItems(prev => [...prev, newExpense]);
    setAmount(0); // reset
  };

  return null;
}`,
      },
    ],
    interviewQA: [
      {
        question: "Why can't you mutate state directly in React?",
        answer:
          "React detects changes by comparing references. If you mutate the existing array or object in place (items.push(...)), the reference is unchanged, so React may skip the re-render and the UI goes stale. You must call the setter with a new value (a new array/object), which both triggers a re-render and preserves predictable updates.",
      },
      {
        question: "When should you use the functional updater form of a setter?",
        answer:
          "Whenever the next state depends on the previous state — for example appending to a list or incrementing a counter. setItems(prev => [...prev, item]) reads the latest committed value, which is important because React batches updates and the closed-over state variable may be stale within the same event.",
      },
      {
        question: "What is state batching?",
        answer:
          "React groups multiple state updates that occur within the same event handler and applies them together, re-rendering once instead of once per setter call. This is a performance optimization and is another reason to use functional updaters when an update depends on the previous value.",
      },
    ],
    thingsToRemember: [
      "Declare state with const [value, setValue] = useState(initial).",
      "Never mutate state directly — call the setter with a new value.",
      "Use prev => ... when the next value depends on the previous; updates are batched.",
    ],
    references: [
      { label: "React — State: a component's memory", url: "https://react.dev/learn/state-a-components-memory" },
      { label: "React — Updating arrays in state", url: "https://react.dev/learn/updating-arrays-in-state" },
    ],
    tags: ["react", "state", "usestate", "immutability"],
  },
  {
    id: "events",
    num: 16,
    title: "Events",
    part: "React Core",
    partId: "d",
    difficulty: "Core",
    summary: "Handling user interactions with onClick, onChange, and onSubmit handlers.",
    readingTime: 4,
    explanation: [
      "Events let your components respond to user interaction. You attach handlers with camelCase props like `onClick`, `onChange`, and `onSubmit`, passing a function (not calling it): `<button onClick={handleClick}>`. React wraps native events in a cross-browser **SyntheticEvent**, so the handler receives an event object with a consistent API.",
      "Event handlers commonly update state. A form `onSubmit` handler typically calls `e.preventDefault()` first to stop the browser's default full-page reload, then reads input values and updates state. An input's `onChange` handler reads `e.target.value` and stores it in state — the basis of controlled inputs.",
      "Because handlers are just functions, you can define them inline as arrow functions or as named functions in the component body. Inline arrows are convenient for passing arguments — `onClick={() => approve(id)}` — while named handlers keep complex logic readable.",
    ],
    keyInsights: [
      "Pass the handler function (onClick={fn}), don't call it (onClick={fn()}).",
      "Call e.preventDefault() in onSubmit to stop the browser's default page reload.",
      "Handlers receive a SyntheticEvent — a cross-browser wrapper with a consistent API.",
    ],
    codeSamples: [
      {
        label: "Form events: onSubmit and onChange",
        language: "tsx",
        code: `import { useState } from 'react';

function ExpenseForm() {
  const [amount, setAmount] = useState<number>(0);

  // Event handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload
    // ... use amount
    setAmount(0); // reset form
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button type="submit">Add Expense</button>
    </form>
  );
}`,
      },
    ],
    interviewQA: [
      {
        question: "What is the difference between onClick={fn} and onClick={fn()}?",
        answer:
          "onClick={fn} passes the function reference so React calls it on click. onClick={fn()} calls fn immediately during render and assigns its return value as the handler — usually a bug. To pass arguments, wrap it in an arrow: onClick={() => fn(id)}.",
      },
      {
        question: "Why call e.preventDefault() in a form's onSubmit handler?",
        answer:
          "By default, submitting a form causes the browser to reload the page (or navigate). In a single-page React app you usually handle submission in JavaScript, so you call e.preventDefault() to stop the default navigation and instead update state or make a fetch request.",
      },
      {
        question: "What is a SyntheticEvent?",
        answer:
          "It is React's cross-browser wrapper around the native DOM event. It normalizes differences between browsers and gives handlers a consistent interface (e.target, e.preventDefault, etc.), while React manages event delegation under the hood for performance.",
      },
    ],
    thingsToRemember: [
      "Attach handlers with camelCase props: onClick, onChange, onSubmit.",
      "Pass the function reference; use an arrow wrapper to pass arguments.",
      "preventDefault() in onSubmit; onChange reads e.target.value into state.",
    ],
    references: [
      { label: "React — Responding to events", url: "https://react.dev/learn/responding-to-events" },
      { label: "React — Reacting to input with state", url: "https://react.dev/learn/reacting-to-input-with-state" },
    ],
    tags: ["react", "events", "onchange", "forms"],
  },
  {
    id: "rendering-patterns-lists-keys-conditionals",
    num: 17,
    title: "Rendering Patterns (Lists, Keys, Conditionals)",
    part: "React Core",
    partId: "d",
    difficulty: "Core",
    summary: "Render lists with .map() and stable keys; show/hide UI with ternaries and &&.",
    readingTime: 5,
    explanation: [
      "To render a list, you map an array to an array of elements: `items.map(item => <li key={item.id}>...</li>)`. Each element in a list needs a **key** — a stable, unique identifier React uses to track items across renders during reconciliation. Use a domain id (`item.id`); never use the array index for keys when the list can reorder, insert, or delete, because index-based keys cause React to mismatch items and produce subtle bugs.",
      "Conditional rendering uses JavaScript expressions because JSX only allows expressions. Use a **ternary** for if/else (`{approved ? <A /> : <B />}`), and the **`&&` operator** for if-only with no else (`{approved && <Button />}`). For an empty-list state, you can return early with a fallback before the `.map()`.",
      "These patterns compose: a component often guards for an empty state first, then maps the data to keyed elements, with each item using ternaries and `&&` internally to vary its display. Keeping keys stable is the single most important rule — it preserves component state and avoids unnecessary re-creation of DOM nodes.",
    ],
    keyInsights: [
      "Keys must be stable and unique — use a real id, NEVER the array index for dynamic lists.",
      "Use a ternary for if/else and && for if-only (no else) conditional rendering.",
      "Handle the empty state explicitly with an early return before mapping.",
    ],
    codeSamples: [
      {
        label: "Lists with keys and an empty-state guard",
        language: "tsx",
        code: `function ExpenseList({ items }: { items: Expense[] }) {
  // Conditional: empty state
  if (items.length === 0) {
    return <p className="text-gray-500">No expenses yet.</p>;
  }

  return (
    <ul>
      {items.map(expense => (
        // key — must be stable & unique (use id, NEVER index)
        <li key={expense.id}>
          <ExpenseCard
            title={expense.category}
            amount={expense.amount}
            category={expense.category}
          />
        </li>
      ))}
    </ul>
  );
}`,
      },
      {
        label: "Conditional patterns: ternary and &&",
        language: "tsx",
        code: `function StatusBadge({ approved }: { approved: boolean }) {
  return (
    <>
      {/* Ternary for if/else */}
      <span>{approved ? '✅ Approved' : '⏳ Pending'}</span>

      {/* && for if-only (no else) */}
      {approved && <button>Download Receipt</button>}
    </>
  );
}`,
      },
    ],
    interviewQA: [
      {
        question: "Why does React need a key on list items, and why not use the array index?",
        answer:
          "Keys give each list item a stable identity so React can match elements between renders during reconciliation, preserving their state and DOM nodes when the list changes. The array index is unstable: if items are inserted, removed, or reordered, the same index now points to a different item, causing React to reuse the wrong DOM/state and produce subtle bugs. Use a real domain id instead.",
      },
      {
        question: "What are the main conditional rendering patterns in React?",
        answer:
          "A ternary {cond ? <A /> : <B />} for if/else, the && operator {cond && <A />} for render-if-only (no else), and an early return for things like empty states. You can also assign JSX to a variable before the return when the logic is more complex. All of these are expressions, which is what JSX allows.",
      },
      {
        question: "What's a pitfall of using && for conditional rendering?",
        answer:
          "If the left side is a number like 0, React renders the 0 instead of nothing — {count && <List />} shows '0' when count is 0. Coerce to a boolean (count > 0 && ...) or use a ternary to avoid leaking falsy values like 0 or empty strings into the output.",
      },
      {
        question: "What is a controlled vs uncontrolled input?",
        answer:
          "A controlled input's value is driven by React state (value={x} with an onChange that updates state), so React is the single source of truth. An uncontrolled input keeps its own value in the DOM and you read it via a ref or on submit. Controlled is preferred for validation and dynamic behavior; uncontrolled is simpler for basic forms.",
      },
    ],
    thingsToRemember: [
      "Render lists with .map(); every item needs a stable, unique key (use an id, not the index).",
      "Ternary for if/else, && for if-only; guard empty states with an early return.",
      "Keys preserve item state across re-renders — unstable keys cause hard-to-find bugs.",
    ],
    references: [
      { label: "React — Rendering lists", url: "https://react.dev/learn/rendering-lists" },
      { label: "React — Conditional rendering", url: "https://react.dev/learn/conditional-rendering" },
    ],
    tags: ["react", "lists", "keys", "conditional-rendering"],
  },
];
