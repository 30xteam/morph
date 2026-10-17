---
name: state-management
description: >
  Use when adding or reviewing global/shared client state — state read or
  written by more than one unrelated component. Trigger on tasks like "add
  a global store", "share this state across features", "this prop is being
  drilled through five components", or "which state library should I use".
  Library-agnostic — loads a `references/<library>.md` for the concrete
  library the project uses (Zustand, Jotai, Redux Toolkit). Do NOT trigger
  for state local to one component or its direct children — `useState`/
  `useReducer`/Context are plain React, see `react-patterns`. Do NOT
  trigger for server data — see `data-fetching`.
metadata:
  version: 1.0
  collection: noxen
---

# Noxen — State Management

Part of the **Noxen** skill set. This skill covers *global client state* —
state shared across unrelated parts of the tree — independent of which
library a project uses. Load the matching `references/*.md` for the
concrete library actually installed. For state local to one component,
plain React (`useState`/`useReducer`/Context) is enough — see
`react-patterns`, not this skill.

## First: Does This Need a Library At All?

A library is for state read/written by components that don't share a
common, reasonably-scoped parent. Before reaching for one, rule out:

- **Local state** — only one component (and maybe its children) needs it → `useState`.
- **Server state** — it came from an API → `data-fetching`, not a client store, ever.
- **A few components under one parent** — React Context, no library needed.

Reach for a global-state library only once state needs to be read/written
from genuinely unrelated branches of the tree, and prop-drilling or Context
has become the actual friction — not preemptively at project start.

## Load the Right Reference

| Concern | Reference |
|---|---|
| Project uses Zustand | `references/zustand.md` |
| Project uses Jotai | `references/jotai.md` |
| Project uses Redux Toolkit | `references/redux-toolkit.md` |
| Starting a new project, no library chosen yet | Read `## Choosing a Library` below |

## Choosing a Library (New Projects)

Default to **Zustand**: smallest bundle, simplest API (a store is just a
hook), and the pragmatic default for most React apps. Reach for **Jotai**
when the state model is naturally many small, independent, derived
atoms rather than a few larger stores — it's the better fit when
composability of derived values is central to the data model. Reach for
**Redux Toolkit** only when the team specifically needs its enforced
patterns, time-travel debugging, or the project already has a Redux store
— don't introduce Redux to a project that doesn't already need its
ceremony.

## Patterns That Hold Regardless of Library

**Server data never lives in a global client store.** A store that mirrors
`useQuery`'s cache creates two sources of truth — see `data-fetching` for
where fetched data belongs.

**Select the slice you need, not the whole store.** Subscribing to the
entire store re-renders on every unrelated change; select only the fields a
component actually reads.

**Actions live next to the state they mutate, not scattered in
components.** A component calls `store.addItem(item)`; it doesn't reach in
and mutate the store's internals directly.

## Hard Rules

- Global state libraries are for cross-tree state — local or few-component state stays in `useState`/Context.
- Server-fetched data never lives in a global client store — that's `data-fetching`'s job.
- Components select the specific slice of state they read, never subscribe to the whole store.
