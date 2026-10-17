# CSS Modules

Standard CSS, scoped to the component by the build tool (class names get a
unique hash suffix), zero runtime cost. Best used for the subset of styles
that need real dynamic selectors or complex nesting a utility-class
approach fights — can coexist with Tailwind in the same project for that
~10% (see `styling/SKILL.md` — Choosing an Approach).

## File and Import

```css
/* header.module.css */
.header { display: flex; align-items: center; }
.header--active { background: var(--color-primary); }
```

```tsx
import styles from './header.module.css';

<header className={styles.header}>...</header>
```

Each imported class name is scoped automatically — `.header` in this file
never collides with a `.header` class defined elsewhere in the project.

## Compose Conditional Classes with `clsx`

CSS Modules has no built-in class-composition tool of its own — pair it
with `clsx` (skip `tailwind-merge`, there's no Tailwind conflict to
resolve here):

```tsx
import clsx from 'clsx';
import styles from './header.module.css';

// ✅
<header className={clsx(styles.header, isActive && styles['header--active'])}>

// ❌ — unreadable, and loses the module's scoping guarantee if hand-typed wrong
<header className={`${styles.header} ${isActive ? styles['header--active'] : ''}`}>
```

## Composing Module Classes with `composes`

```css
.baseButton { padding: 0.5rem 1rem; border-radius: 0.5rem; }
.primaryButton { composes: baseButton; background: var(--color-primary); }
```

`composes` is CSS Modules' own mechanism for sharing declarations across
classes — prefer it over duplicating the same property list in every
variant class.

## Hard Rules

- Import every class through the generated `styles` object — never reference a module class by a hand-typed string.
- Compose conditional classes through `clsx`, never template-string interpolation.
- Share base declarations across variant classes with `composes`, not copy-pasted property lists.
