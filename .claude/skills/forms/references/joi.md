# Joi

Object-schema validation predating both Zod and Yup, most common on the
Node/backend side (it doesn't infer TypeScript types from schemas the way
Zod/Yup/Valibot do — schema and type are declared separately). If a project
uses Joi for backend request validation, that's a reasonable reason to see
it in shared validation utilities, but it is **not a recommended choice for
a new React form** (see `forms/SKILL.md` — Choosing a Library): no built-in
TS inference and no first-class React form-library resolver, so pairing it
with React Hook Form/TanStack Form requires a hand-written adapter.

## Schema (Type Declared Separately)

```ts
import Joi from 'joi';

interface LoginValues { email: string; password: string; } // hand-written — Joi can't infer this

const LoginSchema = Joi.object<LoginValues>({
  email: Joi.string().email({ tlds: false }).required(),
  password: Joi.string().min(8).required(),
});
```

Because the type isn't inferred, schema and interface can silently drift —
this is the concrete cost of choosing Joi over an inference-capable
validator; keep them next to each other in the same file to reduce the risk.

## Validation

```ts
const { error, value } = LoginSchema.validate(raw, { abortEarly: false });
if (error) {
  // error.details — array of per-field ValidationErrorItem
}
```

## Hard Rules

- Keep the hand-written interface and the Joi schema for the same shape in the same file, immediately adjacent — Joi cannot catch drift between them for you.
- Pass `{ abortEarly: false }` for form validation, same reasoning as Yup.
- For a new form in a React codebase, prefer a schema library with TypeScript inference (Zod, Valibot) over Joi — reach for Joi only to match an existing backend-validation convention.
