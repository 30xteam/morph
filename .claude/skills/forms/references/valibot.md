# Valibot

Functional, tree-shakeable schema validation — each validator is a
standalone function you compose, instead of chaining methods on a schema
object. Reach for it over Zod when bundle size in a browser or edge bundle
is a hard constraint (see `forms/SKILL.md` — Choosing a Library); it ships
under 1KB for simple schemas because unused validators are never bundled.
Implements Standard Schema, so it's swappable with Zod/ArkType in any
Standard-Schema-aware form resolver.

## Schema and Inferred Type

```ts
import * as v from 'valibot';

const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email')),
  password: v.pipe(v.string(), v.minLength(8, 'At least 8 characters')),
});

type LoginValues = v.InferOutput<typeof LoginSchema>;
```

Validators compose left-to-right through `v.pipe`, not through method
chaining — import only the validators a given schema actually uses, that's
what makes the bundle-size advantage real in practice.

## Parsing

```ts
const result = v.safeParse(LoginSchema, raw);
if (!result.success) {
  // result.issues — structured, same shape philosophy as Zod's
} else {
  result.output; // typed as LoginValues
}
```

## With a Form Library

```ts
import { valibotResolver } from '@hookform/resolvers/valibot';
useForm({ resolver: valibotResolver(LoginSchema) });
```

## Hard Rules

- Import only the specific validators a schema needs (`v.string`, `v.email`, …) — don't import a namespace-wide bundle that defeats tree-shaking.
- Use `v.safeParse`, not `v.parse`, at any boundary where invalid input is expected.
- Compose validators through `v.pipe`, not by looking for chainable methods — Valibot's API shape is intentionally different from Zod's.
