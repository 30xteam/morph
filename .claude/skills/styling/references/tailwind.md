# Tailwind

Utility classes, zero runtime cost, generated only for the classes actually
used. Default choice for new projects (see `styling/SKILL.md` — Choosing an
Approach).

## Compose Conditional Classes with `cx()`

Wrap `clsx` + `tailwind-merge` in a small helper — `clsx` composes
conditional classes, `tailwind-merge` resolves conflicts when two
conditional branches set the same utility (e.g. two different `bg-*`):

```ts
// core/cx/index.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```tsx
// ✅
const cls = cx('px-4 py-2 rounded-lg', variant === 'primary' && 'bg-blue-600', disabled && 'opacity-50');

// ❌ — unreadable past two conditions, and no conflict resolution
<button className={`px-4 py-2 ${variant === 'primary' ? 'bg-blue-600' : 'bg-gray-200'}`}>
```

Without `twMerge`, passing both a default class and an override
(`cx('bg-gray-200', isActive && 'bg-blue-600')`) produces two conflicting
`bg-*` classes in the DOM with the winner decided by source order in the
stylesheet, not by which one appears last in the string — `twMerge` picks
the correct winner deterministically.

## Variant Lookup Instead of Inline Conditionals

```ts
const variantClasses: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white',
  secondary: 'bg-gray-200 text-gray-900',
  ghost: 'bg-transparent text-blue-600',
};

const cls = cx('px-4 py-2 rounded-lg', variantClasses[variant]);
```

## Hard Rules

- Always compose conditional classes through `cx()` — never template-string conditionals.
- A variant prop resolves through a `Record<Variant, string>` lookup, not an `if`/`else if` chain.
- Reserve the inline `style` prop for values that are genuinely dynamic per instance (a fetched theme color, a computed width) — not as a shortcut around Tailwind classes.
