# Scenario 6 — Atomic Design

## Detection signals
- Literal `atoms/`, `molecules/`, `organisms/` folders, and optionally `templates/`
  (`pages/` as a fifth level is almost never used as a folder, since in React/Next.js pages
  usually live in the router).
- **This is a naming/level variant, not a root location on its own** — it can appear nested
  inside `design-system/`, `ui/`, `components/`, or even inside `shared/ui/` in FSD. Combine
  it with whichever root scenario applies (3, 4, 5, etc.).

## Typical structure
```
components/            (or design-system/, or shared/ui/ depending on the root scenario)
  atoms/                button, input, icon, label — not made of smaller system parts
  molecules/            small group of atoms with one function (search bar = input + button)
  organisms/            complete, complex section (header, full form, large card)
  templates/            page layout with no real data (composition skeleton)
```

## Where a new component goes
Classify by composition, not by whether it's "shared":
- Not composed of other components in the system, the lowest level → `atoms/`.
- Combines 2-3 atoms for one specific function, without being a full section → `molecules/`.
- Complex, self-contained section, may include molecules and atoms, sometimes with its own
  logic (header, sidebar, full form) → `organisms/`.
- Page layout with no real data, structure only → `templates/`.

## Notes / tradeoffs
- The atom/molecule/organism boundary is subjective and the most-cited criteria (Brad Frost)
  is intentionally fuzzy — don't obsess over classifying "perfectly"; follow what the repo has
  already decided for similar existing components (check 2-3 examples before deciding).
- This scheme doesn't distinguish "app-wide shared" vs. "feature-specific" — Atomic Design is
  purely about visual composition level. If the repo also needs that distinction, it's usually
  resolved by the containing folder (atoms/molecules/organisms INSIDE `design-system/` =
  shared; feature-specific components stay outside, in the feature's folder, unclassified).
- It's common for `organisms/` to end up with components that actually know business data
  (e.g. `ProductCard` with pricing logic) — if that happens, those organisms should live
  outside the design system, in the relevant feature, even though "by size" they look like an
  organism.
