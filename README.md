# Webapp

Next.js 16 (App Router, Cache Components) + React 19 + TypeScript 7 + Tailwind CSS 4.
The visual design is driven entirely by [`DESIGN.md`](./DESIGN.md).

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev            # http://localhost:3000
```

## Scripts

| Script                         | What it does                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| `pnpm dev` / `build` / `start` | Next.js                                                                             |
| `pnpm lint` / `lint:fix`       | oxlint                                                                              |
| `pnpm format` / `format:check` | oxfmt (Prettier-compatible, sorts imports + Tailwind classes)                       |
| `pnpm typecheck`               | `tsc --noEmit` (TypeScript 7)                                                       |
| `pnpm check`                   | lint + format check + typecheck (runs on pre-commit)                                |
| `pnpm design:sync`             | Compiles `DESIGN.md` → `src/design/tokens.generated.css` and validates the contract |
| `pnpm design:lint`             | Lints `DESIGN.md` against the spec (structure, WCAG contrast)                       |

Commits follow [Conventional Commits](https://www.conventionalcommits.org) (enforced by commitlint).

## Changing the design

The design system has three layers, so components never change when the design does:

```
DESIGN.md (front matter tokens)
   │  pnpm design:sync
   ▼
src/design/tokens.generated.css   --ds-* raw values (generated, never edit)
   │
   ▼
src/design/theme.css              semantic roles → Tailwind utilities (bg-primary, text-fg-muted, …)
   │
   ▼
components                        only use semantic utilities
```

- **Tweak a color / size / radius / shadow:** edit the value in `DESIGN.md`, run `pnpm design:sync`.
- **Change the font:** set `fontFamily` in `DESIGN.md`, load it in `src/design/fonts.ts` with
  `variable: '--font-<slug>'` (e.g. `Space Grotesk` → `--font-space-grotesk`), run `pnpm design:sync`.
- **Swap in a whole new DESIGN.md:** replace the file, run `pnpm design:sync`. If the new file uses
  different token names, the command lists every role it can't resolve. Remap those lines in
  `src/design/theme.css` and you're done.

`DESIGN.md` follows the [DESIGN.md spec](https://github.com/google-labs-code/design.md). Token groups the
spec can't hold (`shadows`, `motion`, `zIndex`, `breakpoints`) live in the Impeccable sidecar
`.impeccable/design.json` under `extensions`. A group defined directly in `DESIGN.md` takes precedence.

## Project structure

```
src/
├── app/                 # Routes only (thin pages, layouts)
├── core/                # App-level infra: config, cx, http (+ server/), query, providers
├── design/              # Tokens, theme contract, fonts, motion
└── features/<feature>/  # Self-contained modules exposed through index.ts
```

## Agent skills

Project skills live in `.claude/skills/` (Noxen, Emil Kowalski, Impeccable). See `CLAUDE.md`.
After cloning, run `/impeccable init` once in Claude Code to set up Impeccable's design context.
