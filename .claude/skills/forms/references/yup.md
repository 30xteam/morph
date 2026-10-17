# Yup

Chainable schema validation, predates Zod and remains common in existing
Formik codebases (it's Formik's native validation API, no adapter needed).
For a new project, prefer Zod or Valibot (see `forms/SKILL.md` — Choosing a
Library) — Yup's TypeScript inference is weaker and it does not implement
Standard Schema, so it's not swappable via a generic resolver.

## Schema and Inferred Type

```ts
import * as yup from 'yup';

const LoginSchema = yup.object({
  email: yup.string().email('Invalid email').required(),
  password: yup.string().min(8, 'At least 8 characters').required(),
});

type LoginValues = yup.InferType<typeof LoginSchema>;
```

## Parsing

```ts
try {
  const values = await LoginSchema.validate(raw, { abortEarly: false });
} catch (err) {
  if (err instanceof yup.ValidationError) {
    // err.inner — array of per-field errors when abortEarly: false
  }
}
```

Pass `{ abortEarly: false }` when you need every field's error at once (a
form) rather than just the first failure — the default stops at the first
error, which is wrong for form validation.

## With Formik (Native Integration)

```ts
useFormik({
  validationSchema: LoginSchema, // no adapter needed — Yup is Formik's native format
  // ...
});
```

## Hard Rules

- Always pass `{ abortEarly: false }` when validating a form — the default single-error behavior is wrong for that use case.
- Mark every field `.required()` explicitly — Yup fields are optional by default, the opposite of most schema libraries.
- Don't introduce Yup into a project that isn't already using Formik — prefer Zod for new schema-validation code.
