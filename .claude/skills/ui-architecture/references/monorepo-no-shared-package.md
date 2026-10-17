# Scenario 8 — Monorepo without a dedicated UI package (common anti-pattern)

## Detection signals
- Workspace config present (`pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `"workspaces"` in
  `package.json`), same as scenario 1.
- But **no** `packages/design-system`, `packages/ui`, etc. exists.
- Shared components live inside ONE app (`apps/web/src/components/`) and other apps in the
  same monorepo import them via deep relative paths or an alias pointing into that app
  (`import { Button } from '../../../web/src/components/Button'`), instead of a package.
- Sometimes components are literally duplicated with slight differences between `apps/web`
  and `apps/admin` because they were never centralized.

## Typical structure (the problem)
```
apps/
  web/
    src/components/Button.tsx     ← de facto "source of truth", but not a package
  admin/
    src/components/Button.tsx     ← slightly different copy, or fragile cross import
```

## Where a new component goes
- **If only needed in one app** → treat it as scenario 2/3/4 applied inside that specific app
  (`apps/web/src/ui/` or equivalent). Don't pre-optimize toward a package that doesn't exist.
- **If it's genuinely needed in 2+ apps right now** → this is the moment to propose creating
  `packages/ui/` (scenario 1) instead of continuing with cross imports or duplicating the
  component. Say this explicitly as a recommendation, don't do it without confirming — creating
  a new package means touching the workspace config, tsconfig paths, and each app's build.
- **Never** add a new cross-app import (`from '../../other-app/...'`) as a quick fix — it
  perpetuates the problem. If they already exist, flag them as tech debt when you touch them,
  don't replicate them.

## Notes / tradeoffs
- This scenario is almost always a transitional state, not a deliberate decision — it's worth
  asking the user if the plan is to extract a package soon, because it changes whether the new
  component should already be written with that extraction in mind (generic props, no imports
  from a specific app) even while it still lives inside a single app.
