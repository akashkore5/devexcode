import type { FrontendTopic } from "../types";

export const partC: FrontendTopic[] = [
  {
    id: "es6-javascript-core",
    num: 9,
    title: "ES6+ JavaScript Core",
    part: "Language",
    partId: "c",
    difficulty: "Core",
    summary:
      "Modern JavaScript (ES2015+): const/let, strict equality, array methods, destructuring, spread, and async/await.",
    readingTime: 7,
    explanation: [
      "Modern JavaScript (ES2015+) is the foundation of everything React. Use `const` by default, `let` when reassigning, and never `var`. Always use `===` (strict equality) — `==` performs type coercion and produces surprising results, so it should be avoided.",
      "A `const` binding cannot be reassigned, but it does not freeze the value: a `const` array or object can still be mutated. This distinction matters in React, where you keep the same reference but must create new ones to signal a change.",
      "Master the array methods — `map`, `filter`, `reduce`, `find`, `some`, `every` — they are your render toolkit and map almost one-to-one onto Java Streams. They compose through chaining, letting you express transformations declaratively.",
      "Destructuring, the spread operator, and immutable updates are critical for React state. The spread operator lets you build a new object or array from an existing one with selective overrides, producing a fresh reference that React can detect. Mutating in place (`push`, direct assignment) leaves the reference unchanged, so React will not re-render. Finally, `async/await` is the modern way to handle promises, and ES Modules (`import`/`export`) organize code across files.",
    ],
    backendAnalogy:
      "Destructuring is like Java record components. Spread is like creating a copy with BeanUtils.copyProperties() then overriding fields. Async/await is like CompletableFuture.thenApply() but with cleaner syntax. The array methods (map/filter/reduce/find/some/every) line up with the Java Stream API (.map/.filter/.reduce/.findFirst/.anyMatch/.allMatch).",
    keyInsights: [
      "`const` prevents reassignment, not mutation — a const array or object can still be changed in place.",
      "Always use `===`; `==` coerces types (`1 == '1'` is true) and is a common source of bugs.",
      "For React, never mutate (`push`, direct assignment) — use spread to create a new reference so the change is detected.",
      "Array methods chain: filter then reduce to compute a total over a subset in one declarative expression.",
    ],
    codeSamples: [
      {
        label: "Declarations & strict equality",
        language: "js",
        code: `const name = 'Ada';          // string, immutable binding
let count = 0;               // reassignable
const ids = [1, 2, 3];       // array (const = can't reassign, CAN mutate)
const user = { name: 'Ada' }; // object

// Strict equality — ALWAYS use ===
1 === '1';          // false (different types)
1 == '1';           // true (coercion — never use this)
null === undefined; // false`,
      },
      {
        label: "Array methods (map, filter, reduce, find)",
        language: "js",
        code: `const expenses = [
  { id: 1, amount: 120, category: 'meals', approved: true },
  { id: 2, amount: 800, category: 'travel', approved: false },
  { id: 3, amount: 250, category: 'meals', approved: true },
];

// map — transform each item (like Java Stream .map())
const amounts = expenses.map(e => e.amount); // [120, 800, 250]

// filter — keep matching items (like .filter())
const approved = expenses.filter(e => e.approved); // 2 items

// reduce — accumulate into a single value (like .reduce())
const total = expenses.reduce((sum, e) => sum + e.amount, 0); // 1170

// find — first match (like .findFirst())
const first = expenses.find(e => e.category === 'travel');

// some / every — boolean checks (like .anyMatch / .allMatch)
const hasTravel = expenses.some(e => e.category === 'travel'); // true
const allApproved = expenses.every(e => e.approved);           // false

// Chaining — compose operations
const approvedTotal = expenses
  .filter(e => e.approved)
  .reduce((sum, e) => sum + e.amount, 0); // 370`,
      },
      {
        label: "Immutable updates with spread",
        language: "js",
        code: `// Object destructuring
const { name, role } = user;

// Array destructuring
const [first, ...rest] = [1, 2, 3]; // first=1, rest=[2,3]

// Spread — immutable updates (CRITICAL for React)
const updated = { ...user, role: 'admin' };            // new object
const withNew = [...expenses, { id: 4, amount: 50 }];  // new array

// WRONG — mutation (React won't detect the change)
user.role = 'admin';
expenses.push(newItem);

// RIGHT — new reference (React detects change)
const newUser = { ...user, role: 'admin' };
const newList = [...expenses, newItem];`,
      },
      {
        label: "Async/await, fetch, and modules",
        language: "js",
        code: `// async/await — modern way to handle promises
async function loadExpenses() {
  try {
    const response = await fetch('/api/expenses');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to load:', error.message);
    throw error;
  }
}

// ES Modules (import/export)
// math.js
export function sum(a, b) { return a + b; }
export default function multiply(a, b) { return a * b; }

// app.js
import multiply, { sum } from './math.js';`,
      },
    ],
    runnable: {
      title: "Array methods, destructuring & immutable updates",
      js: `const expenses = [
  { id: 1, amount: 120, category: 'meals', approved: true },
  { id: 2, amount: 800, category: 'travel', approved: false },
  { id: 3, amount: 250, category: 'meals', approved: true },
];

// map / filter / reduce
const amounts = expenses.map(e => e.amount);
console.log('amounts:', amounts);
console.log('total:', expenses.reduce((s, e) => s + e.amount, 0));

// chaining: total of approved only
const approvedTotal = expenses
  .filter(e => e.approved)
  .reduce((s, e) => s + e.amount, 0);
console.log('approvedTotal:', approvedTotal);

// some / every
console.log('hasTravel:', expenses.some(e => e.category === 'travel'));
console.log('allApproved:', expenses.every(e => e.approved));

// destructuring
const [head, ...rest] = [1, 2, 3];
console.log('head:', head, 'rest:', rest);

// immutable update — new reference, original untouched
const user = { name: 'Ada', role: 'user' };
const promoted = { ...user, role: 'admin' };
console.log('original:', user.role, '| new:', promoted.role);
console.log('same reference?', user === promoted);

// strict vs loose equality
console.log("1 === '1':", 1 === '1');
console.log("1 == '1':", 1 == '1');`,
    },
    interviewQA: [
      {
        question: "What is the difference between let, const, and var?",
        answer:
          "var is function-scoped and hoisted (initialized to undefined), which leads to surprising bugs. let and const are block-scoped and live in a temporal dead zone until declared. const cannot be reassigned, let can. Note const only prevents reassignment of the binding — the underlying object or array can still be mutated. Best practice: const by default, let when you must reassign, never var.",
      },
      {
        question: "Why must you avoid == in favor of ===?",
        answer:
          "== performs type coercion before comparing, so 1 == '1' is true, 0 == '' is true, and null == undefined is true — all error-prone. === compares value and type with no coercion, making comparisons predictable. Always use strict equality.",
      },
      {
        question: "Why is the spread operator important in React state updates?",
        answer:
          "React decides whether to re-render by comparing references. If you mutate an array with push or assign to an object property directly, the reference stays the same and React sees no change. Spreading into a new object/array ({ ...obj, key: val } or [...arr, item]) produces a fresh reference, so React detects the update and re-renders.",
      },
      {
        question: "How does async/await improve on raw promises and callbacks?",
        answer:
          "async/await lets you write asynchronous code that reads top-to-bottom like synchronous code. await pauses inside an async function until the promise settles, and errors are handled with ordinary try/catch instead of .catch chains or nested callbacks. Under the hood it is still promises — an async function always returns a promise.",
      },
    ],
    thingsToRemember: [
      "const by default, let to reassign, never var; const blocks reassignment but not mutation.",
      "Always === ; map/filter/reduce/find/some/every are your render toolkit and mirror Java Streams.",
      "Spread for immutable updates so React detects a new reference; never push or mutate state in place.",
    ],
    references: [
      { label: "MDN — JavaScript guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
      { label: "javascript.info — Modern JS Tutorial", url: "https://javascript.info" },
      { label: "ES6 features overview", url: "https://es6-features.org" },
    ],
    tags: ["javascript", "es6", "async-await", "immutability", "array-methods"],
  },
  {
    id: "typescript",
    num: 10,
    title: "TypeScript",
    part: "Language",
    partId: "c",
    difficulty: "Core",
    summary:
      "Static types on top of JavaScript: interfaces, generics, union literals, type narrowing, utility types, and enums.",
    readingTime: 6,
    explanation: [
      "TypeScript adds static types to JavaScript, catching errors in the editor before they reach the browser. For a Java developer, the concepts are deeply familiar: interfaces, generics, and compile-time checks. TypeScript is mandatory in this program.",
      "An `interface` describes the shape of data — a contract — just like a Java interface or POJO. Fields can be marked optional with `?`, and you can constrain a field to a fixed set of values using a union of string literals (e.g. `'meals' | 'travel' | 'other'`).",
      "Generics work just like Java generics: a function such as `firstItem<T>(items: T[]): T | undefined` is parameterized by a type. **Type narrowing** lets the compiler refine a union type inside a branch (using `typeof`, similar to `instanceof` checks), so `value: string | number` is treated as a number in one branch and a string in another.",
      "**Utility types** transform existing types: `Partial<T>` makes every field optional, `Pick<T, K>` selects a subset of fields, and `Readonly<T>` makes a type immutable. **Enums** give you named constant sets. The most important rule: never use `any` — it defeats the purpose of TypeScript. Use `unknown` when the type is genuinely unknown, then narrow it with type guards.",
    ],
    backendAnalogy:
      "Think of TypeScript as Java's type system applied to JavaScript. An interface is a Java interface/POJO contract; generics are Java generics; union-literal types are like a constrained enum of allowed values; and type narrowing with typeof is the equivalent of an instanceof check that the compiler tracks for you.",
    keyInsights: [
      "Never use `any` — it disables type checking. Use `unknown` for genuinely unknown values, then narrow with type guards.",
      "Union literal types (`'meals' | 'travel' | 'other'`) constrain a field to a fixed set of allowed values at compile time.",
      "Utility types (`Partial`, `Pick`, `Readonly`) derive new types from existing ones instead of duplicating shapes.",
      "Generics (`<T>`) preserve type information through functions just like Java generics.",
    ],
    codeSamples: [
      {
        label: "Interfaces, generics, narrowing, utility types & enums",
        language: "ts",
        code: `// Interface — a contract for data shape (like a Java interface/POJO)
interface Expense {
  id: number;
  amount: number;
  category: 'meals' | 'travel' | 'other'; // union of literals
  approved: boolean;
  note?: string;                           // optional field
}

// Generics (just like Java generics)
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}
const expense = firstItem<Expense>(expenses); // Expense | undefined

// Type narrowing (like instanceof checks)
function formatValue(value: string | number): string {
  if (typeof value === 'number') return value.toFixed(2);
  return value.toUpperCase();
}

// Utility types
type ExpenseUpdate = Partial<Expense>;           // all fields optional
type ExpenseKey = Pick<Expense, 'id' | 'amount'>; // subset
type ReadonlyExpense = Readonly<Expense>;        // immutable

// Typing a function
function totalApproved(items: Expense[]): number {
  return items
    .filter(e => e.approved)
    .reduce((sum, e) => sum + e.amount, 0);
}

// Enums
enum Status {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved'
}
const current: Status = Status.DRAFT;`,
      },
    ],
    runnable: {
      title: "The same logic as plain JS (types erased at runtime)",
      js: `// TypeScript types disappear after compilation — this is the emitted JS.
const expenses = [
  { id: 1, amount: 120, category: 'meals', approved: true },
  { id: 2, amount: 800, category: 'travel', approved: false },
  { id: 3, amount: 250, category: 'meals', approved: true },
];

// generic firstItem<T> compiles to a plain function
function firstItem(items) { return items[0]; }
console.log('first:', firstItem(expenses));

// type narrowing on string | number
function formatValue(value) {
  if (typeof value === 'number') return value.toFixed(2);
  return value.toUpperCase();
}
console.log(formatValue(42));      // "42.00"
console.log(formatValue('meals')); // "MEALS"

// totalApproved
const total = expenses
  .filter(e => e.approved)
  .reduce((sum, e) => sum + e.amount, 0);
console.log('totalApproved:', total);

// enum compiles to an object of named constants
const Status = { DRAFT: 'draft', SUBMITTED: 'submitted', APPROVED: 'approved' };
console.log('current:', Status.DRAFT);`,
    },
    interviewQA: [
      {
        question: "What is the difference between any and unknown?",
        answer:
          "any opts out of type checking entirely — you can call anything on it, defeating the purpose of TypeScript. unknown is the type-safe counterpart: it accepts any value, but you cannot use it until you narrow it with a type guard (typeof, instanceof, or a custom predicate). Prefer unknown for genuinely unknown values and never reach for any.",
      },
      {
        question: "When would you use an interface versus a type alias?",
        answer:
          "Both describe shapes. interface is open and can be extended or declaration-merged, which suits public object/class contracts. type aliases are more flexible: they can express unions, intersections, tuples, mapped, and conditional types. A common convention is interfaces for object shapes you expect to extend, and type aliases for unions and computed types. Functionally they overlap heavily for plain object shapes.",
      },
      {
        question: "What are generics and why use them?",
        answer:
          "Generics parameterize code by type, like Java generics. firstItem<T>(items: T[]): T | undefined preserves the element type through the call, so the result is correctly typed instead of any. They let you write reusable, type-safe functions, components, and data structures without losing type information.",
      },
      {
        question: "What do the utility types Partial, Pick, and Readonly do?",
        answer:
          "They derive new types from existing ones. Partial<T> makes every property optional (handy for update payloads). Pick<T, K> selects a subset of properties by key. Readonly<T> marks all properties immutable. Using them keeps types DRY — you derive variants from a single source of truth instead of duplicating the shape.",
      },
    ],
    thingsToRemember: [
      "Never use any; use unknown and narrow with type guards (typeof / instanceof).",
      "Interfaces = data contracts, generics = type parameters, union literals = a fixed allowed set.",
      "Utility types (Partial, Pick, Readonly) derive variants from one source type; enums name constant sets.",
    ],
    references: [
      { label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
      {
        label: "TypeScript for Java/OOP programmers",
        url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html",
      },
      { label: "TypeScript Playground", url: "https://www.typescriptlang.org/play" },
    ],
    tags: ["typescript", "types", "generics", "interfaces", "utility-types"],
  },
];
