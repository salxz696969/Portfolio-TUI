# AGENTS.md

TUI portfolio built with **Ink** (React for terminals) and **TypeScript**.

## Commands

```sh
pnpm start          # run the app (uses tsx, no build step)
npx tsc --noEmit    # typecheck
```

## Environment

- **Requires a real TTY** — uses alternate screen buffer (`\x1b[?1049h`) and raw mode. Won't work in CI or non-interactive shells.
- Package manager is **pnpm**.

## Architecture

```
src/
  main.tsx        # entrypoint: alt-screen + cursor control, renders <App>
  App.tsx         # screen router + keyboard dispatch
  components/     # reusable UI: Header, Menu, PixelSpinner, StreamingText,
                  #   AsciiLogo, EmailForm, ScrollView
  screens/        # page components: About, Skills, Experience, Contact
  data/           # content & skill definitions
    skills.ts     # Skill[] array with ASCII logos (7-line box art) + brand colors
    content.ts    # about text, experience entries, contact info
```

## Key patterns

- **No build step** — `pnpm start` runs `tsx src/main.tsx` directly.
- **Home screen layout**: menu is always visible on the left, content panel on the right. ↑↓ navigates menu and instantly shows the corresponding screen content — no Enter needed. Two-phase `ctrl+c` exit (first press shows prompt, second exits) — `exitOnCtrlC` is `false` so the email form can accept any character. Mouse tracking is disabled on launch.
- **Single-page** — the app fits within the terminal height. `App.tsx` calculates `contentHeight` from `useStdout().rows`. The Skills screen uses `ScrollView` (j/k to scroll) when content overflows. Other screens are compact enough to fit.
- **Screen transitions** follow a 2-phase animation: `PixelSpinner` (cycling ▖▘▝▗ block chars) for ~200ms, then `StreamingText` reveals content char-by-char.
- **Animation speed** is controlled by `SPEED` constants in `StreamingText.tsx` (ms per char, default 4) and `PixelSpinner.tsx` (ms per frame, default 40). Lower = faster.
- **Skill logos** are chafa-generated 2-char Unicode blocks (`--size=2x2`) from downloaded skill icons. Stored in `data/skills.ts` along with brand colors. Grouped by `category`.
- **Contact email form** uses `ink-text-input` and opens Gmail compose in the visitor's browser via the `open` package (pre-filled with their message).

## Dependencies

| Package | Purpose |
|---------|---------|
| `ink` | React for terminals |
| `ink-big-text` | (optional) blocky ASCII name header (not currently used) |
| `ink-gradient` | Colored gradient on name |
| `ink-text-input` | Email message input |
| `open` | Opens mail client on form submit |
| `tsx` | TypeScript runner (no build needed) |
