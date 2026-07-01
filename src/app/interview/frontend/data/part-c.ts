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
      "Everything modern JavaScript gives you end to end: block scope with let/const, arrow functions and lexical this, template literals, destructuring, spread/rest, default params, ES Modules, promises and async/await, the map/filter/reduce toolkit, optional chaining and nullish coalescing, and the immutable-update patterns React lives on — beginner to advanced in one page.",
    readingTime: 20,
    explanation: [
      "**What ES6+ is and why it matters.** 'ES6' is ECMAScript 2015 — the release that modernised JavaScript — and 'ES6+' loosely means everything since (ES2016 through today). It is the dialect React, Node, and every modern tool assume. You do not need to memorise version numbers; you need to internalise a handful of features that changed how we declare variables, write functions, move data around, and handle asynchrony. Master these and every React tutorial suddenly reads like plain English.",
      "**let, const, var and scope.** `var` is function-scoped and hoisted — it is visible (as `undefined`) before its own line runs, which causes subtle bugs. `let` and `const` are **block-scoped**: they exist only inside the nearest `{ }` and live in a **temporal dead zone** (referencing them before declaration throws) which catches mistakes early. Rule: `const` by default, `let` only when you must reassign, `var` never. Crucially, `const` freezes the **binding**, not the **value** — a `const` array or object can still be mutated in place; you just can't point the name at something else.",
      "**Arrow functions and lexical this.** Arrow functions (`const add = (a, b) => a + b`) are shorter, and — the real reason they exist — they do **not** bind their own `this`. They capture `this` from the surrounding (lexical) scope. In old code you wrote `const self = this` or `.bind(this)` to use `this` inside a callback; arrows make that noise disappear, which is why event handlers and array callbacks are almost always arrows. Trade-off: because they have no own `this`, do not use an arrow as an object method that needs `this`, or as a constructor.",
      "**Template literals.** Backtick strings let you interpolate expressions with the dollar-brace syntax and write multi-line strings without escapes. Instead of `'Hello ' + name + '!'` you write a backtick string with the name interpolated inline. They also power **tagged templates** (the mechanism behind styled-components) where a function receives the string parts and the interpolated values separately.",
      "**Destructuring.** Pull fields out of objects and arrays into local variables in one line: `const { name, role } = user` and `const [first, second] = list`. You can rename (`const { id: userId } = user`), supply defaults (`const { page = 1 } = query`), and destructure nested shapes and function parameters. React uses this everywhere — `const [count, setCount] = useState(0)` is array destructuring, and `function Card({ title, children })` is parameter destructuring.",
      "**Spread and rest.** They look identical (`...`) but do opposite things. **Spread** *expands* an iterable into its elements — copy and merge objects (`{ ...a, ...b }`), clone and extend arrays (`[...list, item]`), or pass an array as arguments (`Math.max(...nums)`). **Rest** *collects* the leftovers into one variable — `function log(first, ...others)` gathers remaining arguments into `others`, and `const [head, ...tail] = arr` gathers the rest of the array. Same symbol, position tells you which.",
      "**Default parameters.** Give a parameter a fallback used only when the argument is `undefined`: `function greet(name = 'friend')`. Defaults are evaluated at call time and can reference earlier parameters. They replaced the old `name = name || 'friend'` idiom, which mis-fired on falsy-but-valid values like `0` or `''`.",
      "**ES Modules (import/export).** Modern JavaScript splits code into files that explicitly declare what they share. A file can have many **named exports** (`export function sum() {}`) imported by name with braces, and **one default export** imported without braces under any name. Imports are hoisted and statically analysable, which is what lets bundlers **tree-shake** unused code. This is the module system React, Next.js, and every build tool use — CommonJS `require` is the older Node style you'll still meet.",
      "**Promises.** A `Promise` is an object representing a value that will exist *later* — it is `pending`, then either `fulfilled` (with a value) or `rejected` (with an error). You react with `.then(onFulfilled)` and `.catch(onError)`, and each `.then` returns a new promise so they **chain** instead of nesting into callback hell. `Promise.all([...])` runs several in parallel and resolves when all settle; `Promise.race`, `Promise.allSettled`, and `Promise.any` cover the other combinations.",
      "**async/await.** `async`/`await` is syntactic sugar over promises that lets asynchronous code read top-to-bottom like synchronous code. `await` pauses an `async` function until a promise settles and unwraps its value; errors surface through ordinary `try/catch` instead of `.catch` chains. An `async` function **always** returns a promise, so callers still `await` it. This is the default style for data fetching in modern apps.",
      "**The array toolkit — map, filter, reduce, find.** These non-mutating methods are your render and data-shaping workhorses and map almost one-to-one onto Java Streams. `map` transforms each element into a new array of the same length (this is how React renders lists). `filter` keeps elements that pass a test. `reduce` folds an array into a single accumulated value (sum, group, index). `find` returns the first match (or `undefined`); `some`/`every` return booleans. They **chain** — `filter(...).map(...).reduce(...)` — to express pipelines declaratively, and none of them mutate the source array.",
      "**Optional chaining and nullish coalescing.** `?.` short-circuits: `user?.profile?.avatar` returns `undefined` instead of throwing if any link is `null`/`undefined` — no more `user && user.profile && ...` ladders. `??` supplies a fallback **only** when the left side is `null` or `undefined`, unlike `||` which also fires on `0`, `''`, and `false`. Combine them: `const page = query?.page ?? 1` safely reads a possibly-missing value with a sane default. `?.()` and `?.[]` extend the idea to calls and index access.",
      "**Immutable update patterns (why React needs them).** React re-renders by comparing **references**, not deep contents. If you `push` into an array or assign to `obj.key`, the reference is unchanged and React sees nothing. Instead you create a **new** reference: `{ ...obj, key: val }` to change a field, `[...arr, item]` to add, `arr.filter(x => x.id !== id)` to remove, and `arr.map(x => x.id === id ? { ...x, done: true } : x)` to update one item. For nested state you spread at each level you change. This 'copy-on-write' discipline is the single most important habit for correct React state.",
      "**The mental model (memorise this).** Declare with `const`/`let` (block-scoped, `const` freezes the binding not the value); reach for arrows to keep `this` lexical; destructure to unpack and spread/rest to copy and gather; treat data as immutable — always produce a *new* reference (`{...}` / `[...]` / `map`/`filter`) so React notices; and handle asynchrony with `async/await` over promises, guarding missing data with `?.` and `??`.",
    ],
    backendAnalogy:
      "The array toolkit is the Java Stream API almost verbatim: map/filter/reduce/find/some/every line up with .map/.filter/.reduce/.findFirst/.anyMatch/.allMatch. Destructuring is like reading a Java record's components into locals. Spreading into a new object is BeanUtils.copyProperties() to a fresh instance then overriding a field — you never mutate the original. ES Modules are Java packages with explicit exports/imports (a default export is like the primary public class). Promises are CompletableFuture, and async/await is CompletableFuture.thenApply/thenCompose written in a flat, blocking-looking style — an async method 'returning a value' really returns a CompletableFuture the caller composes on. Optional chaining (?.) and ?? together are Java's Optional.map(...).orElse(default).",
    keyInsights: [
      "const by default, let to reassign, never var. let/const are block-scoped with a temporal dead zone; var is function-scoped and hoisted.",
      "const freezes the binding, not the value — a const array or object can still be mutated in place.",
      "Arrow functions have no own this — they capture it lexically, which is why they are the default for callbacks and handlers; don't use them as methods needing this or as constructors.",
      "Spread (...) expands/copies; rest (...) collects leftovers — same symbol, position decides which.",
      "map returns a same-length transformed array (React list rendering), filter narrows, reduce folds to one value, find returns the first match — and none mutate the source.",
      "async functions always return a promise; await unwraps it and errors go through try/catch. It is sugar over promises, not a replacement.",
      "?. short-circuits on null/undefined; ?? supplies a fallback only for null/undefined (unlike || which also triggers on 0, '' and false).",
      "React compares references — mutation (push, obj.key = x) is invisible to it. Always create a new reference with spread, map, or filter.",
      "Default params fire only on undefined, fixing the old `x || fallback` bug that mis-handled 0 and empty string.",
      "ES Modules: many named exports (braces on import) + one default export (no braces); static imports enable tree-shaking.",
    ],
    codeSamples: [
      {
        label: "Declarations, scope, arrows & template literals",
        language: "js",
        code: `// const by default, let to reassign, never var
const name = 'Ada';        // immutable binding
let count = 0;             // reassignable
count += 1;

// const freezes the BINDING, not the VALUE
const ids = [1, 2, 3];
ids.push(4);               // OK — mutating the array is allowed
// ids = [];               // TypeError — reassigning the binding is not

// Block scope + temporal dead zone
{
  let scoped = 'only here';
  console.log(scoped);
}
// console.log(scoped);    // ReferenceError — not visible outside the block

// Arrow functions capture 'this' lexically (great for callbacks)
const nums = [1, 2, 3];
const doubled = nums.map((n) => n * 2);   // concise body: implicit return

// Template literals: interpolation + multi-line, no concatenation
const greeting = \`Hi \${name}, you have \${count} messages\`;
const html = \`<li class="row">\${name}</li>\`;`,
      },
      {
        label: "Destructuring, spread/rest & default params",
        language: "js",
        code: `const user = { id: 7, name: 'Ada', role: 'user' };

// Object destructuring — with rename and default
const { name, role, page = 1 } = user;      // page falls back to 1
const { id: userId } = user;                 // rename id -> userId

// Array destructuring — with rest
const [first, ...others] = [10, 20, 30];     // first=10, others=[20,30]

// Spread: copy + merge objects, clone + extend arrays
const merged = { ...user, role: 'admin' };   // new object, role overridden
const extended = [first, ...others, 40];     // new array

// Spread as arguments
console.log(Math.max(...[4, 9, 2]));         // 9

// Rest: collect variadic arguments
function logAll(label, ...values) {          // values is a real array
  console.log(label, values.length);
}

// Default parameters (fire only on undefined)
function greet(who = 'friend') { return \`Hello, \${who}!\`; }
greet();        // "Hello, friend!"
greet(0);       // "Hello, 0!"  — 0 is a valid argument, default not used`,
      },
      {
        label: "Array toolkit: map / filter / reduce / find (+ chaining)",
        language: "js",
        code: `const expenses = [
  { id: 1, amount: 120, category: 'meals',  approved: true },
  { id: 2, amount: 800, category: 'travel', approved: false },
  { id: 3, amount: 250, category: 'meals',  approved: true },
];

// map — transform each item (this is how React renders lists)
const amounts = expenses.map((e) => e.amount);        // [120, 800, 250]

// filter — keep matching items
const approved = expenses.filter((e) => e.approved);  // 2 items

// reduce — fold into a single value (sum, group, index...)
const total = expenses.reduce((sum, e) => sum + e.amount, 0); // 1170

// find — first match or undefined; some/every — booleans
const firstTravel = expenses.find((e) => e.category === 'travel');
const hasTravel   = expenses.some((e) => e.category === 'travel');  // true
const allApproved = expenses.every((e) => e.approved);              // false

// Chaining — a declarative pipeline, source never mutated
const approvedMealsTotal = expenses
  .filter((e) => e.approved && e.category === 'meals')
  .reduce((sum, e) => sum + e.amount, 0);             // 370

// reduce to build a lookup index (id -> item)
const byId = expenses.reduce((acc, e) => ({ ...acc, [e.id]: e }), {});`,
      },
      {
        label: "Immutable updates for React state",
        language: "js",
        code: `const state = { user: { name: 'Ada', role: 'user' }, tags: ['a', 'b'] };

// WRONG — mutation: same reference, React sees no change
// state.user.role = 'admin';
// state.tags.push('c');

// RIGHT — new references at every level you change
const updateRole = { ...state, user: { ...state.user, role: 'admin' } };
const addTag     = { ...state, tags: [...state.tags, 'c'] };
const removeTag  = { ...state, tags: state.tags.filter((t) => t !== 'a') };

// Update ONE item in a list by id
const todos = [{ id: 1, done: false }, { id: 2, done: false }];
const toggled = todos.map((t) => (t.id === 1 ? { ...t, done: true } : t));

// Optional chaining + nullish coalescing for safe reads
const avatar = state.user?.profile?.avatar ?? '/default.png';
const label  = state.count ?? 0;   // 0 stays 0 (|| would wrongly override)`,
      },
      {
        label: "Promises, async/await & ES Modules",
        language: "js",
        code: `// --- math.js ---
export function sum(a, b) { return a + b; }        // named export
export default function multiply(a, b) {           // default export
  return a * b;
}

// --- app.js ---
import multiply, { sum } from './math.js';         // default + named

// async/await reads top-to-bottom; errors via try/catch
async function loadExpenses() {
  try {
    const res = await fetch('/api/expenses');
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();                        // an async fn returns a Promise
  } catch (err) {
    console.error('Failed to load:', err.message);
    throw err;                                      // let the caller decide
  }
}

// Run independent requests in parallel with Promise.all
async function loadDashboard() {
  const [user, stats] = await Promise.all([
    fetch('/api/user').then((r) => r.json()),
    fetch('/api/stats').then((r) => r.json()),
  ]);
  return { user, stats };
}`,
      },
    ],
    runnable: {
      title: "Array toolkit, destructuring, immutable updates & ?. ?? live",
      js: `const expenses = [
  { id: 1, amount: 120, category: 'meals',  approved: true },
  { id: 2, amount: 800, category: 'travel', approved: false },
  { id: 3, amount: 250, category: 'meals',  approved: true },
];

// map / reduce
console.log('amounts:', expenses.map((e) => e.amount));
console.log('total:', expenses.reduce((s, e) => s + e.amount, 0));

// chaining: approved meals only
const approvedMeals = expenses
  .filter((e) => e.approved && e.category === 'meals')
  .reduce((s, e) => s + e.amount, 0);
console.log('approvedMealsTotal:', approvedMeals);

// some / every / find
console.log('hasTravel:', expenses.some((e) => e.category === 'travel'));
console.log('allApproved:', expenses.every((e) => e.approved));
console.log('firstTravel:', expenses.find((e) => e.category === 'travel'));

// destructuring + rest
const [head, ...tail] = [1, 2, 3];
console.log('head:', head, 'tail:', tail);

// immutable update — original untouched, new reference produced
const user = { name: 'Ada', role: 'user' };
const promoted = { ...user, role: 'admin' };
console.log('original role:', user.role, '| new role:', promoted.role);
console.log('same reference?', user === promoted);

// optional chaining + nullish coalescing
const cfg = { count: 0 };
console.log('avatar:', cfg.profile?.avatar ?? '/default.png');
console.log('count ?? 5 :', cfg.count ?? 5);   // 0 (?? keeps 0)
console.log('count || 5 :', cfg.count || 5);   // 5 (|| wrongly overrides 0)

// async/await via a resolved promise
async function run() {
  const value = await Promise.resolve(42);
  console.log('awaited value:', value);
}
run();`,
    },
    interviewQA: [
      {
        question: "What is the difference between let, const, and var?",
        answer:
          "var is function-scoped and hoisted (visible as undefined before its line), which causes subtle bugs. let and const are block-scoped and live in a temporal dead zone until declared, so using them early throws. const cannot be reassigned; let can. Note const only prevents reassignment of the binding — the underlying object or array can still be mutated. Best practice: const by default, let when you must reassign, never var.",
      },
      {
        question: "Why do arrow functions matter, and when should you NOT use one?",
        answer:
          "Arrow functions are concise and, crucially, do not bind their own this — they capture it lexically from the enclosing scope, which removes the old const self = this / .bind(this) boilerplate and makes them ideal for callbacks and event handlers. Do not use an arrow as an object method that relies on this, or as a constructor (they can't be newed), or where you need the arguments object.",
      },
      {
        question: "Spread vs rest — same syntax, so what's the difference?",
        answer:
          "Both use the ... token but do opposite things. Spread expands an iterable into individual elements — copying/merging objects ({ ...a, ...b }), cloning/extending arrays ([...arr, x]), or passing an array as arguments (fn(...args)). Rest collects the remaining items into one variable — gathering leftover function arguments (function f(a, ...rest)) or the tail of an array ([first, ...rest]). Position tells you which: rest appears on the left of an assignment or in a parameter list; spread appears on the right or in a call.",
      },
      {
        question: "Why is the spread operator essential for React state updates?",
        answer:
          "React decides whether to re-render by comparing references. If you mutate an array with push or assign to an object property directly, the reference is unchanged and React sees no update. Spreading into a new object/array ({ ...obj, key } or [...arr, item]), or using map/filter, produces a fresh reference at each changed level, so React detects the change and re-renders. Mutation is the number-one cause of 'my state changed but the UI didn't update.'",
      },
      {
        question: "How does async/await improve on raw promises and callbacks?",
        answer:
          "async/await lets asynchronous code read top-to-bottom like synchronous code. await pauses inside an async function until the promise settles and unwraps its value, and errors are handled with ordinary try/catch instead of .catch chains or nested callbacks. Under the hood it is still promises — an async function always returns a promise — so it composes with Promise.all and existing then-based APIs.",
      },
      {
        question: "What is the difference between ?? and ||?",
        answer:
          "Both provide a fallback, but || triggers on any falsy value — 0, '', false, NaN, null, undefined — which wrongly overrides valid values like 0 or an empty string. The nullish coalescing operator ?? triggers only when the left side is null or undefined, so const page = query.page ?? 1 keeps a legitimate 0 while still defaulting a missing value.",
      },
      {
        question: "What does optional chaining (?.) do and what does it return?",
        answer:
          "?. accesses a nested property/method/index only if the value to its left is not null or undefined; otherwise it short-circuits and evaluates to undefined instead of throwing a TypeError. So user?.profile?.avatar safely returns undefined if user or profile is missing. It also works for calls (fn?.()) and dynamic keys (obj?.[key]). Pair it with ?? to supply a default.",
      },
      {
        question: "What's the difference between named and default exports in ES Modules?",
        answer:
          "A module can have many named exports (export function sum(){}), imported by their exact name inside braces: import { sum } from './math'. It can have at most one default export (export default ...), imported without braces under any name you choose: import multiply from './math'. Named exports aid discoverability and tree-shaking; default exports suit a module's single primary value. You can mix both in one import statement.",
      },
    ],
    thingsToRemember: [
      "const by default, let to reassign, never var; const blocks reassignment but not mutation.",
      "let/const are block-scoped with a temporal dead zone; var is function-scoped and hoisted.",
      "Arrow functions capture this lexically — default for callbacks; avoid as methods/constructors.",
      "Spread expands/copies; rest collects. map/filter/reduce/find are your non-mutating render toolkit and mirror Java Streams.",
      "For React state always create a new reference: { ...obj }, [...arr], map, filter — never push or mutate in place.",
      "Default params fire only on undefined (fixes the old `x || fallback` bug on 0 and '').",
      "async functions always return a promise; await + try/catch replaces .then/.catch chains.",
      "?. short-circuits on null/undefined; ?? falls back only on null/undefined (|| also fires on 0/''/false).",
      "ES Modules: many named exports (braces) + one default (no braces); static imports enable tree-shaking.",
      "Template literals interpolate expressions and span multiple lines — stop concatenating strings.",
    ],
    references: [
      { label: "MDN — JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
      { label: "MDN — Destructuring assignment", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment" },
      { label: "MDN — Using promises", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises" },
      { label: "MDN — Optional chaining (?.)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining" },
      { label: "javascript.info — The Modern JavaScript Tutorial", url: "https://javascript.info" },
      { label: "web.dev — JavaScript modules", url: "https://web.dev/articles/es-modules-in-browsers" },
    ],
    tags: ["javascript", "es6", "arrow-functions", "destructuring", "spread-rest", "async-await", "promises", "modules", "immutability", "array-methods", "optional-chaining"],
  },
  {
    id: "typescript",
    num: 10,
    title: "TypeScript",
    part: "Language",
    partId: "c",
    difficulty: "Core",
    summary:
      "TypeScript from the ground up: why static types pay off, primitives, interfaces vs type aliases, unions and intersections, generics, enums, type narrowing, the everyday utility types (Partial/Pick/Omit/Record), typing functions and React props, structural typing, and the tsconfig strictness that makes it all worthwhile — beginner to advanced in one page.",
    readingTime: 20,
    explanation: [
      "**Why types at all?** TypeScript is JavaScript plus a static type layer that is checked by the compiler and then **erased** — the browser runs plain JavaScript with no types left. The payoff is catching whole classes of bugs (typos, wrong arguments, null access, refactors that miss a call site) in your editor, seconds after typing, instead of in production. You also get world-class autocomplete and safe rename-across-project. For a Java developer the deal is familiar: trade a little ceremony for compile-time guarantees and tooling. In this program TypeScript is mandatory.",
      "**Primitives and inference.** The core types are `string`, `number`, `boolean`, `null`, `undefined`, plus `bigint` and `symbol`. Arrays are `number[]` (or `Array<number>`); fixed-length tuples are `[string, number]`; a value can be `object` or a precise shape. You rarely annotate everything — TypeScript **infers** types from initialisers, so `let n = 3` is already `number`. Annotate the *boundaries* (function parameters, exported APIs, empty containers); let inference handle the middle.",
      "**Interfaces describe object shapes.** An `interface` is a contract for the shape of data — like a Java interface or POJO. Fields can be optional with `?`, `readonly`, or index signatures (`[key: string]: number`). Interfaces can **extend** other interfaces and are **open** (declaration merging), which suits public object and class contracts you expect others to build on.",
      "**Interfaces vs type aliases.** A `type` alias names *any* type, not just object shapes: primitives, unions, intersections, tuples, function types, and mapped/conditional types. For a plain object shape `interface` and `type` are nearly interchangeable. The practical convention: reach for `interface` when you want an extendable/mergeable object or class contract, and `type` when you need a union, intersection, tuple, or a computed type. Pick one style and stay consistent.",
      "**Unions and intersections.** A **union** (`A | B`) means a value is *one of* several types — the workhorse being **string-literal unions** like `'meals' | 'travel' | 'other'`, which constrain a field to a fixed allowed set at compile time (a lightweight enum). An **intersection** (`A & B`) means a value has *all* the members of both — handy for composing props (`ButtonProps & { icon: string }`). Discriminated unions (each variant carrying a common literal `kind` field) are the idiomatic way to model 'one of several shapes' and narrow them safely.",
      "**Type narrowing.** Inside a branch, TypeScript **narrows** a broad type to a more specific one using control-flow analysis: `typeof x === 'number'`, `Array.isArray(x)`, `instanceof`, truthiness checks (`if (user)`), `in` checks (`'radius' in shape`), and custom **type guards** (`function isCat(a): a is Cat`). For a discriminated union, `switch (shape.kind)` narrows to the matching variant in each case. This is the compiler tracking your `instanceof`-style checks for you so the code inside is fully typed.",
      "**Generics.** Generics parameterise code by type, exactly like Java generics. `function firstItem<T>(items: T[]): T | undefined` preserves the element type through the call so the result isn't `any`. You can **constrain** a parameter (`<T extends { id: number }>`), give **defaults** (`<T = string>`), and generic types flow through classes, interfaces, and React components (`useState<User | null>(null)`). They give you reuse without losing type information.",
      "**Enums (and the alternative).** An `enum` names a set of related constants (`enum Status { Draft = 'draft', Sent = 'sent' }`). String enums are readable and safe; numeric enums auto-increment. Note enums emit real runtime code (they aren't erased), so many teams prefer a **string-literal union** plus a `const` object (`as const`) for a zero-runtime-cost equivalent. Know both; enums remain common in existing codebases.",
      "**Utility types.** These transform existing types so you don't duplicate shapes. `Partial<T>` makes every field optional (perfect for update/patch payloads). `Required<T>` is the inverse. `Pick<T, K>` selects a subset of keys; `Omit<T, K>` removes keys. `Record<K, V>` builds a map type (`Record<string, User>`). `Readonly<T>` freezes all fields. `Parameters<F>` and `ReturnType<F>` extract a function's argument and return types. Deriving variants from one source type keeps your models DRY.",
      "**Typing functions and React props.** A function type is `(a: number, b: number) => number`; parameters can be optional (`b?: number`), have defaults, or use rest (`...args: number[]`). In React you type a component's props with an interface or type and destructure them: a `Button` taking a `label` string, an optional `variant` string-literal union, and an `onClick` handler typed as `() => void`. Children are typed with `React.ReactNode`, and events with the matching React event type (`React.ChangeEvent<HTMLInputElement>`). Well-typed props are living documentation and prevent misuse at the call site.",
      "**Structural typing (the big mental shift from Java).** TypeScript is **structurally** typed, not nominally: compatibility is decided by *shape*, not by name or explicit `implements`. If an object has all the members a type requires, it *is* that type — no declaration needed. This is 'duck typing' checked at compile time, and it's why a plain object literal can satisfy an interface it never mentions. It makes TypeScript flexible but occasionally surprising to Java developers used to nominal typing.",
      "**tsconfig and strictness.** The compiler's behaviour lives in `tsconfig.json`. The one setting that matters most is `\"strict\": true`, which turns on `strictNullChecks` (null/undefined are not silently assignable — you must handle them), `noImplicitAny` (untyped values are an error, not silent `any`), and several more. Strict mode is where TypeScript earns its keep; turning it off gives you JavaScript with extra syntax. The cardinal rule: never reach for `any` (it disables checking) — use `unknown` for genuinely unknown values and **narrow** it before use.",
      "**The mental model (memorise this).** Types are compile-time only and erased at runtime. Describe shapes with interfaces/types, constrain values with string-literal unions, reuse logic with generics, and derive variants with utility types (Partial/Pick/Omit/Record). Let inference do the interior work and annotate the boundaries. Compatibility is structural (shape, not name). Turn on `strict`, handle null explicitly, and never use `any` — reach for `unknown` and narrow.",
    ],
    backendAnalogy:
      "TypeScript is Java's type discipline applied to JavaScript, with two twists. An interface is a Java interface/POJO contract, generics are Java generics (including bounds via `T extends ...`), string-literal unions are a constrained enum of allowed values, and type narrowing with typeof/instanceof/type guards is the compiler tracking your instanceof checks so the branch is fully typed. Utility types are like deriving DTO variants from one entity instead of hand-writing each. The key difference is structural vs nominal typing: Java needs an explicit `implements`, whereas TypeScript accepts any object whose shape matches — duck typing verified at compile time. And `\"strict\": true` with strictNullChecks is the equivalent of finally taking Optional and NullPointerException seriously.",
    keyInsights: [
      "Types are erased at compile time — the browser runs plain JavaScript. TypeScript's value is editor-time bug catching, autocomplete, and safe refactors.",
      "Annotate boundaries (params, exported APIs, empty containers); let inference handle everything in between.",
      "interface for extendable object/class contracts; type alias for unions, intersections, tuples, and computed types. They overlap for plain object shapes.",
      "String-literal unions ('a' | 'b' | 'c') constrain a value to a fixed set at compile time — a lightweight, zero-runtime enum.",
      "Narrowing (typeof, instanceof, in, Array.isArray, truthiness, custom guards, discriminated unions) refines a broad type inside a branch.",
      "Generics (<T>, plus constraints and defaults) preserve type information through functions, classes, and React components — just like Java generics.",
      "Utility types derive variants from one source: Partial, Required, Pick, Omit, Record, Readonly, ReturnType — keep models DRY.",
      "TypeScript is structurally typed: compatibility is by shape, not by name or explicit implements (duck typing at compile time).",
      "Never use any (it disables checking); use unknown for truly unknown values and narrow with a type guard before use.",
      "Turn on \"strict\": true — strictNullChecks and noImplicitAny are where TypeScript actually earns its keep.",
    ],
    codeSamples: [
      {
        label: "Primitives, interfaces vs type aliases, optional & readonly",
        language: "ts",
        code: `// Primitives + inference (no annotation needed here)
let count = 0;          // inferred number
const name = 'Ada';     // inferred string
const ids: number[] = [];               // annotate empty containers
const pair: [string, number] = ['x', 1]; // tuple

// interface — an extendable object contract (like a Java interface/POJO)
interface Expense {
  readonly id: number;                     // can't be reassigned after creation
  amount: number;
  category: 'meals' | 'travel' | 'other';  // string-literal union
  approved: boolean;
  note?: string;                           // optional field
}
interface RecurringExpense extends Expense {
  everyDays: number;                       // interfaces extend
}

// type alias — unions, intersections, function types
type Id = number | string;                 // union
type WithTimestamps = { createdAt: number; updatedAt: number };
type StoredExpense = Expense & WithTimestamps; // intersection`,
      },
      {
        label: "Unions, narrowing, guards & discriminated unions",
        language: "ts",
        code: `// Narrowing a union with typeof
function format(value: string | number): string {
  if (typeof value === 'number') return value.toFixed(2); // value: number here
  return value.toUpperCase();                             // value: string here
}

// Custom type guard: 'x is Cat' teaches the compiler
interface Cat { meow(): void }
interface Dog { bark(): void }
function isCat(a: Cat | Dog): a is Cat {
  return (a as Cat).meow !== undefined;
}

// Discriminated union — narrow on a shared literal 'kind'
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; w: number; h: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2; // narrowed to circle
    case 'rect':   return shape.w * shape.h;           // narrowed to rect
  }
}

// unknown forces narrowing before use (never use 'any')
function parse(input: unknown): string {
  if (typeof input === 'string') return input;
  return String(input);
}`,
      },
      {
        label: "Generics, enums & utility types",
        language: "ts",
        code: `// Generic (like Java generics) — preserves the element type
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

// Constrained generic — T must have an id
function byId<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find((i) => i.id === id);
}

// Enum — named constants (emits runtime code)
enum Status { Draft = 'draft', Sent = 'sent', Approved = 'approved' }
const current: Status = Status.Draft;

// Zero-runtime alternative: literal union + const object
type StatusLit = 'draft' | 'sent' | 'approved';

interface User { id: number; name: string; email: string; role: string }

// Utility types derive variants from ONE source type
type UserPatch   = Partial<User>;                 // all optional (update payload)
type UserPublic  = Omit<User, 'email'>;           // drop a field
type UserKeyInfo = Pick<User, 'id' | 'name'>;     // keep a subset
type UsersById   = Record<number, User>;          // map type
type FrozenUser  = Readonly<User>;                // immutable`,
      },
      {
        label: "Typing functions & React props (tsx)",
        language: "tsx",
        code: `// Function types: optional, default, and rest params
type Adder = (a: number, b?: number) => number;
const add: Adder = (a, b = 0) => a + b;
function sumAll(...nums: number[]): number {
  return nums.reduce((s, n) => s + n, 0);
}

// React props typed with an interface
interface ButtonProps {
  label: string;
  variant?: 'primary' | 'ghost';          // optional literal union
  disabled?: boolean;
  onClick: () => void;                     // event handler type
  children?: React.ReactNode;              // renderable children
}

function Button({ label, variant = 'primary', onClick, children }: ButtonProps) {
  return (
    <button className={\`btn btn-\${variant}\`} onClick={onClick}>
      {label}
      {children}
    </button>
  );
}

// Typed input change handler
function NameField() {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  return <input onChange={onChange} />;
}`,
      },
      {
        label: "Structural typing & a strict tsconfig",
        language: "json",
        code: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,              /* strictNullChecks + noImplicitAny + more */
    "noUncheckedIndexedAccess": true,  /* arr[i] is T | undefined */
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}`,
      },
    ],
    runnable: {
      title: "The same logic as plain JS (types erased at runtime)",
      js: `// TypeScript types disappear after compilation — this is the emitted JS.
const expenses = [
  { id: 1, amount: 120, category: 'meals',  approved: true },
  { id: 2, amount: 800, category: 'travel', approved: false },
  { id: 3, amount: 250, category: 'meals',  approved: true },
];

// generic firstItem<T> compiles to a plain function
function firstItem(items) { return items[0]; }
console.log('first:', firstItem(expenses));

// type narrowing on string | number
function format(value) {
  if (typeof value === 'number') return value.toFixed(2);
  return value.toUpperCase();
}
console.log(format(42));       // "42.00"
console.log(format('meals'));  // "MEALS"

// discriminated union -> plain switch at runtime
function area(shape) {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'rect':   return shape.w * shape.h;
  }
}
console.log('circle area:', area({ kind: 'circle', radius: 2 }).toFixed(2));
console.log('rect area:', area({ kind: 'rect', w: 3, h: 4 }));

// enum compiles to an object of named constants
const Status = { Draft: 'draft', Sent: 'sent', Approved: 'approved' };
console.log('current:', Status.Draft);

// utility types are compile-time only — no runtime trace
const approvedTotal = expenses
  .filter((e) => e.approved)
  .reduce((s, e) => s + e.amount, 0);
console.log('approvedTotal:', approvedTotal);`,
    },
    interviewQA: [
      {
        question: "What is TypeScript and what happens to the types at runtime?",
        answer:
          "TypeScript is JavaScript with an optional static type layer checked by the compiler and then erased — the browser runs ordinary JavaScript with no type information left. The benefit is entirely at development time: catching type errors, wrong arguments, and null access in the editor, plus autocomplete and safe project-wide refactors. Because types are erased, you can't do runtime type checks against interfaces; you narrow with runtime checks like typeof or a validation library.",
      },
      {
        question: "What is the difference between any and unknown?",
        answer:
          "any opts out of type checking entirely — you can call anything on it, which defeats the purpose of TypeScript and silently spreads. unknown is the type-safe top type: it accepts any value, but you cannot use it until you narrow it with a type guard (typeof, instanceof, Array.isArray, or a custom predicate). Prefer unknown for genuinely unknown values (API responses, JSON.parse) and never reach for any.",
      },
      {
        question: "When would you use an interface versus a type alias?",
        answer:
          "Both describe shapes. interface is open — it can be extended and declaration-merged — which suits public object and class contracts you expect to grow. type aliases are more flexible: they express unions, intersections, tuples, function types, and mapped/conditional types. Convention: interface for extendable object shapes, type for unions and computed types. For a plain object shape they're largely interchangeable, so consistency matters more than the exact choice.",
      },
      {
        question: "What are generics and why use them?",
        answer:
          "Generics parameterise code by type, like Java generics. firstItem<T>(items: T[]): T | undefined preserves the element type through the call so the result is correctly typed instead of any. You can constrain them (<T extends { id: number }>) and give defaults (<T = string>). They enable reusable, type-safe functions, data structures, and React components without losing type information.",
      },
      {
        question: "What is type narrowing? Give the common techniques.",
        answer:
          "Narrowing is the compiler refining a broad type to a more specific one inside a branch, based on control-flow analysis. Techniques: typeof for primitives, instanceof for classes, Array.isArray, the in operator for property presence, truthiness checks, custom type guards (fn(x): x is T), and switching on the discriminant of a discriminated union. Inside the narrowed branch the value is fully typed as the specific type.",
      },
      {
        question: "What do Partial, Pick, Omit, and Record do?",
        answer:
          "They derive new types from existing ones. Partial<T> makes every property optional (ideal for update/patch payloads). Pick<T, K> keeps only the listed keys; Omit<T, K> removes the listed keys. Record<K, V> builds a map type such as Record<string, User>. Using these keeps types DRY — you derive variants from a single source of truth instead of duplicating shapes.",
      },
      {
        question: "What does 'structural typing' mean, and how does it differ from Java?",
        answer:
          "TypeScript decides type compatibility by shape, not by name or an explicit implements clause: if an object has all the members a type requires, it is assignable to that type. This is duck typing checked at compile time. Java is nominally typed — a class must explicitly implement an interface. So in TypeScript a plain object literal can satisfy an interface it never references, which is flexible but occasionally surprising.",
      },
      {
        question: "Why turn on strict mode in tsconfig, and what does it enable?",
        answer:
          "\"strict\": true is where TypeScript delivers real safety. It enables strictNullChecks (null and undefined aren't silently assignable, forcing you to handle them), noImplicitAny (untyped values are errors, not silent any), strictFunctionTypes, strictBindCallApply, and more. Without strict, you effectively get JavaScript with extra syntax. Strict mode catches the null-access and untyped bugs that cause the most production incidents.",
      },
    ],
    thingsToRemember: [
      "Types are compile-time only and erased at runtime — the browser runs plain JavaScript.",
      "Annotate boundaries (params, exported APIs, empty arrays); let inference do the interior.",
      "interface = extendable object/class contract; type = unions, intersections, tuples, computed types.",
      "String-literal unions constrain a value to a fixed set — a zero-runtime enum.",
      "Narrow with typeof / instanceof / in / Array.isArray / custom guards / discriminated unions.",
      "Generics (with extends constraints and = defaults) preserve type info through functions and components.",
      "Utility types derive variants from one source: Partial, Required, Pick, Omit, Record, Readonly.",
      "TypeScript is structurally typed — compatibility is by shape, not by name (no implements needed).",
      "Never use any; use unknown and narrow. Enums emit runtime code — literal unions are the lean alternative.",
      "Turn on \"strict\": true (strictNullChecks + noImplicitAny) — that's where TypeScript earns its keep.",
    ],
    references: [
      { label: "TypeScript Handbook — The Basics", url: "https://www.typescriptlang.org/docs/handbook/2/basic-types.html" },
      { label: "TypeScript Handbook — Everyday Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" },
      { label: "TypeScript Handbook — Narrowing", url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html" },
      { label: "TypeScript Handbook — Utility Types", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html" },
      { label: "TypeScript for Java/OOP Programmers", url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html" },
      { label: "React + TypeScript Cheatsheet", url: "https://react-typescript-cheatsheet.netlify.app/" },
    ],
    tags: ["typescript", "types", "interfaces", "type-aliases", "unions", "generics", "enums", "narrowing", "utility-types", "structural-typing", "tsconfig", "react-props"],
  },
];
