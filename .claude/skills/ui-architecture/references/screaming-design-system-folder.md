# Scenario 3 — Screaming architecture with `design-system/` separate from `ui/`

## Detection signals
- Top-level folders under `src/` named after domains/features: `auth/`, `events/`, `users/`,
  etc. ("screaming architecture" — the structure screams the business, not the framework).
- TWO dedicated sibling folders exist for cross-cutting components, not one: e.g.
  `design-system/` and `ui/` (or `design-system/` and `layout/`).

## Typical structure
```
src/
  <feature>/           auth/, events/, users/... (or app/<feature>/ in Next.js App Router)
  design-system/       primitives with NO knowledge of business or app structure
    primitives/        button, avatar, input
    icons/
    theme/
  ui/                  compositions that know the app's STRUCTURE, not the domain
    header/
    sidebar/
    modal/
    shell-layout/
```

## Where a new component goes
Ask yourself: **does this component know anything about the app (routes, layout, other `ui/`
components), or could it be copied as-is into another project?**

- Knows nothing about the app, purely visual (button, icon, input field, avatar) →
  `design-system/primitives/` (or `icons/`, `forms/` depending on type).
- Knows the app's structure but not a specific feature (header, generic modal, sidebar,
  toolbar) → `ui/`.
- Specific to a feature (event card, login form) → **goes in neither** — it lives inside
  `<feature>/` (or `app/<feature>/_components/` in Next.js).

## Notes / tradeoffs
- Quick test: "could this component live in a design system published as an npm install to
  another project with no changes?" If yes → `design-system/`. If no, but it still doesn't
  depend on a business domain → `ui/`.
- It's common for a component to start in `ui/` because nobody stopped to check if it had
  business knowledge, and over time it picks up a prop or import from a specific feature. If
  you see that while touching a `ui/` component, flag it — it's a layer leak.
