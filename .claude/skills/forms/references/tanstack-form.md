# TanStack Form

Headless, framework-agnostic-core field state with the strongest TypeScript
inference of the field-state libraries — types flow from the form's default
values and validators without manual generics. Reach for it over React Hook
Form when per-field async validation with its own trigger/state is a hard
requirement, or bundle size is unusually critical (see `forms/SKILL.md` —
Choosing a Library). In Next.js App Router projects using Server Actions,
also consider **Conform**, which has first-class progressive-enhancement
support this library and React Hook Form don't — not covered here in
depth since it's a narrower, App-Router-specific fit.

## Setup with a Schema Validator

```ts
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter'; // one adapter package per validator

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

const form = useForm({
  defaultValues: { email: '', password: '' },
  onSubmit: async ({ value }) => { await AuthService.login(value); },
  validatorAdapter: zodValidator(),
});
```

## Per-Field Validators

Unlike React Hook Form's single form-wide validation mode, each field
declares its own validator and trigger — this is the library's main
differentiator, not incidental API surface:

```tsx
<form.Field
  name="email"
  validators={{ onBlur: LoginSchema.shape.email }}
  children={(field) => (
    <>
      <input
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.errors.length > 0 && <span>{field.state.meta.errors[0]}</span>}
    </>
  )}
/>
```

Pick the trigger (`onChange`/`onBlur`/`onSubmit`) per field intentionally —
a field with an expensive async validator (e.g. "is this username taken")
belongs on `onBlur` or a debounced `onChangeAsync`, not `onChange`.

## Submission

```tsx
<form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
  <form.Subscribe selector={(s) => s.isSubmitting}>
    {(isSubmitting) => <button disabled={isSubmitting}>Submit</button>}
  </form.Subscribe>
</form>
```

Read submission/render state through `form.Subscribe`, not by destructuring
`form.state` directly in the component body — that re-subscribes the whole
component to every state change instead of just the selected slice.

## Hard Rules

- Give every field its own validator/trigger deliberately — don't default every field to `onChange` just because that's the simplest to write.
- Read reactive form state through `form.Subscribe`/`useStore`, not by reading `form.state` directly in a render body.
- For an App-Router project with Server Actions as the primary submit path, evaluate Conform before defaulting here.
