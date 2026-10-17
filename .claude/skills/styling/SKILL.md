---
name: styling
description: >
  Use when styling a component, choosing a styling approach for a project,
  or deciding how conditional/dynamic classes should be composed. Trigger
  on tasks like "style this component", "add a variant prop", "which
  styling approach should this project use", or "this className string is
  getting unreadable". Library-agnostic — loads a `references/<library>.md`
  for the concrete approach the project uses (Tailwind, CSS Modules,
  vanilla-extract, styled-components). Do NOT trigger for layout
  composition/structure decisions — see `ui-architecture`. Do NOT trigger
  for component logic or state — see `react-patterns`.
metadata:
  version: 1.0
  collection: noxen
---

# Noxen — Styling

Part of the **Noxen** skill set. This skill covers CSS/styling approaches
independent of which one a project uses — load the matching
`references/*.md` for the concrete approach actually installed.

## Load the Right Reference

| Concern | Reference |
|---|---|
| Project uses Tailwind | `references/tailwind.md` |
| Project uses CSS Modules | `references/css-modules.md` |
| Project uses vanilla-extract | `references/vanilla-extract.md` |
| Project uses styled-components | `references/styled-components.md` |
| Starting a new project, no approach chosen yet | Read `## Choosing an Approach` below |

## Choosing an Approach (New Projects)

Default to **Tailwind**: zero runtime cost, the largest ecosystem, and the
widest hiring/familiarity pool — the safe default for most teams. Reach
for **CSS Modules** for the subset of styles that need real dynamic
selectors or complex nesting Tailwind's utility model fights — standard
CSS, scoped, zero runtime, pairs fine alongside Tailwind for the ~10% of
cases that need it. Reach for **vanilla-extract** over Tailwind when the
project wants type-checked, colocated style *objects* with zero runtime
cost — most relevant for a design-system package meant to be consumed
outside a Tailwind-configured app. Avoid introducing **styled-components**
in a new project: its runtime overhead (styles generated during render) is
a real cost with React Server Components and streaming SSR, and most new
projects choose one of the zero-runtime options above instead. It remains
reference-only, for working inside an existing styled-components codebase.

## Patterns That Hold Regardless of Approach

**Conditional classes are composed, never string-concatenated.** A
template literal building up a class list from booleans is illegible and
error-prone past two conditions — every approach in this skill has a
dedicated composition tool (see each reference); use it even for a single
conditional class.

**Variants are a closed, typed set.** A `variant: 'primary' | 'secondary'`
prop maps to styles through an explicit lookup, not an `if`/`else if`
chain re-derived at every call site.

**Dynamic, per-instance values (a user's theme color, a computed width) are
the one case an inline `style` prop is correct** — don't force a runtime
value through a styling system built around static class generation.

## Hard Rules

- Never build a conditional class list with template-literal string concatenation — use the approach's composition tool.
- A variant prop's possible values map through one lookup/switch, not scattered conditionals.
- Reserve the inline `style` prop for genuinely dynamic, per-instance values — not as a shortcut around the project's styling approach.
