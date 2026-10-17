# React Hook Form

Uncontrolled-by-default field state: inputs are read via refs, so typing
into one field does not re-render the rest of the form. Recommended default
for new projects (see `forms/SKILL.md` — Choosing a Library).

## Setup with a Schema Resolver

```ts
import { useForm } from 'react-hook-form';
// pick the resolver matching your validation library, e.g.:
import { zodResolver } from '@hookform/resolvers/zod';

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
type LoginValues = z.infer<typeof LoginSchema>;

const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
  resolver: zodResolver(LoginSchema),
  mode: 'onBlur', // validate on blur, not on every keystroke — see SKILL.md
});
```

`@hookform/resolvers` ships a resolver per validation library (`zod`,
`yup`, `joi`, `valibot`, or any Standard Schema-compliant one via the
generic `standardSchemaResolver`) — the form-side code above never changes
when swapping validators, only the resolver import and the schema file do.

## Field Registration

```tsx
<input {...register('email')} />
{errors.email && <span className="text-red-600">{errors.email.message}</span>}
```

`register` wires `onChange`/`onBlur`/`ref` in one call — don't hand-wire
those separately, it defeats the uncontrolled-input optimization.

## Submission

```ts
const onSubmit = async (values: LoginValues) => { await AuthService.login(values); };

<form onSubmit={handleSubmit(onSubmit)}>
  <button disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button>
</form>
```

`handleSubmit` runs validation first and only calls `onSubmit` if it
passes — never call your submit handler directly from the form's `onSubmit`.

## Controlled Fields (Third-Party Inputs)

A component that doesn't expose a plain DOM `ref` (a design-system
`<Select>`, a date picker) needs `Controller`, not `register`:

```tsx
<Controller
  name="country"
  control={control}
  render={({ field }) => <Select {...field} options={countries} />}
/>
```

## Hard Rules

- Use `register` for native/ref-forwarding inputs; `Controller` only for components that can't forward a ref.
- Always submit through `handleSubmit(onSubmit)` — never call the submit function directly from a form event.
- Keep the resolver import as the only library-specific line when swapping validators.
