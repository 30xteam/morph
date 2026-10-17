# Scenario 4 — Screaming architecture with merged `ui/` (no separate `design-system/`)

## Detection signals
- Top-level folders named after domains/features (`auth/`, `events/`...) — screaming
  architecture, same as scenario 3.
- But only ONE cross-cutting folder exists for components (`ui/` or `components/`), with no
  second sibling folder like `design-system/`.
- Inside that folder there may or may not be subfolders replicating the primitive/layout
  split (`ui/primitives/` + `ui/layout/`), or it may be entirely flat.

## Typical structure
```
src/
  <feature>/         auth/, events/, users/...
  ui/                EVERYTHING cross-cutting: buttons, header, modal, sidebar, icons, theme
    button/
    header/
    modal/
    icons/
```

## Where a new component goes
- **If `ui/` already has internal subfolders** (`primitives/` vs `layout/`, or similar) →
  respect that split the same way as scenario 3, just nested inside `ui/` instead of as
  sibling folders in `src/`.
- **If `ui/` is flat** (no internal split) → the component goes straight into `ui/<name>/`,
  without forcing a distinction the repo doesn't have. Don't invent `ui/primitives/` in a flat
  repo just because another project does it that way.
- Same as scenario 3: if the component is feature-specific, it doesn't go in `ui/` — it goes
  inside `<feature>/`.

## Notes / tradeoffs
- This scenario is usually the natural outcome of a small team that hasn't needed (yet) to
  split primitives from layout as separate folders. It's not "worse" than scenario 3, it's a
  valid choice when the volume of cross-cutting components is low.
- If the user explicitly asks "how would you do this if `design-system/` didn't exist"
  (as in this repo), this is exactly the answer: collapse into one folder, optionally with
  internal subfolders (`ui/primitives/`, `ui/layout/`) to preserve the distinction without
  needing two sibling folders in `src/`.
