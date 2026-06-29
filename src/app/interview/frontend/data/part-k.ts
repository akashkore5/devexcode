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
      "Consume, theme, and override pre-built accessible component libraries like MUI and Atlaskit.",
    readingTime: 6,
    explanation: [
      "Libraries such as **MUI** (Material UI) and **Atlaskit** provide pre-built, accessible, themed components — buttons, text fields, data grids, dialogs — so you don't reinvent UI primitives. The core skill is **consuming, customizing, and overriding** their design tokens rather than fighting them. Both libraries ship a theming system that centralizes color, typography, spacing, and shape so a brand change is a single source-of-truth edit.",
      "In MUI you create a theme with `createTheme` and inject it via a `ThemeProvider` at the app root. The theme object holds **design tokens**: `palette` (primary/secondary colors), `typography` (font family, heading scales), and per-component `styleOverrides` that reshape every instance of a component (e.g. rounding all `MuiButton` corners). Components then read these tokens through context, so a token change ripples everywhere consistently.",
      "For data-heavy screens, MUI's **DataGrid** renders sortable, selectable, paginated tables. You declare `columns` (field, header, width, optional `renderCell` for custom rendering) and pass `rows`; the grid handles virtualization, selection, and pagination for you. The same pattern — declarative config plus theme tokens — is how you stay productive without dropping to raw markup.",
      "The trade-off to articulate in interviews is **consuming vs overriding**: lean on the library's defaults and tokens for consistency and accessibility, override at the theme level (not ad-hoc inline styles) when you need brand fit, and only build bespoke components when the library genuinely can't express the requirement. Accessibility (focus management, ARIA roles, keyboard support) is the biggest reason to reach for a mature library rather than hand-rolling components.",
    ],
    backendAnalogy:
      "A component library's theme is like a shared configuration / dependency-injection layer: define tokens once (palette, typography) in a central ThemeProvider, and every component resolves them at runtime — just as Spring beans read centralized application properties instead of hard-coding values per class.",
    keyInsights: [
      "Centralize branding in a theme (palette, typography, component styleOverrides) and inject it via ThemeProvider; never scatter inline style overrides.",
      "Override at the theme/token level for consistency; reserve bespoke components for cases the library can't express.",
      "Mature libraries give you accessibility (ARIA, focus, keyboard) and DataGrid-style virtualization for free — a major reason not to hand-roll.",
      "DataGrid is config-driven: declare columns (field, headerName, width, renderCell) and pass rows; pagination and selection are built in.",
    ],
    codeSamples: [
      {
        label: "MUI — Theming, customization, and DataGrid",
        language: "tsx",
        code: `// MUI — Material UI (your primary library)
import { Button, TextField, DataGrid, ThemeProvider, createTheme } from "@mui/material";

// Custom theme — override MUI defaults to match Dice branding
const diceTheme = createTheme({
  palette: {
    primary: { main: "#1B4F72" },
    secondary: { main: "#E67E22" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h1: { fontSize: "2rem", fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: "none" },
      },
    },
  },
});

// Wrap app in ThemeProvider
<ThemeProvider theme={diceTheme}>
  <Button variant="contained" color="primary">Submit Expense</Button>
  <TextField label="Amount" type="number" variant="outlined" />
</ThemeProvider>

// MUI DataGrid — for data-heavy tables
<DataGrid
  rows={expenses}
  columns={[
    { field: "id", headerName: "ID", width: 70 },
    { field: "category", headerName: "Category", width: 130 },
    { field: "amount", headerName: "Amount", type: "number", width: 120 },
    { field: "approved", headerName: "Status", width: 100, renderCell: (params) => params.value ? "✅" : "⏳" },
  ]}
  pageSize={10}
  checkboxSelection
/>`,
      },
    ],
    interviewQA: [
      {
        question: "What are design tokens and why theme through a provider instead of inline styles?",
        answer:
          "Design tokens are named, reusable design decisions — palette colors, typography scales, spacing, border radius. Putting them in a theme and injecting it via ThemeProvider gives a single source of truth: components resolve tokens through context, so a brand change is one edit that ripples everywhere consistently. Inline overrides scatter the same value across files, drift over time, and break theming/dark-mode support.",
      },
      {
        question: "How do you decide between consuming, overriding, and building a component from scratch?",
        answer:
          "Default to consuming the library component for its accessibility and consistency. When you need brand fit, override at the theme level (palette, typography, component styleOverrides) so the change is global and predictable. Only build bespoke when the library genuinely can't express the requirement — bespoke means you also own the accessibility, keyboard handling, and edge cases the library was solving for you.",
      },
      {
        question: "Why do component libraries matter for accessibility?",
        answer:
          "Mature libraries like MUI and Atlaskit ship correct ARIA roles, focus management, keyboard navigation, and screen-reader behavior that are easy to get wrong by hand. A custom Modal or Menu often forgets focus trapping, escape-to-close, or aria-expanded; the library has already solved and tested these, so consuming it is usually more accessible than hand-rolling.",
      },
      {
        question: "How does MUI DataGrid stay performant on large datasets?",
        answer:
          "DataGrid is config-driven and virtualizes rows — it only renders the visible window rather than every row — and provides built-in pagination, sorting, and selection. You declare columns (field, headerName, width, renderCell) and pass rows; the grid handles the heavy lifting, which avoids the DOM blowup of rendering thousands of table rows yourself.",
      },
    ],
    thingsToRemember: [
      "createTheme defines tokens (palette, typography, component styleOverrides); ThemeProvider injects them at the app root.",
      "Override at the theme level for consistency; bespoke components mean you own accessibility yourself.",
      "DataGrid is declarative (columns + rows) with built-in virtualization, pagination, and selection.",
    ],
    references: [
      { label: "MUI — Official docs", url: "https://mui.com/material-ui/" },
      { label: "Atlaskit — Atlassian Design System", url: "https://atlassian.design/" },
    ],
    tags: ["mui", "atlaskit", "design-system", "theming", "accessibility"],
  },
  {
    id: "data-visualization-charts",
    num: 40,
    title: "Data Visualization & Charts (Recharts)",
    part: "UI & Visualization",
    partId: "k",
    difficulty: "Core",
    summary:
      "Declarative React charting with Recharts — bar, line, and pie — plus when to reach for D3.",
    readingTime: 5,
    explanation: [
      "**Recharts** is a declarative React charting library: you compose a chart from JSX components — `<BarChart>`, `<LineChart>`, `<PieChart>` — and nest axes (`<XAxis>`, `<YAxis>`), a `<Tooltip>`, and data series (`<Bar>`, `<Line>`, `<Pie>`) inside it. Each series binds to a key in your data array via `dataKey`, so the chart reads like markup that mirrors the data shape.",
      "Wrapping a chart in `<ResponsiveContainer>` makes it fluidly fill its parent's width while keeping a fixed height, so charts adapt to layout without manual resize handling. Colors are set per series (`fill` for bars/pie cells, `stroke` for lines), letting you align charts with your design tokens.",
      "Recharts is the right default for **standard charts in React** — bar, line, area, pie — because it is declarative and integrates cleanly with component state. **ApexCharts** is another option used in these projects, while **D3.js** gives full low-level control for **custom, bespoke visualizations** where you need to drive SVG directly. The interview point is matching the tool to the need: Recharts/ApexCharts for common charts with minimal code, D3 when the visualization is unusual enough that declarative components can't express it.",
      "The library trade-off table below summarizes the choices:\n\n| Library | Best for | Trade-off |\n| --- | --- | --- |\n| Recharts | Standard React charts (bar/line/pie) | Declarative, easy; limited for unusual visuals |\n| ApexCharts | Standard charts with rich built-ins | More features, heavier bundle |\n| D3.js | Fully custom visualizations | Maximum control; most code and complexity |",
    ],
    keyInsights: [
      "Recharts is declarative — compose charts from JSX components and bind series to data via dataKey.",
      "Wrap charts in ResponsiveContainer (percentage width, fixed height) for fluid responsiveness without resize code.",
      "Set fill on bars/pie cells and stroke on lines to align colors with your design tokens.",
      "Recharts/ApexCharts for standard charts in React; D3.js when you need full control over a custom visualization.",
    ],
    codeSamples: [
      {
        label: "Recharts — Bar and Line charts",
        language: "jsx",
        code: `// Recharts — declarative React charting
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const monthlyData = [
  { month: "Jan", meals: 4200, travel: 8500 },
  { month: "Feb", meals: 3800, travel: 6200 },
  { month: "Mar", meals: 5100, travel: 7300 },
];

function ExpenseDashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="meals" fill="#1B4F72" />
          <Bar dataKey="travel" fill="#E67E22" />
        </BarChart>
      </ResponsiveContainer>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Line type="monotone" dataKey="meals" stroke="#1B4F72" />
          <Line type="monotone" dataKey="travel" stroke="#E67E22" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}`,
      },
    ],
    interviewQA: [
      {
        question: "When would you choose Recharts over D3.js?",
        answer:
          "Recharts for standard charts in React — bar, line, area, pie — because it is declarative, composes from JSX, and integrates cleanly with component state and props with minimal code. D3.js when the visualization is custom or unusual enough that declarative chart components can't express it; D3 gives full low-level control over SVG and data binding at the cost of significantly more code and complexity.",
      },
      {
        question: "How does Recharts make charts responsive?",
        answer:
          "By wrapping the chart in ResponsiveContainer with a percentage width and a fixed height. The container measures its parent and resizes the chart fluidly as the layout changes, so you don't write manual resize listeners. Series still bind to data via dataKey, and colors are set per series with fill (bars/pie) or stroke (lines).",
      },
      {
        question: "What are the trade-offs between Recharts, ApexCharts, and D3?",
        answer:
          "Recharts is declarative and quick for common React charts but limited for unusual visuals. ApexCharts offers more built-in features (rich interactivity, more chart types) at the cost of a heavier bundle. D3.js gives maximum control for fully custom visualizations but requires the most code and is the most complex to maintain. Match the tool to the need rather than defaulting to the most powerful one.",
      },
    ],
    thingsToRemember: [
      "Recharts is declarative: compose <BarChart>/<LineChart>/<PieChart> with axes, Tooltip, and dataKey-bound series.",
      "ResponsiveContainer (percent width + fixed height) handles responsiveness; fill colors bars/pie, stroke colors lines.",
      "Recharts/ApexCharts for standard charts; D3.js for fully custom visualizations.",
    ],
    references: [
      { label: "Recharts — docs", url: "https://recharts.org" },
      { label: "ApexCharts — React integration", url: "https://apexcharts.com/docs/react-charts/" },
      { label: "D3.js — Official docs", url: "https://d3js.org" },
    ],
    tags: ["recharts", "charts", "data-visualization", "d3", "apexcharts"],
  },
  {
    id: "animations-transitions-framer-motion",
    num: 41,
    title: "Animations & Transitions (Framer Motion)",
    part: "UI & Visualization",
    partId: "k",
    difficulty: "Core",
    summary:
      "Declarative entrance, list, and page animations with Framer Motion — and why transforms are cheap.",
    readingTime: 6,
    explanation: [
      "**Framer Motion** is a declarative animation library for React. You replace an element with its `motion.*` counterpart (e.g. `motion.div`) and describe states as props: `initial` (where the element starts), `animate` (where it ends), and `transition` (timing/easing). The library interpolates between states automatically, so an entrance animation is just `initial={{ opacity: 0, y: 20 }}` to `animate={{ opacity: 1, y: 0 }}`.",
      "For lists, wrap items in `<AnimatePresence>` so elements can animate **out** as they unmount via the `exit` prop — something React can't do on its own because the element is gone by the time it would animate. Adding the `layout` prop makes items smoothly animate to new positions when the list reorders, using the FLIP technique under the hood. Page transitions combine the two: key a `motion.div` by `location.pathname` inside `AnimatePresence mode=\\\"wait\\\"` so the old route animates out before the new one animates in.",
      "The performance rule that comes up in interviews: **animate `transform` and `opacity`, not layout properties**. `transform` (translate/scale/rotate) and `opacity` are handled by the compositor and can be GPU-accelerated without triggering layout or paint, so they stay at 60fps. Animating `width`, `height`, `top`, `left`, or `margin` forces reflow and repaint every frame, which janks. This is why Framer Motion's `x`/`y`/`scale` shorthands map to transforms, and why the `layout` prop animates position via transforms rather than mutating geometry directly.",
      "Below the React layer, the same principle applies to plain CSS: `transition` and `@keyframes` driving `transform`/`opacity` are the cheapest way to animate. The runnable demo shows a pure CSS transition you can drop into any page — no library required.",
    ],
    backendAnalogy:
      "AnimatePresence is like a graceful-shutdown hook: React normally kills a component instantly on unmount, but AnimatePresence defers removal until the exit animation finishes — the same way a server drains in-flight requests before shutting down rather than dropping connections.",
    keyInsights: [
      "Use motion.* elements with initial/animate/transition props to describe animations declaratively.",
      "AnimatePresence enables exit animations for unmounting elements; the layout prop animates reorders via FLIP.",
      "Animate transform (x/y/scale) and opacity — compositor/GPU-friendly, no reflow — never width/height/top/left.",
      "Page transitions: key a motion.div by location.pathname inside AnimatePresence mode=\"wait\".",
    ],
    codeSamples: [
      {
        label: "Framer Motion — Entrance, list, and page animations",
        language: "tsx",
        code: `import { motion, AnimatePresence } from "framer-motion";

// Simple entrance animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <ExpenseCard />
</motion.div>

// List animations (items entering/leaving)
function AnimatedList({ items }: { items: Expense[] }) {
  return (
    <AnimatePresence>
      {items.map(item => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          layout // smooth reorder animation
        >
          <ExpenseCard {...item} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

// Page transitions with React Router
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
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
      title: "Cheap CSS animation: transform + opacity (hover the card)",
      html: `<div class="card">
  <h3>Expense</h3>
  <p>Hover me</p>
</div>
<div class="pulse">Pulsing badge</div>`,
      css: `body { font-family: system-ui; padding: 24px; display: flex; gap: 24px; align-items: center; }

/* Transition only transform + opacity — GPU-friendly, no reflow */
.card {
  background: #1B4F72;
  color: #fff;
  padding: 24px;
  border-radius: 12px;
  opacity: 0.85;
  transition: transform 0.25s ease, opacity 0.25s ease;
  cursor: pointer;
}
.card:hover {
  transform: translateY(-6px) scale(1.04);
  opacity: 1;
}

/* Keyframe animation driving transform/opacity */
.pulse {
  background: #E67E22;
  color: #fff;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 700;
  animation: pulse 1.2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.12); opacity: 0.7; }
}`,
    },
    interviewQA: [
      {
        question: "Why animate transform and opacity instead of width/height or top/left?",
        answer:
          "transform (translate/scale/rotate) and opacity are handled by the compositor and can be GPU-accelerated without triggering layout or paint, so they hold 60fps. Animating width, height, top, left, or margin forces reflow and repaint on every frame, which janks. That's why Framer Motion's x/y/scale shorthands map to transforms, and why its layout prop moves elements via transforms rather than mutating geometry.",
      },
      {
        question: "What problem does AnimatePresence solve?",
        answer:
          "React removes a component from the DOM the instant it unmounts, so there's no opportunity to animate it out. AnimatePresence defers the actual unmount until the element's exit animation completes, enabling leave animations for items removed from a list or routes swapping during a page transition. It's analogous to a graceful-shutdown drain rather than an instant kill.",
      },
      {
        question: "How does the layout prop work and what is FLIP?",
        answer:
          "The layout prop tells Framer Motion to smoothly animate an element to its new position when the layout changes (e.g. list reorder). It uses FLIP — First, Last, Invert, Play: measure the start and end positions, apply an inverse transform so the element appears unmoved, then animate the transform to zero. Because it animates transform rather than layout properties, the reorder stays smooth and compositor-driven.",
      },
      {
        question: "How do you implement page transitions with Framer Motion and a router?",
        answer:
          "Wrap the routed content in AnimatePresence with mode=\"wait\" so the outgoing page finishes its exit before the incoming page enters, and key a motion.div by location.pathname so Framer Motion treats each route as a distinct element to animate in and out. Give it initial/animate/exit (e.g. opacity) and a short transition duration.",
      },
    ],
    thingsToRemember: [
      "motion.* elements + initial/animate/transition describe animations declaratively.",
      "AnimatePresence enables exit animations; layout prop animates reorders via FLIP.",
      "Animate transform + opacity (compositor/GPU, no reflow); avoid width/height/top/left.",
    ],
    references: [
      { label: "Framer Motion — docs", url: "https://www.framer.com/motion/" },
      { label: "MDN — CSS Animations", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations" },
    ],
    tags: ["framer-motion", "animation", "transitions", "performance", "css"],
  },
];
