---
name: typescript
description: >
  Use when writing or reviewing TypeScript types, interfaces, generics, or
  validation schemas — strict typing conventions, `interface` vs `type`,
  discriminated unions, Zod schemas, or avoiding `any`. Trigger on tasks like
  "type this function", "add a Zod schema", "fix this type error", or "review
  this interface". Do NOT trigger for component structure or folder layout —
  see the sibling react-patterns and architecture skills.
metadata:
  version: 1.0
  collection: noxen
---

# Noxen — TypeScript

Part of the **Noxen** skill set (a personal engineering standard for React +
TypeScript + Tailwind). This skill covers typing conventions only — for
component patterns see `react-patterns`.

## Compiler Config

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## Never `any`

```ts
// ❌
function process(data: any) { return data.name; }

// ✅ unknown + narrowing
function process(data: unknown): string {
  if (typeof data === 'object' && data !== null && 'name' in data) {
    return String((data as { name: unknown }).name);
  }
  throw new Error('Invalid data shape');
}

// ✅ Type guard
function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 'id' in data;
}
```

## `interface` vs `type`

```ts
// interface — extendable object shapes
interface ButtonProps { label: string; onPress: () => void; }
interface IconButtonProps extends ButtonProps { icon: React.ReactNode; }

// type — unions, intersections, utilities
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type LoadingState<T> = { isLoading: true } | { isLoading: false; data: T };
```

## Discriminated Unions for State

```ts
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };
```

## Zod for External Data

```ts
const CallSchema = z.object({
  correlation_id: z.string(),
  patient_name: z.string(),
  turn_count: z.number(),
});
type ApiCallListItem = z.infer<typeof CallSchema>;
const result = CallSchema.safeParse(raw);
```

Use Zod for: API responses, env vars, and any other external data. For a
form's validation schema specifically, see the `forms` skill — it's
library-agnostic (Zod is one of several valid choices there, not the only
one this collection endorses for forms).

A static interface describing a runtime payload (e.g. a discriminated union
keyed by a backend-controlled `type` field, as in the `sdui` skill) is an
*assumption*, not a guarantee — TypeScript never checks it against what
actually arrived. If code downstream trusts that shape for something that
matters (permissions, totals, routing), validate it with Zod at the
boundary instead of trusting the interface alone.

## Function Typing

```ts
// Explicit return types on exports
export function formatDate(date: Date): string { ... }
export async function fetchUser(id: string): Promise<User> { ... }
```

## Useful Utility Types

```ts
Partial<T>       // All optional
Required<T>      // All required
Pick<T, K>       // Select keys
Omit<T, K>       // Exclude keys
Record<K, V>     // Dictionary
ReturnType<F>    // Function return type
NonNullable<T>   // Remove null/undefined
```

## Naming

| Type | Convention |
|------|-----------|
| Types / Interfaces | PascalCase — `UserProfile` |
| Enums | PascalCase members — `AuthStatus.SignedIn` |
| Functions / variables | camelCase |
| Module-level constants | SCREAMING_SNAKE |
| Unused params | prefix `_` — `_event` |
| Boolean variables | camelCase with a required prefix — `is`, `has`, `can`, `should`, `will`, `must`, `needs`, `disabled`, `enabled`, `show`, `hide`, `toggle` |

```ts
// ✅
const isLoading = true;
const hasToken = Boolean(token);

// ❌ — no prefix, ambiguous at the call site
const loading = true;
const visible = true;
```

## Type-Only Imports

```ts
// ✅
import type { User } from './types';
import { fetchUser } from './services';

// ❌ — mixes a value import with a type-only one
import { User, fetchUser } from './types-and-services';
```

Keeping type imports explicit means they can be safely elided at build
time and it's obvious at a glance which imports have runtime cost.

## No Type Assertions Without Reason

```ts
// ❌
const name = (data as any).name;

// ✅ with comment explaining why it's safe
const config = rawConfig as Config; // validated by Zod above
```

## Hard Rules

- Never use `any` — use `unknown` + narrowing or a type guard.
- `interface` for extendable object shapes, `type` for unions/utilities.
- All external data (API responses, form inputs, env vars) validated with Zod.
- Explicit return types on every exported function.
- Boolean variables always carry a prefix (`is`/`has`/`can`/`should`/…) — never a bare adjective.
- Import types with `import type`, never mixed into a value import.
