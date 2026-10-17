# Formik

Controlled field state: every keystroke updates form state and re-renders
subscribed fields. **Reference-only for existing code — not a recommended
choice for new forms** (see `forms/SKILL.md` — Choosing a Library):
maintenance has slowed, and its re-render-on-every-keystroke model degrades
noticeably past ~20 fields. Use this reference to work correctly within an
existing Formik codebase; for a new form, use `react-hook-form.md` instead.

## Setup with a Schema Adapter

Formik expects a Yup-shaped `validate`/`validationSchema` API natively;
other validators need an adapter (e.g. `zod-formik-adapter`):

```ts
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter'; // or use Yup directly, no adapter needed

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
type LoginValues = z.infer<typeof LoginSchema>;

const formik = useFormik<LoginValues>({
  initialValues: { email: '', password: '' },
  validationSchema: toFormikValidationSchema(LoginSchema),
  onSubmit: async (values) => { await AuthService.login(values); },
});
```

## Field Binding

```tsx
<input name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
{formik.touched.email && formik.errors.email && <span>{formik.errors.email}</span>}
```

Gate the error on `touched` — otherwise every field shows an error before
the user has interacted with it.

## Submission

```tsx
<form onSubmit={formik.handleSubmit}>
  <button disabled={formik.isSubmitting}>Submit</button>
</form>
```

## Hard Rules

- Always gate a field's error display on `formik.touched[field]`, not just `formik.errors[field]`.
- Don't introduce Formik into a project that doesn't already use it — prefer React Hook Form for new forms.
- If a form in an existing Formik codebase grows past ~20 fields and re-render cost becomes visible, that's a signal to migrate that form, not to add ad hoc memoization around it.
