# Scenario 5 — Feature-Sliced Design (FSD)

## Detection signals
- A named methodology with strict import rules (not generic "screaming" under another name —
  it's stricter).
- Canonical layer folders present together: `app/`, `processes/` (optional, deprecated in
  modern FSD), `pages/`, `widgets/`, `features/`, `entities/`, `shared/`.
- Strongest, most specific signal: `shared/ui/` — this is FSD's exact name for the design
  system equivalent.
- Inside each layer, "slices" by domain (`entities/user/`, `features/auth-by-email/`) and
  inside each slice, technical "segments" (`ui/`, `model/`, `api/`, `lib/`).

## Typical structure
```
src/
  app/          global init: providers, global styles, root router
  pages/        composes pages out of widgets/features/entities
  widgets/      large composite UI blocks (header, sidebar) — can use several entities
  features/     business actions with their own UI (LoginForm, AddToCartButton)
  entities/     business models with minimal UI (UserCard, ProductCard)
  shared/
    ui/         ← design system EQUIVALENT: primitives with no business knowledge
    lib/        generic utilities
    api/        base HTTP client
    config/
```

## Where a new component goes
- No business knowledge, reusable in any project (button, input, generic modal) →
  `shared/ui/`.
- Large composite block that assembles several entities but isn't a single business entity
  (header with a user menu, sidebar) → `widgets/`.
- Tied to a specific business entity but reusable across features (product card) →
  `entities/<entity>/ui/`.
- A business action with its own form/UI (login form, "add to cart" button) →
  `features/<feature>/ui/`.

## Notes / tradeoffs
- **FSD's strict import rule**: a layer can only import from layers *below* it in the
  hierarchy `app > pages > widgets > features > entities > shared`. `shared/ui` never imports
  from `entities` or `features` — if you see that, it's an architecture violation, flag it.
- Don't confuse this with scenario 3/4: although both have domain folders, FSD also requires
  the layer split (`ui/model/api/lib`) inside each slice, and has explicit import rules that
  generic "screaming" doesn't enforce.
- Check whether the repo uses FSD's official linter (`eslint-plugin-boundaries` or
  `@feature-sliced/eslint-config`) — if so, layer rules are enforced automatically and a
  misplaced component will fail lint, not just "should" be wrong.
