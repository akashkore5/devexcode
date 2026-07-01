import type { FrontendTopic } from "../types";

export const partK: FrontendTopic[] = [
  {
    id: "ui-component-libraries-design-systems",
    num: 39,
    title: "UI Component Libraries / Design Systems (MUI, Atlaskit)",
    part: "UI & Visualization",
    partId: "k",
    difficulty: "Core",
    summary:
      "How to consume, theme, and override accessible component libraries (MUI, shadcn/ui, Radix/Headless UI) and back them with a design-token system: palette, typography, spacing, dark mode, and the a11y you get for free — plus when to override vs when to hand-roll.",
    readingTime: 16,
    explanation: [
      "**The big picture (read this first).** A component library is a shipped, tested set of UI primitives — buttons, inputs, dialogs, menus, tables — that already handle the parts that are quietly hard: keyboard interaction, focus management, ARIA roles, and cross-browser quirks. A **design system** is the layer above it: a single source of truth for *design decisions* (color, type, spacing, radius, motion) expressed as **design tokens**, plus rules for how components compose. Consuming a library well is mostly about theming through tokens rather than fighting each component with one-off styles. Get this right and a rebrand is one edit; get it wrong and you have a thousand inline overrides that drift.",
      "**Design tokens are the vocabulary.** A token is a named design decision — `color.primary`, `space.4`, `radius.md`, `font.body`, `shadow.elevated` — stored once and referenced everywhere. Tokens split into **primitive** tokens (raw values like `blue.600 = #1B4F72`) and **semantic** tokens (`color.action = blue.600`, `color.danger = red.600`) that map meaning onto primitives. Components read semantic tokens, so you can retheme (or ship dark mode) by swapping what the semantic token points at, without touching a single component. This indirection is the whole game.",
      "**Three flavors of library, and why they differ.** **Batteries-included** libraries like **MUI** and **Atlaskit** ship styled, opinionated components plus a theming engine — fast to build with, but you inherit their look and bundle. **Headless** libraries like **Radix UI**, **Headless UI**, and **React Aria** ship *behavior and accessibility only* (open/close state, focus trap, ARIA) with zero styles, so you own 100% of the look. **Copy-in** kits like **shadcn/ui** are not a dependency at all: you copy Radix-based, Tailwind-styled component source into your repo and own it outright. The trade is control vs. maintenance: headless/copy-in give total design control but you write the CSS; batteries-included give speed but constrain the look.",
      "**How MUI theming works.** You call `createTheme` to build a theme object holding tokens — `palette` (primary/secondary/error and light/dark `mode`), `typography` (font family and a heading scale), `spacing` (a base unit multiplied by numbers), `shape` (border radius) — and inject it with `<ThemeProvider>` at the app root. Per-component `styleOverrides` reshape *every* instance of a component (round all `MuiButton` corners, kill uppercase). Components read the theme through React context, so a token change ripples everywhere consistently. The rule: override at the theme level, never with scattered inline `sx`/`style` for things that are really global decisions.",
      "**How token systems work outside MUI.** In a Tailwind/shadcn setup, tokens live as **CSS custom properties** (`--color-primary: 27 79 114;`) on `:root`, and dark mode flips them under a `.dark` selector or `[data-theme=\"dark\"]`. Tailwind's `theme.extend` maps utility classes (`bg-primary`) onto those variables. Because the variables cascade, dark mode is a single class toggle on `<html>` — no re-render, no prop drilling. This is why CSS-variable-based theming is the modern default: the browser does the theming for you.",
      "**Accessibility is the real reason to use a library.** A hand-rolled `<div onClick>` \"button\" is not focusable, not keyboard-operable, and invisible to screen readers. A real dialog needs focus trapping, `role=\"dialog\"`, `aria-modal`, escape-to-close, and focus restoration on close; a menu needs roving `tabindex` and arrow-key navigation; a combobox needs `aria-expanded`, `aria-activedescendant`, and listbox semantics. Mature libraries have solved and tested all of this. When you hand-roll, you silently take on every one of these obligations — and most bespoke components ship with several missing.",
      "**Controlled vs uncontrolled, and composition.** Library inputs come in **controlled** (`value` + `onChange`, you own state) and **uncontrolled** (`defaultValue`, the DOM owns state) forms — the same distinction as native inputs. Prefer composition (`asChild`, slots, `children`) over deep prop lists: a good library lets you pass your own element and keeps its behavior, rather than forcing you to configure a dozen boolean props. When a library can express something declaratively, use it; the moment you reach for `useRef` hacks to fight it, reconsider.",
      "**Overriding without breaking things.** There is a ladder of override strength: (1) **tokens/theme** — global, predictable, the default; (2) **variant props** (`variant=\"outlined\"`, `size=\"sm\"`) — sanctioned per-instance changes; (3) **local style props** (`sx`, `className`) for genuine one-offs; (4) **replacing the component**. Escalate only when the level above genuinely can't express the need. Reaching straight for `!important` or deep descendant selectors against library internals is a smell — those selectors break on the next library upgrade.",
      "**When to build bespoke.** Build your own component only when the library truly can't express the requirement (a novel interaction, a domain-specific widget). Understand what you're signing up for: you now own accessibility, keyboard support, focus management, RTL, high-contrast mode, and the edge cases the library had already tested. A good middle path is to build bespoke *on top of a headless primitive* (Radix/React Aria) so you keep the a11y and only own the styling.",
      "**Bundle size and tree-shaking.** Batteries-included libraries are large; import from the specific path (`@mui/material/Button`) and rely on tree-shaking so you don't pull the whole library. Headless/copy-in kits keep the bundle lean because you only include what you use. Icons are a classic footgun — import individual icons, never the barrel. Measure with your bundler analyzer; a design system that doubles your JS is a performance problem wearing a UX costume.",
      "**Dark mode and theming as a first-class feature.** Design dark mode into the token layer from day one: semantic tokens (`color.surface`, `color.text`) resolve differently per mode, and you toggle the mode, not individual colors. Respect the user's OS preference with `prefers-color-scheme`, but let them override it and persist the choice. Never hard-code hex values in components — that's the single decision that makes theming possible or impossible.",
      "**The mental model (memorise this).** A design system is tokens (named decisions) + components (behavior + a11y) + rules for composing them. Consume the library for the accessibility and consistency you'd otherwise get wrong; theme through tokens injected once at the root so a rebrand or dark mode is one edit; escalate overrides only as far up the ladder as you must; and hand-roll only when the library can't express it — because then you own the a11y yourself.",
    ],
    backendAnalogy:
      "A design system's token layer is your externalized configuration + dependency injection: define tokens once in a central ThemeProvider (your application.yml / bean config) and every component resolves them at runtime, exactly as Spring beans read centralized properties instead of hard-coding values per class. Semantic tokens mapping onto primitives (color.action -> blue.600) are like an interface bound to an implementation — swap the binding (dark mode) without touching consumers. A batteries-included library like MUI is a heavyweight framework you configure; a headless library (Radix) is a thin abstract base class that gives you the correct behavior contract and leaves the implementation to you. Reaching for !important against library internals is like reflecting into a framework's private fields — it works until the next version.",
    keyInsights: [
      "A design system = design tokens (named decisions) + components (behavior + a11y) + composition rules; tokens are the single source of truth.",
      "Split tokens into primitive (raw values) and semantic (meaning: color.action, color.danger); components read semantic tokens so retheming and dark mode are one swap.",
      "Three library flavors: batteries-included (MUI, Atlaskit) = fast but opinionated; headless (Radix, Headless UI, React Aria) = behavior/a11y only, you style; copy-in (shadcn/ui) = you own the source.",
      "In MUI, createTheme defines tokens (palette, typography, spacing, shape, per-component styleOverrides) and ThemeProvider injects them at the root; override at the theme level, not with scattered inline styles.",
      "CSS-custom-property tokens on :root cascade, so dark mode is a single class toggle on <html> with no re-render — the modern default for theming.",
      "The biggest reason to use a library is accessibility you'd get wrong by hand: focus trap, ARIA roles, keyboard nav, focus restoration.",
      "Override ladder: tokens/theme -> variant props -> local style props -> replace the component; escalate only when the level above can't express the need.",
      "Build bespoke only when the library can't express it — you then own a11y, keyboard, RTL, and edge cases; prefer building on a headless primitive to keep the a11y.",
      "Watch bundle size: import from specific paths for tree-shaking and import individual icons, never the barrel.",
      "Never hard-code hex in components; put decisions in tokens so dark mode and rebrands are possible at all.",
    ],
    codeSamples: [
      {
        label: "MUI — theme tokens, ThemeProvider, and dark mode",
        language: "tsx",
        code: `import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { Button, TextField } from "@mui/material";
import { useMemo, useState } from "react";

// A theme is your token store: palette, typography, spacing, shape,
// and per-component style overrides that reshape EVERY instance.
function buildTheme(mode: "light" | "dark") {
  return createTheme({
    palette: {
      mode, // flips default surface/text colors for dark mode
      primary: { main: "#1B4F72" },   // semantic: brand action color
      secondary: { main: "#E67E22" },
      error: { main: "#C0392B" },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", sans-serif',
      h1: { fontSize: "2rem", fontWeight: 700 },
    },
    shape: { borderRadius: 8 },      // one radius token, used everywhere
    spacing: 4,                       // theme.spacing(2) === 8px
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          // reshape all buttons at the theme level (not inline)
          root: { textTransform: "none", borderRadius: 8 },
        },
      },
    },
  });
}

export function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  // useMemo so the theme is not rebuilt on every render
  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* normalizes styles + applies palette.mode bg */}
      <Button variant="contained" color="primary"
        onClick={() => setMode(m => (m === "light" ? "dark" : "light"))}>
        Toggle theme
      </Button>
      <TextField label="Amount" type="number" variant="outlined" />
    </ThemeProvider>
  );
}`,
      },
      {
        label: "CSS-variable design tokens + dark mode (Tailwind / shadcn style)",
        language: "css",
        code: `/* Primitive + semantic tokens as CSS custom properties.
   Components reference the SEMANTIC token, never the raw hex. */
:root {
  /* primitives */
  --blue-600: #1b4f72;
  --orange-500: #e67e22;
  --gray-50: #f9fafb;
  --gray-900: #111827;

  /* semantic tokens (what components actually use) */
  --color-bg: var(--gray-50);
  --color-text: var(--gray-900);
  --color-action: var(--blue-600);
  --radius-md: 8px;
  --space-4: 1rem;
}

/* Dark mode = repoint the SAME semantic tokens. One toggle on <html>,
   no re-render, no prop drilling — the cascade does the work. */
:root[data-theme="dark"] {
  --color-bg: var(--gray-900);
  --color-text: var(--gray-50);
}

/* Optionally follow the OS preference by default */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --color-bg: var(--gray-900);
    --color-text: var(--gray-50);
  }
}

.card {
  background: var(--color-bg);
  color: var(--color-text);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}
.button-action { background: var(--color-action); color: #fff; }`,
      },
      {
        label: "Headless primitive (Radix): behavior + a11y, you own the styles",
        language: "tsx",
        code: `import * as Dialog from "@radix-ui/react-dialog";

// Radix ships the HARD parts for free: focus trap, role="dialog",
// aria-modal, escape-to-close, focus restoration, scroll lock.
// You supply 100% of the styling via className / your token classes.
export function ConfirmDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="button-action">Delete</Dialog.Trigger>
      <Dialog.Portal>
        {/* overlay + content are unstyled — bring your own tokens */}
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title>Delete expense?</Dialog.Title>
          <Dialog.Description>This cannot be undone.</Dialog.Description>
          {/* Dialog.Close restores focus to the trigger automatically */}
          <Dialog.Close className="button-action">Confirm</Dialog.Close>
          <Dialog.Close>Cancel</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}`,
      },
      {
        label: "MUI DataGrid — declarative columns/rows with built-in virtualization",
        language: "tsx",
        code: `import { DataGrid, type GridColDef } from "@mui/x-data-grid";

// DataGrid is config-driven: declare columns, pass rows. It virtualizes
// (renders only the visible window), and gives sort/paginate/select free.
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "category", headerName: "Category", width: 140 },
  { field: "amount", headerName: "Amount", type: "number", width: 120 },
  {
    field: "approved",
    headerName: "Status",
    width: 120,
    // renderCell escapes to custom JSX for one column only
    renderCell: (params) => (params.value ? "Approved" : "Pending"),
  },
];

export function ExpenseTable({ rows }: { rows: any[] }) {
  return (
    <div style={{ height: 400 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[10, 25, 50]}
      />
    </div>
  );
}`,
      },
    ],
    runnable: {
      title: "Design tokens + dark-mode toggle with pure CSS variables",
      html: `<button id="toggle">Toggle dark mode</button>
<div class="card">
  <h3>Expense report</h3>
  <p>The card, text, and button all read semantic tokens.</p>
  <span class="button-action">Approve</span>
</div>`,
      css: `:root {
  --bg: #f9fafb; --text: #111827; --action: #1b4f72; --radius: 10px;
}
:root[data-theme="dark"] {
  --bg: #111827; --text: #f9fafb; --action: #E67E22;
}
body { font-family: system-ui, sans-serif; padding: 24px; background: var(--bg); color: var(--text); transition: background .2s, color .2s; }
.card { background: var(--bg); color: var(--text); border: 1px solid var(--action); border-radius: var(--radius); padding: 20px; max-width: 360px; margin-top: 16px; }
.button-action { display: inline-block; background: var(--action); color: #fff; padding: 6px 14px; border-radius: 999px; font-weight: 700; }
button { font-size: 15px; padding: 8px 14px; cursor: pointer; }`,
      js: `// One toggle repoints every semantic token. No per-element edits.
const root = document.documentElement;
document.querySelector("#toggle").addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? null : "dark";
  if (next) root.setAttribute("data-theme", next);
  else root.removeAttribute("data-theme");
  console.log("theme is now:", next || "light");
});`,
    },
    interviewQA: [
      {
        question: "What is a design token and why theme through tokens instead of inline styles?",
        answer:
          "A design token is a named, reusable design decision — a color, type scale, spacing unit, radius, or shadow — stored once and referenced everywhere. Split into primitive tokens (raw values) and semantic tokens (meaning, like color.action or color.danger) that map onto primitives, tokens give a single source of truth: components read semantic tokens, so a rebrand or dark mode is one edit that ripples consistently. Inline overrides scatter the same value across files, drift over time, and make theming and dark mode impossible.",
      },
      {
        question: "What is the difference between a batteries-included, a headless, and a copy-in library?",
        answer:
          "Batteries-included libraries (MUI, Atlaskit) ship styled, opinionated components plus a theming engine — fast to build with but you inherit their look and bundle. Headless libraries (Radix UI, Headless UI, React Aria) ship only behavior and accessibility with zero styles, so you own 100% of the look. Copy-in kits (shadcn/ui) aren't a dependency at all — you copy the source into your repo and own it. The trade is control vs. maintenance: headless/copy-in give total design control but you write the CSS; batteries-included give speed but constrain the look.",
      },
      {
        question: "Why is accessibility the main reason to reach for a component library?",
        answer:
          "The hard, easy-to-get-wrong parts are behavioral: a dialog needs focus trapping, role=dialog, aria-modal, escape-to-close, and focus restoration; a menu needs roving tabindex and arrow-key navigation; a combobox needs aria-expanded and listbox semantics. Mature libraries have solved and tested all of this. A hand-rolled div-with-onClick is not focusable, not keyboard-operable, and invisible to screen readers. When you hand-roll you silently take on every one of these obligations.",
      },
      {
        question: "How do you decide between consuming, overriding, and building from scratch?",
        answer:
          "Default to consuming for accessibility and consistency. To customize, climb the override ladder only as far as needed: tokens/theme first (global, predictable), then sanctioned variant props, then local style props for genuine one-offs, then replacing the component. Reaching for !important or deep descendant selectors against library internals is a smell that breaks on upgrade. Build bespoke only when the library truly can't express the requirement — and prefer building on a headless primitive so you keep the a11y and only own the styling.",
      },
      {
        question: "How does CSS-variable-based theming enable dark mode without re-rendering?",
        answer:
          "Tokens live as CSS custom properties on :root, and components reference the semantic variables. Dark mode repoints those same variables under a selector like [data-theme=dark] or .dark. Because custom properties cascade, toggling one attribute on <html> updates every element that reads them — the browser does the theming, so there's no React re-render and no prop drilling. You can also honor prefers-color-scheme by default while letting users override and persist their choice.",
      },
      {
        question: "What are the bundle-size risks with component libraries and how do you mitigate them?",
        answer:
          "Batteries-included libraries are large. Import from specific paths (@mui/material/Button) so tree-shaking drops unused code, and import individual icons rather than the barrel export, which otherwise pulls thousands of icons. Headless and copy-in kits stay lean because you only include what you use. Always verify with a bundle analyzer — a design system that doubles your JS is a performance regression regardless of how nice it looks.",
      },
      {
        question: "What is the difference between controlled and uncontrolled library inputs?",
        answer:
          "Same as native inputs: a controlled component takes value plus onChange and you own the state in React; an uncontrolled component takes defaultValue and lets the DOM own the state, which you read via a ref when needed. Controlled is the default for forms you validate live or drive from other state; uncontrolled is simpler for fire-and-forget inputs. Good libraries also favor composition (asChild, slots, children) over deep boolean prop lists so you can pass your own element and keep the library's behavior.",
      },
    ],
    thingsToRemember: [
      "Design system = tokens (named decisions) + components (behavior + a11y) + composition rules.",
      "Primitive tokens hold raw values; semantic tokens hold meaning and map onto primitives — components read semantic tokens.",
      "createTheme defines MUI tokens (palette, typography, spacing, shape, styleOverrides); ThemeProvider injects at the root.",
      "CSS custom properties on :root cascade, so dark mode is one attribute toggle on <html> with no re-render.",
      "Batteries-included (MUI, Atlaskit) = speed; headless (Radix, React Aria) = behavior/a11y only; copy-in (shadcn/ui) = you own the source.",
      "Override ladder: theme/tokens -> variant props -> local style -> replace; escalate only when forced.",
      "Bespoke means you own a11y, keyboard, focus, RTL — build on a headless primitive to keep the a11y.",
      "Import from specific paths and import icons individually to keep the bundle small.",
      "Never hard-code hex in components; put every decision in a token.",
      "The library's biggest gift is the accessibility (focus trap, ARIA, keyboard) you'd otherwise get wrong.",
    ],
    references: [
      { label: "MUI — Material UI docs (theming)", url: "https://mui.com/material-ui/customization/theming/" },
      { label: "Radix UI — Primitives (headless, accessible)", url: "https://www.radix-ui.com/primitives" },
      { label: "shadcn/ui — copy-in component library", url: "https://ui.shadcn.com/" },
      { label: "Atlaskit — Atlassian Design System", url: "https://atlassian.design/" },
      { label: "web.dev — Building accessible components", url: "https://web.dev/learn/accessibility/" },
      { label: "MDN — Using CSS custom properties (variables)", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties" },
    ],
    tags: ["mui", "shadcn", "radix", "headless-ui", "design-system", "design-tokens", "theming", "dark-mode", "accessibility"],
  },
  {
    id: "data-visualization-charts",
    num: 40,
    title: "Data Visualization & Charts (Recharts, D3, Chart.js)",
    part: "UI & Visualization",
    partId: "k",
    difficulty: "Core",
    summary:
      "How charts actually get drawn — SVG vs Canvas, the scale abstraction that maps data to pixels — and how to pick between declarative React charting (Recharts), imperative low-level control (D3), and Canvas-based libraries (Chart.js), plus the accessibility most charts forget.",
    readingTime: 17,
    explanation: [
      "**The big picture (read this first).** Every chart is the same idea: take numbers in *data space* (dollars, dates, counts) and map them to *pixel space* (x/y positions, heights, colors) inside a drawing surface. Three decisions define any charting solution: (1) what surface do you draw on — **SVG** or **Canvas**; (2) how do you map data to pixels — the **scale** abstraction; and (3) how much of that do you write yourself vs. let a library do. Understanding these three lets you reason about any charting library instead of memorizing APIs.",
      "**SVG vs Canvas — the foundational choice.** **SVG** is retained-mode: every bar, line, and label is a real DOM element you can style with CSS, attach event handlers to, and inspect. That makes SVG great for interactivity, accessibility, and crisp scaling, but it degrades once you have thousands of elements because each is a live DOM node. **Canvas** is immediate-mode: you issue draw commands to a bitmap and the browser forgets the shapes — there's no DOM, so it renders tens of thousands of points fast, but you lose per-element events, CSS, and built-in accessibility (you rebuild hit-testing yourself). Rule of thumb: SVG for typical dashboards (hundreds of elements, rich interaction), Canvas (or WebGL) for high-density data (large scatter plots, real-time streams).",
      "**Scales are the heart of every chart.** A **scale** is a pure function from a data domain to a visual range. A **linear scale** maps `[0, maxValue] -> [chartHeight, 0]` (note the flip — SVG's y-axis grows downward, but charts grow upward). A **band scale** maps discrete categories to evenly spaced slots with padding (bar charts). A **time scale** maps `Date` objects to pixels. A **color/ordinal scale** maps categories to a palette. D3's `d3-scale` is the canonical implementation, and even when you use Recharts you are configuring scales under the hood. If you internalize `domain -> range`, you understand charting.",
      "**D3 is two libraries in a trench coat.** People conflate them, but D3 has a *utility* half and a *DOM* half. The utility modules — `d3-scale`, `d3-shape` (line/area/arc/pie generators), `d3-array`, `d3-time`, `d3-format` — are pure math with no DOM and pair beautifully with React (let D3 compute path strings and scales; let React render the SVG). The DOM half — `d3-selection`'s enter/update/exit data-join — imperatively creates and mutates elements, which *fights* React because both want to own the DOM. The modern React-D3 pattern is: D3 for math, React for rendering; reach for `d3-selection` only for complex transitions React can't easily express.",
      "**Recharts — declarative React charting.** Recharts composes a chart from JSX components: a container chart (`<BarChart>`, `<LineChart>`, `<PieChart>`), axes (`<XAxis>`, `<YAxis>`), decorations (`<Tooltip>`, `<Legend>`, `<CartesianGrid>`), and data series (`<Bar>`, `<Line>`, `<Area>`, `<Pie>`) that each bind to a field via `dataKey`. It renders SVG under the hood and reads like markup that mirrors your data shape. Wrapping in `<ResponsiveContainer>` makes the chart fluidly fill its parent width at a fixed height with no resize code. It's the right default for standard React charts because it's declarative and integrates cleanly with component state.",
      "**Chart.js — Canvas-based, config-driven.** Chart.js draws to a `<canvas>` from a single config object (`type`, `data`, `options`). Because it's Canvas, it handles denser datasets than SVG libraries and has a small, batteries-included feature set (animations, tooltips, legends). The trade is Canvas's: no DOM per element, so styling and accessibility are more limited and you configure rather than compose. Its React wrapper (`react-chartjs-2`) just marshals props into that config. Reach for it when you want a solid, dense, standard chart with minimal ceremony.",
      "**Picking the tool (the matrix).**\n\n| Approach | Surface | Best for | Trade-off |\n| --- | --- | --- | --- |\n| Recharts | SVG | Standard React charts, rich interaction | Declarative & fast; limited for unusual visuals |\n| Chart.js | Canvas | Dense standard charts, quick setup | Config-driven; weaker per-element styling & a11y |\n| D3 (utils + React) | SVG | Custom/bespoke visualizations | Full control; you write the render logic |\n| D3 (full selection) | SVG/Canvas | Complex data-driven transitions | Maximum power; fights React, most code |\n\nMatch the tool to the need rather than defaulting to the most powerful one — D3 for everything is a common over-engineering mistake.",
      "**Accessibility is where most charts fail.** A chart that only conveys meaning through color and pixels is invisible to screen-reader users and hostile to the color-blind. The fixes: give the SVG `role=\"img\"` and a descriptive `aria-label` or `<title>`/`<desc>`; provide the underlying data as a visually-hidden `<table>` so assistive tech and keyboard users can read the numbers; never rely on color alone — add patterns, direct labels, or shape encodings and check contrast; ensure interactive points are keyboard-focusable with visible focus. A good chart has a text alternative that stands on its own.",
      "**Responsiveness and the retina/DPR trap.** SVG scales cleanly because it's vector, but you still need to recompute scales when the container resizes (Recharts' ResponsiveContainer or a ResizeObserver). Canvas has a sharper gotcha: on high-DPR (retina) screens a canvas rendered at CSS pixels looks blurry — you must set the backing store to `width * devicePixelRatio`, keep the CSS size fixed, and `ctx.scale(dpr, dpr)`. Forgetting DPR is the #1 reason Canvas charts look fuzzy.",
      "**Performance and data volume.** The failure mode is rendering more than the surface can handle: thousands of SVG nodes janks layout; unthrottled real-time updates blow the frame budget. Mitigations: for SVG, cap element count, aggregate/bin data, and virtualize; for high density switch to Canvas/WebGL; downsample time series (e.g. LTTB) before plotting; throttle streaming updates to one render per animation frame with `requestAnimationFrame`; and memoize scale computations so you don't recompute them on every render.",
      "**Encodings and honesty.** Choosing the right chart is half the job: bar for comparing categories, line for trends over time, scatter for correlation, pie only for a few parts of a whole (and rarely — humans read angles poorly). Be honest with axes: truncating a bar chart's y-axis (not starting at zero) exaggerates differences and is a classic misleading-visualization mistake. Line charts *may* start off zero to show trend detail, but bars must anchor at zero because their length is the encoding.",
      "**The mental model (memorise this).** A chart maps data space to pixel space through a scale (domain -> range) drawn on a surface (SVG = DOM elements, styleable/interactive/accessible but caps out in the thousands; Canvas = bitmap, dense and fast but no DOM/events/a11y). Use Recharts for standard declarative React charts, D3's utility half for bespoke SVG (math in D3, rendering in React), Chart.js for dense Canvas charts — and always ship a text/table alternative and never encode meaning by color alone.",
    ],
    backendAnalogy:
      "A scale is a pure mapping function — domain -> range — exactly like a serializer/mapper that converts a domain object into a transport DTO; get the mapping right and everything downstream is trivial. SVG vs Canvas is the classic ORM-vs-raw-JDBC trade: SVG (retained-mode, one managed object per row) gives you rich, inspectable, event-bound entities but degrades on huge result sets; Canvas (immediate-mode) is a raw batch write to a buffer — blazing fast at volume but you get no managed objects, no per-row hooks, no free tooling. D3's split mirrors a library with pure calculation utilities (safe to embed anywhere, like a stateless helper) versus a stateful component that owns and mutates shared state (d3-selection owning the DOM) and therefore fights another framework that wants the same ownership (React). Downsampling a time series before plotting is pagination/aggregation at the query layer so you never ship a million rows to the client.",
    keyInsights: [
      "Every chart maps data space to pixel space via a scale (a pure domain -> range function); internalize domain->range and charting demystifies.",
      "SVG is retained-mode: real DOM elements, styleable/interactive/accessible/crisp, but degrades past ~thousands of nodes.",
      "Canvas is immediate-mode: a bitmap with no DOM, so it renders tens of thousands of points fast but loses per-element events, CSS, and built-in a11y.",
      "Linear scales map [0,max]->[height,0] (flipped because SVG y grows downward); band scales map categories to slots; time and ordinal/color scales map dates and categories.",
      "D3 is two halves: pure utility modules (d3-scale, d3-shape) that pair with React, and d3-selection's DOM data-join that fights React — modern pattern is D3 for math, React for rendering.",
      "Recharts (SVG, declarative JSX + dataKey + ResponsiveContainer) for standard React charts; Chart.js (Canvas, config object) for dense standard charts; D3 for bespoke visualizations.",
      "Accessibility most charts skip: role=img + aria-label/title/desc, a visually-hidden data table, never color alone (add patterns/labels), and keyboard-focusable interactive points.",
      "Canvas on retina looks blurry unless you size the backing store to width*devicePixelRatio and ctx.scale(dpr, dpr).",
      "For volume: cap SVG nodes, switch to Canvas/WebGL for density, downsample time series, throttle streaming to one render per requestAnimationFrame, and memoize scale computations.",
      "Be honest with encodings: bars must start at zero (length is the encoding); truncated axes exaggerate differences and mislead.",
    ],
    codeSamples: [
      {
        label: "Recharts — declarative bar + line charts with ResponsiveContainer",
        language: "jsx",
        code: `import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid,
} from "recharts";

const monthly = [
  { month: "Jan", meals: 4200, travel: 8500 },
  { month: "Feb", meals: 3800, travel: 6200 },
  { month: "Mar", meals: 5100, travel: 7300 },
];

export function ExpenseCharts() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* ResponsiveContainer: percentage width + fixed height -> fluid, no resize code */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthly}>
          <CartesianGrid strokeDasharray="3 3" />
          {/* each series binds to a field via dataKey; renders SVG under the hood */}
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="meals" fill="#1B4F72" />
          <Bar dataKey="travel" fill="#E67E22" />
        </BarChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthly}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="meals" stroke="#1B4F72" />
          <Line type="monotone" dataKey="travel" stroke="#E67E22" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}`,
      },
      {
        label: "D3 for math, React for rendering — the modern hybrid",
        language: "tsx",
        code: `import { scaleBand, scaleLinear } from "d3-scale";
import { max } from "d3-array";

// D3's UTILITY half is pure math (no DOM) — safe to use inside React.
// React owns the SVG; D3 only computes scales and geometry.
export function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const width = 400, height = 240, pad = 24;

  // band scale: discrete categories -> evenly spaced x slots with padding
  const x = scaleBand<string>()
    .domain(data.map((d) => d.label))
    .range([pad, width - pad])
    .padding(0.2);

  // linear scale: [0, max] -> [height, 0]  (FLIPPED: SVG y grows downward)
  const y = scaleLinear()
    .domain([0, max(data, (d) => d.value) ?? 0])
    .range([height - pad, pad]);

  return (
    <svg width={width} height={height} role="img"
      aria-label="Expenses by category">
      {data.map((d) => (
        <rect
          key={d.label}
          x={x(d.label)}
          y={y(d.value)}
          width={x.bandwidth()}
          height={y(0) - y(d.value)}
          fill="#1B4F72"
        />
      ))}
    </svg>
  );
}`,
      },
      {
        label: "Chart.js on Canvas — config object + correct devicePixelRatio",
        language: "js",
        code: `import Chart from "chart.js/auto";

// Chart.js draws to <canvas> from ONE config object: type, data, options.
// Canvas = immediate-mode bitmap: dense/fast, but no DOM per element.
const ctx = document.querySelector("#chart").getContext("2d");

new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [
      { label: "Meals", data: [4200, 3800, 5100], backgroundColor: "#1B4F72" },
      { label: "Travel", data: [8500, 6200, 7300], backgroundColor: "#E67E22" },
    ],
  },
  options: {
    responsive: true,
    // Chart.js handles DPR for you when devicePixelRatio is read from window;
    // for a RAW canvas you must do it yourself (see below) or retina looks blurry.
    scales: { y: { beginAtZero: true } }, // bars must anchor at zero
  },
});

// RAW canvas retina fix (what libraries do under the hood):
function fixDpr(canvas, cssW, cssH) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = cssW * dpr;          // backing store in device pixels
  canvas.height = cssH * dpr;
  canvas.style.width = cssW + "px";   // CSS size stays in CSS pixels
  canvas.style.height = cssH + "px";
  canvas.getContext("2d").scale(dpr, dpr); // draw in CSS-pixel coordinates
}`,
      },
      {
        label: "Accessible chart: role=img, aria-label, and a hidden data table",
        language: "jsx",
        code: `// A chart must not convey meaning by pixels/color alone.
// 1) Describe the SVG for screen readers.
// 2) Provide the raw numbers as a visually-hidden table.
// 3) Never rely on color alone — pair color with a label/pattern.
export function AccessibleChart({ data }) {
  return (
    <figure>
      <svg role="img" aria-labelledby="chartTitle chartDesc" width={400} height={240}>
        <title id="chartTitle">Monthly expenses</title>
        <desc id="chartDesc">
          Bar chart of meals and travel spend for Jan through Mar.
        </desc>
        {/* ...bars... */}
      </svg>

      {/* Visually hidden but read by AT and keyboard users */}
      <table className="sr-only">
        <caption>Monthly expenses (USD)</caption>
        <thead><tr><th>Month</th><th>Meals</th><th>Travel</th></tr></thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.month}>
              <td>{d.month}</td><td>{d.meals}</td><td>{d.travel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
// .sr-only { position:absolute; width:1px; height:1px; overflow:hidden;
//            clip:rect(0 0 0 0); white-space:nowrap; border:0; }`,
      },
    ],
    runnable: {
      title: "A bar chart drawn from scratch in SVG (data -> scale -> pixels)",
      html: `<svg id="chart" width="440" height="260" role="img" aria-label="Monthly expenses bar chart"></svg>
<p id="log"></p>`,
      css: `body { font-family: system-ui, sans-serif; padding: 16px; }
.bar { fill: #1B4F72; }
.bar:hover { fill: #E67E22; }
.axis, .label { font-size: 12px; fill: #374151; }`,
      js: `// Draw a bar chart by hand to show the data->scale->pixel pipeline.
const data = [
  { label: "Jan", value: 4200 },
  { label: "Feb", value: 3800 },
  { label: "Mar", value: 5100 },
  { label: "Apr", value: 6100 },
];
const svg = document.querySelector("#chart");
const W = 440, H = 260, pad = 32;
const maxV = Math.max(...data.map(d => d.value));

// band scale: category -> x slot;  linear scale: value -> height (flipped)
const slot = (W - pad * 2) / data.length;
const xFor = i => pad + i * slot + slot * 0.1;
const bandW = slot * 0.8;
const yFor = v => (H - pad) - (v / maxV) * (H - pad * 2); // flip: y grows down

const NS = "http://www.w3.org/2000/svg";
data.forEach((d, i) => {
  const y = yFor(d.value);
  const rect = document.createElementNS(NS, "rect");
  rect.setAttribute("class", "bar");
  rect.setAttribute("x", xFor(i));
  rect.setAttribute("y", y);
  rect.setAttribute("width", bandW);
  rect.setAttribute("height", (H - pad) - y);
  svg.appendChild(rect);

  const label = document.createElementNS(NS, "text");
  label.setAttribute("class", "label");
  label.setAttribute("x", xFor(i) + bandW / 2);
  label.setAttribute("y", H - pad + 16);
  label.setAttribute("text-anchor", "middle");
  label.textContent = d.label;
  svg.appendChild(label);
});
console.log("Drew", data.length, "bars; max value scaled to full height =", maxV);
document.querySelector("#log").textContent = "Hover a bar to highlight it.";`,
    },
    interviewQA: [
      {
        question: "When would you choose SVG over Canvas for a chart, and vice versa?",
        answer:
          "SVG is retained-mode — every shape is a real DOM element you can style with CSS, attach events to, and expose to assistive tech — so it's ideal for typical dashboards with hundreds of elements and rich interaction, and it scales crisply. But each element is a live DOM node, so SVG degrades past thousands of shapes. Canvas is immediate-mode — you draw to a bitmap and the browser forgets the shapes — so it renders tens of thousands of points fast, but you lose per-element events, CSS, and built-in accessibility (you rebuild hit-testing yourself). Rule of thumb: SVG for normal interactive charts, Canvas or WebGL for high-density or real-time data.",
      },
      {
        question: "What is a scale in charting and why is it the core abstraction?",
        answer:
          "A scale is a pure function that maps a data domain to a visual range — for example a linear scale maps [0, maxValue] to [chartHeight, 0], flipping because SVG's y-axis grows downward. Band scales map discrete categories to evenly spaced slots (bar charts), time scales map dates to pixels, and ordinal/color scales map categories to a palette. Every chart is fundamentally domain -> range; if you understand scales you can reason about any charting library, because even Recharts and Chart.js configure scales internally.",
      },
      {
        question: "When would you choose Recharts over D3?",
        answer:
          "Recharts for standard React charts — bar, line, area, pie — because it's declarative, composes from JSX, binds series via dataKey, and integrates cleanly with component state with minimal code. D3 when the visualization is custom or unusual enough that declarative chart components can't express it. Note the modern D3-with-React pattern: use D3's pure utility modules (d3-scale, d3-shape) to compute scales and path strings, but let React render the SVG — reach for d3-selection's imperative DOM data-join only for complex transitions, since it competes with React for DOM ownership.",
      },
      {
        question: "How do you make a chart accessible?",
        answer:
          "Don't convey meaning by pixels or color alone. Give the SVG role=img with a descriptive aria-label or linked <title>/<desc>. Provide the underlying numbers as a visually-hidden data table so screen-reader and keyboard users can read the actual values. Never rely on color alone — add direct labels, patterns, or shape encodings and check contrast, which also helps color-blind users. Make interactive points keyboard-focusable with a visible focus indicator. A good chart has a text alternative that stands on its own.",
      },
      {
        question: "Why do Canvas charts look blurry on retina screens and how do you fix it?",
        answer:
          "On a high-devicePixelRatio (retina) display, one CSS pixel maps to multiple device pixels. If you size the canvas backing store in CSS pixels, the browser upscales the bitmap and it looks fuzzy. The fix is to set canvas.width/height to cssSize * devicePixelRatio (the real device-pixel backing store), keep the CSS width/height fixed via style, and call ctx.scale(dpr, dpr) so your drawing code can keep using CSS-pixel coordinates. Libraries like Chart.js do this for you; raw canvas requires doing it yourself.",
      },
      {
        question: "How do you keep a chart performant with large or streaming data?",
        answer:
          "Match surface to volume: SVG caps out in the thousands of nodes, so cap element count, aggregate or bin data, and virtualize; switch to Canvas or WebGL for genuinely dense data. For time series, downsample before plotting (e.g. the LTTB algorithm) so you draw far fewer points without losing shape. For real-time streams, throttle updates to one render per animation frame with requestAnimationFrame instead of rendering on every message. And memoize scale computations so they aren't recalculated on every render.",
      },
      {
        question: "What are common ways charts mislead, and how do you avoid them?",
        answer:
          "The classic is truncating a bar chart's y-axis so it doesn't start at zero — because a bar's length is its encoding, a non-zero baseline visually exaggerates small differences. Bars must anchor at zero; line charts may start off zero to reveal trend detail since position, not length, carries the meaning. Other pitfalls: using pie charts for many slices (humans read angles poorly), dual y-axes that imply false correlation, and encoding data only through hue. Pick the encoding that matches the question — bar for comparison, line for trend over time, scatter for correlation.",
      },
    ],
    thingsToRemember: [
      "Every chart maps data space to pixel space through a scale (domain -> range).",
      "SVG = retained-mode DOM elements: styleable, interactive, accessible, crisp — but degrades past thousands of nodes.",
      "Canvas = immediate-mode bitmap: dense and fast, but no DOM, events, CSS, or built-in a11y.",
      "Linear scale flips [0,max] -> [height,0] because SVG y grows downward; band scales handle categories.",
      "D3 = utility math (d3-scale/d3-shape, pairs with React) + d3-selection DOM join (fights React).",
      "Recharts (SVG, declarative) for standard React charts; Chart.js (Canvas, config) for dense; D3 for bespoke.",
      "Accessibility: role=img + aria-label/title/desc, a hidden data table, never color alone, keyboard-focusable points.",
      "Retina Canvas needs backing store = cssSize * devicePixelRatio plus ctx.scale(dpr, dpr) or it's blurry.",
      "For volume: downsample time series, throttle streams to rAF, cap SVG nodes, memoize scales.",
      "Bars must start at zero — a truncated axis exaggerates differences and misleads.",
    ],
    references: [
      { label: "Recharts — official docs", url: "https://recharts.org/en-US/api" },
      { label: "D3 — d3-scale (the scale abstraction)", url: "https://d3js.org/d3-scale" },
      { label: "Chart.js — documentation", url: "https://www.chartjs.org/docs/latest/" },
      { label: "MDN — Canvas API & devicePixelRatio", url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" },
      { label: "web.dev — Accessible data visualizations", url: "https://web.dev/articles/accessible-data-visualizations" },
      { label: "MDN — SVG element reference", url: "https://developer.mozilla.org/en-US/docs/Web/SVG/Element" },
    ],
    tags: ["recharts", "d3", "chart.js", "charts", "data-visualization", "svg", "canvas", "scales", "accessibility"],
  },
  {
    id: "animations-transitions-framer-motion",
    num: 41,
    title: "Animations & Transitions (CSS + Framer Motion)",
    part: "UI & Visualization",
    partId: "k",
    difficulty: "Core",
    summary:
      "Why transform and opacity are the only cheap things to animate, how CSS transitions and @keyframes work, spring vs tween timing, and how Framer Motion adds exit/layout animations React can't do alone — plus honoring prefers-reduced-motion.",
    readingTime: 16,
    explanation: [
      "**The big picture (read this first).** Animation is just changing a value over time and letting the browser paint the in-between frames — ideally 60 of them per second, one every ~16.7ms. Everything about doing it *well* reduces to two questions: (1) *what* property are you animating (which decides whether the browser can do it cheaply on the GPU or has to redo expensive layout every frame), and (2) *how* does the value change over time (the timing — easing curves vs. physics springs). Get the property right and almost anything is smooth; get it wrong and even a tiny animation janks.",
      "**The cost ladder — the one rule that matters.** Browser rendering runs layout -> paint -> composite. Animating **`transform`** (translate/scale/rotate) and **`opacity`** touches only the *composite* stage: the element is already on its own layer, so the GPU just re-transforms or re-blends the existing bitmap — no layout, no paint, buttery 60fps even while the main thread is busy. Animating geometry (`width`, `height`, `top`, `left`, `margin`, `padding`) forces **reflow** every frame: recompute layout, repaint, recomposite — which cascades to other elements and janks. Animating `color`/`background` is in between (repaint, no reflow). The golden rule: **animate `transform` and `opacity`, never `top`/`left`/`width`.**",
      "**CSS transitions — animate a state change.** A `transition` interpolates a property when its value changes (usually on `:hover`, `:focus`, or a toggled class). You declare `transition: transform 0.25s ease, opacity 0.25s ease` and the browser animates whenever those properties change. Transitions are perfect for enter/leave-on-toggle and micro-interactions because they're declarative, need no JS, and stay on the compositor when you transition transform/opacity. You can't loop them or define intermediate steps — for that you need keyframes.",
      "**CSS keyframes — animate a timeline.** `@keyframes` define named waypoints (`0%`, `50%`, `100%`) and `animation: pulse 1.2s ease-in-out infinite` plays them, with control over duration, iteration count, direction, delay, and fill mode. Keyframes handle looping, multi-step, and self-starting animations (spinners, pulses, attention cues) that transitions can't. Same performance rule applies: keep the animated properties to transform/opacity.",
      "**Easing: the shape of time.** Easing maps linear time to a progress curve so motion feels natural rather than robotic. `linear` is constant speed (mechanical); `ease-in` accelerates (good for exits); `ease-out` decelerates (good for entrances — feels responsive); `ease-in-out` does both. `cubic-bezier(...)` defines a custom curve. As a default, `ease-out` for elements entering feels snappy because it starts fast and settles gently.",
      "**Tween vs spring — two models of motion.** A **tween** animates over a *fixed duration* along an easing curve (300ms ease-out): predictable and repeatable, best for UI transitions where you want consistent timing. A **spring** is physics-based — you specify `stiffness`, `damping`, and `mass`, and the motion has no fixed duration; it settles naturally and can subtly overshoot, which feels organic and interruptible. Springs shine for gestures and draggable/interactive elements because when the target changes mid-flight they respond continuously from the current velocity, whereas a tween would restart. Framer Motion supports both; pick tween for deterministic UI and spring for tactile, interruptible motion.",
      "**Framer Motion — declarative animation for React.** You swap an element for its `motion.*` counterpart (`motion.div`) and describe states as props: `initial` (start), `animate` (end), `transition` (timing/type). An entrance is just `initial={{ opacity: 0, y: 20 }}` -> `animate={{ opacity: 1, y: 0 }}`. Its `x`/`y`/`scale`/`rotate` shorthands map to `transform`, so it stays on the cheap composite path by design. `variants` let you name reusable state sets and orchestrate children with `staggerChildren`. It's the declarative, state-driven way to do what you'd otherwise wire up imperatively.",
      "**Exit animations — the thing React can't do alone.** React removes a component from the DOM the instant it unmounts, so there's no chance to animate it out. Wrapping elements in `<AnimatePresence>` defers the actual unmount until the element's `exit` animation finishes — enabling leave animations for list removals and route changes. It's exactly like a graceful-shutdown drain: instead of instantly killing the component, you let in-flight work (the animation) complete first.",
      "**Layout animations and FLIP.** The `layout` prop makes an element smoothly animate to its new position/size when the layout changes (a list reorders, a card expands). Under the hood it uses **FLIP** — First, Last, Invert, Play: measure the start and end box, apply an inverse `transform` so the element *looks* unmoved, then animate that transform to zero. Because FLIP animates `transform` (not `width`/`top`), the reorder stays on the compositor and smooth. This is how you animate layout changes without paying the reflow-every-frame cost.",
      "**Page transitions.** Combine the two: wrap routed content in `<AnimatePresence mode=\"wait\">` so the outgoing page finishes its exit before the incoming one enters, and key a `motion.div` by the current path so Framer Motion treats each route as a distinct element to animate in and out. Give it `initial`/`animate`/`exit` (often a simple opacity or slide) and a short transition.",
      "**Accessibility — honor prefers-reduced-motion.** Vestibular disorders make large motion literally nauseating, so the OS exposes a \"reduce motion\" setting. Respect it: in CSS, wrap non-essential animation in `@media (prefers-reduced-motion: reduce)` and disable or shorten it; in Framer Motion, use the `useReducedMotion()` hook to swap big movement for a simple fade or none. Don't remove *all* feedback — keep subtle opacity changes — just kill the large parallax, spins, and slides. This is a real accessibility requirement, not a nicety.",
      "**Practical guardrails.** Prefer CSS transitions/keyframes for simple, self-contained micro-interactions (they need no JS and stay on the compositor) and reach for Framer Motion when you need exit animations, layout/FLIP, orchestration, or gesture-driven springs. Keep animations short (150–350ms for UI) — long animations feel sluggish. Avoid animating many elements at once, use `will-change` sparingly (it promotes a layer but overuse wastes memory), and always test on a mid-range device, not just your fast laptop.",
      "**The mental model (memorise this).** Animate `transform` and `opacity` only — they ride the GPU compositor and skip layout/paint, so they hold 60fps; geometry properties force reflow every frame and jank. CSS transitions animate a state change and keyframes animate a looping timeline; tweens use a fixed-duration easing curve while springs use interruptible physics. Framer Motion adds what React can't: `AnimatePresence` for exit animations (a graceful drain before unmount) and `layout`/FLIP for smooth reorders — and always honor `prefers-reduced-motion`.",
    ],
    backendAnalogy:
      "The cost ladder is the same tiered-cost thinking you use for datastore writes: a transform/opacity change is a cache flip or feature-flag toggle (near-free, no rebuild), a repaint is a hot-swap of one class, and a geometry change that forces reflow is a full recompile-and-redeploy that cascades through dependents. AnimatePresence is a graceful-shutdown hook: React normally kills a component instantly on unmount, but AnimatePresence defers removal until the exit animation completes — exactly how a server drains in-flight requests before shutting down instead of dropping connections. Spring vs tween is control theory vs a fixed schedule: a spring is a PID-style controller that continuously converges on a moving target from its current state (interruptible), while a tween is a fixed cron-like schedule that must restart if the target changes. Honoring prefers-reduced-motion is reading a client capability/preference header and degrading the response accordingly.",
    keyInsights: [
      "Animate transform (translate/scale/rotate) and opacity only — they touch just the composite stage, run on the GPU, and hold 60fps.",
      "Animating geometry (width/height/top/left/margin) forces reflow every frame, cascades to other elements, and janks; color/background is a cheaper repaint but still not composite-only.",
      "CSS transitions animate a state change (hover/focus/toggled class); @keyframes animate a looping, multi-step, self-starting timeline.",
      "Easing shapes time: ease-out (decelerate) feels responsive for entrances, ease-in for exits, cubic-bezier for custom curves.",
      "Tween = fixed-duration easing curve, deterministic UI transitions; spring = physics (stiffness/damping/mass), no fixed duration, interruptible — best for gestures and draggable elements.",
      "Framer Motion: motion.* elements with initial/animate/transition; x/y/scale shorthands map to transform so it stays on the cheap path by design.",
      "AnimatePresence defers unmount until the exit animation finishes — the only way to animate elements leaving in React (list removals, route changes).",
      "The layout prop animates position/size changes via FLIP (First/Last/Invert/Play) using transforms, so reorders stay smooth and compositor-driven.",
      "Page transitions: AnimatePresence mode=\"wait\" + a motion.div keyed by the route path so old exits before new enters.",
      "Honor prefers-reduced-motion (CSS media query or useReducedMotion()) — reduce large motion to a fade/none; it's an accessibility requirement, not optional polish.",
    ],
    codeSamples: [
      {
        label: "CSS transitions vs @keyframes — both on the cheap transform/opacity path",
        language: "css",
        code: `/* TRANSITION: interpolate a property when its value changes (on hover).
   Transitioning transform + opacity stays on the compositor -> 60fps. */
.card {
  opacity: 0.9;
  /* declare WHAT animates and HOW LONG/curve */
  transition: transform 0.25s ease-out, opacity 0.25s ease-out;
}
.card:hover {
  transform: translateY(-6px) scale(1.03); /* GPU transform, no reflow */
  opacity: 1;
}

/* KEYFRAMES: a looping, multi-step, self-starting timeline. */
@keyframes pulse {
  0%, 100% { transform: scale(1);    opacity: 1;   }
  50%      { transform: scale(1.12); opacity: 0.6; }
}
.badge {
  animation: pulse 1.2s ease-in-out infinite;
}

/* ACCESSIBILITY: honor the user's reduce-motion preference. */
@media (prefers-reduced-motion: reduce) {
  .card { transition: opacity 0.15s ease; }   /* drop the movement */
  .card:hover { transform: none; }
  .badge { animation: none; }
}`,
      },
      {
        label: "Framer Motion — entrance, exit list, and orchestrated children",
        language: "tsx",
        code: `import { motion, AnimatePresence, type Variants } from "framer-motion";

// Named variants make states reusable and let a parent orchestrate children.
const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } }, // cascade children in
};
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },   // x/y/scale map to transform (cheap)
  show:   { opacity: 1, x: 0 },
  exit:   { opacity: 0, x: 20 },
};

export function ExpenseList({ items }: { items: { id: string; label: string }[] }) {
  return (
    <motion.ul variants={listVariants} initial="hidden" animate="show">
      {/* AnimatePresence defers unmount so 'exit' can play on removal */}
      <AnimatePresence>
        {items.map((item) => (
          <motion.li
            key={item.id}
            variants={itemVariants}
            exit="exit"
            layout               // FLIP: smooth reorder via transforms
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {item.label}
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}`,
      },
      {
        label: "Spring vs tween, and honoring reduced motion in React",
        language: "tsx",
        code: `import { motion, useReducedMotion } from "framer-motion";

export function Panel({ open }: { open: boolean }) {
  const reduceMotion = useReducedMotion(); // reads OS reduce-motion setting

  return (
    <motion.div
      animate={{ x: open ? 0 : -300, opacity: open ? 1 : 0 }}
      transition={
        reduceMotion
          // reduced motion: instant/short fade, no big movement
          ? { duration: 0.15 }
          // SPRING: physics, no fixed duration, interruptible mid-flight.
          // Great for gestures because it continues from current velocity.
          : { type: "spring", stiffness: 260, damping: 24 }
      }
    >
      Sliding panel
    </motion.div>
  );
}

// TWEEN alternative: fixed duration + easing curve — deterministic UI.
// transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}`,
      },
      {
        label: "Page transitions with AnimatePresence + a router",
        language: "tsx",
        code: `import { motion, AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";

export function AnimatedRoutes() {
  const location = useLocation();
  return (
    // mode="wait": outgoing page finishes exit BEFORE incoming enters
    <AnimatePresence mode="wait">
      <motion.div
        // keying by path makes each route a distinct element to animate
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}`,
      },
    ],
    runnable: {
      title: "Cheap CSS animation: transform + opacity, with reduced-motion respect",
      html: `<div class="card">
  <h3>Expense</h3>
  <p>Hover me — I lift with transform only</p>
</div>
<div class="badge">Pulsing badge</div>`,
      css: `body { font-family: system-ui, sans-serif; padding: 24px; display: flex; gap: 24px; align-items: center; }

/* Transition ONLY transform + opacity -> GPU compositor, no reflow */
.card {
  background: #1B4F72; color: #fff; padding: 24px; border-radius: 12px;
  opacity: 0.85;
  transition: transform 0.25s ease-out, opacity 0.25s ease-out;
  cursor: pointer;
}
.card:hover { transform: translateY(-6px) scale(1.04); opacity: 1; }

/* Looping keyframe on transform/opacity */
.badge {
  background: #E67E22; color: #fff; padding: 8px 16px; border-radius: 999px;
  font-weight: 700;
  animation: pulse 1.2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { transform: scale(1);    opacity: 1;   }
  50%      { transform: scale(1.12); opacity: 0.7; }
}

/* Accessibility: kill big motion when the user asks for less */
@media (prefers-reduced-motion: reduce) {
  .card:hover { transform: none; }
  .badge { animation: none; }
}`,
      js: `// Log which properties are animating and whether reduced motion is on.
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
console.log("prefers-reduced-motion:", reduce ? "reduce" : "no-preference");
console.log("Animating transform + opacity only -> composite stage -> 60fps.");`,
    },
    interviewQA: [
      {
        question: "Why animate transform and opacity instead of width/height or top/left?",
        answer:
          "Browser rendering is layout -> paint -> composite. transform (translate/scale/rotate) and opacity touch only the composite stage: the element is on its own layer, so the GPU just re-transforms or re-blends the existing bitmap — no layout, no paint — so it holds 60fps even while the main thread is busy. Animating width, height, top, left, or margin forces a reflow every frame (recompute layout, repaint, recomposite), which cascades to other elements and janks. That's why Framer Motion's x/y/scale shorthands map to transforms and why FLIP animates transform rather than geometry.",
      },
      {
        question: "What's the difference between a CSS transition and a CSS keyframe animation?",
        answer:
          "A transition interpolates a property when its value changes — typically on hover, focus, or a toggled class — so it's declarative, needs no JS, and is ideal for micro-interactions and enter/leave-on-toggle. Keyframes (@keyframes + animation) define named waypoints across a timeline and can loop, run multiple steps, and start on their own — good for spinners, pulses, and attention cues that a transition can't express. Both should stick to animating transform and opacity for performance.",
      },
      {
        question: "When would you use a spring instead of a tween?",
        answer:
          "A tween animates over a fixed duration along an easing curve — predictable and repeatable, best for deterministic UI transitions where consistent timing matters. A spring is physics-based (stiffness, damping, mass) with no fixed duration; it settles naturally, can subtly overshoot, and is interruptible. Springs are best for gestures and draggable or interactive elements because when the target changes mid-flight they continue from the current velocity, whereas a tween would restart. Use tween for deterministic UI, spring for tactile, interruptible motion.",
      },
      {
        question: "What problem does AnimatePresence solve?",
        answer:
          "React removes a component from the DOM the instant it unmounts, so there's no opportunity to animate it out. AnimatePresence defers the actual unmount until the element's exit animation finishes, enabling leave animations for items removed from a list or routes swapping during a page transition. It's analogous to a graceful-shutdown drain — letting in-flight work (the animation) complete before removal — rather than an instant kill.",
      },
      {
        question: "How does the layout prop work and what is FLIP?",
        answer:
          "The layout prop tells Framer Motion to smoothly animate an element to its new position or size when the layout changes, such as a list reorder or a card expanding. It uses FLIP — First, Last, Invert, Play: measure the start and end boxes, apply an inverse transform so the element appears not to have moved, then animate that transform back to zero. Because it animates transform rather than width/top, the change stays on the compositor and smooth, avoiding the reflow-every-frame cost.",
      },
      {
        question: "How do you respect prefers-reduced-motion, and why does it matter?",
        answer:
          "Large motion can cause nausea and dizziness for people with vestibular disorders, so the OS exposes a reduce-motion setting. In CSS, wrap non-essential animation in @media (prefers-reduced-motion: reduce) and disable or shorten it; in Framer Motion, use the useReducedMotion() hook to swap large movement for a simple fade or none. Don't strip all feedback — keep subtle opacity changes — just remove big parallax, spins, and slides. It's a genuine accessibility requirement, not optional polish.",
      },
      {
        question: "When would you reach for Framer Motion instead of plain CSS?",
        answer:
          "Use CSS transitions and keyframes for simple, self-contained micro-interactions — they need no JS and stay on the compositor. Reach for Framer Motion when you need things CSS can't do cleanly in React: exit animations for unmounting elements (AnimatePresence), smooth layout/reorder animations via FLIP (the layout prop), orchestration like staggering children, or gesture-driven, interruptible spring physics. Match the tool to the need rather than pulling in a library for a hover effect.",
      },
    ],
    thingsToRemember: [
      "Animate transform + opacity only — composite stage, GPU, 60fps; geometry forces reflow every frame and janks.",
      "CSS transition = animate a state change (hover/toggle); @keyframes = looping, multi-step, self-starting timeline.",
      "ease-out for entrances (feels responsive), ease-in for exits, cubic-bezier for custom curves.",
      "Tween = fixed-duration easing (deterministic UI); spring = physics, interruptible, best for gestures/drag.",
      "Framer Motion motion.* + initial/animate/transition; x/y/scale map to transform by design.",
      "AnimatePresence defers unmount so exit animations can play — the only way to animate elements leaving in React.",
      "layout prop animates reorders via FLIP (First/Last/Invert/Play) using transforms.",
      "Page transitions: AnimatePresence mode=\"wait\" + motion.div keyed by route path.",
      "Honor prefers-reduced-motion (CSS media query or useReducedMotion()) — reduce big motion to a fade/none.",
      "Keep UI animations short (150-350ms), avoid animating many elements at once, and test on a mid-range device.",
    ],
    references: [
      { label: "Framer Motion — official docs", url: "https://www.framer.com/motion/" },
      { label: "MDN — Using CSS transitions", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions/Using_CSS_transitions" },
      { label: "MDN — Using CSS animations (@keyframes)", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations" },
      { label: "web.dev — Animations and performance", url: "https://web.dev/articles/animations-guide" },
      { label: "MDN — prefers-reduced-motion", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion" },
      { label: "web.dev — Stick to compositor-only properties", url: "https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count" },
    ],
    tags: ["framer-motion", "animation", "transitions", "keyframes", "spring", "tween", "performance", "prefers-reduced-motion", "css"],
  },
];
