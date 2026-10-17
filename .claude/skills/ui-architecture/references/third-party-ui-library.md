# Scenario 9 — Third-party UI library with no own layer

## Detection signals
- `package.json` includes `@mui/material`, `@chakra-ui/react`, `@mantine/core`, `antd`, or
  similar, and those imports appear **directly** in feature/page components
  (`import { Button } from '@mui/material'`), not wrapped in an own wrapper.
- No `components/ui/`, `design-system/`, or any layer that re-exports/wraps the library —
  just a theme config file (`theme.ts`, a `ThemeProvider` with overrides) customizing colors/
  typography globally.
- Unlike shadcn (scenario 7), here the library IS a real npm dependency, not copied code — it
  updates via `npm update`, not by editing it directly.

## Typical structure
```
src/
  theme/
    theme.ts        MUI/Chakra/Mantine createTheme() with brand overrides
  <feature>/
    LoginForm.tsx    imports Button, TextField directly from the library
```

## Where "a new shared component" goes
Here the question changes nature: a new primitive is almost never needed, since the library
already provides it. Before writing one:

- **Does it already exist in the library with props/variants that cover the case?** → use it
  directly, don't create a wrapper. Customize via the library's theme/variant system
  (`theme.components.MuiButton.variants` in MUI, `theme.components.Button` in Chakra, etc.),
  not with a new wrapper component.
- **Is it a composition of 2+ library components that repeats across several places** (e.g. a
  "FormField" combining that library's Label + Input + error message)? → this DOES warrant an
  own component. It goes in a new cross-cutting folder (`components/` or `ui/` at the `src/`
  level, even if it doesn't exist yet — create it) to avoid duplicating the composition per
  feature.
- **Is it visually unique with nothing similar in the library?** → same as above, own
  component in `components/`/`ui/`, built on top of the library's primitives.

## Notes / tradeoffs
- Resist the urge to preemptively "wrap everything" from the library in own wrappers
  (`MyButton` that just does `<Button {...props} />`) — that adds indirection with no real
  benefit until there's actual own logic or styling to add.
- If the user starts accumulating several of these composition components, that's the signal
  the repo is migrating toward scenario 3/4 (starting to form its own `ui/`) — mention it once
  it becomes a pattern, not before.
