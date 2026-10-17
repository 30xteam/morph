@AGENTS.md

# Project guide

Next.js 16 App Router (Cache Components on) · React 19 · TypeScript 7 · Tailwind 4 · pnpm.
Read the relevant guide in `node_modules/next/dist/docs/` before using a Next API (see AGENTS.md).

## Commands

- `pnpm check`: lint (oxlint) + format check (oxfmt) + typecheck. Must pass before finishing a task.
- `pnpm design:sync`: run after any change to `DESIGN.md`, `src/design/theme.css` or `src/design/fonts.ts`.
- `pnpm build`: required for changes touching routing, caching or layouts.

## Design rules (DESIGN.md is the source of truth)

- Never hardcode colors, font sizes, radii, shadows or z-index in components. Use the semantic
  utilities from `src/design/theme.css`: `bg-primary`, `text-fg`, `text-fg-muted`, `bg-surface-accent`,
  `border-border`, `text-display-xl`…`text-caption`, `rounded-md`, `shadow-dropdown`, `z-modal`,
  breakpoints `tablet:` / `desktop:` / `wide:`.
- Need a new value? Add it to `DESIGN.md` front matter → `pnpm design:sync` → map a role in `theme.css`
  (and register custom text/radius/shadow names in `src/core/cx/index.ts`).
- Never edit `src/design/tokens.generated.css`.
- Compose classes with `cx()` from `@/core/cx`, with variants as `Record<Variant, string>` lookups.
- Text contrast must pass WCAG AA: `text-fg-subtle` is for placeholders/hints only, not readable copy.

## Architecture (Noxen skills)

- Pages in `src/app/**/page.tsx` stay thin; feature code lives in `src/features/<feature>/`
  (`components/ hooks/ services/ types/ context/`), exported only through `index.ts`.
  Server-only exports go through `server.ts`.
- No cross-feature imports. App-wide infra lives in `src/core/`.
- Files are kebab-case (lint-enforced), one component per file, max ~200 lines.
- Server Components by default; push `'use client'` as far down as possible.

## Stack decisions (load the matching `references/<library>.md` in each skill)

| Concern      | Choice                                                                     | Where                                 |
| ------------ | -------------------------------------------------------------------------- | ------------------------------------- |
| Styling      | Tailwind 4 + CSS variables                                                 | `styling` → `tailwind.md`             |
| Forms        | react-hook-form + zod (`@hookform/resolvers`)                              | `forms`                               |
| Server state | TanStack Query (`getQueryClient`, `AppProviders`)                          | `data-fetching` → `tanstack-query.md` |
| Client state | Zustand, per-feature stores, only when Context isn't enough                | `state-management` → `zustand.md`     |
| Modals       | Radix Dialog wrapped by nice-modal-react (`NiceModal.Provider` is mounted) | `modals`                              |
| Tables       | TanStack Table (headless)                                                  | `data-table`                          |
| HTTP         | Own `fetch` client: `http` (client) / `httpServer` (`@/core/http/server`)  | `http-layer`                          |
| Auth         | Cookie `SESSION_TOKEN_KEY` is the truth; `AuthProvider` + `getSessionUser` | `auth-flow`                           |

The HTTP clients convert snake_case ⇄ camelCase in interceptors, so services never convert.
`httpServer` reads cookies: under Cache Components its callers must render inside `<Suspense>`
(or use `'use cache: private'`). Auth isn't wired into the layout yet. Do that inside a Suspense
boundary when the first protected route exists.

## Skills in `.claude/skills/`

- **Noxen:** `noxen` (repo overview), `app-router` (load first), `architecture`, `ui-architecture`,
  `react-patterns`, `typescript`, `styling`, `code-constraints`, `forms`, `data-fetching`,
  `data-table`, `state-management`, `modals`, `http-layer`, `auth-flow`.
- **Emil Kowalski (UI/motion):** `emil-design-eng`, `animate`, `animation-performance`,
  `animation-vocabulary`, `improve-animations`, `review-animations`, `find-animation-opportunities`,
  `apple-design`, `break-ui`, `pick-ui-library`, `prototype`.
- **Impeccable:** `impeccable` (design quality + detector hook). Check pages with
  `.claude/skills/impeccable/scripts/impeccable detect http://localhost:3000`.
