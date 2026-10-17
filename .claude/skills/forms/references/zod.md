# Zod

Class-hierarchy, chainable-method schema validation. Default choice for new
projects (see `forms/SKILL.md` — Choosing a Library): largest ecosystem,
broadest resolver/adapter coverage across form libraries, least integration
risk. Implements Standard Schema, so it's swappable with Valibot/ArkType in
any Standard-Schema-aware consumer without touching the form-side code.

## Schema and Inferred Type

```ts
const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
});

type LoginValues = z.infer<typeof LoginSchema>; // never hand-write this separately
```

## Parsing

```ts
const result = LoginSchema.safeParse(raw);
if (!result.success) {
  // result.error.issues — structured, iterate for field-level messages
} else {
  result.data; // typed as LoginValues
}
```

Prefer `safeParse` over `parse` at any boundary where a failure is an
expected outcome to handle (form submission, API response) — reserve
`parse` (which throws) for cases where a failure is truly exceptional.

## Composing Schemas

```ts
const AddressSchema = z.object({ city: z.string(), zip: z.string() });
const CheckoutSchema = LoginSchema.extend({ address: AddressSchema });
```

Extract shared field schemas (`EmailSchema`, `PasswordSchema`) once and
reuse them across forms — don't repeat the same `.email()`/`.min(8)` rule
in every schema that needs an email or password field.

## Hard Rules

- Use `safeParse` at boundaries where invalid input is expected (forms, API responses); reserve `parse` for truly exceptional failures.
- Reuse field-level sub-schemas across forms instead of repeating the same validation rule.
- Prefer `z.infer` over a hand-written interface for any type that mirrors a schema.
