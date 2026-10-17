# vanilla-extract

Type-checked CSS-in-TypeScript, compiled away entirely at build time — zero
runtime, styles are plain static CSS by the time the app ships. Reach for
it over Tailwind when the project wants colocated, type-safe style objects
rather than utility classes — most relevant for a design-system package
meant to be consumed outside a Tailwind-configured app (see
`styling/SKILL.md` — Choosing an Approach).

## Style Definitions

```ts
// header.css.ts
import { style, styleVariants } from '@vanilla-extract/css';

export const header = style({
  display: 'flex',
  alignItems: 'center',
  padding: '0.5rem 1rem',
});

export const variant = styleVariants({
  primary: { background: 'var(--color-primary)', color: 'white' },
  secondary: { background: 'var(--color-gray-200)' },
});
```

```tsx
import * as styles from './header.css';

<header className={styles.header}>...</header>
<button className={styles.variant[variant]}>...</button>
```

`styleVariants` is the direct replacement for a Tailwind variant lookup —
one object, keyed by variant name, resolved by index rather than a
conditional chain.

## Composing Classes

```ts
import { style } from '@vanilla-extract/css';

const base = style({ padding: '0.5rem 1rem', borderRadius: '0.5rem' });
export const primary = style([base, { background: 'var(--color-primary)' }]);
```

Passing an array to `style([...])` composes prior style definitions rather
than duplicating their declarations — same principle as CSS Modules'
`composes`.

## Design Tokens via `createTheme`

```ts
export const [themeClass, vars] = createTheme({
  color: { primary: '#2563eb', text: '#111827' },
  space: { sm: '0.5rem', md: '1rem' },
});
// usage: style({ padding: vars.space.md, color: vars.color.text })
```

Reference tokens through `vars`, not hardcoded values repeated per file —
this is what keeps the whole design system's values in one typed, greppable
place.

## Hard Rules

- Variant styles are declared with `styleVariants` and resolved by key — never an inline conditional building the class per render.
- Compose shared declarations with `style([...])`, not copy-pasted property objects.
- Reference design tokens through the theme's `vars`, never hardcoded color/spacing values in a component-level style definition.
