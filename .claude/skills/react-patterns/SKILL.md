---
name: react-patterns
description: >
  Use when creating, modifying, or reviewing a React component or hook using
  only React itself — composition, local state, effects, and memoization.
  Trigger on tasks like "refactor this component", "add a custom hook",
  "this component re-renders too much", or "split this into smaller
  components". This skill is intentionally React-only — for anything that
  needs a third-party library, see the sibling skill that owns it: forms
  (`forms`), server data fetching (`data-fetching`), tables/grids
  (`data-table`), global/shared client state (`state-management`), modals
  reachable from more than one place (`modals`), or CSS/styling
  (`styling`). Do NOT trigger for folder/project structure or TypeScript
  typing questions — see `architecture` and `typescript`.
metadata:
  version: 1.0
  collection: noxen
---

# Noxen — React Patterns

Part of the **Noxen** skill set (a personal engineering standard for React +
TypeScript). This skill covers component and hook patterns using plain
React only — no third-party library. The moment a task needs one, it
belongs to a sibling skill; see the `description` above for which one.

## Component Structure

```tsx
// imports → local types → component (hooks → derived state → handlers → render)
import { useState } from 'react';

interface MyComponentProps { title: string; onAction: () => void; }

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [isOpen, setIsOpen] = useState(false);           // hooks
  const displayTitle = title.toUpperCase();               // derived state
  const handleClick = () => { setIsOpen(true); onAction(); }; // handlers
  return <div onClick={handleClick}>{displayTitle}</div>; // render
}
```

## Atomic Design Hierarchy

1. **Atoms** — Button, Input, Badge → `ui/`
2. **Molecules** — SearchBar, FormField → `ui/` or feature `components/`
3. **Organisms** — Header, DataTable → `ui/` or feature `components/`
4. **Templates** — MainLayout, AuthLayout → `ui/layouts/`
5. **Pages** — Route targets → `features/<feature>/pages/`

## Composition over Configuration

Multi-slot components take their slots as `children` via compound
sub-components, not as element-valued props — it composes naturally and
reads like markup:

```tsx
// ✅ compound components — slots as children
<Header>
  <Header.Logo><AppLogo /></Header.Logo>
  <Header.Middle><SearchBar /></Header.Middle>
  <Header.Actions><UserMenu /></Header.Actions>
</Header>

// ❌ components passed as props — one slot, one prop, no composition
<Header logo={<AppLogo />} middle={<SearchBar />} actions={<UserMenu />} />

// ❌ monolithic — no composition at all
<Header logoText="TrueYou" showSearch={true} showUserMenu={true} />
```

```tsx
// ui/header/header.tsx — attach slots as static properties
function Header({ children }: { children: React.ReactNode }) { return <header>{children}</header>; }
Header.Logo = ({ children }: { children: React.ReactNode }) => <div className="flex-none">{children}</div>;
Header.Middle = ({ children }: { children: React.ReactNode }) => <div className="flex-1 mx-4">{children}</div>;
Header.Actions = ({ children }: { children: React.ReactNode }) => <div className="flex gap-2">{children}</div>;
```

Reach for an element-valued prop only for a single, optional slot (e.g. a
lone `icon` prop) where a whole compound API would be overkill.

## Custom Hooks

Extract logic > 20 lines to a hook. Name: `use<FeatureName>`.

```ts
// features/theme/hooks/use-theme.ts
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  return { theme, toggle };
}
```

Hooks return typed objects, not arrays (unless tuple semantics needed). A
hook wrapping *server* data or a *global* store belongs to `data-fetching`
or `state-management` instead — this pattern is for hooks whose entire
state lives in the component tree that owns them.

## State Management — What Stays in Plain React

| Scenario | Solution |
|----------|----------|
| Local to one component | `useState` / `useReducer` |
| Shared by a few components under one parent | React Context |
| Server data | → `data-fetching` skill |
| Global/cross-tree client state | → `state-management` skill |
| Form state | → `forms` skill |

Context is the ceiling of what this skill covers for shared state — once
state needs to be read/written from genuinely unrelated branches of the
tree, that's `state-management`'s territory, not a bigger Context object.

## Memoization — Only When Needed

React Compiler handles most cases automatically. `React.memo` only once
confirmed by profiling; `useCallback` for a handler passed to a memoized
child; `useMemo` for expensive computation on large arrays. Never add
speculatively.

## useEffect Rules

- One concern per `useEffect`
- Always declare all dependencies
- Return cleanup for subscriptions/timers
- Never use for derived state — compute inline

## Hard Rules

- One exported component per file. No exceptions.
- Named exports for components; default exports only for pages.
- A hook whose state is server data or global/cross-tree state belongs to `data-fetching`/`state-management`, not this skill — don't hand-roll what those skills already solve.
- Never introduce a third-party import into a pattern covered here — if the task needs one, it belongs to the sibling skill that owns it.
