---
name: forms
description: >
  Use when building, reviewing, or choosing a library for a React form —
  field state, validation, submission handling, or error display. Trigger
  on tasks like "build a form", "add form validation", "which form library
  should I use", "add a login form", "this form re-renders too much", or
  "validate this input on submit". This skill is library-agnostic — it
  loads a `references/<library>.md` file for the concrete library the
  project uses (React Hook Form, Formik, TanStack Form; Zod, Yup, Joi,
  Valibot). Do NOT trigger for non-form state management — see the sibling
  `react-patterns` skill. Do NOT trigger for validating a non-form payload
  (API response, env var) — see `typescript`.
metadata:
  version: 1.0
  collection: noxen
---

# Noxen — Forms

Part of the **Noxen** skill set (a personal engineering standard for React +
TypeScript + Tailwind). This skill covers form patterns independent of which
form or validation library a project uses — load the matching
`references/*.md` for the concrete API of the library actually installed.

## Two Separate Concerns, Two Separate Choices

"Form library" bundles two orthogonal decisions — don't treat them as one:

1. **Field state management** — who owns input values, re-render behavior,
   controlled vs. uncontrolled. (React Hook Form, Formik, TanStack Form.)
2. **Schema validation** — how a shape is declared and validated at runtime.
   (Zod, Yup, Joi, Valibot.)

Any field-state library can pair with any schema library that exposes a
resolver/adapter for it — the pairing in a given project is a choice, not a
requirement of either library. When asked to "add form validation," check
which library is already installed in the project before assuming a
specific API — the pattern below stays the same, only the syntax differs.

## Load the Right Reference

| Concern | Reference |
|---|---|
| Project uses React Hook Form | `references/react-hook-form.md` |
| Project uses Formik | `references/formik.md` |
| Project uses TanStack Form | `references/tanstack-form.md` |
| Project uses Zod | `references/zod.md` |
| Project uses Yup | `references/yup.md` |
| Project uses Joi | `references/joi.md` |
| Project uses Valibot | `references/valibot.md` |
| Starting a new project, no library chosen yet | Read `## Choosing a Library` below, then the two references it points to |

Load only the reference(s) for the library actually in use — not all of them.

## Choosing a Library (New Projects)

**Field state** — default to **React Hook Form**: uncontrolled by default
(fewer re-renders), small bundle, the widest resolver ecosystem. Reach for
**TanStack Form** instead when per-field async validation with its own
trigger/state is a hard requirement, or bundle size is unusually critical.
Do not start a new project on **Formik** — see `references/formik.md` for
why it's reference-only, not a new-adoption recommendation.

**Schema validation** — default to **Zod**: largest ecosystem, most
resolver/adapter coverage, least integration risk. Reach for **Valibot**
when bundle size in a browser/edge bundle matters more than ecosystem size.
Both (along with Valibot's peers) implement **Standard Schema**, a shared
interface most field-state libraries' resolvers accept — prefer a
Standard-Schema-compliant validator so a future library swap doesn't force
a validation-layer rewrite too.

## Patterns That Hold Regardless of Library

**Schema is the single source of truth for the type.** Infer the form's
TypeScript type from the validation schema — never hand-write a parallel
`interface` for the same shape:

```ts
const LoginSchema = /* z.object({...}) or equivalent */;
type LoginValues = /* SchemaLib.infer<typeof LoginSchema> */;
```

Two independently-maintained definitions of the same shape drift; one
inferred from the other cannot.

**Validate on submit, not on every keystroke, by default.** Field-level
"as you type" validation is a deliberate UX choice for specific fields
(e.g. password strength), not a form-wide default — it adds re-renders and
noisy errors while the user is mid-typing a valid value.

**Errors render next to their field, from one place.** Whatever the
library's error-access API, read it in the field component that owns that
input — don't thread raw error objects through props to a shared error
banner unless the design explicitly calls for one.

**Submission is a three-state machine, not a boolean.** `idle` /
`submitting` (disable the submit control, don't hide the form) / `error`
(show the failure, keep the user's input intact — never clear the form on a
failed submit).

## Hard Rules

- Infer the form's TypeScript type from its validation schema — never maintain a hand-written duplicate.
- Default to validation on submit/blur, not on every keystroke, unless a specific field needs live feedback.
- Never clear form input on a failed submission — only on success.
- Load exactly one field-state reference and one validation reference per project — don't mix syntax examples from libraries the project doesn't use.
