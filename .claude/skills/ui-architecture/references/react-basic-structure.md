# Scenario 2 — Basic/flat React (by technical layer)

## Detection signals
- Top-level folders under `src/` (or root in CRA/Vite) are generic technical layers, not
  business domains: `components/`, `hooks/`, `services/`, `pages/` (or `views/`), `utils/`,
  `context/`.
- No feature-named folders at the root level (`auth/`, `events/`) — if there are, it's
  actually screaming architecture (see scenarios 3/4), not this case.
- Usually plain CRA, basic Vite, or a Next.js project that hasn't adopted its own convention yet.

## Typical structure
```
src/
  components/     ALL React components, shared or not
  hooks/
  services/       API calls
  pages/          or views/ — routes
  utils/
  context/
```

## Where a new component goes
This scenario typically does **not** distinguish "shared" from "page-specific" — everything
lives in `components/`. Two sub-variants depending on how disciplined the repo is:

- **If `components/` is flat** (no subfolders): the new component goes straight there. If the
  repo doesn't distinguish shared vs. specific, don't impose a distinction that isn't there;
  follow the existing convention as-is.
- **If `components/` already has subfolders like `common/`, `shared/` vs. the rest**: put
  cross-cutting ones there (`components/common/Button.tsx`) and feature-specific ones inside
  `components/<Feature>/` or next to the page in `pages/<Route>/`.

## Notes / tradeoffs
- This is the scenario most prone to `components/` turning into a junk drawer as the repo
  grows. If the user asks "how would you organize this better", the natural answer is
  migrating toward scenario 3/4 (screaming) or 5 (FSD) — but don't suggest it unprompted if
  they only asked where to put one component; follow the existing convention first.
- Check whether tests/stories are colocated with the component (`Button.tsx`,
  `Button.test.tsx`, `Button.stories.tsx` in the same folder) — that's orthogonal to this
  scenario and should be respected the same way for the new component.
