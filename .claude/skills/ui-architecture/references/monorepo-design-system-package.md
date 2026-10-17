# Scenario 1 — Monorepo with a dedicated design system package

## Detection signals
- Workspace config at the root: `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `lerna.json`,
  or `"workspaces"` in `package.json`.
- `packages/design-system/`, `packages/ui/`, or `packages/ui-kit/` with its own
  `package.json` (name like `@scope/design-system`).
- Apps (`apps/web`, `apps/mobile`, etc.) import that package by its package name, not by
  relative path: `import { Button } from '@scope/design-system'`.
- Usually has its own build/bundler, sometimes its own Storybook, and an internal semver.

## Typical structure
```
packages/
  design-system/
    src/
      primitives/   button, input, avatar...
      tokens/       colors, spacing, typography (sometimes split into packages/tokens)
      index.ts      public barrel export of the package
    package.json
apps/
  web/
    src/...          consumes '@scope/design-system'
  mobile/
```

## Where a new component goes
- **Shared between 2+ apps in the monorepo** (visual, no business knowledge) →
  `packages/design-system/src/`, exported from the package's `index.ts` barrel.
- **Shared but aware of the structure of ONE app** (that app's header, that app's sidebar) →
  does NOT go in the package; it lives inside that app, in its equivalent of `ui/`
  (see scenario 3/4 applied inside `apps/web/src/`).
- **Used in a single app, no plan to reuse** → don't push it into the package "just in case".
  Build it local to that app until a real second consumer needs it.

## Notes / tradeoffs
- Moving something into the package means: updating its build, sometimes a version bump, and
  other apps needing to reinstall/update the workspace — more friction than a local `git mv`.
  Before proposing a move there, confirm there's a real second consumer, not a hypothetical one.
- Check whether the package is published to an external registry or is monorepo-internal only
  (`"private": true`) — it changes how careful to be about breaking changes.
- If there's a separate `packages/tokens` from `packages/design-system`, tokens (colors,
  spacing) go there, not hardcoded inside components — don't duplicate values.
