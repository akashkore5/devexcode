import type { FrontendTopic } from "../types";

export const partM: FrontendTopic[] = [
  {
    id: "linting-code-quality-eslint-prettier",
    num: 46,
    title: "Linting & Code Quality (ESLint, Prettier)",
    part: "Quality & Testing",
    partId: "m",
    difficulty: "Core",
    summary: "ESLint catches bugs and bad patterns; Prettier enforces consistent formatting automatically.",
    readingTime: 5,
    explanation: [
      "**ESLint** and **Prettier** solve two different problems and are meant to run together. ESLint is a *static analysis* tool: it inspects your code for likely bugs, anti-patterns, and rule violations (banning `any`, enforcing React hook dependency arrays, flagging stray `console.log`). Prettier is an *opinionated code formatter*: it reformats your source to a single canonical style (quotes, semicolons, line width, trailing commas) without judging correctness.",
      "Because both tools historically had overlapping opinions about formatting, the convention is to let Prettier own all formatting and disable ESLint's stylistic rules. The `prettier` config in `extends` does exactly this — it turns off ESLint rules that would conflict with Prettier, which is why it **must be listed last** so it overrides everything before it.",
      "A typical config layers shared presets via `extends` (`eslint:recommended`, the TypeScript plugin's recommended set, React and React Hooks recommended), then overrides specific rules. The `.prettierrc` is tiny by design — it only configures the handful of formatting choices Prettier exposes. Wire both into npm scripts (`lint`, `lint:fix`, `format`) so they run in CI and via pre-commit hooks.",
      "The table below summarizes the division of responsibility:\n\n| Tool | Job | Catches | Fix command |\n| --- | --- | --- | --- |\n| ESLint | Static analysis / linting | Likely bugs, anti-patterns, banned APIs | `eslint --fix` |\n| Prettier | Code formatting | Inconsistent quotes, spacing, line width | `prettier --write` |",
    ],
    backendAnalogy:
      "ESLint is your Java static analyzers — Checkstyle/PMD/SpotBugs/SonarLint — flagging code smells and likely bugs. Prettier is the auto-formatter, like `google-java-format` or Spotless: it rewrites your source to one canonical style so diffs stay clean and nobody argues about brace placement in code review.",
    keyInsights: [
      "ESLint finds problems (bugs, bad patterns); Prettier fixes formatting. They are complementary, not competitors.",
      "The `prettier` entry in ESLint's `extends` must be last — it disables ESLint's formatting rules so the two tools don't fight.",
      "Wire `lint`, `lint:fix`, and `format` into package.json scripts and run them in CI / pre-commit hooks so style is enforced automatically, not by reviewers.",
    ],
    codeSamples: [
      {
        label: "ESLint configuration (.eslintrc.cjs)",
        language: "js",
        code: `// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier', // must be last (disables formatting rules)
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error', // ban 'any'
    'react-hooks/exhaustive-deps': 'error', // enforce deps
    'no-console': 'warn',
  },
};`,
      },
      {
        label: "Prettier configuration (.prettierrc)",
        language: "json",
        code: `// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 100
}`,
      },
      {
        label: "package.json scripts",
        language: "json",
        code: `// package.json scripts
"scripts": {
  "lint": "eslint src/ --ext .ts,.tsx",
  "lint:fix": "eslint src/ --ext .ts,.tsx --fix",
  "format": "prettier --write src/"
}`,
      },
    ],
    interviewQA: [
      {
        question: "What is the difference between ESLint and Prettier, and why use both?",
        answer:
          "ESLint is a static analysis (linting) tool that catches likely bugs and bad patterns — banning any, enforcing exhaustive hook dependencies, flagging console.log. Prettier is an opinionated formatter that rewrites code to one canonical style (quotes, semicolons, line width). They are complementary: ESLint owns correctness/code quality, Prettier owns formatting. You run both, with Prettier handling all stylistic concerns.",
      },
      {
        question: "Why must the 'prettier' config be last in ESLint's extends array?",
        answer:
          "eslint-config-prettier disables every ESLint rule that conflicts with Prettier's formatting. Because ESLint applies extends top to bottom with later entries overriding earlier ones, putting prettier last ensures it switches off the formatting rules introduced by the recommended presets. If it were earlier, a later preset could re-enable a formatting rule and the two tools would fight over the same code.",
      },
      {
        question: "How do you enforce linting and formatting across a team?",
        answer:
          "Define lint, lint:fix, and format scripts in package.json so the commands are standardized. Run lint in CI to fail builds on violations, and run format-on-save in the editor plus a pre-commit hook (Husky + lint-staged) so code is auto-formatted before it ever lands. This makes style automatic and keeps it out of code review entirely.",
      },
      {
        question: "When would you use a rule level of 'warn' versus 'error'?",
        answer:
          "Use error for rules that should block a build or commit — banning any or enforcing exhaustive-deps prevents real bugs and type holes. Use warn for advisory rules you want visible but not build-breaking, like no-console, where a stray log is undesirable in production but shouldn't fail the whole pipeline. Warnings keep the signal without halting work.",
      },
    ],
    thingsToRemember: [
      "ESLint = catch bugs/anti-patterns; Prettier = enforce formatting. Use both.",
      "List 'prettier' last in extends so it disables conflicting ESLint formatting rules.",
      "Add lint / lint:fix / format scripts and run them in CI and pre-commit hooks.",
    ],
    references: [
      { label: "ESLint — docs", url: "https://eslint.org/docs/latest/" },
      { label: "Prettier — docs", url: "https://prettier.io/docs/en/" },
    ],
    tags: ["eslint", "prettier", "linting", "code-quality", "tooling"],
  },
  {
    id: "testing-vitest-rtl-playwright",
    num: 47,
    title: "Testing (Vitest + React Testing Library + Playwright)",
    part: "Quality & Testing",
    partId: "m",
    difficulty: "Core",
    summary: "The frontend test pyramid: many fast component tests with Vitest + RTL, a few end-to-end flows with Playwright.",
    readingTime: 7,
    explanation: [
      "The frontend **test pyramid** mirrors the backend one: write many fast, cheap tests at the bottom and few slow, expensive ones at the top. At the base sit unit and component tests run with **Vitest + React Testing Library (RTL)** — they render a component in a simulated DOM (jsdom) and run in milliseconds. At the top sit a handful of **end-to-end (e2e)** tests run with **Playwright**, which drives a real browser through a whole user flow.",
      "RTL's core philosophy is to **test behavior, not implementation**: it tests components the way a *user* uses them — finding text on screen, typing into a labelled field, clicking a button — rather than inspecting internal state, props, or component instances. This means you query the DOM by accessible *roles* and *labels* (`getByRole('button', { name: /add/i })`, `getByLabelText(/amount/i)`), which both reflects real usage and nudges you toward accessible markup. Tests stay green when you refactor internals, and only break when actual user-visible behavior changes.",
      "**Unit vs integration vs e2e:** a unit test exercises one function or component in isolation (often with mocks, e.g. `vi.fn()` for callbacks). An integration test renders several components together and checks they cooperate (a form submitting and a list updating). An e2e test runs the deployed app in a browser and validates a full journey — navigating, filling the form, asserting the result appears, and checking that an unauthenticated visit to `/admin` redirects to `/login`.",
      "The two layers use different query styles for the same idea. RTL exposes `screen.getByRole` / `getByLabelText` / `getByText` and the `userEvent` library for realistic interactions; mocks like `vi.fn()` let you assert a callback was (or wasn't) called. Playwright exposes `page.getByLabel`, `page.getByRole`, and assertions like `expect(page).toHaveURL(...)` and `expect(locator).toBeVisible()`. The table contrasts the levels:\n\n| Level | Tool | Scope | Speed | Use for |\n| --- | --- | --- | --- | --- |\n| Unit / Component | Vitest + RTL | One component in jsdom | Very fast (ms) | Validation, rendering, callbacks |\n| Integration | Vitest + RTL | Several components together | Fast | Components cooperating |\n| End-to-end | Playwright | Full app in a real browser | Slow | Critical user journeys |",
    ],
    backendAnalogy:
      "It is the same pyramid you build in Java: many JUnit unit tests at the base (Vitest + RTL), fewer Spring/Vert.x integration tests in the middle, and a small set of full system/e2e tests at the top (Playwright). And just as you'd assert observable outputs from a service rather than poking its private fields, RTL asserts on what the user sees instead of internal component state — vi.fn() is your Mockito mock for verifying interactions.",
    keyInsights: [
      "Test pyramid: lots of fast Vitest + RTL component tests, a few slow Playwright e2e tests. Cost and speed scale up the pyramid.",
      "RTL philosophy: test behavior, not implementation. Query by accessible role/label/text and interact via userEvent — never inspect internal state.",
      "Querying by role and label both mirrors real user behavior and pushes you toward accessible markup; tests survive refactors and break only on real behavior changes.",
      "Use mocks (vi.fn()) to assert callbacks were called with the right data — or asserts they were NOT called, e.g. when validation should block submit.",
    ],
    codeSamples: [
      {
        label: "Component test: Vitest + React Testing Library",
        language: "tsx",
        code: `// Component test: Vitest + React Testing Library
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { ExpenseForm } from './ExpenseForm';

describe('ExpenseForm', () => {
  test('shows validation error for empty amount', async () => {
    const onAdd = vi.fn();
    render(<ExpenseForm onAdd={onAdd} />);
    await userEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
    expect(onAdd).not.toHaveBeenCalled();
  });

  test('submits valid data and resets form', async () => {
    const onAdd = vi.fn();
    render(<ExpenseForm onAdd={onAdd} />);
    await userEvent.type(screen.getByLabelText(/amount/i), '250');
    await userEvent.selectOptions(screen.getByLabelText(/category/i), 'travel');
    await userEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 250, category: 'travel' })
    );
  });

  test('renders expense list correctly', () => {
    const items = [{ id: 1, category: 'meals', amount: 120, approved: true }];
    render(<ExpenseList items={items} />);
    expect(screen.getByText(/meals/)).toBeInTheDocument();
    expect(screen.getByText(/120/)).toBeInTheDocument();
  });
});`,
      },
      {
        label: "End-to-end test: Playwright",
        language: "ts",
        code: `// End-to-end test: Playwright
import { test, expect } from '@playwright/test';

test('user can add an expense end to end', async ({ page }) => {
  await page.goto('/expenses');
  // Fill the form
  await page.getByLabel('Amount').fill('250');
  await page.getByLabel('Category').selectOption('travel');
  await page.getByLabel('Description').fill('Client meeting');
  // Submit
  await page.getByRole('button', { name: 'Add Expense' }).click();
  // Verify it appears in the list
  await expect(page.getByText('250')).toBeVisible();
  await expect(page.getByText('travel')).toBeVisible();
});

test('login redirects unauthenticated users', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL('/login');
});`,
      },
    ],
    interviewQA: [
      {
        question: "Explain the frontend test pyramid and the role of unit, integration, and e2e tests.",
        answer:
          "The pyramid has many fast, cheap tests at the base and few slow, expensive ones at the top. Unit/component tests (Vitest + RTL) render one component in jsdom and run in milliseconds — they form the wide base. Integration tests render several components together to verify they cooperate. End-to-end tests (Playwright) drive a real browser through a full user journey and are the slow, narrow tip. You write the most tests at the bottom because they're fast and stable, and only a handful of e2e tests covering critical flows because they're slow and brittle.",
      },
      {
        question: "What does 'test behavior, not implementation' mean in React Testing Library?",
        answer:
          "It means tests should interact with a component the way a user does — finding text, clicking labelled buttons, typing into fields — instead of reaching into internal state, props, or component instances. RTL encourages querying by accessible role, label, and text. The payoff is that refactoring internals (renaming state, restructuring components) doesn't break tests; they only fail when actual user-visible behavior changes, which is exactly what you want a test to protect.",
      },
      {
        question: "Why does RTL prefer queries by role and label over test IDs or CSS selectors?",
        answer:
          "Querying by accessible role and label (getByRole('button', { name: /add/i }), getByLabelText(/amount/i)) mirrors how real users and assistive technology find elements, so the test asserts on genuine user-facing behavior. As a side benefit, it pressures you to write accessible markup — if you can't query a control by its role or label, neither can a screen reader. Test IDs and CSS selectors couple tests to implementation details and don't validate accessibility.",
      },
      {
        question: "How and when do you use mocking in component tests, and how is Playwright different?",
        answer:
          "In Vitest + RTL you mock callbacks and dependencies with vi.fn() so you can assert how the component interacts with them — e.g. expect(onAdd).toHaveBeenCalledWith(...) on a valid submit, or expect(onAdd).not.toHaveBeenCalled() when validation should block it. That isolates the component under test. Playwright e2e tests take the opposite approach: they run the whole real app in an actual browser with no mocks, driving pages with page.getByLabel/getByRole and asserting on visible output and URL — verifying the integrated system, including routing and auth redirects.",
      },
    ],
    thingsToRemember: [
      "Test pyramid: many Vitest + RTL component tests, few Playwright e2e tests.",
      "RTL = test behavior not implementation: query by role/label/text, interact with userEvent.",
      "Use vi.fn() mocks to assert callbacks were called (or not); Playwright runs the real app for full flows.",
    ],
    references: [
      { label: "Vitest — docs", url: "https://vitest.dev" },
      { label: "Testing Library — React docs", url: "https://testing-library.com/docs/react-testing-library/intro/" },
      { label: "Playwright — docs", url: "https://playwright.dev" },
    ],
    tags: ["testing", "vitest", "react-testing-library", "playwright", "e2e"],
  },
];
