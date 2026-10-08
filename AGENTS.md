# AGENTS.md

TUI portfolio built with **Ink** (React for terminals) and **TypeScript**, served to browsers through **ttyd**.

## Commands

```sh
pnpm start          # run the app in dev (uses tsx, no build step)
pnpm build          # bundle to dist/main.js (esbuild, self-contained)
pnpm start:prod     # run the bundle with plain node
pnpm typecheck      # tsc --noEmit
```

## Environment

- **Requires a real TTY** — uses alternate screen buffer (`\x1b[?1049h`) and raw mode. Won't work in CI or non-interactive shells.
- Package manager is **pnpm**. Ink 7 needs **Node ≥ 22**.

## Architecture

```
src/
  main.tsx        # entrypoint: alt-screen + cursor control, renders <App>
  App.tsx         # layout (header / sidebar menu / content / footer) + keyboard dispatch
  theme.ts        # shared colors
  lines.ts        # Span/Line types + wrapText/sliceLine (screen content model)
  mouse.ts        # SGR mouse tracking: filters stdin for Ink, emits wheel/click events
  hooks/
    useTerminalSize.ts  # columns/rows, re-renders on resize
  components/
    ScreenView    # every screen's frame: title rule, spinner + streaming, wheel/j/k scroll + scrollbar
    Header        # gradient name (pre-rendered block art; compact fallback for small terminals)
    Menu, Footer, EmailForm
  screens/        # About, Experience, Projects, Skills, Contact (all render via ScreenView)
  data/
    content.ts    # profile, about text, experience groups, projects, contact info
    skills.ts     # Skill[] with brand color + 2-letter badge, grouped by category
```

## Key patterns

- **Layout**: menu always visible on the left, content panel on the right. ↑↓ / tab / clicking a menu item shows that screen; `1`–`5` jump directly (disabled on Contact, where digits go into the message). Two-phase exit: first `esc`/`ctrl+c` shows a prompt, the second quits — `exitOnCtrlC` is `false` so the email form can accept any character.
- **Screens return lines**: each screen builds `Line[]` (arrays of styled `Span`s from `lines.ts`), **one terminal row per line**, and hands it to `ScreenView`, which handles streaming and scrolling. Pre-wrap long text with `wrapText(text, width)` so the row count stays exact. Non-scrolling extras (e.g. the Contact form) go in `ScreenView`'s `footer` prop.
- **Animation**: every visit plays a Claude Code–style spinner (`✻ Recalling…`, `SPINNER_MS`) and then streams the visible text in character by character over ~`STREAM_TICKS × TICK_MS` (constants in `ScreenView.tsx`). Each screen passes its own `verb`.
- **Mouse**: `main.tsx` turns on SGR mouse tracking and gives Ink a filtered stdin (`mouse.ts`). Without tracking, browsers send the wheel as ↑/↓ keys, which would move the menu. `useMouse()` subscribes to wheel/click events. Side effect: selecting text in the browser needs shift+drag.
- **Links**: print plain `https://` URLs — ttyd opens them on a normal click. Only the long Gmail draft URL uses an OSC 8 hyperlink (the browser asks for confirmation). `screens/linkTip.ts` is the highlighted "click a link" hint.
- **Rendering performance** (the app is streamed over the network by ttyd, so bytes matter):
  - `render()` uses `incrementalRendering: true` — only changed lines are rewritten.
  - The root box is `rows - 1` tall. If output fills every row, Ink clears and repaints the whole terminal each frame — don't "fix" the empty last row.
  - Static parts (`Header`, `Menu`, `Footer`) are `memo`ized.
- **Responsive**: `App.tsx` derives sizes from `useTerminalSize()`. The block-art name needs ≥ 78 columns and ≥ 26 rows, otherwise the header collapses to one line. Experience moves dates under the title when the row is too narrow.
- **Skill badges** are two-letter labels on the brand color (text color picked for contrast) — crisp in any terminal font, no icon fonts needed.
- **Contact email form** is controlled from `App` (the draft survives switching screens). Enter builds a Gmail compose URL, shown as a clickable OSC 8 link — the app runs on a server, so it can't open the visitor's browser itself.

## Deployment

`Dockerfile` is multi-stage: the build stage runs `pnpm build`; the runtime stage is `node:22-slim` + the ttyd binary + `dist/main.js` only (no `node_modules`). ttyd spawns `node main.js` per browser tab. Render deploys from `main` via `render.yaml`.

## Dependencies

| Package | Purpose |
|---------|---------|
| `ink` | React for terminals |
| `ink-gradient` | Colored gradient on name |
| `ink-text-input` | Email message input |
| `tsx` | Dev TypeScript runner |
| `esbuild` | Production bundle |
